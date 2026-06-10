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
    bio: `
<p>Dr. Indrani Ghosh is an environmental scientist, academician, and Programme Coordinator in the Unit of Environmental Science, actively engaged in interdisciplinary research and curriculum development in Environmental Science and Sustainability. She completed her Ph.D. from Indian Institute of Technology Bombay and has been serving as Assistant Professor since 2017.</p>
<br>
<p>Her research expertise includes wastewater treatment, bioremediation, environmental pollution assessment, and sustainable environmental technologies. She has contributed significantly to the development of microalgae-based wastewater treatment modules and environmental exposure assessment studies across both micro and macro environments.</p>
<br>
<p>Dr. Ghosh has been actively involved in collaborative and interdisciplinary research projects, including multi-institutional international collaborations with the University of York. She also serves as Principal Investigator for a SEED Research Scheme-funded project on microalgae-based wastewater treatment systems supported by Adamas University.</p>
<br>
<p>In addition to her research activities, she plays a leading role in curriculum development and implementation of undergraduate and postgraduate programmes in Environmental Science and Sustainability under the NEP 2020 framework.</p>
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
    bio: `
    <p>Dr. Prantik Banerjee is an environmental scientist and sustainability researcher specializing in wastewater treatment, environmental pollution monitoring, and climate risk assessment. He completed his Ph.D. from the University of Calcutta and has been serving as Assistant Professor since 2019.</p>
    <br>
    <p>His research focuses on low-cost wastewater treatment technologies using ZnO nanocrystals, photocatalytic degradation systems, and environmental analytical methods for NABL-accredited laboratories. He has substantial professional experience as Project Scientist at the West Bengal Pollution Control Board under the World Bank-assisted Capacity Building for Industrial Pollution Management Project.</p>
    <br>
    <p>Dr. Banerjee also holds advanced qualifications in ESG and Sustainability from Annamalai University and Climate Risk certification from the Global Association of Risk Professionals. He is actively engaged in climate resilience and sustainability research, including policy-oriented landscape studies in West Bengal.</p>
    <br>
    <p>He currently leads a SEED Research Scheme-funded project on algal biochar/ZnO composite photocatalysts for textile dye degradation and self-degrading polymer films, while also contributing to NEP 2020-based curriculum development in Environmental Science and Sustainability.</p>`,
    research: ['Wastewater Treatment Technologies', 'Nanotechnology-based Photocatalysis', 'ESG & Sustainability', 'Climate Risk & Resilience', 'Environmental Analytical Techniques'],
    education: ['[PhD — University, Year]', '[M.Sc. — University, Year]']
  },
  'tanmoy-dey': {
    name: 'Dr. Tanmoy Kumar Dey',
    photo: 'https://waterair.auaicoe.in/wp-content/uploads/2026/06/TKD-scaled.jpg',
    email: '[tanmoy.email@adamasuniversity.ac.in]',
    designation: '[Designation / Title]',
    dept: '[Department / Specialisation]',
    bio: `
    <p>Dr. Tanmoy Kumar Dey is an environmental microbiologist and biotechnology researcher working at the interface of environmental health, microbiology, nanobiotechnology, and waste valorisation. He completed his Ph.D. from the University of Calcutta and pursued Post-Doctoral research at the ICMR-National Institute of Cholera and Enteric Diseases. He has been serving as Assistant Professor since 2021.</p>
    <br>
    <p>His research interests include nutraceutical formulation using nanobiotechnology, environmental microbiology, microbial biotransformation processes, epidemiology, environmental health, and sustainable waste valorisation. He also works extensively on ecological field investigations integrated with socio-economic community surveys.</p>
    <br>
    <p>Dr. Dey is Principal Investigator of a SEED Research Scheme-funded project on extraction and purification of lutein esters from marigold petals and their influence on gut bacterial growth kinetics. In addition to his research contributions, he is actively involved in curriculum development and implementation of Environmental Science and Sustainability programmes under NEP 2020.</p>`,
    research: ['Environmental Microbiology', 'Nanobiotechnology & Nutraceuticals', 'Waste Valorisation', 'Epidemiology & Environmental Health', 'Community-based Ecological Studies'],
    education: ['[PhD — University, Year]', '[M.Sc. — University, Year]']
  },
  'vijoyeta-chakraborty': {
    name: 'Dr. Vijoyeta Chakraborty',
    photo: 'https://waterair.auaicoe.in/wp-content/uploads/2026/06/VJC.jpg.jpeg',
    email: '[vijoyeta.email@adamasuniversity.ac.in]',
    designation: '[Designation / Title]',
    dept: '[Department / Specialisation]',
    bio: `
    <p>Dr. Vijoyeta Chakraborty is an environmental scientist specializing in nanotechnology-based environmental applications, wastewater treatment technologies, and air pollution management. She completed her Ph.D. from Jadavpur University and has been serving as Assistant Professor since 2024.</p>
    <br>
    <p>Her research expertise includes nanotechnology-enabled wastewater treatment systems and climate change adaptation strategies. Prior to joining academia, she worked as Senior Project Associate under the National Clean Air Programme at the West Bengal Pollution Control Board, contributing to air quality monitoring and pollution management initiatives.</p>`,
    research: ['Nanotechnology in Wastewater Treatment', 'Air Pollution Management', 'Environmental Monitoring', 'Climate Change Adaptation'],
    education: ['[PhD — University, Year]', '[M.Sc. — University, Year]']
  },
  'moumita-chakraborty': {
    name: 'Dr. Moumita Chakraborty',
    photo: 'https://waterair.auaicoe.in/wp-content/uploads/2026/06/MC.jpeg',
    email: '[moumita.email@adamasuniversity.ac.in]',
    designation: '[Designation / Title]',
    dept: '[Department / Specialisation]',
    bio: `
    <p>Dr. Moumita Chakraborty is an environmental scientist with expertise in waste management, environmental safety, and sustainability studies. She completed her Ph.D. from G.B. Pant University of Agriculture and Technology and has been serving as Assistant Professor since 2024.</p>
    <br>
    <p>Her research primarily focuses on e-waste bioremediation, waste management systems, ESG practices, and Environmental Safety and Health (ESH). She is also actively involved in research and academic activities related to climate change adaptation and sustainable environmental management</p>`,
    research: ['E-waste Bioremediation', 'Waste Management', 'ESG & Sustainability', 'Environmental Safety & Health', 'Climate Change Adaptation'],
    education: ['[PhD — University, Year]', '[M.Sc. — University, Year]']
  },
  'ritam-bhattacharya': {
    name: 'Dr. Ritam Bhattacharya',
    photo: 'https://waterair.auaicoe.in/wp-content/uploads/2026/06/RB.jpg.jpeg',
    email: '[ritam.email@adamasuniversity.ac.in]',
    designation: '[Designation / Title]',
    dept: '[Department / Specialisation]',
    bio: `
    <p>Dr. Ritam Bhattacharya is an ecologist and biodiversity researcher with expertise in agroecology, ecosystem services, pollination biology, and conservation science. He completed his Ph.D. from the University of Calcutta and pursued Post-Doctoral research through Indo-Norwegian collaboration programmes and the EU Horizon 2020 programme in association with the Norwegian University of Life Sciences and the University of Malmö. He has been serving as Assistant Professor since 2026.</p>
    <br>
    <p>His research interests include agroecology, biodiversity management, insect ecology, ecological modelling, and landscape-level environmental research. He is also actively engaged in community participation and action-learning pedagogy approaches for environmental education and sustainability practices.</p>`,
    research: ['Agroecology & Ecosystem Services', 'Pollination Biology', 'Biodiversity Conservation', 'Ecological Modelling', 'Community-based Environmental Research'],
    education: ['[PhD — University, Year]', '[M.Sc. — University, Year]']
  },
  'aditi-ghosh-hazra': {
    name: 'Ms. Aditi Ghosh Hazra',
    photo: 'https://waterair.auaicoe.in/wp-content/uploads/2026/06/AGH1.jpeg',
    email: '[aditi.email@adamasuniversity.ac.in]',
    designation: '[Designation / Title]',
    dept: '[Department / Specialisation]',
    bio: `
    <p>Ms. Aditi Ghosh Hazra is a Teaching Assistant in Environmental Science with academic specialization in biodiversity, animal behaviour, and community-based ecological research. She completed her M.Sc. in Environmental Science from the University of Calcutta and has been associated with the department since 2024.</p>
    <br>
    <p>Her interests include ecological field studies, biodiversity assessment, human–animal interactions, and community-oriented environmental investigations.</p>`,
    research: ['Ecological Field Studies', 'Biodiversity & Conservation', 'Animal Behaviour', 'Human–Animal Interactions'],
    education: ['[M.Sc. — University, Year]', '[B.Sc. — University, Year]']
  },
  'rupa-chaudhuri': {
    name: 'Ms. Rupa Chaudhuri',
    photo: 'https://waterair.auaicoe.in/wp-content/uploads/2026/06/RC.jpg.jpeg',
    email: '[rupa.email@adamasuniversity.ac.in]',
    designation: '[Designation / Title]',
    dept: '[Department / Specialisation]',
    bio: `
    <p>Ms. Rupa Chaudhuri is a Teaching Assistant in Environmental Science with research interests in environmental health and pollution-related disease linkages. She completed her M.Sc. in Environmental Science from the University of Calcutta and has been associated with the department since 2024.</p>
    <br>
    <p>Her academic and research interests focus on the impacts of environmental pollution on human health, disease physiology, and environmental health risk assessment.</p>`,
    research: ['Environmental Health', 'Pollution & Human Health', 'Disease Physiology', 'Environmental Risk Assessment'],
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
  const bioContainer = document.getElementById('fm-bio');
  bioContainer.innerHTML = data.bio;

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