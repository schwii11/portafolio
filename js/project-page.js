const projectKey=document.body.dataset.project;
const project=window.PROJECT_CONTENT[projectKey];
const q=(selector,root=document)=>root.querySelector(selector);
let lang='es';
const physicalProjects=['kero','lacrima','lithos','aeris'];

const nextRoutes={kero:['lacrima','LACRIMA'],lacrima:['lithos','LITHOS'],lithos:['aeris','AERIS'],aeris:['dos-realidades','PARTITURA CORPORAL'],'dos-realidades':['escuchar-la-imagen','INFANCIAS INTERRUMPIDAS'],'escuchar-la-imagen':['tocar-la-imagen','DESBORDE'],'tocar-la-imagen':['kero','K’ERO']};

function renderHeroMedia(){
  const hero=q('.project-hero');
  hero.dataset.project=project.title;
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
  if(project.repo)links.push(`<a href="${project.repo}" target="_blank" rel="noreferrer">${lang==='es'?'REPOSITORIO':'REPOSITORY'}</a>`);
  if(project.demo)links.push(`<a href="${project.demo}" target="_blank" rel="noreferrer">${lang==='es'?'EXPERIENCIA ONLINE':'LIVE EXPERIENCE'}</a>`);
  if(project.video)links.push(`<a href="#gallery">VIDEO</a>`);
  q('#project-links').innerHTML=links.join('');
  renderGallery(content);
  renderHeroMedia();
  prepareScrollComposition();
  q('.project-lang').innerHTML=lang==='es'?'<b>ES</b> / EN':'ES / <b>EN</b>';
  const [nextSlug,nextTitle]=nextRoutes[projectKey];
  q('.project-next').href=`../${nextSlug}/index.html`;
  q('.project-next span').textContent=`${lang==='es'?'SIGUIENTE PROYECTO':'NEXT PROJECT'} / ${nextTitle}`;
  prepareTitleInteraction();
  prepareMediaInteraction();
}

function prepareMediaInteraction(){
  const media=[...document.querySelectorAll('.project-image,.project-video,.project-live')];
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){media.forEach(item=>item.classList.add('is-in-view'));return}
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('is-in-view');observer.unobserve(entry.target)}
  }),{threshold:.16});
  media.forEach(item=>observer.observe(item));
  if(physicalProjects.includes(projectKey))prepareLightbox();
  if(!matchMedia('(pointer:fine)').matches)return;
  document.querySelectorAll('.project-image__visual').forEach(frame=>{
    frame.addEventListener('pointermove',event=>{
      const rect=frame.getBoundingClientRect();
      const x=(event.clientX-rect.left)/rect.width-.5;
      const y=(event.clientY-rect.top)/rect.height-.5;
      frame.style.setProperty('--focus-x',`${x*10}px`);
      frame.style.setProperty('--focus-y',`${y*8}px`);
    });
    frame.addEventListener('pointerleave',()=>{
      frame.style.setProperty('--focus-x','0px');
      frame.style.setProperty('--focus-y','0px');
    });
  });
}

function prepareScrollComposition(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  if(document.body.dataset.scrollMotionReady)return;
  document.body.dataset.scrollMotionReady='true';
  const vectors={kero:[[-58,54],[46,-28],[-34,42],[26,34]],lacrima:[[0,96],[0,128],[0,74],[0,108]],lithos:[[-52,38],[54,34],[-38,62],[48,46]],aeris:[[-18,78],[24,104],[-14,66],[18,88]]}[projectKey]||[[0,52],[0,72],[0,48],[0,64]];
  const ease='cubic-bezier(0.16,1,0.3,1)';
  const play=(element,keyframes,options={})=>element?.animate(keyframes,{duration:580,easing:ease,fill:'none',...options});
  const hero=q('.project-hero');
  requestAnimationFrame(()=>{
    play(q('h1',hero),[{opacity:0,transform:'translate3d(-36px,52px,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],{duration:620});
    play(q('.project-hero-media',hero),[{opacity:.1,clipPath:'inset(9% 0 8% 0)',transform:'translate3d(58px,28px,0) scale(1.045)'},{opacity:1,clipPath:'inset(0)',transform:'translate3d(0,0,0) scale(1)'}],{delay:45,duration:650});
    [...hero.querySelectorAll('.project-hero__number,.project-links,.project-hero__lead,.project-hero__meta')].forEach((item,index)=>play(item,[{opacity:0,transform:'translate3d(0,20px,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],{delay:100+index*55,duration:430}));
  });
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    const item=entry.target;
    const index=Number(item.dataset.motionIndex||0);
    const factor=innerWidth<=900?.55:1;
    const [x,y]=vectors[index%vectors.length];
    play(item,[{opacity:0,clipPath:'inset(12% 0 8% 0)',transform:`translate3d(${x*factor}px,${y*factor}px,0) scale(1.035)`},{opacity:1,clipPath:'inset(0)',transform:'translate3d(0,0,0) scale(1)'}],{duration:620,delay:(index%2)*65});
    observer.unobserve(item);
  }),{threshold:.08,rootMargin:'0px 0px -15% 0px'});
  document.querySelectorAll('.project-image,.project-video,.project-live,.project-narrative').forEach((item,index)=>{item.dataset.motionIndex=index;observer.observe(item)});
}

function prepareLightbox(){
  let lightbox=q('#project-lightbox');
  if(!lightbox){
    document.body.insertAdjacentHTML('beforeend',`<dialog id="project-lightbox" class="project-lightbox" aria-label="Visor de imagen en alta resolución"><div class="project-lightbox__toolbar"><p id="project-lightbox-caption"></p><div><button type="button" data-lightbox-action="out" aria-label="Alejar">−</button><button type="button" data-lightbox-action="reset" aria-label="Restablecer zoom">100%</button><button type="button" data-lightbox-action="in" aria-label="Acercar">+</button><button type="button" data-lightbox-action="close" aria-label="Cerrar visor">CERRAR ×</button></div></div><div class="project-lightbox__stage"><div class="project-lightbox__canvas"><img alt=""></div></div></dialog>`);
    lightbox=q('#project-lightbox');
  }
  const image=q('img',lightbox);
  const canvas=q('.project-lightbox__canvas',lightbox);
  const stage=q('.project-lightbox__stage',lightbox);
  const caption=q('#project-lightbox-caption',lightbox);
  let zoom=1;
  const setZoom=value=>{
    zoom=Math.min(4,Math.max(1,value));
    canvas.style.width=`${zoom*100}%`;
    canvas.style.height=`${zoom*100}%`;
    q('[data-lightbox-action="reset"]',lightbox).textContent=`${Math.round(zoom*100)}%`;
    if(zoom===1){stage.scrollTop=0;stage.scrollLeft=0}
  };
  document.querySelectorAll('.project-image__visual').forEach(frame=>{
    if(frame.dataset.lightboxReady)return;
    frame.dataset.lightboxReady='true';
    frame.setAttribute('role','button');
    frame.setAttribute('tabindex','0');
    frame.setAttribute('aria-label','Abrir imagen en pantalla completa');
    const open=()=>{
      const source=q('img',frame);
      image.src=source.currentSrc||source.src;
      image.alt=source.alt;
      caption.textContent=source.alt;
      setZoom(1);
      lightbox.showModal();
    };
    frame.addEventListener('click',open);
    frame.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();open()}});
  });
  if(lightbox.dataset.controlsReady)return;
  lightbox.dataset.controlsReady='true';
  lightbox.addEventListener('click',event=>{
    const action=event.target.closest('[data-lightbox-action]')?.dataset.lightboxAction;
    if(action==='close')lightbox.close();
    if(action==='in')setZoom(zoom+.25);
    if(action==='out')setZoom(zoom-.25);
    if(action==='reset')setZoom(1);
    if(event.target===lightbox)lightbox.close();
  });
  stage.addEventListener('wheel',event=>{
    if(!lightbox.open)return;
    event.preventDefault();
    setZoom(zoom+(event.deltaY<0?.2:-.2));
  },{passive:false});
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
