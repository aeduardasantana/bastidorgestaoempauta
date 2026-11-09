import importlib.util
import io
import json
import tempfile
from datetime import datetime,timezone
from email.utils import format_datetime
from pathlib import Path
from unittest.mock import patch

spec=importlib.util.spec_from_file_location("radar",Path(__file__).parents[1]/"scripts"/"atualizar_radar.py")
radar=importlib.util.module_from_spec(spec)
# Evita executar a coleta no import: carregamos apenas definições anteriores ao bloco operacional.
source=(Path(__file__).parents[1]/"scripts"/"atualizar_radar.py").read_text(encoding="utf-8")
prefix=source.split("\n# --- EXECUÇÃO DA COLETA ---",1)[0]
exec(compile(prefix,"atualizar_radar.py","exec"),radar.__dict__)

CASES=[
 ("Gigante chinesa anuncia fábrica no Brasil com 10 mil empregos","Veículos regionais — Norte e Nordeste","Repercussão jornalística",60,100),
 ("Centenárias renovam mix e operações sem abandonar legado","Veículos BR — Valor","Repercussão jornalística",60,100),
 ("Para virar a chave, McLaren injeta £ 500 milhões e vai estrear na pista dos SUVs","Veículos BR — NeoFeed e Bloomberg Línea","Repercussão jornalística",60,100),
 ("Rock in Rio bate recorde de marcas e atrai negócios","Patrocínio e experiência de marca","Repercussão jornalística",50,100),
 ("Gaúcha FCC expande produção de poliuretano","Veículos BR — Valor","Repercussão jornalística",60,100),
 ("Ri Happy troca de dono e ex-CEO retorna para a operação da companhia","Veículos BR — NeoFeed e Bloomberg Línea","Repercussão jornalística",60,100),
 ("Veja como ficam poupança e outros investimentos com nova taxa básica de juros a 13,75% ao ano","Veículos BR — Band, SBT, Record e Jovem Pan","Repercussão jornalística",0,20),
 ("Lula defende investimento na formação de jovens para faculdade e emprego","Veículos BR — Band, SBT, Record e Jovem Pan","Repercussão jornalística",0,30),
 ("Comissão do Congresso adia votação da MP do fim da taxa das blusinhas","Empresa em Pauta","Repercussão jornalística",0,50),
]

def main():
 failures=[]
 for title,agenda,evidence,minimum,maximum in CASES:
  score=radar.editorial_potential(title,agenda,evidence)["score"]*10
  if not minimum<=score<=maximum:failures.append((title,score,minimum,maximum))
 if failures:
  for row in failures:print("FAIL",row)
  raise SystemExit(1)

 vague="'Não tem guerra no delivery. É competição', diz presidente do iFood"
 context="A empresa investe R$ 24 bilhões, amplia operações e destina R$ 2 bilhões à inteligência artificial."
 title_only=radar.editorial_potential(vague,"Empresa em Pauta","Repercussão jornalística")["score"]
 with_context=radar.editorial_potential(vague,"Empresa em Pauta","Repercussão jornalística",context)["score"]
 if with_context<=title_only:failures.append(("contexto RSS não elevou sinal material",title_only,with_context))

 endpoints=radar.load_matrix_endpoints(Path(__file__).parents[1]/"data"/"sources.json")
 if len(endpoints)<7:failures.append(("matriz sem cobertura direta suficiente",len(endpoints),7))
 if not {"Exame","Agência Brasil","Agência Senado","Agência Câmara","Brazil Journal","NeoFeed","Times Brasil | CNBC"}.issubset({x["name"] for x in endpoints}):
  failures.append(("fontes diretas esperadas ausentes",sorted(x["name"] for x in endpoints)))

 today=datetime.now(timezone.utc)
 xml=f'''<rss><channel><item><title>Empresa anuncia nova fábrica e investimento de R$ 500 milhões</title><link>https://fonte.example/noticia?utm_source=teste</link><pubDate>{format_datetime(today)}</pubDate><description>Companhia amplia produção, operação e empregos no Brasil.</description></item></channel></rss>'''.encode()
 endpoint={"name":"Fonte teste","url":"https://fonte.example/feed","agenda":"Empresa em Pauta","impact":"Operação e estratégia","scope":"Nacional","territory":"Brasil","locale":"br","maxItems":5,"matrixSource":"Teste"}
 with patch.object(radar,"urlopen",return_value=io.BytesIO(xml)):
  direct=radar.direct_feed(endpoint)
 if len(direct)!=1 or direct[0]["url"]!="https://fonte.example/noticia" or direct[0]["discoveryAdapter"]!="direct_rss":
  failures.append(("adaptador RSS direto",direct))

 with tempfile.TemporaryDirectory() as folder:
  path=Path(folder)/"news.json"
  path.write_text(json.dumps({"items":[{"date":today.date().isoformat(),"bodyAnalysis":{"status":"analisado"}},{"date":today.date().isoformat()}]}),encoding="utf-8")
  curated=radar.load_curated_items(path)
 if len(curated)!=1:failures.append(("preservação de curadoria",len(curated),1))

 if failures:
  for row in failures:print("FAIL",row)
  raise SystemExit(1)
 print(f"OK: {len(CASES)} regressões, matriz direta, RSS, contexto e preservação de curadoria.")

if __name__=="__main__":main()
