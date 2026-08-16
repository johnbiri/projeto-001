(function(){
"use strict";

const faixa=document.querySelector(".depoimentos-faixa");
const palco=document.querySelector(".depoimentos-palco");
const setaAnterior=document.querySelector(".seta-anterior");
const reduzirMovimento=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if(!faixa||!palco)return;

const cards=Array.from(faixa.querySelectorAll(".depoimento-card"));

if(cards.length<2)return;

let indiceAtual=0;
let temporizador=null;
let inicioX=0;
let arrastando=false;

const atualizar=()=>{
 const proximo=(indiceAtual+1)%cards.length;

 cards.forEach((card,indice)=>{
  card.classList.toggle("ativo",indice===indiceAtual);
  card.classList.toggle("proximo",indice===proximo);
 });
};

const iniciarAutoplay=()=>{
 if(reduzirMovimento)return;

 clearInterval(temporizador);

 temporizador=setInterval(()=>{
  indiceAtual=(indiceAtual+1)%cards.length;
  atualizar();
 },30000);
};

const irParaProximo=()=>{
 indiceAtual=(indiceAtual+1)%cards.length;
 atualizar();
 iniciarAutoplay();
};

const irParaAnterior=()=>{
 indiceAtual=(indiceAtual-1+cards.length)%cards.length;
 atualizar();
 iniciarAutoplay();
};

if(setaAnterior){
 setaAnterior.addEventListener("click",event=>{
  event.preventDefault();
  event.stopPropagation();
  irParaAnterior();
 });
}

cards.forEach(card=>{
 card.addEventListener("click",()=>{
  if(card.classList.contains("proximo")){
   irParaProximo();
  }
 });
});

palco.addEventListener("pointerdown",event=>{
 inicioX=event.clientX;
 arrastando=true;
});

palco.addEventListener("pointerup",event=>{
 if(!arrastando)return;

 const distancia=event.clientX-inicioX;
 arrastando=false;

 if(distancia<-40){
  irParaProximo();
 }else if(distancia>40){
  irParaAnterior();
 }
});

palco.addEventListener("pointercancel",()=>{
 arrastando=false;
});

atualizar();
iniciarAutoplay();

})();
