/* ==========================================
   MOSAIC GRID — Vanilla JS + GSAP
   Triggered on slide entry, resets on exit
========================================== */

class MosaicGrid {
  constructor(container) {
    this.container = container;
    this.items     = [...container.querySelectorAll('.mosaic-item')];
    this.animated  = false;
    gsap.set(this.items, { opacity: 0, y: 48, scale: 0.94 });
  }

  play() {
    if (this.animated) return;
    this.animated = true;
    gsap.to(this.items, {
      opacity: 1,
      y:       0,
      scale:   1,
      duration: 0.7,
      stagger:  { each: 0.09, from: 'start' },
      ease:    'power3.out',
    });
  }

  reset() {
    this.animated = false;
    gsap.killTweensOf(this.items);
    gsap.set(this.items, { opacity: 0, y: 48, scale: 0.94 });
  }
}
