/* ═══════════════════════════════
   AURUM SALON — script.js
═══════════════════════════════ */

/* ── Navbar Scroll Effect ── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


/* ── Hamburger Menu ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Close on outside click
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});


/* ── Smooth Scroll for all anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
    const top  = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ── Scroll-reveal Animation ── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));


/* ── Staggered reveal for cards ── */
function addStaggeredDelays(selector, step = 80) {
  const items = document.querySelectorAll(selector);
  items.forEach((item, i) => {
    item.style.transitionDelay = `${i * step}ms`;
  });
}

addStaggeredDelays('.service-card', 60);
addStaggeredDelays('.testi-card', 80);
addStaggeredDelays('.price-card', 100);


/* ── Active nav link on scroll ── */
const sections  = document.querySelectorAll('section[id]');
const navALinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navALinks.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === `#${id}`) {
          a.style.color = 'var(--gold)';
        }
      });
    }
  });
}, {
  threshold: 0.4,
  rootMargin: '-60px 0px 0px 0px'
});

sections.forEach(s => sectionObserver.observe(s));


/* ── Gallery lightbox (simple overlay) ── */
function createLightbox() {
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.style.cssText = `
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(0,0,0,.92);
    display: none; align-items: center; justify-content: center;
    cursor: zoom-out; backdrop-filter: blur(8px);
  `;
  const img = document.createElement('img');
  img.style.cssText = `
    max-width: 90vw; max-height: 90vh;
    object-fit: contain; border-radius: 8px;
    box-shadow: 0 20px 80px rgba(0,0,0,.6);
    transform: scale(.9); transition: transform .3s ease;
  `;
  const close = document.createElement('button');
  close.innerHTML = '✕';
  close.style.cssText = `
    position: absolute; top: 24px; right: 28px;
    background: none; border: none; color: #fff;
    font-size: 1.6rem; cursor: pointer; opacity: .7;
    font-family: sans-serif; line-height: 1;
  `;
  lb.appendChild(img);
  lb.appendChild(close);
  document.body.appendChild(lb);

  function open(src, alt) {
    img.src = src;
    img.alt = alt;
    lb.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => { img.style.transform = 'scale(1)'; }, 10);
  }
  function closeLb() {
    img.style.transform = 'scale(.9)';
    setTimeout(() => {
      lb.style.display = 'none';
      document.body.style.overflow = '';
    }, 250);
  }

  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  close.addEventListener('click', closeLb);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.style.cursor = 'zoom-in';
    item.addEventListener('click', () => {
      const i = item.querySelector('img');
      open(i.src, i.alt);
    });
  });
}
createLightbox();


/* ── Floating WhatsApp pulse ── */
function addWAPulse() {
  const wa = document.querySelector('.whatsapp-float');
  if (!wa) return;
  const ring = document.createElement('div');
  ring.style.cssText = `
    position: absolute; inset: -6px;
    border-radius: 50%;
    border: 2px solid rgba(37,211,102,.5);
    animation: waPulse 2.4s ease-out infinite;
    pointer-events: none;
  `;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes waPulse {
      0%   { transform: scale(1); opacity: 0.7; }
      80%  { transform: scale(1.6); opacity: 0; }
      100% { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  wa.style.position = 'fixed';
  wa.appendChild(ring);
}
addWAPulse();


/* ── Count-up animation for badge ── */
function countUp(el, target, duration = 1200) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const val = Math.floor(progress * target);
    el.textContent = val + '+';
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const badgeEl = document.querySelector('.badge-num');
if (badgeEl) {
  const badgeObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      countUp(badgeEl, 6);
      badgeObserver.disconnect();
    }
  }, { threshold: 0.5 });
  badgeObserver.observe(badgeEl);
}


/* ── Service card tilt effect (desktop only) ── */
if (window.innerWidth > 768) {
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}


/* ── Scroll progress bar ── */
function addProgressBar() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px;
    background: linear-gradient(90deg, var(--gold-dk), var(--gold-lt));
    z-index: 2000; width: 0; transition: width .1s linear;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = `${(scrollTop / docH) * 100}%`;
  });
}
addProgressBar();
