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

TAREFA PARA O CHATGPT
Esta é a etapa de CURADORIA EDITORIAL. O Bastidor fez apenas descoberta e triagem preliminar por título, fonte e metadados.

Acesse a publicação original e leia o corpo da matéria. O título, o score, o cenário, a porta de entrada e as hipóteses do Bastidor servem apenas para orientar a investigação. Não os trate como prova.

1. Identifique a publicação original ou fonte primária quando possível.
2. Informe a data da publicação e, separadamente, a data do acontecimento principal quando forem diferentes.
2A. Faça busca retrospectiva do fato e de seus anúncios anteriores (ao menos quando houver indício de reapresentação), identificando fonte e data mais antigas confiáveis. Diga se a publicação atual traz fato novo verificável ou apenas recapitula assunto antigo. Não classifique uma compra, negociação, decisão ou processo como novo apenas porque a reportagem é de hoje; se a novidade for resultado trimestral, execução ou nova etapa, escreva esse fato específico.
3. Separe fatos confirmados, declarações atribuídas, análises/opiniões da fonte, hipóteses e inferências.
4. Identifique o fato empresarial, econômico, tecnológico ou regulatório que iniciou ou atualizou o acontecimento.
5. Verifique se existe decisão empresarial concreta.
6. Explique eventual mudança na organização do trabalho apenas quando houver base suficiente.
7. Identifique pessoas ou grupos envolvidos e, quando sustentado pelas fontes, a responsabilidade gerencial ou de liderança.
8. Avalie a aderência ao Gestão em Pauta e ao posicionamento de Desenvolvimento Humano Aplicado ao Trabalho.
9. Não exija que o conteúdo sustente sozinho uma pauta principal. Avalie também seu valor como notícia diária, contexto, acompanhamento ou elemento de uma análise maior.
10. Somente após a apuração, classifique em uma ou mais possibilidades: forte candidato a aprofundamento; notícia relevante para a edição diária; candidato a análise temática; acompanhamento; contexto; reserva; não usar.
11. Sugira possíveis conexões com outros acontecimentos, mas não monte o espelho da edição.
12. Se houver potencial para série temática, informe.
13. Quando pertinente, sugira manchete baseada no corpo, perspectiva de análise, público interessado, motivo de interesse, buscas prováveis, palavras-chave, hashtags e uma prévia do que Eduarda poderia desenvolver.
14. Informe restrições de reprodução e diferencie propriedade da informação de propriedade do texto, imagem, vídeo, tabela ou infográfico.
15. Se o corpo da fonte não estiver acessível, declare essa limitação e não complete lacunas.

${orientacaoTeoricaParaRoteiro}\n\nIMPORTANTE: não escreva o roteiro, não monte o espelho e não faça a escalada. Essas tarefas pertencem à etapa seguinte do fluxo editorial.`;try{await navigator.clipboard.writeText(text)}catch{copyFallback(text)}copyDetailButton.textContent="✓ Copiado";setTimeout(()=>copyDetailButton.textContent="⧉ Copiar análise",1800)}
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
Agenda: ${selectedOptionText("#agenda")}
Consequência: ${selectedOptionText("#impact")}
Fonte/evidência: ${selectedOptionText("#evidence")}
Abrangência: ${selectedOptionText("#scope")}
Prioridade de triagem: ${selectedOptionText("#potentialFilter")}
Busca digitada: ${search}
Quantidade: ${items.length}

${items.map(resultForChatGPT).join("\n\n────────────────────────────\n\n")}

TAREFA PARA O CHATGPT
Faça uma CURADORIA COMPARATIVA dos resultados encontrados.

O Bastidor realizou apenas descoberta e triagem preliminar por títulos, fontes e metadados. Não decida com base no título, resumo, score, cenário ou hipótese preliminar. Acesse as fontes e leia o corpo das publicações antes de concluir.

1. Analise cada resultado individualmente.
2. Agrupe resultados que tratem do mesmo acontecimento ou sejam apenas repercussões de uma mesma origem.
3. Localize e priorize fonte primária, fonte oficial, publicação original e publicação mais antiga pertinente.
3A. Pesquise a cronologia do ACONTECIMENTO, inclusive notícias e vídeos anteriores ao período filtrado. Registre separadamente a data do primeiro fato comprovado, a data da fonte mais antiga encontrada, a data da publicação exibida e a novidade efetivamente apurada hoje. Uma matéria publicada hoje pode apenas revisitar fato de meses atrás.
4. Diferencie claramente documento/fonte oficial, fonte interessada, reportagem independente, entrevista, análise/opinião e repercussão.
5. Separe fatos confirmados, declarações atribuídas, interpretações, hipóteses e inferências.
6. Identifique a data real do fato quando ela for diferente da data de publicação fornecida pelo Bastidor.
6A. Para cada candidata relevante, classifique: fato novo, atualização material verificável, continuidade de acontecimento anterior, reportagem de contexto/retrospectiva ou repetição da edição anterior. Reportagem nova sobre fato antigo só pode entrar como notícia atual quando houver desenvolvimento material novo e explicitamente identificado; caso contrário, reserve para contexto ou pauta temática. Verifique se já foi noticiado no Gestão em Pauta na edição anterior.
7. Quando aplicável, avalie o percurso: mercado/dinheiro/regra/tecnologia → decisão empresarial → organização do trabalho → pessoas → responsabilidade da liderança. Não force todas as notícias a preencherem todas as etapas.
8. Avalie a aderência ao Gestão em Pauta e ao Desenvolvimento Humano Aplicado ao Trabalho.
9. Não use a ausência de uma “grande pauta” como motivo para concluir que não há conteúdo diário. O Gestão em Pauta funciona como jornal empresarial diário e uma edição pode conter acontecimentos de relevância intermediária.
10. Para cada acontecimento, classifique após a apuração em uma ou mais possibilidades: forte candidato a aprofundamento; notícia relevante para a edição diária; candidato a análise temática; acompanhamento; contexto; reserva; não usar.
11. Identifique conexões editoriais possíveis entre acontecimentos, sem transformar conexão temática em causalidade.
12. Identifique possíveis séries temáticas quando houver recorrência suficiente.
13. Para os conteúdos viáveis, proponha manchete baseada no corpo, perspectiva própria de análise, público interessado, motivo de interesse, pesquisas prováveis, palavras-chave, hashtags e uma breve prévia do que Eduarda poderia desenvolver.
14. Informe o que ainda precisa ser apurado antes de utilizar cada conteúdo.
15. Informe restrições de reprodução: a informação pode ser noticiada com redação própria; texto, fotografia, vídeo, tabela, arte ou infográfico de terceiros não devem ser simplesmente reproduzidos.

PÚBLICO EDITORIAL E IMPACTO ECONÔMICO/MERCADOLÓGICO
O Gestão em Pauta é um programa de múltiplas notícias para empresários, gestores, empreendedores, fornecedores, parceiros comerciais, profissionais e pessoas interessadas nos acontecimentos que movimentam os negócios e o mercado de trabalho brasileiro. Não oriente a análise exclusivamente à administração da organização noticiada.

Para cada acontecimento, investigue conforme a pertinência: (a) o que aconteceu e o estágio real da decisão; (b) a dimensão econômica ou setorial; (c) quais mercados podem ser alcançados; (d) as relações entre empresas, clientes, parceiros, fornecedores, concorrentes, trabalhadores e consumidores; (e) consequências já verificadas; (f) oportunidades ou riscos plausíveis e fundamentados; (g) como tecnologia, concorrência, contratos, investimentos, hábitos de consumo e regulação podem atingir outros negócios. Explique o mecanismo que liga o fato ao impacto. Não converta hipóteses em fatos, nem transforme toda notícia em exercício de planejamento interno da empresa citada.

CURADORIA COMPARATIVA E HIERARQUIA
Avalie TODOS os resultados recebidos; identifique duplicatas, repercussões do mesmo fato e acontecimentos independentes. Compare relevância e atualidade; impacto econômico e social; interesse do público brasileiro; utilidade para empresários e profissionais; originalidade da análise; qualidade das fontes; potencial legítimo de interesse, clique e retenção; e diversidade editorial. Não selecione por valor financeiro, fama da empresa ou score isolado.

Classifique cada acontecimento, após apuração, como aprofundamento, notícia desenvolvida, radar, acompanhamento, reserva ou descarte. Justifique escolhas e exclusões relevantes. Preserve a amplitude do programa multitemático sem incluir todos os resultados automaticamente.

APROFUNDAMENTO DOCUMENTAL E SOLICITAÇÃO DE FICHAS
A exportação coletiva preserva campos informativos já armazenados no resultado quando existirem, inclusive ficha de análise do corpo e referências individuais. O status da ficha não substitui a confirmação na fonte original. A falta de dados no texto exportado não significa que o acontecimento seja pouco relevante.

Se faltar evidência essencial para decidir ou aprofundar, ANTES de finalizar a curadoria indique nominalmente:
- notícia que requer a função individual “Copiar análise”;
- informação ou referência que está faltando;
- por que essa informação é necessária à decisão editorial;
- qual ficha a responsável deve copiar.
Solicite somente as fichas indispensáveis; não peça automaticamente todas. Não declare validada a notícia com lacunas factuais essenciais.

RELATÓRIO DE COBERTURA E ENTREGA
Antes do pacote de estruturação, apresente quantidade de resultados recebidos e efetivamente avaliados; duplicatas e agrupamentos; notícias escolhidas e motivos; reservas e exclusões relevantes; hierarquia proposta; impactos econômicos e mercadológicos; público interessado em cada pauta; e fontes ou fichas pendentes.

16. Ao final, produza uma síntese chamada “PACOTE DE CURADORIA PARA O CHAT DE ESTRUTURAÇÃO”, contendo somente acontecimentos validados, importância de cada um, fatos essenciais, conexões identificadas, possíveis análises, conteúdos em acompanhamento, possíveis séries e lacunas ainda existentes.

${orientacaoTeoricaParaRoteiro}\n\nPÚBLICO-ALVO E IMPACTOS NO MERCADO\n\nA análise deve partir do acontecimento e de sua repercussão no ecossistema empresarial brasileiro. Para cada notícia candidata, identifique quem pode ser alcançado — pequenos e médios empresários, clientes, fornecedores, parceiros, concorrentes, prestadores de serviços, profissionais e consumidores — e por qual mecanismo: demanda, contratos, preços, logística, crédito, tecnologias, serviços, concorrência, emprego, remuneração ou hábitos de consumo, conforme a evidência disponível.\n\nDiferencie impacto já comprovado, declaração de fonte interessada, projeção empresarial e possível desdobramento a investigar. Considere informações sobre comportamento de consumo, saúde ou trabalho quando realmente pertinentes, sem relações causais especulativas.\n\nNa escolha, priorize relevância setorial, utilidade concreta para o público, alcance no Brasil, originalidade do ângulo, qualidade da apuração e diversidade de notícias. Não confunda ensinar a empresa da manchete a executar sua estratégia com explicar o que a decisão dela significa para os demais agentes do mercado.\n\nANTES de emitir o pacote final, informe quantos resultados foram recebidos e avaliados, quais foram agrupados como duplicatas, quais foram incluídos e excluídos, com justificativas, e quais fichas individuais do Bastidor faltam para decidir ou aprofundar. Compare também as candidatas de baixa pontuação preliminar que podem conter efeito material real, sem reclassificar artificialmente o score no sistema. Para cada principal candidata escolhida, informe 'fato original em DD/MM/AAAA; novidade da edição em DD/MM/AAAA; fonte de confirmação', distinguindo 'data não confirmada' quando a busca não sustentar a conclusão. Solicite essas fichas nominalmente antes de concluir uma pauta que dependa delas; não presuma que a cópia em massa contém a riqueza da análise individual. Não trate ausência de ficha como prova de baixa relevância.\n\nNÃO monte escalada, espelho, ordem dos blocos, roteiro ou Mapa Mental. Essas decisões pertencem ao Chat 3.`}
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


/* Comandos padrão independentes para o fluxo de produção do Gestão em Pauta.
   São textos estáticos; não modificam a triagem, a curadoria ou o roteiro. */
(function gpProductionCommands() {
  const commands = [
  {
    "k": "roteiro",
    "n": "01",
    "title": "Estruturação editorial e roteiro integral",
    "desc": "Use no Chat de Estruturação após enviar o pacote de curadoria validado.",
    "text": "# COMANDO 1 — ESPELHO E ROTEIRO INTEGRAL DO GESTÃO EM PAUTA\n\nEXECUTE A ESTRUTURAÇÃO EDITORIAL E O ROTEIRO INTEGRAL DO GESTÃO EM PAUTA, COM ABERTURA DE IMPACTO, PROMESSA EDITORIAL E DESENVOLVIMENTO POR BLOCOS CLAROS, SEM INTERCALAÇÃO RECORRENTE DE NOTÍCIAS.\n\nUse o pacote de curadoria validado nesta conversa como base documental da seleção editorial. Não inclua automaticamente todas as notícias recebidas. Não invente fatos nem transforme hipóteses ou conexões temáticas em causalidade. Verificação complementar de fontes é permitida e obrigatória para os fatos que sustentem o texto.\n\nPÚBLICO E PERSPECTIVA EXTERNA\n\nO Gestão em Pauta é um programa multitemático publicado no YouTube do GEB para empresários, gestores, empreendedores, fornecedores, parceiros comerciais, trabalhadores e pessoas que acompanham mudanças na economia brasileira. O protagonista da análise é o acontecimento e seus efeitos sobre o mercado e o público, não o planejamento estratégico interno da empresa mencionada.\n\nPara cada notícia: (1) fato verificado e data; (2) dimensão do mercado e fontes; (3) relação concreta entre o acontecimento e outros agentes econômicos; (4) impactos observados e possíveis repercussões fundamentadas; (5) oportunidades, riscos e informações úteis ao espectador. Não reduzir a análise a perguntas que a diretoria da empresa deveria responder sobre recursos ou processos.\n\nA seleção deve vir documentada da curadoria; não incluir todas as notícias automaticamente. Se informações indispensáveis estiverem ausentes, identificar os casos e solicitar as fichas detalhadas ou referências antes de apresentar como definitivo um roteiro baseado em inferências. Verificação complementar de fontes é permitida e obrigatória para fatos que sustentem o texto.\n\nEscrever em português brasileiro oral, apresentando o nome completo de uma pessoa na primeira menção e o primeiro nome nas seguintes; desenvolver siglas no primeiro uso quando não forem óbvias. Não verbalizar ressalvas metodológicas desnecessárias.\n\nTítulo e miniatura devem representar a edição com VÁRIAS notícias, não um vídeo exclusivo sobre um acontecimento, e sua promessa deve corresponder ao conteúdo realmente desenvolvido.\n\n1. IDENTIDADE EDITORIAL\nO Gestão em Pauta é um jornal empresarial diário do GEB para o YouTube, de segunda a sexta-feira. Interprete acontecimentos a partir de estratégia, decisões, processos, operações, tecnologia, liderança, comportamento humano e capacidade organizacional.\nA notícia atrai. A interpretação diferencia. A análise constrói autoridade.\nEduarda Bispo é CEO do GEB e estrategista de negócios, com foco em Desenvolvimento Humano Aplicado ao Trabalho. A autoridade deve surgir da análise, sem autopromoção. Não produzir leitura de notícias, comentário partidário nem aula acadêmica.\n\n2. FORMATO NARRATIVO FIXO — ABERTURA A/B E DESENVOLVIMENTO POR BLOCOS\n\nA — IMPACTO: abrir com um fato concreto e relevante da edição, sem apresentação pessoal longa.\n\nB — PROMESSA: mencionar a diversidade de notícias e o significado delas para negócios, parceiros, consumidores e trabalho.\n\nC — DESENVOLVIMENTO: apresentar cada acontecimento por bloco claro, concluindo sua análise antes de passar a outra notícia. Não intercalar notícias de modo recorrente. Inserir um aprofundamento conceitual ou teórico no meio e uma síntese final quando acrescentarem compreensão. Cada bloco pode conter notícias relacionadas, mas não deve criar vínculo causal artificial. Prever notícias principais, complementares e radar, com duração proporcional à relevância.\n\n3. PROGRESSÃO NARRATIVA E APROFUNDAMENTO\nA sequência dos blocos deve favorecer clareza, interesse e compreensão progressiva, respeitando a relevância factual de cada acontecimento. Dentro de cada bloco, conduzir o espectador do fato ao significado para o mercado e o público, distinguindo efeitos verificados de repercussões plausíveis fundamentadas. Utilizar perguntas pontuais, contrastes, explicações conceituais e conclusões parciais quando acrescentarem entendimento, sem criar ciclos artificiais, retornos obrigatórios, suspense falso ou vínculos causais entre notícias independentes.\n\n4. HIERARQUIA EDITORIAL\nDistinguir aprofundamento, notícia relevante, análise temática, Radar Empresarial, acompanhamento, Agenda, contexto e reserva. Atribuir tempo conforme relevância, novidade e densidade, e não simplesmente conforme número de notícias. Preservar amplitude de jornal empresarial, sem obrigar pauta central excepcional, série ou conexão artificial.\n\n5. RETENÇÃO — PRINCÍPIOS ADAPTADOS DOS VÍDEOS DE MRBEAST\nAplicar correspondência entre título, miniatura e primeiros segundos; curiosidade progressiva; contrastes legítimos; alternância de intensidade; descoberta intermediária; transições que fazem o raciocínio avançar; eliminação de redundâncias; conclusão memorável.\nA adaptação é estrutural, não estética: evitar sensacionalismo, cortes excessivos, teatralização, suspense falso e repetições. Cada minuto precisa acrescentar compreensão ou utilidade.\n\n6. VOZ DE EDUARDA\nEscrever o texto integral em português brasileiro oral, natural, profissional e acessível, como quem conhece problemas reais de gestão. Priorizar afirmações claras, exemplos aplicáveis, observações inteligentes e perguntas estratégicas em quantidade moderada. “Pensa comigo” pode surgir naturalmente, sem virar bordão repetitivo.\nEvitar macroexplicações acadêmicas, moralização, frases motivacionais, juridiquês, repetição de conclusões e transições vazias (“agora vamos falar”, “em outra notícia”).\nUsar discretamente: [IMPACTO], [ÊNFASE], [PAUSA], [CONTRASTE], [APROFUNDAR], [VIRADA], [DADO NA TELA], [DADO PARA SLIDE].\n\n7. DESENVOLVIMENTO HUMANO APLICADO AO TRABALHO\nRelacionar acontecimentos, quando pertinente, a estratégia, recursos, processos, capacidade operacional, liderança, competências, tecnologia e mudanças. Não transformar todas as pautas em RH, psicologia ou NR-1.\nReferências teóricas somente se verificadas na curadoria ou em apuração complementar confiável e úteis para explicar um problema concreto; apresentá-las de forma acessível, nunca para ornamentação.\n\n8. RIGOR FACTUAL\nSeparar fatos, declarações atribuídas, decisões anunciadas, regras vigentes, propostas, hipóteses e interpretação própria. Não inventar contratações, expansões, consequências humanas, motivações, resultados, diagnósticos ou causalidade.\nIncorporar cautelas essenciais naturalmente à fala e reservar limites detalhados aos Alertas de Gravação. Não gastar o programa descrevendo a apuração.\n\n9. TRANSIÇÕES\nQuando houver fundamento, conectar blocos por contraste ou continuidade de tema. Quando as notícias forem independentes, mudar de assunto de maneira breve, clara e natural, inclusive entre notícias principais. Não criar causalidade nem intercalar assuntos para simular uma conexão. O fluxo deve manter ritmo e diversidade sem comprometer a compreensão.\n\n10. DURAÇÃO E RITMO\nUsar 15–25 minutos como referência flexível. Preferir 12–18 minutos consistentes a prolongamentos artificiais. Estimar a duração pela quantidade real de palavras, velocidade de fala e pausas, sem inflar tempo com elementos visuais. Eliminar trechos explicativos e repetitivos.\n\n11. FECHAMENTO\nNão apresentar Eduarda no início. Encerrar respondendo à promessa inicial com uma síntese que acrescente compreensão ao público, quando pertinente, sem recitar todas as notícias nem prometer monitoramento futuro. Quando pertinente, indicar o que o telespectador deve observar por conta própria.\nUsar somente “GEB”, nunca o nome institucional por extenso. Encerrar naturalmente com a assinatura:\n“Sou Eduarda Bispo e ajudo empresas a melhorar sua gestão e organizar seus processos, integrando comportamento humano e tecnologia.”\n\n12. AUDITORIA OBRIGATÓRIA — CORRIJA ANTES DE ENTREGAR\nVerificar impacto na abertura; promessa editorial nos primeiros segundos; correspondência do título e da miniatura com a diversidade real de notícias; desenvolvimento completo de cada bloco antes da transição; proporção de tempo por relevância; perspectiva externa e utilidade para público e mercado; informações verificadas, datas, dimensões e atribuições; separação entre consequências observadas e repercussões fundamentadas; aprofundamento conceitual pertinente; clareza, ritmo, ausência de redundâncias e transições naturais; voz profissional; fechamento útil; duração consistente com o texto.\nSe o roteiro se limitar à leitura de manchetes ou repetir recomendações genéricas à diretoria das empresas noticiadas, refazer a análise a partir dos efeitos reais para os agentes do mercado. Não basta declarar que foi auditado: revisar efetivamente.\n\n13. ENTREGA OBRIGATÓRIA — NESTA ORDEM\n1. Tese da edição.\n2. Hierarquia editorial.\n3. Espelho narrativo: A (impacto), B (promessa), C (blocos sequenciais de notícias principais, complementares e radar), transições, aprofundamento pertinente, síntese final e tempo estimado.\n4. Estratégia de retenção: título, miniatura, gancho dos cinco segundos e promessa de vinte segundos.\n5. Roteiro INTEGRAL de gravação, com todas as falas e marcações discretas, do primeiro segundo ao encerramento — jamais apenas tópicos.\n6. Direção visual para a narração: informações, documentos, dados, títulos e sugestões para Google Slides, sem gerar a apresentação nesta etapa.\n7. Alertas de gravação: fontes, atribuições, dados para tela e limites factuais.\n8. Auditoria final crítica da clareza, retenção, originalidade analítica e posicionamento.\n\nNÃO PRODUZA O GOOGLE SLIDES NEM OS ARQUIVOS DERIVADOS NESTA ETAPA. A produção desses materiais depende da aprovação do roteiro e da execução do Comando 2.\n\nEXECUTE A EDIÇÃO COMPLETA, NÃO APENAS O PLANEJAMENTO."
  },
  {
    "k": "producao",
    "n": "02",
    "title": "Produção da edição — Google Drive e Slides",
    "desc": "Use após revisar e aprovar a versão final do roteiro. Produza os arquivos no Drive e a apresentação no Google Slides.",
    "text": "# COMANDO 2 — PRODUÇÃO DA EDIÇÃO NO GOOGLE DRIVE E GOOGLE SLIDES\n\nEXECUTE A PRODUÇÃO DOS MATERIAIS DA EDIÇÃO DO GESTÃO EM PAUTA A PARTIR DO ROTEIRO INTEGRAL FINAL APROVADO.\n\nEste comando substitui a geração do Mapa Mental Compass Rose na etapa de preparação visual e operacional da gravação. Execute somente depois da aprovação expressa do roteiro.\n\n1. BASE DOCUMENTAL E LIMITES\n\nUtilize exclusivamente o roteiro final aprovado, seu espelho editorial e a curadoria que fundamentou a edição.\n\n- Não execute uma nova pesquisa no Bastidor nem solicite outra exportação da curadoria.\n- Não reescreva, resuma, reorganize ou altere o roteiro aprovado.\n- Não acrescente fatos, dados, declarações, interpretações, fontes ou notícias não aprovadas.\n- Preserve a sequência das notícias, os números, as datas, as atribuições e as ressalvas factuais.\n- O roteiro aprovado é a referência principal para todos os materiais derivados.\n- Não altere comandos, filtros, pontuações, arquitetura de chats ou automações do Bastidor.\n\n2. ORGANIZAÇÃO NO GOOGLE DRIVE\n\nCrie ou utilize a pasta da edição, identificada por número e data editorial. Verifique os arquivos existentes antes de criar novos e não gere duplicatas ou sobrescreva materiais aprovados.\n\n01 — CURADORIA VALIDADA\nPreserve o pacote original recebido do Bastidor e sua referência documental. Não refaça a pesquisa nem gere outro pacote de curadoria.\n\n02 — ESPELHO E ROTEIRO APROVADO\nOrganize os documentos editoriais já aprovados sem substituí-los nem alterar as falas.\n\n03 — TELEPROMPTER\nCrie um Google Docs independente, com o texto integral a ser pronunciado por Eduarda Bispo. Preserve cada fala, retire as instruções que não serão lidas da área de leitura e adote fonte, espaçamento e continuidade adequados à gravação. Não adapte a redação aos slides. Insira marcas discretas S01, S02, S03... imediatamente antes da frase de entrada de cada slide. As marcas não são falas, não entram nas legendas e não devem alterar as palavras aprovadas.\n\n04 — GOOGLE SLIDES\nCrie uma apresentação nativa, editável, em formato 16:9, destinada à gravação do programa. A apresentação substituirá a imagem da apresentadora na tela; Eduarda continuará narrando o roteiro integral.\n\nIdentidade visual fixa:\n- Fundo grafite/preto, tipografia branca de alto contraste, destaques em ocre inspirado no blazer da apresentadora.\n- Composição editorial corporativa, sóbria e angular, sem estética infantil, acadêmica ou de apresentação comercial genérica.\n- Marca Gestão em Pauta e data em posições padronizadas, de forma discreta.\n- Identifique cada slide com a mesma marca discreta S01, S02, S03... em posição padronizada, conferindo a correspondência com o teleprompter.\n- Reutilize o modelo mestre da apresentação quando ele estiver disponível, em vez de recriar a identidade visual diariamente.\n\nConteúdo e sequência:\n- Exiba títulos públicos, curtos, claros e específicos, compreensíveis pelo espectador sem a fala de apoio.\n- Utilize palavras-chave e dados essenciais; não reproduza parágrafos nem o texto integral do roteiro.\n- Destaque somente números verificados e relevantes.\n- Preserve rigorosamente a ordem dos assuntos, das transições e das conclusões do roteiro aprovado.\n- Crie slides apenas quando uma mudança relevante de assunto ou um dado justificar uma nova tela; não imponha um slide por parágrafo.\n- Não antecipe conclusões nem sugira relações causais que o roteiro não sustenta.\n- Não utilize imagens de terceiros sem a devida autorização ou justificativa editorial.\n\nSincronização com a narração:\n- Associe cada slide ao trecho ou à frase inicial correspondente no roteiro, preferencialmente nas anotações do apresentador.\n- Se as anotações não puderem ser preenchidas, crie guia separado de transições, com número do slide, título e frase de entrada.\n- Nunca altere as falas para ajustar a duração ou a quantidade de slides.\n\n05 — KIT YOUTUBE\nPrepare, em um documento, título editorial coerente com a abertura, descrição completa, fontes identificadas, proposta de manchete e composição da miniatura, comentário para fixar, capítulos planejados por assunto e instruções de publicação.\n- A miniatura deve representar a edição multitemática, mesmo que um acontecimento receba destaque.\n- Não inclua links externos na descrição destinada ao YouTube enquanto essa restrição permanecer.\n- Não invente horários de capítulos; os horários definitivos dependerão da gravação real.\n\n06 — LEGENDAS TXT\nCrie arquivo de texto simples (.txt) com somente a transcrição das falas aprovadas, na sequência original e sem marcações de entonação, instruções de tela ou produção.\n- Não fabrique horários para SRT; a sincronização será conferida com a gravação.\n\n07 — VOCABULÁRIO E PRONÚNCIA\nCrie SEMPRE um Google Docs independente, na pasta 07 da edição, chamado Vocabulário de pronúncia — Edição [número] — [data]. Extraia EXCLUSIVAMENTE nomes de pessoas e empresas, marcas, siglas, estrangeirismos e termos técnicos presentes nas falas finais aprovadas. Organize na ordem dos blocos: termo exato, trecho/contexto, proposta de leitura brasileira quando confiável, indicação de dúvida e fonte audiovisual/institucional consultada quando houver. Não invente pronúncia de marca nem apresente aproximações como oficiais: escreva 'pronúncia institucional a conferir' onde necessário. Inclua um pequeno checklist de ensaio. Atualize o arquivo se uma revisão aprovada alterar termos; não deixe vocabulário desatualizado nem duplique documentos.\n\n3. AUDITORIA OBRIGATÓRIA\n\nAntes de entregar:\n- Confirme a correspondência entre roteiro, teleprompter e legendas, sem omissões ou acréscimos.\n- Confira a sequência das notícias e dos slides, a clareza das palavras-chave e a legibilidade em tela reduzida.\n- Confira a correspondência exata S01, S02... entre teleprompter e numeração exibida nos slides; as marcas não podem entrar no TXT de legendas.\n- Confira que o vocabulário contempla os nomes e termos das falas aprovadas, sem termos de matérias excluídas, e que pronunciamentos não verificados estão marcados como pendentes.\n- Valide nomes, dados, valores, datas, fontes e limites factuais em todos os materiais derivados.\n- Confira a correspondência entre abertura, título, manchete da miniatura e conteúdo real.\n- Verifique que a pasta contém os arquivos corretos, sem duplicações nem sobrescrita indevida.\n- Corrija problemas nos derivados sem modificar o roteiro final aprovado.\n\n4. ENTREGA\n\nExecute a criação ou organização efetiva dos arquivos no Google Drive; não entregue apenas uma proposta.\nForneça os links reais dos materiais criados ou organizados, distinguindo qualquer etapa não concluída.\nNão declare um arquivo criado sem confirmação.\nNão publique o vídeo no YouTube nem o artigo especial no Blog GEB sem autorização específica.\nO artigo do blog e os horários finais dos capítulos serão preparados após a publicação, quando houver URL e duração real do vídeo.\n\nEXECUTE A PRODUÇÃO DOS ARQUIVOS A PARTIR DO ROTEIRO APROVADO, SEM REPETIR A CURADORIA OU A ESTRUTURAÇÃO EDITORIAL."
  }
];
  const dashboard = document.querySelector(".dashboard");
  if (!dashboard || document.querySelector("#gpProductionCommands")) return;

  const section = document.createElement("section");
  section.id = "gpProductionCommands";
  section.className = "prompt-workflow-section";
  section.setAttribute("aria-labelledby", "gpPromptHeading");
  section.innerHTML = '<div class="prompt-workflow-heading"><div><span class="eyebrow">FLUXO DE PRODUÇÃO</span><h3 id="gpPromptHeading">Comandos padrão para o ChatGPT</h3><p>Copie o comando de cada etapa e cole na conversa correspondente. Os comandos não enviam notícias automaticamente.</p></div></div>';
  const cards = document.createElement("div");
  cards.className = "prompt-workflow-grid";
  section.append(cards);

  commands.forEach(command => {
    const card = document.createElement("article");
    card.className = "prompt-workflow-card";
    const heading = document.createElement("div");
    heading.className = "prompt-workflow-card-top";
    const meta = document.createElement("div");
    const stage = document.createElement("span");
    stage.className = "prompt-workflow-stage";
    stage.textContent = "ETAPA " + command.n;
    const title = document.createElement("h4");
    title.textContent = command.title;
    const desc = document.createElement("p");
    desc.textContent = command.desc;
    meta.append(stage, title, desc);
    heading.append(meta);

    const field = document.createElement("textarea");
    field.className = "prompt-workflow-field";
    field.id = "gpPrompt-" + command.k;
    field.readOnly = true;
    field.rows = command.k === "roteiro" ? 4 : 7;
    field.value = command.text;
    field.setAttribute("aria-label", "Comando completo: " + command.title);
    field.spellcheck = false;

    const copy = document.createElement("button");
    copy.className = "prompt-workflow-copy";
    copy.type = "button";
    copy.textContent = "Copiar comando";
    copy.setAttribute("aria-label", "Copiar comando: " + command.title);
    copy.addEventListener("click", async () => {
      let copied = false;
      try {
        if (!navigator.clipboard?.writeText) throw new Error("Clipboard API indisponível");
        await navigator.clipboard.writeText(command.text);
        copied = true;
      } catch (error) {
        field.focus();
        field.select();
        try { copied = !!document.execCommand("copy"); } catch (ignored) { copied = false; }
      }
      if (copied) {
        copy.textContent = "✓ Copiado";
        window.setTimeout(() => { copy.textContent = "Copiar comando"; }, 2000);
      } else {
        copy.textContent = "Selecione e use Ctrl+C";
        field.focus();
        field.select();
      }
    });
    card.append(heading, field, copy);
    cards.append(card);
  });
  dashboard.before(section);
  const style = document.createElement("style");
  style.textContent = `
  .prompt-workflow-section{max-width:1240px;margin:26px auto 0;padding:0 max(5vw,28px)}
  .prompt-workflow-heading{margin-bottom:16px}
  .prompt-workflow-heading h3{font-size:25px;margin-top:5px}
  .prompt-workflow-heading p{font-size:12px;color:#52606c;line-height:1.55;margin-top:6px}
  .prompt-workflow-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
  .prompt-workflow-card{background:var(--white);border:1px solid var(--line);border-top:3px solid var(--gold);padding:18px;display:flex;flex-direction:column;gap:12px;min-width:0}
  .prompt-workflow-stage{font-size:10px;color:#936326;letter-spacing:.12em;font-weight:700}
  .prompt-workflow-card h4{font-size:19px;margin-top:5px}
  .prompt-workflow-card p{font-size:12px;color:#52606c;line-height:1.45;margin-top:6px;min-height:35px}
  .prompt-workflow-field{width:100%;height:152px;min-height:110px;resize:vertical;border:1px solid var(--line);padding:11px 12px;background:#f7f5f0;color:var(--ink);font:12px/1.55 ui-monospace,SFMono-Regular,Consolas,monospace}
  .prompt-workflow-field:focus-visible,.prompt-workflow-copy:focus-visible{outline:2px solid #80561f;outline-offset:2px}
  .prompt-workflow-copy{align-self:flex-start;background:var(--navy);border:1px solid var(--navy);border-radius:3px;color:white;font:700 12px "DM Sans",sans-serif;padding:10px 14px;cursor:pointer}
  .prompt-workflow-copy:hover{background:#213b55}
  @media(max-width:760px){.prompt-workflow-grid{grid-template-columns:1fr}.prompt-workflow-card p{min-height:0}}
  `;
  document.head.append(style);
})();
