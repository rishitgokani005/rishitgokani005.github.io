
// ─── RETRO AUDIO SYNTHESIZER (Web Audio API) ───
class RetroAudioSynth {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('sound_enabled') !== 'false';
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      console.warn("Audio Context suppressed:", e);
    }
  }

  playHover() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.setValueAtTime(1000, this.ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch (e) {
      console.warn("Audio Context suppressed:", e);
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('sound_enabled', this.enabled);
    return this.enabled;
  }
}

const audioSynth = new RetroAudioSynth();

// ─── LOADER HIDE ───
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    initParticles();
  }, 1200);
});

// ─── RETRO SOUND FX TOGGLE ───
const soundToggleBtn = document.getElementById('soundToggle');
const soundIcon = document.getElementById('soundIcon');

function updateSoundUI(enabled) {
  if (soundIcon) soundIcon.textContent = enabled ? '🔊' : '🔇';
  if (soundToggleBtn) {
    soundToggleBtn.style.borderColor = enabled ? 'var(--accent)' : 'var(--text-muted)';
    soundToggleBtn.style.opacity = enabled ? '1' : '0.6';
  }
}
updateSoundUI(audioSynth.enabled);

if (soundToggleBtn) {
  soundToggleBtn.addEventListener('click', () => {
    const state = audioSynth.toggle();
    updateSoundUI(state);
    if (state) audioSynth.playClick();
  });
}

// Attach hover sound listeners
document.addEventListener('mouseover', e => {
  if (e.target.closest('a, button, .skill-tag, .project-card, .contact-link, .ach-card')) {
    audioSynth.playHover();
  }
});

document.addEventListener('click', e => {
  if (e.target.closest('a, button, .skill-tag, .project-card, .contact-link')) {
    audioSynth.playClick();
  }
});

// ─── CRT SCANLINES TOGGLE ───
const crtOverlay = document.getElementById('crt-scanlines');
const crtToggleBtn = document.getElementById('crtToggle');
let crtEnabled = localStorage.getItem('crt_enabled') !== 'false';

function updateCrtUI(enabled) {
  if (crtOverlay) {
    if (enabled) crtOverlay.classList.remove('hidden');
    else crtOverlay.classList.add('hidden');
  }
  if (crtToggleBtn) {
    crtToggleBtn.style.borderColor = enabled ? 'var(--accent-2)' : 'var(--text-muted)';
    crtToggleBtn.style.opacity = enabled ? '1' : '0.6';
  }
  localStorage.setItem('crt_enabled', enabled);
}
updateCrtUI(crtEnabled);

if (crtToggleBtn) {
  crtToggleBtn.addEventListener('click', () => {
    crtEnabled = !crtEnabled;
    updateCrtUI(crtEnabled);
  });
}

// ─── THEME TOGGLE ───
const html = document.documentElement;
const themeToggleBtn = document.getElementById('themeToggle');
let currentTheme = localStorage.getItem('theme') || 'dark';

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  currentTheme = theme;
}
applyTheme(currentTheme);

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });
}

// ─── PIXEL CURSOR WITH TRAIL ───
const cursorOuter = document.getElementById('cursor-outer');
const cursorDot   = document.getElementById('cursor-dot');
const trailContainer = document.getElementById('cursor-trail');

let mouseX = 0, mouseY = 0;
let outerX = 0, outerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursorDot) {
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  }
  spawnTrail(mouseX, mouseY);
});

function animateCursor() {
  outerX += (mouseX - outerX) * 0.18;
  outerY += (mouseY - outerY) * 0.18;
  if (cursorOuter) {
    cursorOuter.style.left = outerX + 'px';
    cursorOuter.style.top  = outerY + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Trail pool
let trailPool = [];
const TRAIL_COUNT = 8;

if (trailContainer) {
  for (let i = 0; i < TRAIL_COUNT; i++) {
    const s = document.createElement('span');
    trailContainer.appendChild(s);
    trailPool.push({ el: s, x: 0, y: 0 });
  }
}

let trailHead = 0;
function spawnTrail(x, y) {
  if (!trailPool.length) return;
  const t = trailPool[trailHead % TRAIL_COUNT];
  trailHead++;
  t.x = x; t.y = y;
  t.el.style.left = x + 'px';
  t.el.style.top  = y + 'px';
  t.el.style.opacity = '0.5';
  t.el.style.transform = 'translate(-50%, -50%) scale(1)';
  
  setTimeout(() => {
    t.el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    t.el.style.opacity = '0';
    t.el.style.transform = 'translate(-50%, -50%) scale(0.2)';
  }, 20);
}

// Cursor hover states
document.querySelectorAll('a, button, .skill-tag, .project-card, .contact-link, .ach-card, .info-item').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// ─── TYPED TEXT EFFECT ───
const roles = [
  'Full-Stack Web Developer',
  'AI Engineer',
  'ML & Data Science Engineer',
  'Flutter Developer',
  'CSE (IoT) Student @ GCET, Anand'
];

let roleIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function typeEffect() {
  if (!typedEl) return;
  const current = roles[roleIdx];
  
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeEffect, 2000);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(typeEffect, deleting ? 50 : 80);
}
setTimeout(typeEffect, 1500);

// ─── PARTICLE CANVAS ───
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const PARTICLE_COUNT = 40;
  const particles = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      size: Math.random() * 3 + 1,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.4 + 0.1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      ctx.fillStyle = `rgba(255, 176, 0, ${p.alpha})`;
      ctx.fillRect(p.x, p.y, p.size, p.size); // Square retro pixel particles
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ─── MOBILE MENU ───
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  });
}

function closeMobile() {
  menuOpen = false;
  if (mobileMenu) mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

// ─── CONTACT FORM ───
function handleSubmit(e) {
  e.preventDefault();
  const note = document.getElementById('formNote');
  if (note) {
    note.textContent = '✓ TRANSMISSION SENT! Redirecting to mail client...';
    note.style.color = 'var(--accent)';
  }
  const name = e.target[0].value;
  const email = e.target[1].value;
  const message = e.target[2].value;
  const mailto = `mailto:rishitgokani004@gmail.com?subject=Portfolio%20Contact%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0AFrom%3A%20${encodeURIComponent(email)}`;
  
  e.target.reset();
  window.location.href = mailto;
  setTimeout(() => { if (note) note.textContent = ''; }, 5000);
}