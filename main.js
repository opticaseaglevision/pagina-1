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
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const hero = document.querySelector('.hero');
const logoSlot = document.querySelector('.hero-logo-slot');
const floatingLogo = document.querySelector('.hero-floating-logo');
document.body.append(floatingLogo);
floatingLogo.classList.add('logo-positioned');
floatingLogo.addEventListener('click', event => {
 event.preventDefault();
 window.scrollTo({top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth'});
});
let logoFramePending = false;
function positionBrandLogo() {
 logoFramePending = false;
 const home = logoSlot.getBoundingClientRect();
 const mobile = matchMedia('(max-width: 650px)').matches;
 const corner = mobile ? 14 : 20;
 const bubbleSize = mobile ? 66 : 76;
 const start = hero.offsetTop + hero.offsetHeight * .5;
 const duration = hero.offsetHeight * .4;
 let progress = Math.max(0, Math.min(1, (window.scrollY - start) / duration));
 if (reducedMotion.matches) progress = progress >= .5 ? 1 : 0;
 const eased = progress * progress * (3 - 2 * progress);
 const interpolate = (from, to) => from + (to - from) * eased;
 const width = interpolate(home.width, bubbleSize);
 const height = interpolate(home.height, bubbleSize);
 floatingLogo.style.width = `${width}px`;
 floatingLogo.style.height = `${height}px`;
 floatingLogo.style.transform = `translate3d(${interpolate(home.left, corner)}px, ${interpolate(home.top, corner)}px, 0)`;
 floatingLogo.style.borderRadius = `${eased * 50}%`;
 floatingLogo.style.backgroundColor = `rgba(255,255,255,${eased})`;
 floatingLogo.style.boxShadow = `0 ${eased * 5}px ${eased * 25}px rgba(18,51,84,${eased * .18})`;
 floatingLogo.style.padding = `${eased * 7}px`;
 floatingLogo.classList.toggle('logo-is-bubble', progress >= 1);
}
function scheduleBrandLogo() {
 if (!logoFramePending) { logoFramePending = true; requestAnimationFrame(positionBrandLogo); }
}
window.addEventListener('scroll', scheduleBrandLogo, {passive: true});
window.addEventListener('resize', scheduleBrandLogo);
reducedMotion.addEventListener('change', scheduleBrandLogo);
positionBrandLogo();
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

const visionSlider = document.querySelector('#vision-slider');
const comparisonStage = document.querySelector('.comparison-stage');
function updateComparison() {
 const split = Number(visionSlider.value);
 comparisonStage.style.setProperty('--split', `${split}%`);
 const sharp = 100 - split;
 document.querySelector('#vision-output').value = `${sharp}% de vista nítida`;
 visionSlider.setAttribute('aria-valuetext', `${sharp}% de vista nítida`);
}
visionSlider.addEventListener('input', updateComparison);
updateComparison();

const promotions = document.querySelector('.promotions');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
 promotions.classList.add('promo-ready');
 const promoObserver = new IntersectionObserver(entries => {
  if (entries.some(entry => entry.isIntersecting)) { promotions.classList.add('promo-visible'); promoObserver.disconnect(); }
 }, {threshold: .15});
 promoObserver.observe(promotions);
}
