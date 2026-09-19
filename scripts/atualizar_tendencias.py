import json,re
from datetime import datetime,timezone
from pathlib import Path
from urllib.request import Request,urlopen
from xml.etree import ElementTree as ET

HEADERS={"User-Agent":"Mozilla/5.0 (BastidorGestaoEmPauta/1.0)"}
REGIONS={
 "BR":{"label":"Brasil","provider":"Google Trends","active":True},
 "US":{"label":"Estados Unidos","provider":"Google Trends","active":True},
 "CN":{"label":"China","provider":None,"active":False,"note":"Fonte adequada ainda em avaliação; não usar Google como proxy do mercado chinês."}
}

def norm(s):
 import unicodedata
 s=unicodedata.normalize("NFKD",s or "").encode("ascii","ignore").decode().lower()
 return re.sub(r"[^a-z0-9]+"," ",s).strip()

def google_trends(geo,limit=10):
 url=f"https://trends.google.com/trending/rss?geo={geo}"
 try:
  root=ET.fromstring(urlopen(Request(url,headers=HEADERS),timeout=25).read())
  out=[]
  for pos,item in enumerate(root.findall("./channel/item")[:limit],1):
   title=(item.findtext("title") or "").strip()
   if title: out.append({"term":title,"source":"Google Trends","position":pos})
  return out,None
 except Exception as e:return [],str(e)[:180]

def load_news():
 try:return json.loads(Path("data/news.json").read_text(encoding="utf-8")).get("items",[])
 except:return []

def related(term,news):
 tt=set(norm(term).split())
 matches=[]
 for n in news:
  nt=set(norm(n.get("title","")).split())
  shared=tt&nt
  if shared and (len(shared)>=2 or any(len(x)>=6 for x in shared)):
   matches.append({"id":n.get("id"),"title":n.get("title"),"score":n.get("score",0)})
 return sorted(matches,key=lambda x:x["score"],reverse=True)[:5]

def previous():
 try:return json.loads(Path("data/trends.json").read_text(encoding="utf-8"))
 except:return {}

def movement(term,region,position,old):
 olditems=old.get("regions",{}).get(region,{}).get("items",[])
 hit=next((x for x in olditems if norm(x.get("term"))==norm(term)),None)
 if not hit:return "NOVO"
 op=hit.get("position",position)
 return "↑" if position<op else ("↓" if position>op else "→")

news=load_news();old=previous();regions={}
for code,cfg in REGIONS.items():
 if not cfg["active"]:
  regions[code]={**cfg,"status":"planned","items":[]};continue
 items,error=google_trends(code)
 for x in items:
  x["movement"]=movement(x["term"],code,x["position"],old)
  x["relatedClusters"]=related(x["term"],news)
  x["radarStatus"]="EM ALTA + NO RADAR" if x["relatedClusters"] else "EM ALTA + SEM PAUTA"
 regions[code]={**cfg,"status":"ok" if not error else "unavailable","error":error,"items":items}

high=[n for n in news if n.get("score",0)>=80]
trendterms=set()
for reg in regions.values():
 for x in reg.get("items",[]):trendterms|=set(norm(x["term"]).split())
outside=[]
for n in high:
 nt=set(norm(n.get("title","")).split())
 if not any(len(x)>=6 for x in nt&trendterms):
  outside.append({"id":n.get("id"),"title":n.get("title"),"score":n.get("score")})

payload={
 "updatedAt":datetime.now(timezone.utc).isoformat(),
 "principle":"Tendência mede atenção; score mede prioridade de investigação; curadoria determina relevância editorial.",
 "regions":regions,
 "x":{"status":"pending_official_connector","items":[],"note":"Integração não ativada até existir acesso oficial e sustentável aos dados de tendências do X."},
 "outsideHype":{"threshold":80,"count":len(outside),"items":outside},
 "metrics":{
  "trendItems":sum(len(r.get("items",[])) for r in regions.values()),
  "withRadar":sum(1 for r in regions.values() for x in r.get("items",[]) if x.get("relatedClusters")),
  "withoutRadar":sum(1 for r in regions.values() for x in r.get("items",[]) if not x.get("relatedClusters")),
  "highPriorityOutsideTrends":len(outside)
 }
}
Path("data/trends.json").write_text(json.dumps(payload,ensure_ascii=False,indent=2),encoding="utf-8")
print(json.dumps(payload["metrics"],ensure_ascii=False))
