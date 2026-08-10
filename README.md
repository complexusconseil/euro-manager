# ⚽ Euro Manager

Jeu de gestion football (à mi-chemin entre FIFA et Football Manager). Jouable **100 % en local** dans un navigateur, sans installation ni connexion internet. **Deux modes de jeu** : Carrière et Master League.

## 🎮 Comment jouer en local

**Le plus simple :** double-cliquez sur `index.html` — le jeu s'ouvre dans votre navigateur.

> Si le navigateur bloque certains scripts en `file://`, lancez un mini-serveur local depuis ce dossier :
> ```bash
> # Python (déjà installé sur Mac/Linux)
> python3 -m http.server 8000
> # puis ouvrez http://localhost:8000
> ```

La partie est **sauvegardée automatiquement** dans le navigateur (localStorage). Vous pouvez fermer et reprendre plus tard.

## 🎯 Modes de jeu

- **Mode Carrière** — prenez les rênes d'un vrai club et menez-le vers ses objectifs, saison après saison.
- **Mode Master League** (esprit PES 5/6) — créez votre propre club, choisissez ses couleurs, démarrez avec un effectif « maison » modeste et un petit budget (à la place du club le plus faible du championnat choisi), puis bâtissez une grande équipe au fil des saisons.
- **Mode International** — disputez le **Championnat d'Europe** (16 nations) ou la **Coupe du Monde** (32 nations) avec la sélection de votre choix, en élimination directe.

## 🌍 Championnats (11 pays)

Compositions réelles 2026-27, ~195 clubs : Ligue 1 🇫🇷, Premier League 🏴, La Liga 🇪🇸, Serie A 🇮🇹, Bundesliga 🇩🇪, Primeira Liga 🇵🇹, Eredivisie 🇳🇱, Pro League 🇧🇪, Süper Lig 🇹🇷, Scottish Premiership 🏴, **Premier Liga russe 🇷🇺**.

## 🏆 Compétitions européennes (mode Carrière & Master League)

Onglet **Europe** : qualification par **coefficient UEFA** — chaque pays reçoit un nombre de places selon son rang (les grands championnats 4 en C1, les intermédiaires 2, etc.), attribuées d'après le classement final. **Ligue des Champions** (32), **Ligue Europa** (32), **Ligue Conférence** (16), brackets multi-pays avec les vrais clubs. Confrontations en **matchs aller-retour** (score cumulé, tirs au but si égalité ; finale sèche) — vous jouez l'aller puis le retour, animés. Recettes européennes selon le parcours.

## 🌐 Sélections nationales réelles

En mode International, les sélections **UEFA + Russie** utilisent de **vrais effectifs**, qui **évoluent à chaque rassemblement** (forme du moment ±, absences pour blessure/choix du sélectionneur, joueurs rappelés). Les sélections hors-Europe utilisent pour l'instant des effectifs représentatifs.

## ✨ Fonctionnalités

- **Base de données de clubs européens** — les 5 grands championnats aux **compositions réelles 2026-27** : Ligue 1 🇫🇷 (18), Premier League 🏴 (20), La Liga 🇪🇸 (20), Serie A 🇮🇹 (20), Bundesliga 🇩🇪 (18) — soit 96 clubs, promotions/relégations incluses. Effectifs réels à jour au 10/08/2026 (mercato d'été inclus).
- **Gestion de l'effectif** — consultez notes, potentiel, forme, moral, valeur marchande et statistiques de chaque joueur.
- **Mercato (acheter / vendre)** — recherchez des joueurs dans toute l'Europe avec filtres (poste, note, âge), faites des offres, négociez selon votre budget. Placez vos joueurs sur la liste des transferts et recevez des offres des clubs IA.
- **Tactique avant match** — choisissez votre formation (4-4-2, 4-3-3, 4-2-3-1, 3-5-2, 5-3-2, 4-5-1), composez votre onze sur un terrain visuel, et réglez vos consignes (mentalité, tempo, pressing) qui influencent réellement la simulation.
- **Matchs simulés** — moteur basé sur la force des lignes (attaque / milieu / défense), la tactique, l'avantage du terrain et une part d'aléatoire. Match joué avec animation minute par minute et buteurs, ou simulation rapide.
- **Carrière sur plusieurs saisons** — classement en direct (places européennes / relégation), meilleurs buteurs, calendrier aller-retour complet, objectifs de saison, actualités du club, vieillissement/progression des joueurs et évolution du budget entre saisons.

## 🕹 Prise en main

1. Choisissez un championnat et un club (les étoiles ★ indiquent la réputation / le niveau).
2. Onglet **Tactique** : réglez formation et consignes, vérifiez votre onze.
3. Onglet **Mercato** : renforcez l'effectif selon votre budget.
4. Onglet **Accueil** : jouez le match (animé) ou simulez rapidement.
5. Enchaînez les journées, visez votre objectif, puis passez à la saison suivante.

## 🛠 Technique

100 % HTML / CSS / JavaScript vanilla, aucune dépendance externe.

| Fichier | Rôle |
|---|---|
| `index.html` | Page principale |
| `css/style.css` | Interface (thème stade) |
| `js/data.js` | Base de données : clubs européens + générateur de joueurs |
| `js/engine.js` | Moteur : composition, forces d'équipe, simulation de match |
| `js/game.js` | Carrière : calendrier, classement, mercato, sauvegarde |
| `js/ui.js` | Rendu des écrans et interactions |

Bon jeu ! ⚽
