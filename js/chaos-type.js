(function(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  function wrap(element){
    if(!element||element.dataset.chaosReady)return;
    const label=element.textContent.trim();
    if(!label)return;
    let index=0;
    element.dataset.chaosReady='true';
    element.setAttribute('aria-label',label);
    element.innerHTML=label.split(/\s+/).map(word=>`<span class="chaos-word" aria-hidden="true">${[...word].map(character=>{
      const x=Math.round((Math.random()-.5)*34);
      const y=Math.round((Math.random()-.5)*24);
      const rotate=Math.round((Math.random()-.5)*34);
      const scale=(.86+Math.random()*.34).toFixed(2);
      return `<span class="chaos-letter" style="--chaos-x:${x}px;--chaos-y:${y}px;--chaos-r:${rotate}deg;--chaos-s:${scale};--chaos-delay:${index++*7}ms">${character}</span>`;
    }).join('')}</span>`).join('<span class="chaos-space" aria-hidden="true">&nbsp;</span>');
    element.addEventListener('pointerenter',()=>element.classList.add('is-chaotic'));
    element.addEventListener('pointerleave',()=>element.classList.remove('is-chaotic'));
  }
  addEventListener('DOMContentLoaded',()=>document.querySelectorAll('#focus-title,#method-title,#closing-title').forEach(wrap));
  addEventListener('DOMContentLoaded',()=>{
    const elements=[...document.querySelectorAll('.about-opening>*,.about-focus>*,.about-method>*,.about-closing>*')];
    elements.forEach((element,index)=>{element.classList.add('scroll-enter');element.style.setProperty('--enter-delay',`${index%3*80}ms`)});
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){elements.forEach(element=>element.classList.add('is-visible'));return}
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -8% 0px'});
    elements.forEach(element=>observer.observe(element));
  });
  addEventListener('DOMContentLoaded',()=>{
    const sections=[...document.querySelectorAll('.about-focus,.about-method,.about-closing')];
    let frame=0;
    const update=()=>sections.forEach(section=>{
      const rect=section.getBoundingClientRect();
      const progress=Math.max(0,Math.min(1,(innerHeight-rect.top)/(innerHeight+rect.height*.35)));
      const tension=Math.sin(progress*Math.PI);
      const factor=innerWidth<=800?.42:1;
      section.style.setProperty('--about-letter-shift',`${18*tension*factor}px`);
      section.style.setProperty('--about-copy-y',`${(1-progress)*44*factor}px`);
      section.style.setProperty('--about-group-gap',`${(1-progress)*28*factor}px`);
      section.style.setProperty('--about-group-gap-neg',`${(1-progress)*-28*factor}px`);
      section.querySelectorAll('h2 .chaos-letter').forEach((letter,index)=>{
        const flow=index%3===0?-1:index%3===1?.45:1;
        letter.style.setProperty('--about-letter-y',`${18*tension*factor*flow}px`);
      });
    });
    const request=()=>{if(frame)return;frame=requestAnimationFrame(()=>{frame=0;update()})};
    addEventListener('scroll',request,{passive:true});
    addEventListener('resize',request);
    update();
  });
})();
