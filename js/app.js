const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const translations = {
  es: {
    navIndex: 'INDEX', navWork: 'WORK', navAbout: 'ABOUT', navContact: 'CONTACT',
    heroDiscipline: 'DISEÑO / SISTEMA MODA',
    heroStatement: 'Entre el cuerpo, la materia y la interacción.',
    heroDescriptor: 'FASHION / MATERIAL / DIGITAL EXPERIMENTATION',
    explore: 'EXPLORAR PROYECTOS', workTitle: 'WORK.',
    workIntro: 'Siete proyectos entre moda, materialidad y experiencias digitales, explicados directamente en el recorrido principal.',
    aboutTitle: 'ABOUT.',
    aboutCopy: 'Soy Katalina Ríos, estudiante de Diseño con mención en Sistema Moda. Me interesan la experimentación textil, los biomateriales, el cuerpo, la materialidad y las experiencias digitales.',
    contactTitle: 'CONTACT.'
  },
  en: {
    navIndex: 'INDEX', navWork: 'WORK', navAbout: 'ABOUT', navContact: 'CONTACT',
    heroDiscipline: 'DESIGN / FASHION SYSTEMS',
    heroStatement: 'Between the body, material and interaction.',
    heroDescriptor: 'FASHION / MATERIAL / DIGITAL EXPERIMENTATION',
    explore: 'EXPLORE PROJECTS', workTitle: 'WORK.',
    workIntro: 'Seven projects spanning fashion, materiality and digital experiences, explained directly in the main journey.',
    aboutTitle: 'ABOUT.',
    aboutCopy: 'I am Katalina Ríos, a Design student specialising in Fashion Systems. My interests include textile experimentation, biomaterials, the body, materiality and digital experiences.',
    contactTitle: 'CONTACT.'
  }
};

let language = 'es';
let activeFilter = 'all';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function renderProjects() {
  const list = $('#project-list');
  const t = translations[language];
  const projects = window.PORTFOLIO_PROJECTS.filter(project => activeFilter === 'all' || project.category === activeFilter);
  const card = project => {
    const visual = project.cover ? `
      <div class="project-story__collage">
        <figure class="project-story__primary"><img src="${project.cover}" alt="${project.alt}" loading="lazy"></figure>
        ${project.secondary ? `<figure class="project-story__secondary"><img src="${project.secondary}" alt="Detalle complementario de ${project.title}" loading="lazy"></figure>` : ''}
      </div>` : `
      <div class="project-story__digital" aria-label="Proyecto digital ${project.title}">
        <p>${project.title}</p><span>${project.discipline}</span>
        <a href="${project.demo}" target="_blank" rel="noreferrer">ABRIR EXPERIENCIA</a>
      </div>`;
    return `
      <article class="project-row project-story project-story--${project.category} reveal" data-category="${project.category}" data-project="${project.id}" data-title="${project.title}">
        <header class="project-story__header">
          <p class="project-story__index mono">${project.number} / 07</p>
          <div class="project-row__title"><p class="mono">${project.discipline}${project.year ? ` / ${project.year}` : ''}</p><h3>${project.title}</h3></div>
          <p class="project-story__summary">${project.summary}</p>
        </header>
        <div class="project-story__visual">${visual}</div>
        <div class="project-story__narrative"><p>${project.concept}</p><p>${project.process}</p><p class="project-story__outcome">${project.result}</p></div>
        <a class="project-story__deep-link" href="projects/${project.slug}/index.html" data-cursor="ABRIR">VER PROYECTO COMPLETO</a>
      </article>`;
  };
  list.innerHTML = projects.map(card).join('');
  prepareChaosType(list);
  prepareImageMotion(list);
  observeReveals();
}

function prepareImageMotion(root = document) {
  if (reducedMotion || !matchMedia('(pointer:fine)').matches) return;
  root.querySelectorAll('.project-story').forEach(row => {
    const media = row.querySelector('.project-story__visual');
    if (!media) return;
    row.addEventListener('pointermove', event => {
      const rect = media.getBoundingClientRect();
      const x = Math.max(-.5, Math.min(.5, (event.clientX - rect.left) / rect.width - .5));
      const y = Math.max(-.5, Math.min(.5, (event.clientY - rect.top) / rect.height - .5));
      media.style.setProperty('--image-x', `${x * 12}px`);
      media.style.setProperty('--image-y', `${y * 8}px`);
      media.style.setProperty('--detail-x', `${x * -18}px`);
      media.style.setProperty('--detail-y', `${y * -12}px`);
    });
    row.addEventListener('pointerleave', () => {
      media.style.setProperty('--image-x', '0px');
      media.style.setProperty('--image-y', '0px');
      media.style.setProperty('--detail-x', '0px');
      media.style.setProperty('--detail-y', '0px');
    });
  });
}

function wrapChaosLetters(element) {
  if (element.dataset.chaosReady) return;
  const label = element.textContent.trim();
  element.dataset.chaosReady = 'true';
  element.setAttribute('aria-label', label);
  let letterIndex = 0;
  element.innerHTML = label.split(/\s+/).map(word => `<span class="chaos-word" aria-hidden="true">${[...word].map(character => {
    const x = Math.round((Math.random() - .5) * 34);
    const y = Math.round((Math.random() - .5) * 24);
    const rotate = Math.round((Math.random() - .5) * 34);
    const scale = (0.86 + Math.random() * .34).toFixed(2);
    const flow = letterIndex % 3 === 0 ? -1 : letterIndex % 3 === 1 ? .45 : 1;
    return `<span class="chaos-letter" style="--chaos-x:${x}px;--chaos-y:${y}px;--chaos-r:${rotate}deg;--chaos-s:${scale};--chaos-delay:${letterIndex * 7}ms;--letter-flow:${flow};--letter-i:${letterIndex++}">${character}</span>`;
  }).join('')}</span>`).join('<span class="chaos-space" aria-hidden="true"> </span>');
}

function prepareChaosType(root = document) {
  root.querySelectorAll('.project-row').forEach(row => {
    const title = row.querySelector('.project-row__title h3');
    wrapChaosLetters(title);
    row.addEventListener('pointerenter', () => title.classList.add('is-chaotic'));
    row.addEventListener('pointerleave', () => title.classList.remove('is-chaotic'));
  });
}

function setLanguage(next) {
  language = next;
  document.documentElement.lang = next;
  $$('[data-i18n]').forEach(element => {
    const value = translations[next][element.dataset.i18n];
    if (value) element.innerHTML = value;
  });
  const toggle = $('.lang-toggle');
  toggle.innerHTML = next === 'es' ? '<b>ES</b> / <span>EN</span>' : '<span>ES</span> / <b>EN</b>';
  renderProjects();
}

function observeReveals() {
  if (reducedMotion) return $$('.reveal').forEach(item => item.classList.add('is-visible'));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  $$('.reveal:not(.is-visible)').forEach(item => observer.observe(item));
}

// Adaptación en JavaScript del patrón Text Scramble de Motion Primitives (MIT).
function scrambleText(element) {
  if (reducedMotion) return;
  const finalText = element.textContent;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/—';
  let frame = 0;
  const total = finalText.length * 2.2;
  const tick = () => {
    element.textContent = [...finalText].map((char, index) => {
      if (char === ' ') return ' ';
      return index < frame / 2.2 ? char : chars[Math.floor(Math.random() * chars.length)];
    }).join('');
    frame += 1;
    if (frame <= total) requestAnimationFrame(tick);
    else element.textContent = finalText;
  };
  tick();
}

$$('.filters button').forEach(button => button.addEventListener('click', () => {
  $$('.filters button').forEach(item => item.classList.remove('is-active'));
  button.classList.add('is-active');
  activeFilter = button.dataset.filter;
  renderProjects();
}));

$('.lang-toggle').addEventListener('click', () => setLanguage(language === 'es' ? 'en' : 'es'));
$('.menu-toggle').addEventListener('click', event => {
  const open = document.body.classList.toggle('menu-open');
  event.currentTarget.setAttribute('aria-expanded', String(open));
});
$$('.site-menu a').forEach(link => link.addEventListener('click', () => {
  document.body.classList.remove('menu-open');
  $('.menu-toggle').setAttribute('aria-expanded', 'false');
}));

if (matchMedia('(pointer:fine)').matches) {
  const cursor = $('.cursor');
  if (cursor) cursor.remove();
}

renderProjects();
['.hero__practice span', '.hero__practice em', '#work-title', '.about-preview h2', '.contact h2'].forEach(selector => {
  const element = $(selector);
  if (!element) return;
  wrapChaosLetters(element);
  element.addEventListener('pointerenter', () => element.classList.add('is-chaotic'));
  element.addEventListener('pointerleave', () => element.classList.remove('is-chaotic'));
});
observeReveals();

function prepareLandingLetters(){
  $$('.manifesto__name>span').forEach((line,lineIndex)=>{
    if(line.dataset.introReady)return;
    const label=line.textContent;
    line.dataset.introReady='true';
    line.setAttribute('aria-label',label);
    line.innerHTML=[...label].map((character,index)=>character===' '
      ? '<span class="intro-space" aria-hidden="true"> </span>'
      : `<span class="intro-letter" aria-hidden="true" style="--intro-delay:${lineIndex*130+index*52}ms;--intro-y:${index%3===0?42:index%3===1?-28:24}px">${character}</span>`).join('');
  });
  requestAnimationFrame(()=>document.querySelector('.manifesto--cover')?.classList.add('intro-ready'));
}
prepareLandingLetters();

// El scroll construye las composiciones sin esconder contenido ni perseguir el cursor.
if (!reducedMotion) {
  let archiveFrame = 0;
  const updateArchive = () => {
    $$('.project-story').forEach(story => {
      const rect = story.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height * .45)));
      const entering=1-progress;
      const tension=Math.sin(progress*Math.PI);
      const motionFactor=innerWidth<=800?.42:1;
      const id=story.dataset.project;
      const movement={
        kero:{px:-54,py:48,sx:58,sy:-34,rotate:-2.4},
        lacrima:{px:0,py:92,sx:0,sy:126,rotate:0},
        lithos:{px:-46,py:34,sx:52,sy:54,rotate:1.2},
        aeris:{px:-18,py:72,sx:24,sy:96,rotate:-.7}
      }[id]||{px:0,py:54,sx:0,sy:46,rotate:0};
      story.style.setProperty('--story-progress', progress.toFixed(3));
      story.style.setProperty('--story-primary-x',`${movement.px*entering*motionFactor}px`);
      story.style.setProperty('--story-primary-y',`${movement.py*entering*motionFactor}px`);
      story.style.setProperty('--story-secondary-x',`${movement.sx*entering*motionFactor}px`);
      story.style.setProperty('--story-secondary-y',`${movement.sy*entering*motionFactor}px`);
      story.style.setProperty('--story-rotate',`${movement.rotate*entering*motionFactor}deg`);
      story.style.setProperty('--story-secondary-rotate',`${movement.rotate*entering*motionFactor*-1}deg`);
      story.style.setProperty('--story-title-shift',`${32*tension*motionFactor}px`);
      story.style.setProperty('--story-mask',`${Math.max(0,22*entering*motionFactor)}%`);
      story.querySelectorAll('.project-row__title .chaos-letter').forEach((letter,index)=>{
        const flow=index%3===0?-1:index%3===1?.45:1;
        letter.style.setProperty('--story-letter-y',`${32*tension*motionFactor*flow}px`);
      });
    });
  };
  const requestArchive = () => {
    if (archiveFrame) return;
    archiveFrame = requestAnimationFrame(() => { archiveFrame = 0; updateArchive(); });
  };
  addEventListener('scroll', requestArchive, { passive: true });
  addEventListener('resize', requestArchive);
  updateArchive();
}

// La frase central atraviesa orden, tensión y recomposición sin alterar su retícula final.
if(!reducedMotion){
  const statement=$('#manifesto-title');
  const workHeading=$('.section-heading');
  const workLetters=$$('#work-title .chaos-letter');
  let editorialFrame=0;
  const updateEditorialSequence=()=>{
    if(statement){
      const cover=statement.closest('.manifesto--cover');
      const rect=cover.getBoundingClientRect();
      const progress=Math.max(0,Math.min(1,-rect.top/Math.max(rect.height-innerHeight*.2,1)));
      const tension=Math.sin(progress*Math.PI);
      statement.style.setProperty('--vestir-x',`${-22*tension}px`);
      statement.style.setProperty('--tambien-y',`${18*tension}px`);
      statement.style.setProperty('--es-x',`${-10*tension}px`);
      statement.style.setProperty('--contar-x',`${28*tension}px`);
      statement.style.setProperty('--contar-scale',`${1+.16*tension}`);
      statement.classList.toggle('is-statement-tension',progress>.38&&progress<.78);
    }
    if(workHeading){
      const rect=workHeading.getBoundingClientRect();
      const progress=Math.max(0,Math.min(1,(innerHeight-rect.top)/(innerHeight*.72)));
      workHeading.style.setProperty('--work-shift',`${(1-progress)*46}px`);
      workHeading.style.setProperty('--work-progress',progress.toFixed(3));
      workHeading.style.setProperty('--work-opacity',`${.38+progress*.62}`);
      workLetters.forEach((letter,index)=>{
        const flow=index%3===0?-1:index%3===1?.45:1;
        letter.style.setProperty('--work-letter-y',`${(1-progress)*46*flow}px`);
      });
    }
  };
  const requestEditorialSequence=()=>{
    if(editorialFrame)return;
    editorialFrame=requestAnimationFrame(()=>{editorialFrame=0;updateEditorialSequence()});
  };
  addEventListener('scroll',requestEditorialSequence,{passive:true});
  addEventListener('resize',requestEditorialSequence);
  updateEditorialSequence();
}

// La portada comparte el ritmo revelar → fragmentar → recomponer del archivo.
if (!reducedMotion) {
  const cover = $('.manifesto--cover');
  if (cover) {
    let coverFrame = 0;
    const updateCover = () => {
      const rect = cover.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / Math.max(rect.height, 1)));
      cover.style.setProperty('--cover-scroll', progress.toFixed(3));
    };
    const requestCover = () => {
      if (coverFrame) return;
      coverFrame = requestAnimationFrame(() => { coverFrame = 0; updateCover(); });
    };
    addEventListener('scroll', requestCover, { passive: true });
    addEventListener('resize', requestCover);
    updateCover();
  }
}

// Movimiento editorial: capas lentas y contenidas, inspirado en el ritmo del referente.
if (!reducedMotion) {
  const hero = $('.hero');
  if (hero) {
  const updateMotion = () => {
    const heroRect = hero.getBoundingClientRect();
    const progress = Math.max(-1, Math.min(1, -heroRect.top / Math.max(innerHeight, 1)));
    hero.style.setProperty('--scroll-name', `${progress * -24}px`);
    hero.style.setProperty('--scroll-copy', `${progress * -18}px`);
  };
  let motionFrame = 0;
  const requestMotion = () => {
    if (motionFrame) return;
    motionFrame = requestAnimationFrame(() => {
      updateMotion();
      motionFrame = 0;
    });
  };
  addEventListener('scroll', requestMotion, { passive: true });
  if (matchMedia('(pointer:fine)').matches) {
    hero.addEventListener('pointermove', event => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      hero.style.setProperty('--pointer-x', `${x * 18}px`);
      hero.style.setProperty('--pointer-y', `${y * 14}px`);
      hero.style.setProperty('--copy-x', `${x * -8}px`);
      hero.style.setProperty('--copy-y', `${y * -5}px`);
    });
    hero.addEventListener('pointerleave', () => {
      hero.style.setProperty('--pointer-x', '0px');
      hero.style.setProperty('--pointer-y', '0px');
      hero.style.setProperty('--copy-x', '0px');
      hero.style.setProperty('--copy-y', '0px');
    });
  }
  updateMotion();
  }
}
