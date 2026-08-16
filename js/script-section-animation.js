// Scroll rápido entre seções
(()=>{
"use strict";

const sections=[...document.querySelectorAll("section")];
const botao=document.querySelector(".botao-cabecalho");
if(!sections.length)return;

let atual=0,bloqueado=false;

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
 const inicio=scrollY,dist=destino-inicio,t0=performance.now();

 const animar=t=>{
  const p=Math.min((t-t0)/300,1),e=1-Math.pow(1-p,3);
  scrollTo(0,inicio+dist*e);
  p<1?requestAnimationFrame(animar):setTimeout(()=>bloqueado=false,50);
 };

 requestAnimationFrame(animar);
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

 main.style.transition="transform .18s ease,opacity .18s ease";
 main.style.transform=`translateX(${-40*direcao}px)`;
 main.style.opacity=".2";

 setTimeout(()=>{
  document.documentElement.style.scrollBehavior="auto";
  scrollTo(0,destino);

  main.style.transition="none";
  main.style.transform=`translateX(${40*direcao}px)`;

  requestAnimationFrame(()=>{
   main.style.transition="transform .18s ease,opacity .18s ease";
   main.style.transform="translateX(0)";
   main.style.opacity="1";

   setTimeout(()=>{
    main.style.transition="";
    main.style.transform="";
    bloqueado=false;
   },180);
  });
 },180);
};

// Roda
addEventListener("wheel",e=>{
 e.preventDefault();
 irPara(atual+(e.deltaY>0?1:-1));
},{passive:false});

// Toque
let y=0;

addEventListener("touchstart",e=>{
 y=e.touches[0].clientY;
},{passive:true});

addEventListener("touchend",e=>{
 const d=y-e.changedTouches[0].clientY;
 if(Math.abs(d)>40)irPara(atual+(d>0?1:-1));
},{passive:true});

// Links internos
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener("click",e=>{
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

  scrollTo({top:destino,behavior:"smooth"});
  return;
 }

 const i=sections.indexOf(alvo);
 if(i<0)return;

 linkPara(i);
}));

// Estado inicial
atualizarBotao();

})();
