'use strict';
const root = document.documentElement;
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
let motionPaused = reducedMotion.matches;
let savedTheme;
try { savedTheme = localStorage.getItem('boltcharge-theme'); } catch (_) { /* Storage may be blocked. */ }
// Holo Light is the default; keep any previously selected Solar Flare preference.
const initialTheme = savedTheme === 'solar' ? 'solar' : 'light';
function setTheme(theme) {
  root.dataset.theme = theme;
  $('#theme-toggle').setAttribute('aria-checked', String(theme === 'solar'));
  $('#theme-toggle').title = theme === 'solar' ? 'Switch to light theme' : 'Switch to dark theme';
  $('#theme-toggle').setAttribute('aria-label', theme === 'solar' ? 'Enable light theme' : 'Enable dark theme');
  $('meta[name="theme-color"]').content = getComputedStyle(root).getPropertyValue('--bg').trim();
}
setTheme(initialTheme);
$('#theme-toggle').addEventListener('click', () => {
  const theme = root.dataset.theme === 'solar' ? 'light' : 'solar';
  setTheme(theme);
  try { localStorage.setItem('boltcharge-theme', theme); } catch (_) { /* Theme still works. */ }
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

// Reveal sections while retaining full content for browsers without animation support.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('pending');
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
reducedMotion.addEventListener('change', () => { motionPaused = reducedMotion.matches; syncMotion(); });
document.addEventListener('visibilitychange', syncMotion);
syncMotion();

// Both forms send real submissions to Formspree on localhost and when deployed.
// The HTML action/method are kept as a native fallback when JavaScript is disabled.
// On file:// URLs, native POST avoids browsers blocking cross-origin fetch from null origins.
function formErrorMessage(result, fallback) {
  const messages = Array.isArray(result?.errors)
    ? result.errors.map(item => item?.message).filter(Boolean)
    : [];
  return messages.length ? messages.join(' ') : fallback;
}

function wireSubmission(formId, pendingText, successText) {
  const form = $(formId);
  const button = $('button[type="submit"]', form);
  const status = $('.form-status', form);

  // Clear obsolete errors when the visitor edits a field.
  form.addEventListener('input', () => {
    if (form.getAttribute('aria-busy') === 'true') return;
    if (status.classList.contains('error')) {
      status.classList.remove('error');
      status.textContent = '';
    }
  });

  form.addEventListener('submit', async event => {
    // Formspree's own hosted confirmation page handles local file:// previews.
    if (location.protocol === 'file:') return;
    event.preventDefault();
    if (form.getAttribute('aria-busy') === 'true') return;

    $$('input:not([type="hidden"]):not([type="checkbox"]), textarea', form)
      .forEach(field => { field.value = field.value.trim(); });
    if (!form.reportValidity()) return;

    button.disabled = true;
    form.setAttribute('aria-busy', 'true');
    status.classList.remove('error', 'success');
    status.textContent = pendingText;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
        signal: controller.signal
      });
      const result = await response.json().catch(() => null);
      // Show success only when Formspree explicitly confirms acceptance.
      // A captive portal or an HTML error page can return HTTP 200.
      if (!response.ok || result?.ok !== true) {
        throw new Error(formErrorMessage(result, 'The submission was not confirmed. Please try again.'));
      }
      status.classList.add('success');
      status.textContent = successText;
      form.reset();
    } catch (error) {
      status.classList.add('error');
      status.textContent = error?.name === 'AbortError'
        ? 'The request timed out. Please check your connection and try again.'
        : error?.message === 'Failed to fetch' || error instanceof TypeError
          ? 'Could not connect to the submission service. Please try again.'
          : error?.message || 'Something went wrong. Please try again.';
    } finally {
      clearTimeout(timeout);
      button.disabled = false;
      form.removeAttribute('aria-busy');
    }
  });
}

wireSubmission('#waitlist-form', 'Joining the waitlist…', 'You’re on the list! We’ll email you with BoltCharge launch news.');
wireSubmission('#contact-form', 'Sending your message…', 'Message sent. Thanks for reaching out!');

// Jump from any waitlist link straight to the signup input (and keep the URL anchor).
$$('a[href="#waitlist"]').forEach(link => link.addEventListener('click', () => {
  setTimeout(() => $('#wait-email').focus({ preventScroll: true }), 200);
}));
