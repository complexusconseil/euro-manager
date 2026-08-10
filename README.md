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

## 🌍 Championnats (15 pays)

Compositions réelles 2026-27, ~253 clubs : Ligue 1 🇫🇷, Premier League 🏴, La Liga 🇪🇸, Serie A 🇮🇹, Bundesliga 🇩🇪, Primeira Liga 🇵🇹, Eredivisie 🇳🇱, Pro League 🇧🇪, Süper Lig 🇹🇷, Scottish Premiership 🏴, Premier Liga russe 🇷🇺, **Super League grecque 🇬🇷, Super League suisse 🇨🇭, Bundesliga autrichienne 🇦🇹, Premier League ukrainienne 🇺🇦**.

Entre deux saisons, chaque championnat se renouvelle : les derniers du classement sont **relégués** et remplacés par des **promus** (montées/descentes).

## 🏅 Coupes nationales (chaque championnat)

Chaque pays a sa **coupe nationale** en élimination directe (match sec) : Coupe de France 🇫🇷, FA Cup 🏴, Copa del Rey 🇪🇸, Coppa Italia 🇮🇹, DFB-Pokal 🇩🇪, Taça de Portugal 🇵🇹, KNVB Beker 🇳🇱, Coupe de Belgique 🇧🇪, Türkiye Kupası 🇹🇷, Scottish Cup 🏴, Coupe de Russie 🇷🇺, Coupe de Grèce 🇬🇷, Coupe de Suisse 🇨🇭, ÖFB-Cup 🇦🇹, Coupe d'Ukraine 🇺🇦. Tous les clubs du championnat sont engagés (les têtes de série entrent plus tard) ; onglet **Coupe** pour jouer/simuler chaque tour, avec primes de parcours et trophée à la clé. Nouveau tirage chaque saison.

## 🌍 Coupe du Monde & Euro en carrière

Chaque **été**, un tournoi international (alterné **Coupe du Monde** / **Championnat d'Europe**) s'invite dans votre carrière **et** en Master League : depuis l'Accueil, prenez en main la **sélection de votre choix** (par défaut celle de votre pays) et disputez l'élimination directe avec de vrais effectifs, puis revenez à votre club. Palmarès international conservé.

## 🎥 Moteur 3D immersif

Les matchs se jouent avec un **rendu 3D du terrain** (moteur Three.js embarqué, 100 % hors-ligne) : **joueurs humanoïdes animés** (course, foulée, bras/jambes articulés, orientation vers le jeu) aux couleurs des deux clubs, **ombres portées** en temps réel, **stade avec tribunes garnies et projecteurs**, pelouse tondue avec surfaces et arcs, caméra de retransmission qui suit le ballon, buts et célébrations, HUD score/minute. Bascule possible vers un rendu 2D léger via la case **« Rendu 3D »** de l'écran d'accueil (utile sur machines modestes).

## 🏆 Compétitions européennes (mode Carrière & Master League)

Onglet **Europe** : qualification par **coefficient UEFA** — chaque pays reçoit un nombre de places selon son rang (les grands championnats 4 en C1, les intermédiaires 2, etc.), attribuées d'après le classement final. **Ligue des Champions** (36), **Ligue Europa** (36), **Ligue Conférence** (24), multi-pays avec les vrais clubs.

- **Phase de ligue** (saison régulière) : un championnat à classement unique (8 journées en C1/C3, 6 en Conférence). Vous jouez vos matchs (ou simulez la journée / toute la phase). Les **16 premiers** se qualifient.
- **Phase finale** : élimination directe en **matchs aller-retour** (score cumulé, tirs au but si égalité ; **finale sèche**) — vous jouez l'aller puis le retour, animés.
- **Supercoupe d'Europe** : le vainqueur de la Ligue des Champions affronte celui de la Ligue Europa en début de saison suivante (mise en avant si votre club est concerné).
- Recettes européennes selon le parcours ; qualification recalculée chaque saison.

## 🌐 Sélections nationales réelles (50 nations)

En mode International, **toutes les sélections** (Europe, Amériques, Afrique, Asie + Russie) utilisent de **vrais effectifs**, qui **évoluent à chaque rassemblement** : forme du moment (±), absences pour blessure ou choix du sélectionneur, joueurs rappelés.

## ✨ Fonctionnalités

- **Base de données de clubs européens** — les 5 grands championnats aux **compositions réelles 2026-27** : Ligue 1 🇫🇷 (18), Premier League 🏴 (20), La Liga 🇪🇸 (20), Serie A 🇮🇹 (20), Bundesliga 🇩🇪 (18) — soit 96 clubs, promotions/relégations incluses. Effectifs réels à jour au 10/08/2026 (mercato d'été inclus).
- **Gestion de l'effectif** — consultez notes, potentiel, forme, moral, valeur marchande et **statistiques détaillées** de chaque joueur : matchs, **buts**, **passes décisives** et **note moyenne** de match.
- **Statistiques & trophées** — classements du championnat en direct : **meilleurs buteurs**, **meilleurs passeurs**, **meilleures notes moyennes**. En fin de saison : Meilleur buteur, Meilleur passeur et **Joueur de la saison** (meilleure note moyenne).
- **Mercato (acheter / vendre / agents libres)** — recherchez des joueurs dans toute l'Europe avec filtres (poste, note, âge), faites des offres, négociez selon votre budget. Un **vivier d'agents libres** (sans club) est signable sans indemnité de transfert, juste contre une prime — idéal en **Master League** pour bâtir l'équipe avec un budget fixé. Placez vos joueurs sur la liste des transferts et recevez des offres des clubs IA.
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

100 % HTML / CSS / JavaScript vanilla. Seule dépendance : **Three.js** (moteur 3D), embarqué dans `js/vendor/` (licence MIT) — aucune connexion internet requise.

| Fichier | Rôle |
|---|---|
| `index.html` | Page principale |
| `css/style.css` | Interface (thème stade) |
| `js/realdata.js` | Données réelles : couleurs & effectifs des 253 clubs |
| `js/data.js` | Base de données : championnats + générateur de joueurs |
| `js/engine.js` | Moteur : composition, forces d'équipe, simulation de match |
| `js/game.js` | Carrière : calendrier, classement, mercato, stats, montées/descentes, sauvegarde |
| `js/natdata.js` | Vraies sélections nationales (50 nations) |
| `js/cups.js` | Coupes d'Europe (phase de ligue + phase finale), Supercoupe, sélections |
| `js/match3d.js` | Moteur 3D des matchs (Three.js) |
| `js/ui.js` | Rendu des écrans et interactions |
| `js/vendor/three.min.js` | Three.js (MIT) — rendu 3D hors-ligne |

Bon jeu ! ⚽
