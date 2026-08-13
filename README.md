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
- **Mode Master League** (esprit PES 5/6) — créez votre propre club **dans le championnat de votre choix**, choisissez ses couleurs, démarrez avec l'effectif « maison » aux **noms iconiques (Castolo, Espimas, Minanda, Valeny, Hamsun…)** et un petit budget (à la place du club le plus faible), puis bâtissez une grande équipe au fil des saisons via le mercato et les agents libres.
- **Mode International** — disputez le **Championnat d'Europe** (16 nations) ou la **Coupe du Monde** (32 nations) avec la sélection de votre choix, en élimination directe.

## 🌍 Championnats (15 pays)

Compositions réelles 2026-27, ~253 clubs : Ligue 1 🇫🇷, Premier League 🏴, La Liga 🇪🇸, Serie A 🇮🇹, Bundesliga 🇩🇪, Primeira Liga 🇵🇹, Eredivisie 🇳🇱, Pro League 🇧🇪, Süper Lig 🇹🇷, Scottish Premiership 🏴, Premier Liga russe 🇷🇺, **Super League grecque 🇬🇷, Super League suisse 🇨🇭, Bundesliga autrichienne 🇦🇹, Premier League ukrainienne 🇺🇦**.

Entre deux saisons, chaque championnat se renouvelle : les derniers du classement sont **relégués** et remplacés par des **promus** (montées/descentes).

## 🏅 Coupes nationales (chaque championnat)

Chaque pays a sa **coupe nationale** en élimination directe (match sec) : Coupe de France 🇫🇷, FA Cup 🏴, Copa del Rey 🇪🇸, Coppa Italia 🇮🇹, DFB-Pokal 🇩🇪, Taça de Portugal 🇵🇹, KNVB Beker 🇳🇱, Coupe de Belgique 🇧🇪, Türkiye Kupası 🇹🇷, Scottish Cup 🏴, Coupe de Russie 🇷🇺, Coupe de Grèce 🇬🇷, Coupe de Suisse 🇨🇭, ÖFB-Cup 🇦🇹, Coupe d'Ukraine 🇺🇦. Tous les clubs du championnat sont engagés (les têtes de série entrent plus tard) ; onglet **Coupe** pour jouer/simuler chaque tour, avec primes de parcours et trophée à la clé. Nouveau tirage chaque saison.

## 🌍 Coupe du Monde & Euro en carrière

Chaque **été**, un tournoi international (alterné **Coupe du Monde** / **Championnat d'Europe**) s'invite dans votre carrière **et** en Master League : **facultatif**, il apparaît dans le **Calendrier** comme rendez-vous à suivre. Depuis l'Accueil, prenez en main la **sélection de votre choix** (par défaut celle de votre pays) : à chaque édition, **composez votre effectif de 23** — **11 titulaires + banc (profondeur)** — en piochant dans un **vivier d'environ 500 joueurs de la nation** (vrais internationaux en tête, compatriotes en profondeur), avec **recherche et filtres par poste**. Les noms générés sont **cohérents avec la nationalité** : chaque pays a son propre vivier de prénoms/noms — **93 nationalités** couvrant toutes les confédérations (Europe, Amériques, Afrique, Asie, Océanie). **93 sélections** sont jouables (Coupe du Monde / Euro), des favoris aux nations plus modestes. La force de l'équipe dépend de vos titulaires. Puis disputez l'élimination directe et revenez à votre club. Palmarès international conservé.

## 🎥 Vue tactique 3D + tableau de bord en direct

Les matchs se jouent en **vue tactique 3D** (moteur Three.js embarqué, 100 % hors-ligne) façon banc de touche : **terrain 3D visible** (pelouse tondue, surfaces, arcs, stade et tribunes), **pions colorés qui se déplacent** aux couleurs des deux clubs, **ballon qui circule de pion en pion** (jeu de passes) avec anneau du porteur et traînée, mouvements **fluides** et caméra tactique. **Commandes de lecture** (⏸ pause, vitesse 1×/2×/3×) pour suivre le match à votre rythme. Le tout piloté par un vrai **tableau de bord en continu** : score/minute, **barre de possession**, **tirs / cadrés / corners / fautes**, **momentum**, et un **fil de commentaire live**. Bascule possible vers un rendu 2D léger via la case **« Rendu 3D »** de l'écran d'accueil (utile sur machines modestes).

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
- **Fiche joueur & carrière** — cliquez sur un nom (effectif ou mercato) pour ouvrir sa **fiche** : attributs (note, potentiel, valeur, salaire, forme, moral, contrat), stats de la saison et **historique de carrière saison par saison** (matchs, buts, passes, note moyenne, sélections de jeunes) qui **évolue au fil des saisons**.
- **Progression réaliste** — en fin de saison, chaque joueur reçoit un **boost ou un malus** selon sa saison (note moyenne, temps de jeu), en plus de la courbe d'âge. Une grande saison peut faire éclore un jeune ; une saison ratée fait reculer.
- **Sélections de jeunes** — les jeunes talents sont **convoqués en U17 / U19 / U21** de leur nation (annonces, expérience gagnée, trace sur leur fiche).
- **Gestion de l'effectif** — consultez notes, potentiel, forme, moral, valeur marchande et **statistiques détaillées** de chaque joueur : matchs, **buts**, **passes décisives** et **note moyenne** de match.
- **Statistiques & trophées** — classements du championnat en direct : **meilleurs buteurs**, **meilleurs passeurs**, **meilleures notes moyennes**. En fin de saison : Meilleur buteur, Meilleur passeur et **Joueur de la saison** (meilleure note moyenne).
- **Mercato (acheter / vendre / prêter / agents libres)** — recherche **multi-filtres** (type : tous / agents libres / transférables / **disponibles en prêt**, poste exact, note min, potentiel min, âge max, prix max/budget, tri). Un **vivier d'agents libres aux vrais noms** (vétérans réels : Sergio Ramos, James Rodríguez, Alexis Sánchez… ) est signable sans indemnité, contre une prime. **Signatures réalistes** : une star refuse un club trop modeste, un club rechigne à lâcher ses cadres, et il faut convaincre (prime/indemnité) les joueurs visant plus haut.
- **Prêts de joueurs** — **empruntez** un jeune ou une doublure d'un autre club pour la saison (contre une indemnité de prêt), ou **prêtez** un de vos joueurs pour lui offrir du temps de jeu (il **revient grandi** en fin de saison). Rappel possible à tout moment ; les cadres et pépites ne sont pas prêtables (réalisme).
- **Mercato à dates fixes** — deux fenêtres par saison : le **mercato d'été** (jusqu'à la 3e journée) et le **mercato d'hiver** (à la trêve). En dehors, aucun achat, vente ou prêt — ni pour vous, ni pour les clubs IA.
- **Agenda unifié** — championnat, **coupe nationale** et **coupes d'Europe** sont rattachés au même calendrier : les rendez-vous à jouer apparaissent sur l'**Accueil** et dans le **Calendrier**, avec alerte si un tour est en retard. Plus moyen de passer à côté d'une coupe.
- **Matchs interactifs (vos choix comptent)** — sur **tous les matchs** : championnat, **coupe nationale**, **coupes d'Europe** (phase de ligue et phase finale aller-retour, causerie et pause à chaque manche) et **sélections** (Euro / Coupe du Monde). **Causerie d'avant-match** (rassurer / hausser le ton / neutre) qui modifie le moral, puis match en **deux mi-temps** avec un **écran de pause** : ajustez mentalité, tempo et pressing, et faites jusqu'à **3 remplacements** — en club **comme en sélection** (la force du onze national découle des 11 sur le terrain, donc un changement compte vraiment). La 2e période est simulée avec vos réglages ; le pressing haut **fatigue** l'équipe, les entrants sont **frais**.
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
