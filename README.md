# Love Drivin Us

Jeu de course et d’esquive en pixel art, réalisé en HTML, CSS et JavaScript sans dépendances.

## Jouer

Ouvrir `index.html` dans un navigateur récent. Aucun serveur ni installation nécessaire.

- Flèches gauche/droite ou Q/D : changer de voie.
- Espace : pause.
- Boutons tactiles disponibles.
- Le son démarre au lancement du tour ; SON permet de le couper ou de le réactiver.
- Chaque ville lit automatiquement sa piste dans `audio/` en boucle : `tokyo.mp3`, `bresil.mp3`, `paris.mp3`, `mexique.mp3`, `indonesie.mp3`. Les sélecteurs permettent un remplacement temporaire.

## Le voyage

Tokyo, Brésil, Paris, Mexique et Indonésie s’enchaînent. Récolter 20 cœurs par ville, puis esquiver les mots du boss pendant 18 secondes. Chaque ville se termine par une animation et un texte de paix. Chrono et score cumulés, trois vies et une vie récupérée entre les villes.

## Fichiers

- `index.html` : interface et styles.
- `game.js` : moteur Canvas, décors, personnages, boss et synthèse audio Web Audio.

## Préparer GitHub

Depuis ce dossier, avec Git installé :

```sh
git init -b main
git add .
git commit -m "Initial version of Love Drivin Us"
```

Créer ensuite un dépôt vide sur GitHub et suivre ses commandes pour ajouter le remote et pousser la branche `main`.

Ne pas ajouter de musique sans disposer des droits nécessaires. Aucune licence de redistribution n’est définie pour ce projet à ce stade.
