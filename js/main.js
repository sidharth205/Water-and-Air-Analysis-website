/* ============================================
   CENTRE OF WATER AND AIR ANALYSIS — main.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ════════════════════════════════
     PAGE TRANSITION LOADER
  ════════════════════════════════ */
  const loader    = document.getElementById('page-loader');
  const loaderBar = document.querySelector('.loader-bar-fill');

  function showLoader(cb) {
    if (!loader) { cb && cb(); return; }
    loader.classList.add('active');
    let w = 0;
    const iv = setInterval(() => {
      w = Math.min(w + Math.random() * 18, 90);
      if (loaderBar) loaderBar.style.width = w + '%';
    }, 60);
    setTimeout(() => {
      clearInterval(iv);
      if (loaderBar) loaderBar.style.width = '100%';
      setTimeout(() => { cb && cb(); }, 260);
    }, 500);
  }

  function hideLoader() {
    if (!loader) return;
    setTimeout(() => {
      loader.classList.remove('active');
      if (loaderBar) loaderBar.style.width = '0';
    }, 180);
  }

  // Intercept internal page navigations only
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || a.target === '_blank') return;
    if (href.endsWith('.html') || (!href.includes('.') && !href.startsWith('http'))) {
      a.addEventListener('click', e => {
        e.preventDefault();
        const dest = href;
        showLoader(() => { window.location.href = dest; });
      });
    }
  });

  // Entry animation on page load
  if (loader) {
    loader.classList.add('active');
    if (loaderBar) loaderBar.style.width = '100%';
    window.addEventListener('load', hideLoader);
    // Fallback
    setTimeout(hideLoader, 1200);
  }

  /* ════════════════════════════════
     NAVBAR
  ════════════════════════════════ */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 16) navbar?.classList.add('scrolled');
    else navbar?.classList.remove('scrolled');
  }, { passive: true });

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks?.classList.toggle('open');
  });
  navLinks?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      navLinks?.classList.remove('open');
    });
  });

  /* Active nav link on scroll (index.html only) */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  if (sections.length && navAnchors.length) {
    const secObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
          });
        }
      });
    }, { threshold: 0.35 });
    sections.forEach(s => secObs.observe(s));
  }

  /* Mark active page link (for separate pages) */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a[href]').forEach(a => {
    if (a.getAttribute('href') === currentPage) a.classList.add('active');
  });

  /* ════════════════════════════════
     HERO SLIDER
  ════════════════════════════════ */
  const slides   = document.querySelectorAll('.slide');
  const dots     = document.querySelectorAll('.dot');
  let current    = 0;
  let slideTimer = null;

  function goTo(n) {
    slides[current]?.classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current]?.classList.add('active');
    dots[current]?.classList.add('active');
  }
  function startAuto() {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => goTo(current + 1), 5500);
  }
  if (slides.length) {
    goTo(0);
    startAuto();
    document.querySelector('.btn-prev')?.addEventListener('click', () => { goTo(current - 1); startAuto(); });
    document.querySelector('.btn-next')?.addEventListener('click', () => { goTo(current + 1); startAuto(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); startAuto(); }));
  }

  /* ════════════════════════════════
     TABS
  ════════════════════════════════ */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab)?.classList.add('active');
    });
  });

  /* ════════════════════════════════
     FADE-IN ON SCROLL
  ════════════════════════════════ */
  const fadeObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); fadeObs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
  document.querySelectorAll('.fade-in').forEach(el => fadeObs.observe(el));

  /* ════════════════════════════════
     COUNTER ANIMATION
  ════════════════════════════════ */
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseFloat(el.dataset.target || 0);
      const suffix = el.dataset.suffix || '';
      const dur    = 1600;
      const step   = target / (dur / 16);
      let cur      = 0;
      const timer  = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(timer); }
        el.textContent = (Number.isInteger(target) ? Math.floor(cur) : cur.toFixed(1)) + suffix;
      }, 16);
      countObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num[data-target]').forEach(c => countObs.observe(c));

  /* ════════════════════════════════
     BACK TO TOP
  ════════════════════════════════ */
  const backTop = document.getElementById('back-top');
  window.addEventListener('scroll', () => {
    backTop?.classList.toggle('visible', window.scrollY > 380);
  }, { passive: true });
  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ════════════════════════════════
     FOOTER YEAR
  ════════════════════════════════ */
  const yrEl = document.getElementById('footer-year');
  if (yrEl) yrEl.textContent = new Date().getFullYear();

});