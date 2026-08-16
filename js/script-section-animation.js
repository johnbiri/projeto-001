// Scroll rápido entre seções
(()=>{
"use strict";

const sections=[...document.querySelectorAll("section")];
const botao=document.querySelector(".botao-cabecalho");
if(!sections.length)return;

let atual=0,bloqueado=false;
let animacaoId=null;

const modalAberto=()=>document.querySelector(".faq-modal")?.classList.contains("aberto");

// Atualiza a cor do botão
const atualizarBotao=()=>{
 botao?.classList.toggle("is-colorido",atual===0);
};

// Desliza para próxima/anterior
const irPara=i=>{
 if(bloqueado||i<0||i>=sections.length)return;

 bloqueado=true;
 atual=i;
 atualizarBotao();

 const h=document.querySelector(".site-header")?.offsetHeight||0;
 const destino=sections[i].getBoundingClientRect().top+scrollY-h;
 const inicio=scrollY;
 const dist=destino-inicio;
 const t0=performance.now();
 const duracao=140;

 const animar=t=>{
  const p=Math.min((t-t0)/duracao,1);
  const e=1-Math.pow(1-p,3);

  scrollTo(0,inicio+dist*e);

  if(p<1){
   animacaoId=requestAnimationFrame(animar);
  }else{
   animacaoId=null;
   bloqueado=false;
  }
 };

 if(animacaoId)cancelAnimationFrame(animacaoId);
 animacaoId=requestAnimationFrame(animar);
};

// Links: troca lateral rápida
const linkPara=i=>{
 if(bloqueado||i<0||i>=sections.length)return;

 const anterior=atual;
 const direcao=i>anterior?1:-1;

 bloqueado=true;
 atual=i;
 atualizarBotao();

 const h=document.querySelector(".site-header")?.offsetHeight||0;
 const destino=sections[i].getBoundingClientRect().top+scrollY-h;
 const main=document.querySelector("main")||document.body;

 main.style.transition="transform .08s ease,opacity .08s ease";
 main.style.transform=`translateX(${-40*direcao}px)`;
 main.style.opacity=".2";

 requestAnimationFrame(()=>{
  document.documentElement.style.scrollBehavior="auto";
  scrollTo(0,destino);

  main.style.transition="none";
  main.style.transform=`translateX(${40*direcao}px)`;

  requestAnimationFrame(()=>{
   main.style.transition="transform .08s ease,opacity .08s ease";
   main.style.transform="translateX(0)";
   main.style.opacity="1";

   requestAnimationFrame(()=>{
    main.style.transition="";
    main.style.transform="";
    main.style.opacity="";
    bloqueado=false;
   });
  });
 });
};

// Roda
addEventListener("wheel",e=>{
 if(modalAberto())return;
 e.preventDefault();
 irPara(atual+(e.deltaY>0?1:-1));
},{passive:false});

// Toque
let y=0;

addEventListener("touchstart",e=>{
 if(modalAberto())return;
 y=e.touches[0].clientY;
},{passive:true});

addEventListener("touchend",e=>{
 if(modalAberto())return;

 const d=y-e.changedTouches[0].clientY;

 if(Math.abs(d)>40){
  irPara(atual+(d>0?1:-1));
 }
},{passive:true});

// Links internos
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener("click",e=>{
 if(modalAberto())return;

 const href=a.getAttribute("href");
 const alvo=document.querySelector(href);
 if(!alvo)return;

 e.preventDefault();

 // Logo: volta ao início
 if(href==="#conteudo"){
  atual=0;
  atualizarBotao();

  const h=document.querySelector(".site-header")?.offsetHeight||0;
  const destino=alvo.getBoundingClientRect().top+scrollY-h;

  document.documentElement.style.scrollBehavior="auto";
  scrollTo(0,destino);
  return;
 }

 const i=sections.indexOf(alvo);
 if(i<0)return;

 linkPara(i);
}));

// Estado inicial
atualizarBotao();

})();
