(() => {
  'use strict';
  const root = document.documentElement;
  const intro = document.querySelector('.intro');
  if (!intro || !root.classList.contains('intro-on')) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mustache = intro.querySelector('.intro-mustache');
  const started = performance.now();
  // The logo stays long enough to finish drawing; playing with the mustache earns a little more time, never past the CSS failsafe.
  const firstExit = reducedMotion ? 1600 : 3600;
  const lastExit = 8500;
  let exitTimer = null;
  let leaving = false;
  let twirlBack = false;

  function scheduleExit(delay) {
    clearTimeout(exitTimer);
    exitTimer = setTimeout(leave, Math.min(delay, lastExit - (performance.now() - started)));
  }
  function leave() {
    if (leaving) return;
    leaving = true;
    clearTimeout(exitTimer);
    intro.classList.add('is-leaving');
    setTimeout(() => {
      intro.remove();
      root.classList.remove('intro-on');
      if (!reducedMotion) root.classList.add('intro-done');
    }, reducedMotion ? 0 : 1300);
  }
  function twirl() {
    if (leaving || reducedMotion) return;
    mustache.classList.remove('is-twirling');
    void mustache.offsetWidth;
    twirlBack = !twirlBack;
    mustache.classList.toggle('twirl-back', twirlBack);
    mustache.classList.add('is-twirling');
    scheduleExit(Math.max(firstExit - (performance.now() - started), 2200));
  }

  mustache.addEventListener('animationend', () => mustache.classList.remove('is-twirling'));
  mustache.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') twirl(); });
  mustache.addEventListener('click', event => { event.stopPropagation(); twirl(); });
  intro.addEventListener('click', leave);
  if (!reducedMotion) {
    intro.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse') return;
      intro.style.setProperty('--px', (event.clientX / window.innerWidth * 2 - 1).toFixed(3));
      intro.style.setProperty('--py', (event.clientY / window.innerHeight * 2 - 1).toFixed(3));
      intro.style.setProperty('--mx', `${event.clientX}px`);
      intro.style.setProperty('--my', `${event.clientY}px`);
    }, {passive:true});
  }
  window.addEventListener('keydown', leave, {once:true});
  window.addEventListener('wheel', leave, {once:true, passive:true});
  window.addEventListener('touchmove', leave, {once:true, passive:true});
  scheduleExit(firstExit);
})();
