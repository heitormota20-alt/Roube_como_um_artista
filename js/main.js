/* ==========================================
   ACTIVE NAV LINK ON SCROLL
========================================== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            'is-active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach((section) => observer.observe(section));

/* ==========================================
   HEADER SHADOW ON SCROLL
========================================== */
const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 10);
}, { passive: true });

/* ==========================================
   FADE-IN ON SCROLL (INTERSECTION OBSERVER)
========================================== */
const fadeEls = document.querySelectorAll(
  '.pilar-card, .step-card, .tool-card, .tese-card, .ref-row'
);

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

fadeEls.forEach((el) => {
  el.classList.add('fade-up');
  fadeObserver.observe(el);
});

/* ==========================================
   HIGHLIGHT ANIMATION TRIGGER
========================================== */
const highlightEls = document.querySelectorAll('.highlight-anim');

const highlightObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        highlightObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);

highlightEls.forEach((el) => highlightObserver.observe(el));

/* ==========================================
   SPOTLIGHT HOVER (tese cards)
========================================== */
document.querySelectorAll('.tese-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  });
});
