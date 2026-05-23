/* ==========================================
   SHAPE GRID — Vanilla JS Canvas
   Ported from React Bits ShapeGrid component
========================================== */

class ShapeGrid {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.direction       = options.direction       || 'diagonal';
    this.speed           = options.speed           || 0.5;
    this.borderColor     = options.borderColor     || '#999';
    this.squareSize      = options.squareSize      || 40;
    this.hoverFillColor  = options.hoverFillColor  || '#222';
    this.hoverTrailAmount = options.hoverTrailAmount || 0;

    this.gridOffset   = { x: 0, y: 0 };
    this.hoveredSquare = null;
    this.trailCells   = [];
    this.cellOpacities = new Map();
    this.rafId        = null;

    this._onResize     = () => this.resizeCanvas();
    this._onMouseMove  = (e) => this.handleMouseMove(e);
    this._onMouseLeave = () => this.handleMouseLeave();

    this.resizeCanvas();
    window.addEventListener('resize', this._onResize);
    this.canvas.addEventListener('mousemove', this._onMouseMove);
    this.canvas.addEventListener('mouseleave', this._onMouseLeave);
    this.rafId = requestAnimationFrame(() => this.tick());
  }

  resizeCanvas() {
    this.canvas.width  = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  drawGrid() {
    const { ctx, canvas, squareSize, borderColor, hoverFillColor, gridOffset, cellOpacities } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const offsetX = ((gridOffset.x % squareSize) + squareSize) % squareSize;
    const offsetY = ((gridOffset.y % squareSize) + squareSize) % squareSize;
    const cols    = Math.ceil(canvas.width  / squareSize) + 3;
    const rows    = Math.ceil(canvas.height / squareSize) + 3;

    for (let col = -2; col < cols; col++) {
      for (let row = -2; row < rows; row++) {
        const sx = col * squareSize + offsetX;
        const sy = row * squareSize + offsetY;
        const key = `${col},${row}`;
        const alpha = cellOpacities.get(key);

        if (alpha) {
          ctx.globalAlpha = alpha;
          ctx.fillStyle = hoverFillColor;
          ctx.fillRect(sx, sy, squareSize, squareSize);
          ctx.globalAlpha = 1;
        }

        ctx.strokeStyle = borderColor;
        ctx.lineWidth   = 1;
        ctx.strokeRect(sx, sy, squareSize, squareSize);
      }
    }

    /* radial vignette */
    const grad = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2,
      Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
    );
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  updateCellOpacities() {
    const targets = new Map();

    if (this.hoveredSquare) {
      targets.set(`${this.hoveredSquare.x},${this.hoveredSquare.y}`, 1);
    }

    if (this.hoverTrailAmount > 0) {
      for (let i = 0; i < this.trailCells.length; i++) {
        const t = this.trailCells[i];
        const key = `${t.x},${t.y}`;
        if (!targets.has(key)) {
          targets.set(key, (this.trailCells.length - i) / (this.trailCells.length + 1));
        }
      }
    }

    for (const [key] of targets) {
      if (!this.cellOpacities.has(key)) this.cellOpacities.set(key, 0);
    }

    for (const [key, opacity] of this.cellOpacities) {
      const target = targets.get(key) || 0;
      const next   = opacity + (target - opacity) * 0.15;
      if (next < 0.005) this.cellOpacities.delete(key);
      else              this.cellOpacities.set(key, next);
    }
  }

  tick() {
    const s    = Math.max(this.speed, 0.1);
    const wrap = this.squareSize;

    switch (this.direction) {
      case 'right':    this.gridOffset.x = (this.gridOffset.x - s + wrap) % wrap; break;
      case 'left':     this.gridOffset.x = (this.gridOffset.x + s + wrap) % wrap; break;
      case 'up':       this.gridOffset.y = (this.gridOffset.y + s + wrap) % wrap; break;
      case 'down':     this.gridOffset.y = (this.gridOffset.y - s + wrap) % wrap; break;
      case 'diagonal':
        this.gridOffset.x = (this.gridOffset.x - s + wrap) % wrap;
        this.gridOffset.y = (this.gridOffset.y - s + wrap) % wrap;
        break;
    }

    this.updateCellOpacities();
    this.drawGrid();
    this.rafId = requestAnimationFrame(() => this.tick());
  }

  handleMouseMove(e) {
    const rect    = this.canvas.getBoundingClientRect();
    const mouseX  = e.clientX - rect.left;
    const mouseY  = e.clientY - rect.top;
    const { squareSize, gridOffset } = this;
    const offsetX = ((gridOffset.x % squareSize) + squareSize) % squareSize;
    const offsetY = ((gridOffset.y % squareSize) + squareSize) % squareSize;
    const col     = Math.floor((mouseX - offsetX) / squareSize);
    const row     = Math.floor((mouseY - offsetY) / squareSize);

    if (!this.hoveredSquare || this.hoveredSquare.x !== col || this.hoveredSquare.y !== row) {
      if (this.hoveredSquare && this.hoverTrailAmount > 0) {
        this.trailCells.unshift({ ...this.hoveredSquare });
        if (this.trailCells.length > this.hoverTrailAmount) this.trailCells.length = this.hoverTrailAmount;
      }
      this.hoveredSquare = { x: col, y: row };
    }
  }

  handleMouseLeave() {
    if (this.hoveredSquare && this.hoverTrailAmount > 0) {
      this.trailCells.unshift({ ...this.hoveredSquare });
      if (this.trailCells.length > this.hoverTrailAmount) this.trailCells.length = this.hoverTrailAmount;
    }
    this.hoveredSquare = null;
  }

  destroy() {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this._onResize);
    this.canvas.removeEventListener('mousemove', this._onMouseMove);
    this.canvas.removeEventListener('mouseleave', this._onMouseLeave);
  }
}
