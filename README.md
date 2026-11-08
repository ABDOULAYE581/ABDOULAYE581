# Caly Bamba — Services numériques

Site responsive en français : assistance téléphonique guidée, présentation des services et contact WhatsApp.

## Démarrer

```sh
python -m http.server 8000 --bind 0.0.0.0
```

Ouvrir le port 8000. Aucune dépendance ni compilation nécessaire.

## Structure

- `index.html` : contenu et interactions JavaScript.
- `assets/css/style.css` : styles et adaptation mobile.
- `assets/images/services/` : photographies et documentation des sources.

## Diagnostic

Le diagnostic local est activé par défaut, sans serveur IA. Pour connecter un backend, renseigner `AI_ENDPOINT` dans `index.html`. Ce backend doit recevoir `{device, messages}` en POST et renvoyer `{reply}` en JSON. Aucune clé d’API ne doit être placée dans le navigateur.

## Avant publication

Vérifier les droits des photographies (voir `SOURCES.md`), notamment les aperçus Vecteezy, et ajouter les informations légales et de confidentialité adaptées à l’activité. Les photos illustrent les services et ne représentent pas nécessairement l’équipe.
