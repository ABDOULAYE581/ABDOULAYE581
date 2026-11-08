/* Local navigation knowledge base. No external requests or generated claims. */
(function (root) {
  'use strict';
  // Site instructions used by the local guide and available for a future server integration.
  var instructions = {
    name: 'Assistant Caly Bamba',
    role: 'Aider les visiteurs à comprendre les services et à consulter le site.',
    welcome: 'Bonjour ! Je suis l’assistant de navigation Caly Bamba. Je peux expliquer les services, vous montrer comment utiliser le diagnostic ou vous orienter vers notre équipe. Que souhaitez-vous faire ?',
    rules: [
      'Répondre en français simple, avec un ton courtois et des phrases courtes.',
      'Se présenter comme un guide automatique local, sans prétendre être une personne ou une IA connectée.',
      'Proposer le service adapté et une prochaine action claire, sans insister pour vendre.',
      'Ne jamais inventer un tarif, un délai, une adresse, un horaire ou une disponibilité.',
      'Ne jamais demander un mot de passe, un code PIN, un code SMS ou des coordonnées bancaires.',
      'Ne garantir ni réparation, ni récupération de compte, ni visibilité, ni revenus.',
      'Orienter vers les procédures officielles pour les comptes appartenant au visiteur.',
      'Ouvrir WhatsApp uniquement après un clic explicite ; le visiteur vérifie puis envoie son message.',
      'En cas de demande imprécise, demander quel service intéresse le visiteur.',
      'Limiter les réponses aux informations publiées sur le site.'
    ]
  };
  var siteHelp = [
    [/comment.{0,30}(utiliser|consulter|naviguer)|comment.{0,15}(marche|fonctionne).{0,15}(site|ici)|mode d emploi|aide.{0,10}navigation/,
      'Pour consulter le site : 1. Ouvrez « Services ». 2. Choisissez une des quatre catégories. 3. Lisez la fiche qui correspond à votre besoin. Son bouton ouvre WhatsApp pour en discuter. Pour un problème de téléphone, vous pouvez aussi commencer les vérifications guidées.', ['services', 'diagnostic', 'contact']],
    [/comment.{0,25}(diagnostic|verifi)|lancer.{0,15}diagnostic|utiliser.{0,15}diagnostic/,
      'Pour commencer : 1. Choisissez Android ou iPhone. 2. Décrivez le problème, ou choisissez un problème fréquent. 3. Appuyez sur « Voir les étapes à suivre ». Suivez les étapes ; si cela ne suffit pas, utilisez le bouton pour contacter l’équipe. Ce parcours est un guide local, pas une analyse automatique de votre appareil.', ['diagnostic', 'contact']],
    [/quels?.{0,20}services|vos services|que proposez|que faites|present.{0,15}service/,
      'Caly Bamba propose quatre domaines : téléphone et Wi-Fi ; création de sites internet ; entretien des appareils et installation de caméras ; accompagnement sur les réseaux sociaux. Choisissez une catégorie pour voir les prestations.', ['phone', 'web', 'maintenance', 'social']],
    [/comment.{0,25}(commander|reserver|demander|rendez|devis)|prendre.{0,15}rendez|etape.{0,15}commande/,
      'Choisissez un service puis cliquez sur son bouton. WhatsApp s’ouvre avec une demande préremplie : vérifiez-la avant de l’envoyer. Vous pouvez aussi appeler le +223 77 61 79 57. Aucun rendez-vous ni achat n’est confirmé automatiquement sur ce site.', ['services', 'whatsapp', 'contact']],
    [/qui (es|etes)|\b(?:robot|chatbot)\b|intelligence artificielle|\bia\b|tes instructions|ton role/,
      'Je suis le guide automatique de Caly Bamba. Mon rôle est d’expliquer les services et de vous orienter dans le site. Je fonctionne ici avec des réponses locales, sans IA connectée. Je ne peux ni accéder à votre appareil, ni intervenir sur vos comptes, ni confirmer un devis.', ['services', 'contact']],
    [/confidential|vie privee|enregistr|mes messages|mes informations/,
      'Ce guide traite vos messages dans votre navigateur et ne conserve pas la conversation après rechargement. Si vous cliquez sur « Transmettre ma demande sur WhatsApp », une partie de vos derniers messages peut être préremplie : vérifiez-la avant envoi. Ne saisissez aucun mot de passe ni code personnel.', ['contact']],
    [/garanti|certain|assure.{0,10}resultat/,
      'Le résultat dépend du problème et, pour les comptes et les revenus, des règles des plateformes. Le site ne garantit pas de réparation, de récupération de compte ni de revenus. Discutez de votre situation avec l’équipe avant de choisir une prestation.', ['contact']]
  ];
  var topics = [
    ['camera', /camera|surveillance|videosurveillance/, 'Nous vous accompagnons pour choisir et installer des caméras pour votre maison ou votre boutique. Le visionnage à distance demande une connexion internet.', 'svc-maint-3'],
    ['shop', /boutique|ecommerce|e-commerce|vendre|vente en ligne/, 'Pour vendre vos produits, la boutique en ligne peut inclure un catalogue, des commandes et, selon vos besoins, un paiement en ligne. Quels produits souhaitez-vous vendre ?', 'svc-web-2'],
    ['hosting', /heberg|domaine|mettre.{0,15}en ligne/, 'Vous avez déjà un site ? Nous pouvons vous aider avec son adresse, son hébergement et sa mise en ligne. Indiquez ce qui est déjà prêt.', 'svc-web-4'],
    ['app', /application web|outil de gestion|tableau de bord/, 'Un outil sur mesure peut vous aider à suivre vos clients, vos commandes ou votre activité. Quelle tâche souhaitez-vous simplifier ?', 'svc-web-3'],
    ['webcare', /(?:site|web).{0,25}(?:bug|erreur|mise a jour|modifier|maintenance)|(?:modifier|maintenance).{0,25}(?:site|web)/, 'Nous pouvons corriger un problème sur votre site ou actualiser ses textes et ses images. Quelle modification souhaitez-vous faire ?', 'svc-maint-2'],
    ['recovery', /pirat|recuper|perdu.{0,15}compte|acces.{0,15}compte|mot de passe oublie/, 'Pour un compte perdu ou piraté, nous suivons les démarches officielles de la plateforme. Le résultat n’est pas garanti. De quelle application s’agit-il ? Ne partagez aucun mot de passe ou code SMS.', 'svc-social-1'],
    ['income', /monetis|revenu|gagner.{0,15}argent/, 'Nous vérifions les conditions des programmes de revenus de votre plateforme. L’accès dépend notamment de ses règles ; aucun revenu n’est garanti. Quelle plateforme utilisez-vous ?', 'svc-social-3'],
    ['growth', /boost|abonne|visibil|promotion/, 'Nous vous aidons à améliorer votre page et à préparer des promotions adaptées à votre public, sans faux abonnés. Quelle activité souhaitez-vous faire connaître ?', 'svc-social-2'],
    ['management', /gestion.{0,15}(?:page|reseaux)|publication|gerer.{0,15}page/, 'Nous pouvons vous aider à préparer vos publications et à gérer les messages de votre page. Sur quel réseau êtes-vous présent ?', 'svc-social-4'],
    ['wifi', /wi[ -]?fi|routeur|connexion internet/, 'Pour le Wi-Fi, nous aidons à vérifier les appareils connectés et les réglages de sécurité du routeur. Votre besoin concerne-t-il la protection du réseau ou une panne de connexion ?', 'svc-assist-4'],
    ['data', /sauvegard|donnee|photos.{0,10}protect/, 'Nous vous aidons à sauvegarder vos photos et vos contacts et à mieux protéger vos comptes. Quelles informations souhaitez-vous sauvegarder ?', 'svc-assist-5'],
    ['phone', /telephone|iphone|android|batterie|lent|ecran|stockage|charge/, 'Commencez par les vérifications guidées pour votre téléphone. Vous pourrez choisir Android ou iPhone et décrire ce qui ne fonctionne pas.', 'diagnostic'],
    ['web', /\bsite\b|\bweb\b/, 'Un site de présentation permet de montrer votre activité et vos coordonnées. Si vous souhaitez vendre des produits, une boutique sera plus adaptée. Quel est votre projet ?', 'svc-web-1'],
    ['social', /facebook|instagram|tiktok|reseaux|compte|\bpage\b/, 'Souhaitez-vous retrouver un compte, développer votre visibilité, gérer vos publications ou vérifier les possibilités de revenus ?', 'social'],
    ['maintenance', /maintenance|entretien|repar|ordinateur/, 'Nous proposons l’entretien des appareils, la maintenance des sites et l’installation de caméras. Quel équipement ou quel site souhaitez-vous faire vérifier ?', 'maintenance']
  ];
  function normalize(text) { return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[’']/g, ' '); }
  function reply(text, context) {
    var value = normalize(text);
    for (var h = 0; h < siteHelp.length; h++) {
      if (siteHelp[h][0].test(value)) return { text: siteHelp[h][1], actions: siteHelp[h][2] };
    }
    if (/(mot de passe|code sms|code pin|code de validation)/.test(value) && /donne|envoi|partag|voici/.test(value)) return { text: 'Pour votre sécurité, ne partagez jamais de mot de passe, de code PIN ou de code SMS ici ni avec un conseiller. Contactez l’équipe si vous pensez avoir communiqué un code à un tiers.', actions: ['contact'], sensitive: true };
    if (/\b(prix|tarif|devis|cout|payer|gratuit)\b/.test(value)) return { text: 'Le prix dépend de votre besoin' + (context ? ' et du service que nous venons d’évoquer' : '') + '. Aucune grille tarifaire n’est publiée ici. Vous pouvez envoyer votre demande à Caly Bamba pour obtenir un devis.', actions: context ? [context.target, 'whatsapp', 'contact'] : ['whatsapp', 'contact'] };
    if (/horaire|adresse|localisation|ouvert/.test(value)) return { text: 'Les horaires et l’adresse ne sont pas précisés sur le site. Caly Bamba pourra vous les confirmer au +223 77 61 79 57 ou sur WhatsApp.', actions: ['contact', 'whatsapp'] };
    if (/\b(contact|whatsapp|appeler|numero|humain|conseiller)\b/.test(value)) return { text: 'Vous pouvez appeler le +223 77 61 79 57 ou ouvrir WhatsApp avec un résumé de votre demande. Le message reste à vérifier et à envoyer par vous-même.', actions: ['whatsapp', 'contact'] };
    if (/\b(merci|super|parfait)\b/.test(value)) return { text: 'Avec plaisir. Souhaitez-vous consulter le service ou discuter de votre besoin avec Caly Bamba ?', actions: context ? [context.target, 'whatsapp'] : ['services', 'contact'] };
    if (/^(bonjour|salut|bonsoir|hello)[ !.]*$/.test(value)) return { text: 'Bonjour ! Quel est votre besoin aujourd’hui ? Je peux vous orienter vers un service, les vérifications téléphoniques ou un contact direct.', actions: ['phone', 'web', 'maintenance', 'social'] };
    for (var i = 0; i < topics.length; i++) {
      var topic = topics[i];
      if (topic[1].test(value)) {
        if (context && context.id === 'recovery' && topic[0] === 'social') return { text: 'Pour ce compte, utilisez uniquement la procédure officielle de récupération de la plateforme. Caly Bamba peut vous accompagner dans ces étapes sans demander votre mot de passe.', actions: [context.target, 'whatsapp'], context: context };
        return { text: topic[2], actions: [topic[3], 'whatsapp'], context: { id: topic[0], target: topic[3] } };
      }
    }
    if (context) return { text: 'Merci pour ces précisions. Je peux vous montrer le service lié à votre demande ou vous aider à la transmettre à Caly Bamba. Ce guide ne peut pas établir un devis ni réaliser une intervention.', actions: [context.target, 'whatsapp', 'services'] };
    return { text: 'Pour bien vous orienter, votre demande concerne-t-elle un téléphone, un site internet, des caméras ou vos réseaux sociaux ? Choisissez une rubrique ci-dessous.', actions: ['phone', 'web', 'maintenance', 'social'] };
  }
  root.CalyGuide = { reply: reply, instructions: instructions };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.CalyGuide;
})(typeof window !== 'undefined' ? window : globalThis);
