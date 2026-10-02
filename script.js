document.documentElement.classList.add('js'); 
const $ = (s, all = false) => (all ? [...document.querySelectorAll(s)] : document.querySelector(s));

// 1. Mobile menu: toggle the "open" class on the nav links
const burger = $('#burger'), menu = $('#menu');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
menu.addEventListener('click', e => { if (e.target.tagName === 'A') menu.classList.remove('open'); });

// 2. On scroll: blur the navbar, fill the progress bar, show back-to-top
const nav = $('#nav'), bar = $('#progress'), topBtn = $('#top');
addEventListener('scroll', () => {
  const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
  nav.classList.toggle('scrolled', y > 20);
  bar.style.width = (y / max) * 100 + '%';
  topBtn.classList.toggle('show', y > 600);
}, { passive: true });

// 3. Fade-in sections when they enter the screen (IntersectionObserver)
const reveal = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); reveal.unobserve(en.target); } });
}, { threshold: 0.12 });
$('.reveal', true).forEach(el => reveal.observe(el));

// 4. Highlight the nav link of the section currently on screen
const links = $('#menu a', true);
const spy = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) links.forEach(a => a.classList.toggle('active', a.hash === '#' + en.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
$('main section[id]', true).forEach(s => spy.observe(s));

// 5. Project filter: hide cards whose data-cat doesn't include the chosen filter
$('.filters button', true).forEach(btn => btn.addEventListener('click', () => {
  $('.filters button', true).forEach(b => b.classList.toggle('active', b === btn));
  const f = btn.dataset.filter;
  $('.project', true).forEach(card => {
    const show = f === 'all' || card.dataset.cat.split(' ').includes(f);
    if (show) { card.classList.remove('gone'); requestAnimationFrame(() => card.classList.remove('hide')); }
    else { card.classList.add('hide'); setTimeout(() => card.classList.contains('hide') && card.classList.add('gone'), 350); }
  });
}));

// 6. Mouse-follow glow (skipped on touch devices and for reduced motion)
const glow = $('#glow');
if (matchMedia('(hover: hover)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  addEventListener('mousemove', e => { glow.style.transform = `translate(${e.clientX - 210}px, ${e.clientY - 210}px)`; });
}

// 7. Contact form: front-end only. It does NOT send email yet.
$('#form').addEventListener('submit', e => {
  e.preventDefault();
  $('#formNote').textContent = 'This form is not connected to an email service yet. Please use the email link above.';
});

// 8. Footer year
$('#year').textContent = new Date().getFullYear();

// 9. Typing effect in the hero (shows the first word only if reduced motion is on)
const words = ['Software Development', 'Artificial Intelligence', 'Web Technologies', 'Creative Design'];
const typed = $('#typed');
if (matchMedia('(prefers-reduced-motion: reduce)').matches) { typed.textContent = words[0]; }
else {
  let w = 0, c = 0, del = false;
  (function tick() {
    typed.textContent = words[w].slice(0, c);
    if (!del && c === words[w].length) { del = true; return setTimeout(tick, 1400); }
    if (del && c === 0) { del = false; w = (w + 1) % words.length; }
    c += del ? -1 : 1;
    setTimeout(tick, del ? 35 : 70);
  })();
}
