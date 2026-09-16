from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from html import unescape
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request, urlopen
import json,re,xml.etree.ElementTree as ET
QUERIES={"Liderança":"liderança gestão empresas when:7d","Riscos psicossociais":"riscos psicossociais saúde mental trabalho when:7d","NR-1 / AEP":"NR-1 AEP riscos psicossociais empresas when:14d","Mercado e trabalho":"empresas mercado trabalho Brasil when:7d","IA e gestão":"inteligência artificial gestão empresas trabalho when:7d","Carreira":"carreira desenvolvimento profissional empresas when:7d"}
HEADERS={"User-Agent":"Mozilla/5.0 (compatible; BastidorGestaoEmPauta/1.0)"}
def clean(t): return re.sub(r"<[^>]+>","",unescape(t or "")).strip()
def date(v):
 try:return parsedate_to_datetime(v).date().isoformat()
 except:return datetime.now(timezone.utc).date().isoformat()
def feed(query,limit):
 url="https://news.google.com/rss/search?q="+quote(query)+"&hl=pt-BR&gl=BR&ceid=BR:pt-419"
 try:root=ET.fromstring(urlopen(Request(url,headers=HEADERS),timeout=25).read())
 except Exception as e: print("Falha",e);return []
 return [{"title":clean(i.findtext("title")),"source":clean(i.findtext("source")) or "Google Notícias","date":date(i.findtext("pubDate") or ""),"url":i.findtext("link")} for i in root.findall("./channel/item")[:limit] if i.findtext("title") and i.findtext("link")]
def origin(title):
 candidates=feed('"'+title+'"',5)
 if not candidates:return {"found":False}
 earliest=min(candidates,key=lambda x:x["date"]);return {"found":True,**earliest}
items=[];seen=set()
for theme,q in QUERIES.items():
 for x in feed(q,4):
  key=(x["title"]+x["source"]).lower()
  if key in seen:continue
  seen.add(key);items.append({"id":re.sub(r"[^a-z0-9]+","-",key.lower())[:90],"theme":theme,**x,"summary":"Notícia coletada para triagem editorial. Confirme os fatos na fonte e avalie sua relação com liderança, pessoas, trabalho e gestão.","origin":origin(x["title"])})
items.sort(key=lambda x:x["date"],reverse=True)
Path("data/news.json").write_text(json.dumps({"updatedAt":datetime.now(timezone.utc).date().isoformat(),"items":items},ensure_ascii=False,indent=2),encoding="utf-8")
