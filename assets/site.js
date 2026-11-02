(() => {
  'use strict';
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton = document.querySelector('.motion-toggle');
  const motionLabel = document.querySelector('.motion-label');
  let motionPaused = reduceMotion.matches;

  try {
    const preference = localStorage.getItem('nigenial-motion');
    if (preference === 'paused') motionPaused = true;
  } catch (_) { /* Motion controls also work without browser storage. */ }

  function syncMotion() {
    root.classList.toggle('motion-paused', motionPaused);
    motionButton.setAttribute('aria-pressed', String(motionPaused));
    motionLabel.textContent = motionPaused ? 'Resume motion' : 'Pause motion';
  }
  syncMotion();
  motionButton.addEventListener('click', () => {
    motionPaused = !motionPaused;
    syncMotion();
    try { localStorage.setItem('nigenial-motion', motionPaused ? 'paused' : 'playing'); } catch (_) {}
  });
  reduceMotion.addEventListener('change', event => {
    if (event.matches) { motionPaused = true; syncMotion(); }
  });

  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
    root.classList.add('js-motion');
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  function closeMenu(restoreFocus = false) {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    mobileNav.hidden = true;
    document.body.classList.remove('menu-open');
    if (restoreFocus) menuToggle.focus();
  }
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) return closeMenu();
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close navigation');
    mobileNav.hidden = false;
    document.body.classList.add('menu-open');
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !mobileNav.hidden) closeMenu(true);
    if (event.key === 'Tab' && !mobileNav.hidden) {
      const first = menuToggle;
      const last = mobileNav.querySelector('a:last-child');
      const current = document.activeElement;
      if (event.shiftKey && current === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && current === last) { event.preventDefault(); first.focus(); }
    }
  });
  window.matchMedia('(min-width: 651px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });

  const copyButton = document.querySelector('.copy-email');
  const copyStatus = document.querySelector('#copy-status');
  let copyReset;
  copyButton.addEventListener('click', async () => {
    clearTimeout(copyReset);
    try {
      await navigator.clipboard.writeText('nigenial.it@gmail.com');
      copyButton.querySelector('span').textContent = 'Email copied!';
      copyStatus.textContent = 'Email address copied to clipboard.';
      copyReset = setTimeout(() => { copyButton.querySelector('span').textContent = 'Copy email address'; copyStatus.textContent = ''; }, 3000);
    } catch (_) {
      copyButton.querySelector('span').textContent = 'Select the email address to copy';
      copyStatus.textContent = 'Please select and copy nigenial.it@gmail.com manually.';
    }
  });

  document.querySelector('#year').textContent = String(new Date().getFullYear());
})();
