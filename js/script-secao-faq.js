(()=>{
"use strict";

const secao=document.querySelector(".secao-faq");
if(!secao)return;

const perguntas=secao.querySelectorAll(".pergunta-faq");
const modal=secao.querySelector(".faq-modal");
const conteudo=secao.querySelector(".faq-modal-conteudo");
const fechar=secao.querySelector(".faq-modal-fechar");

if(!perguntas.length||!modal||!conteudo||!fechar)return;

let itemAtual=null;

const fecharModal=()=>{
 modal.classList.remove("mostrar");
 modal.classList.remove("aberto");
 modal.setAttribute("aria-hidden","true");

 if(itemAtual){
  const item=itemAtual.closest(".item-faq");
  item?.classList.remove("aberto");
  itemAtual.setAttribute("aria-expanded","false");
  itemAtual=null;
 }
};

const abrirModal=botao=>{
 const id=botao.dataset.resposta;
 const resposta=secao.querySelector(`[data-resposta-id="${id}"]`);
 const item=botao.closest(".item-faq");
 const titulo=botao.querySelector("span");

 if(!resposta||!item||!titulo)return;

 if(itemAtual===botao){
  fecharModal();
  return;
 }

 if(itemAtual){
  itemAtual.closest(".item-faq")?.classList.remove("aberto");
  itemAtual.setAttribute("aria-expanded","false");
 }

 itemAtual=botao;
 item.classList.add("aberto");
 botao.setAttribute("aria-expanded","true");

 conteudo.innerHTML=`
  <h3 class="faq-modal-titulo">${titulo.innerHTML}</h3>
  ${resposta.innerHTML}
 `;

 modal.setAttribute("aria-hidden","false");
 modal.classList.remove("mostrar");

 requestAnimationFrame(()=>{
  modal.classList.add("aberto");

  setTimeout(()=>{
   modal.classList.add("mostrar");
  },180);
 });
};

perguntas.forEach(botao=>{
 botao.setAttribute("aria-expanded","false");

 botao.addEventListener("click",()=>{
  abrirModal(botao);
 });
});

fechar.addEventListener("click",fecharModal);

modal.addEventListener("click",e=>{
 if(e.target===modal)fecharModal();
});

document.addEventListener("keydown",e=>{
 if(e.key==="Escape"&&modal.classList.contains("aberto")){
  fecharModal();
 }
});

})();
