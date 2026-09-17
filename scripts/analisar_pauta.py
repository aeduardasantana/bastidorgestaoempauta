from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen
import json, os, re

API_KEY = os.environ.get("OPENAI_API_KEY", "")
EVENT_PATH = os.environ.get("GITHUB_EVENT_PATH", "")
NEWS_PATH = Path("data/news.json")


def field(body, name):
    match = re.search(rf"^{re.escape(name)}:\s*(.+)$", body, flags=re.I | re.M)
    return match.group(1).strip() if match else ""


def response_text(payload):
    chunks = []
    for output in payload.get("output", []):
        for content in output.get("content", []):
            if isinstance(content.get("text"), str):
                chunks.append(content["text"])
    return "\n".join(chunks) or str(payload.get("output_text", ""))


def json_answer(text):
    start, end = text.find("{"), text.rfind("}")
    if start < 0 or end < start:
        raise ValueError("Resposta sem JSON válido")
    return json.loads(text[start:end + 1])


if not API_KEY:
    raise RuntimeError("OPENAI_API_KEY não configurada")
if not EVENT_PATH:
    raise RuntimeError("Evento do GitHub não localizado")

event = json.loads(Path(EVENT_PATH).read_text(encoding="utf-8"))
issue = event.get("issue", {})
body = issue.get("body", "")
item_id = field(body, "ID")
title = field(body, "Título")
source = field(body, "Fonte")
url = field(body, "URL")

if not item_id or not title or not url:
    raise ValueError("Solicitação incompleta")

radar = json.loads(NEWS_PATH.read_text(encoding="utf-8"))
item = next((candidate for candidate in radar.get("items", []) if candidate.get("id") == item_id), None)
if not item:
    raise ValueError("Notícia não encontrada no radar atual")

instructions = """Você é o analista editorial do Gestão em Pauta, programa empresarial do GEB - Grupo Eduarda Bispo. Localize a publicação original correspondente aos dados recebidos e leia o corpo da fonte original ou o documento oficial relacionado. O título serve apenas para localizar a candidata: não o use como prova. Separe fato confirmado, declaração atribuída e consequência gerencial. Não invente lacunas, não reproduza texto extenso e não dê aconselhamento jurídico. Se não conseguir acessar conteúdo suficiente, retorne manual_review=true e explique.
Avalie a aderência ao Gestão em Pauta, cujo foco é liderança, desenvolvimento humano aplicado ao trabalho, gestão empresarial, riscos, decisões de empresas e consequências de políticas públicas para organizações.
Retorne SOMENTE JSON válido com: manual_review (boolean); reason; factual_summary; facts_confirmed (até 5); source_statements (até 3); relevance {verdict exatamente um entre: Gravar, Giro semanal, Acompanhar, Não usar; reason}; editorial {headline; angle; speaking_preview com até 160 palavras; audience; interest_trigger; search_intent; hashtags com até 6}; managerial_consequences (lista); restrictions; caution; canonical_url; source_owner_note."""

user = f"""ID interno: {item_id}
Título localizado: {title}
Fonte informada: {source}
Link do radar: {url}
Agenda: {item.get('agenda')}
Consequência inicialmente indicada: {item.get('impact')}
Abrangência: {item.get('scope')}"""

payload = {
    "model": "gpt-5.6-terra",
    "tools": [{"type": "web_search"}],
    "input": [
        {"role": "developer", "content": instructions},
        {"role": "user", "content": user},
    ],
    "max_output_tokens": 1800,
}

request = Request(
    "https://api.openai.com/v1/responses",
    data=json.dumps(payload).encode("utf-8"),
    headers={"Authorization": "Bearer " + API_KEY, "Content-Type": "application/json"},
    method="POST",
)

with urlopen(request, timeout=120) as response:
    answer = json_answer(response_text(json.loads(response.read().decode("utf-8"))))

if answer.get("manual_review"):
    analysis = {
        "status": "revisao_manual",
        "reason": answer.get("reason") or "Não foi possível validar o corpo da publicação original.",
        "analyzedAt": datetime.now(timezone.utc).isoformat(),
    }
else:
    analysis = {
        "status": "analisado_sob_demanda",
        "analyzedAt": datetime.now(timezone.utc).isoformat(),
        **answer,
    }
    editorial = answer.get("editorial", {})
    item["summary"] = answer.get("factual_summary") or item.get("summary")
    item["angle"] = editorial.get("angle") or item.get("angle")

item["bodyAnalysis"] = analysis
radar["updatedAt"] = datetime.now(timezone.utc).date().isoformat()
NEWS_PATH.write_text(json.dumps(radar, ensure_ascii=False, indent=2), encoding="utf-8")

