/* ==========================================
   HORIZONTAL SLIDE NAVIGATION
========================================== */
const wrapper       = document.getElementById('slides');
const slideEls      = [...wrapper.querySelectorAll(':scope > section')];
const total         = slideEls.length;
let current         = 0;
let locked          = false;

/* Vídeos controlados por slide */
const manifesto_video  = document.querySelector('#manifesto .manifesto-bg-video');
const pergunta_video   = document.querySelector('#pergunta .pergunta-bg-video');
const esqueleto_video  = document.querySelector('#esqueleto-capa .esqueleto-video');
const maos_massa_video = document.querySelector('#maos-massa .maos-massa-video');
const json_video       = document.querySelector('#json .json-video');
const orquestra_video  = document.querySelector('#orquestra .orquestra-video');

const slideVideos = [
  { index: 1,  el: manifesto_video,  noLoop: true },
  { index: 2,  el: pergunta_video },
  { index: 6,  el: esqueleto_video,  noLoop: true },
  { index: 9,  el: maos_massa_video, noLoop: true },
  { index: 10, el: json_video },
  { index: 11, el: orquestra_video },
];

function handleSlideVideos(index) {
  slideVideos.forEach(({ index: targetIndex, el, noLoop }) => {
    if (!el) return;
    if (index === targetIndex) {
      el.currentTime = 0;
      el.play();
    } else {
      el.pause();
      if (!noLoop) el.currentTime = 0;
    }
  });
}

const dotsContainer = document.querySelector('.slide-dots');
const counterEl     = document.querySelector('.slide-counter');
const prevBtn       = document.querySelector('.slide-btn--prev');
const nextBtn       = document.querySelector('.slide-btn--next');

/* Build dots */
const dots = slideEls.map((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Slide ${i + 1} de ${total}`);
  dot.setAttribute('role', 'tab');
  dot.addEventListener('click', () => goTo(i));
  dotsContainer.appendChild(dot);
  return dot;
});

function goTo(index) {
  if (index < 0 || index >= total || index === current || locked) return;
  locked = true;
  current = index;
  wrapper.style.setProperty('--slide-index', current);
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
  counterEl.textContent =
    `${String(current + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  handleSlideVideos(current);
  handleSlideMosaics(current);
  handleJsonTypewriter(current);
  setTimeout(() => { locked = false; }, 820);
}

/* Buttons */
prevBtn.addEventListener('click', () => goTo(current - 1));
nextBtn.addEventListener('click', () => goTo(current + 1));

/* data-goto-slide attributes (CTA buttons) */
document.querySelectorAll('[data-goto-slide]').forEach(btn => {
  btn.addEventListener('click', () => goTo(parseInt(btn.dataset.gotoSlide, 10)));
});

/* Keyboard */
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown')  { e.preventDefault(); goTo(current + 1); }
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')    { e.preventDefault(); goTo(current - 1); }
});

/* Mouse wheel (throttled) */
let lastWheel = 0;
window.addEventListener('wheel', (e) => {
  e.preventDefault();
  const now = Date.now();
  if (now - lastWheel < 900) return;
  lastWheel = now;
  if (e.deltaY > 0 || e.deltaX > 0) goTo(current + 1);
  else                               goTo(current - 1);
}, { passive: false });

/* Touch swipe */
let touchStartX = 0, touchStartY = 0;
window.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
    goTo(dx < 0 ? current + 1 : current - 1);
  }
}, { passive: true });

/* ==========================================
   SHAPE GRID — Slide 04 (capa-tese)
========================================== */
const shapeCanvas = document.querySelector('.capa-shape-grid');
if (shapeCanvas) {
  new ShapeGrid(shapeCanvas, {
    direction:        'diagonal',
    speed:            0.4,
    squareSize:       52,
    borderColor:      '#1c1c1e',
    hoverFillColor:   '#FF4C29',
    hoverTrailAmount: 6,
  });
}

/* ==========================================
   SHAPE GRID — Slide 09 (metodo)
========================================== */
const metodoCanvas = document.querySelector('.metodo-shape-grid');
if (metodoCanvas) {
  new ShapeGrid(metodoCanvas, {
    direction:        'diagonal',
    speed:            0.4,
    squareSize:       52,
    borderColor:      '#1c1c1e',
    hoverFillColor:   '#FF4C29',
    hoverTrailAmount: 6,
  });
}

/* ==========================================
   SHAPE GRID — Slide 13 (exercicio)
========================================== */
const exercicioCanvas = document.querySelector('.exercicio-shape-grid');
if (exercicioCanvas) {
  new ShapeGrid(exercicioCanvas, {
    direction:        'diagonal',
    speed:            0.4,
    squareSize:       52,
    borderColor:      '#1c1c1e',
    hoverFillColor:   '#FF4C29',
    hoverTrailAmount: 6,
  });
}

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

/* ==========================================
   MOSAIC GRID — Slide pilares (index 5)
========================================== */
let pilaresMosaic = null;

function handleSlideMosaics(index) {
  if (!pilaresMosaic) return;
  if (index === 5) {
    pilaresMosaic.play();
  } else {
    pilaresMosaic.reset();
  }
}

const mosaicEl = document.querySelector('#pilares .pilares-mosaic');
if (mosaicEl && typeof gsap !== 'undefined') {
  pilaresMosaic = new MosaicGrid(mosaicEl);
}

/* ==========================================
   TYPEWRITER — Slide 11 (json), índice 10
========================================== */
const jsonTypewriter = (() => {
  const preEl = document.getElementById('json-pre');
  if (!preEl) return { start() {}, reset() {} };

  const sourceHTML = preEl.innerHTML;
  let timer        = null;
  let running      = false;

  /* Divide o HTML em tokens: tags/entities (saída imediata) ou char a char */
  function tokenize(html) {
    const tokens = [];
    let i = 0;
    while (i < html.length) {
      /* Tag HTML */
      if (html[i] === '<') {
        const end = html.indexOf('>', i);
        if (end !== -1) {
          tokens.push({ instant: true, s: html.slice(i, end + 1) });
          i = end + 1;
          continue;
        }
      }
      /* Entidade HTML (&amp; &lt; etc.) */
      if (html[i] === '&') {
        const end = html.indexOf(';', i);
        if (end !== -1 && end - i <= 9) {
          tokens.push({ instant: false, s: html.slice(i, end + 1) });
          i = end + 1;
          continue;
        }
      }
      tokens.push({ instant: false, s: html[i] });
      i++;
    }
    return tokens;
  }

  const tokens = tokenize(sourceHTML);

  function start() {
    if (running) return;
    running = true;

    preEl.innerHTML =
      '<span class="tw-content"></span>' +
      '<span class="tw-cursor" aria-hidden="true">▋</span>';

    const contentEl = preEl.querySelector('.tw-content');
    const cursorEl  = preEl.querySelector('.tw-cursor');
    let built = '';
    let pi    = 0;

    function step() {
      if (pi >= tokens.length) {
        cursorEl.classList.add('tw-cursor--done');
        timer = setTimeout(() => cursorEl.remove(), 1000);
        return;
      }
      const tok = tokens[pi++];
      built += tok.s;
      contentEl.innerHTML = built;

      /* Tags são inseridas instantaneamente; chars com delay */
      timer = setTimeout(step, tok.instant ? 0 : 20);
    }

    step();
  }

  function reset() {
    clearTimeout(timer);
    running = false;
    preEl.innerHTML = sourceHTML;
  }

  return { start, reset };
})();

function handleJsonTypewriter(index) {
  if (index === 10) {
    jsonTypewriter.start();
  } else {
    jsonTypewriter.reset();
  }
}
