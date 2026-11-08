const assert = require('node:assert/strict');
const { reply } = require('../assets/js/guide-engine.js');
const cases = [
  ['Je veux une boutique en ligne', 'svc-web-2'],
  ['Installer des caméras', 'svc-maint-3'],
  ['Mon compte a été piraté', 'svc-social-1'],
  ['Mon téléphone est lent', 'diagnostic'],
  ['Modifier mon site web', 'svc-maint-2'],
  ['Monétisation TikTok', 'svc-social-3'],
  ['Sécuriser mon Wi-Fi', 'svc-assist-4'],
  ['Hébergement de site', 'svc-web-4']
];
cases.forEach(([text, target]) => assert.equal(reply(text).actions[0], target, text));
const shop = reply('Créer une boutique');
assert.equal(reply('Quel prix ?', shop.context).actions[0], 'svc-web-2');
assert.equal(reply('Des habits et des sacs', shop.context).actions[0], 'svc-web-2');
assert.equal(reply('Voici mon mot de passe').sensitive, true);
assert.match(reply('Quels horaires ?').text, /ne sont pas précisés/);
assert.equal(reply('???').actions.length, 4);
const recovery = reply('Compte piraté');
assert.equal(reply('Facebook', recovery.context).actions[0], 'svc-social-1');
console.log('14 vérifications du moteur du guide réussies.');
assert.equal(reply('Comment utiliser le site ?').actions[0], 'services');
assert.equal(reply('Comment lancer le diagnostic ?').actions[0], 'diagnostic');
assert.match(reply('Comment demander un devis ?').text, /Aucun rendez-vous/);
assert.match(reply('Qui es-tu ?').text, /sans IA connectée/);
assert.match(reply('Mes messages sont-ils enregistrés ?').text, /navigateur/);
assert.equal(reply('Quels sont vos services ?').actions.length, 4);
assert.match(reply('Le résultat est garanti ?').text, /ne garantit pas/);
assert.equal(require('../assets/js/guide-engine.js').instructions.rules.length, 10);
console.log('8 vérifications des consignes du site réussies.');
