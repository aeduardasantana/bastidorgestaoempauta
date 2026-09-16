from datetime import datetime, timezone
from html import unescape
from pathlib import Path
from urllib.parse import quote
from urllib.request import urlopen
import json, re, xml.etree.ElementTree as ET

QUERIES = {
    "Liderança": "liderança gestão empresas",
    "Riscos psicossociais": "riscos psicossociais trabalho empresas",
    "NR-1 / AEP": "NR-1 AEP riscos psicossociais",
    "Mercado e trabalho": "mercado de trabalho empresas Brasil",
    "IA e gestão": "inteligência artificial gestão empresas",
    "Carreira": "carreira desenvolvimento profissional empresas",
}

def clean(text):
    return re.sub(r"<[^>]+>", "", unescape(text or "")).strip()

items, seen = [], set()
for theme, query in QUERIES.items():
    url = "https://news.google.com/rss/search?q=" + quote(query) + "&hl=pt-BR&gl=BR&ceid=BR:pt-419"
    try:
        root = ET.fromstring(urlopen(url, timeout=20).read())
    except Exception as error:
        print("Falha:", theme, error)
        continue
    for item in root.findall("./channel/item")[:7]:
        title = clean(item.findtext("title"))
        link = item.findtext("link")
        source = item.findtext("source") or "Google Notícias"
        date = item.findtext("pubDate") or ""
        key = title.lower()
        if not title or key in seen:
            continue
        seen.add(key)
        items.append({"id": re.sub(r"[^a-z0-9]+","-",key.lower())[:80], "theme": theme, "date": datetime.now().date().isoformat(), "source": source, "title": title, "summary": "Notícia coletada para triagem editorial. Abra a fonte, confirme os fatos e defina a leitura de gestão antes de gravar.", "url": link})
output = {"updatedAt": datetime.now(timezone.utc).date().isoformat(), "items": items}
Path("data/news.json").write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
