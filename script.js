'use strict';
/* WAITLIST SETUP: use 'netlify' after enabling Netlify form detection and
   publishing your privacy contact/retention policy; then redeploy.
   On GitHub Pages use 'formspree' and your public Formspree endpoint.
   Never put private API keys in browser JavaScript. */
const WAITLIST = { provider: 'demo', endpoint: '' };
const root = document.documentElement;
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const darkScheme = matchMedia('(prefers-color-scheme: dark)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
let motionPaused = reducedMotion.matches;
let savedTheme;
try { savedTheme = localStorage.getItem('boltcharge-theme'); } catch (_) { /* Storage may be blocked. */ }
const themes = ['neon', 'matrix', 'aurora', 'solar', 'light'];
let manualTheme = themes.includes(savedTheme);
function setTheme(theme) {
  root.dataset.theme = theme;
  $('#theme').value = theme;
  $('meta[name="theme-color"]').content = getComputedStyle(root).getPropertyValue('--bg').trim();
}
setTheme(manualTheme ? savedTheme : darkScheme.matches ? 'aurora' : 'light');
$('#theme').addEventListener('change', event => {
  manualTheme = true;
  setTheme(event.target.value);
  try { localStorage.setItem('boltcharge-theme', event.target.value); } catch (_) { /* Theme still works. */ }
});
darkScheme.addEventListener('change', () => {
  if (!manualTheme) setTheme(darkScheme.matches ? 'aurora' : 'light');
});
$('#year').textContent = new Date().getFullYear();

// Mobile navigation supports Escape, link selection, and breakpoint changes.
function closeMenu() {
  $('#nav-links').classList.remove('open');
  $('#menu').setAttribute('aria-expanded', 'false');
  $('#menu').setAttribute('aria-label', 'Open navigation');
}
$('#menu').addEventListener('click', () => {
  const open = $('#nav-links').classList.toggle('open');
  $('#menu').setAttribute('aria-expanded', String(open));
  $('#menu').setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
$$('#nav-links a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && $('#nav-links').classList.contains('open')) {
    closeMenu(); $('#menu').focus();
  }
});
matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);

// Reveal once; content remains visible without JavaScript or IntersectionObserver.
function countUp(element) {
  const target = Number(element.dataset.count);
  if (motionPaused) { element.textContent = target; return; }
  const start = performance.now();
  function tick(time) {
    const progress = Math.min((time - start) / 1000, 1);
    element.textContent = Math.round(target * (1 - (1 - progress) ** 3));
    if (progress < 1 && !motionPaused) requestAnimationFrame(tick);
    else element.textContent = target;
  }
  requestAnimationFrame(tick);
}
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('pending');
    $$('[data-count]', entry.target).forEach(countUp);
    observer.unobserve(entry.target);
  }), { threshold: 0.08 });
  $$('.reveal').forEach(section => {
    if (!motionPaused) section.classList.add('pending');
    observer.observe(section);
  });
}

// Application filters preserve focus and announce the result count.
$$('[data-filter]').forEach(button => button.addEventListener('click', () => {
  $$('[data-filter]').forEach(item => {
    item.classList.toggle('active', item === button);
    item.setAttribute('aria-pressed', String(item === button));
  });
  let visible = 0;
  $$('[data-category]').forEach(card => {
    card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
    if (!card.hidden) visible++;
  });
  $('#filter-status').textContent = `${visible} application concept${visible === 1 ? '' : 's'} shown.`;
}));
$$('.tilt').forEach(card => {
  card.addEventListener('pointermove', event => {
    if (motionPaused || !finePointer.matches) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg)`;
  });
  card.addEventListener('pointerleave', () => { card.style.transform = ''; });
});
document.addEventListener('pointermove', event => {
  if (motionPaused || !finePointer.matches) return;
  const cursor = $('#cursor');
  cursor.classList.add('visible');
  cursor.style.left = `${event.clientX}px`;
  cursor.style.top = `${event.clientY}px`;
}, { passive: true });
document.documentElement.addEventListener('pointerleave', () => $('#cursor').classList.remove('visible'));

// Typing is decorative, so screen readers receive one stable phrase.
const phrases = ['what comes next.', 'everyday possibility.', 'a world in motion.'];
const typed = $('#typed');
typed.setAttribute('aria-hidden', 'true');
const spoken = document.createElement('span');
spoken.className = 'sr-only'; spoken.textContent = phrases[0];
typed.after(spoken);
let phraseIndex = 0, letter = phrases[0].length, erasing = true, typeTimer;
function type() {
  if (motionPaused || document.hidden) return;
  const phrase = phrases[phraseIndex];
  letter += erasing ? -1 : 1;
  typed.textContent = phrase.slice(0, letter);
  let delay = erasing ? 35 : 65;
  if (letter === 0) { erasing = false; phraseIndex = (phraseIndex + 1) % phrases.length; delay = 300; }
  else if (!erasing && letter === phrase.length) { erasing = true; delay = 2300; }
  typeTimer = setTimeout(type, delay);
}

// Auto-rotation pauses on hover, keyboard focus, hidden tabs, and reduced motion.
const slides = $$('#slides figure');
const carousel = $('.carousel');
let slide = 0, slideshowPaused = false, hovering = false;
function showSlide(index) {
  slide = (index + slides.length) % slides.length;
  slides.forEach((item, i) => { item.hidden = i !== slide; });
  $('#slide-number').textContent = `0${slide + 1} / 0${slides.length}`;
}
$('#previous').addEventListener('click', () => showSlide(slide - 1));
$('#next').addEventListener('click', () => showSlide(slide + 1));
$('#carousel-pause').addEventListener('click', () => {
  slideshowPaused = !slideshowPaused;
  $('#carousel-pause').setAttribute('aria-pressed', String(slideshowPaused));
  $('#carousel-pause').textContent = slideshowPaused ? 'Play slideshow' : 'Pause slideshow';
});
carousel.addEventListener('pointerenter', () => { hovering = true; });
carousel.addEventListener('pointerleave', () => { hovering = false; });
setInterval(() => {
  if (!motionPaused && !slideshowPaused && !hovering && !document.hidden && !carousel.contains(document.activeElement)) showSlide(slide + 1);
}, 6500);

// Lightweight canvas: capped DPR, 38 points, no external assets.
const canvas = $('#particles');
const ctx = canvas.getContext('2d');
let width = 0, height = 0, frame, lastFrame = 0;
const points = Array.from({ length: 38 }, () => ({ x: Math.random(), y: Math.random(), speed: 0.000015 + Math.random() * 0.00002 }));
function resizeCanvas() {
  width = canvas.clientWidth; height = canvas.clientHeight;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = width * dpr; canvas.height = height * dpr;
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
function draw(time) {
  if (!ctx || motionPaused || document.hidden) return;
  if (time - lastFrame > 32) {
    const delta = Math.min(time - lastFrame, 70); lastFrame = time;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = getComputedStyle(root).getPropertyValue('--accent').trim();
    ctx.globalAlpha = 0.25;
    points.forEach(point => {
      point.y = (point.y - point.speed * delta + 1) % 1;
      ctx.beginPath(); ctx.arc(point.x * width, point.y * height, 1.2, 0, Math.PI * 2); ctx.fill();
    });
  }
  frame = requestAnimationFrame(draw);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas, { passive: true });
function syncMotion() {
  clearTimeout(typeTimer); cancelAnimationFrame(frame);
  root.dataset.motion = motionPaused ? 'off' : 'on';
  $('#motion').setAttribute('aria-pressed', String(motionPaused));
  $('#motion').setAttribute('aria-label', motionPaused ? 'Resume animations' : 'Pause animations');
  $('#motion').textContent = motionPaused ? '▷' : 'Ⅱ';
  if (motionPaused) {
    typed.textContent = phrases[0];
    $$('.tilt').forEach(card => { card.style.transform = ''; });
    if (ctx) ctx.clearRect(0, 0, width, height);
  } else if (!document.hidden) {
    phraseIndex = 0; letter = phrases[0].length; erasing = true;
    typed.textContent = phrases[0];
    typeTimer = setTimeout(type, 2300);
    frame = requestAnimationFrame(draw);
  }
}
$('#motion').addEventListener('click', () => {
  // The OS reduced-motion setting takes precedence over the play button.
  motionPaused = reducedMotion.matches || !motionPaused;
  syncMotion();
});
reducedMotion.addEventListener('change', () => { motionPaused = reducedMotion.matches; syncMotion(); });
document.addEventListener('visibilitychange', syncMotion);
syncMotion();

// Native validation supplies accessible, field-specific errors.
const waitForm = $('#waitlist-form');
const isLocal = location.protocol === 'file:' || ['localhost', '127.0.0.1', ''].includes(location.hostname);
const waitlistLive = !isLocal && (WAITLIST.provider === 'netlify' || (WAITLIST.provider === 'formspree' && /^https:\/\/formspree\.io\/f\/[a-z0-9]+$/i.test(WAITLIST.endpoint)));
$('.form-mode', waitForm).textContent = waitlistLive ? 'Your email is used for BoltCharge launch updates.' : 'Preview mode: submissions are not sent or saved. Live registration opens after setup.';
waitForm.addEventListener('submit', async event => {
  event.preventDefault();
  const email = $('#wait-email'); email.value = email.value.trim();
  if (!waitForm.reportValidity()) return;
  const status = $('.form-status', waitForm);
  if (!waitlistLive) {
    status.textContent = 'Your details passed validation. This is a preview: you have not joined a waitlist and no email has been saved.';
    return;
  }
  const button = $('button[type="submit"]', waitForm);
  button.disabled = true; waitForm.setAttribute('aria-busy', 'true');
  status.textContent = 'Submitting your request…';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const data = new FormData(waitForm);
    const endpoint = WAITLIST.provider === 'netlify' ? '/' : WAITLIST.endpoint;
    const response = await fetch(endpoint, {
      method: 'POST', signal: controller.signal,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
      body: new URLSearchParams(data).toString()
    });
    if (!response.ok) throw new Error('Submission failed');
    if (WAITLIST.provider === 'formspree') {
      const result = await response.json();
      if (!result.ok) throw new Error('Submission rejected');
    }
    status.textContent = 'Thanks! Your launch notification request has been received.';
    waitForm.reset();
  } catch (_) {
    status.textContent = 'We couldn’t confirm your submission. Please try again later. Your details remain in the form.';
  } finally {
    clearTimeout(timeout); button.disabled = false; waitForm.removeAttribute('aria-busy');
  }
});
$('#contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  $$('input, textarea', form).forEach(field => { field.value = field.value.trim(); });
  if (!form.reportValidity()) return;
  // Connect Formspree or EmailJS here. Show a sent message ONLY after a
  // successful service response; never expose private service credentials.
  $('.form-status', form).textContent = 'Message validated successfully. Demo only: nothing has been sent. Connect a form service to accept inquiries.';
});

// Enable submission only after the handlers have been installed.
$$('button[type="submit"]').forEach(button => { button.disabled = false; });
