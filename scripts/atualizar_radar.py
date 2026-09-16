from datetime import datetime,timezone
from email.utils import parsedate_to_datetime
from html import unescape
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request,urlopen
import json,re,xml.etree.ElementTree as ET
STREAMS={"Empresa em Pauta":("CEO empresa decisão estratégia expansão demissão aquisição", "Operação e estratégia","br"),"Poder e regras":("projeto de lei regulamentação fiscalização empresas trabalho Câmara Senado", "Risco jurídico/regulatório","br"),"Mercado e trabalho":("empresas mercado emprego investimento juros Brasil","Custo e caixa","br"),"Relações internacionais":("Itamaraty diplomacia embaixada acordo comercial exportação importação empresas Brasil","Mercado e reputação","br"),"Trabalho e representação":("sindicato convenção coletiva greve negociação empresas","Pessoas e trabalho","br"),"Pessoas e liderança":("liderança gestão pessoas saúde mental trabalho empresas","Pessoas e trabalho","br"),"NR-1 / AEP":("NR-1 AEP riscos psicossociais empresas","Risco jurídico/regulatório","br"),"IA e gestão":("inteligência artificial gestão empresas trabalho","Operação e estratégia","br"),"Mundo corporativo internacional":("CEO company culture workplace leadership business","Pessoas e trabalho","us")}
HEADERS={"User-Agent":"Mozilla/5.0 (BastidorGestaoEmPauta/1.0)"}
def clean(t):return re.sub(r"<[^>]+>","",unescape(t or "")).strip()
def d(v):
 try:return parsedate_to_datetime(v).date().isoformat()
 except:return datetime.now(timezone.utc).date().isoformat()
def feed(q,n=4,locale="br"):
 if locale=="us":suffix="&hl=en-US&gl=US&ceid=US:en"
 else:suffix="&hl=pt-BR&gl=BR&ceid=BR:pt-419"
 u="https://news.google.com/rss/search?q="+quote(q+" when:14d")+suffix
 try:r=ET.fromstring(urlopen(Request(u,headers=HEADERS),timeout=30).read())
 except Exception as e:print("falha",e);return []
 return [{"title":clean(i.findtext("title")),"source":clean(i.findtext("source")) or "Google Notícias","date":d(i.findtext("pubDate")or""),"url":i.findtext("link")}for i in r.findall("./channel/item")[:n]if i.findtext("title")and i.findtext("link")]
def origin(t,locale):
 c=feed('"'+t+'"',5,locale);return {"found":bool(c),**(min(c,key=lambda x:x["date"])if c else {})}
def safety(x):
 text=(x["title"]+" "+x["source"]).lower();alert="Não reproduzir texto, imagem, vídeo, tabela ou infográfico de terceiro."
 if any(k in text for k in["sigilo","vazamento","dados pessoais","segredo","confidencial"]):return {"label":"Não usar sem revisão humana.","alert":"Possível sigilo, dado pessoal ou informação sensível."},"Exige confirmação"
 if any(k in text for k in["lei","decreto","portaria","projeto de lei","tribunal","ministério","itamaraty","senado","câmara"]):return {"label":"Analisar o ato ou documento original; usar redação própria.","alert":alert},"Documento/ato oficial"
 return {"label":"Noticiar com redação própria e citar a fonte.","alert":alert},"Repercussão jornalística"
items=[];seen=set()
for agenda,(query,impact,locale) in STREAMS.items():
 for x in feed(query,4,locale):
  key=(x["title"]+x["source"]).lower()
  if key in seen:continue
  seen.add(key);use,evidence=safety(x);score=3+(3 if agenda=="Empresa em Pauta" else 0)+(3 if evidence=="Documento/ato oficial" else 0)+(2 if impact in["Custo e caixa","Risco jurídico/regulatório"]else 0)
  compare=" Para pauta internacional, acrescentar: qual prática, contexto regulatório ou cultura corporativa pode ser comparada ao Brasil - sem presumir equivalência." if locale=="us" else ""
  items.append({"id":re.sub(r"[^a-z0-9]+","-",key)[:90],"agenda":agenda,"impact":impact,"evidence":evidence,"sourceType":"Fonte jornalística ou institucional - confirmar origem","score":score,**x,"summary":"Notícia coletada para triagem. Abra a fonte e valide o fato antes de transformá-lo em análise.","angle":f"O que este fato pode mudar para empresas em {impact.lower()}? Separar fato confirmado, declaração da fonte e consequência gerencial antes de gravar."+compare,"origin":origin(x["title"],locale),"use":use})
items.sort(key=lambda x:(x["score"],x["date"]),reverse=True)
Path("data/news.json").write_text(json.dumps({"updatedAt":datetime.now(timezone.utc).date().isoformat(),"items":items},ensure_ascii=False,indent=2),encoding="utf-8")