const archive = document.querySelector('.archive-stage');
archive?.addEventListener('pointerenter', () => archive.classList.add('is-active'));
archive?.addEventListener('pointerleave', () => archive.classList.remove('is-active'));

const matter = document.querySelector('.matter-stage');
matter?.addEventListener('pointermove', (event) => {
  const rect = matter.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width - .5) * 36;
  matter.style.setProperty('--thread-x', `${x}px`);
});
matter?.addEventListener('pointerleave', () => matter.style.setProperty('--thread-x', '0px'));
