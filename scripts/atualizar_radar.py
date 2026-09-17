from datetime import datetime,timezone,timedelta
from email.utils import parsedate_to_datetime
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request,urlopen
import json,os,re,xml.etree.ElementTree as ET
from urllib.parse import urlencode

# Agenda, consulta, consequência, localidade editorial e idioma da busca.
STREAMS={
 "Empresa em Pauta":("CEO empresa decisão estratégia expansão demissão aquisição","Operação e estratégia","Nacional","br"),
 "Empresa em Pauta — Brazil Journal":("site:braziljournal.com CEO empresa estratégia aquisição governança reestruturação","Operação e estratégia","Nacional","br"),
 "Empresa em Pauta — Exame":("site:exame.com negócios CEO empresa liderança estratégia trabalho","Operação e estratégia","Nacional","br"),
 "Empresa em Pauta — PEGN":("site:revistapegn.globo.com empresa empreendedor gestão pessoas crescimento","Operação e estratégia","Nacional","br"),
 "Empresa em Pauta — InfoMoney":("site:infomoney.com.br business empresas CEO estratégia gestão","Operação e estratégia","Nacional","br"),
 "Sinal setorial — Agência Sebrae":("site:agenciasebrae.com.br empresas gestão pessoas inovação dados economia","Operação e estratégia","Nacional","br"),
 "Poder e regras":("projeto de lei regulamentação fiscalização empresas trabalho Câmara Senado","Risco jurídico/regulatório","Federal","br"),
 "Poder e regras — Senado oficial":("site:www12.senado.leg.br/noticias/materias empresas lei sancionada regulamentação data centers","Risco jurídico/regulatório","Federal","br"),
 "Poder e regras — Câmara oficial":("site:camara.leg.br/noticias empresas projeto de lei regulamentação trabalho tributação","Risco jurídico/regulatório","Federal","br"),
 "Poder e regras — Planalto oficial":("site:gov.br/planalto empresas lei decreto regulamentação sanção","Risco jurídico/regulatório","Federal","br"),
 "Poder e regras — MTE oficial":("site:gov.br/trabalho-e-emprego empresas trabalho fiscalização norma regulamentadora","Risco jurídico/regulatório","Federal","br"),
 "Poder e regras — reguladores":("site:gov.br empresas Banco Central Receita Federal Cade CVM regulamentação","Risco jurídico/regulatório","Federal","br"),
 "Relações internacionais — Itamaraty oficial":("site:gov.br/mre empresas comércio exterior acordo embaixada exportação","Mercado e reputação","Internacional","br"),
 "Poder e regras — municipal":("prefeitura câmara municipal alvará ISS licenciamento empresas","Risco jurídico/regulatório","Municipal","br"),
 "Poder e regras — estadual":("governo estadual ICMS licenciamento empresas regulamentação","Risco jurídico/regulatório","Estadual","br"),
 "Mercado e trabalho":("empresas mercado emprego investimento juros Brasil","Custo e caixa","Nacional","br"),
 "Relações internacionais":("Itamaraty diplomacia embaixada acordo comercial exportação importação empresas Brasil","Mercado e reputação","Internacional","br"),
 "Trabalho e representação":("sindicato convenção coletiva greve negociação empresas","Pessoas e trabalho","Nacional","br"),
 "Pessoas e liderança":("liderança gestão pessoas saúde mental trabalho empresas","Pessoas e trabalho","Nacional","br"),
 "NR-1 / AEP":("NR-1 AEP riscos psicossociais empresas","Risco jurídico/regulatório","Nacional","br"),
 "IA e gestão":("inteligência artificial gestão empresas trabalho","Operação e estratégia","Nacional","br"),
 "Mundo corporativo internacional":("CEO company culture workplace leadership business","Pessoas e trabalho","Internacional","us"),
 "Mídia, audiovisual e plataformas":("Netflix Disney Warner Globo SBT Record streaming televisão cinema CEO reestruturação demissões IA publicidade assinaturas","Operação e estratégia","Nacional","br")
}
HEADERS={"User-Agent":"Mozilla/5.0 (BastidorGestaoEmPauta/1.0)"}

def clean(t): return re.sub(r"<[^>]+>","",unescape(t or "")).strip()
def d(v):
 try: return parsedate_to_datetime(v).date().isoformat()
 except: return datetime.now(timezone.utc).date().isoformat()

GENERIC_TITLES={"notícias","últimas notícias","senado notícias","câmara notícias","camara notícias","home","início","inicio","notícias - senado","news"}
def is_article(item):
 title=item["title"].strip()
 source=item["source"].strip()
 base=re.sub(r"\s*[-–—]\s*"+re.escape(source)+r"\s*$","",title,flags=re.I).strip().lower()
 if base in GENERIC_TITLES or len(base)<24:return False
 if base==source.lower() or base.endswith("notícias"):return False
 return True

def feed(q,n=4,locale="br"):
 suffix="&hl=en-US&gl=US&ceid=US:en" if locale=="us" else "&hl=pt-BR&gl=BR&ceid=BR:pt-419"
 u="https://news.google.com/rss/search?q="+quote(q+" when:14d")+suffix
 try: r=ET.fromstring(urlopen(Request(u,headers=HEADERS),timeout=30).read())
 except Exception as e:
  print("falha",e); return []
 items=[{"title":clean(i.findtext("title")),"source":clean(i.findtext("source")) or "Google Notícias","date":d(i.findtext("pubDate")or""),"url":i.findtext("link")} for i in r.findall("./channel/item")[:n] if i.findtext("title") and i.findtext("link")]
 return [item for item in items if is_article(item)]

def origin(t,locale):
 c=feed('"'+t+'"',5,locale)
 return {"found":bool(c),**(min(c,key=lambda x:x["date"]) if c else {})}

OFFICIAL_SOURCES=("senado","câmara","camara","planalto","ministério","ministerio","itamaraty","diário oficial","tribunal","trt","tst","stf","mte","mpt","receita federal","banco central","ibge","prefeitura","governo do estado","assembleia legislativa","câmara municipal","camara municipal")

def safety(x):
 text=(x["title"]+" "+x["source"]).lower()
 source=x["source"].lower()
 alert="Não reproduzir texto, imagem, vídeo, tabela ou infográfico de terceiro."
 if any(k in text for k in["sigilo","vazamento","dados pessoais","segredo","confidencial"]):
  return {"label":"Não usar sem revisão humana.","alert":"Possível sigilo, dado pessoal ou informação sensível."},"Exige confirmação"
 if any(k in source for k in OFFICIAL_SOURCES):
  return {"label":"Analisar o ato ou documento original; usar redação própria.","alert":alert},"Documento/ato oficial"
 if any(k in source for k in["sindicato","associação","partido","federação","confederação","sebrae"]):
  return {"label":"Tratar como fonte interessada; buscar documento ou contraponto.","alert":alert},"Fonte institucional"
 return {"label":"Noticiar com redação própria e citar a fonte.","alert":alert},"Repercussão jornalística"

def audience_for(agenda):
 base={
  "Empresa em Pauta":{"public":"CEOs, donos de empresa, diretores de operação e RH.","interest":"Entender uma decisão concreta de liderança e o que ela revela sobre estratégia, cultura ou execução.","search":"decisão de CEO; estratégia empresarial; gestão de empresas","sensation":"Curiosidade e recompensa"},
  "Poder e regras":{"public":"Empresários, jurídico, financeiro, RH e gestores do setor potencialmente afetado.","interest":"Antecipar custo, obrigação, risco ou mudança operacional.","search":"nova regra para empresas; impacto de projeto de lei; regulamentação empresarial","sensation":"Segurança e liberdade"},
  "Mercado e trabalho":{"public":"Donos de empresas, diretoria financeira, operações e RH.","interest":"Identificar efeitos sobre caixa, contratação, preço, investimento ou planejamento.","search":"mercado brasileiro empresas; custo empresarial; emprego e empresas","sensation":"Segurança e curiosidade"},
  "Relações internacionais":{"public":"Lideranças de empresas exportadoras, importadoras e negócios expostos ao mercado externo.","interest":"Entender efeito comercial, reputacional ou regulatório de relações internacionais.","search":"relações internacionais empresas brasileiras; acordo comercial impacto empresas","sensation":"Segurança e curiosidade"},
  "Trabalho e representação":{"public":"RH, jurídico trabalhista, operações e lideranças de equipes.","interest":"Entender negociação coletiva, mobilização de trabalhadores e seus efeitos na operação.","search":"convenção coletiva empresas; sindicato negociação empresas","sensation":"Segurança e pertencimento"},
  "Pessoas e liderança":{"public":"Lideranças, RH, Business Partners e donos de empresas.","interest":"Transformar um fato em decisão sobre pessoas, cultura e gestão.","search":"liderança nas empresas; gestão de pessoas; cultura organizacional","sensation":"Pertencimento e segurança"},
  "NR-1 / AEP":{"public":"Empresários, RH, SST, jurídico e lideranças responsáveis por gestão de riscos.","interest":"Reduzir risco e entender o que precisa ser diagnosticado, gerenciado ou acompanhado.","search":"NR-1 empresas; riscos psicossociais; AEP","sensation":"Segurança"},
  "IA e gestão":{"public":"CEOs, operações, RH e gestores de inovação.","interest":"Avaliar produtividade, impacto humano, governança e adoção responsável.","search":"IA para empresas; inteligência artificial gestão; IA e trabalho","sensation":"Curiosidade e recompensa"},
  "Mundo corporativo internacional":{"public":"Lideranças, RH e empresas que acompanham tendências globais.","interest":"Comparar práticas internacionais sem importar soluções fora de contexto.","search":"corporate leadership trends; workplace culture; gestão internacional","sensation":"Curiosidade e recompensa"}
 }
 return base.get(agenda,base["Pessoas e liderança"])

def packaging_for(agenda,impact):
 base={"opening":"A notícia de hoje traz um fato que merece atenção de empresas. A pergunta não é apenas o que aconteceu, mas qual decisão de gestão esse cenário exige.","promise":"Entenda o fato, o que precisa ser confirmado e a consequência empresarial que está em jogo.","thumbnail":"O QUE MUDA PARA A EMPRESA?","description":"Gestão em Pauta analisa uma notícia corporativa com foco em liderança, pessoas e consequência empresarial. Fato, contexto e decisão.","keywords":"gestão empresarial, liderança, desenvolvimento humano, empresas"}
 if agenda=="Poder e regras": base.update({"opening":"Uma regra ou decisão pública pode alterar a rotina de empresas antes mesmo de virar uma cobrança.","thumbnail":"NOVA REGRA: O QUE MUDA?"})
 elif agenda=="Empresa em Pauta": base.update({"opening":"Uma decisão de liderança ganhou manchete. O ponto é entender o que ela revela sobre gestão, e não apenas acompanhar o anúncio.","thumbnail":"DECISÃO DE CEO"})
 elif impact=="Custo e caixa": base.update({"opening":"Este fato pode chegar ao caixa antes de aparecer nos relatórios. A questão é onde a empresa será pressionada.","thumbnail":"IMPACTO NO CAIXA"})
 return base

OPENAI_API_KEY=os.environ.get("OPENAI_API_KEY","")
MAX_AI_ANALYSES=5
MAX_ARTICLE_CHARS=24000

class BodyExtractor(HTMLParser):
 def __init__(self):
  super().__init__();self.parts=[];self.capture=False;self.skip=0
 def handle_starttag(self,tag,attrs):
  if tag in ("script","style","noscript","svg","nav","footer","header","form","aside"):self.skip+=1
  if not self.skip and tag in ("p","li","h1","h2","h3","blockquote"):self.capture=True
 def handle_endtag(self,tag):
  if tag in ("script","style","noscript","svg","nav","footer","header","form","aside") and self.skip:self.skip-=1
  if tag in ("p","li","h1","h2","h3","blockquote"):self.capture=False
 def handle_data(self,data):
  text=" ".join(data.split())
  if self.capture and not self.skip and len(text)>20:self.parts.append(text)

def extract_article_body(url):
 try:
  request=Request(url,headers={**HEADERS,"Accept":"text/html,application/xhtml+xml"})
  with urlopen(request,timeout=25) as response:
   final_url=response.geturl();mime=response.headers.get_content_type();raw=response.read(800000)
  if mime not in ("text/html","application/xhtml+xml"):return None,final_url,"A fonte não entregou uma página de artigo em HTML."
  parser=BodyExtractor();parser.feed(raw.decode("utf-8","ignore"))
  blocked=("cookies","privacidade","assine","subscribe","publicidade","javascript")
  paragraphs=[];seen=set()
  for part in parser.parts:
   normalized=" ".join(part.split());key=normalized.lower()
   if key in seen or any(word in key for word in blocked) or len(normalized)<45:continue
   seen.add(key);paragraphs.append(normalized)
  body="\n".join(paragraphs)
  if len(body)<700:return None,final_url,"O corpo acessível da matéria não trouxe texto suficiente para análise confiável."
  return body[:MAX_ARTICLE_CHARS],final_url,None
 except Exception as error:return None,url,f"Não foi possível obter o corpo da fonte ({type(error).__name__})."

def response_text(payload):
 chunks=[]
 for output in payload.get("output",[]):
  for content in output.get("content",[]):
   if isinstance(content.get("text"),str):chunks.append(content["text"])
 return "\n".join(chunks) or str(payload.get("output_text",""))

def json_answer(text):
 text=(text or "").strip();start,end=text.find("{"),text.rfind("}")
 if start<0 or end<start:raise ValueError("A resposta não veio em JSON.")
 return json.loads(text[start:end+1])

def analyze_article(item,body,final_url):
 instructions="""Você é analista editorial do programa brasileiro Gestão em Pauta, do GEB - Grupo Eduarda Bispo. Use exclusivamente o CORPO DA MATÉRIA recebido. Não complete lacunas com conhecimento externo, título, suposição ou opinião. Se o corpo não sustentar uma afirmação, diga que não é possível afirmar. Não reproduza trechos longos nem texto da fonte. Não dê aconselhamento jurídico.
Retorne SOMENTE JSON válido com estas chaves: factual_summary; facts_confirmed (lista de até 4 fatos); source_statements (lista de até 2 declarações atribuídas); relevance (verdict: GRAVAR AGORA, ACOMPANHAR ou NÃO PRIORITÁRIA; reason); editorial (headline, angle, speaking_preview de até 120 palavras, audience, search_intent separado por ponto e vírgula, hashtags de até 6); caution."""
 user=f"""METADADOS PARA ORGANIZAÇÃO, NÃO COMO PROVA: agenda={item.get('agenda')}; consequência={item.get('impact')}; abrangência={item.get('scope')}.
URL final acessada: {final_url}
CORPO DA MATÉRIA:
{body}"""
 payload={"model":"gpt-5.6-terra","input":[{"role":"developer","content":instructions},{"role":"user","content":user}],"max_output_tokens":1200}
 request=Request("https://api.openai.com/v1/responses",data=json.dumps(payload).encode("utf-8"),headers={"Authorization":"Bearer "+OPENAI_API_KEY,"Content-Type":"application/json"},method="POST")
 try:
  with urlopen(request,timeout=60) as response:data=json.loads(response.read().decode("utf-8"))
  return {"status":"analisado","sourceUrl":final_url,"bodyCharacters":len(body),**json_answer(response_text(data))}
 except Exception as error:
  print("falha IA",item.get("title","")[:80],type(error).__name__)
  return {"status":"revisao_manual","reason":"A análise automática não ficou disponível nesta execução. Abra a fonte e valide o corpo manualmente."}

def analyze_by_source_lookup(item,reason):
 instructions="""Você é analista editorial do programa brasileiro Gestão em Pauta, do GEB - Grupo Eduarda Bispo. Use a ferramenta de pesquisa somente para localizar a publicação ORIGINAL correspondente ao título e à fonte informados. Leia o conteúdo da fonte original ou do documento oficial vinculado; não trate réplica, comentário ou título como prova. Se não localizar ou não conseguir acessar essa publicação, responda exatamente {\"manual_review\":true,\"reason\":\"...\"}. Não complete lacunas com conhecimento externo, suposição ou opinião e não reproduza trechos longos.
Se acessar a publicação original, retorne SOMENTE JSON válido com as chaves: factual_summary; facts_confirmed (lista de até 4 fatos); source_statements (lista de até 2 declarações atribuídas); relevance (verdict: GRAVAR AGORA, ACOMPANHAR ou NÃO PRIORITÁRIA; reason); editorial (headline, angle, speaking_preview de até 120 palavras, audience, search_intent separado por ponto e vírgula, hashtags de até 6); caution; canonical_url."""
 user=f"""Título: {item.get('title')}
Fonte informada pelo radar: {item.get('source')}
Link do radar: {item.get('url')}
Motivo pelo qual a extração direta não bastou: {reason}"""
 payload={"model":"gpt-5.6-terra","tools":[{"type":"web_search"}],"input":[{"role":"developer","content":instructions},{"role":"user","content":user}],"max_output_tokens":1200}
 request=Request("https://api.openai.com/v1/responses",data=json.dumps(payload).encode("utf-8"),headers={"Authorization":"Bearer "+OPENAI_API_KEY,"Content-Type":"application/json"},method="POST")
 try:
  with urlopen(request,timeout=90) as response:data=json.loads(response.read().decode("utf-8"))
  answer=json_answer(response_text(data))
  if answer.get("manual_review"):return {"status":"revisao_manual","reason":answer.get("reason","A publicação original não ficou acessível para validação.")}
  return {"status":"analisado_por_busca","sourceUrl":answer.get("canonical_url",""),"bodyCharacters":0,**answer}
 except Exception as error:
  print("falha IA web",item.get("title","")[:80],type(error).__name__)
  return {"status":"revisao_manual","reason":"A publicação original não ficou acessível para validação nesta execução."}

def apply_body_analysis(items):
 if not OPENAI_API_KEY:
  print("OPENAI_API_KEY ausente; análise de corpo não executada.");return
 candidates=sorted(items,key=lambda x:(x.get("score",0),x.get("date","")),reverse=True)[:MAX_AI_ANALYSES]
 for item in candidates:
  body,final_url,reason=extract_article_body(item.get("url",""))
  if not body:
   item["bodyAnalysis"]=analyze_by_source_lookup(item,reason or "Corpo indisponível para análise.");continue
  analysis=analyze_article(item,body,final_url);item["bodyAnalysis"]=analysis
  if analysis.get("status","").startswith("analisado"):
   editorial=analysis.get("editorial",{})
   item["summary"]=analysis.get("factual_summary") or item["summary"]
   item["angle"]=editorial.get("angle") or item["angle"]
   defaults=audience_for(item["agenda"])
   item["audience"]={"public":editorial.get("audience") or defaults["public"],"interest":analysis.get("relevance",{}).get("reason") or defaults["interest"],"search":editorial.get("search_intent") or defaults["search"],"sensation":defaults["sensation"]}
   item["packaging"]={**packaging_for(item["agenda"],item["impact"]),"opening":editorial.get("angle") or packaging_for(item["agenda"],item["impact"])["opening"],"thumbnail":editorial.get("headline") or packaging_for(item["agenda"],item["impact"])["thumbnail"],"keywords":editorial.get("search_intent") or packaging_for(item["agenda"],item["impact"])["keywords"],"hashtags":editorial.get("hashtags","")}

YOUTUBE_API_KEY=os.environ.get("YOUTUBE_API_KEY","")
INSTITUTIONAL_CHANNELS=("tv senado","senado federal","câmara dos deputados","camara dos deputados","tv câmara","tv camara","govbr","ministério do trabalho e emprego","ministerio do trabalho e emprego","itamaraty","banco central do brasil","receita federal","mte")
CORPORATE_WORDS=("oficial","investor","relações com investidores","relacoes com investidores","ri ","b3","sebrae","cni","fecomércio","fecomercio","blackrock","coca-cola","cargill","mcdonald","netflix","disney","warner","globo","sbt","record","amazon","meta")
JOURNALISTIC_WORDS=("valor","exame","infomoney","bloomberg","cnn","globo news","band news","record news","bbc","reuters","estadao","folha","veja","cnbc")
def agenda_for_stream(stream):
 return "Empresa em Pauta" if stream.startswith("Empresa em Pauta") else ("Mercado e trabalho" if stream.startswith("Sinal setorial") else ("Poder e regras" if stream.startswith("Poder e regras") else ("Relações internacionais" if stream.startswith("Relações internacionais") else stream)))
def duration_label(v):
 m=re.fullmatch(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?",v or "")
 if not m:return "Duração não informada"
 h,mi,se=[int(x or 0) for x in m.groups()]
 return (f"{h}h " if h else "")+(f"{mi}min " if mi else "")+f"{se}s"
def channel_classification(channel):
 name=(channel or "").lower()
 if any(k in name for k in INSTITUTIONAL_CHANNELS):return "Canal institucional - validar","Fonte institucional"
 if any(k in name for k in CORPORATE_WORDS):return "Canal corporativo - validar","Fonte institucional"
 if any(k in name for k in JOURNALISTIC_WORDS):return "Canal jornalístico - validar","Repercussão jornalística"
 return "Canal de análise ou origem a validar","Exige confirmação"
def youtube_videos():
 if not YOUTUBE_API_KEY:
  print("YOUTUBE_API_KEY ausente; radar de vídeos não atualizado.")
  return []
 since=((datetime.now(timezone.utc)-timedelta(days=14)).replace(hour=0,minute=0,second=0,microsecond=0)).isoformat().replace("+00:00","Z")
 found=[]; seen_video=set()
 for stream,(query,impact,scope,locale) in STREAMS.items():
  params={"part":"snippet","type":"video","order":"date","maxResults":3,"q":query,"publishedAfter":since,"key":YOUTUBE_API_KEY,"relevanceLanguage":"pt" if locale=="br" else "en"}
  try:
   data=json.loads(urlopen(Request("https://www.googleapis.com/youtube/v3/search?"+urlencode(params),headers=HEADERS),timeout=30).read())
  except Exception as e:
   print("falha YouTube",stream,e);continue
  for result in data.get("items",[]):
   video_id=result.get("id",{}).get("videoId")
   snippet=result.get("snippet",{})
   if not video_id or video_id in seen_video:continue
   seen_video.add(video_id)
   agenda=agenda_for_stream(stream); channel=snippet.get("channelTitle","Canal não identificado")
   channel_type,evidence=channel_classification(channel)
   score=3+(3 if agenda=="Empresa em Pauta" else 0)+(3 if evidence=="Fonte institucional" else 0)+(2 if impact in["Custo e caixa","Risco jurídico/regulatório"] else 0)
   found.append({"id":"yt-"+video_id,"videoId":video_id,"title":snippet.get("title","Vídeo sem título"),"source":channel,"channelId":snippet.get("channelId",""),"date":snippet.get("publishedAt","")[:10],"url":"https://www.youtube.com/watch?v="+video_id,"agenda":agenda,"impact":impact,"scope":scope,"territory":"Confirmar na fonte" if scope in ["Municipal","Estadual"] else ("Brasil" if scope in ["Federal","Nacional"] else "Internacional"),"evidence":evidence,"sourceType":channel_type,"score":score,"summary":"Vídeo localizado no YouTube. Confira o canal e assista ao conteúdo antes de usar qualquer declaração como fonte.","angle":"Verificar se o vídeo confirma uma declaração, apresenta análise ou apenas repercute o tema. Não usar título, corte ou comentário como prova do fato.","query":query,"duration":"Duração em atualização","use":{"label":"Usar apenas após assistir ao conteúdo e identificar o tipo de canal.","alert":"Não reproduzir vídeo, trecho, transcrição, imagem ou miniatura de terceiro sem autorização."}})
 ids=[x["videoId"] for x in found]
 durations={}
 for i in range(0,len(ids),50):
  try:
   data=json.loads(urlopen(Request("https://www.googleapis.com/youtube/v3/videos?"+urlencode({"part":"contentDetails","id":",".join(ids[i:i+50]),"key":YOUTUBE_API_KEY}),headers=HEADERS),timeout=30).read())
   durations.update({x["id"]:duration_label(x.get("contentDetails",{}).get("duration","")) for x in data.get("items",[])})
  except Exception as e:print("falha duração YouTube",e)
 for x in found:x["duration"]=durations.get(x["videoId"],x["duration"])
 return sorted(found,key=lambda x:(x["score"],x["date"]),reverse=True)

items=[]; seen=set()
for stream,(query,impact,scope,locale) in STREAMS.items():
 for x in feed(query,4,locale):
  key=(x["title"]+x["source"]).lower()
  if key in seen: continue
  seen.add(key)
  use,evidence=safety(x)
  score=3+(3 if stream=="Empresa em Pauta" else 0)+(3 if evidence=="Documento/ato oficial" else 0)+(2 if impact in["Custo e caixa","Risco jurídico/regulatório"] else 0)
  local=(" Para pauta municipal ou estadual, confirmar o território, o ato aplicável, as empresas/setores afetados e se o efeito é local ou pode se repetir em outros lugares." if scope in ["Municipal","Estadual"] else "")
  compare=(" Para pauta internacional, acrescentar: qual prática, contexto regulatório ou cultura corporativa pode ser comparada ao Brasil — sem presumir equivalência." if scope=="Internacional" else "")
  items.append({
   "id":re.sub(r"[^a-z0-9]+","-",key)[:90],
   "agenda":"Empresa em Pauta" if stream.startswith("Empresa em Pauta") else ("Mercado e trabalho" if stream.startswith("Sinal setorial") else ("Poder e regras" if stream.startswith("Poder e regras") else ("Relações internacionais" if stream.startswith("Relações internacionais") else stream))),
   "impact":impact,"scope":scope,
   "territory":"Confirmar na fonte" if scope in ["Municipal","Estadual"] else ("Brasil" if scope in ["Federal","Nacional"] else "Internacional"),
   "evidence":evidence,"sourceType":"Fonte jornalística ou institucional — confirmar origem","score":score,**x,
   "summary":"Notícia coletada para triagem. Abra a fonte e valide o fato antes de transformá-lo em análise.",
   "angle":f"O que este fato pode mudar para empresas em {impact.lower()}? Separar fato confirmado, declaração da fonte e consequência gerencial antes de gravar."+local+compare,
   "origin":origin(x["title"],locale),"audience":audience_for("Empresa em Pauta" if stream.startswith("Empresa em Pauta") else ("Mercado e trabalho" if stream.startswith("Sinal setorial") else ("Poder e regras" if stream.startswith("Poder e regras") else ("Relações internacionais" if stream.startswith("Relações internacionais") else stream)))),"packaging":packaging_for("Empresa em Pauta" if stream.startswith("Empresa em Pauta") else ("Mercado e trabalho" if stream.startswith("Sinal setorial") else ("Poder e regras" if stream.startswith("Poder e regras") else ("Relações internacionais" if stream.startswith("Relações internacionais") else stream))),impact),"use":use
  })
items.sort(key=lambda x:(x["score"],x["date"]),reverse=True)
apply_body_analysis(items)
Path("data/news.json").write_text(json.dumps({"updatedAt":datetime.now(timezone.utc).date().isoformat(),"items":items},ensure_ascii=False,indent=2),encoding="utf-8")
videos=youtube_videos()
Path("data/videos.json").write_text(json.dumps({"updatedAt":datetime.now(timezone.utc).date().isoformat(),"items":videos},ensure_ascii=False,indent=2),encoding="utf-8")
