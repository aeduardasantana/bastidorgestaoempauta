# Bastidor - Gestão em Pauta

Central editorial estática para o programa **Gestão em Pauta**, do GEB - Grupo Eduarda Bispo.

## Uso
- Avalie as notícias no Radar Diário.
- Adicione as relevantes à pauta.
- Classifique: Gravar agora, Reservar para o Giro, Acompanhar ou Não usar.
- Gere o briefing e salve como PDF pelo navegador.

A seleção fica armazenada apenas no navegador utilizado.

## Atualização automática
O workflow `.github/workflows/atualizar-radar.yml` atualiza `data/news.json` em três passagens:

1. abre os RSS canônicos ativados na matriz `data/sources.json`;
2. usa o Google Notícias apenas para descoberta ampla e redundância;
3. expande a busca de origem somente para candidatos fortes ainda sem fonte canônica.

As curadorias com corpo já validado são preservadas entre execuções. `data/diagnostics.json` registra cobertura da matriz, desempenho de cada fonte direta, uso do agregador, expansão de origem, ruído e duplicatas.

O domínio personalizado previsto é `bastidorgp.grupoeduardabispo.com.br`.
