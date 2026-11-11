'use strict';
document.documentElement.classList.add('js');
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const menu = $('.menu-toggle');
const navigation = $('#navigation');
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Ouvrir le menu');
  navigation.classList.remove('open');
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  navigation.classList.toggle('open', open);
});
$$('a', navigation).forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu(); menu.focus();
  }
});
document.addEventListener('click', event => {
  if (!navigation.contains(event.target) && !menu.contains(event.target)) closeMenu();
});
window.matchMedia('(min-width: 851px)').addEventListener('change', closeMenu);
const revealElements = $$('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.08 });
  revealElements.forEach(element => observer.observe(element));
} else revealElements.forEach(element => element.classList.add('in-view'));
const sections = $$('main > section[id]');
let ticking = false;
function updateScroll() {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  $('.scroll-progress').style.width = `${available > 0 ? window.scrollY / available * 100 : 0}%`;
  $('.back-top').classList.toggle('visible', window.scrollY > 500);
  let current = sections[0].id;
  for (const section of sections) if (section.getBoundingClientRect().top <= 150) current = section.id;
  $$('a', navigation).forEach(link => {
    const active = link.hash === `#${current}`;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(updateScroll); ticking = true; }
}, { passive: true });
window.addEventListener('resize', updateScroll);
updateScroll();
$('#year').textContent = new Date().getFullYear();
const dialog = $('#detail-dialog');
function showDetail(kicker, title, paragraphs, bullets = []) {
  $('#dialog-kicker').textContent = kicker;
  $('#dialog-title').textContent = title;
  const body = $('#dialog-body');
  body.replaceChildren();
  paragraphs.forEach(text => { const p = document.createElement('p'); p.textContent = text; body.append(p); });
  if (bullets.length) {
    const list = document.createElement('ul');
    bullets.forEach(text => { const item = document.createElement('li'); item.textContent = text; list.append(item); });
    body.append(list);
  }
  dialog.showModal();
}
$('.dialog-close').addEventListener('click', () => dialog.close());
$('.dialog-done').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) {
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
} });
$('[data-info="cv"]').addEventListener('click', () => showDetail('DOCUMENT À VENIR', 'Mon CV, bientôt ici.', ['Le CV de Mahamadou Traoré n’a pas encore été fourni. Aucun document fictif n’est proposé au téléchargement.', 'Dès réception du document validé, ce bouton permettra de consulter le CV au format PDF.']));
$$('[data-social]').forEach(button => button.addEventListener('click', () => showDetail('COORDONNÉES À COMPLÉTER', `${button.dataset.social} — restons connectés.`, [`Le profil ${button.dataset.social} de Mahamadou Traoré n’a pas encore été renseigné. Aucun lien fictif n’est proposé.`, 'Vous pouvez préparer votre message dans la section Contact.'])));
const projects = {
  budget: { title: 'Suivi budgétaire étudiant', description: 'Exemple de projet : concevoir un suivi mensuel des recettes et des dépenses d’un étudiant. Il s’agit d’une piste de travail, pas d’un projet déjà réalisé.', goals: ['Classer les opérations par catégorie.', 'Comparer le budget prévisionnel aux dépenses réelles.', 'Présenter une synthèse mensuelle et identifier les écarts.'] },
  analyse: { title: 'Analyser la santé financière d’une entreprise', description: 'Exemple de projet : analyser un jeu de données pédagogique pour comprendre les équilibres financiers d’une entreprise fictive. Aucun résultat professionnel n’est revendiqué.', goals: ['Identifier les principaux postes d’un bilan.', 'Étudier la rentabilité, la liquidité et l’endettement.', 'Rédiger une synthèse compréhensible et documentée.'] },
  excel: { title: 'Un tableau de bord, une vision claire', description: 'Exemple de projet : construire un tableau de bord bureautique à partir de données d’exercice. Les visuels de cette page sont des illustrations, pas des captures d’un livrable existant.', goals: ['Structurer un tableau de données cohérent.', 'Explorer les formules de synthèse et les graphiques.', 'Faciliter la lecture des indicateurs utiles.'] }
};
$$('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projects[button.dataset.project];
  showDetail('EXEMPLE ACADÉMIQUE · NON RÉALISÉ', project.title, [project.description, 'Objectifs possibles :'], project.goals);
}));
$$('[data-filter]').forEach(button => button.addEventListener('click', () => {
  $$('[data-filter]').forEach(item => {
    item.classList.toggle('selected', item === button);
    item.setAttribute('aria-pressed', String(item === button));
  });
  $$('.project-card').forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; });
}));
const form = $('#contact-form');
const fields = ['name', 'email', 'subject', 'message'];
function validateField(id) {
  const field = $(`#${id}`);
  let error = '';
  if (!field.value.trim()) error = 'Ce champ est obligatoire.';
  else if (id === 'email' && !field.validity.valid) error = 'Veuillez saisir une adresse e-mail valide.';
  else if (id === 'message' && field.value.trim().length < 10) error = 'Votre message doit contenir au moins 10 caractères.';
  $(`#${id}-error`).textContent = error;
  field.setAttribute('aria-invalid', String(Boolean(error)));
  field.setAttribute('aria-describedby', `${id}-error`);
  return !error;
}
fields.forEach(id => {
  $(`#${id}`).addEventListener('blur', () => { if ($(`#${id}`).value || form.dataset.attempted) validateField(id); });
  $(`#${id}`).addEventListener('input', () => {
    if ($(`#${id}`).getAttribute('aria-invalid') === 'true') validateField(id);
    $('#form-status').replaceChildren();
  });
});
form.addEventListener('submit', event => {
  event.preventDefault();
  form.dataset.attempted = 'true';
  const results = fields.map(validateField);
  if (results.includes(false)) { $(`#${fields[results.indexOf(false)]}`).focus(); return; }
  const message = `De : ${$('#name').value.trim()}\nE-mail : ${$('#email').value.trim()}\nSujet : ${$('#subject').value}\n\n${$('#message').value.trim()}`;
  const status = $('#form-status');
  status.replaceChildren();
  const text = document.createElement('p');
  text.textContent = 'Votre message est prêt, mais n’a pas été envoyé. Téléchargez votre brouillon pour le conserver, puis envoyez-le à momotraore.off@gmail.com depuis votre messagerie.';
  text.style.marginBottom = '0';
  const download = document.createElement('button');
  download.type = 'button'; download.textContent = 'Télécharger mon brouillon (.txt)';
  download.addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([message], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'message-mahamadou-traore.txt'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  status.append(text, download); status.focus();
});
