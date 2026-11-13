# Bastidor - Gestão em Pauta

Central editorial estática para o programa **Gestão em Pauta**, do GEB - Grupo Eduarda Bispo.

## Uso
- Avalie as notícias no Radar Diário.
- Adicione as relevantes à pauta.
- Classifique: Gravar agora, Reservar para o Giro, Acompanhar ou Não usar.
- Gere o briefing e salve como PDF pelo navegador.

A seleção fica armazenada apenas no navegador utilizado.

## Atualização manual do radar

Desde 13/11/2026, o radar de notícias só é atualizado mediante solicitação explícita. O workflow `.github/workflows/atualizar-radar.yml` tem exclusivamente o gatilho `workflow_dispatch`: não há execução por horário nem por mudanças no código.

O comando diário copiável está na Central de Comandos (`comandos.html`, bloco "Radar · Atualizar buscas"). A execução deve investigar fontes diversas, validar os resultados, atualizar `data/news.json` e diagnósticos pertinentes e conferir o deploy. O fluxo de publicação técnica (`deploy.yml`) continua a sincronizar alterações aprovadas feitas no repositório, sem executar pesquisas por conta própria.

O radar preserva a política de pesquisa da matriz `data/sources.json`. `data/diagnostics.json` documenta a cobertura, ruído e duplicatas da última coleta.


O domínio personalizado previsto é `bastidorgp.grupoeduardabispo.com.br`.
