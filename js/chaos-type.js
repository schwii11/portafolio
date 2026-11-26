(function(){
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ease='cubic-bezier(0.16,1,0.3,1)';
  const play=(element,keyframes,options={})=>element?.animate(keyframes,{duration:740,easing:ease,fill:'none',...options});

  function wrap(element){
    if(!element||element.dataset.chaosReady)return;
    const label=element.textContent.trim();
    if(!label)return;
    let index=0;
    element.dataset.chaosReady='true';
    element.setAttribute('aria-label',label);
    element.innerHTML=label.split(/\s+/).map(word=>`<span class="chaos-word" aria-hidden="true">${[...word].map(character=>{
      const direction=index%4;
      const x=[-24,18,-12,26][direction];
      const y=[-34,42,26,-28][direction];
      const rotate=[-8,6,-4,7][direction];
      return `<span class="chaos-letter" style="--chaos-x:${x}px;--chaos-y:${y}px;--chaos-r:${rotate}deg;--chaos-s:1;--chaos-delay:${index++*7}ms">${character}</span>`;
    }).join('')}</span>`).join('<span class="chaos-space" aria-hidden="true">&nbsp;</span>');
    element.addEventListener('pointerenter',()=>element.classList.add('is-chaotic'));
    element.addEventListener('pointerleave',()=>element.classList.remove('is-chaotic'));
  }

  function assemble(section){
    if(section.dataset.assembled)return;
    section.dataset.assembled='true';
    const title=section.querySelector('h1,h2');
    [...(title?.querySelectorAll('.chaos-letter')||[])].forEach((letter,index)=>play(letter,[{opacity:0,transform:`translate3d(${index%2?30:-26}px,${index%3?54:-46}px,0)`},{opacity:1,transform:'translate3d(0,0,0)'}],{delay:index*26,duration:720}));
    [...section.children].filter(item=>item!==title).forEach((item,index)=>play(item,[{opacity:0,transform:`translate3d(${index%2?24:-20}px,24px,0)`},{opacity:1,transform:'translate3d(0,0,0)'}],{delay:110+index*78,duration:570}));
  }

  addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('#focus-title,#method-title,#closing-title').forEach(wrap);
    const sections=[...document.querySelectorAll('.about-opening,.about-focus,.about-method,.about-closing')];
    if(reduced)return;
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){assemble(entry.target);observer.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px -15% 0px'});
    sections.forEach(section=>observer.observe(section));
  });
})();
