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

**Menu principal** repris de la grammaire des menus du jeu : bandeau supérieur portant la marque, **colonne verticale des modes** en lamelles penchées (jamais une barre d'onglets), panneau de réglages à droite, **bandeau contextuel bleu** en bas qui décrit le mode survolé, et légende des touches. La **navigation au clavier** fonctionne (↑ ↓ avec bouclage, Entrée pour valider) et chaque déplacement joue un **tick sonore**, la validation un son plus plein.

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

Les matchs se jouent sur un **écran simple et lisible** : bandeau de score sombre souligné d'orange, **terrain animé** et **fil live** (buts, cartons, blessures). Surtout, vous **dirigez vraiment** :

- **⏸ Pause** à tout moment, **vitesse réglable** (1× à 4×), **⏭ fin du match** pour accélérer
- **🎛️ Coaching en cours de match** : **consignes rapides** (Fermer le jeu / Équilibrer / Tout attaquer), curseurs **mentalité / tempo / pressing**, et jusqu'à **3 remplacements** — en club **comme en sélection**
- La simulation est recalculée **minute par minute** : chaque changement s'applique **immédiatement** (mesuré : « tout attaquer » 3,65 buts contre 2,58 en « fermer le jeu »)
- Le match se met **automatiquement en pause** à la mi-temps, et **dès qu'un de vos joueurs se blesse ou est expulsé**

### Le déplacement des joueurs

Le terrain n'affiche pas des pions qui glissent vers le ballon : chaque joueur a un **rôle**, une **place dans le bloc** et une **inertie** (`js/pitchview.js`).

- **Ressort amorti** `a = ω²·(cible − p) − 2ζω·v` (ω = 4,2 rad/s, ζ = 0,8) : le mouvement est paramétré par l'état, donc il encaisse une cible qui bouge à chaque image. Une interpolation linéaire, elle, démarre à vitesse maximale puis ralentit — l'inverse d'un corps humain, et c'est précisément ce qui fait « robot ».
- **Vitesses réelles** : course d'entretien 5 m/s, sprint 8,2 m/s, accélération plafonnée à 9 m/s². Personne ne change de direction instantanément.
- **Bloc d'équipe** : la formation coulisse latéralement avec le ballon, monte quand l'équipe attaque, se resserre quand elle défend bas ; les **quatre défenseurs tiennent une ligne commune** (écart-type mesuré : 2,4 m).
- **Rôles** : le gardien reste sur sa ligne et suit le ballon des yeux, le joueur le plus proche **sort au duel**, un deuxième **couvre**, les attaquants font des **appels en profondeur**.
- **Ballon** : jamais collé au porteur mais **accroché à une ancre amortie** (τ = 100 ms) qui le fait déborder dans les changements de direction, avec des **touches de balle** cadencées par joueur. Les passes sont choisies par une cloche de distance centrée sur 22 m et surtout par l'**ouverture du couloir** — c'est elle qui fait naître les interceptions, au lieu de les tirer au sort. Le ballon s'oriente vers le receveur 250 ms avant le départ.
- **Errement** : deux sinusoïdes déphasées par joueur, donc plus personne n'est jamais parfaitement immobile (mesuré : 0 % de joueurs à l'arrêt).

Le jeu ne charge plus de moteur 3D : la page est **beaucoup plus légère** (idéal sur mobile).

## 🎯 Enjeu de saison : objectif, confiance, relégation

L'objectif n'est plus un simple texte : il porte un **rang à atteindre**, réellement évalué en fin de saison (titre pour un grand club, podium, place européenne, milieu de tableau, maintien — et **remontée** si vous êtes en D2).

- **Confiance des dirigeants** : une jauge de 0 à 100, affichée sur l'Accueil. Elle dérive doucement pendant la saison selon votre place, puis bascule franchement au verdict (+15 à +25 si l'objectif est tenu, −18 à −35 sinon).
- **Relégation réelle** : votre club n'est plus protégé. Chaque championnat a désormais une **deuxième division** de 18 clubs ; finir dans la zone rouge vous y envoie, avec son propre calendrier, et l'objectif devient la remontée.
- **Licenciement** : deux objectifs manqués de suite, ou une confiance tombée à zéro, et les dirigeants vous remercient. **Trois clubs** vous font alors signe — avec leur championnat, la note de leur effectif et leur budget — et la carrière continue ailleurs.

## 🏋️ Entraînement

Sous la composition, dans l'onglet **Tactique**, trois curseurs se partagent la semaine. Un tiers chacun est la répartition neutre : au-dessus vous gagnez dans ce domaine, en dessous vous perdez.

| Orientation | Effet |
|---|---|
| **Physique** | Jusqu'à **−30 % de risque de blessure** |
| **Technique** | Progression plus rapide vers le potentiel, surtout pour les moins de 24 ans |
| **Tactique** | Cohésion du bloc : jusqu'à **+1,8** sur chaque ligne de l'équipe |

L'effet attendu est chiffré à l'écran et se met à jour en direct. Mesuré sur 4 saisons en suivant la **même cohorte** de jeunes : progression moyenne **+4,17** en réparti, **+4,58** en tout technique, **+3,92** en tout physique, **+3,08** en tout tactique. Les blessures se comptent en **journées-joueur d'exposition** et non en instantané : **134,8** en réparti, **125,8** en misant sur le physique, **168,5** en tout technique.

## 💶 Économie du club

Les **salaires sont prélevés à chaque journée** et les **recettes encaissées** de même : billetterie et droits, modulés de −15 % à +15 % par votre place au classement. La carte **Finances** de l'Accueil montre le budget de transfert, la masse salariale hebdomadaire, les recettes et salaires cumulés de la saison, et le solde.

Les recettes de référence sont calées sur les masses salariales réelles de la base (21 / 29 / 42 / 66 / 128 M€ par saison selon la réputation du club) : **un effectif conforme au rang du club équilibre ses comptes**, un effectif surpayé passe dans le rouge, un bon classement dégage une marge pour le mercato. Les clubs gérés par l'ordinateur tiennent une comptabilité simplifiée et bornée — ni faillite en spirale, ni magot infini.

### Un circuit monétaire fermé

**Tout euro qui quitte la trésorerie d'un club arrive dans celle d'un autre.** Transferts et prêts sont de pures redistributions ; les seules entrées et sorties du circuit sont explicites et tenues dans un grand livre (`FM.state.eco`) : recettes, salaires, primes de signature et régulations. L'égalité se vérifie à tout instant :

```
masse(t) = masse(0) + recettes − salaires − primes + régulations
```

Mesuré sur une saison complète des 15 championnats, 271 clubs : **écart 0,000 M€**. Ce qui, au passage, ferme cinq brèches :

- **le club acheteur paie réellement** — une vente créditait votre compte sans jamais débiter le sien ;
- **l'indemnité de prêt va au club parent** — elle disparaissait dans le vide à l'aller et sortait de nulle part au retour ;
- **prêter puis rappeler ne rapporte plus rien** : l'indemnité est remboursée à celui qui l'a versée, le rappel exige un mercato ouvert, et un joueur qui rentre de prêt ne repart pas dans la foulée. La boucle rapportait 5 M€ par aller-retour, sans limite ;
- **un agent libre n'est plus une machine à cash** : la prime passe de 20 % à 60 % de la valeur, et un joueur tout juste signé ne peut pas être revendu dans la même fenêtre. Le rapport valeur/prime tombe de **3,4×** à **1,66×** ;
- **un montant d'offre invalide est refusé** : un champ vide donnait `NaN` et contaminait définitivement le budget.

### Un effectif ne peut plus être vidé

Un club conserve au minimum **16 joueurs sous contrat** — les prêts entrants ne comptent pas — et un **plancher par ligne** (2 gardiens, 5 défenseurs, 4 milieux, 3 attaquants). Ce plancher gouverne aussi les fins de carrière et l'élagage de fin de saison, et le centre de formation comble en priorité une ligne dégarnie. Il était possible de descendre à 16 joueurs dont 6 sous contrat, tous attaquants, sans le moindre gardien.

### Chaque euro a un payeur ET un bénéficiaire

L'arrondi au centime lui-même est comptabilisé : sans cela, un simple achat faisait apparaître ou disparaître quelques milliers d'euros, et un club repris à l'étranger créait **57,6 M€** à partir de rien (les clubs de deuxième division apparaissaient avec leur trésorerie, hors bilan). Les montants aberrants — `NaN`, `Infinity`, négatifs, chaînes — sont ignorés au lieu de détruire la masse monétaire.

### Le marché vit sans vous

Les clubs gérés par l'ordinateur **mettent des joueurs sur la liste, se les achètent entre eux et signent des agents libres** à chaque journée de mercato. Auparavant le marché n'était alimenté que par les joueurs que *vous* listiez : l'onglet « Transférables » restait vide et les effectifs adverses étaient identiques du début à la fin d'une carrière.

## 👶 Renouvellement des générations

- **Fins de carrière** : à partir de 33 ans, chaque joueur peut raccrocher (certitude à 38). Plus personne ne joue à 50 ans.
- **Centre de formation** : chaque club fait éclore **1 à 3 jeunes de 16 à 18 ans par saison**, avec une note calée sur le niveau réel de l'effectif et un **potentiel** qui peut monter très haut. Les vôtres apparaissent sur l'Accueil avec leur note et leur potentiel.
- Les effectifs restent dans des bornes saines (18 à 28 joueurs) : les jeunes entrent, les plus faibles partent en fin de contrat.

Mesuré sur 10 saisons : âge moyen stable autour de 25 ans (contre 36 auparavant), plus de 1 700 joueurs de 21 ans ou moins dans la base, aucun joueur au-delà de 39 ans.

## 💾 Sauvegarde

La partie est enregistrée dans le navigateur à chaque journée. Quatre garde-fous :

- **Taille bornée** : l'historique de carrière est limité (12 saisons pour votre effectif, 3 ailleurs) et les champs à leur valeur par défaut ne sont pas écrits. La sauvegarde se stabilise autour de **3,3 Mo** — mesuré sur 20 saisons — au lieu de dépasser le quota de 5 Mo dès la 8e saison.
- **Alerte visible** : si le navigateur refuse d'écrire, un **bandeau rouge** le dit et propose d'**exporter la partie** en fichier `.json`. Plus de progression perdue en silence.
- **Contrôle au chargement** : une sauvegarde vide, tronquée ou étrangère est **refusée proprement** avec un message, au lieu de faire planter le jeu. Le contrôle porte sur douze points — présence des résultats et des actualités, cohérence du championnat suivi, effectif et trésorerie du club dirigé, calendrier qui ne désigne que des clubs existants. Les sauvegardes d'anciennes versions sont migrées automatiquement.
- **Identifiants stables au rechargement** : le compteur d'identifiants repart à 1 au chargement du script. Il est maintenant recalé sur la partie chargée — sans cela, les joueurs créés après un rechargement reprenaient des identifiants déjà utilisés (**442 doublons dès la première saison**), et toute suppression « par identifiant » — retour de prêt, transfert, retraite — pouvait effacer un autre joueur de la base.
- **Les divisions abandonnées sont nettoyées** : chaque changement de pays créait une deuxième division de 18 clubs qui n'était jamais retirée. Au douzième pays la sauvegarde dépassait le quota du navigateur et la carrière cessait d'être enregistrée. Seul le pays en cours conserve sa D2 : la base reste à **271 clubs** sur vingt saisons au lieu d'enfler jusqu'à 487.
- **Deux onglets ne s'écrasent plus** : chaque enregistrement porte un numéro de version. Un second onglet qui jouait effaçait silencieusement la progression du premier — quinze journées pouvaient disparaître sans le moindre message. Le conflit est maintenant détecté et annoncé, avec un bouton pour recharger.
- **Les sauvegardes héritées sont réparées** : une partie d'avant le recalage du compteur porte jusqu'à 412 identifiants en double, qui faisaient disparaître deux joueurs à la première vente. Ils sont renumérotés au chargement plutôt que de faire refuser la carrière.
- **Le hasard reprend où il s'est arrêté** : le curseur du générateur est enregistré. Sans lui, chaque rechargement de page rembobinait le hasard au même point.
- **Le jeu tourne même sans stockage** : en navigation privée stricte, ou cookies bloqués, le simple fait de *lire* `localStorage` lève une exception. Le jeu la rattrape et reste jouable — sans sauvegarde, mais jouable. L'écran restait auparavant **entièrement blanc**.

Boutons **Exporter / Importer** disponibles depuis le menu principal et la carte Finances.

## 🌍 Le reste de l'Europe joue aussi

Les **15 championnats sont disputés en parallèle** du vôtre. Chaque journée, les autres pays avancent au prorata de leur propre calendrier, avec un modèle allégé — score et buteurs, sans blessures ni cartons — pour que tout le monde boucle sa saison en même temps que vous.

Il en découle des classements étrangers réels, des **meilleurs buteurs dans chaque pays**, et surtout des **places européennes attribuées au mérite**. Auparavant seule votre ligue était simulée : les 235 clubs étrangers finissaient la saison à **0 point et 0 match**, et la Ligue des Champions se peuplait donc par **ordre alphabétique**.

Vérifié sur une saison : 15 championnats joués intégralement, moyenne des qualifiés en C1 à **80,0** contre **74,2** pour le monde entier, le tout en **1,1 seconde**.

Les matchs de **coupe nationale et de coupe d'Europe** comptent désormais eux aussi dans les statistiques individuelles : un joueur pouvait marquer quatorze buts en Ligue des Champions sans qu'aucun n'apparaisse sur sa fiche, soit jusqu'à un tiers de la saison d'un club invisible. Et les compétitions européennes sont menées à leur terme **avant** le calcul des primes — on pouvait remporter la Ligue des Champions en coulisses, toucher la prime d'une phase de ligue, et l'apprendre par une actualité de Supercoupe.

### Le classement ne se transforme plus en cliquet

La note de match récompensait la victoire d'un bonus fixe, sans jamais la rapporter à l'adversaire. La moyenne de saison était donc un décalque du classement : **100 % de l'effectif du premier progressait, 92 % de celui du dernier régressait**, et l'écart se creusait sans rappel — l'étendue des moyennes de club passait de 13,9 à 31,6 points en quinze saisons en Serie A, de 6,2 à 31,1 en Belgique.

Le résultat est maintenant mesuré **par rapport à l'attendu**, calculé sur l'écart de force et l'avantage du terrain : battre plus fort que soi rapporte, battre plus faible ne rapporte presque rien. La cage inviolée est pondérée de la même façon. Et le centre de formation s'ancre pour moitié sur la médiane du **championnat**, pas seulement sur celle du club — sans quoi un club affaibli formait des jeunes plus faibles, indéfiniment.

Mesuré sur quinze saisons et quatre graines : Serie A **13,9 → 11,8** (au lieu de 31,6), Belgique **6,2 → 10,6** (au lieu de 31,1), club le plus faible du monde **61,8** (au lieu de 52). Les championnats se resserrent ou s'ouvrent de quelques points selon la partie, ils ne partent plus en cliquet.

Les bandes de progression sont par ailleurs exprimées en **quantiles recalculés chaque fin de saison**, et non en valeurs absolues : des seuils fixes ne tenaient qu'une saison, la bande neutre tombant de 54 % à 21 % du monde en vingt ans.

### Un gardien peut redevenir une star

La note d'un gardien ne dépendait que des **buts encaissés** — une propriété d'équipe, que la pondération par l'attendu neutralise ensuite. Son classement à la moyenne de saison était donc presque indépendant de son niveau réel : les bons ne se détachaient jamais, là où un attaquant marque et se détache tout seul. À potentiel égal (86+), **41,5 % des attaquants atteignaient la note de 85, contre 23,6 % des gardiens**, et la part des gardiens dans l'élite tombait de **0,92 à 0,64 fois leur poids démographique** en vingt saisons.

Le gardien reçoit donc une **part individuelle** dans sa note de match, bornée et volontairement plus faible que le bruit d'équipe pour ne pas transformer la ligne en cliquet. Mesuré sur quatre graines et vingt saisons, la dérive de chaque ligne dans l'élite passe de **0,94 à 0,50 point cumulé**, et les quatre lignes s'améliorent à la fois — gardiens **0,64 → 1,07**, défenseurs 0,97 → 0,90, milieux 0,94 → 1,00, attaquants 1,26 → 1,08.

### Un joueur ne dépasse jamais son potentiel

Le potentiel cessait d'être un plafond à 24 ans : **7 % du monde jouait au-dessus du sien**, jusqu'à +13 points, et des trentenaires progressaient encore au lieu de décliner. Le potentiel plafonne désormais à tout âge — le plafond redevenait 94 dès 24 ans, si bien que le potentiel n'était plus consulté du tout —, le déclin commence bien à 30 ans, et la marche vers le potentiel se prolonge jusqu'au pic au lieu de s'arrêter net à 23 ans. Mesuré en suivant une cohorte de 297 jeunes **jusqu'à son pic** — et non quinze ans plus tard, une fois le déclin passé — la part atteignant son potentiel monte de 34 % à **55 %** (50 à 60 % selon la ligne).

Le potentiel lui-même n'est plus un cliquet : il pouvait monter, jamais descendre, si bien que le 95e centile mondial touchait le plafond dur de 94 dès la quatorzième saison. Mesuré sur quinze saisons : **p95 à 87**, 12 joueurs au potentiel maximal (contre plus de 290), 34 joueurs notés 90+ (contre 506).

Le trophée de **joueur de la saison** exigeait 8 matchs : il revenait à des remplaçants ayant joué le quart de la saison. Il en demande maintenant les deux tiers, et le nombre de matchs est inscrit sur le trophée.

### Le palmarès raconte enfin la carrière

Coupe nationale, parcours européen, Supercoupe et trophées individuels étaient enregistrés à chaque fin de saison mais lus par aucun écran : le palmarès n'affichait que le rang et le champion. Tout y figure désormais.

Le trophée de **meilleur buteur** annonçait par ailleurs un total faux dans huit saisons sur douze — trois fois ce n'était même pas le bon joueur : les derniers tours de coupe se jouaient *après* le calcul. Vérifié sur 40 saisons : **0 total faux**.

### Les places européennes se gagnent sur le terrain

Le barème par coefficient ne couvre que 78 des 96 tickets européens ; les 18 autres étaient attribués à la **note d'effectif seule**, sans regarder le classement — un 12e et un 15e se retrouvaient en Ligue des Champions. Ils vont désormais au mérite sportif : place au classement d'abord, coefficient du pays pour départager. Mesuré : pire place qualifiée en C1 **4e** au lieu de 15e, et plus aucun club devancé par un moins bien classé de son propre championnat.

Les échéances des coupes sont par ailleurs calculées **au prorata de la saison**. Codées en dur (J21, J25, J29, J33), elles tombaient hors saison dans un championnat court : avec 22 journées, la 8e journée de phase de ligue et les quatre tours de phase finale n'étaient **jamais** proposés — le Celtic voyait tout son parcours européen se jouer en coulisses. Vérifié : 8/8 journées offertes chaque saison, et la phase finale s'ouvre dès la qualification.

### Le jeu se pilote au clavier

Les onze postes du terrain et les noms de joueurs sont des éléments non natifs : ils étaient absents du parcours de tabulation, et aucune fenêtre ne se fermait avec Échap ni ne retenait le focus. Tout est désormais atteignable au clavier, Échap ferme, la tabulation reste piégée dans la fenêtre ouverte, le focus revient à l'élément qui l'a ouverte, et un contour de 3 px le signale.

### Les salaires suivent les joueurs

Le salaire n'était écrit qu'à la création : un jeune passé de 60 à 94 gardait à vie son salaire de jeune, et comme les gros salaires partaient à la retraite, la masse salariale mondiale fondait de 35 % en vingt saisons — l'argent cessait d'être une contrainte pour l'ordinateur. Elle se réévalue maintenant par paliers à chaque fin de saison, plus vite en fin de contrat. Mesuré sur vingt saisons : **99 à 107 %** de la masse de départ.

### Le niveau du monde ne s'effondre plus

Les seuils de progression de fin de saison étaient hors d'atteinte : mesuré sur 3 316 joueurs, **81 % étaient pénalisés et 0,2 % récompensés**, la bande « excellente saison » n'étant jamais servie. Un gardien ne pouvait mathématiquement pas l'atteindre — l'apport défensif avait une espérance nulle et la passe décisive ne rapportait rien.

Les seuils sont désormais calés sur la distribution réelle (p05 6,03 · médiane 6,36 · p95 6,78), l'apport défensif et la passe décisive sont valorisés, et les quatre lignes se tiennent à 0,13 point près. La note médiane mondiale se stabilise autour de **69** au lieu de glisser jusqu'à 63 et de continuer à descendre.

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
| `js/audio.js` | Bande son : synthèse Web Audio, bruitages de menu, import de vos fichiers |
| `js/pitchview.js` | Terrain animé : rôles, bloc d'équipe, inertie, circulation du ballon |
| `css/style.css` | Interface (thème stade) |
| `js/i18n.js` | Traduction : dictionnaire anglais + bascule FR/EN |
| `js/realdata.js` | Données réelles : couleurs & effectifs des 253 clubs |
| `js/data.js` | Base de données : championnats + générateur de joueurs |
| `js/engine.js` | Moteur : composition, forces d'équipe, simulation de match |
| `js/game.js` | Carrière : calendrier, classement, mercato, économie, retraites, formation, sauvegarde |
| `js/natdata.js` | Vraies sélections nationales (50 nations) |
| `js/cups.js` | Coupes d'Europe (phase de ligue + phase finale), Supercoupe, sélections |
| `js/ui.js` | Rendu des écrans et interactions |
| `FONTS-LICENSE.txt` | Licence SIL OFL 1.1 des polices embarquées |

Bon jeu ! ⚽
