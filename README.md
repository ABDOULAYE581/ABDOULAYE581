# Portfolio — Mahamadou Traoré

Site statique responsive en français, sans framework, dépendance distante ou étape de compilation. HTML5, CSS3 et JavaScript natif. Tous les fichiers sont à la racine du dépôt pour faciliter un hébergement statique.

## Lancer

Depuis la racine :

```sh
python3 -m http.server 8000 --bind 0.0.0.0
```

Ouvrir http://localhost:8000. Le site peut aussi être ouvert directement avec `index.html` (un serveur local est préférable). Publier les fichiers sur un hébergement statique, notamment GitHub Pages. Aucun secret ni serveur applicatif nécessaire.

## Structure

- `index.html` : structure sémantique, contenu, illustrations HTML/CSS et bibliothèque SVG locale.
- `css/style.css` : identité visuelle, adaptation aux écrans et réduction des animations.
- `js/script.js` : navigation, filtres, modales, validation, brouillon téléchargeable, progression et année.
- `assets/images/` : portraits recadrés depuis la référence fournie.
- `assets/icons/favicon.svg` : favicon MT.
- `assets/documents/` : emplacement réservé au futur CV validé ; aucun PDF fictif.

## Limites et contenu à valider avant publication définitive

**Photographie :** la seule pièce jointe est une maquette de 720 × 1080 px. Aucune photographie originale indépendante n’a été fournie. Les portraits ont été extraits de cette image, sans génération IA, retouche du visage, des vêtements ou de la morphologie. Ces recadrages basse définition ne remplacent pas l’original haute définition demandé. Remplacer `portrait-hero.png` et `portrait-mahamadou.jpg` par les originaux autorisés, mettre à jour les attributs de dimensions et de texte alternatif (`alt`), puis ajuster `object-position` et la présentation CSS. Le portrait de l’accueil conserve le fond de la maquette : aucun détourage synthétique.

**Informations :** le propriétaire confirme son nom, son statut de licencié en comptabilité et finance, son activité de développeur et sa maîtrise de HTML, CSS, Java et Python. Java n’est pas assimilé à JavaScript. Aucun établissement, niveau de maîtrise, numéro, e-mail ou profil social non confirmé n’est affirmé. Les textes d’ambition sont rédactionnels et restent à valider. Les domaines, services possibles et niveaux sont explicitement indicatifs. Les projets sont des exemples non réalisés ; les illustrations sont entièrement construites en HTML/CSS.

**CV :** le bouton ouvre une information honnête. Lorsqu’un CV validé est disponible, déposer `assets/documents/cv.pdf`, remplacer le bouton `data-info="cv"` par un lien vers ce PDF et retirer le gestionnaire correspondant dans `script.js`.

**Contacts :** l’adresse e-mail, le téléphone, WhatsApp, Facebook et TikTok ont été confirmés par le propriétaire et sont intégrés au site. Seul le profil LinkedIn reste à renseigner. Pour les liens externes ouverts dans un nouvel onglet, conserver `rel="noopener noreferrer"`.

**Formulaire :** validation locale (nom, e-mail, sujet, message de 10 caractères minimum). Il ne transmet rien et ne simule pas un succès d’envoi. Après validation, le visiteur peut télécharger un brouillon texte. Aucune donnée n’est stockée ni envoyée. Pour un véritable envoi, connecter un endpoint HTTPS et ajouter validation serveur, limitation de débit, protection antispam et information de confidentialité. Ne jamais placer de clé secrète dans le JavaScript.

## Personnaliser

- Couleurs et dimensions : variables `:root` dans le CSS.
- Textes : HTML ; descriptions des modales projets dans l’objet `projects` du JavaScript.
- Niveaux/qualifications : modifier uniquement après validation.
- Filtres : valeurs `data-filter` et `data-category`.
- SEO : compléter l’URL publique canonique et convertir `og:image` en URL absolue une fois le domaine connu. Préférer un visuel social HD après réception des originaux.

## Accessibilité et performances

Menu clavier avec état ARIA et fermeture Échap, lien d’évitement, focus visibles, fenêtres modales natives avec retour de focus, champs associés à leurs libellés et messages d’erreur explicites, prise en charge de `prefers-reduced-motion`. Le contenu reste visible sans JavaScript ; filtres/formulaire/modales nécessitent JavaScript. Navigation interne native.

Aucune police externe, aucun tracker ni bibliothèque d’icônes. Images locales légères avec dimensions explicites, portrait secondaire différé, script `defer`, animations transform/opacity et écoute de défilement via `requestAnimationFrame`. Tester la performance sur l’hébergement final (cache, compression et HTTPS dépendent du serveur).

## Contrôles

Vérifier menu mobile, liens d’ancrage, filtres, modales (Échap et focus), erreurs formulaire, téléchargement du brouillon, retour en haut et progression. Tailles recommandées : 360, 390, 768, 1024 et 1440 px. La rubrique projets ne contient intentionnellement aucun faux lien vers un projet publié.

### Tests automatisés (facultatif, développement uniquement)

Le site n’a besoin ni de Node.js ni de ces dépendances en production.

```sh
npm ci
npx playwright install --with-deps chromium
# Dans un autre terminal : lancer le serveur Python sur le port 8000
npm run check
npm test
```

`TEST_URL` permet de changer l’URL du serveur et `CHROMIUM_PATH` d’utiliser un Chromium déjà installé. Les captures sont enregistrées dans `test-results/` (ignoré par Git).

Contrôles effectués dans Chromium : absence de débordement horizontal et nom non coupé à 360, 390, 600, 768, 1024 et 1440 px ; menu mobile ; filtres ; fenêtres de détail et fermeture Échap ; validation des quatre champs ; téléchargement du brouillon ; absence d’erreur JavaScript et HTTP pendant ces parcours. La relecture visuelle a conduit à ajuster le titre sur mobile. Tests non effectués sur appareils iOS/Android physiques ou Safari ; aucune note Lighthouse n’est revendiquée.

### Informations complémentaires confirmées par le propriétaire

Création de sites web, capacité à s’exprimer en anglais (niveau non précisé) et formations suivies en informatique. Aucun organisme, diplôme, certificat, date de formation ou niveau linguistique n’est inventé.

### Téléphone confirmé

Numéro fourni par le propriétaire : +223 74 65 66 91. Lien d’appel `tel:+22374656691` actif dans la section Contact. Le propriétaire a également confirmé ce numéro pour WhatsApp. Les liens WhatsApp de l’accueil et de la section Contact ouvrent `https://wa.me/22374656691`.

### Adresse e-mail confirmée

Adresse fournie par le propriétaire : `momotraore.off@gmail.com`. Le lien e-mail de la section Contact ouvre la messagerie via `mailto:`. Le formulaire reste un outil de préparation de brouillon, sans envoi serveur automatique.

### Double profil professionnel confirmé

Le propriétaire se présente comme comptable et développeur, titulaire d’une licence en comptabilité et finance. La mention « informaticien » a été retirée de la présentation à sa demande. Aucune qualification réglementée (par exemple expert-comptable) n’est ajoutée.

### Qualités personnelles

Le propriétaire déclare aimer apprendre de nouvelles choses et se décrit comme courageux, rigoureux, honnête et sérieux. Ces qualités sont intégrées à la section À propos.

### Centres d’intérêt

Le propriétaire confirme pratiquer le football et le karaté. Ces activités figurent dans la section À propos, sans niveau, grade ou résultat sportif non confirmé.

Le propriétaire indique également aimer voyager ; cet intérêt figure dans la section À propos.

### TikTok confirmé

Profil fourni par le propriétaire : `https://www.tiktok.com/@medmoh.off0`. Liens ajoutés dans l’accueil et la section Contact, avec ouverture dans un nouvel onglet et `rel="noopener noreferrer"`.

### Facebook confirmé

Profil fourni par le propriétaire : `https://www.facebook.com/profile.php?id=61572550091200`. Les paramètres de partage `mibextid`, présents en double, ont été retirés sans modifier l’identifiant du profil. Liens ajoutés dans l’accueil et la section Contact avec `rel="noopener noreferrer"`.
