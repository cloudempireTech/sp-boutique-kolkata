(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      nav.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
    });
    nav.addEventListener('click', event => {
      if (event.target.closest('a')) {
        nav.classList.remove('open'); menu.setAttribute('aria-expanded','false');
        menu.setAttribute('aria-label','Open menu'); document.body.classList.remove('menu-open');
      }
    });
    addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open'); menu.setAttribute('aria-expanded','false');
        menu.setAttribute('aria-label','Open menu'); document.body.classList.remove('menu-open'); menu.focus();
      }
    });
  }
  requestAnimationFrame(() => root.classList.add('ready'));
  const reveals = [...document.querySelectorAll('[data-reveal]')];
  if (!reduce.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -24px 0px' });
    reveals.forEach(el => observer.observe(el));
  } else reveals.forEach(el => el.classList.add('revealed'));
  const depthEls = [...document.querySelectorAll('[data-depth]')];
  if (!reduce.matches && depthEls.length) {
    let ticking = false;
    addEventListener('scroll', () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        depthEls.forEach(el => { const r = el.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) el.style.setProperty('--scroll-depth', `${Math.max(-20, Math.min(20,(r.top-innerHeight/2)*-.035))}px`); });
        ticking = false;
      });
    }, { passive: true });
  }
  document.querySelectorAll('a[href$=".html"], a[href="index.html"]').forEach(a => {
    a.addEventListener('click', event => {
      if (reduce.matches || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || a.target === '_blank') return;
      const url = new URL(a.href); if (url.origin !== location.origin || (url.pathname === location.pathname && !url.hash)) return;
      event.preventDefault(); root.classList.add('leaving'); setTimeout(() => location.href = a.href, 180);
    });
  });
  document.querySelectorAll('.collection-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      if (reduce.matches || event.pointerType === 'touch') return;
      const r = card.getBoundingClientRect(); const x = (event.clientX-r.left)/r.width-.5; const y = (event.clientY-r.top)/r.height-.5;
      card.style.setProperty('--rx',`${-y*4}deg`); card.style.setProperty('--ry',`${x*5}deg`);
    });
    card.addEventListener('pointerleave', () => { card.style.setProperty('--rx','0deg'); card.style.setProperty('--ry','0deg'); });
  });
})();
