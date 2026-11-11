const studyRefs={
"Empresa em Pauta":[["Livro","PORTER, Michael. Competitive Strategy."],["Artigo","BARNEY, Jay. Firm Resources and Sustained Competitive Advantage. Journal of Management, 1991."]],
"Poder e regras":[["Artigo","OLIVER, Christine. Strategic Responses to Institutional Processes. Academy of Management Review, 1991."],["Livro","NORTH, Douglass. Institutions, Institutional Change and Economic Performance."]],
"Mercado e trabalho":[["Livro","MANKIW, N. Gregory. Principles of Economics."],["Artigo","PORTER, Michael. The Five Competitive Forces That Shape Strategy. Harvard Business Review, 2008."]],
"Relações internacionais":[["Livro","GHEMAWAT, Pankaj. World 3.0."],["Artigo","HOUSE et al. Cultural Influences on Leadership and Organizations: Project GLOBE. Advances in Global Leadership, 1999."]],
"Trabalho e representação":[["Livro","FREEMAN, Richard; MEDOFF, James. What Do Unions Do?"],["Artigo","BUDD, John. The Ethics of Labor Relations. Labor Studies Journal, 2004."]],
"Pessoas e liderança":[["Livro","YUKL, Gary. Leadership in Organizations."],["Artigo","EDMONDSON, Amy. Psychological Safety and Learning Behavior in Work Teams. Administrative Science Quarterly, 1999."]],
"NR-1 / AEP":[["Norma","ISO 45003 - Psychological health and safety at work."],["Livro","COX, Tom; GRIFFITHS, Amanda; RIAL-GONZÁLEZ, Eu. Research on Work-related Stress."]],
"IA e gestão":[["Livro","BRYNJOLFSSON, Erik; MCAFEE, Andrew. The Second Machine Age."],["Artigo","JARRAHI, Mohammad. Artificial intelligence and the future of work. Business Horizons, 2018."]],
"Mundo corporativo internacional":[["Livro","HOFSTEDE, Geert. Cultures and Organizations."],["Artigo","HOUSE et al. Project GLOBE. Advances in Global Leadership, 1999."]]
};
function studyBlock(item){const refs=studyRefs[item.agenda]||studyRefs["Pessoas e liderança"];return '<div class="detail-box"><b>Fontes teóricas para estudar antes de gravar:</b><br>'+refs.map(r=>'<b>'+r[0]+':</b> '+r[1]).join('<br>')+'<br><small>Use como base de estudo; confirme a edição, DOI ou acesso institucional antes de citar.</small></div>'}
document.addEventListener("click",e=>{const b=e.target.closest(".detail-button");if(!b)return;setTimeout(()=>{const title=document.querySelector("#detailTitle")?.textContent;const item=news.find(x=>x.title===title);if(item&&!document.querySelector("#studyRefs")){const wrap=document.createElement("div");wrap.id="studyRefs";wrap.innerHTML=studyBlock(item);document.querySelector("#detailContent").append(wrap)}},0)});
function editPauta(){const list=document.querySelector("#pautaList"),items=Object.values(selections);list.innerHTML=items.length?items.map(x=>'<div class="detail-box"><b>'+x.title+'</b><br><small>'+x.agenda+' - '+x.source+'</small><br><label>Destino <select data-status="'+x.id+'"><option value="">Classificar depois</option><option value="gravar">Gravar agora</option><option value="giro">Reservar para o Giro</option><option value="acompanhar">Acompanhar</option><option value="nao-usar">Não usar</option></select></label> <button class="text-button" data-remove="'+x.id+'">Remover</button></div>').join(""):"<p>Nenhuma notícia na pauta.</p>";list.querySelectorAll("[data-status]").forEach(s=>{s.value=selections[s.dataset.status].status||"";s.onchange=()=>{selections[s.dataset.status].status=s.value;save();editPauta()}});list.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>{delete selections[b.dataset.remove];save();editPauta()});document.querySelector("#pautaDialog").showModal()}
document.querySelector("#editPauta").onclick=editPauta;document.querySelector("[data-close-pauta]").onclick=()=>document.querySelector("#pautaDialog").close();

const copyDetailButton=document.createElement("button");copyDetailButton.type="button";copyDetailButton.className="text-button copy-detail";copyDetailButton.textContent="⧉ Copiar análise";copyDetailButton.title="Copiar todas as informações para analisar no ChatGPT";document.querySelector("#detailDialog .dialog-head [data-close]").before(copyDetailButton);
function currentDetailItem(){const title=document.querySelector("#detailTitle")?.textContent;return [...news,...videos].find(item=>item.title===title)}
function copyFallback(text){const area=document.createElement("textarea");area.value=text;area.setAttribute("readonly","");area.style.position="fixed";area.style.opacity="0";document.body.append(area);area.select();document.execCommand("copy");area.remove()}
const orientacaoTeoricaParaRoteiro = `FUNDAMENTAÇÃO E VOZ AUTORAL PARA O FUTURO ROTEIRO DO GESTÃO EM PAUTA
O conteúdo seguirá para o Chat 3 (Estruturação/Espelho), que redigirá o roteiro somente com base nos fatos validados nesta curadoria. Preserve a separação entre as etapas.

A voz do programa é de Eduarda Bispo, CEO do GEB e estrategista de negócios com foco em Desenvolvimento Humano Aplicado ao Trabalho. Ela interpreta acontecimentos para empresários, gestores e lideranças; não atua como leitora de manchetes, jornalista de bancada nem comentarista partidária. O roteiro deve soar como análise própria, em português brasileiro oral e natural, com clareza, precisão e utilidade gerencial.

Na CURADORIA, identifique se alguma teoria ajuda a explicar a questão de gestão concreta presente na notícia. Considere autores clássicos e contemporâneos conforme pertinência, sem limitar nem forçar nomes: Chiavenato (administração e pessoas), Peter Drucker (gestão e decisões), Maslow e Herzberg (motivação, com limites dos modelos clássicos), Edgar Schein (cultura), Mintzberg (organizações e trabalho gerencial), Porter (estratégia), Kotter (mudança), Amy Edmondson (segurança psicológica), Deci e Ryan (autodeterminação), Maslach, Karasek, Siegrist e Bakker/Demerouti (trabalho, demandas e riscos psicossociais). Esses são exemplos de repertório, NÃO uma lista obrigatória nem evidência sobre o fato.

Para cada conexão teórica realmente útil, entregue: (a) autor e conceito; (b) obra, estudo ou norma identificável e verificável, sem inventar referências, citações, páginas ou DOI; (c) qual fato validado ou pergunta gerencial o conceito ilumina; (d) limites da aplicação, distinguindo modelo histórico, interpretação e evidência empírica. Se não houver conexão sólida, indique "nenhuma referência teórica necessária".

No PACOTE para o Chat 3, inclua apenas as referências validadas e sugestões breves de aplicação, para que a teoria apareça naturalmente quando enriquecer a fala. Não cite autores apenas para ornamentar. Não atribua burnout, ansiedade, insegurança psicológica, assédio ou riscos da NR-1 a um caso específico sem evidência; se pertinente, formule perguntas em vez de afirmações.

A sequência de análise a considerar, quando couber, é: fato verificável → decisão empresarial → organização do trabalho → implicações para pessoas → responsabilidade da liderança. Nem toda notícia permitirá todas as conexões. Evite promessas de acompanhamento futuro e conclusões jurídicas ou clínicas não sustentadas.`;

async function copyDetailForChatGPT(){await gpEditorialHistoryReady;const item=currentDetailItem(),content=document.querySelector("#detailContent")?.innerText.trim()||"",text=`GESTÃO EM PAUTA - SOLICITAÇÃO DE ANÁLISE EDITORIAL

NOTÍCIA LOCALIZADA
Título: ${item?.title||document.querySelector("#detailTitle")?.textContent||""}
Fonte: ${item?.source||"Não identificada"}
Data: ${item?.date||"Não identificada"}
Link: ${item?.url||"Não disponível"}
Agenda preliminar: ${item?.agenda||"Não classificada"}
RASTRO DA BUSCA:
${item?gpTraceText(item):"Sem notícia identificada"}
HISTÓRICO EDITORIAL:
${item?gpCoverageText(item):"Sem notícia identificada"}

DADOS COPIADOS DA JANELA “ORIGEM, USO E SEGURANÇA EDITORIAL”
${content}

TAREFA — CURADORIA INDIVIDUAL PARA FINALISTA OU DÚVIDA DECISIVA

Esta ficha detalhada é complementar, não obrigatória para toda notícia. Use-a quando a CURADORIA GERAL solicitar explicitamente o ID/título desta matéria por faltar confirmação do fato, cronologia, corpo da fonte, impacto ou possibilidade de repetição. Se a notícia já foi suficientemente apurada, não duplicar investigação.

Abra a reportagem original em vez de ficar apenas no link do agregador. Confira corpo, anúncio original, data real e fontes pertinentes. Os campos automáticos de 'Inteligência de audiência', 'Gancho', 'Miniatura', palavras-chave e referências teóricas são HIPÓTESES PRELIMINARES, não decisões de pauta, avaliações reais do público nem dados validados. Não assumir que o público se limita a líderes e RH.

ENTREGAR FICHA OBJETIVA:
1. ACONTECIMENTO E CRONOLOGIA: o fato em uma frase simples; quando ocorreu, quando foi publicado e qual parte é realmente nova.
2. PROVAS E LIMITES: fonte primária/independente; dados confirmados, números atribuídos, riscos de desatualização e ponto ainda incerto.
3. CONTINUIDADE: evento comparado às últimas edições, inclusive empresas secundárias; mesmo fato ou novidade material?
4. INTERESSE PARA QUEM OUVE: contar em linguagem compreensível para alguém interessado em notícias, sem formação em gestão. Que detalhe desperta curiosidade e que descoberta vem depois?
5. CONSEQUÊNCIA CONCRETA: qual pessoa, negócio, trabalhador, fornecedor, parceiro ou consumidor entra na história e por qual relação efetiva? Sem explicar genericamente que 'impacta empresas'.
6. CONCEITO OU TEORIA (OPCIONAL): apenas se ajuda a interpretar um mecanismo real da notícia; explicar primeiro em palavras comuns. Confirmar autor, obra e referência antes de citar. Não forçar um autor em toda matéria.
7. CHAMADA E PARTICIPAÇÃO: chamada oral curta, elemento visual específico e pergunta interessante para comentário, sem usar slogan padronizado.
8. DESTINAÇÃO: PRINCIPAL / COMPLEMENTAR / RADAR / ACOMPANHAR / RESERVA / DESCARTAR; indicar se PRONTA ou se falta uma fonte decisiva.

Entregar a ficha para a CURADORIA GERAL consolidar a seleção. Não escrever o roteiro integral nem gerar Slides. Não alterar score, fontes, matriz ou arquitetura dos três chats.`;try{await navigator.clipboard.writeText(text)}catch{copyFallback(text)}copyDetailButton.textContent="✓ Copiado";setTimeout(()=>copyDetailButton.textContent="⧉ Copiar análise",1800)}
copyDetailButton.onclick=copyDetailForChatGPT;

// A curadoria por API está desativada. Coleta, filtros e classificação são gratuitos.
function triageLabel(value){return value>=81?"Prioridade muito alta":value>=61?"Prioridade alta":value>=41?"Prioridade média":value>=21?"Prioridade baixa":"Prioridade muito baixa"}
function scoreBasis(x){if(x.bodyAnalysis?.status?.startsWith("analisado"))return "Matriz aplicada ao corpo já validado; o veredito editorial aparece abaixo.";if(x.discoveryAdapter==="direct_rss")return "Potencial preliminar calculado com título, fonte e resumo do canal canônico da matriz.";return "Potencial preliminar calculado por título, fonte e metadados da descoberta ampla."}
function scoreInfo(x){const raw=x.editorialPotential?.score;const value=Number.isFinite(raw)?Math.max(0,Math.min(100,Math.round(raw*10))):(x.score===null||x.score===undefined?null:Math.max(0,Math.min(100,x.score>11?Math.round(x.score):Math.round(((x.score-3)/8)*100))));if(value===null)return {value:null,label:"Em cálculo",note:"Sem dados suficientes para priorizar."};return {value,label:triageLabel(value),note:scoreBasis(x)}}
function potentialBox(x){const p=x.editorialPotential;if(!p)return '<div class="detail-box warn"><b>Prioridade de investigação ainda não calculada.</b><br>Aguarde a próxima atualização do radar.</div>';const questions=(p.questions||[]).map(q=>'<li>'+plain(q)+'</li>').join(""),missing=(p.missing||[]).map(q=>'<li>'+plain(q)+'</li>').join(""),related=(x.relatedSources||[]).map(s=>'<li><a href="'+safeUrl(s.url)+'" target="_blank" rel="noopener">'+plain(s.source)+' - '+plain(s.title)+'</a></li>').join("");return '<div class="detail-box"><b>Hipóteses de investigação</b><br><small>'+plain(scoreBasis(x))+'</small><br><br><b>Prioridade de investigação:</b> '+p.score+'/10<br><b>Cenário a verificar:</b> '+plain(p.event)+'<br><b>Porta de entrada a verificar:</b> '+plain(p.economicTrigger)+'<br><b>Hipótese organizacional a investigar:</b> '+plain(p.organizationalHypothesis)+(questions?'<br><b>Perguntas para validar no corpo:</b><ul>'+questions+'</ul>':"")+(missing?'<b>Ainda precisa confirmar:</b><ul>'+missing+'</ul>':"")+(related?'<b>Outras fontes do mesmo acontecimento:</b><ul>'+related+'</ul>':"")+'</div>'}
function analysisBox(x){const preliminary=potentialBox(x),b=x.bodyAnalysis;if(!b)return preliminary+'<div class="detail-box warn"><b>Triagem manual.</b><br>Abra a fonte e confirme fatos, datas, envolvidos e consequências antes de decidir. O sistema não está utilizando a API da OpenAI.</div>';if(!b.status?.startsWith("analisado"))return preliminary+'<div class="detail-box warn"><b>Revisão manual necessária:</b><br>'+plain(b.reason||"O corpo da publicação não pôde ser validado.")+'</div>';const e=b.editorial||{},r=b.relevance||{},facts=(b.facts_confirmed||[]).map(v=>'<li>'+plain(v)+'</li>').join(""),statements=(b.source_statements||[]).map(v=>'<li>'+plain(v)+'</li>').join(""),consequences=(b.managerial_consequences||[]).map(v=>'<li>'+plain(v)+'</li>').join("");return preliminary+'<div class="detail-box"><b>Curadoria já realizada</b><br><small>Resultado preservado da execução anterior. Nenhuma nova análise por API será feita.</small><br><br><b>Veredito:</b> '+plain(r.verdict||"A validar")+' - '+plain(r.reason||"")+'<br><b>Manchete sugerida:</b> '+plain(e.headline||"")+'<br><b>Prévia de fala:</b> '+plain(e.speaking_preview||"")+(facts?'<br><br><b>Fatos confirmados:</b><ul>'+facts+'</ul>':"")+(statements?'<b>Declarações atribuídas:</b><ul>'+statements+'</ul>':"")+(consequences?'<b>Consequências gerenciais:</b><ul>'+consequences+'</ul>':"")+'<b>Restrições de uso:</b> '+plain(b.restrictions||b.source_owner_note||"Usar redação própria e atribuir a fonte.")+'<br><b>Cuidado editorial:</b> '+plain(b.caution||"Validar fonte e contexto.")+'</div>'}

function decorateCuratedCards(){document.querySelectorAll(".news-card").forEach(card=>{if(card.querySelector(".curation-verdict"))return;const item=[...news,...videos].find(x=>x.title===card.querySelector("h4")?.textContent),analysis=item?.bodyAnalysis,p=item?.editorialPotential;if(!item)return;const box=document.createElement("div"),priority=scoreInfo(item);box.className="curation-verdict "+(analysis?.status?.startsWith("analisado")?"ready":((priority.value??100)<=20?"manual":"preliminary"));box.innerHTML=analysis?.status?.startsWith("analisado")?'<b>'+plain(analysis.relevance?.verdict||"Conteúdo já analisado")+'</b><span>Curadoria anterior do corpo preservada</span>':'<b>'+plain(priority.label)+'</b><span>'+(p?plain(p.event)+' - hipótese de investigação a validar na fonte':'Aguardando atualização do radar')+'</span>';card.querySelector(".summary").after(box)})}
const gridObserver=new MutationObserver(()=>{decorateCuratedCards();gpDecorateTraceCards()});gridObserver.observe(document.querySelector("#newsGrid"),{childList:true});
document.head.insertAdjacentHTML("beforeend",'<style>.copy-detail{margin-left:auto;margin-right:8px;padding:5px 7px;white-space:nowrap;text-decoration:none;font-size:11px;color:#80561f;border:1px solid transparent;border-radius:3px}.copy-detail:hover{border-color:#d8d2c7;background:#f2eee6}.results-actions{display:flex;align-items:center;justify-content:flex-end;gap:8px;flex-wrap:wrap}.copy-results{padding:6px 8px;white-space:nowrap;text-decoration:none;font-size:11px;color:#80561f;border:1px solid #d8d2c7;border-radius:3px;background:transparent}.copy-results:hover{background:#f2eee6;border-color:#b48b53}.copy-results:disabled{color:#899099;border-color:#ddd8cf;cursor:not-allowed}.curation-verdict{padding:10px 12px;background:#e5eee9;border-left:3px solid #1f4b42;display:grid;gap:4px;font-size:12px}.curation-verdict.preliminary{background:#edf0f2;border-color:#718596}.curation-verdict.manual{background:#f5e7df;border-color:#9b5c3b}.curation-verdict span{color:#52606c;line-height:1.35}@media(max-width:600px){.copy-detail{margin-left:auto}.results-actions{justify-content:flex-start}}</style>');

const potentialLabel=document.createElement("label");potentialLabel.innerHTML='Prioridade de triagem<select id="potentialFilter"><option value="Todos">Todas as prioridades</option><option value="muito-alta">Muito alta</option><option value="alta">Alta</option><option value="media">Média</option><option value="baixa">Baixa</option><option value="muito-baixa">Muito baixa</option></select>';document.querySelector("#apply").before(potentialLabel);
function triageBand(item){const value=scoreInfo(item).value??-1;return value>=81?"muito-alta":value>=61?"alta":value>=41?"media":value>=21?"baixa":"muito-baixa"}
const filterBeforePotential=filter;filter=function(){const items=filterBeforePotential(),choice=document.querySelector("#potentialFilter")?.value||"Todos";return choice==="Todos"?items:items.filter(x=>triageBand(x)===choice)};
document.querySelector("#potentialFilter").onchange=render;
document.querySelector(".notice small").innerHTML='<b>Prioridade de triagem:</b> 0–20 muito baixa · 21–40 baixa · 41–60 média · 61–80 alta · 81–100 muito alta. A matriz usa corpo validado quando disponível; nos demais casos, usa fonte direta ou metadados da descoberta ampla. Não determina sozinha o uso editorial.';

const copyResultsButton=document.createElement("button");copyResultsButton.type="button";copyResultsButton.className="text-button copy-results";copyResultsButton.title="Copiar os resultados filtrados para uma curadoria geral no ChatGPT";
const resultsActions=document.createElement("div");resultsActions.className="results-actions";const clearSelectionButton=document.querySelector("#clearSelection");clearSelectionButton.before(resultsActions);resultsActions.append(copyResultsButton,clearSelectionButton);
function selectedOptionText(selector){const select=document.querySelector(selector);return select?.selectedOptions?.[0]?.textContent?.trim()||"Não informado"}
function listText(values){return Array.isArray(values)&&values.length?values.map(value=>`- ${value}`).join("\n"):"- Não informado"}
/* Rastreabilidade da execução e histórico editorial: independente de score e filtros. */
let gpEditorialHistory={editions:[]},gpEditorialHistoryLoaded=false;
function gpRunId(){return radarRunInfo?.runId||"legado-sem-identificador"}
function gpDateTime(iso){if(!iso)return "horário não registrado";const d=new Date(iso);return Number.isNaN(d.getTime())?String(iso):new Intl.DateTimeFormat("pt-BR",{timeZone:"America/Sao_Paulo",day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:false}).format(d)+" (Brasília)"}
function gpNormalizeText(value){return String(value||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim()}
function gpCoverageMatches(item){const searchable=" "+gpNormalizeText([item.title,item.summary].join(" "))+" ",hits=[];for(const edition of gpEditorialHistory.editions||[]){for(const topic of edition.topics||[]){const term=(topic.terms||[]).find(x=>{const q=gpNormalizeText(x);return q&&searchable.includes(" "+q+" ")});if(term)hits.push({edition:edition.number,date:edition.date,topic:topic.title,match:term,basis:edition.status})}}return hits}
function gpTraceText(item){const tr=item.radarTrace||{},run=radarRunInfo||{},first=tr.firstSeenAt?gpDateTime(tr.firstSeenAt):(tr.legacyFirstSeenDate?tr.legacyFirstSeenDate+" (horário não registrado, histórico anterior)":"anterior ao registro ou desconhecida");const status=tr.foundInCurrentRun===false?"Preservada de análise anterior; não confirmada na busca atual":tr.foundInCurrentRun===true?"Localizada nesta execução":"Presença na busca sem rastreio histórico";const recurrence=tr.seenBeforeThisRun===true?"Já constava do histórico do radar":tr.seenBeforeThisRun===false?"Primeira aparição conhecida nesta execução":"Histórico de reaparição não disponível";return ["Identificador da notícia no radar: "+(item.id||"não informado"),"ID da atualização exportada: "+gpRunId(),"Data/hora da atualização: "+gpDateTime(run.generatedAt),"Data de publicação exibida pela fonte: "+(item.date||"não informada"),"Primeira aparição registrada no radar: "+first,"Condição da coleta: "+status,"Comparação com atualizações anteriores: "+recurrence,"Rota de descoberta: "+(item.discoveryAdapter||"não registrada")+" / "+(item.matrixSource||"matriz não identificada")].join("\n")}
function gpCoverageText(item){if(!gpEditorialHistoryLoaded)return "Histórico editorial ainda indisponível: não concluir que a notícia é inédita.";const hits=gpCoverageMatches(item);return hits.length?hits.map(x=>"Edição "+x.edition+" ("+x.date+"): "+x.topic+"; termo coincidente '"+x.match+"' — alerta de empresa/tema, não prova de repetição do mesmo fato").join("\n"):"Sem correspondência literal com o histórico de temas 001/002. Isso não comprova ineditismo."}
function gpDecorateTraceCards(){document.querySelectorAll("#newsGrid .news-card").forEach(card=>{const title=card.querySelector("h4")?.textContent,item=[...news,...videos].find(x=>x.title===title);if(!item)return;let el=card.querySelector(".gp-trace-card");if(!el){el=document.createElement("div");el.className="gp-trace-card";card.querySelector(".summary")?.after(el)}const hits=gpCoverageMatches(item);const tr=item.radarTrace||{};const first=tr.firstSeenAt?gpDateTime(tr.firstSeenAt):(tr.legacyFirstSeenDate?tr.legacyFirstSeenDate+" · sem horário":"histórico indisponível");el.textContent="Busca: "+gpRunId()+" · "+(radarRunInfo?.generatedAt?gpDateTime(radarRunInfo.generatedAt):"sem horário antigo")+" | Primeiro registro: "+first+(hits.length?" | Atenção: "+hits.slice(0,2).map(x=>"E"+x.edition+" — "+x.topic).join("; "):" | Sem coincidência literal nas edições registradas");});}
const gpEditorialHistoryReady=fetch("data/editorial-history.json?"+Date.now()).then(r=>{if(!r.ok)throw Error("histórico indisponível");return r.json()}).then(x=>{gpEditorialHistory=x;gpEditorialHistoryLoaded=true}).catch(()=>{gpEditorialHistoryLoaded=false}).finally(()=>gpDecorateTraceCards());
document.head.insertAdjacentHTML("beforeend",'<style>.gp-trace-card{font:11px/1.55 "DM Sans",Arial,sans-serif;color:#4e5961;border-top:1px solid #ddd7cd;padding:8px 0;margin-top:5px;overflow-wrap:anywhere}</style>');

function resultForChatGPT(item,index){const potential=item.editorialPotential||{},body=item.bodyAnalysis||{},origin=item.origin||{},related=item.relatedSources||[],audience=audienceFor(item),packaging=packagingFor(item),use=item.use||{};const bodyRecord=Object.keys(body).length?JSON.stringify(body,null,2):"Nenhuma análise individual do corpo armazenada neste resultado.";const originalRefs=item.references||item.bibliography||item.bibliographicReferences||body.references||body.bibliography||null;const referenceRecord=originalRefs?JSON.stringify(originalRefs,null,2):"Nenhuma referência bibliográfica individual registrada neste resultado.";return `RESULTADO ${index+1}
Título localizado: ${item.title||"Não informado"}
Fonte exibida: ${item.source||"Não identificada"}
Data: ${item.date||"Não identificada"}
${gpTraceText(item)}
Histórico editorial comparativo:
${gpCoverageText(item)}
Link: ${item.url||"Não disponível"}
Agenda: ${item.agenda||"Não classificada"}
Consequência: ${item.impact||"Não classificada"}
Abrangência: ${item.scope||"Não classificada"}
Evidência: ${item.evidence||"Não classificada"}
Resumo coletado: ${item.summary||"Não informado"}
Prioridade de investigação: ${potential.score??"Não calculada"}/10${Number.isFinite(potential.score)?` — ${triageLabel(potential.score*10)}`:""}
Cenário preliminar: ${potential.event||"Não informado"}
Porta de entrada econômica/regulatória: ${potential.economicTrigger||"Não informada"}
Hipótese organizacional: ${potential.organizationalHypothesis||item.angle||"Não informada"}
Perguntas para validar no corpo:
${listText(potential.questions)}
Ainda precisa confirmar:
${listText(potential.missing)}
Publicação mais antiga localizada: ${origin.found?`${origin.source||"Fonte não identificada"} — ${origin.date||"data não identificada"} — ${origin.url||"link não disponível"}`:"Não localizada automaticamente"}
Fontes relacionadas ao mesmo acontecimento:
${related.length?related.map(source=>`- ${source.source||"Fonte não identificada"}: ${source.title||"Sem título"} — ${source.url||"sem link"}`).join("\n"):"- Nenhuma relacionada pelo sistema"}
Uso editorial indicado: ${use.label||"Usar redação própria e atribuir a fonte."}
Alerta de reprodução: ${use.alert||"Confirmar direitos e não reproduzir texto, imagem, vídeo, tabela ou infográfico de terceiros."}
Curadoria anterior do corpo: ${body.status||"Não executada"}${body.relevance?.verdict?` — ${body.relevance.verdict}: ${body.relevance.reason||""}`:""}
Público preliminar: ${audience.public}
Busca provável preliminar: ${audience.search}
Empacotamento preliminar: ${packaging.thumbnail} | ${packaging.keywords}
Referências bibliográficas individuais armazenadas (se houver; verificar a fonte):
${referenceRecord}
Ficha integral de análise do corpo já armazenada no Bastidor (se houver; distinguir status e origem dos campos):
${bodyRecord}`}
function filteredResultsText(){const items=filter(),search=document.querySelector("#searchInput")?.value.trim()||"Sem termo",kind=mode==="news"?"Notícias":"Vídeos";return `GESTÃO EM PAUTA — SOLICITAÇÃO DE CURADORIA GERAL

RESULTADOS ATUALMENTE FILTRADOS NO BASTIDOR
ID da atualização: ${gpRunId()}
Coleta registrada em: ${gpDateTime(radarRunInfo?.generatedAt)}
Data da cópia (não é a data da coleta): ${gpDateTime(new Date().toISOString())}
Origem: ${radarRunInfo?.method||"método não identificado"}
Tipo: ${kind}
Período: ${selectedOptionText("#period")}
Observação sobre o filtro: o radar preserva a data de publicação, mas nem todas as fontes informam a hora exata; “últimas 24 horas” é aproximação por data, não comprovação de janela horária exata.
Agenda: ${selectedOptionText("#agenda")}
Consequência: ${selectedOptionText("#impact")}
Fonte/evidência: ${selectedOptionText("#evidence")}
Abrangência: ${selectedOptionText("#scope")}
Prioridade de triagem: ${selectedOptionText("#potentialFilter")}
Busca digitada: ${search}
Quantidade: ${items.length}

${items.map(resultForChatGPT).join("\n\n────────────────────────────\n\n")}

TAREFA — CURADORIA GERAL PARA O JORNAL DIÁRIO GESTÃO EM PAUTA

A exportação do Bastidor é um lote de descoberta, com ID e horário da busca. A data do agregador não é necessariamente a data do acontecimento; o filtro '24 horas' pode usar apenas o dia. Faça a triagem de todo o lote por metadados, mas não alegue ter lido corpos que não abriu.

1. FILTRAR ACONTECIMENTOS, NÃO SÓ TÍTULOS
Agrupe matérias iguais, versões de veículos e continuidades. Confronte o histórico editorial da edição anterior e de até sete dias disponíveis, inclusive nomes de empresas citadas secundariamente. Separe novo fato, avanço material, mesma notícia, retrospectiva e mesma empresa com fato independente. Uma pontuação baixa não impede uma notícia interessante.

2. CONSTRUIR INTERESSE DE PESSOAS REAIS
O público inclui pessoas que gostam de notícias de empresas mesmo sem curso de negócios: empresários, trabalhadores, famílias, fornecedores, consumidores e gestores. Teste se um ouvinte que NÃO olha a tela compreenderia em linguagem cotidiana o que aconteceu e por que importa. Escolha novidade concreta, personagens, disputa/contraste verificável, decisão surpreendente, efeito reconhecível e descoberta posterior. Evite a lente exclusiva de RH/liderança e ganchos automáticos como 'O QUE MUDA PARA A EMPRESA?'.

3. APURAÇÃO SELETIVA — NÃO PEDIR TODAS AS FICHAS
Investigue com profundidade apenas as candidatas mais fortes. Classifique cada uma como:
PRONTA — acontecimento, fonte, cronologia e relevância suficientes para propor pauta;
PEDIR FICHA INDIVIDUAL — falta elemento decisivo para aprovar, mesmo após tentativa de consultar a fonte;
RESERVA — potencial, porém abaixo das principais ou sem novidade;
DESCARTAR — repetida ou inadequada com justificativa.

Se houver dados realmente faltantes, faça UM PEDIDO AGRUPADO para copiar do Bastidor apenas as fichas de notícias indispensáveis (preferencialmente 1 a 3): ID, título exato, fonte e dúvida objetiva que a ficha deve resolver. Diga exatamente qual campo 'Copiar análise' utilizar. Não solicite fichas que já estejam suficientemente apuradas; não peça confirmação genérica. Quando as fichas chegarem, compare e finalize o pacote sem reiniciar toda a triagem. Sem pendências decisivas, entregue o pacote final diretamente, sem pedir material desnecessário.

4. HIERARQUIA PARA UM JORNAL, NÃO RELATÓRIO
Sugira, conforme a densidade, em geral 3–4 notícias desenvolvidas e 1–2 de radar, sem cota rígida. Favoreça assuntos reconhecíveis e variados com material suficiente para progressão narrativa. Não preencher tempo com análise vaga. Proponha uma ordem provisória e uma tese de edição, a confirmar no Comando 1.

5. SAÍDA PADRÃO
Tabela compacta: título e ID da descoberta | data original e novidade real | a quem interessa e por qual mecanismo | o detalhe que prenderia o ouvinte | repetição? | fontes e limites | PRONTA/PEDIR FICHA/RESERVA/DESCARTAR.
Depois: pauta recomendada, reservas, informações factuais atribuídas, perguntas de apuração restantes, alertas de direitos autorais e temas para comentários. Se houver FICHA PENDENTE DECISIVA, deixar expresso que a seleção NÃO está integralmente validada até recebê-la. Sem pendências, marcar 'PACOTE VALIDADO PARA COMANDO 1'.
Não escrever o roteiro, não gerar Slides nem inventar URLs, fatos ou referências. Sem API paga.`}
function updateCopyResultsButton(){const count=filter().length;copyResultsButton.disabled=!count;copyResultsButton.textContent=count?`⧉ Copiar ${count} resultado${count===1?"":"s"}`:"⧉ Sem resultados"}
async function copyFilteredResults(){await gpEditorialHistoryReady;const text=filteredResultsText();try{await navigator.clipboard.writeText(text)}catch{copyFallback(text)}copyResultsButton.textContent="✓ Resultados copiados";setTimeout(updateCopyResultsButton,1800)}
copyResultsButton.onclick=copyFilteredResults;const copyResultsObserver=new MutationObserver(updateCopyResultsButton);copyResultsObserver.observe(document.querySelector("#newsGrid"),{childList:true});updateCopyResultsButton();


async function loadTrendStrip(){
 const render=(id,items)=>{const el=document.getElementById(id);if(!el)return;el.innerHTML=items?.length?items.slice(0,5).map(x=>{const q=encodeURIComponent(x.term);const href=`https://www.google.com/search?q=${q}`;return `<a class="trend-pill" href="${href}" target="_blank" rel="noopener" title="${x.radarStatus||""}"><i>${x.movement||"→"}</i> <span>${x.term}</span>${x.relatedClusters?.length?'<b> · NO RADAR</b>':''}</a>`}).join(""):'<span class="trend-unavailable">Indisponível nesta atualização</span>'}
 try{
  const data=await fetch("data/trends.json?"+Date.now()).then(r=>{if(!r.ok)throw Error();return r.json()})
  render("trendsBR",data.regions?.BR?.items);render("trendsUS",data.regions?.US?.items)
  const info=document.getElementById("trendsInfo");if(info)info.onclick=()=>alert("Esta faixa mostra atenção pública e não altera score, prioridade ou seleção editorial. “NO RADAR” indica apenas que há notícia relacionada entre os clusters encontrados. China permanece separada até definirmos uma fonte adequada. X será ativado somente por conector oficial sustentável.")
 }catch(e){render("trendsBR",[]);render("trendsUS",[])}
}
loadTrendStrip();


;;


;

/* Central de comandos em /comandos.html: dados isolados de pesquisa, pontuação e filtros. */
