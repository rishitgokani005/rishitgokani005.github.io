/* ════════════════════════════════════
   RISHIT GOKANI — PORTFOLIO SCRIPTS v2
   ════════════════════════════════════ */

// ─── LOADER ───
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('revealed'), 120 + i * 110);
    });
    startCounters();
    initParticles();
  }, 2000);
});

// ─── MAGNETIC CURSOR WITH TRAIL ───
const cursorOuter = document.getElementById('cursor-outer');
const cursorDot   = document.getElementById('cursor-dot');

let mouseX = 0, mouseY = 0;
let outerX = 0, outerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
  spawnTrail(mouseX, mouseY);
});

function animateCursor() {
  outerX += (mouseX - outerX) * 0.10;
  outerY += (mouseY - outerY) * 0.10;
  cursorOuter.style.left = outerX + 'px';
  cursorOuter.style.top  = outerY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Trail particles
let trailPool = [];
const TRAIL_COUNT = 12;
const trailContainer = document.getElementById('cursor-trail');

for (let i = 0; i < TRAIL_COUNT; i++) {
  const s = document.createElement('span');
  trailContainer.appendChild(s);
  trailPool.push({ el: s, x: 0, y: 0, life: 0 });
}

let trailHead = 0;
function spawnTrail(x, y) {
  const t = trailPool[trailHead % TRAIL_COUNT];
  trailHead++;
  t.x = x; t.y = y; t.life = 1;
  t.el.style.left = x + 'px';
  t.el.style.top  = y + 'px';
  t.el.style.opacity = '0.6';
  t.el.style.transform = 'translate(-50%,-50%) scale(1)';
  t.el.style.width  = '5px';
  t.el.style.height = '5px';
  t.el.style.background = 'var(--accent)';
  t.el.style.boxShadow = '0 0 6px var(--accent)';
  requestAnimationFrame(() => {
    t.el.style.transition = 'opacity 0.5s ease, transform 0.5s ease, width 0.5s, height 0.5s';
    t.el.style.opacity = '0';
    t.el.style.transform = 'translate(-50%,-50%) scale(0)';
    t.el.style.width  = '2px';
    t.el.style.height = '2px';
  });
}

// Cursor interaction states
document.querySelectorAll('a, button, .skill-tag, .project-card, .contact-link, .ach-card, .info-item, .btn-view-demo').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});
document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

// ─── PARTICLE CANVAS ───
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');
  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const PARTICLE_COUNT = 70;
  const particles = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      hue: Math.random() > 0.5 ? 166 : 260, // teal or purple
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.alpha})`;
      ctx.fill();
    });

    // Connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,245,195,${0.04 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// ─── THEME TOGGLE ───
const html       = document.documentElement;
const toggleBtn  = document.getElementById('themeToggle');
let currentTheme = localStorage.getItem('theme') || 'dark';

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  currentTheme = theme;
}
applyTheme(currentTheme);

toggleBtn.addEventListener('click', () => {
  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// ─── MOBILE MENU ───
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  hamburger.classList.toggle('open', menuOpen);
  mobileMenu.classList.toggle('open', menuOpen);
  document.body.style.overflow = menuOpen ? 'hidden' : '';
});

function closeMobile() {
  menuOpen = false;
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

// ─── NAVBAR SCROLL ───
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 40);
});

// ─── TYPED TEXT ───
const roles = [
  'Full-Stack Developer',
  'CSE Student @ GCET, Anand',
  'React & Node.js Builder',
  'Flutter App Developer',
  'IoT Enthusiast',
];
let roleIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function typeEffect() {
  const current = roles[roleIdx];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) { deleting = true; setTimeout(typeEffect, 2200); return; }
  } else {
    typedEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
  }
  setTimeout(typeEffect, deleting ? 55 : 85);
}
setTimeout(typeEffect, 2400);

// ─── SCROLL REVEAL ───
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
  if (!el.closest('.hero')) revealObserver.observe(el);
});

// ─── STAT COUNTERS ───
function startCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target    = parseFloat(el.getAttribute('data-target'));
    const isDecimal = target % 1 !== 0;
    const duration  = 2000;
    const start     = performance.now();

    function update(time) {
      const elapsed  = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 4);
      const val      = eased * target;
      el.textContent = isDecimal ? val.toFixed(2) : Math.floor(val);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = isDecimal ? target.toFixed(2) : target;
    }
    requestAnimationFrame(update);
  });
}

// ─── VIDEO DEMO TOGGLE ───
function toggleDemo(btn) {
  const wrapper = btn.nextElementSibling;
  const video = wrapper.querySelector('video');
  const icon = btn.querySelector('.demo-icon');
  
  if (wrapper.style.display === 'none') {
    wrapper.style.display = 'block';
    icon.textContent = '▼';
    video.play().catch(e => console.log('Autoplay prevented:', e));
  } else {
    wrapper.style.display = 'none';
    icon.textContent = '▶';
    video.pause();
  }
}

// ─── CONTACT FORM ───
function handleSubmit(e) {
  e.preventDefault();
  const note = document.getElementById('formNote');
  note.textContent = '✓ Message sent! I\'ll get back to you soon.';
  note.style.color = 'var(--accent)';
  const name    = e.target[0].value;
  const email   = e.target[1].value;
  const message = e.target[2].value;
  const mailto  = `mailto:rishitgokani004@gmail.com?subject=Portfolio%20Contact%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0AFrom%3A%20${encodeURIComponent(email)}`;
  e.target.reset();
  window.location.href = mailto;
  setTimeout(() => note.textContent = '', 5000);
}

// ─── ACTIVE NAV HIGHLIGHT ───
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 130) current = s.id; });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
  });
});

// ─── ADVANCED 3D TILT ON PROJECT CARDS ───
document.querySelectorAll('.project-card').forEach(card => {
  let lastX = 0, lastY = 0;
  card.addEventListener('mousemove', e => {
    const rect  = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    lastX = x; lastY = y;
    card.style.transform = `perspective(800px) translateY(-8px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
    // Dynamic highlight
    card.style.background = `radial-gradient(ellipse at ${(x+0.5)*100}% ${(y+0.5)*100}%, rgba(0,245,195,0.07), var(--glass) 60%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.background = '';
  });
});

// ─── ACHIEVEMENT CARD TILT ───
document.querySelectorAll('.ach-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(600px) translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ─── SKILL TAG STAGGER ANIMATION ───
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-tag').forEach((tag, i) => {
        setTimeout(() => {
          tag.style.opacity   = '1';
          tag.style.transform = 'translateY(0) scale(1)';
        }, i * 70);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-category').forEach(cat => {
  cat.querySelectorAll('.skill-tag').forEach(tag => {
    tag.style.opacity   = '0';
    tag.style.transform = 'translateY(18px) scale(0.8)';
    tag.style.transition = 'opacity 0.45s ease, transform 0.45s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s, color 0.3s, background 0.3s, box-shadow 0.3s';
  });
  skillObserver.observe(cat);
});

// ─── FLOATING AVATAR PARALLAX ───
const avatar = document.querySelector('.about-avatar');
if (avatar) {
  window.addEventListener('mousemove', e => {
    const xRatio = (e.clientX / window.innerWidth  - 0.5) * 12;
    const yRatio = (e.clientY / window.innerHeight - 0.5) * 12;
    avatar.style.transform = `translate(${xRatio}px, ${yRatio}px)`;
  });
}

// ─── SECTION ENTRANCE GLOW ───
const glowObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.setProperty('--section-visible', '1');
    }
  });
}, { threshold: 0.05 });
document.querySelectorAll('.section').forEach(s => glowObserver.observe(s));

// ─── MAGNETIC BUTTON EFFECT ───
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const xRel = e.clientX - rect.left - rect.width  / 2;
    const yRel = e.clientY - rect.top  - rect.height / 2;
    btn.style.transform = `translate(${xRel * 0.15}px, ${yRel * 0.15}px) scale(1.04)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});