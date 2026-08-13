/* ============================================================
   LANGUES — français (par défaut) / anglais
   FM.t("texte français") renvoie la traduction si la langue est EN.
   ============================================================ */
var FM = window.FM || {};
window.FM = FM;

const EN = {
  /* ----- Écran de démarrage ----- */
  "Gérez un club européen — du mercato au terrain.":"Run a European club — from the transfer market to the pitch.",
  "Carrière":"Career", "Master League":"Master League", "International":"International",
  "Nom du manager":"Manager name", "Manager":"Manager",
  "Choisissez un championnat":"Choose a league",
  "Choisissez votre club":"Choose your club",
  "Démarrer la carrière":"Start career",
  "Nom de votre club":"Your club name",
  "Couleurs du maillot (écusson)":"Kit colours (crest)",
  "Lancer la Master League":"Start Master League",
  "Compétition":"Competition",
  "Championnat d'Europe (16 nations)":"European Championship (16 nations)",
  "Coupe du Monde (32 nations)":"World Cup (32 nations)",
  "Choisissez votre sélection":"Choose your national team",
  "Lancer le tournoi":"Start tournament",
  "Reprendre la partie sauvegardée":"Continue saved game",
  "Supprimer la sauvegarde":"Delete save",
  "Supprimer la sauvegarde ?":"Delete the saved game?",
  "Partie sauvegardée automatiquement dans votre navigateur.":"Game saved automatically in your browser.",
  "Langue":"Language", "Français":"French", "Anglais":"English",
  "Vous démarrez dans le championnat de votre choix, à la place de son club le plus faible, avec un effectif « maison » aux noms iconiques (Castolo, Espimas, Minanda…) et un petit budget. Piochez parmi les agents libres ou achetez à d'autres clubs, puis bâtissez une grande équipe au fil des saisons.":"You start in the league of your choice, replacing its weakest club, with a home-grown squad of iconic names (Castolo, Espimas, Minanda…) and a small budget. Sign free agents or buy from other clubs, then build a great team season after season.",
  "Disputez le tournoi à élimination directe avec la sélection de votre choix. Composez votre effectif parmi près de 500 joueurs de la nation.":"Play the knockout tournament with the national team of your choice. Build your squad from nearly 500 players of that nation.",

  /* ----- Navigation ----- */
  "Accueil":"Home", "Effectif":"Squad", "Tactique":"Tactics", "Mercato":"Transfers",
  "Europe":"Europe", "Coupe":"Cup", "Classement":"Table", "Calendrier":"Fixtures", "Actus":"News",
  "Saison":"Season", "Journée":"Matchday", "Budget":"Budget", "Note effectif":"Squad rating",
  "Menu principal":"Main menu", "Retour à la carrière":"Back to career",

  /* ----- Accueil ----- */
  "Objectif de saison":"Season objective",
  "Dernières actualités":"Latest news",
  "Journal du club":"Club news",
  "Offres reçues":"Offers received",
  "Accepter":"Accept", "Refuser":"Reject",
  "Jouer le match":"Play match", "Simuler rapidement":"Quick simulate",
  "Saison suivante":"Next season", "terminée":"finished",
  "Champion":"Champion", "termine":"finishes", "avec":"with", "pts":"pts",
  "À domicile":"Home", "À l'extérieur":"Away", "Vous êtes":"You are",
  "Rendez-vous à jouer":"Fixtures to play",
  "Y aller":"Go there",
  "à jouer":"to play",
  "Ces rencontres sont rattachées à votre calendrier : elles apparaissent ici et dans l'onglet Calendrier.":"These fixtures are tied to your calendar: they appear here and in the Fixtures tab.",
  "Infirmerie & suspensions":"Injuries & suspensions",
  "indisponible(s) dans votre onze — corrigez la composition (onglet Tactique).":"unavailable in your XI — fix your line-up (Tactics tab).",
  "Onze incomplet — complétez votre équipe (Tactique).":"Incomplete XI — complete your team (Tactics).",

  /* ----- Effectif / fiche joueur ----- */
  "joueurs":"players", "Masse salariale":"Wage bill",
  "Poste":"Pos", "Nom":"Name", "Nat":"Nat", "Âge":"Age", "Note":"Rating", "Pot":"Pot",
  "Valeur":"Value", "Forme":"Form", "Moral":"Morale", "Matchs":"Apps", "Buts":"Goals",
  "Passes déc.":"Assists", "Note moyenne":"Avg rating",
  "Vendre":"Sell", "Retirer":"Unlist", "Prêter":"Loan out", "Rendre":"Return", "Signer":"Sign", "Offre":"Bid",
  "Cliquez sur un nom pour la fiche du joueur. « Prêter » envoie un joueur en prêt une saison ; les prêts entrants portent le badge 🔁.":"Click a name for the player profile. \"Loan out\" sends a player away for the season; incoming loans carry the 🔁 badge.",
  "Joueurs prêtés":"Players out on loan",
  "Rappeler":"Recall", "retour fin de saison":"returns at season's end",
  "Potentiel":"Potential", "Salaire":"Wage", "Contrat":"Contract", "an":"year", "ans":"years",
  "Saison en cours":"Current season", "buts":"goals", "passes":"assists", "matchs":"apps", "moy":"avg",
  "Carrière — totaux":"Career — totals",
  "Première saison en cours — l'historique se construira au fil des saisons.":"First season under way — history will build up over time.",
  "Club":"Club", "Sélection":"National team", "Fermer":"Close", "Annuler":"Cancel",
  "Blessé":"Injured", "Suspendu":"Suspended", "indisponible":"unavailable", "journée(s)":"matchday(s)",
  "blessé":"injured", "suspendu":"suspended", "j.":"md",
  "Avertissements cette saison":"Bookings this season",
  "prochain carton = suspension":"next booking = suspension",
  "Convoqué en":"Called up for",

  /* ----- Tactique ----- */
  "Formation & consignes":"Formation & instructions",
  "Formation":"Formation", "Mentalité":"Mentality", "Tempo":"Tempo", "Pressing":"Pressing",
  "Défensive":"Defensive", "Équilibrée":"Balanced", "Offensive":"Attacking",
  "Lent":"Slow", "Normal":"Normal", "Rapide":"Fast",
  "Bas":"Low", "Moyen":"Medium", "Haut":"High",
  "Composer automatiquement":"Auto pick",
  "Composition sur le terrain":"Line-up on the pitch",
  "Attaque":"Attack", "Milieu":"Midfield", "Défense":"Defence", "Global":"Overall",
  "Cliquez sur un poste pour changer le joueur titulaire.":"Click a position to change the starting player.",
  "Choisir un joueur":"Choose a player",

  /* ----- Mercato ----- */
  "Nom du joueur…":"Player name…",
  "Tous les joueurs":"All players", "Agents libres":"Free agents",
  "Transférables":"Transfer-listed", "Disponibles en prêt":"Available on loan",
  "Tous postes":"All positions", "Toute note":"Any rating", "Tout potentiel":"Any potential",
  "Tout âge":"Any age", "Tout prix":"Any price", "≤ mon budget":"≤ my budget",
  "Trier : note":"Sort: rating", "Trier : potentiel":"Sort: potential",
  "Trier : valeur ↓":"Sort: value ↓", "Trier : valeur ↑":"Sort: value ↑", "Trier : âge ↑":"Sort: age ↑",
  "Statut":"Status", "Libre":"Free", "Prêter chez moi":"Loan in",
  "Aucun joueur ne correspond aux filtres.":"No player matches these filters.",
  "Aucun joueur disponible en prêt selon ces filtres.":"No player available on loan with these filters.",
  "Mercato fermé":"Transfer window closed", "Mercato d'été":"Summer transfer window",
  "Mercato d'hiver":"Winter transfer window",
  "Aucun achat, vente ou prêt possible pour vous comme pour les clubs IA.":"No buying, selling or loans — for you or the AI clubs.",
  "Hors période de mercato":"Outside the transfer window",
  "Montant de l'offre (M€)":"Bid amount (€M)", "Prime à la signature (M€)":"Signing bonus (€M)",
  "Soumettre l'offre":"Submit bid", "Valeur estimée":"Estimated value", "Votre budget":"Your budget",
  "aucune indemnité de transfert":"no transfer fee", "prime demandée ≈":"bonus asked ≈",

  /* ----- Classement / stats ----- */
  "Meilleurs buteurs":"Top scorers", "Meilleurs passeurs":"Top assists", "Meilleures notes":"Best ratings",
  "Ligue des Champions (1-3) · Europa (4-6) · Relégation (3 derniers)":"Champions League (1-3) · Europa (4-6) · Relegation (bottom 3)",
  "Calendrier & résultats":"Fixtures & results",
  "Rendez-vous internationaux":"International fixtures",
  "Été":"Summer", "à suivre":"upcoming", "facultatif":"optional", "votre sélection":"your team",
  "jouable depuis l'Accueil":"playable from Home", "Terminé":"Finished", "Vainqueur":"Winner",

  /* ----- Compétitions ----- */
  "Ligue des Champions":"Champions League", "Ligue Europa":"Europa League",
  "Ligue Conférence":"Conference League", "Coupe du Monde":"World Cup",
  "Championnat d'Europe":"European Championship",
  "Finale":"Final", "Demi-finales":"Semi-finals", "Quarts de finale":"Quarter-finals",
  "Huitièmes de finale":"Round of 16", "Seizièmes de finale":"Round of 32",
  "Trente-deuxièmes":"Round of 64",
  "phase de ligue":"league phase", "phase finale":"knockout phase",
  "Phase de ligue":"League phase",
  "Classement — les 16 premiers qualifiés":"Table — top 16 qualify",
  "Top 16 → phase à élimination directe (aller-retour)":"Top 16 → knockout phase (two legs)",
  "Simuler ce tour":"Simulate this round", "Simuler la journée":"Simulate matchday",
  "Simuler toute la phase":"Simulate whole phase", "Voir la suite":"See what follows",
  "Voir le vainqueur":"See the winner", "Simuler jusqu'à la fin":"Simulate to the end",
  "Vous avez été éliminé.":"You have been knocked out.",
  "Vous avez été éliminé de la coupe.":"You have been knocked out of the cup.",
  "Votre club n'est pas qualifié cette saison.":"Your club is not qualified this season.",
  "résultats":"results", "match sec":"single leg", "aller-retour":"two legs",
  "exempt":"bye", "Exempt":"Bye",
  "Votre club est exempt ce tour : qualifié d'office pour le tour suivant.":"Your club has a bye this round: automatically through to the next round.",
  "Tour suivant":"Next round",
  "La coupe nationale se met en place en début de saison.":"The national cup starts at the beginning of the season.",
  "Les coupes d'Europe se mettent en place en début de saison.":"European cups start at the beginning of the season.",
  "VAINQUEUR ! Félicitations !":"WINNERS! Congratulations!",
  "VAINQUEUR DE LA COUPE ! Félicitations !":"CUP WINNERS! Congratulations!",
  "CHAMPION !":"CHAMPIONS!",

  /* ----- Composition sélection ----- */
  "Composez votre":"Build your",
  "Choisissez 11 titulaires + des remplaçants (23 max) parmi ~500 joueurs. ★ = titulaire, ✕ = retirer.":"Pick 11 starters + substitutes (23 max) from ~500 players. ★ = starter, ✕ = remove.",
  "Vivier":"Player pool", "Titulaires":"Starters", "Remplaçants":"Substitutes",
  "Ajoutez des remplaçants pour la profondeur de banc.":"Add substitutes for squad depth.",
  "Rechercher un joueur…":"Search a player…", "Tous":"All",
  "Effectif complet (23).":"Squad full (23).", "Onze complet — retirez un joueur d'abord.":"XI complete — remove a player first.",
  "Sélection auto":"Auto pick", "Valider et jouer":"Confirm and play",
  "Force du onze":"XI strength", "Force de l'équipe":"Team strength",
  "affichés sur":"shown of", "affinez la recherche":"refine your search",
  "Aucun joueur ne correspond.":"No matching player.",

  /* ----- Match en direct ----- */
  "Causerie":"Team talk", "Face à":"Against",
  "Votre discours influe sur la performance de l'équipe.":"Your talk affects the team's performance.",
  "Rassurer":"Reassure", "Confiance en hausse — sans risque.":"Confidence up — no risk.",
  "Hausser le ton":"Raise your voice",
  "Galvanise un groupe conquérant, crispe un groupe fragile.":"Fires up a confident squad, unsettles a fragile one.",
  "Consignes neutres":"Neutral instructions", "Aucun effet.":"No effect.",
  "moral moyen":"average morale",
  "Pause":"Pause", "Reprendre":"Resume", "Fin du match":"End match", "Continuer":"Continue",
  "Coaching":"Coaching", "Consignes":"Instructions",
  "Fermer le jeu":"Shut up shop", "Équilibrer":"Balance", "Tout attaquer":"All-out attack",
  "Remplacements":"Substitutions", "remplacer par":"replace with",
  "Reprendre le match":"Resume match",
  "Aucun remplaçant disponible.":"No substitute available.",
  "Quota de remplacements atteint.":"No substitutions left.",
  "Mi-temps":"Half-time", "Fin du match —":"Full time —",
  "BUT":"GOAL", "se blesse":"is injured", "est expulsé":"is sent off", "avertissement":"booked",
  "Coup de sifflet final":"Full time",
  "Match en pause — pensez à remplacer votre blessé.":"Match paused — consider replacing your injured player.",
  "Match en pause — réorganisez votre équipe à 10.":"Match paused — reorganise with ten men.",
  "Qualifié":"Through", "Éliminé":"Knocked out", "Cumul":"Aggregate", "tab":"pens",

  /* ----- Divers ----- */
  "Palmarès / historique":"Honours / history",
  "ouvert — ferme après la journée":"open — closes after matchday",
  "réouverture au mercato d'hiver (journée":"reopens for the winter window (matchday",
  "réouverture au mercato d'été (saison prochaine)":"reopens for the summer window (next season)",
  "moy":"avg", "Aucune":"None", "Rien à signaler pour l'instant.":"Nothing to report yet.",
  "Effectif complet (30 max). Vendez d'abord.":"Squad full (30 max). Sell someone first.",
  "Budget insuffisant":"Insufficient budget",
  "domicile":"home", "extérieur":"away", "contre":"vs", "Vainqueur :":"Winner:",
  "er":"st", "e":"th"
};

let LANG = "fr";
try { LANG = localStorage.getItem("fm_lang") || "fr"; } catch(e){}

FM.lang = () => LANG;
FM.setLang = function(l){
  LANG = (l==="en") ? "en" : "fr";
  try { localStorage.setItem("fm_lang", LANG); } catch(e){}
};
/* Traduit une chaîne (renvoie l'original si absent du dictionnaire) */
FM.t = function(s){
  if (LANG !== "en") return s;
  return Object.prototype.hasOwnProperty.call(EN, s) ? EN[s] : s;
};
FM.EN_DICT = EN;
