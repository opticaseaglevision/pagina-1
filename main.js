const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');
menu.addEventListener('click', () => {
 const open = nav.classList.toggle('open');
 menu.setAttribute('aria-expanded', String(open));
 menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
 nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Abrir menú');
}));
const stage = document.querySelector('.glasses-stage');
const art = document.querySelector('.hero-art');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let pointerX = 0;
let pointerY = 0;
let scheduled = false;
const hero = document.querySelector('.hero');
function renderPerspective() {
 scheduled = false;
 const mobile = matchMedia('(max-width: 650px)').matches;
 const progress = Math.max(0, Math.min(1, -hero.getBoundingClientRect().top / hero.offsetHeight));
 const rotation = reducedMotion.matches ? -12 : -12 + progress * (mobile ? 3 : 10);
 const zoom = reducedMotion.matches || mobile ? 1 : 1 + progress * .06;
 stage.style.transform = `rotate(${rotation}deg) rotateY(${pointerX}deg) rotateX(${pointerY}deg) scale(${zoom})`;
}
function schedulePerspective() {
 if (!scheduled) { scheduled = true; requestAnimationFrame(renderPerspective); }
}
art.addEventListener('pointermove', e => {
 if (reducedMotion.matches || e.pointerType === 'touch') return;
 const rect = art.getBoundingClientRect();
 pointerX = ((e.clientX - rect.left) / rect.width - .5) * 16;
 pointerY = -((e.clientY - rect.top) / rect.height - .5) * 12;
 schedulePerspective();
});
art.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; schedulePerspective(); });
window.addEventListener('scroll', schedulePerspective, {passive: true});
window.addEventListener('resize', schedulePerspective);
reducedMotion.addEventListener('change', () => { pointerX = 0; pointerY = 0; schedulePerspective(); });
renderPerspective();
const colors = {turquoise: ['none', 'Turquesa', '01'], blue: ['hue-rotate(30deg) saturate(1.5)', 'Azul', '02'], fuchsia: ['hue-rotate(155deg) saturate(1.5)', 'Fucsia', '03']};
document.querySelectorAll('.swatch').forEach(button => button.addEventListener('click', () => {
 document.querySelectorAll('.swatch').forEach(b => {b.classList.remove('active'); b.setAttribute('aria-pressed', 'false');});
 button.classList.add('active'); button.setAttribute('aria-pressed', 'true');
 const [filter, label, index] = colors[button.dataset.color];
 document.querySelector('.hero-glasses').style.filter = filter;
 document.querySelector('.hero-glasses').alt = `Montura ${label.toLowerCase()} con cristales transparentes`;
 document.querySelector('#color-name').textContent = label;
 document.querySelector('.art-corner').textContent = `${index} / 03`;
}));
document.querySelectorAll('.filters button').forEach(button => button.addEventListener('click', () => {
 document.querySelectorAll('.filters button').forEach(b => {b.classList.remove('selected'); b.setAttribute('aria-pressed', 'false');});
 button.classList.add('selected'); button.setAttribute('aria-pressed', 'true');
 document.querySelectorAll('.product').forEach(card => card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter);
}));
document.querySelector('#year').textContent = new Date().getFullYear();
