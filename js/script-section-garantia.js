// Modal de cancelamento
(()=>{
  "use strict";

  const botao=document.querySelector(".botao-cancelamento");
  const modal=document.querySelector(".modal-cancelamento");
  const fechar=modal?.querySelector(".modal-cancelamento-fechar");
  const overlay=modal?.querySelector(".modal-cancelamento-overlay");

  if(!botao||!modal)return;

  const abrir=()=>{
    modal.classList.add("aberto");
    modal.setAttribute("aria-hidden","false");
    document.body.style.overflow="hidden";
    fechar?.focus();
  };

  const fecharModal=()=>{
    modal.classList.remove("aberto");
    modal.setAttribute("aria-hidden","true");
    document.body.style.overflow="";
    botao.focus();
  };

  botao.addEventListener("click",abrir);
  fechar?.addEventListener("click",fecharModal);
  overlay?.addEventListener("click",fecharModal);

  document.addEventListener("keydown",event=>{
    if(event.key==="Escape"&&modal.classList.contains("aberto")){
      fecharModal();
    }
  });
})();