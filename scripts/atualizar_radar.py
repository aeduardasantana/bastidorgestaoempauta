from datetime import datetime,timezone,timedelta
from zoneinfo import ZoneInfo
from email.utils import parsedate_to_datetime
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import parse_qsl,quote,urlencode,urlsplit,urlunsplit
from urllib.request import Request,urlopen
import json,os,re,unicodedata,xml.etree.ElementTree as ET
# Disparo manual de atualização: 2026-11-09

# Agenda, consulta, consequência, localidade editorial e idioma da busca.
STREAMS={
 "Empresa em Pauta — decisões":("empresa CEO anuncia investimento expansão reestruturação demissão aquisição fusão fechamento sucessão","Operação e estratégia","Nacional","br"),
 "Empresa em Pauta — Brazil Journal":("site:braziljournal.com empresa CEO aquisição fusão sucessão reestruturação investimento","Operação e estratégia","Nacional","br"),
 "Empresa em Pauta — Exame":("site:exame.com/negocios empresa investe fábrica expansão demissão aquisição CEO","Operação e estratégia","Nacional","br"),
 "Empresa em Pauta — InfoMoney":("site:infomoney.com.br/business empresa aquisição incorporação reestruturação expansão CEO","Operação e estratégia","Nacional","br"),
 "Empresa em Pauta — PEGN":("site:revistapegn.globo.com empresa expansão sucessão franquia contratação gestão equipe","Operação e estratégia","Nacional","br"),
 "Veículos BR — Valor":("site:valor.globo.com/empresas empresa investimento aquisição expansão reestruturação CEO produção logística","Operação e estratégia","Nacional","br"),
 "Veículos BR — NeoFeed e Bloomberg Línea":("(site:neofeed.com.br OR site:bloomberglinea.com.br) empresa investimento aquisição expansão reestruturação tecnologia CEO","Operação e estratégia","Nacional","br"),
 "Veículos BR — G1, CNN e UOL":("(site:g1.globo.com OR site:cnnbrasil.com.br OR site:economia.uol.com.br) empresa investimento aquisição expansão fechamento demissão contratação regulamentação","Operação e estratégia","Nacional","br"),
 "Veículos BR — Estadão, Folha e O Globo":("(site:estadao.com.br OR site:folha.uol.com.br/mercado OR site:oglobo.globo.com/economia) empresa investimento fusão aquisição reestruturação produção trabalho","Operação e estratégia","Nacional","br"),
 "Veículos BR — Agência Brasil":("site:agenciabrasil.ebc.com.br empresa economia trabalho regulamentação investimento produção exportação","Risco jurídico/regulatório","Nacional","br"),
 "Veículos BR — Band, SBT, Record e Jovem Pan":("(site:band.uol.com.br OR site:sbtnews.sbt.com.br OR site:noticias.r7.com OR site:jovempan.com.br) empresa economia investimento trabalho regulamentação","Operação e estratégia","Nacional","br"),
 "Veículos regionais — Centro-Oeste":("(site:opopular.com.br OR site:correiodoestado.com.br OR site:campograndenews.com.br OR site:midiamax.uol.com.br OR site:olhardireto.com.br) empresa investimento fábrica expansão fechamento demissão contratação sindicato licenciamento recuperação judicial aquisição","Operação e estratégia","Estadual","br"),
 "Veículos regionais — Sul":("(site:gazetadopovo.com.br OR site:clicrbs.com.br OR site:nsctotal.com.br OR site:gauchazh.clicrbs.com.br) empresa investimento fábrica expansão fechamento demissão contratação aquisição recuperação judicial","Operação e estratégia","Estadual","br"),
 "Veículos regionais — Sudeste":("(site:otempo.com.br OR site:em.com.br OR site:atribuna.com.br OR site:diariodaregiao.com.br) empresa investimento fábrica expansão fechamento demissão contratação aquisição recuperação judicial","Operação e estratégia","Estadual","br"),
 "Veículos regionais — Norte e Nordeste":("(site:diariodonordeste.verdesmares.com.br OR site:jornaldocommercio.com OR site:atarde.com.br OR site:correio24horas.com.br OR site:oliberal.com OR site:d24am.com) empresa investimento fábrica expansão fechamento demissão contratação aquisição recuperação judicial","Operação e estratégia","Estadual","br"),
 "Fontes internacionais — Reuters, Bloomberg e CNBC":("(Reuters OR Bloomberg OR CNBC) company investment acquisition merger expansion restructuring layoffs CEO Brazil","Operação e estratégia","Internacional","us"),
 "Fontes internacionais — FT e WSJ":("(Financial Times OR Wall Street Journal) company earnings guidance acquisition restructuring supply chain Brazil","Custo e caixa","Internacional","us"),
 "Fontes internacionais — AP, BBC e CNN Business":("(Associated Press OR BBC Business OR CNN Business) company investment layoffs hiring regulation automation Brazil","Operação e estratégia","Internacional","us"),
 "Empresas globais — newsrooms e RI em português":("empresa global Brasil newsroom relações com investidores comunicado investimento fábrica produção logística expansão reestruturação","Operação e estratégia","Nacional","br"),
 "Empresas globais — newsrooms e RI em inglês":("global company Brazil newsroom investor relations press release investment factory production supply chain expansion restructuring","Operação e estratégia","Internacional","us"),
 "Sinais empresariais — capital e governança":("empresa aporte investimento fusão aquisição mudança CEO resultados guidance ações crédito juros tributação tarifas","Custo e caixa","Nacional","br"),
 "Sinais empresariais — operação e trabalho":("empresa expansão fechamento reestruturação demissões contratações jornada greve negociação coletiva produtividade fábrica produção logística cadeia de suprimentos","Pessoas e trabalho","Nacional","br"),
 "Sinais empresariais — tecnologia, regra e responsabilização":("empresa automação inteligência artificial regulamentação investigação multa decisão judicial importação exportação","Risco jurídico/regulatório","Nacional","br"),
 "Business signals — capital and governance":("company funding investment merger acquisition CEO change earnings guidance shares credit interest rates taxes tariffs Brazil","Custo e caixa","Internacional","us"),
 "Business signals — operations and workforce":("company expansion closure restructuring layoffs hiring working hours strike collective bargaining productivity factory production logistics supply chain Brazil","Pessoas e trabalho","Internacional","us"),
 "Business signals — technology and regulation":("company automation artificial intelligence regulation investigation fine court ruling imports exports Brazil","Risco jurídico/regulatório","Internacional","us"),
 "Poder e regras — trabalho":("projeto lei empresas empregadores trabalho salário saúde mental qualificação Câmara Senado","Risco jurídico/regulatório","Federal","br"),
 "Poder e regras — Senado oficial":("site:www12.senado.leg.br/noticias/materias empresas trabalho emprego qualificação saúde mental regulamentação","Risco jurídico/regulatório","Federal","br"),
 "Poder e regras — Câmara oficial":("site:camara.leg.br/noticias empresas trabalho emprego piso salarial saúde mental regulamentação","Risco jurídico/regulatório","Federal","br"),
 "Poder e regras — Planalto oficial":("site:gov.br/planalto empresas lei decreto regulamentação sanção","Risco jurídico/regulatório","Federal","br"),
 "Poder e regras — MTE oficial":("site:gov.br/trabalho-e-emprego empresas trabalho fiscalização norma regulamentadora","Risco jurídico/regulatório","Federal","br"),
 "Poder e regras — reguladores":("site:gov.br empresas Banco Central Receita Federal Cade CVM regulamentação","Risco jurídico/regulatório","Federal","br"),
 "Diários oficiais — União":("(site:in.gov.br OR site:gov.br/imprensanacional) empresa edital portaria resolução decreto autorização concessão sanção licença multa contrato nomeação intervenção recuperação","Risco jurídico/regulatório","Federal","br"),
 "Diários oficiais — estados":("(\"diário oficial\" OR \"diario oficial\") empresa edital licença ambiental concessão autorização contrato incentivo fiscal indústria comércio trabalho","Risco jurídico/regulatório","Estadual","br"),
 "Juntas comerciais e registro empresarial":("(junta comercial OR juceg OR jucesp OR jucemg OR jucepar OR jucisrs) empresa constituição transformação incorporação fusão cisão dissolução filial capital administrador","Operação e estratégia","Estadual","br"),
 "Registro empresarial e cartórios":("(cartório OR registro de imóveis OR registro civil de pessoas jurídicas OR protesto) empresa aquisição imóvel industrial garantia alienação recuperação judicial falência incorporação empreendimento","Operação e estratégia","Estadual","br"),
 "Judiciário empresarial":("(site:jus.br OR site:trf1.jus.br OR site:trf2.jus.br OR site:trf3.jus.br OR site:trf4.jus.br OR site:trf5.jus.br OR site:stj.jus.br) empresa recuperação judicial falência grupo econômico concorrência contrato trabalho assédio indenização","Risco jurídico/regulatório","Nacional","br"),
 "Relações internacionais — Itamaraty oficial":("site:gov.br/mre empresas comércio exterior acordo embaixada exportação","Mercado e reputação","Internacional","br"),
 "Poder e regras — municipal":("prefeitura câmara municipal alvará ISS licenciamento empresas","Risco jurídico/regulatório","Municipal","br"),
 "Poder e regras — estadual":("governo estadual ICMS licenciamento empresas regulamentação","Risco jurídico/regulatório","Estadual","br"),
 "Mercado e trabalho":("empresa juros corta custos adia investimento reduz contratações reestrutura operação Brasil","Custo e caixa","Nacional","br"),
 "Relações internacionais":("Itamaraty diplomacia embaixada acordo comercial exportação importação empresas Brasil","Mercado e reputação","Internacional","br"),
 "Trabalho e representação":("sindicato convenção coletiva greve negociação empresas","Pessoas e trabalho","Nacional","br"),
 "Pessoas e liderança":("empresa liderança saúde mental trabalho cultura rotatividade afastamento sobrecarga mudança","Pessoas e trabalho","Nacional","br"),
 "NR-1 / AEP":("NR-1 AEP riscos psicossociais empresas","Risco jurídico/regulatório","Nacional","br"),
 "IA e gestão":("empresa inteligência artificial muda trabalho funções empregos liderança automação","Operação e estratégia","Nacional","br"),
 "Mundo corporativo internacional":("company CEO restructuring layoffs expansion workplace leadership culture acquisition","Pessoas e trabalho","Internacional","us"),
 "Economia criativa e cultura — fomento":("(site:gov.br/cultura OR site:gov.br/ancine OR \"secretaria de cultura\") edital fomento incentivo investimento audiovisual produtora festival economia criativa contratação empregos","Operação e estratégia","Nacional","br"),
 "Grandes eventos — ecossistema econômico":("(festival OR feira OR congresso OR exposição OR evento esportivo OR festa popular) investimento empregos trabalhadores fornecedores infraestrutura turismo operação impacto econômico empresas","Operação e estratégia","Nacional","br"),
 "Patrocínio e experiência de marca":("(patrocínio OR patrocinador OR ativação de marca OR experiência de marca OR naming rights) investimento estratégia empresas festival evento marketing","Mercado e reputação","Nacional","br"),
 "Mídia, audiovisual e plataformas":("Netflix Disney Warner Globo SBT Record streaming televisão cinema CEO reestruturação demissões IA publicidade assinaturas","Operação e estratégia","Nacional","br")
}
HEADERS={"User-Agent":"Mozilla/5.0 (BastidorGestaoEmPauta/1.0)"}
FEED_STATS={"queries":0,"retrieved":0,"rejectedNonArticle":0,"rejectedByDate":0,"accepted":0}
DIRECT_STATS={"configured":0,"attempted":0,"retrieved":0,"rejectedNonArticle":0,"rejectedByDate":0,"rejectedByTopic":0,"accepted":0,"errors":0,"sources":{}}
ORIGIN_STATS={"eligible":0,"lookups":0,"resolved":0}
MATRIX_PATH=Path("data/sources.json")

def clean(t): return re.sub(r"<[^>]+>","",unescape(t or "")).strip()
def d(v):
 if not v:return ""
 try:return parsedate_to_datetime(v).date().isoformat()
 except:pass
 try:return datetime.fromisoformat(v.strip().replace("Z","+00:00")).date().isoformat()
 except:return ""

def canonical_url(url):
 try:
  parts=urlsplit(url or "")
  tracking={"utm_source","utm_medium","utm_campaign","utm_term","utm_content","gclid","fbclid","output"}
  query=urlencode([(k,v) for k,v in parse_qsl(parts.query,keep_blank_values=True) if k.lower() not in tracking])
  return urlunsplit((parts.scheme,parts.netloc.lower(),parts.path.rstrip("/") or "/",query,""))
 except:return url or ""

def xml_value(node,names):
 for element in node.iter():
  local=element.tag.split("}")[-1].lower()
  if local in names and element.text and element.text.strip():return element.text.strip()
 return ""

def xml_link(node):
 for element in node.iter():
  if element.tag.split("}")[-1].lower()!="link":continue
  href=(element.attrib.get("href") or "").strip()
  rel=(element.attrib.get("rel") or "alternate").lower()
  if href and rel in ("alternate",""):return href
  if element.text and element.text.strip():return element.text.strip()
 return ""

def load_matrix_endpoints(path=MATRIX_PATH):
 """Transforma a matriz editorial em configuração executável de coleta direta."""
 try:data=json.loads(path.read_text(encoding="utf-8"))
 except Exception as error:
  print("falha matriz",type(error).__name__);return []
 endpoints=[]
 for source in data.get("sources",[]):
  discovery=source.get("discovery") or {}
  if not discovery.get("active") or discovery.get("adapter")!="rss":continue
  for endpoint in discovery.get("endpoints",[]):
   if not endpoint.get("url"):continue
   endpoints.append({"matrixSource":source.get("source","Matriz de fontes"),**endpoint})
 DIRECT_STATS["configured"]=len(endpoints)
 return endpoints

def direct_topic_match(item,endpoint):
 text=" "+norm(item.get("title","")+" "+item.get("sourceSummary",""))+" "
 if any(has_phrase(text,term) for term in HARD_PROMO_TERMS):return False
 signals=set(family_hits(text))
 if endpoint.get("agenda")=="Poder e regras":
  return bool(signals&{"regulation","workforce","people_risk","distress"}) or any(has_phrase(text,t) for t in BUSINESS_CONTEXT)
 return bool(signals) and (any(has_phrase(text,t) for t in BUSINESS_CONTEXT) or any(has_phrase(text,t) for t in MATERIALITY_TERMS))

def direct_feed(endpoint,days=30):
 """Lê RSS/Atom canônico de uma fonte da matriz sem passar por agregador."""
 name=endpoint.get("name") or endpoint.get("matrixSource") or "Fonte direta"
 stats=DIRECT_STATS["sources"].setdefault(name,{"attempted":0,"retrieved":0,"accepted":0,"errors":0})
 DIRECT_STATS["attempted"]+=1;stats["attempted"]+=1
 try:
  payload=urlopen(Request(endpoint["url"],headers=HEADERS),timeout=30).read()
  root=ET.fromstring(payload)
 except Exception as error:
  DIRECT_STATS["errors"]+=1;stats["errors"]+=1
  print("falha fonte direta",name,type(error).__name__);return []
 nodes=list(root.findall(".//item"))+list(root.findall(".//{*}entry"))
 maximum=int(endpoint.get("maxItems",40));raw=[]
 for node in nodes[:maximum]:
  title=clean(xml_value(node,{"title"}))
  url=canonical_url(xml_link(node))
  date=d(xml_value(node,{"pubdate","published","updated","date"}))
  summary=clean(xml_value(node,{"description","summary","encoded","content"}))[:3000]
  if title and url:raw.append({"title":title,"source":name,"date":date,"url":url,"sourceSummary":summary})
 DIRECT_STATS["retrieved"]+=len(raw);stats["retrieved"]+=len(raw)
 articles=[item for item in raw if is_article(item)]
 DIRECT_STATS["rejectedNonArticle"]+=len(raw)-len(articles)
 dated=[item for item in articles if within_window(item["date"],days)]
 DIRECT_STATS["rejectedByDate"]+=len(articles)-len(dated)
 relevant=[item for item in dated if direct_topic_match(item,endpoint)]
 DIRECT_STATS["rejectedByTopic"]+=len(dated)-len(relevant)
 for item in relevant:
  item.update({
   "agenda":endpoint.get("agenda","Empresa em Pauta"),
   "impact":endpoint.get("impact","Operação e estratégia"),
   "scope":endpoint.get("scope","Nacional"),
   "territory":endpoint.get("territory","Brasil"),
   "locale":endpoint.get("locale","br"),
   "discoveryAdapter":"direct_rss",
   "matrixSource":endpoint.get("matrixSource",name)
  })
 DIRECT_STATS["accepted"]+=len(relevant);stats["accepted"]+=len(relevant)
 return relevant

def within_window(date_iso,days=30):
 try:
  published=datetime.fromisoformat(date_iso).date()
  today=datetime.now(timezone.utc).date()
  return today-timedelta(days=days)<=published<=today
 except: return False

GENERIC_TITLES={"notícias","últimas notícias","senado notícias","câmara notícias","camara notícias","home","início","inicio","notícias - senado","news"}
def is_article(item):
 title=item["title"].strip()
 source=item["source"].strip()
 base=re.sub(r"\s*[-–—]\s*"+re.escape(source)+r"\s*$","",title,flags=re.I).strip().lower()
 if base in GENERIC_TITLES or len(base)<24:return False
 if base==source.lower() or base.endswith("notícias"):return False
 return True

def feed(q,n=12,locale="br"):
 # Primeiro descobre publicações recentes; consulta histórica apenas complementa.
 # Mantém a mesma triagem editorial, sem limitar artificialmente a cobertura a 24 h.
 suffix="&hl=en-US&gl=US&ceid=US:en" if locale=="us" else "&hl=pt-BR&gl=BR&ceid=BR:pt-419"
 results=[]
 seen=set()
 for window,limit in ((1,n),(30,n)):
  if window==30 and len(results)>=n: break
  FEED_STATS["queries"]+=1
  u="https://news.google.com/rss/search?q="+quote(q+f" when:{window}d")+suffix
  try:
   root=ET.fromstring(urlopen(Request(u,headers=HEADERS),timeout=30).read())
  except Exception as e:
   print("falha",window,q[:60],e)
   continue
  raw=[{"title":clean(i.findtext("title")),"source":clean(i.findtext("source")) or "Google Notícias","date":d(i.findtext("pubDate")or""),"url":i.findtext("link")} for i in root.findall("./channel/item")[:limit] if i.findtext("title") and i.findtext("link")]
  FEED_STATS["retrieved"]+=len(raw)
  valid_articles=[item for item in raw if is_article(item)]
  FEED_STATS["rejectedNonArticle"]+=len(raw)-len(valid_articles)
  valid=[item for item in valid_articles if within_window(item["date"],window)]
  FEED_STATS["rejectedByDate"]+=len(valid_articles)-len(valid)
  for item in valid:
   key=(item["title"].casefold(),item["source"].casefold())
   if key not in seen:
    results.append(item)
    seen.add(key)
   if len(results)>=n: break
 FEED_STATS["accepted"]+=len(results)
 return results

def origin(t,locale):
 c=feed('"'+t+'"',5,locale)
 return {"found":bool(c),**(min(c,key=lambda x:x["date"]) if c else {})}

OFFICIAL_SOURCES=("senado","câmara","camara","planalto","ministério","ministerio","itamaraty","diário oficial","diario oficial","imprensa nacional","tribunal","trt","tst","stf","stj","trf","mte","mpt","receita federal","banco central","ibge","prefeitura","governo do estado","assembleia legislativa","câmara municipal","camara municipal","junta comercial","juceg","jucesp","jucemg","jucepar","jucisrs","cvm","cade")

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

def norm(text):
 text=unicodedata.normalize("NFKD",text or "").encode("ascii","ignore").decode().lower()
 return re.sub(r"[^a-z0-9 ]+"," ",text)

PROMO_TERMS=("premio","vencedores","feira de negocios","conference","conferencia","evento","mentor de ceos","livro gratuito","curso gratuito","aborda","debate","ganham protagonismo","franquias baratas","lista de","agenda de presidente","publieditorial","conteudo patrocinado","inscricoes abertas","webinar gratuito")
HARD_PROMO_TERMS=("publieditorial","conteudo patrocinado","inscricoes abertas","webinar gratuito","livro gratuito","curso gratuito","agenda de presidente")
PURE_FINANCE_TERMS=("dolar","bolsa fecha","selic","taxa basica de juros","dividendos","cotacao","acoes despencam","acoes sobem","poupanca","tesouro direto")

SEMANTIC_FAMILIES={
 "expansion":("expansao","expande","amplia producao","amplia capacidade","aumenta capacidade","nova fabrica","nova unidade","nova planta","abre unidade","abre loja","inaugura","cresce producao","crescimento da producao","entra no mercado","vai entrar no","estrear na pista","expansion","new plant"),
 "investment":("investe","investimento bilionario","investimento milionário","investimento milionario","injeta","aporta","aporte","capta","captacao","financia","financiamento","r$","us$","£","milhoes","bilhoes","investment","funding"),
 "control":("aquisicao","adquire","compra empresa","compra 100","troca de dono","novo dono","muda de dono","mudanca de controle","controlador","incorpora","fusao","cisao","merger","acquisition","acquires"),
 "leadership":("novo ceo","novo vp","troca de ceo","ex ceo retorna","ceo retorna","retorna para a operacao","nomeia","renuncia","sucessao","presidente deixa","new ceo","appoints","resigns"),
 "restructuring":("reestruturacao","reorganiza","redesenha","renova mix","renovam mix","renova operacao","renovam operacoes","encolher","corta custos","reducao de custos","demissao","demite","fechamento","fecha unidade","restructuring","layoff","layoffs","closes"),
 "operations":("operacao","operacoes","producao","capacidade produtiva","logistica","falha logistica","cadeia de suprimentos","fornecedores","terceirizacao","infraestrutura","planta industrial","fabrica"),
 "workforce":("empregos","trabalhadores","empregados","funcionarios","contratacao","contrata","equipe","jornada","turno","salario","greve","sindicato","negociacao coletiva","workforce","workers","employees","jobs","hiring"),
 "regulation":("regulamentacao","nova regra","lei sancionada","sancionado","decreto","portaria","resolucao","fiscalizacao","licenca","licenciamento","concessao","autorizacao","edital","incentivo fiscal","reducao do icms","icms","tributacao"),
 "distress":("recuperacao judicial","recuperacao extrajudicial","falencia","pedido de recuperacao","insolvencia","bankruptcy","judicial recovery"),
 "technology":("inteligencia artificial"," ia ","automacao","digitalizacao","tecnologia transforma","semicondutor","semiconductor"),
 "people_risk":("nr 1","saude mental","risco psicossocial","burnout","assedio","afastamento","ansiedade","rotatividade","sobrecarga"),
 "creative":("edital cultural","edital de cultura","fomento cultural","incentivo a cultura","incentivo cultural","audiovisual","economia criativa","produtora audiovisual"),
 "events":("festival","rock in rio","carnaval","festa popular","evento esportivo","feira empresarial","feira de negocios","congresso empresarial","congresso medico","congresso de tecnologia","exposicao comercial","festival de musica"),
 "sponsorship":("patrocinio","patrocinador","ativacao de marca","ativar uma marca","experiencia de marca","naming rights","recorde de marcas","atrai negocios","plataforma de posicionamento","conexao com consumidores","sponsorship")
}

BUSINESS_CONTEXT=("empresa","companhia","industria","varejo","rede","grupo","ceo","vp","fabrica","loja","operacao","producao","mercado","negocios","receita","faturamento","marca","franquia","banco","fintech","startup","pme","fornecedores","trabalhadores","empregos")
PUBLIC_INVESTMENT_CONTEXT=("governo","presidente","ministro","ministerio","prefeitura","estado","educacao","faculdade","politica publica","programa publico")
PERSONAL_FINANCE_CONTEXT=("poupanca","investidor","investidores","renda fixa","tesouro direto","carteira","aplicacao","aplicacoes","cdb","fundos de investimento")
MATERIALITY_TERMS=("r$","us$","£","milhoes","bilhoes","empregos","trabalhadores","contratacao","fornecedores","infraestrutura","impacto economico","movimenta","receita","faturamento","capacidade produtiva","producao","operacao","operacoes","negocios","cadeia produtiva","turismo","rede hoteleira","investimento bilionario","investimento milionario","injeta","aporta","aporte","capta","captacao")

EVENT_META={
 "restructuring":("Redução, reestruturação ou fechamento","Pressão financeira","Investigar redução de equipe, redistribuição de tarefas, metas, comunicação e segurança no emprego."),
 "control":("Fusão, aquisição ou mudança de controle","Capital e estratégia","Investigar mudança de controle, integração, governança, sobreposição de papéis, autonomia e retenção."),
 "expansion":("Expansão ou aumento de capacidade","Capital e crescimento","Investigar capacidade operacional, contratação, liderança, integração e recursos exigidos pela expansão."),
 "leadership":("Mudança de comando","Governança","Investigar continuidade estratégica, sucessão, confiança interna e efeitos sobre a cultura."),
 "distress":("Crise financeira ou reorganização judicial","Continuidade e solvência","Investigar continuidade operacional, emprego, fornecedores, governança e reorganização."),
 "people_risk":("Risco psicossocial e saúde no trabalho","Saúde, risco e continuidade","Investigar organização do trabalho, suporte, relações, liderança, prevenção e acompanhamento."),
 "workforce":("Relações e força de trabalho","Pessoas e operação","Investigar emprego, jornada, negociação, distribuição de trabalho e continuidade operacional."),
 "technology":("Tecnologia e redesenho do trabalho","Tecnologia e produtividade","Investigar funções alteradas, autonomia, capacitação, desempenho e insegurança profissional."),
 "sponsorship":("Patrocínio, experiência e ativação de marca","Marketing e estratégia","Investigar investimento, objetivo empresarial, experiência, operação e retorno estratégico."),
 "events":("Grandes eventos e ecossistemas temporários","Operação e ecossistema econômico","Investigar trabalhadores, fornecedores, infraestrutura, turismo, operação e impacto econômico."),
 "creative":("Economia criativa e fomento","Investimento e cadeia criativa","Investigar recursos mobilizados, organizações beneficiadas, contratação, fornecedores e capacidade de execução."),
 "regulation":("Regulação com efeito empresarial","Regra ou política pública","Confirmar setores atingidos, obrigação, prazo e mudanças necessárias em processos, custos ou trabalho."),
 "operations":("Mudança operacional ou produtiva","Operação e capacidade","Investigar processo, logística, capacidade, recursos, liderança e efeitos sobre o trabalho."),
 "investment":("Investimento ou movimentação de capital","Capital e estratégia","Confirmar quem investe, finalidade, escala e consequência empresarial concreta.")
}

def has_phrase(text,phrase):
 return (" "+phrase.strip()+" ") in text

def family_hits(text):
 return {name:[term for term in terms if has_phrase(text,term)] for name,terms in SEMANTIC_FAMILIES.items() if any(has_phrase(text,term) for term in terms)}

def editorial_potential(title,agenda,evidence,context=""):
 # A régua não muda; fontes diretas podem acrescentar o resumo fornecido no RSS.
 # Isso evita que uma manchete vaga esconda uma decisão material descrita pela própria fonte.
 text=" "+norm(title+" "+context)+" "
 hits=family_hits(text)
 business_context=any(has_phrase(text,t) for t in BUSINESS_CONTEXT)
 public_context=any(has_phrase(text,t) for t in PUBLIC_INVESTMENT_CONTEXT)
 personal_finance=any(has_phrase(text,t) for t in PERSONAL_FINANCE_CONTEXT)
 materiality=any(has_phrase(text,t) for t in MATERIALITY_TERMS)
 hard_promotional=any(has_phrase(text,t) for t in HARD_PROMO_TERMS)

 # "investimento" só é decisão empresarial quando existe contexto empresarial/materialidade.
 generic_investment=has_phrase(text,"investimento") or has_phrase(text,"investimentos")
 investment_business=("investment" in hits and (business_context or materiality)) and not personal_finance
 if ("investment" in hits) and (personal_finance or (public_context and not business_context)):
  hits.pop("investment",None)

 # Congresso legislativo não é congresso/evento; eventos exigem termos qualificados.
 culture_or_event=bool(set(hits)&{"creative","events","sponsorship"})
 promotional=any(has_phrase(text,t) for t in PROMO_TERMS) and not (culture_or_event and (materiality or business_context))

 # Ordem de precedência: fatos empresariais mais concretos antes de categorias amplas.
 precedence=("restructuring","control","expansion","leadership","distress","people_risk","workforce","technology","sponsorship","events","creative","regulation","operations","investment")
 primary=next((name for name in precedence if name in hits),None)
 if primary:
  event,trigger,investigation=EVENT_META[primary]
 else:
  event,trigger,investigation="Contexto econômico ou empresarial","Dinheiro, mercado ou reputação","Confirmar se o título aponta decisão, mudança operacional, consequência empresarial ou efeito humano."

 concrete_families=set(hits)&{"restructuring","control","expansion","leadership","distress","workforce","sponsorship","regulation","operations"}
 fact=2 if concrete_families or investment_business else (1 if materiality or evidence=="Documento/ato oficial" or any(has_phrase(text,t) for t in ("ranking","pesquisa","dados","balanco","relatorio","comunicado")) else 0)
 decision=2 if set(hits)&{"restructuring","control","expansion","leadership","distress","sponsorship"} or investment_business else (1 if set(hits)&{"regulation","operations","creative","events","technology","workforce"} else 0)
 organization=2 if set(hits)&{"restructuring","control","expansion","leadership","distress","operations","workforce"} else (1 if set(hits)&{"technology","sponsorship","events","creative","regulation"} and (materiality or business_context) else 0)
 human=2 if set(hits)&{"workforce","people_risk"} else (1 if organization>=1 or any(has_phrase(text,t) for t in ("lideranca","lideres","cultura organizacional","equipe","funcionarios","empregados")) else 0)

 # Autoridade editorial não deve ser criada apenas pela origem oficial.
 authority=2 if agenda in ("Pessoas e liderança","NR-1 / AEP","Trabalho e representação") and (human or organization) else (1 if agenda in ("Empresa em Pauta","IA e gestão","Mundo corporativo internacional","Poder e regras") and (fact or decision) else 0)
 source_bonus=1 if evidence=="Documento/ato oficial" and materiality and decision>=1 else 0

 pure_finance=any(has_phrase(text,t) for t in PURE_FINANCE_TERMS) and not concrete_families and not business_context
 score=fact+decision+organization+human+authority+source_bonus
 if materiality and (business_context or concrete_families or culture_or_event):score+=1
 if promotional:score-=4
 if hard_promotional:score-=4
 if pure_finance or personal_finance:score-=4
 score=max(0,min(10,score))

 triage_priority="Prioridade muito alta" if score>=8 else ("Prioridade alta" if score>=6 else ("Prioridade média" if score>=4 else ("Prioridade baixa" if score>=2 else "Prioridade muito baixa")))
 missing=[]
 if fact<2:missing.append("fato concreto no título")
 if decision<2:missing.append("decisão empresarial")
 if organization<2:missing.append("mudança organizacional")
 if human<2:missing.append("consequência humana")
 return {"score":score,"triagePriority":triage_priority,"event":event,"economicTrigger":trigger,"organizationalHypothesis":investigation,"questions":["Qual decisão concreta foi tomada?","O que muda no trabalho, nos papéis, nas metas ou nos recursos?","Quem absorve a consequência e qual responsabilidade cabe à liderança?"],"missing":missing,"caveat":"Classificação preliminar baseada somente no título, fonte e metadados. Não confirma o conteúdo da matéria nem determina seu uso editorial.","promotional":promotional,"hardPromotional":hard_promotional,"materiality":materiality,"pureFinance":pure_finance,"semanticFamilies":hits,"businessContext":business_context}

STOPWORDS={"a","o","as","os","de","da","do","das","dos","e","em","no","na","nos","nas","para","por","com","um","uma","ao","aos","que","como","sobre","brasil","brasileira","brasileiro","the","and","of","to","in","for"}
def topic_tokens(title,source):
 base=re.sub(r"\s*[-–—]\s*"+re.escape(source)+r"\s*$","",title,flags=re.I)
 return {token for token in norm(base).split() if len(token)>2 and token not in STOPWORDS}

def cluster_signature(item):
 potential=item.get("editorialPotential",{})
 families=set((potential.get("semanticFamilies") or {}).keys())
 tokens=topic_tokens(item["title"],item["source"])
 entities={t for t in tokens if len(t)>=5}
 return families,tokens,entities

def merge_duplicates(items):
 ordered=sorted(items,key=lambda x:((1 if x.get("bodyAnalysis",{}).get("status","").startswith("analisado") else 0),(1 if x["evidence"]=="Documento/ato oficial" else 0),(1 if x.get("discoveryAdapter")=="direct_rss" else 0),x["score"],x["date"]),reverse=True)
 result=[]
 for item in ordered:
  families,tokens,entities=cluster_signature(item);match=None;match_reason=""
  for candidate in result:
   cfamilies,other,centities=cluster_signature(candidate)
   shared=len(tokens&other);union=len(tokens|other) or 1
   entity_shared=len(entities&centities)
   same_event=item["editorialPotential"]["event"]==candidate["editorialPotential"]["event"]
   family_overlap=bool(families&cfamilies)
   close_date=abs((datetime.fromisoformat(item["date"]).date()-datetime.fromisoformat(candidate["date"]).date()).days)<=3
   if close_date and ((same_event and shared>=4 and shared/union>=.32) or (family_overlap and entity_shared>=2 and shared>=3)):
    match=candidate;match_reason="mesmo fato provável por similaridade temática, entidades e proximidade temporal";break
  if match:
   match.setdefault("relatedSources",[]).append({"title":item["title"],"source":item["source"],"date":item["date"],"url":item["url"],"score":item["score"]})
   match["clusterSize"]=1+len(match["relatedSources"])
   match["clusterReason"]=match_reason
  else:
   item["relatedSources"]=[];item["clusterSize"]=1;item["clusterReason"]="item principal do cluster";result.append(item)
 return result

def radar_diagnostics(raw_items,clustered_items,feed_stats,direct_stats=None,origin_stats=None,preserved_curated=0):
 score_bands={"80-100":0,"60-70":0,"40-50":0,"20-30":0,"0-10":0}
 agendas={};events={};sources={}
 for item in clustered_items:
  s=item.get("score",0)
  band="80-100" if s>=80 else ("60-70" if s>=60 else ("40-50" if s>=40 else ("20-30" if s>=20 else "0-10")))
  score_bands[band]+=1
  agendas[item["agenda"]]=agendas.get(item["agenda"],0)+1
  ev=item.get("editorialPotential",{}).get("event","Não classificado");events[ev]=events.get(ev,0)+1
  sources[item["source"]]=sources.get(item["source"],0)+1
 duplicate_count=max(0,len(raw_items)-len(clustered_items))
 high=sum(1 for x in clustered_items if x.get("score",0)>=80)
 low=sum(1 for x in clustered_items if x.get("score",0)<=10)
 direct_stats=direct_stats or {}
 direct_count=sum(1 for item in clustered_items if item.get("discoveryAdapter")=="direct_rss")
 direct_sources=sum(1 for stats in direct_stats.get("sources",{}).values() if stats.get("accepted",0)>0)
 return {
  "generatedAt":datetime.now(timezone.utc).isoformat(),
  "windowDays":30,
  "collection":feed_stats,
  "directCollection":direct_stats,
  "originResolution":origin_stats or {},
  "preservedCurated":preserved_curated,
  "matrixCoverage":{
   "configuredDirectEndpoints":direct_stats.get("configured",0),
   "directSourcesWithAcceptedItems":direct_sources,
   "directClusterShare":round(direct_count/max(1,len(clustered_items)),3)
  },
  "rawCandidates":len(raw_items),
  "clusters":len(clustered_items),
  "duplicatesMerged":duplicate_count,
  "scoreBands":score_bands,
  "highPriorityShare":round(high/max(1,len(clustered_items)),3),
  "veryLowPriorityShare":round(low/max(1,len(clustered_items)),3),
  "agendaDistribution":dict(sorted(agendas.items(),key=lambda kv:kv[1],reverse=True)),
  "eventDistribution":dict(sorted(events.items(),key=lambda kv:kv[1],reverse=True)),
  "topSources":dict(sorted(sources.items(),key=lambda kv:kv[1],reverse=True)[:15]),
  "qualityFlags":{
   "emptyRadar":len(clustered_items)==0,
   "highPriorityInflation":high/max(1,len(clustered_items))>0.35,
   "lowPriorityNoise":low/max(1,len(clustered_items))>0.60,
   "duplicatePressure":duplicate_count/max(1,len(raw_items))>0.30,
   "directSourcesUnavailable":direct_stats.get("configured",0)>0 and direct_sources==0
  }
 }

def load_curated_items(path=Path("data/news.json"),days=30):
 """Preserva curadorias já validadas; a coleta não deve apagar trabalho editorial."""
 try:data=json.loads(path.read_text(encoding="utf-8"))
 except:return []
 return [item for item in data.get("items",[]) if item.get("bodyAnalysis",{}).get("status","").startswith("analisado") and within_window(item.get("date",""),days)]

def resolve_origins(items,max_lookups=12):
 """Aprofunda somente os melhores candidatos, em vez de repetir uma busca para cada ruído."""
 eligible=[item for item in items if not item.get("origin",{}).get("found") and item.get("score",0)>=60]
 ORIGIN_STATS["eligible"]=len(eligible)
 for item in eligible[:max_lookups]:
  ORIGIN_STATS["lookups"]+=1
  located=origin(item["title"],item.get("locale","br"))
  if located.get("found"):ORIGIN_STATS["resolved"]+=1
  item["origin"]=located
 for item in eligible[max_lookups:]:
  item["origin"]={"found":False,"reason":"Origem não expandida nesta rodada; priorização limitada aos candidatos de maior score."}

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

def enrich_item_from_analysis(item,analysis):
 if not analysis.get("status","").startswith("analisado"):return
 editorial=analysis.get("editorial",{})
 item["summary"]=analysis.get("factual_summary") or item["summary"]
 item["angle"]=editorial.get("angle") or item["angle"]
 defaults=audience_for(item["agenda"])
 item["audience"]={"public":editorial.get("audience") or defaults["public"],"interest":analysis.get("relevance",{}).get("reason") or defaults["interest"],"search":editorial.get("search_intent") or defaults["search"],"sensation":defaults["sensation"]}
 item["packaging"]={**packaging_for(item["agenda"],item["impact"]),"opening":editorial.get("angle") or packaging_for(item["agenda"],item["impact"])["opening"],"thumbnail":editorial.get("headline") or packaging_for(item["agenda"],item["impact"])["thumbnail"],"keywords":editorial.get("search_intent") or packaging_for(item["agenda"],item["impact"])["keywords"],"hashtags":editorial.get("hashtags","")}

def apply_body_analysis(items):
 if not OPENAI_API_KEY:
  print("OPENAI_API_KEY ausente; análise de corpo não executada.");return
 candidates=sorted(items,key=lambda x:(x.get("score",0),x.get("date","")),reverse=True)[:MAX_AI_ANALYSES]
 for item in candidates:
  body,final_url,reason=extract_article_body(item.get("url",""))
  if not body:
   analysis=analyze_by_source_lookup(item,reason or "Corpo indisponível para análise.")
   item["bodyAnalysis"]=analysis;enrich_item_from_analysis(item,analysis);continue
  analysis=analyze_article(item,body,final_url);item["bodyAnalysis"]=analysis
  enrich_item_from_analysis(item,analysis)

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


def radar_run_context(now_utc=None):
 """Identifica a execução real, separada da data de publicação de cada notícia."""
 now_utc=now_utc or datetime.now(timezone.utc)
 github_id=os.environ.get("GITHUB_RUN_ID","").strip()
 attempt=os.environ.get("GITHUB_RUN_ATTEMPT","1").strip()
 run_id=(f"gh-{github_id}-{attempt}" if github_id else "local-"+now_utc.strftime("%Y%m%dT%H%M%SZ"))
 return {"runId":run_id,"generatedAt":now_utc.isoformat(timespec="seconds"),"generatedAtLocal":now_utc.astimezone(ZoneInfo("America/Sao_Paulo")).isoformat(timespec="seconds"),"timezone":"America/Sao_Paulo","trigger":os.environ.get("GITHUB_EVENT_NAME","manual/local"),"sourceCommit":os.environ.get("GITHUB_SHA","")}

def attach_radar_history(items,preserved_ids,rediscovered_ids,prior_snapshot,run,history_path=Path("data/news-history.json")):
 """Histórico de observações por ID. Preservar análise antiga não significa notícia recoletada."""
 try:
  history=json.loads(history_path.read_text(encoding="utf-8"))
  if not isinstance(history,dict):history={}
 except (OSError,ValueError,TypeError):
  history={}
 registry=history.get("articles") if isinstance(history.get("articles"),dict) else {}
 old_items={x.get("id"):x for x in prior_snapshot.get("items",[]) if x.get("id")}
 old_day=prior_snapshot.get("updatedAt")
 current_time=run["generatedAt"]
 fresh,repeated,preserved_only=0,0,0
 for item in items:
  key=item.get("id") or (item.get("source","")+"|"+item.get("title",""))
  rec=registry.get(key) if isinstance(registry.get(key),dict) else {}
  rec=dict(rec)
  prior_item=old_items.get(key,{})
  previous=bool(rec) or bool(prior_item)
  found_now=(key not in preserved_ids) or (key in rediscovered_ids)
  if not rec:
   previous_trace=prior_item.get("radarTrace") or {}
   rec={"firstSeenAt":previous_trace.get("firstSeenAt") if previous else current_time,
        "legacyFirstSeenDate":previous_trace.get("legacyFirstSeenDate") or (old_day if previous else None),
        "lastSeenAt":previous_trace.get("lastSeenAt"),
        "lastSeenRunId":previous_trace.get("lastSeenRunId"),
        "seenCount":previous_trace.get("seenCount",0),
        "recentRunIds":list(previous_trace.get("recentRunIds") or [])}
  if found_now:
   if not rec.get("firstSeenAt") and not rec.get("legacyFirstSeenDate"):rec["firstSeenAt"]=current_time
   rec["lastSeenAt"]=current_time
   rec["lastSeenRunId"]=run["runId"]
   ids=list(rec.get("recentRunIds") or [])
   if run["runId"] not in ids:
    ids.append(run["runId"])
    rec["seenCount"]=int(rec.get("seenCount") or 0)+1
   rec["recentRunIds"]=ids[-15:]
   if previous:repeated+=1
   else:fresh+=1
  else:
   preserved_only+=1
  rec["id"]=key
  rec["title"]=item.get("title","")[:180]
  rec["source"]=item.get("source","")[:90]
  rec["publishedDate"]=item.get("date")
  item["radarTrace"]={"firstSeenAt":rec.get("firstSeenAt"),"legacyFirstSeenDate":rec.get("legacyFirstSeenDate"),
    "lastSeenAt":rec.get("lastSeenAt"),"lastSeenRunId":rec.get("lastSeenRunId"),
    "seenBeforeThisRun":previous,"foundInCurrentRun":found_now,"seenCount":rec.get("seenCount",0),
    "recentRunIds":rec.get("recentRunIds",[])}
  registry[key]=rec
 runs=list(history.get("runs") or [])
 if not any(x.get("runId")==run["runId"] for x in runs):
  runs.append({**run,"total":len(items),"newArticles":fresh,"seenAgain":repeated,"preservedOnly":preserved_only})
 if len(registry)>6000:
  ordered=sorted(registry,key=lambda k:(registry[k].get("lastSeenAt") or "",registry[k].get("legacyFirstSeenDate") or ""),reverse=True)
  registry={key:registry[key] for key in ordered[:6000]}
 history_path.write_text(json.dumps({"version":1,"updatedAt":current_time,"runs":runs[-120:],"articles":registry},ensure_ascii=False,indent=2),encoding="utf-8")
 return {"newArticles":fresh,"seenAgain":repeated,"preservedOnly":preserved_only,"knownArticles":len(registry)}

# --- EXECUÇÃO DA COLETA ---
preserved_items=load_curated_items()
try:prior_snapshot=json.loads(Path("data/news.json").read_text(encoding="utf-8"))
except (OSError,ValueError):prior_snapshot={}
items=list(preserved_items)
preserved_ids={item.get("id") for item in preserved_items}
preserved_urls={canonical_url(item.get("url","")):item.get("id") for item in preserved_items}
preserved_titles={(norm(item.get("title","")),item.get("source","").casefold()):item.get("id") for item in preserved_items}
rediscovered_ids=set()
seen_urls={canonical_url(item.get("url","")) for item in items}
seen_titles={(norm(item.get("title","")),item.get("source","").casefold()) for item in items}

def append_candidate(x,agenda,impact,scope,locale,territory=None):
 url=canonical_url(x.get("url",""));title_key=(norm(x.get("title","")),x.get("source","").casefold())
 if not url:return
 if url in seen_urls or title_key in seen_titles:
  matched=preserved_urls.get(url) or preserved_titles.get(title_key)
  if matched in preserved_ids:rediscovered_ids.add(matched)
  return
 seen_urls.add(url);seen_titles.add(title_key)
 use,evidence=safety(x)
 context=x.get("sourceSummary","")
 potential=editorial_potential(x["title"],agenda,evidence,context)
 score=potential["score"]*10
 local=(" Para pauta municipal ou estadual, confirmar o território, o ato aplicável, as empresas/setores afetados e se o efeito é local ou pode se repetir em outros lugares." if scope in ["Municipal","Estadual"] else "")
 compare=(" Para pauta internacional, acrescentar: qual prática, contexto regulatório ou cultura corporativa pode ser comparada ao Brasil — sem presumir equivalência." if scope=="Internacional" else "")
 direct=x.get("discoveryAdapter")=="direct_rss"
 origin_data={"found":True,"title":x["title"],"source":x["source"],"date":x["date"],"url":url} if direct else {"found":False}
 source_type=("Fonte direta da matriz — abrir e validar o corpo" if direct else "Fonte localizada por agregador — abrir a publicação original")
 summary=(f"Candidata localizada diretamente na matriz. Cenário preliminar: {potential['event']}. O resumo da fonte ajudou a priorizar, mas o corpo ainda precisa ser validado." if direct else f"Candidata localizada por descoberta ampla. Cenário preliminar: {potential['event']}. Abra a publicação original antes de concluir relevância ou consequência.")
 key=(x["title"]+x["source"]).lower()
 items.append({
  "id":re.sub(r"[^a-z0-9]+","-",norm(key))[:90],
  "agenda":agenda,"impact":impact,"scope":scope,
  "territory":territory or ("Confirmar na fonte" if scope in ["Municipal","Estadual"] else ("Brasil" if scope in ["Federal","Nacional"] else "Internacional")),
  "evidence":evidence,"sourceType":source_type,"score":score,
  "title":x["title"],"source":x["source"],"date":x["date"],"url":url,
  "summary":summary,"angle":potential["organizationalHypothesis"]+local+compare,
  "editorialPotential":potential,"origin":origin_data,
  "audience":audience_for(agenda),"packaging":packaging_for(agenda,impact),"use":use,
  "discoveryAdapter":x.get("discoveryAdapter","google_news_rss"),
  "matrixSource":x.get("matrixSource","Google Notícias"),"locale":locale
 })

# 1) A matriz abre as fontes canônicas configuradas e traz URLs diretas.
matrix_endpoints=load_matrix_endpoints()
for endpoint in matrix_endpoints:
 for x in direct_feed(endpoint):
  append_candidate(x,x["agenda"],x["impact"],x["scope"],x["locale"],x.get("territory"))

# 2) O Google Notícias permanece como descoberta ampla e redundância, não como fonte única.
for stream,(query,impact,scope,locale) in STREAMS.items():
 for x in feed(query,12,locale):
  agenda="Empresa em Pauta" if stream.startswith("Empresa em Pauta") else ("Mercado e trabalho" if stream.startswith("Sinal setorial") else ("Poder e regras" if stream.startswith("Poder e regras") else ("Relações internacionais" if stream.startswith("Relações internacionais") else stream)))
  append_candidate(x,agenda,impact,scope,locale)

raw_items=list(items)
items=merge_duplicates(items)
items.sort(key=lambda x:(x["score"],x["date"]),reverse=True)
# 3) A segunda passagem procura a origem apenas para candidatos fortes ainda sem fonte canônica.
resolve_origins(items)
diagnostics=radar_diagnostics(raw_items,items,FEED_STATS,DIRECT_STATS,ORIGIN_STATS,len(preserved_items))
run=radar_run_context()
trace_stats=attach_radar_history(items,preserved_ids,rediscovered_ids,prior_snapshot,run)
diagnostics["radarRun"]=run
diagnostics["traceStats"]=trace_stats
# A análise com IA é sob demanda: a coleta e os filtros não consomem crédito.
Path("data/news.json").write_text(json.dumps({"updatedAt":run["generatedAtLocal"][:10],"researchRun":{"method":"matriz direta + descoberta ampla + expansão seletiva","directEndpoints":len(matrix_endpoints),"curatedPreserved":len(preserved_items),**run,**trace_stats},"items":items},ensure_ascii=False,indent=2),encoding="utf-8")
Path("data/diagnostics.json").write_text(json.dumps(diagnostics,ensure_ascii=False,indent=2),encoding="utf-8")
videos=youtube_videos()
Path("data/videos.json").write_text(json.dumps({"updatedAt":datetime.now(timezone.utc).date().isoformat(),"items":videos},ensure_ascii=False,indent=2),encoding="utf-8")
