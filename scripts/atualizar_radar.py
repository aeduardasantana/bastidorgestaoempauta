from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from html import unescape
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request, urlopen
import json, re, xml.etree.ElementTree as ET

# Eixos editoriais definidos para o Gestão em Pauta.
QUERIES = {
    "Liderança": "liderança gestão empresas when:7d",
    "Riscos psicossociais": "riscos psicossociais saúde mental trabalho when:7d",
    "NR-1 / AEP": "NR-1 AEP riscos psicossociais empresas when:14d",
    "Mercado e trabalho": "empresas mercado trabalho Brasil when:7d",
    "IA e gestão": "inteligência artificial gestão empresas trabalho when:7d",
    "Carreira": "carreira desenvolvimento profissional empresas when:7d",
}
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; BastidorGestaoEmPauta/1.0)"}

def clean(text):
    return re.sub(r"<[^>]+>", "", unescape(text or "")).strip()

def publication_date(raw):
    try:
        return parsedate_to_datetime(raw).date().isoformat()
    except Exception:
        return datetime.now(timezone.utc).date().isoformat()

items, seen = [], set()
for theme, query in QUERIES.items():
    url = "https://news.google.com/rss/search?q=" + quote(query) + "&hl=pt-BR&gl=BR&ceid=BR:pt-419"
    try:
        request = Request(url, headers=HEADERS)
        root = ET.fromstring(urlopen(request, timeout=30).read())
    except Exception as error:
        print("Falha:", theme, error)
        continue
    for item in root.findall("./channel/item")[:10]:
        title = clean(item.findtext("title"))
        link = item.findtext("link")
        source = clean(item.findtext("source")) or "Google Notícias"
        raw_date = item.findtext("pubDate") or ""
        key = (title + source).lower()
        if not title or not link or key in seen:
            continue
        seen.add(key)
        items.append({
            "id": re.sub(r"[^a-z0-9]+", "-", key.lower())[:90],
            "theme": theme,
            "date": publication_date(raw_date),
            "source": source,
            "title": title,
            "summary": "Notícia coletada para triagem editorial. Confirme os fatos na fonte e avalie sua relação com liderança, pessoas, trabalho e gestão.",
            "url": link
        })
items.sort(key=lambda item: item["date"], reverse=True)
output = {"updatedAt": datetime.now(timezone.utc).date().isoformat(), "items": items}
Path("data/news.json").write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
