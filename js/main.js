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
// ── FACULTY MODAL DATA ──────────────────────────────────────────
const facultyData = {
  'indrani-ghosh': {
    name: 'Dr. Indrani Ghosh',
    photo: 'https://waterair.auaicoe.in/wp-content/uploads/2026/06/IG.jpeg',
    email: 'Indrani.ghosh@adamasuniversity.ac.in',
    designation: '[Designation / Title]',
    dept: '[Department / Specialisation]',
    bio: `Dr. Indrani Ghosh is an environmental scientist, academician, and Programme Coordinator in the Unit of Environmental Science, actively engaged in interdisciplinary research and curriculum development in Environmental Science and Sustainability. She completed her Ph.D. from Indian Institute of Technology Bombay and has been serving as Assistant Professor since 2017.
Her research expertise includes wastewater treatment, bioremediation, environmental pollution assessment, and sustainable environmental technologies. She has contributed significantly to the development of microalgae-based wastewater treatment modules and environmental exposure assessment studies across both micro and macro environments.
Dr. Ghosh has been actively involved in collaborative and interdisciplinary research projects, including multi-institutional international collaborations with the University of York. She also serves as Principal Investigator for a SEED Research Scheme-funded project on microalgae-based wastewater treatment systems supported by Adamas University.
In addition to her research activities, she plays a leading role in curriculum development and implementation of undergraduate and postgraduate programmes in Environmental Science and Sustainability under the NEP 2020 framework.
`,
    research: ['Wastewater Treatment & Bioremediation', 'Microalgae-based Environmental Technologies', 'Air Pollution Exposure Assessment', 'Environmental Monitoring & Sustainability','Environmental Science Education'],
    education: [
      '[PhD — University, Year]',
      '[M.Sc. — University, Year]',
      '[B.Sc. — University, Year]'
    ]
  },
  'prantik-banerjee': {
    name: 'Dr. Prantik Banerjee',
    photo: 'https://waterair.auaicoe.in/wp-content/uploads/2026/06/PB.jpeg',
    email: '[prantik.email@adamasuniversity.ac.in]',
    designation: '[Designation / Title]',
    dept: '[Department / Specialisation]',
    bio: '[Add biography here.]',
    research: ['[Research Area 1]', '[Research Area 2]'],
    education: ['[PhD — University, Year]', '[M.Sc. — University, Year]']
  },
  'tanmoy-dey': {
    name: 'Dr. Tanmoy Kumar Dey',
    photo: 'https://waterair.auaicoe.in/wp-content/uploads/2026/06/TKD-scaled.jpg',
    email: '[tanmoy.email@adamasuniversity.ac.in]',
    designation: '[Designation / Title]',
    dept: '[Department / Specialisation]',
    bio: '[Add biography here.]',
    research: ['[Research Area 1]', '[Research Area 2]'],
    education: ['[PhD — University, Year]', '[M.Sc. — University, Year]']
  },
  'vijoyeta-chakraborty': {
    name: 'Dr. Vijoyeta Chakraborty',
    photo: 'https://waterair.auaicoe.in/wp-content/uploads/2026/06/VJC.jpg.jpeg',
    email: '[vijoyeta.email@adamasuniversity.ac.in]',
    designation: '[Designation / Title]',
    dept: '[Department / Specialisation]',
    bio: '[Add biography here.]',
    research: ['[Research Area 1]', '[Research Area 2]'],
    education: ['[PhD — University, Year]', '[M.Sc. — University, Year]']
  },
  'moumita-chakraborty': {
    name: 'Dr. Moumita Chakraborty',
    photo: 'https://waterair.auaicoe.in/wp-content/uploads/2026/06/MC.jpeg',
    email: '[moumita.email@adamasuniversity.ac.in]',
    designation: '[Designation / Title]',
    dept: '[Department / Specialisation]',
    bio: '[Add biography here.]',
    research: ['[Research Area 1]', '[Research Area 2]'],
    education: ['[PhD — University, Year]', '[M.Sc. — University, Year]']
  },
  'ritam-bhattacharya': {
    name: 'Dr. Ritam Bhattacharya',
    photo: 'https://waterair.auaicoe.in/wp-content/uploads/2026/06/RB.jpg.jpeg',
    email: '[ritam.email@adamasuniversity.ac.in]',
    designation: '[Designation / Title]',
    dept: '[Department / Specialisation]',
    bio: '[Add biography here.]',
    research: ['[Research Area 1]', '[Research Area 2]'],
    education: ['[PhD — University, Year]', '[M.Sc. — University, Year]']
  },
  'aditi-ghosh-hazra': {
    name: 'Ms. Aditi Ghosh Hazra',
    photo: 'https://waterair.auaicoe.in/wp-content/uploads/2026/06/AGH1.jpeg',
    email: '[aditi.email@adamasuniversity.ac.in]',
    designation: '[Designation / Title]',
    dept: '[Department / Specialisation]',
    bio: '[Add biography here.]',
    research: ['[Research Area 1]', '[Research Area 2]'],
    education: ['[M.Sc. — University, Year]', '[B.Sc. — University, Year]']
  },
  'rupa-chaudhuri': {
    name: 'Ms. Rupa Chaudhuri',
    photo: 'https://waterair.auaicoe.in/wp-content/uploads/2026/06/RC.jpg.jpeg',
    email: '[rupa.email@adamasuniversity.ac.in]',
    designation: '[Designation / Title]',
    dept: '[Department / Specialisation]',
    bio: '[Add biography here.]',
    research: ['[Research Area 1]', '[Research Area 2]'],
    education: ['[M.Sc. — University, Year]', '[B.Sc. — University, Year]']
  }
};

function openFacultyModal(id) {
  const data = facultyData[id];
  if (!data) return;

  document.getElementById('fm-photo').src = data.photo;
  document.getElementById('fm-photo').alt = data.name;
  document.getElementById('fm-name').textContent = data.name;
  document.getElementById('fm-designation').textContent = data.designation;
  document.getElementById('fm-dept').textContent = data.dept;
  document.getElementById('fm-bio').textContent = data.bio;

  const emailBtn = document.getElementById('fm-email-btn');
  emailBtn.href = 'mailto:' + data.email;
  document.getElementById('fm-email-text').textContent = data.email;

  // Research tags
  const tagsEl = document.getElementById('fm-research-tags');
  tagsEl.innerHTML = data.research.map(r => `<span class="fm-tag">${r}</span>`).join('');

  // Education
  const eduEl = document.getElementById('fm-edu-list');
  eduEl.innerHTML = data.education.map(e => `<li>${e}</li>`).join('');

  document.getElementById('faculty-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeFacultyModal(event) {
  if (event.target === document.getElementById('faculty-modal')) {
    closeFacultyModalDirect();
  }
}

function closeFacultyModalDirect() {
  document.getElementById('faculty-modal').classList.remove('open');
  document.body.style.overflow = '';
}

// Close on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeFacultyModalDirect();
});