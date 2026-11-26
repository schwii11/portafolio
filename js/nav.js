if('scrollRestoration' in history)history.scrollRestoration='manual';
addEventListener('pageshow',()=>scrollTo(0,0));
const menuButton=document.querySelector('.menu-toggle');
const menu=document.querySelector('.site-menu');
if(menuButton&&menu){
  menuButton.addEventListener('click',()=>{
    const open=document.body.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded',String(open));
  });
  menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
    document.body.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded','false');
  }));
}
