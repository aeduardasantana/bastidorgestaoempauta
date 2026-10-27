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

async function copyDetailForChatGPT(){const item=currentDetailItem(),content=document.querySelector("#detailContent")?.innerText.trim()||"",text=`GESTÃO EM PAUTA - SOLICITAÇÃO DE ANÁLISE EDITORIAL

NOTÍCIA LOCALIZADA
Título: ${item?.title||document.querySelector("#detailTitle")?.textContent||""}
Fonte: ${item?.source||"Não identificada"}
Data: ${item?.date||"Não identificada"}
Link: ${item?.url||"Não disponível"}
Agenda preliminar: ${item?.agenda||"Não classificada"}

DADOS COPIADOS DA JANELA “ORIGEM, USO E SEGURANÇA EDITORIAL”
${content}

TAREFA PARA O CHATGPT
Esta é a etapa de CURADORIA EDITORIAL. O Bastidor fez apenas descoberta e triagem preliminar por título, fonte e metadados.

Acesse a publicação original e leia o corpo da matéria. O título, o score, o cenário, a porta de entrada e as hipóteses do Bastidor servem apenas para orientar a investigação. Não os trate como prova.

1. Identifique a publicação original ou fonte primária quando possível.
2. Informe a data da publicação e, separadamente, a data do acontecimento principal quando forem diferentes.
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
function scoreInfo(x){const raw=x.editorialPotential?.score;const value=Number.isFinite(raw)?Math.max(0,Math.min(100,Math.round(raw*10))):(x.score===null||x.score===undefined?null:Math.max(0,Math.min(100,x.score>11?Math.round(x.score):Math.round(((x.score-3)/8)*100))));if(value===null)return {value:null,label:"Em cálculo",note:"Sem dados suficientes para priorizar."};return {value,label:triageLabel(value),note:"Potencial preliminar calculado por título, fonte e metadados. Não determina o uso editorial final."}}
function potentialBox(x){const p=x.editorialPotential;if(!p)return '<div class="detail-box warn"><b>Prioridade de investigação ainda não calculada.</b><br>Aguarde a próxima atualização do radar.</div>';const questions=(p.questions||[]).map(q=>'<li>'+plain(q)+'</li>').join(""),missing=(p.missing||[]).map(q=>'<li>'+plain(q)+'</li>').join(""),related=(x.relatedSources||[]).map(s=>'<li><a href="'+safeUrl(s.url)+'" target="_blank" rel="noopener">'+plain(s.source)+' - '+plain(s.title)+'</a></li>').join("");return '<div class="detail-box"><b>Hipóteses de investigação</b><br><small>Conteúdo preliminar produzido por título, fonte e metadados. Não representa conclusão sobre o acontecimento.</small><br><br><b>Prioridade de investigação:</b> '+p.score+'/10<br><b>Cenário a verificar:</b> '+plain(p.event)+'<br><b>Porta de entrada a verificar:</b> '+plain(p.economicTrigger)+'<br><b>Hipótese organizacional a investigar:</b> '+plain(p.organizationalHypothesis)+(questions?'<br><b>Perguntas para validar no corpo:</b><ul>'+questions+'</ul>':"")+(missing?'<b>Ainda precisa confirmar:</b><ul>'+missing+'</ul>':"")+(related?'<b>Outras fontes do mesmo acontecimento:</b><ul>'+related+'</ul>':"")+'</div>'}
function analysisBox(x){const preliminary=potentialBox(x),b=x.bodyAnalysis;if(!b)return preliminary+'<div class="detail-box warn"><b>Triagem manual.</b><br>Abra a fonte e confirme fatos, datas, envolvidos e consequências antes de decidir. O sistema não está utilizando a API da OpenAI.</div>';if(!b.status?.startsWith("analisado"))return preliminary+'<div class="detail-box warn"><b>Revisão manual necessária:</b><br>'+plain(b.reason||"O corpo da publicação não pôde ser validado.")+'</div>';const e=b.editorial||{},r=b.relevance||{},facts=(b.facts_confirmed||[]).map(v=>'<li>'+plain(v)+'</li>').join(""),statements=(b.source_statements||[]).map(v=>'<li>'+plain(v)+'</li>').join(""),consequences=(b.managerial_consequences||[]).map(v=>'<li>'+plain(v)+'</li>').join("");return preliminary+'<div class="detail-box"><b>Curadoria já realizada</b><br><small>Resultado preservado da execução anterior. Nenhuma nova análise por API será feita.</small><br><br><b>Veredito:</b> '+plain(r.verdict||"A validar")+' - '+plain(r.reason||"")+'<br><b>Manchete sugerida:</b> '+plain(e.headline||"")+'<br><b>Prévia de fala:</b> '+plain(e.speaking_preview||"")+(facts?'<br><br><b>Fatos confirmados:</b><ul>'+facts+'</ul>':"")+(statements?'<b>Declarações atribuídas:</b><ul>'+statements+'</ul>':"")+(consequences?'<b>Consequências gerenciais:</b><ul>'+consequences+'</ul>':"")+'<b>Restrições de uso:</b> '+plain(b.restrictions||b.source_owner_note||"Usar redação própria e atribuir a fonte.")+'<br><b>Cuidado editorial:</b> '+plain(b.caution||"Validar fonte e contexto.")+'</div>'}

function decorateCuratedCards(){document.querySelectorAll(".news-card").forEach(card=>{if(card.querySelector(".curation-verdict"))return;const item=[...news,...videos].find(x=>x.title===card.querySelector("h4")?.textContent),analysis=item?.bodyAnalysis,p=item?.editorialPotential;if(!item)return;const box=document.createElement("div"),priority=scoreInfo(item);box.className="curation-verdict "+(analysis?.status?.startsWith("analisado")?"ready":((priority.value??100)<=20?"manual":"preliminary"));box.innerHTML=analysis?.status?.startsWith("analisado")?'<b>'+plain(analysis.relevance?.verdict||"Conteúdo já analisado")+'</b><span>Curadoria anterior do corpo preservada</span>':'<b>'+plain(priority.label)+'</b><span>'+(p?plain(p.event)+' - hipótese de investigação a validar na fonte':'Aguardando atualização do radar')+'</span>';card.querySelector(".summary").after(box)})}
const gridObserver=new MutationObserver(decorateCuratedCards);gridObserver.observe(document.querySelector("#newsGrid"),{childList:true});
document.head.insertAdjacentHTML("beforeend",'<style>.copy-detail{margin-left:auto;margin-right:8px;padding:5px 7px;white-space:nowrap;text-decoration:none;font-size:11px;color:#80561f;border:1px solid transparent;border-radius:3px}.copy-detail:hover{border-color:#d8d2c7;background:#f2eee6}.results-actions{display:flex;align-items:center;justify-content:flex-end;gap:8px;flex-wrap:wrap}.copy-results{padding:6px 8px;white-space:nowrap;text-decoration:none;font-size:11px;color:#80561f;border:1px solid #d8d2c7;border-radius:3px;background:transparent}.copy-results:hover{background:#f2eee6;border-color:#b48b53}.copy-results:disabled{color:#899099;border-color:#ddd8cf;cursor:not-allowed}.curation-verdict{padding:10px 12px;background:#e5eee9;border-left:3px solid #1f4b42;display:grid;gap:4px;font-size:12px}.curation-verdict.preliminary{background:#edf0f2;border-color:#718596}.curation-verdict.manual{background:#f5e7df;border-color:#9b5c3b}.curation-verdict span{color:#52606c;line-height:1.35}@media(max-width:600px){.copy-detail{margin-left:auto}.results-actions{justify-content:flex-start}}</style>');

const potentialLabel=document.createElement("label");potentialLabel.innerHTML='Prioridade de triagem<select id="potentialFilter"><option value="Todos">Todas as prioridades</option><option value="muito-alta">Muito alta</option><option value="alta">Alta</option><option value="media">Média</option><option value="baixa">Baixa</option><option value="muito-baixa">Muito baixa</option></select>';document.querySelector("#apply").before(potentialLabel);
function triageBand(item){const value=scoreInfo(item).value??-1;return value>=81?"muito-alta":value>=61?"alta":value>=41?"media":value>=21?"baixa":"muito-baixa"}
const filterBeforePotential=filter;filter=function(){const items=filterBeforePotential(),choice=document.querySelector("#potentialFilter")?.value||"Todos";return choice==="Todos"?items:items.filter(x=>triageBand(x)===choice)};
document.querySelector("#potentialFilter").onchange=render;
document.querySelector(".notice small").innerHTML='<b>Prioridade de triagem:</b> 0–20 muito baixa · 21–40 baixa · 41–60 média · 61–80 alta · 81–100 muito alta. Potencial preliminar calculado por título, fonte e metadados. Não determina o uso editorial final.';

const copyResultsButton=document.createElement("button");copyResultsButton.type="button";copyResultsButton.className="text-button copy-results";copyResultsButton.title="Copiar os resultados filtrados para uma curadoria geral no ChatGPT";
const resultsActions=document.createElement("div");resultsActions.className="results-actions";const clearSelectionButton=document.querySelector("#clearSelection");clearSelectionButton.before(resultsActions);resultsActions.append(copyResultsButton,clearSelectionButton);
function selectedOptionText(selector){const select=document.querySelector(selector);return select?.selectedOptions?.[0]?.textContent?.trim()||"Não informado"}
function listText(values){return Array.isArray(values)&&values.length?values.map(value=>`- ${value}`).join("\n"):"- Não informado"}
function resultForChatGPT(item,index){const potential=item.editorialPotential||{},body=item.bodyAnalysis||{},origin=item.origin||{},related=item.relatedSources||[],audience=audienceFor(item),packaging=packagingFor(item),use=item.use||{};return `RESULTADO ${index+1}
Título localizado: ${item.title||"Não informado"}
Fonte exibida: ${item.source||"Não identificada"}
Data: ${item.date||"Não identificada"}
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
Empacotamento preliminar: ${packaging.thumbnail} | ${packaging.keywords}`}
function filteredResultsText(){const items=filter(),search=document.querySelector("#searchInput")?.value.trim()||"Sem termo",kind=mode==="news"?"Notícias":"Vídeos";return `GESTÃO EM PAUTA — SOLICITAÇÃO DE CURADORIA GERAL

RESULTADOS ATUALMENTE FILTRADOS NO BASTIDOR
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
4. Diferencie claramente documento/fonte oficial, fonte interessada, reportagem independente, entrevista, análise/opinião e repercussão.
5. Separe fatos confirmados, declarações atribuídas, interpretações, hipóteses e inferências.
6. Identifique a data real do fato quando ela for diferente da data de publicação fornecida pelo Bastidor.
7. Quando aplicável, avalie o percurso: mercado/dinheiro/regra/tecnologia → decisão empresarial → organização do trabalho → pessoas → responsabilidade da liderança. Não force todas as notícias a preencherem todas as etapas.
8. Avalie a aderência ao Gestão em Pauta e ao Desenvolvimento Humano Aplicado ao Trabalho.
9. Não use a ausência de uma “grande pauta” como motivo para concluir que não há conteúdo diário. O Gestão em Pauta funciona como jornal empresarial diário e uma edição pode conter acontecimentos de relevância intermediária.
10. Para cada acontecimento, classifique após a apuração em uma ou mais possibilidades: forte candidato a aprofundamento; notícia relevante para a edição diária; candidato a análise temática; acompanhamento; contexto; reserva; não usar.
11. Identifique conexões editoriais possíveis entre acontecimentos, sem transformar conexão temática em causalidade.
12. Identifique possíveis séries temáticas quando houver recorrência suficiente.
13. Para os conteúdos viáveis, proponha manchete baseada no corpo, perspectiva própria de análise, público interessado, motivo de interesse, pesquisas prováveis, palavras-chave, hashtags e uma breve prévia do que Eduarda poderia desenvolver.
14. Informe o que ainda precisa ser apurado antes de utilizar cada conteúdo.
15. Informe restrições de reprodução: a informação pode ser noticiada com redação própria; texto, fotografia, vídeo, tabela, arte ou infográfico de terceiros não devem ser simplesmente reproduzidos.
16. Ao final, produza uma síntese chamada “PACOTE DE CURADORIA PARA O CHAT DE ESTRUTURAÇÃO”, contendo somente acontecimentos validados, importância de cada um, fatos essenciais, conexões identificadas, possíveis análises, conteúdos em acompanhamento, possíveis séries e lacunas ainda existentes.

${orientacaoTeoricaParaRoteiro}\n\nNÃO monte escalada, espelho, ordem dos blocos, roteiro ou Mapa Mental. Essas decisões pertencem ao Chat 3.`}
function updateCopyResultsButton(){const count=filter().length;copyResultsButton.disabled=!count;copyResultsButton.textContent=count?`⧉ Copiar ${count} resultado${count===1?"":"s"}`:"⧉ Sem resultados"}
async function copyFilteredResults(){const text=filteredResultsText();try{await navigator.clipboard.writeText(text)}catch{copyFallback(text)}copyResultsButton.textContent="✓ Resultados copiados";setTimeout(updateCopyResultsButton,1800)}
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
    "text": "# COMANDO 1 — ESPELHO E ROTEIRO INTEGRAL DO GESTÃO EM PAUTA\n\nEXECUTE A ESTRUTURAÇÃO EDITORIAL E O ROTEIRO INTEGRAL DO GESTÃO EM PAUTA, COM ARQUITETURA A → B → C, INTERCALAÇÃO INTENCIONAL, CURIOSIDADE PROGRESSIVA E RECOMPENSAS ANALÍTICAS.\n\nUse exclusivamente o pacote de curadoria validado nesta conversa como base factual. Não refaça a apuração, não invente fatos e não transforme hipóteses ou conexões temáticas em causalidade.\n\n1. IDENTIDADE EDITORIAL\nO Gestão em Pauta é um jornal empresarial diário do GEB para o YouTube, de segunda a sexta-feira. Interprete acontecimentos a partir de estratégia, decisões, processos, operações, tecnologia, liderança, comportamento humano e capacidade organizacional.\nA notícia atrai. A interpretação diferencia. A análise constrói autoridade.\nEduarda Bispo é CEO do GEB e estrategista de negócios, com foco em Desenvolvimento Humano Aplicado ao Trabalho. A autoridade deve surgir da análise, sem autopromoção. Não produzir leitura de notícias, comentário partidário nem aula acadêmica.\n\n2. FORMATO NARRATIVO FIXO — A → B → C\nA — IMPACTO (0–5 SEGUNDOS): abrir diretamente com acontecimentos concretos e interessantes da edição. Não começar com cumprimento, vinheta demorada ou apresentação pessoal. Cumprir a promessa do título e da miniatura.\nB — TENSÃO E PROMESSA (5–20 SEGUNDOS): formular uma pergunta empresarial relevante, criando curiosidade legítima e mostrando por que assistir. Não revelar todas as conclusões nem dramatizar.\nC — DESENVOLVIMENTO INTERCALADO: não usar automaticamente notícia 1 → análise completa → notícia 2 → análise completa → notícia 3 → conclusão. Intercalar acontecimentos por questões empresariais e contrastes quando houver conexão verdadeira. Cada retorno a uma notícia deve acrescentar fato, interpretação ou descoberta. Não forçar todas as notícias em todos os ciclos; fatos independentes podem entrar no Radar Empresarial ou Agenda.\n\n3. CICLOS NARRATIVOS\nQuando a densidade permitir, estruturar ciclos de aproximadamente 2 a 4 minutos, cada um com:\n- informação nova e verificável;\n- pergunta ou tensão gerencial concreta;\n- desenvolvimento analítico aplicado à realidade empresarial;\n- recompensa intermediária: conclusão parcial que realmente amplia o entendimento.\nConduzir naturalmente ao ciclo seguinte, sem repetir a promessa ou fabricar suspense. Não confundir intercalação com mera alternância de manchetes.\n\n4. HIERARQUIA EDITORIAL\nDistinguir aprofundamento, notícia relevante, análise temática, Radar Empresarial, acompanhamento, Agenda, contexto e reserva. Atribuir tempo conforme relevância, novidade e densidade, e não simplesmente conforme número de notícias. Preservar amplitude de jornal empresarial, sem obrigar pauta central excepcional, série ou conexão artificial.\n\n5. RETENÇÃO — PRINCÍPIOS ADAPTADOS DOS VÍDEOS DE MRBEAST\nAplicar correspondência entre título, miniatura e primeiros segundos; curiosidade progressiva; contrastes legítimos; alternância de intensidade; descoberta intermediária; transições que fazem o raciocínio avançar; eliminação de redundâncias; conclusão memorável.\nA adaptação é estrutural, não estética: evitar sensacionalismo, cortes excessivos, teatralização, suspense falso e repetições. Cada minuto precisa acrescentar compreensão ou utilidade.\n\n6. VOZ DE EDUARDA\nEscrever o texto integral em português brasileiro oral, natural, profissional e acessível, como quem conhece problemas reais de gestão. Priorizar afirmações claras, exemplos aplicáveis, observações inteligentes e perguntas estratégicas em quantidade moderada. “Pensa comigo” pode surgir naturalmente, sem virar bordão repetitivo.\nEvitar macroexplicações acadêmicas, moralização, frases motivacionais, juridiquês, repetição de conclusões e transições vazias (“agora vamos falar”, “em outra notícia”).\nUsar discretamente: [IMPACTO], [ÊNFASE], [PAUSA], [CONTRASTE], [APROFUNDAR], [VIRADA], [DADO NA TELA], [COMPASS ROSE].\n\n7. DESENVOLVIMENTO HUMANO APLICADO AO TRABALHO\nRelacionar acontecimentos, quando pertinente, a estratégia, recursos, processos, capacidade operacional, liderança, competências, tecnologia e mudanças. Não transformar todas as pautas em RH, psicologia ou NR-1.\nReferências teóricas somente se verificadas na curadoria e úteis para explicar um problema concreto; apresentá-las de forma acessível, nunca para ornamentação.\n\n8. RIGOR FACTUAL\nSeparar fatos, declarações atribuídas, decisões anunciadas, regras vigentes, propostas, hipóteses e interpretação própria. Não inventar contratações, expansões, consequências humanas, motivações, resultados, diagnósticos ou causalidade.\nIncorporar cautelas essenciais naturalmente à fala e reservar limites detalhados aos Alertas de Gravação. Não gastar o programa descrevendo a apuração.\n\n9. TRANSIÇÕES\nConectar assuntos por contraste ou evolução da análise quando houver fundamento. Se não houver conexão, realizar mudança editorial breve e explícita para Radar ou Agenda. A narrativa deve avançar sem parecer um conjunto de notícias comentadas isoladamente.\n\n10. DURAÇÃO E RITMO\nUsar 15–25 minutos como referência flexível. Preferir 12–18 minutos consistentes a prolongamentos artificiais. Estimar a duração pela quantidade real de palavras, velocidade de fala e pausas, sem inflar tempo com elementos visuais. Eliminar trechos explicativos e repetitivos.\n\n11. FECHAMENTO\nNão apresentar Eduarda no início. Encerrar respondendo à promessa inicial com critério de decisão de valor aplicável; não resumir todas as notícias nem prometer monitoramento futuro. Quando pertinente, indicar o que o telespectador deve observar por conta própria.\nUsar somente “GEB”, nunca o nome institucional por extenso. Encerrar naturalmente com a assinatura:\n“Sou Eduarda Bispo e ajudo empresas a melhorar sua gestão e organizar seus processos, integrando comportamento humano e tecnologia.”\n\n12. AUDITORIA OBRIGATÓRIA — CORRIJA ANTES DE ENTREGAR\nVerificar impacto em 5 segundos; promessa em 20 segundos; correspondência com título e miniatura; progressão de curiosidade; intercalação fundamentada; informação nova em cada retorno; recompensas intermediárias; alternância de ritmo; ausência de macroexplicações e redundância; transições fluidas; voz profissional; rigor factual; fechamento útil; duração consistente com o texto.\nSe o roteiro parecer notícias comentadas em sequência, reconstruir a narrativa sem forçar vínculos falsos. Não basta declarar que foi auditado: revisar efetivamente.\n\n13. ENTREGA OBRIGATÓRIA — NESTA ORDEM\n1. Tese da edição.\n2. Hierarquia editorial.\n3. Espelho narrativo: A, B, ciclos intercalados, transições, recompensas e tempo estimado.\n4. Estratégia de retenção: título, miniatura, gancho dos cinco segundos e promessa de vinte segundos.\n5. Roteiro INTEGRAL de gravação, com todas as falas e marcações discretas, do primeiro segundo ao encerramento — jamais apenas tópicos.\n6. Direção visual: câmera, documentos, dados e marcações do Compass Rose, sem gerar o mapa.\n7. Alertas de gravação: fontes, atribuições, dados para tela e limites factuais.\n8. Auditoria final crítica da clareza, retenção, originalidade analítica e posicionamento.\n\nNÃO PRODUZA O MAPA MENTAL COMPASS ROSE NESTA ETAPA. Ele depende da aprovação do roteiro e do Comando 2.\n\nEXECUTE A EDIÇÃO COMPLETA, NÃO APENAS O PLANEJAMENTO."
  },
  {
    "k": "mapa",
    "n": "02",
    "title": "Mapa Mental Compass Rose",
    "desc": "Use somente após revisar e aprovar a versão final do roteiro no mesmo chat.",
    "text": "**EXECUTE O MAPA MENTAL COMPASS ROSE DO ROTEIRO APROVADO.**\n\nUtilize exclusivamente a versão final do roteiro do Gestão em Pauta nesta conversa.\n\n1. Extraia somente os tópicos editoriais já definidos no roteiro.\n2. Organize os tópicos na ordem exata da apresentação.\n3. Cada tópico será apresentado individualmente na tela.\n4. Utilize títulos curtos, objetivos e conceituais.\n5. Não transforme frases, explicações, dados, argumentos ou perguntas do roteiro em subtópicos.\n6. Não introduza novos assuntos nem altere a estrutura aprovada.\n7. Não repita o roteiro nem escreva instruções de apresentação dentro do mapa.\n8. Preserve apenas a hierarquia necessária para organizar os blocos e seus tópicos.\n9. Entregue todo o mapa em uma única caixa de código de texto simples, pronta para copiar e colar.\n\n**Formato obrigatório:**\n\n- Primeira linha: título da edição, sem traço.\n- Primeiro nível: um espaço antes do traço (` -`).\n- Segundo nível: dois espaços antes do traço (`  -`).\n- Níveis adicionais somente quando indispensáveis.\n- Não utilizar marcadores Markdown, numeração automática ou símbolos decorativos.\n\n**O resultado deve ser um mapa de navegação por tópicos, não um resumo do roteiro.**"
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
