(()=>{
"use strict";
const secao=document.querySelector(".secao-planos");
if(!secao)return;

const observer=new IntersectionObserver(entries=>{
 entries.forEach(entry=>{
  if(entry.isIntersecting){
   secao.classList.remove("selo-visivel");
   requestAnimationFrame(()=>secao.classList.add("selo-visivel"));
  }else{
   secao.classList.remove("selo-visivel");
  }
 });
},{threshold:.25});

observer.observe(secao);
})();