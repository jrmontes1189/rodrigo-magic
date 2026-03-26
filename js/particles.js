/* ============================================================
   Mystic Particle System — Hero Canvas Animation
   ============================================================ */

class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.sparkles = [];
    this.suits = ['♠', '♥', '♦', '♣'];
    this.floatingSuits = [];
    this.mouse = { x: null, y: null };
    this.animFrame = null;

    this.resize();
    this.init();
    this.animate();

    window.addEventListener('resize', () => this.resize());
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      if (Math.random() < 0.3) this.spawnSparkle(this.mouse.x, this.mouse.y);
    });
    this.canvas.addEventListener('mouseleave', () => { this.mouse.x = null; this.mouse.y = null; });
  }

  resize() {
    this.w = this.canvas.width = window.innerWidth;
    this.h = this.canvas.height = this.canvas.parentElement
      ? this.canvas.parentElement.offsetHeight
      : window.innerHeight;
  }

  init() {
    this.particles = [];
    this.floatingSuits = [];
    const count = Math.min(Math.floor((this.w * this.h) / 9000), 140);

    for (let i = 0; i < count; i++) {
      this.particles.push(this.createStar());
    }

    for (let i = 0; i < 12; i++) {
      this.floatingSuits.push(this.createFloatingSuit());
    }
  }

  createStar() {
    return {
      x: Math.random() * this.w,
      y: Math.random() * this.h,
      radius: Math.random() * 1.4 + 0.3,
      opacity: Math.random(),
      opacityDir: Math.random() > 0.5 ? 1 : -1,
      opacitySpeed: Math.random() * 0.008 + 0.002,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: (Math.random() - 0.5) * 0.1,
      gold: Math.random() < 0.15,
      purple: Math.random() < 0.08,
    };
  }

  createFloatingSuit() {
    return {
      x: Math.random() * this.w,
      y: this.h + Math.random() * 200,
      suit: this.suits[Math.floor(Math.random() * 4)],
      size: Math.random() * 14 + 8,
      speed: Math.random() * 0.4 + 0.15,
      rotationSpeed: (Math.random() - 0.5) * 0.01,
      rotation: Math.random() * Math.PI * 2,
      opacity: 0,
      maxOpacity: Math.random() * 0.07 + 0.02,
      drift: (Math.random() - 0.5) * 0.2,
    };
  }

  spawnSparkle(x, y) {
    const count = Math.floor(Math.random() * 4) + 2;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.5 + 0.5;
      this.sparkles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 2.5 + 0.8,
        opacity: 1,
        decay: Math.random() * 0.04 + 0.02,
        gold: Math.random() < 0.6,
      });
    }
  }

  spawnRandomSparkle() {
    const x = Math.random() * this.w;
    const y = Math.random() * this.h;
    this.sparkles.push({
      x, y,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -Math.random() * 2 - 0.5,
      radius: Math.random() * 1.8 + 0.5,
      opacity: 1,
      decay: Math.random() * 0.025 + 0.015,
      gold: true,
    });
  }

  drawStar(x, y, r, opacity, gold, purple) {
    let color;
    if (gold) {
      color = `rgba(201,165,90,${opacity})`;
    } else if (purple) {
      color = `rgba(167,139,250,${opacity})`;
    } else {
      color = `rgba(240,232,216,${opacity})`;
    }

    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI * 2);
    this.ctx.fillStyle = color;
    this.ctx.fill();

    if (opacity > 0.7 && r > 1) {
      this.ctx.beginPath();
      this.ctx.arc(x, y, r * 2.5, 0, Math.PI * 2);
      const glow = this.ctx.createRadialGradient(x, y, 0, x, y, r * 2.5);
      glow.addColorStop(0, gold ? `rgba(201,165,90,${opacity * 0.25})` : `rgba(240,232,216,${opacity * 0.15})`);
      glow.addColorStop(1, 'transparent');
      this.ctx.fillStyle = glow;
      this.ctx.fill();
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.w, this.h);

    // Ambient nebula bg
    const gradient = this.ctx.createRadialGradient(
      this.w * 0.5, this.h * 0.4, 0,
      this.w * 0.5, this.h * 0.4, this.w * 0.6
    );
    gradient.addColorStop(0, 'rgba(124,58,237,0.04)');
    gradient.addColorStop(0.5, 'rgba(76,29,149,0.02)');
    gradient.addColorStop(1, 'transparent');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.w, this.h);

    // Stars
    for (const p of this.particles) {
      p.opacity += p.opacityDir * p.opacitySpeed;
      if (p.opacity >= 1) { p.opacity = 1; p.opacityDir = -1; }
      if (p.opacity <= 0) { p.opacity = 0; p.opacityDir = 1; }

      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < -2) p.x = this.w + 2;
      if (p.x > this.w + 2) p.x = -2;
      if (p.y < -2) p.y = this.h + 2;
      if (p.y > this.h + 2) p.y = -2;

      if (this.mouse.x) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100 * 0.3;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }
      }

      this.drawStar(p.x, p.y, p.radius, p.opacity, p.gold, p.purple);
    }

    // Sparkles
    for (let i = this.sparkles.length - 1; i >= 0; i--) {
      const s = this.sparkles[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy -= 0.04;
      s.opacity -= s.decay;

      if (s.opacity <= 0) { this.sparkles.splice(i, 1); continue; }

      const color = s.gold ? `rgba(201,165,90,${s.opacity})` : `rgba(240,232,216,${s.opacity})`;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = color;
      this.ctx.fill();

      // Cross sparkle shape
      if (s.radius > 1.5) {
        this.ctx.save();
        this.ctx.globalAlpha = s.opacity * 0.7;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 0.5;
        this.ctx.beginPath();
        this.ctx.moveTo(s.x - s.radius * 2.5, s.y);
        this.ctx.lineTo(s.x + s.radius * 2.5, s.y);
        this.ctx.moveTo(s.x, s.y - s.radius * 2.5);
        this.ctx.lineTo(s.x, s.y + s.radius * 2.5);
        this.ctx.stroke();
        this.ctx.restore();
      }
    }

    // Floating card suits
    for (const suit of this.floatingSuits) {
      suit.y -= suit.speed;
      suit.x += suit.drift;
      suit.rotation += suit.rotationSpeed;

      if (suit.y + suit.size * 2 < 0) {
        suit.y = this.h + Math.random() * 100;
        suit.x = Math.random() * this.w;
        suit.opacity = 0;
      }

      const progress = 1 - (suit.y / this.h);
      suit.opacity = suit.maxOpacity * Math.sin(progress * Math.PI);

      this.ctx.save();
      this.ctx.translate(suit.x, suit.y);
      this.ctx.rotate(suit.rotation);
      this.ctx.globalAlpha = suit.opacity;
      this.ctx.font = `${suit.size}px serif`;
      this.ctx.fillStyle = (suit.suit === '♥' || suit.suit === '♦')
        ? 'rgba(201,165,90,1)'
        : 'rgba(167,139,250,1)';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(suit.suit, 0, 0);
      this.ctx.restore();
    }

    // Random ambient sparkle
    if (Math.random() < 0.04) this.spawnRandomSparkle();

    this.animFrame = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
  }
}

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('particles-canvas')) {
    window._particles = new ParticleSystem('particles-canvas');
  }
});
