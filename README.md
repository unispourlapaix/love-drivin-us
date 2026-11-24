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

## Drag Race

Le bouton DRAG RACE ouvre le garage : cinq voitures, une par destination, sélectionnables au clic ou par glisser-déposer. Course de 1 800 mètres contre une voiture pilotée par le jeu. Boîte à six rapports : flèche haut ou Shift pour monter un rapport dans la zone verte ; T pour une réserve de turbo. Sur mobile, les boutons ↑ et ⚡ remplissent ces fonctions. Espace met en pause.

La première place rapporte 1 000 points et la deuxième 500, sans multiplicateur de capteurs. Ces points alimentent un portefeuille de garage local. Chaque voiture dispose de trois niveaux de moteur, pneus, turbo et aérodynamique (5 000, 10 000 puis 15 000 points par pièce). Le portefeuille et les améliorations sont sauvegardés dans le navigateur. WORLD TOUR revient au voyage original.
