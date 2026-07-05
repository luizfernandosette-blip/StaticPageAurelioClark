/* ==========================================
   AURÉLIO CLARK CONTABILIDADE — main.js
   ========================================== */

'use strict';

/* ── Sticky header ───────────────────────── */
const header = document.getElementById('header');

function handleScroll() {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll(); // run once on load

/* ── Mobile nav toggle ───────────────────── */
const hamburger  = document.querySelector('.hamburger');
const navMenu    = document.querySelector('.nav-menu');
const navOverlay = document.querySelector('.nav-overlay');

function openNav() {
  hamburger.classList.add('open');
  navMenu.classList.add('open');
  navOverlay.classList.add('show');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeNav() {
  hamburger.classList.remove('open');
  navMenu.classList.remove('open');
  navOverlay.classList.remove('show');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  if (hamburger.classList.contains('open')) {
    closeNav();
  } else {
    openNav();
  }
});

navOverlay.addEventListener('click', closeNav);

// Close nav when a link is clicked
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeNav);
});

// Close nav on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeNav();
});

/* ── Active nav link on scroll ───────────── */
const sections   = document.querySelectorAll('section[id]');
const navLinks   = document.querySelectorAll('.nav-menu a[href^="#"]');

function setActiveLink() {
  let current = '';
  const scrollY = window.scrollY + 120;

  sections.forEach(section => {
    if (scrollY >= section.offsetTop) {
      current = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', setActiveLink, { passive: true });

/* ── Smooth scroll for anchor links ─────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Scroll hero indicator ───────────────── */
const heroScroll = document.querySelector('.hero-scroll');
if (heroScroll) {
  heroScroll.addEventListener('click', () => {
    const next = document.querySelector('.stats-strip');
    if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

/* ── Intersection Observer — animations ──── */
const animateEls = document.querySelectorAll('[data-animate]');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  animateEls.forEach(el => observer.observe(el));
} else {
  // Fallback: show all
  animateEls.forEach(el => el.classList.add('is-visible'));
}

/* ── Counter animation ───────────────────── */
const counterEls = document.querySelectorAll('.stat-number[data-target]');
let countersStarted = false;

function easeOutQuad(t) { return t * (2 - t); }

function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start    = performance.now();

  function step(timestamp) {
    const elapsed  = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = easeOutQuad(progress);
    el.textContent = Math.round(eased * target);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(step);
}

// Trigger counters when stats strip is visible
const statsStrip = document.querySelector('.stats-strip');

if (statsStrip && 'IntersectionObserver' in window) {
  const statsObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !countersStarted) {
        countersStarted = true;
        counterEls.forEach(el => animateCounter(el));
        statsObserver.disconnect();
      }
    },
    { threshold: 0.3 }
  );
  statsObserver.observe(statsStrip);
}

/* ── Current year in footer ──────────────── */
const yearEls = document.querySelectorAll('.current-year');
yearEls.forEach(el => { el.textContent = new Date().getFullYear(); });

/* ── Lazy-load iframes (map) ─────────────── */
const lazyIframes = document.querySelectorAll('iframe[data-src]');

if ('IntersectionObserver' in window && lazyIframes.length) {
  const iframeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const iframe = entry.target;
          iframe.src = iframe.dataset.src;
          iframe.removeAttribute('data-src');
          iframeObserver.unobserve(iframe);
        }
      });
    },
    { rootMargin: '200px 0px' }
  );
  lazyIframes.forEach(iframe => iframeObserver.observe(iframe));
}

/* ── Logo lightbox ───────────────────────── */
const logoLightbox  = document.getElementById('logo-lightbox');
const logoBtn       = document.getElementById('nav-logo-btn');
const lbClose       = logoLightbox ? logoLightbox.querySelector('.lightbox-close')   : null;
const lbBackdrop    = logoLightbox ? logoLightbox.querySelector('.lightbox-backdrop') : null;

function openLightbox() {
  if (!logoLightbox) return;
  logoLightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  lbClose && lbClose.focus();
}

function closeLightbox() {
  if (!logoLightbox) return;
  logoLightbox.classList.remove('open');
  document.body.style.overflow = '';
  logoBtn && logoBtn.focus();
}

if (logoBtn)     logoBtn.addEventListener('click',  (e) => { e.preventDefault(); openLightbox(); });
if (lbClose)     lbClose.addEventListener('click',  closeLightbox);
if (lbBackdrop)  lbBackdrop.addEventListener('click', closeLightbox);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && logoLightbox && logoLightbox.classList.contains('open')) {
    closeLightbox();
  }
});
