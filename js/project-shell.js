document.querySelector('#project-shell').innerHTML=`
<header class="project-nav"><a href="../../#proyectos">← INDEX / PROYECTOS</a><div class="project-nav__center"><span id="project-discipline"></span><span id="project-year"></span></div><button class="project-lang" type="button">ES / EN</button></header>
<main class="project-main">
  <section class="project-hero"><span id="project-number" class="project-hero__number"></span><h1 id="project-title"></h1><p id="project-lead" class="project-hero__lead"></p><div class="project-hero__meta"><span id="project-mode"></span><span id="project-year-mobile"></span></div><div id="project-links" class="project-links"></div></section>
  <section id="gallery" class="project-gallery"></section>
  <section class="project-narrative" aria-label="Relato del proyecto">
    <header><p class="project-kicker">PROCESO / DESARROLLO</p><h2>DE LA INVESTIGACIÓN<br><em>AL RESULTADO.</em></h2></header>
    <article class="project-narrative__origin"><p class="project-kicker" id="label-concept"></p><div id="concept-copy" class="project-copy"></div></article>
    <article class="project-narrative__material"><p class="project-kicker" id="label-research"></p><ul id="research-list" class="project-list"></ul></article>
    <article class="project-narrative__process"><p class="project-kicker" id="label-process"></p><div class="project-copy"><p id="process-copy"></p><div id="contribution"></div></div></article>
    <article class="project-narrative__result"><p class="project-kicker" id="label-result"></p><div class="project-copy"><p id="result-copy"></p></div></article>
  </section>
  <footer class="project-credits"><p id="label-credits" class="project-kicker"></p><p id="credits-copy"></p><p>© KATALINA RÍOS 2026</p></footer>
  <a class="project-next" href="../../#proyectos"><span>VOLVER AL ARCHIVO</span><b>↗</b></a>
</main>`;
