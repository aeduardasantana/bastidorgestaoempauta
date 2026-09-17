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
Acesse a publicação original e leia o corpo da matéria. O título, o score e as hipóteses do Bastidor servem apenas para localizar e orientar a investigação; não os trate como prova.

1. Separe fatos confirmados, declarações atribuídas e hipóteses.
2. Identifique o fato econômico, regulatório ou empresarial que iniciou o acontecimento.
3. Verifique se existe uma decisão empresarial concreta.
4. Explique eventual mudança na organização do trabalho, sem inventar consequências ausentes na fonte.
5. Identifique pessoas ou grupos afetados e a responsabilidade da liderança.
6. Avalie a aderência ao Gestão em Pauta e ao Desenvolvimento Humano Aplicado ao Trabalho.
7. Classifique como: Pauta principal, Giro semanal, Acompanhar ou Não usar.
8. Sugira manchete, perspectiva de análise, público interessado, buscas prováveis, hashtags e uma prévia do que Eduarda poderia falar.
9. Informe restrições de reprodução e diferencie propriedade da informação de propriedade do texto.
10. Se o corpo da fonte não estiver acessível, declare essa limitação e não complete lacunas.`;try{await navigator.clipboard.writeText(text)}catch{copyFallback(text)}copyDetailButton.textContent="✓ Copiado";setTimeout(()=>copyDetailButton.textContent="⧉ Copiar análise",1800)}
copyDetailButton.onclick=copyDetailForChatGPT;

// A curadoria por API está desativada. Coleta, filtros e classificação são gratuitos.
function scoreInfo(x){const p=x.editorialPotential;if(p)return {value:p.score*10,label:p.recommendation,note:"Potencial editorial preliminar. Usa somente título, fonte e metadados; não substitui a leitura."};if(x.score===null||x.score===undefined)return {value:null,label:"Em cálculo",note:"Sem dados suficientes para priorizar."};const value=Math.max(0,Math.min(100,x.score>11?Math.round(x.score):Math.round(((x.score-3)/8)*100)));return {value,label:value>=75?"Pauta principal":value>=50?"Giro semanal":value>=25?"Acompanhar":"Não priorizar",note:"Triagem preliminar; confirme o corpo da fonte."}}
function potentialBox(x){const p=x.editorialPotential;if(!p)return '<div class="detail-box warn"><b>Potencial editorial ainda não recalculado.</b><br>Aguarde a próxima atualização do radar.</div>';const questions=(p.questions||[]).map(q=>'<li>'+plain(q)+'</li>').join(""),missing=(p.missing||[]).map(q=>'<li>'+plain(q)+'</li>').join(""),related=(x.relatedSources||[]).map(s=>'<li><a href="'+safeUrl(s.url)+'" target="_blank" rel="noopener">'+plain(s.source)+' - '+plain(s.title)+'</a></li>').join("");return '<div class="detail-box"><b>Leitura sistêmica preliminar</b><br><small>'+plain(p.caveat)+'</small><br><br><b>Recomendação:</b> '+plain(p.recommendation)+' - '+p.score+'/10<br><b>Cenário:</b> '+plain(p.event)+'<br><b>Porta de entrada:</b> '+plain(p.economicTrigger)+'<br><b>Questão organizacional:</b> '+plain(p.organizationalHypothesis)+(questions?'<br><b>Perguntas para validar no corpo:</b><ul>'+questions+'</ul>':"")+(missing?'<b>Ainda precisa confirmar:</b><ul>'+missing+'</ul>':"")+(related?'<b>Outras fontes do mesmo acontecimento:</b><ul>'+related+'</ul>':"")+'</div>'}
function analysisBox(x){const preliminary=potentialBox(x),b=x.bodyAnalysis;if(!b)return preliminary+'<div class="detail-box warn"><b>Triagem manual.</b><br>Abra a fonte e confirme fatos, datas, envolvidos e consequências antes de decidir. O sistema não está utilizando a API da OpenAI.</div>';if(!b.status?.startsWith("analisado"))return preliminary+'<div class="detail-box warn"><b>Revisão manual necessária:</b><br>'+plain(b.reason||"O corpo da publicação não pôde ser validado.")+'</div>';const e=b.editorial||{},r=b.relevance||{},facts=(b.facts_confirmed||[]).map(v=>'<li>'+plain(v)+'</li>').join(""),statements=(b.source_statements||[]).map(v=>'<li>'+plain(v)+'</li>').join(""),consequences=(b.managerial_consequences||[]).map(v=>'<li>'+plain(v)+'</li>').join("");return preliminary+'<div class="detail-box"><b>Curadoria já realizada</b><br><small>Resultado preservado da execução anterior. Nenhuma nova análise por API será feita.</small><br><br><b>Veredito:</b> '+plain(r.verdict||"A validar")+' - '+plain(r.reason||"")+'<br><b>Manchete sugerida:</b> '+plain(e.headline||"")+'<br><b>Prévia de fala:</b> '+plain(e.speaking_preview||"")+(facts?'<br><br><b>Fatos confirmados:</b><ul>'+facts+'</ul>':"")+(statements?'<b>Declarações atribuídas:</b><ul>'+statements+'</ul>':"")+(consequences?'<b>Consequências gerenciais:</b><ul>'+consequences+'</ul>':"")+'<b>Restrições de uso:</b> '+plain(b.restrictions||b.source_owner_note||"Usar redação própria e atribuir a fonte.")+'<br><b>Cuidado editorial:</b> '+plain(b.caution||"Validar fonte e contexto.")+'</div>'}

function decorateCuratedCards(){document.querySelectorAll(".news-card").forEach(card=>{if(card.querySelector(".curation-verdict"))return;const item=news.find(x=>x.title===card.querySelector("h4")?.textContent),analysis=item?.bodyAnalysis,p=item?.editorialPotential;if(!item)return;const box=document.createElement("div");box.className="curation-verdict "+(analysis?.status?.startsWith("analisado")?"ready":(p?.recommendation==="Não priorizar"?"manual":"preliminary"));box.innerHTML=analysis?.status?.startsWith("analisado")?'<b>'+plain(analysis.relevance?.verdict||"A validar")+'</b><span>Curadoria anterior preservada</span>':'<b>'+plain(p?.recommendation||"Triagem manual")+'</b><span>'+(p?plain(p.event)+' - hipótese para validar na fonte':'Aguardando atualização do radar')+'</span>';card.querySelector(".summary").after(box)})}
const gridObserver=new MutationObserver(decorateCuratedCards);gridObserver.observe(document.querySelector("#newsGrid"),{childList:true});
document.head.insertAdjacentHTML("beforeend",'<style>.copy-detail{margin-left:auto;margin-right:8px;padding:5px 7px;white-space:nowrap;text-decoration:none;font-size:11px;color:#80561f;border:1px solid transparent;border-radius:3px}.copy-detail:hover{border-color:#d8d2c7;background:#f2eee6}.results-actions{display:flex;align-items:center;justify-content:flex-end;gap:8px;flex-wrap:wrap}.copy-results{padding:6px 8px;white-space:nowrap;text-decoration:none;font-size:11px;color:#80561f;border:1px solid #d8d2c7;border-radius:3px;background:transparent}.copy-results:hover{background:#f2eee6;border-color:#b48b53}.copy-results:disabled{color:#899099;border-color:#ddd8cf;cursor:not-allowed}.curation-verdict{padding:10px 12px;background:#e5eee9;border-left:3px solid #1f4b42;display:grid;gap:4px;font-size:12px}.curation-verdict.preliminary{background:#edf0f2;border-color:#718596}.curation-verdict.manual{background:#f5e7df;border-color:#9b5c3b}.curation-verdict span{color:#52606c;line-height:1.35}@media(max-width:600px){.copy-detail{margin-left:auto}.results-actions{justify-content:flex-start}}</style>');

const potentialLabel=document.createElement("label");potentialLabel.innerHTML='Potencial editorial<select id="potentialFilter"><option value="Todos">Todos os potenciais</option><option>Pauta principal</option><option>Giro semanal</option><option>Acompanhar</option><option>Não priorizar</option></select>';document.querySelector("#apply").before(potentialLabel);
const filterBeforePotential=filter;filter=function(){const items=filterBeforePotential(),choice=document.querySelector("#potentialFilter")?.value||"Todos";return choice==="Todos"?items:items.filter(x=>x.editorialPotential?.recommendation===choice)};
document.querySelector("#potentialFilter").onchange=render;
document.querySelector(".notice small").innerHTML='<b>Potencial editorial:</b> 0–3 Não priorizar · 4–5 Acompanhar · 6–7 Giro semanal · 8–10 Pauta principal. É uma hipótese baseada em título, fonte e metadados; confirme o corpo da publicação.';

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
Potencial preliminar: ${potential.score??"Não calculado"}/10 — ${potential.recommendation||"Não classificado"}
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
Potencial editorial: ${selectedOptionText("#potentialFilter")}
Busca digitada: ${search}
Quantidade: ${items.length}

${items.map(resultForChatGPT).join("\n\n────────────────────────────\n\n")}

TAREFA PARA O CHATGPT
Faça uma curadoria comparativa de todos os resultados. Não decida apenas por título, resumo ou score do Bastidor: eles são hipóteses de descoberta. Acesse os links, leia o corpo das publicações e declare o que não conseguir verificar.

1. Analise cada resultado individualmente e agrupe os que tratam do mesmo acontecimento.
2. Localize e priorize a fonte original, oficial ou mais antiga; diferencie fonte interessada, documento oficial e repercussão jornalística.
3. Separe fatos confirmados, declarações atribuídas, interpretações, hipóteses e inferências. Não invente efeitos humanos nem faça aconselhamento jurídico.
4. Informe restrições de reprodução: a informação pode ser noticiada com redação própria; texto, imagem, vídeo, tabela e infográfico de terceiros não devem ser copiados sem autorização.
5. Avalie cada acontecimento pelo percurso: dinheiro/regra/mercado → decisão empresarial → mudança no trabalho → pessoas → responsabilidade da liderança.
6. Julgue a aderência ao Gestão em Pauta, ao Desenvolvimento Humano Aplicado ao Trabalho e à atuação do GEB, considerando empresários, CEOs, diretores, lideranças, RH, SST, jurídico, financeiro e gestores.
7. Entregue um ranking e classifique em: Pauta principal, Segunda opção, Giro semanal, Acompanhar ou Não priorizar. Descarte conteúdo meramente promocional, evento, lista ou opinião genérica.
8. Para as pautas viáveis, proponha manchete baseada no corpo, perspectiva própria da Eduarda, público-alvo, motivo de interesse, pesquisas prováveis, palavras-chave, hashtags e uma breve prévia do que ela poderia falar.
9. Explique por que a primeira pauta é superior às demais e quais fatos ainda precisam ser confirmados.
10. Não escreva o roteiro completo antes que eu escolha a pauta.`}
function updateCopyResultsButton(){const count=filter().length;copyResultsButton.disabled=!count;copyResultsButton.textContent=count?`⧉ Copiar ${count} resultado${count===1?"":"s"}`:"⧉ Sem resultados"}
async function copyFilteredResults(){const text=filteredResultsText();try{await navigator.clipboard.writeText(text)}catch{copyFallback(text)}copyResultsButton.textContent="✓ Resultados copiados";setTimeout(updateCopyResultsButton,1800)}
copyResultsButton.onclick=copyFilteredResults;const copyResultsObserver=new MutationObserver(updateCopyResultsButton);copyResultsObserver.observe(document.querySelector("#newsGrid"),{childList:true});updateCopyResultsButton();
