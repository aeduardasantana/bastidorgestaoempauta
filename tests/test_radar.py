import importlib.util
from pathlib import Path

spec=importlib.util.spec_from_file_location("radar",Path(__file__).parents[1]/"scripts"/"atualizar_radar.py")
radar=importlib.util.module_from_spec(spec)
# Evita executar a coleta no import: carregamos apenas definições anteriores ao bloco operacional.
source=(Path(__file__).parents[1]/"scripts"/"atualizar_radar.py").read_text(encoding="utf-8")
prefix=source.split("\nitems=[]; seen=set()",1)[0]
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
 print(f"OK: {len(CASES)} casos de regressão dentro das faixas esperadas.")

if __name__=="__main__":main()
