(function () {
  "use strict";

  const body = document.body;
  const header = document.querySelector(".site-header");
  const hero = document.querySelector(".secao-hero");
  const menuButton = document.querySelector(".menu-button");
  const mainNav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll('a[href^="#"]');
  const itensSelo = document.querySelectorAll(".item-selo");
  const textoHero = document.querySelector(".texto-hero");
  const elementosEntrada = document.querySelectorAll(".entrada-secao");
  const secaoResultado = document.querySelector(".secao-resultado");
  const contadorDias = document.querySelector(".contador-dias");
  const itensFaq = document.querySelectorAll(".item-faq");
  const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let contadorIniciado = false;

  const closeMenu = () => {
    if (!menuButton || !mainNav) return;

    menuButton.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    mainNav.classList.remove("is-open");
    body.classList.remove("menu-open");
  };

  const toggleMenu = () => {
    if (!menuButton || !mainNav) return;

    const isOpen = menuButton.getAttribute("aria-expanded") === "true";

    menuButton.classList.toggle("is-open", !isOpen);
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    mainNav.classList.toggle("is-open", !isOpen);
    body.classList.toggle("menu-open", !isOpen);
  };

  if (menuButton) {
    menuButton.addEventListener("click", toggleMenu);
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  const updateHeaderState = () => {
    if (!header || !hero) return;

    const heroBottom = hero.offsetTop + hero.offsetHeight;

    header.classList.toggle(
      "is-after-hero",
      window.scrollY > heroBottom - header.offsetHeight - 8
    );
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  const iniciarCarrosselSelo = () => {
    if (!itensSelo.length) return;

    itensSelo.forEach((item, indice) => {
      item.classList.toggle("ativo", indice === 0);
    });
  };

  const escreverTextoHero = () => {
    if (!textoHero) return;

    const textoInicial = textoHero.dataset.textoInicial || "";
    const textoFinal = textoHero.dataset.textoFinal || "";
    const textoDestaque = textoHero.dataset.textoDestaque || "";

    textoHero.textContent = "";

    const cursor = document.createElement("span");
    cursor.className = "cursor-escrita";
    cursor.setAttribute("aria-hidden", "true");

    const primeiraLinha = document.createElement("span");
    const quebra = document.createElement("br");
    const segundaLinha = document.createElement("span");
    const espaco = document.createTextNode(" ");
    const destaque = document.createElement("strong");

    textoHero.append(
      primeiraLinha,
      quebra,
      segundaLinha,
      espaco,
      destaque,
      cursor
    );

    if (reduzirMovimento) {
      primeiraLinha.textContent = textoInicial;
      segundaLinha.textContent = textoFinal;
      destaque.textContent = textoDestaque;
      textoHero.classList.add("escrita-finalizada");
      return;
    }

    const escrever = (elemento, texto, indice, aoFinal) => {
      if (indice >= texto.length) {
        if (aoFinal) aoFinal();
        return;
      }

      elemento.textContent += texto.charAt(indice);

      window.setTimeout(
        () => escrever(elemento, texto, indice + 1, aoFinal),
        34
      );
    };

    window.setTimeout(() => {
      escrever(primeiraLinha, textoInicial, 0, () => {
        window.setTimeout(() => {
          escrever(segundaLinha, textoFinal, 0, () => {
            window.setTimeout(() => {
              escrever(destaque, textoDestaque, 0, () => {
                textoHero.classList.add("escrita-finalizada");
              });
            }, 120);
          });
        }, 160);
      });
    }, 650);
  };

  const iniciarContadorDias = () => {
    if (!contadorDias || contadorIniciado) return;

    contadorIniciado = true;

    const valorFinal = Number.parseInt(
      contadorDias.dataset.contadorFinal || "45",
      10
    );

    if (reduzirMovimento) {
      contadorDias.textContent = String(valorFinal);
      return;
    }

    const duracao = 2800;
    const inicio = performance.now();

    const animar = (agora) => {
      const progresso = Math.min((agora - inicio) / duracao, 1);
      const suavizado = 1 - Math.pow(1 - progresso, 3);
      const valorAtual = Math.round(suavizado * valorFinal);

      contadorDias.textContent = String(valorAtual);

      if (progresso < 1) {
        window.requestAnimationFrame(animar);
      }
    };

    window.requestAnimationFrame(animar);
  };

  const iniciarAnimacoesDeSecao = () => {
    if (!elementosEntrada.length && !secaoResultado) return;

    if (!("IntersectionObserver" in window)) {
      elementosEntrada.forEach((elemento) => {
        elemento.classList.add("visivel");
      });

      iniciarContadorDias();
      return;
    }

    const observadorEntrada = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;

          entrada.target.classList.add("visivel");
          observadorEntrada.unobserve(entrada.target);
        });
      },
      { threshold: 0.28 }
    );

    elementosEntrada.forEach((elemento) => {
      observadorEntrada.observe(elemento);
    });

    if (secaoResultado) {
      const observadorContador = new IntersectionObserver(
        (entradas) => {
          entradas.forEach((entrada) => {
            if (!entrada.isIntersecting) return;

            iniciarContadorDias();
            observadorContador.disconnect();
          });
        },
        {
          threshold: 0.55,
          rootMargin: "-15% 0px -15% 0px"
        }
      );

      observadorContador.observe(secaoResultado);
    }
  };

  const iniciarAccordionFaq = () => {
    if (!itensFaq.length) return;

    const fecharItem = (item) => {
      const botao = item.querySelector(".pergunta-faq");

      item.classList.remove("aberto");
      botao?.setAttribute("aria-expanded", "false");
    };

    itensFaq.forEach((item) => {
      const botao = item.querySelector(".pergunta-faq");

      if (!botao) return;

      botao.addEventListener("click", () => {
        const estaAberto = item.classList.contains("aberto");

        itensFaq.forEach(fecharItem);

        if (!estaAberto) {
          item.classList.add("aberto");
          botao.setAttribute("aria-expanded", "true");
        }
      });
    });
  };

  iniciarCarrosselSelo();
  escreverTextoHero();
  iniciarAnimacoesDeSecao();
  iniciarAccordionFaq();
})();