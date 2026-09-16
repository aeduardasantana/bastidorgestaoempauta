# Bastidor - Gestão em Pauta

Central editorial estática para o programa **Gestão em Pauta**, do GEB - Grupo Eduarda Bispo.

## Uso
- Avalie as notícias no Radar Diário.
- Adicione as relevantes à pauta.
- Classifique: Gravar agora, Reservar para o Giro, Acompanhar ou Não usar.
- Gere o briefing e salve como PDF pelo navegador.

A seleção fica armazenada apenas no navegador utilizado.

## Atualização automática
O arquivo `data/news.json` será preenchido pelo workflow `.github/workflows/atualizar-radar.yml`, que coleta RSS do Google Notícias a partir das consultas definidas em `scripts/atualizar_radar.py`.

O domínio personalizado previsto é `bastidorgp.grupoeduardabispo.com.br`.
