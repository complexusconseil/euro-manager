# ⚽ Euro Manager

**🇫🇷 Français / 🇬🇧 English** — le jeu est **entièrement bilingue** : choisissez la langue sur l'écran d'accueil (le choix est mémorisé). La traduction couvre **toute** l'interface — menus, tableaux, tactique, mercato, coaching, causeries, objectifs de saison et l'intégralité du **fil d'actualités** (transferts, blessures, cartons, montées/descentes, bilans de fin de saison).

▶️ **Jouable en ligne : https://complexusconseil.github.io/euro-manager/** (mobile et bureau, rien à installer).


Jeu de gestion football (à mi-chemin entre FIFA et Football Manager). Jouable **100 % en local** dans un navigateur, sans installation ni connexion internet. **Deux modes de jeu** : Carrière et Master League.

## 🎨 Interface

Habillage repris des menus de **PES 6** : fond **argent et blanc** balayé d'une **diagonale**, **panneaux clairs biseautés** à bandeau **bleu dégradé** souligné d'**orange**, **onglets en lamelles penchées**, typographie **condensée italique en capitales**, tableaux blancs à en-tête bleu et **ligne sélectionnée en bleu plein**. Accents orange pour les trophées, rouge pour la discipline. Le seul écran sombre est le **bandeau de score** en match, comme dans le jeu.

**Aucun emoji dans l'interface.** Tout ce qui était signalé par un émoji est devenu graphique :
- **Drapeaux vectoriels** dessinés en SVG (`js/flags.js`) — 110 pays, lisibles partout, là où les drapeaux émoji ne s'affichent tout simplement pas sous Windows ;
- **Icônes au trait** pour la navigation, les compétitions et les actions ;
- **Pastilles typographiques** pour les états (BLES., SUSP., QUALIFIÉ, ÉLIMINÉ…) ;
- **Fil d'actualités catégorisé** : chaque nouvelle porte un marqueur coloré (Transfert, Blessure, Discipline, Coupe, Finances, Prêt…) au lieu d'un émoji.

Interface responsive (mobile et bureau), sans débordement horizontal.

**Polices embarquées** — le jeu utilise ses propres webfonts, **intégrées dans le CSS** (`css/fonts.css`, en base64) : **Inter** pour le texte et **Barlow Condensed** pour les titres et les scores. Aucune requête réseau n'est faite (vérifié : **0 requête externe**), donc le rendu est identique en ligne, hors-ligne et en `file://`. Licence SIL Open Font 1.1 — voir `FONTS-LICENSE.txt`.

## 🎵 Bande son

Le jeu embarque **cinq musiques originales** — *Coup d'envoi, Sous les projecteurs, Fenêtre de transferts, Salle de conseil, Prolongation* — **entièrement synthétisées en Web Audio** : batterie, basse, nappes et mélodie sont générées à la volée, il n'y a **aucun fichier audio** dans le dépôt et **aucune requête réseau**. Lecture, piste précédente/suivante et volume se pilotent depuis la barre présente sur l'écran d'accueil et en cours de partie ; le réglage est mémorisé.

**Vos propres musiques** : le bouton d'import permet de charger vos fichiers audio personnels. Ils sont conservés **localement** (IndexedDB, ils ne quittent jamais votre machine), s'ajoutent à la playlist et sont rejoués aux sessions suivantes.

> Les bandes originales de PES 5 / PES 6 appartiennent à Konami : elles ne peuvent pas être distribuées avec le jeu. Les pistes fournies sont des compositions originales dans le même esprit ; si vous possédez d'autres musiques, l'import local est là pour ça.

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

## 🎮 Écran de match en direct (avec pause et coaching)

Les matchs se jouent sur un **écran simple et lisible** : score, minute, **terrain animé** (les pions bougent selon le jeu) et **fil live** (buts, cartons, blessures). Surtout, vous **dirigez vraiment** :

- **⏸ Pause** à tout moment, **vitesse réglable** (1× à 4×), **⏭ fin du match** pour accélérer
- **🎛️ Coaching en cours de match** : **consignes rapides** (Fermer le jeu / Équilibrer / Tout attaquer), curseurs **mentalité / tempo / pressing**, et jusqu'à **3 remplacements** — en club **comme en sélection**
- La simulation est recalculée **minute par minute** : chaque changement s'applique **immédiatement** (mesuré : « tout attaquer » 3,65 buts contre 2,58 en « fermer le jeu »)
- Le match se met **automatiquement en pause** à la mi-temps, et **dès qu'un de vos joueurs se blesse ou est expulsé**

Le jeu ne charge plus de moteur 3D : la page est **beaucoup plus légère** (idéal sur mobile).

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
- **Blessures & suspensions** — pendant les matchs, vos joueurs peuvent se **blesser** (1 à 12 journées) ou prendre des **cartons** : 🟨 accumulés (5 avertissements = 1 match de suspension) et 🟥 **expulsion** qui vous laisse en **infériorité numérique** pour la suite de la rencontre (handicap réel) puis suspendu. Le **pressing haut**, un tempo élevé, l'âge et la fatigue **augmentent le risque** — un vrai arbitrage tactique. Les indisponibles sont exclus de la composition automatique, signalés dans l'**Infirmerie** (Accueil), dans l'effectif (🤕/🟥 avec le nombre de journées) et sur leur fiche ; alerte à la **mi-temps** si un blessé est encore sur le terrain. Toute la ligue est concernée, pas seulement vous.
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

100 % HTML / CSS / JavaScript vanilla. **Aucune dépendance externe, aucun build, aucune connexion internet** : polices comprises, tout est embarqué dans les fichiers du dossier. Le jeu tourne aussi bien depuis un simple double-clic que derrière une URL publique.

| Fichier | Rôle |
|---|---|
| `index.html` | Page principale |
| `css/fonts.css` | Webfonts embarquées en base64 (Inter, Barlow Condensed — SIL OFL) |
| `js/flags.js` | Drapeaux vectoriels (110 pays) dessinés en SVG |
| `js/audio.js` | Bande son : synthèse Web Audio + import de vos fichiers |
| `css/style.css` | Interface (thème stade) |
| `js/i18n.js` | Traduction : dictionnaire anglais + bascule FR/EN |
| `js/realdata.js` | Données réelles : couleurs & effectifs des 253 clubs |
| `js/data.js` | Base de données : championnats + générateur de joueurs |
| `js/engine.js` | Moteur : composition, forces d'équipe, simulation de match |
| `js/game.js` | Carrière : calendrier, classement, mercato, stats, montées/descentes, sauvegarde |
| `js/natdata.js` | Vraies sélections nationales (50 nations) |
| `js/cups.js` | Coupes d'Europe (phase de ligue + phase finale), Supercoupe, sélections |
| `js/ui.js` | Rendu des écrans et interactions |
| `FONTS-LICENSE.txt` | Licence SIL OFL 1.1 des polices embarquées |

Bon jeu ! ⚽
