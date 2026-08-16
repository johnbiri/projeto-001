// Controle do vídeo
(()=>{"use strict";
const video=document.getElementById("heroVideo"),play=document.querySelector(".hero-video-som"),cta=document.querySelector(".hero-video-cta");
if(!video||!play)return;


// Mostra/oculta o Play
const mostrar=()=>play.classList.remove("oculto"),ocultar=()=>play.classList.add("oculto");
const ctaMostrar=()=>{if(cta)cta.hidden=false};


// Reproduz o vídeo
const reproduzir=()=>{video.muted=false;video.volume=1;video.play().catch(mostrar)};


// Atualiza o Play conforme o estado
video.addEventListener("play",ocultar);


// Impede pausa durante a reprodução
video.addEventListener("pause",()=>{
    if(!video.ended)video.play().catch(()=>{});
});


// Finalização
video.addEventListener("ended",()=>{mostrar();ctaMostrar()});


// CTA após 14 segundos
video.addEventListener("timeupdate",()=>{if(video.currentTime>=14)ctaMostrar()});


// Botão Play
play.addEventListener("click",e=>{
    e.stopPropagation();
    if(video.ended)video.currentTime=0;
    reproduzir();
});


// Começa pausado
video.pause();
mostrar();
})();
