/* ============================================
   CENTRE OF WATER AND AIR ANALYSIS — main.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll shadow ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });

  /* ── Mobile hamburger ── */
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ── Active nav link based on scroll ── */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
        });
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(s => observer.observe(s));

  /* ── Hero Slider ── */
  const slides   = document.querySelectorAll('.slide');
  const dots     = document.querySelectorAll('.dot');
  let current    = 0;
  let slideTimer = null;

  function goTo(n) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function startAuto() {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => goTo(current + 1), 5500);
  }

  if (slides.length) {
    slides[0].classList.add('active');
    dots[0]?.classList.add('active');
    startAuto();

    document.querySelector('.btn-prev')?.addEventListener('click', () => { goTo(current - 1); startAuto(); });
    document.querySelector('.btn-next')?.addEventListener('click', () => { goTo(current + 1); startAuto(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); startAuto(); }));
  }

  /* ── Activities / Services Tabs ── */
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab)?.classList.add('active');
    });
  });

  /* ── Fade-in on scroll ── */
  const fadeEls = document.querySelectorAll('.fade-in');
  const fadeObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        fadeObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  fadeEls.forEach(el => fadeObs.observe(el));

  /* ── Counter animation (stats) ── */
  const counters = document.querySelectorAll('.stat-num[data-target]');
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el     = e.target;
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const step   = target / (duration / 16);
        let current  = 0;
        const timer  = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = (Number.isInteger(target) ? Math.floor(current) : current.toFixed(1)) + suffix;
        }, 16);
        countObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => countObs.observe(c));

  /* ── Back to top ── */
  const backTop = document.getElementById('back-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) backTop.classList.add('visible');
    else backTop.classList.remove('visible');
  });
  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── Current year in footer ── */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});