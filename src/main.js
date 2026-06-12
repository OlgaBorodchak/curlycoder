import '../src/main.css'

let resizeTimer;
window.addEventListener('resize', () => {
  document.body.classList.add('no-transition');
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => document.body.classList.remove('no-transition'), 100);
});

const toggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');

toggle?.addEventListener('click', () => {
  const isOpen = navList.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', isOpen);
});