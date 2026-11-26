if('scrollRestoration' in history)history.scrollRestoration='manual';
addEventListener('pageshow',()=>scrollTo(0,0));
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const translations = {
  es: {
    navIndex: 'INDEX', navWork: 'WORK', navAbout: 'ABOUT', navContact: 'CONTACT',
    heroDiscipline: 'DISEÑO / SISTEMA MODA',
    heroStatement: 'Entre el cuerpo, la materia y la interacción.',
    heroDescriptor: 'FASHION / MATERIAL / DIGITAL EXPERIMENTATION',
    explore: 'EXPLORAR PROYECTOS', workTitle: 'WORK.',
    workIntro: 'Ocho proyectos entre moda, materialidad y experiencias digitales, explicados directamente en el recorrido principal.',
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
    workIntro: 'Eight projects spanning fashion, materiality and digital experiences, explained directly in the main journey.',
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
          <p class="project-story__index mono">${project.number} / 08</p>
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
  observeReveals();
  prepareEditorialAssemblies(list);
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
  $$('.reveal:not(.is-visible):not(.project-story)').forEach(item => observer.observe(item));
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
      : `<span class="intro-letter" aria-hidden="true">${character}</span>`).join('');
  });
}
prepareLandingLetters();

const assemblyEase='cubic-bezier(0.16,1,0.3,1)';
const playAssembly=(element,keyframes,options={})=>element?.animate(keyframes,{duration:760,easing:assemblyEase,fill:'none',...options});

function prepareLandingAssembly(){
  if(reducedMotion)return document.querySelector('.manifesto--cover')?.classList.add('intro-ready');
  const run=()=>{
    $$('.manifesto__name .intro-letter').forEach((letter,index)=>{
      const directions=[[-38,-70],[30,64],[-52,24],[42,-46]];
      const [x,y]=directions[index%directions.length];
      playAssembly(letter,[{opacity:0,transform:`translate3d(${x}px,${y}px,0)`},{opacity:1,transform:'translate3d(0,0,0)'}],{delay:index*26,duration:740});
    });
    $$('.statement-word').forEach((word,index)=>{
      const starts=[['0','-76px','0deg','1'],['72px','0','0deg','1'],['-42px','24px','0deg','1'],['0','82px','-4deg','1.1']][index]||['0','40px','0deg','1'];
      playAssembly(word,[{opacity:0,transform:`translate3d(${starts[0]},${starts[1]},0) rotate(${starts[2]}) scale(${starts[3]})`},{opacity:1,transform:'translate3d(0,0,0) rotate(0) scale(1)'}],{delay:200+index*54,duration:850});
    });
    $$('.manifesto__folio,.manifesto__disciplines,.manifesto__copy').forEach((item,index)=>playAssembly(item,[{opacity:0,transform:'translate3d(0,22px,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],{delay:310+index*82,duration:560}));
    document.querySelector('.manifesto--cover')?.classList.add('intro-ready');
  };
  (document.fonts?.ready||Promise.resolve()).then(()=>requestAnimationFrame(run));
}

function assembleStory(story){
  if(story.dataset.assembled)return;
  story.dataset.assembled='true';
  story.classList.add('is-visible');
  const id=story.dataset.project;
  const vectors={kero:[-86,66,74,-52,-2.4],lacrima:[0,102,0,132,0],lithos:[-70,44,74,58,1.2],aeris:[-32,68,38,86,-.7]}[id]||[0,68,0,56,0];
  $$('.project-row__title .chaos-letter',story).forEach((letter,index)=>playAssembly(letter,[{opacity:0,transform:`translate3d(${(index%3-1)*15}px,${index%2?42:-36}px,0)`},{opacity:1,transform:'translate3d(0,0,0)'}],{delay:index*22,duration:620}));
  playAssembly($('.project-story__primary',story),[{opacity:.08,clipPath:'inset(18% 0 12% 0)',transform:`translate3d(${vectors[0]}px,${vectors[1]}px,0) rotate(${vectors[4]}deg) scale(1.055)`},{opacity:1,clipPath:'inset(0)',transform:'translate3d(0,0,0) rotate(0) scale(1)'}],{delay:55,duration:880});
  playAssembly($('.project-story__secondary',story),[{opacity:0,transform:`translate3d(${vectors[2]}px,${vectors[3]}px,0) scale(1.045)`},{opacity:1,transform:'translate3d(0,0,0) scale(1)'}],{delay:130,duration:820});
  $$('.project-story__index,.project-row__title>p,.project-story__summary,.project-story__narrative,.project-story__deep-link',story).forEach((item,index)=>playAssembly(item,[{opacity:0,transform:'translate3d(0,20px,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],{delay:180+index*54,duration:540}));
}

function prepareEditorialAssemblies(root=document){
  const stories=$$('.project-story:not([data-assembly-ready])',root);
  if(reducedMotion){stories.forEach(story=>{story.dataset.assemblyReady='true';story.classList.add('is-visible')});return}
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){assembleStory(entry.target);observer.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px -15% 0px'});
  stories.forEach(story=>{story.dataset.assemblyReady='true';observer.observe(story)});
}

prepareLandingAssembly();

if(!reducedMotion){
  const headings=$$('#work-title,.about-preview h2,.contact h2');
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const title=entry.target;$$('.chaos-letter',title).forEach((letter,index)=>playAssembly(letter,[{opacity:0,transform:`translate3d(${index%2?20:-18}px,${index%3?42:-34}px,0)`},{opacity:1,transform:'translate3d(0,0,0)'}],{delay:index*26,duration:640}));observer.unobserve(title)}),{threshold:.1,rootMargin:'0px 0px -15% 0px'});
  headings.forEach(title=>observer.observe(title));
}
