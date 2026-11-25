const projectKey=document.body.dataset.project;
const project=window.PROJECT_CONTENT[projectKey];
const q=(selector,root=document)=>root.querySelector(selector);
let lang='es';

const nextRoutes={kero:['lacrima','LACRIMA'],lacrima:['lithos','LITHOS'],lithos:['aeris','AERIS'],aeris:['dos-realidades','PARTITURA CORPORAL'],'dos-realidades':['escuchar-la-imagen','INFANCIAS INTERRUMPIDAS'],'escuchar-la-imagen':['tocar-la-imagen','DESBORDE'],'tocar-la-imagen':['kero','K’ERO']};

function renderHeroMedia(){
  const hero=q('.project-hero');
  const isDigital=['dos-realidades','escuchar-la-imagen','tocar-la-imagen'].includes(projectKey);
  hero.classList.toggle('project-hero--digital',isDigital);
  q('.project-hero-media',hero)?.remove();
  if(project.images.length){
    const [main,secondary]=project.images;
    hero.insertAdjacentHTML('beforeend',`<div class="project-hero-media" aria-hidden="true"><figure class="project-hero-media__main"><img src="${main[0]}" alt=""></figure>${secondary?`<figure class="project-hero-media__secondary"><img src="${secondary[0]}" alt=""></figure>`:''}</div>`);
  }else{
    hero.insertAdjacentHTML('beforeend',`<div class="project-hero-media project-hero-media--digital" aria-hidden="true"><p>${project.title}</p><span>${project.discipline}</span></div>`);
  }
}

function renderGallery(content){
  const gallery=q('#gallery');
  const video=project.video?`<article class="project-video"><header><p class="project-kicker">${lang==='es'?'REGISTRO DE LA EXPERIENCIA':'EXPERIENCE RECORD'}</p><p>${content.lead}</p></header><video controls playsinline preload="metadata" poster="${project.poster||''}"><source src="${project.video}" type="video/mp4">${lang==='es'?'Tu navegador no puede reproducir este video.':'Your browser cannot play this video.'}</video></article>`:'';
  if(project.images.length){
    const captions=[['ORIGEN',content.concept[0]],['MATERIALIDAD',content.research.join(' · ')],['DESARROLLO',content.process],['RESULTADO',content.result]];
    gallery.innerHTML=video+project.images.map(([src,alt],index)=>{
      const [label,text]=captions[Math.min(index,captions.length-1)];
      return `<figure class="project-image project-image--${index+1}"><div class="project-image__visual"><img src="${src}" alt="${alt}" loading="${index?'lazy':'eager'}"></div><figcaption><span>${label}</span><p>${text}</p></figcaption></figure>`;
    }).join('');
    return;
  }
  gallery.innerHTML=video+`<article class="project-live"><div><p class="project-kicker">EXPERIENCIA DIGITAL / EN VIVO</p><p>${content.lead}</p><a href="${project.demo}" target="_blank" rel="noreferrer">ABRIR EXPERIENCIA ↗</a></div><iframe src="${project.demo}" title="Vista de ${project.title}" loading="lazy"></iframe></article>`;
}

function render(){
  const content=project[lang];
  document.documentElement.lang=lang;
  document.title=`${project.title} — Katalina Ríos`;
  q('#project-number').textContent=`${project.number} / 07`;
  q('#project-title').textContent=project.title;
  q('#project-discipline').textContent=project.discipline;
  q('#project-year').textContent=project.year;
  q('#project-year-mobile').textContent=project.year;
  q('#project-mode').textContent=lang==='en'?project.mode.replace('PROYECTO COLABORATIVO','COLLABORATIVE PROJECT').replace('PROYECTO INDIVIDUAL','INDIVIDUAL PROJECT').replace('PROYECTO ACADÉMICO','ACADEMIC PROJECT'):project.mode;
  q('#project-lead').textContent=content.lead;
  q('#concept-copy').innerHTML=content.concept.map(text=>`<p>${text}</p>`).join('');
  q('#research-list').innerHTML=content.research.map(item=>`<li>${item}</li>`).join('');
  q('#process-copy').textContent=content.process;
  q('#result-copy').textContent=content.result;
  q('#contribution').innerHTML=content.contribution?`<p class="project-kicker">${lang==='es'?'MI PARTICIPACIÓN':'MY CONTRIBUTION'}</p><p>${content.contribution}</p>`:'';
  q('#credits-copy').textContent=content.credits;
  q('#label-concept').textContent=lang==='es'?'ORIGEN / IDEA':'ORIGIN / IDEA';
  q('#label-research').textContent=lang==='es'?'MATERIA / INTERACCIÓN':'MATERIAL / INTERACTION';
  q('#label-process').textContent=lang==='es'?'DESARROLLO':'DEVELOPMENT';
  q('#label-result').textContent=lang==='es'?'RESOLUCIÓN':'OUTCOME';
  q('#label-credits').textContent=lang==='es'?'AUTORÍA / PARTICIPACIÓN':'AUTHORSHIP / PARTICIPATION';
  const links=[];
  if(project.repo)links.push(`<a href="${project.repo}" target="_blank" rel="noreferrer">${lang==='es'?'REPOSITORIO':'REPOSITORY'} ↗</a>`);
  if(project.demo)links.push(`<a href="${project.demo}" target="_blank" rel="noreferrer">${lang==='es'?'EXPERIENCIA ONLINE':'LIVE EXPERIENCE'} ↗</a>`);
  q('#project-links').innerHTML=links.join('');
  renderGallery(content);
  renderHeroMedia();
  q('.project-lang').innerHTML=lang==='es'?'<b>ES</b> / EN':'ES / <b>EN</b>';
  const [nextSlug,nextTitle]=nextRoutes[projectKey];
  q('.project-next').href=`../${nextSlug}/`;
  q('.project-next span').textContent=`${lang==='es'?'SIGUIENTE PROYECTO':'NEXT PROJECT'} / ${nextTitle}`;
  prepareTitleInteraction();
}

function prepareTitleInteraction(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  document.querySelectorAll('#project-title,.project-narrative h2,.project-next span').forEach(element=>{
    if(element.querySelector('.chaos-letter'))return;
    element.dataset.chaosReady='true';
    const label=element.textContent.trim();
    element.setAttribute('aria-label',label);
    element.innerHTML=label.split(/\s+/).map(word=>`<span class="chaos-word" aria-hidden="true">${[...word].map(character=>`<span class="chaos-letter" style="--chaos-x:${Math.round((Math.random()-.5)*24)}px;--chaos-y:${Math.round((Math.random()-.5)*16)}px;--chaos-r:${Math.round((Math.random()-.5)*22)}deg;--chaos-s:${(.9+Math.random()*.2).toFixed(2)}">${character}</span>`).join('')}</span>`).join('<span class="chaos-space" aria-hidden="true"> </span>');
    element.addEventListener('pointerenter',()=>element.classList.add('is-chaotic'));
    element.addEventListener('pointerleave',()=>element.classList.remove('is-chaotic'));
  });
}

q('.project-lang').addEventListener('click',()=>{lang=lang==='es'?'en':'es';render()});
render();
