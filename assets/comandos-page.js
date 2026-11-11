(function(){
  "use strict";
  const library=window.GP_COMMAND_LIBRARY;
  const audio=document.getElementById("audiovisualCommands");
  const blog=document.getElementById("blogCommands");
  if(!library || !Array.isArray(library.commands)){for(const el of [audio,blog])el.textContent="Biblioteca de comandos indisponível. Consulte os documentos originais no final da página.";return;}
  const build=(data)=>{
    const card=document.createElement("article");card.className="command-card";card.id="comando-"+data.n;
    const stage=document.createElement("span");stage.className="command-stage";stage.textContent="COMANDO "+data.n;
    const title=document.createElement("h3");title.textContent=data.title;
    const desc=document.createElement("p");desc.textContent=data.desc;
    const buttons=document.createElement("div");buttons.className="command-actions";
    const copy=document.createElement("button");copy.type="button";copy.textContent="Copiar comando completo";copy.setAttribute("aria-label","Copiar o Comando "+data.n);
    const feedback=document.createElement("span");feedback.className="copy-feedback";feedback.setAttribute("role","status");feedback.setAttribute("aria-live","polite");
    const details=document.createElement("details");
    const summary=document.createElement("summary");summary.textContent="Consultar texto integral";
    const field=document.createElement("textarea");field.readOnly=true;field.spellcheck=false;field.value=data.text;field.setAttribute("aria-label","Texto integral do Comando "+data.n);
    copy.addEventListener("click",async()=>{
      let ok=false;try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(data.text);ok=true;}}catch(e){}
      if(!ok){details.open=true;field.focus();field.select();try{ok=!!document.execCommand("copy")}catch(e){}}
      feedback.textContent=ok?"Comando "+data.n+" copiado.":"Selecione o texto integral e use Ctrl+C.";
      if(!ok){details.open=true;field.focus();field.select();}
    });
    buttons.append(copy,feedback);
    if(data.docs){const ref=document.createElement("a");ref.href=data.docs;ref.target="_blank";ref.rel="noopener noreferrer";ref.textContent="Documento original no Drive ↗";buttons.append(ref);}
    details.append(summary,field);card.append(stage,title,desc,buttons,details);
    return card;
  };
  for(const item of library.commands){(Number(item.n)<=3?audio:blog).append(build(item));}
})();
