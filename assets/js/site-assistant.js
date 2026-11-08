(function () {
  'use strict';
  var toggle = document.getElementById('guide-toggle');
  var panel = document.getElementById('site-guide');
  var input = document.getElementById('guide-input');
  var log = document.getElementById('guide-log');
  var choices = document.getElementById('guide-choices');
  var form = document.getElementById('guide-form');
  if (!toggle || !panel) return;
  var context = null;
  var requests = [];
  var actions = {
    help: { label: 'Comment utiliser le site ?', question: 'Comment utiliser le site ?' },
    services: { label: 'Tous les services', target: 'services' },
    whatsapp: { label: 'Transmettre ma demande sur WhatsApp' },
    phone: { label: 'Téléphone et Wi-Fi', target: 'services', tab: 't-assist' },
    web: { label: 'Créer un site internet', target: 'services', tab: 't-web' },
    maintenance: { label: 'Entretien et caméras', target: 'services', tab: 't-maint' },
    social: { label: 'Réseaux sociaux', target: 'services', tab: 't-social' },
    diagnostic: { label: 'Vérifier mon téléphone', target: 'demarrer' },
    contact: { label: 'Contacter Caly Bamba', target: 'aide' }
  };
  document.querySelectorAll('.svc').forEach(function (card) {
    actions[card.id] = { label: 'Voir : ' + card.querySelector('h3').textContent, target: card.id, tab: card.closest('[role=tabpanel]').getAttribute('aria-labelledby') };
  });
  var homeChoices = ['help', 'phone', 'web', 'maintenance', 'social', 'diagnostic', 'contact'];
  function message(text, user) {
    var item = document.createElement('p');
    item.className = 'guide-message' + (user ? ' guide-user' : '');
    item.textContent = text;
    log.appendChild(item);
    while (log.children.length > 30) log.firstElementChild.remove();
    log.scrollTop = log.scrollHeight;
  }
  function showChoices(keys) {
    choices.replaceChildren();
    keys.forEach(function (key) {
      var button = document.createElement('button');
      button.type = 'button';
      button.textContent = actions[key].label + ' →';
      button.dataset.destination = key;
      choices.appendChild(button);
    });
  }
  function open(value) {
    panel.hidden = !value;
    toggle.setAttribute('aria-expanded', String(value));
    toggle.setAttribute('aria-label', value ? 'Réduire l’assistant Caly Bamba' : 'Ouvrir l’assistant Caly Bamba');
    toggle.querySelector('.guide-button-label').textContent = value ? 'Réduire le guide' : 'Besoin d’aide ?';
    if (value) input.focus({ preventScroll: true });
    else toggle.focus({ preventScroll: true });
  }
  toggle.addEventListener('click', function () { open(panel.hidden); });
  document.getElementById('guide-close').addEventListener('click', function () { open(false); });
  panel.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') { event.preventDefault(); open(false); }
  });
  choices.addEventListener('click', function (event) {
    var button = event.target.closest('[data-destination]');
    if (!button) return;
    var action = actions[button.dataset.destination];
    if (action.question) {
      message(action.question, true);
      var helpReply = window.CalyGuide.reply(action.question, context);
      message(helpReply.text, false); showChoices(helpReply.actions);
      return;
    }
    if (button.dataset.destination === 'whatsapp') {
      var summary = requests.slice(-3).join(' / ');
      window.open('https://wa.me/22377617957?text=' + encodeURIComponent('Bonjour Caly Bamba, je souhaite être accompagné.' + (summary ? ' Ma demande : ' + summary : '')), '_blank', 'noopener,noreferrer');
      return;
    }
    if (action.tab) document.getElementById(action.tab).click();
    open(false);
    var target = document.getElementById(action.target);
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    var serviceHeading = target.querySelector('h3');
    if (serviceHeading) serviceHeading.setAttribute('tabindex', '-1');
    var focusTarget = serviceHeading || (action.tab ? document.getElementById(action.tab) : action.target === 'demarrer' ? document.getElementById('pb') : target.querySelector('a, button'));
    if (focusTarget) focusTarget.focus({ preventScroll: true });
  });
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    message(text, true);
    var result = window.CalyGuide.reply(text, context);
    if (result.context) context = result.context;
    // Keep only non-sensitive requests, in memory; nothing is stored or sent automatically.
    if (!result.sensitive && !/[0-9]{4,}|@/.test(text)) requests.push(text.slice(0, 200));
    if (requests.length > 3) requests.shift();
    message(result.text, false);
    showChoices(result.actions);
  });
  document.getElementById('guide-reset').addEventListener('click', function () {
    context = null; requests = []; log.replaceChildren(); input.value = '';
    message('Nouvelle demande. Comment puis-je vous orienter ?', false);
    showChoices(homeChoices); input.focus();
  });
  message(window.CalyGuide.instructions.welcome, false);
  showChoices(homeChoices);
})();
