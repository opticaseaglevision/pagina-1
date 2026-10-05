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

const treatments = {
 gold: {title:'GOLD+', kicker:'EL TOQUE DORADO', label:'UN REFLEJO DIFERENTE', description:'Un reflejo dorado sutil para explorar otra faceta de tus lentes. Conoce las características del tratamiento con nuestro equipo.'},
 photo: {title:'Fotocromático', kicker:'LA LUZ CAMBIA. TUS LENTES TAMBIÉN.', label:'DE INTERIOR A EXTERIOR', description:'Explora cómo un lente puede cambiar de tono con la luz. Desliza para ver una representación de la transición.'},
 screen: {title:'Para pantallas', kicker:'TU RUTINA, EN FOCO', label:'UNA MIRADA A TU DÍA DIGITAL', description:'¿Pasas tiempo frente a dispositivos? Conoce las opciones de lentes y tratamientos para tu rutina con asesoría personalizada.'},
 reflection: {title:'Antirreflejo', kicker:'MENOS REFLEJOS EN LA SUPERFICIE', label:'EXPLORA EL CAMBIO DE REFLEJO', description:'Alterna la demostración para observar cómo se representan los reflejos de luz sobre un cristal.'}
};
const exhibit = document.querySelector('.tech-exhibit');
const reflectionToggle = document.querySelector('#reflection-toggle');
document.querySelectorAll('.tech-selectors button').forEach(button => button.addEventListener('click', () => {
 document.querySelectorAll('.tech-selectors button').forEach(b => { const active = b === button; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); });
 const type = button.dataset.treatment;
 const treatment = treatments[type];
 exhibit.dataset.treatment = type;
 exhibit.classList.remove('reflection-treated');
 reflectionToggle.setAttribute('aria-pressed','false');
 reflectionToggle.innerHTML = 'Ver con antirreflejo <span>→</span>';
 document.querySelector('#tech-title').textContent = treatment.title;
 document.querySelector('#tech-kicker').textContent = treatment.kicker;
 document.querySelector('#tech-visual-label').textContent = treatment.label;
 document.querySelector('#tech-description').textContent = treatment.description;
 document.querySelector('#photo-control').hidden = type !== 'photo';
 document.querySelector('#reflection-control').hidden = type !== 'reflection';
}));
const lightLevel = document.querySelector('#light-level');
function updateTint() { exhibit.style.setProperty('--tint', String(Number(lightLevel.value) / 100 * .72)); document.querySelector('#light-output').value = `${lightLevel.value}%`; }
lightLevel.addEventListener('input', updateTint);
updateTint();
reflectionToggle.addEventListener('click', () => {
 const treated = exhibit.classList.toggle('reflection-treated');
 reflectionToggle.setAttribute('aria-pressed', String(treated));
 reflectionToggle.innerHTML = treated ? 'Ver sin antirreflejo <span>→</span>' : 'Ver con antirreflejo <span>→</span>';
});

const catalogDialog = document.querySelector('#catalog-dialog');
const catalogImage = document.querySelector('#catalog-image');
const catalogAngle = document.querySelector('#catalog-angle');
document.querySelectorAll('.catalog-card').forEach(card => card.addEventListener('click', () => {
 document.querySelector('#catalog-title').textContent = card.dataset.name;
 document.querySelector('#catalog-description').textContent = card.dataset.description;
 catalogImage.src = card.dataset.image;
 catalogImage.alt = `Ilustración de referencia para ${card.dataset.name}`;
 catalogAngle.value = '0';
 catalogImage.style.transform = 'rotateY(0deg)';
 catalogDialog.showModal();
 document.body.classList.add('modal-open');
}));
catalogAngle.addEventListener('input', () => { catalogImage.style.transform = `rotateY(${catalogAngle.value}deg)`; });
document.querySelector('.dialog-close').addEventListener('click', () => catalogDialog.close());
catalogDialog.addEventListener('click', e => { if (e.target === catalogDialog) { const rect = catalogDialog.getBoundingClientRect(); if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) catalogDialog.close(); } });
catalogDialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
