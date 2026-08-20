/* ============================================================
   CARRIÈRE — état du jeu, calendrier, classement, mercato, sauvegarde
   ============================================================ */
var FM = window.FM;
FM.t = FM.t || (s=>s);   // repli si le module de langue n'est pas chargé
var SAVE_KEY = "fm_carriere_save_v1";

FM.state = null;

/* ---------- Nouvelle partie ---------- */
FM.newGame = function(managerName, clubId, seed){
  FM.setSeed(seed || 20260810);
  FM.invalidateSchedules();                  // rien de la partie précédente ne survit
  const db = FM.buildDatabase();
  const club = db.clubs.find(c => c.id === clubId);
  const ligue = club.ligue;
  const clubsLigue = db.clubs.filter(c => c.ligue === ligue);

  FM.state = {
    db,
    mode: "career",
    managedClubId: clubId,
    managerName: managerName || "Manager",
    ligueJoueur: ligue,
    saison: 1,
    journee: 0,
    calendrier: FM.makeSchedule(clubsLigue.map(c=>c.id)),
    resultats: [],
    news: [],
    offres: [],          // offres reçues pour nos joueurs listés
    historique: [],
    objectif: objectifFor(club, clubsLigue.length),
    objectifRang: objectifRangFor(club, clubsLigue.length),
    confiance: 65,          /* confiance des dirigeants, 0 à 100 */
    echecs: 0               /* saisons consécutives sans atteindre l'objectif */
  };
  createSecondDivision(ligue, 18);
  addNews(`${FM.t('Bienvenue')} ${FM.state.managerName} ! ${FM.t('Vous prenez les rênes de')} ${club.nom}. ${FM.t('Objectif')} : ${FM.state.objectif}.`);
  FM.setupEuropeanCups();
  const pc0 = FM.state.europe.playerComp;
  if (pc0) addNews(`${club.nom} ${FM.t('est engagé en')} ${FM.state.europe[pc0].nom} ${FM.t('cette saison !')}`, "cup");
  FM.setupDomesticCup();
  addNews(`${FM.state.coupe.nom} : ${FM.t('le tirage est fait, à vous de jouer !')}`, "cup");
  FM.state.freeAgents = FM.makeFreeAgents(46, club.pays);
  /* Le monde est en place : le grand livre repart de zéro, il ne comptabilise
     que ce qui bouge À PARTIR DE MAINTENANT. */
  FM.state.eco = Object.assign({}, ECO0);
  adopterVersionDisque();                    /* nouvelle partie : on écrase l'ancienne */
  FM.save();
  return FM.state;
};

/* Coupe nationale du championnat du joueur (élimination directe, match sec) */
FM.setupDomesticCup = function(){
  FM.state.coupe = FM.makeDomesticCup(FM.state.ligueJoueur, FM.state.managedClubId);
  return FM.state.coupe;
};

/* ---------- Nouvelle partie : MODE MASTER LEAGUE ----------
   Vous créez votre club (effectif "maison" faible + petit budget) qui
   prend la place du club le plus modeste du championnat choisi.          */
FM.newMasterLeague = function(managerName, clubName, leagueId, seed, kitColors){
  FM.setSeed(seed || 20260810);
  const db = FM.buildDatabase();
  const lgMeta = FM.LEAGUES.find(l => l.id === leagueId);
  const lgClubs = db.clubs.filter(c => c.ligue === leagueId);

  // Le club le plus faible cède sa place à votre club
  lgClubs.sort((a,b) => a.rep - b.rep || a.budgetTotal - b.budgetTotal);
  const removed = lgClubs[0];
  db.clubs = db.clubs.filter(c => c.id !== removed.id);

  const newId = Math.max(...db.clubs.map(c => c.id)) + 1;
  const mlClub = {
    id: newId, nom: clubName || "FC Master", ligue: leagueId,
    ligueNom: lgMeta.nom, pays: lgMeta.pays,
    couleurs: (kitColors && kitColors.length>=2) ? kitColors : ["#111827","#e5e7eb"],
    rep: 1, budget: 12, budgetTotal: 20,
    joueurs: FM.makeMasterSquad(lgMeta.pays, true),   // effectif « maison » aux noms iconiques
    formation: "4-4-2",
    tactique: { mentalite:1, tempo:1, pressing:1, largeur:1 },
    onze: [], pts:0, j:0, g:0, n:0, p:0, bp:0, bc:0
  };
  mlClub.onze = FM.autoPickXI(mlClub);
  db.clubs.push(mlClub);

  FM.state = {
    db,
    mode: "master",
    managedClubId: newId,
    managerName: managerName || "Manager",
    ligueJoueur: leagueId,
    saison: 1,
    journee: 0,
    calendrier: FM.makeSchedule(db.clubs.filter(c=>c.ligue===leagueId).map(c=>c.id)),
    resultats: [],
    news: [],
    offres: [],
    historique: [],
    objectif: FM.t("assurer le maintien et bâtir votre club"),
    objectifRang: 99,       /* première saison : aucun couperet */
    confiance: 70,
    echecs: 0
  };
  createSecondDivision(leagueId, 18);
  addNews(`Master League — ${FM.state.managerName} ${FM.t('fonde')} ${mlClub.nom} ${FM.t('et intègre la')} ${lgMeta.nom} (${FM.t('à la place de')} ${removed.nom}). ${FM.t('Budget de départ')} : ${mlClub.budget.toFixed(1)} M€.`);
  FM.setupEuropeanCups();                     // (un promu n'est en général pas qualifié)
  FM.setupDomesticCup();                       // engagé en coupe nationale dès la 1re saison
  addNews(`${FM.t('Engagé en')} ${FM.state.coupe.nom} : ${FM.t('une chance de titre dès cette saison !')}`, "cup");
  // ML : vivier d'agents libres plus fourni pour bâtir l'équipe avec un budget fixé
  FM.state.freeAgents = FM.makeFreeAgents(56, lgMeta.pays);
  addNews(`${FM.state.freeAgents.length} ${FM.t('agents libres disponibles (onglet Mercato).')}`, "transfer");
  FM.state.eco = Object.assign({}, ECO0);     /* cf. newGame : baseline à zéro */
  adopterVersionDisque();                    /* nouvelle partie : on écrase l'ancienne */
  FM.save();
  return FM.state;
};

/* ---------- Confiance des dirigeants ----------
   Elle bouge en cours de saison selon la place au classement, et bascule
   franchement au verdict de fin de saison. Deux objectifs manqués de suite,
   ou une confiance tombée à zéro, et le manager est remercié.            */
FM.confiance = () => (FM.state && typeof FM.state.confiance === "number") ? FM.state.confiance : 65;
FM.confianceLabel = function(){
  const c = FM.confiance();
  if (c >= 80) return FM.t("Totale");
  if (c >= 60) return FM.t("Solide");
  if (c >= 40) return FM.t("Mitigée");
  if (c >= 20) return FM.t("Fragile");
  return FM.t("Au bord de la rupture");
};
function majConfiance(delta){
  FM.state.confiance = Math.max(0, Math.min(100, FM.confiance() + delta));
}
/* Dérive en cours de saison : un point tous les quatre matchs */
function confianceEnCours(){
  if (FM.state.journee % 4 !== 0) return;
  const rang = FM.myRank(), cible = FM.state.objectifRang || 99;
  if (!rang) return;
  majConfiance(rang <= cible ? 1 : rang <= cible + 3 ? 0 : -2);
}
/* Verdict de fin de saison : objectif atteint ou non */
function evaluerObjectif(rang, nClubs){
  const cible = FM.state.objectifRang || 99;
  const reussi = rang <= cible;
  const large  = rang <= Math.max(1, cible - 2);
  const loin   = rang > cible + 4;
  majConfiance(reussi ? (large ? 25 : 15) : (loin ? -35 : -18));
  FM.state.echecs = reussi ? 0 : (FM.state.echecs || 0) + 1;
  const ord = n => n + (n===1 ? FM.t("er") : FM.t("e"));
  addNews(reussi
    ? `${FM.t('Objectif atteint')} (${ord(rang)} / ${nClubs}) — ${FM.t('les dirigeants sont satisfaits.')} `
      + `${FM.t('Confiance')} : ${FM.confianceLabel()}.`
    : `${FM.t('Objectif manqué')} (${ord(rang)} / ${nClubs}, ${FM.t('attendu')} ${ord(cible)}) — `
      + `${FM.t('Confiance')} : ${FM.confianceLabel()}.`, "season");
  /* Licenciement */
  if ((FM.state.echecs >= 2 || FM.confiance() <= 0) && FM.state.mode !== "master"){
    FM.state.sacked = true;
    FM.state.sackOffers = proposerClubs();
    addNews(`${FM.t('Vous êtes remercié par')} ${FM.myClub().nom}. ${FM.t('Trois clubs vous font signe.')}`, "season");
  }
}
/* Trois clubs prêts à vous accueillir : un cran en dessous, toutes divisions */
function proposerClubs(){
  const actuel = FM.myClub();
  const cands = FM.state.db.clubs.filter(c =>
    c.id !== actuel.id && c.rep <= Math.max(1, actuel.rep) && !FM.isD2(c.ligue));
  const melange = cands.slice().sort(() => FM._rnd() - 0.5).slice(0, 3);
  return melange.map(c => ({ id:c.id, nom:c.nom, ligue:c.ligueNom, rep:c.rep,
                             note:FM.squadRating(c), budget:+c.budget.toFixed(1) }));
}
/* Reprendre un club après un licenciement */
FM.takeOverClub = function(clubId){
  const c = FM.clubById(clubId);
  if (!c) return false;
  FM.state.managedClubId = c.id;
  FM.state.ligueJoueur  = c.ligue;
  ensureSecondDivision(FM.baseLeagueId(c.ligue));
  pruneSecondDivisions();                    // les D2 des pays quittés s'en vont
  FM.state.calendrier   = FM.makeSchedule(FM.clubsInMyLeague().map(x=>x.id));
  FM.state.journee = 0; FM.state.resultats = []; FM.state.offres = []; FM.state.progres = {};
  FM.invalidateSchedules();                  // nouveau pays, nouvelles divisions
  FM.state.confiance = 60; FM.state.echecs = 0;
  FM.state.sacked = false; FM.state.sackOffers = null;
  FM.state.fin = { rec:0, sal:0, alerte:false };
  FM.setObjective();
  FM.setupEuropeanCups();
  FM.setupDomesticCup();
  addNews(`${FM.t('Vous prenez les rênes de')} ${c.nom}. ${FM.t('Objectif')} : ${FM.state.objectif}.`, "season");
  FM.save();
  return true;
};

/* ---------- Divisions ----------
   La D2 d'un pays porte l'identifiant du championnat suffixé « -D2 ».
   Tout le reste du jeu filtre déjà sur club.ligue : rien d'autre à changer. */
const D2ID = id => FM.baseLeagueId(id) + "-D2";
FM.isD2 = id => /-D2$/.test(id || "");
FM.baseLeagueId = id => String(id || "").replace(/-D2$/, "");
FM.leagueMeta = function(id){
  const base = FM.LEAGUES.find(l => l.id === FM.baseLeagueId(id));
  if (!base) return { id, nom:String(id), pays:"FRA" };
  return FM.isD2(id) ? { id:D2ID(id), nom: base.nom + " " + FM.t("Division 2"), pays: base.pays } : base;
};
/* Crée la deuxième division du pays du joueur (clubs modestes générés) */
function createSecondDivision(lgId, n){
  const meta = FM.leagueMeta(D2ID(lgId));
  for (let i=0; i<n; i++){
    const c = makePromotedClub(meta);
    c.genere = true;                          /* club inventé, pas un club réel */
    FM.state.db.clubs.push(c);
    /* Un club qui apparaît apporte sa trésorerie : c'est une entrée dans le
       circuit, elle doit être écrite au grand livre. Reprendre un club dans
       un nouveau pays créait sinon ~57 M€ à partir de rien. */
    eco().recettes += c.budget || 0;
  }
}
/* Garantit une D2 fournie : sans elle, la première division se viderait
   de trois clubs par saison sans jamais être réalimentée. */
function ensureSecondDivision(lgId, cible){
  cible = cible || 18;
  const d2 = D2ID(lgId);
  const n = FM.state.db.clubs.filter(c=>c.ligue===d2).length;
  if (n < cible) createSecondDivision(lgId, cible - n);
}
FM.ensureSecondDivision = ensureSecondDivision;

/* Retire les deuxièmes divisions devenues inutiles. Seul le pays du joueur a
   besoin d'une D2 : la montée/descente ne tourne que dans son championnat.
   Sans ce ménage, chaque changement de pays ajoutait 18 clubs et ~420 joueurs
   à la base pour toujours — la sauvegarde dépassait le quota du navigateur
   au douzième pays, et ces divisions fantômes étaient simulées chaque
   journée pour rien. */
/* Un club va disparaître : les prêts qui le désignent doivent être dénoués
   proprement, sinon le joueur est détruit à la fin de la saison (son club
   parent n'existe plus, personne ne le récupère). */
function libererPretsDe(clubId){
  for (const c of FM.state.db.clubs) for (const p of c.joueurs){
    if (!p.loan) continue;
    if (p.loan.parentId === clubId){
      /* le club détenteur le garde définitivement : il n'a plus de club parent */
      delete p.loan;
      p.loanCooldown = FM.state.saison;
    } else if (p.loan.borrowerId === clubId){
      /* l'emprunteur disparaît : retour immédiat au club parent */
      returnLoan(p.id, false);
    }
  }
  FM.state.prets = (FM.state.prets||[]).filter(pr =>
    pr.parentId !== clubId && pr.borrowerId !== clubId);
}
function pruneSecondDivisions(){
  const garder = D2ID(FM.baseLeagueId(FM.state.ligueJoueur));
  const avant = FM.state.db.clubs.length;
  const survivants = [];
  let retires = 0;
  for (const c of FM.state.db.clubs){
    const aPurger = FM.isD2(c.ligue) && c.ligue !== garder && c.id !== FM.state.managedClubId;
    /* On ne supprime QUE les clubs inventés pour peupler la division. Un club
       RÉEL relégué dans une D2 qu'on abandonne doit survivre : la purge en a
       détruit jusqu'à vingt (Torino, Udinese, Rennes…) avec leurs effectifs,
       et la première division du pays se retrouvait diluée de clubs générés. */
    if (aPurger && !c.genere){
      /* Il RESTE dans sa division, tel quel. Le remonter en première division
         gonflerait celle-ci au-delà de sa taille (mesuré : PL 20→22,
         POR 17→20). La D2 abandonnée se réduit donc aux seuls clubs réels qui
         y sont descendus — quelques-uns, sans incidence sur la sauvegarde. */
      survivants.push(c);
      continue;
    }
    if (aPurger){
      /* la trésorerie du club disparaît du circuit : on la sort du grand livre */
      eco().recettes -= c.budget || 0;
      /* et les prêts qui le concernent ne doivent pas devenir orphelins */
      libererPretsDe(c.id);
      retires++;
      continue;
    }
    survivants.push(c);
  }
  if (!retires) return 0;
  FM.state.db.clubs = survivants;
  FM.invalidateSchedules();
  if (FM.state.progres) for (const k of Object.keys(FM.state.progres))
    if (FM.isD2(k) && k !== garder) delete FM.state.progres[k];
  return avant - survivants.length;
}
FM.pruneSecondDivisions = pruneSecondDivisions;
FM.nRelegated = n => n >= 20 ? 3 : (n >= 14 ? 2 : 1);

/* ---------- Objectif de saison ----------
   Un intitulé lisible ET un rang à atteindre, désormais réellement évalué. */
function objectifFor(club, nClubs){
  if (FM.isD2(club.ligue)) return FM.t("remonter en première division");
  if (club.rep >= 5) return FM.t("remporter le titre");
  if (club.rep === 4) return FM.t("terminer sur le podium");
  if (club.rep === 3) return FM.t("accrocher une place européenne (top 6)");
  if (club.rep === 2) return FM.t("atteindre le milieu de tableau");
  return FM.t("assurer le maintien");
}
function objectifRangFor(club, nClubs){
  nClubs = nClubs || 20;
  if (FM.isD2(club.ligue)) return FM.nRelegated(nClubs);      /* monter */
  if (club.rep >= 5) return 1;
  if (club.rep === 4) return 3;
  if (club.rep === 3) return 6;
  if (club.rep === 2) return Math.max(8, Math.round(nClubs*0.5));
  return Math.max(1, nClubs - FM.nRelegated(nClubs));          /* rester devant la zone rouge */
}
/* Fixe l'objectif du club dirigé pour la saison qui commence */
FM.setObjective = function(){
  const c = FM.myClub(), n = FM.clubsInMyLeague().length;
  FM.state.objectif = objectifFor(c, n);
  FM.state.objectifRang = objectifRangFor(c, n);
};

/* ---------- Entraînement ----------
   Trois orientations qui se partagent la semaine. La part neutre est 1/3 :
   au-dessus, on gagne dans ce domaine, en dessous, on perd.            */
FM.TRAINING_DEFAULT = { physique:34, technique:33, tactique:33 };
FM.training = function(){
  if (!FM.state) return FM.TRAINING_DEFAULT;
  if (!FM.state.entrainement) FM.state.entrainement = Object.assign({}, FM.TRAINING_DEFAULT);
  return FM.state.entrainement;
};
FM.setTraining = function(t){
  const somme = (t.physique||0)+(t.technique||0)+(t.tactique||0);
  /* Trois curseurs à zéro n'ont aucun sens : l'écran affichait « 0 % / 0 % /
     0 % » et l'entraînement ne faisait plus rien. On retombe sur la
     répartition équilibrée. */
  if (somme <= 0) t = FM.TRAINING_DEFAULT;
  const tot = Math.max(1, (t.physique||0)+(t.technique||0)+(t.tactique||0));
  FM.state.entrainement = {
    physique: Math.round((t.physique||0)/tot*100),
    technique: Math.round((t.technique||0)/tot*100),
    tactique: Math.round((t.tactique||0)/tot*100)
  };
  FM.save();
  return FM.state.entrainement;
};
/* écart à la répartition neutre : −0,5 (rien) … 0 (un tiers) … +1 (tout) */
FM.trainingEdge = function(cle){
  const t = FM.training();
  const tot = (t.physique+t.technique+t.tactique) || 100;
  /* Échelle SYMÉTRIQUE. L'ancienne rendait +1 au maximum et −0,5 au minimum :
     toute allocation au-dessus d'un tiers était à espérance positive, et
     « 100 % technique » devenait une stratégie dominante (+5,3 points
     d'effectif et +2,7 titres sur douze saisons, sans contrepartie). */
  const part = t[cle]/tot;
  return part >= 1/3 ? (part - 1/3) / (2/3) : (part - 1/3) * 3;
};

/* ---------- Économie ----------
   Recettes de référence par réputation (M€ par saison), calibrées sur les
   masses salariales observées dans la base : un effectif conforme au rang
   du club équilibre ses comptes, un effectif surpayé creuse le déficit.
   (mesuré : masse salariale annuelle médiane 21 / 29 / 42 / 66 / 129 M€
    pour les réputations 1 à 5)                                          */
const REV_BY_REP = { 1:21.5, 2:29.5, 3:42.5, 4:66, 5:128 };
/* Une saison vaut 38 semaines de salaire, quel que soit le championnat suivi.
   C'est l'unité sur laquelle REV_BY_REP est calibré, et elle doit l'être des
   deux côtés du compte : applyFinances étale la recette annuelle sur le
   calendrier réellement joué, et doit étaler la masse salariale de la même
   façon. Sans cela, suivre un championnat court enrichissait le monde entier
   — une carrière écossaise (22 journées) ne prélevait que 22 semaines de
   salaire pour une année pleine de recettes, et le Celtic encaissait
   9 621 M€ pour 5 776 M€ de salaires. */
const SEMAINES_PAR_SAISON = 38;

/* ---------- CIRCUIT MONÉTAIRE ----------
   Règle : tout euro qui quitte la trésorerie d'un club arrive dans celle d'un
   autre. Les transferts et les prêts sont donc de pures redistributions.
   Les seules entrées/sorties du circuit sont explicites et comptabilisées
   dans FM.state.eco, ce qui rend l'invariant vérifiable :

     masse(t) = masse(0) + eco.recettes − eco.salaires − eco.primes + eco.regul

   (« primes » = signatures d'agents libres, qui vont au joueur et non à un
    club ; « regul » = écrêtage des trésoreries IA, cf. applyFinances.)       */
const ECO0 = { recettes:0, salaires:0, primes:0, regul:0 };
function eco(){
  if (!FM.state.eco) FM.state.eco = Object.assign({}, ECO0);
  return FM.state.eco;
}
FM.eco = eco;
const round2 = v => Math.round(v*100)/100;
/* Somme des trésoreries : doit rester stable à chaque transfert ou prêt */
/* Pas de round2 sur le TOTAL : chaque arrondi individuel est déjà porté au
   grand livre, arrondir la somme réintroduisait un résidu constant. */
FM.moneyMass = () => FM.state.db.clubs.reduce((a,c)=>a+(c.budget||0), 0);
/* Déplace `m` M€ du club `from` vers le club `to`. L'un des deux peut être
   null (club hors base) : le mouvement est alors porté au poste `poste`. */
function moveMoney(from, to, m, poste){
  /* typeof est indispensable : la chaîne "12" satisfait `> 0` et isFinite par
     coercition, et déplaçait donc réellement 12 M€. */
  if (typeof m !== "number" || !isFinite(m) || m <= 0 || m > MONTANT_MAX) return;
  m = round2(m);
  const E = eco();
  /* L'arrondi au centime de CHAQUE trésorerie crée un écart : il est porté au
     grand livre, exactement comme le fait applyFinances. Sans cela, un simple
     achat faisait apparaître ou disparaître quelques milliers d'euros. */
  if (from){
    const vise = from.budget - m;
    from.budget = round2(vise);
    E.regul += from.budget - vise;
  }
  if (to){
    const vise = to.budget + m;
    to.budget = round2(vise);
    E.regul += to.budget - vise;
  }
  if (!from && !to) return;
  if (!to)   E[poste || "primes"] += m;
  if (!from) E[poste || "primes"] -= m;
}
FM.moveMoney = moveMoney;
/* Un montant saisi par le joueur est-il exploitable ? (garde-fou NaN) */
FM.validAmount = m => typeof m === "number" && isFinite(m) && m >= 0;

/* masse salariale hebdomadaire, en k€ */
FM.wageBill = club => club.joueurs.reduce((a,p)=>a+(p.salaire||0), 0);
/* recettes de la saison pour un club, avant modulation par le classement */
/* Les recettes dépendent de la réputation ET de la division : un relégué ne
   perdait qu'un cran de réputation, si bien qu'un club de D2 pouvait encaisser
   deux fois plus qu'un club de l'élite — et son plafond de trésorerie suivait.
   La deuxième division touche 45 % du barème. */
FM.seasonRevenue = club => (REV_BY_REP[club.rep] || 30) * (FM.isD2(club.ligue) ? 0.45 : 1);

/* Encaisse les recettes et paie les salaires de la journée écoulée.
   Le classement module les recettes de −15 % (dernier) à +15 % (premier). */
function applyFinances(){
  const total = FM.totalMatchdays() || 38;
  const rank = {};
  let n = 0;
  try {
    const t = FM.table();
    n = t.length;
    t.forEach((r,i)=>{ rank[r.id] = i+1; });
  } catch(e){ /* classement indisponible : modulation neutre */ }
  const my = FM.state.managedClubId;
  FM.state.fin = FM.state.fin || { rec:0, sal:0 };
  const E = eco();
  for (const c of FM.state.db.clubs){
    /* M€ pour la journée : la masse salariale ANNUELLE (38 semaines) étalée
       sur le calendrier joué, exactement comme la recette juste en dessous. */
    const sal = (FM.wageBill(c)/1000) * (SEMAINES_PAR_SAISON/total);
    const perf = rank[c.id] && n>1 ? 0.85 + 0.30*(1 - (rank[c.id]-1)/(n-1)) : 1;
    const rec = (FM.seasonRevenue(c)/total) * perf;
    const avantArrondi = c.budget + rec - sal;
    c.budget = round2(avantArrondi);
    E.recettes += rec;
    E.salaires += sal;
    /* l'arrondi au centime est lui aussi une entrée/sortie : sans cette ligne,
       271 clubs × 38 journées de ±0,005 M€ font dériver le contrôle de ~30 M€ */
    E.regul += c.budget - avantArrondi;
    if (c.id === my){
      FM.state.fin.rec = round2(FM.state.fin.rec + rec);
      FM.state.fin.sal = round2(FM.state.fin.sal + sal);
      if (c.budget < 0 && !FM.state.fin.alerte){
        FM.state.fin.alerte = true;
        addNews(FM.t("Vos comptes sont dans le rouge : la masse salariale dépasse vos recettes."), "money");
      } else if (c.budget >= 0) FM.state.fin.alerte = false;
    } else {
      /* club IA : trésorerie bornée, ni faillite en spirale ni magot infini.
         L'écart créé par l'écrêtage est porté au poste « regul » pour que le
         circuit monétaire reste vérifiable. */
      const avant = c.budget;
      c.budget = round2(Math.max(0, Math.min(c.budget, FM.seasonRevenue(c)*1.5)));
      E.regul += c.budget - avant;
    }
  }
}
FM.applyFinances = applyFinances;

/* Retire un joueur d'un club en nettoyant sa place dans le onze */
function retirerDuClub(club, p){
  const i = club.joueurs.indexOf(p);
  if (i < 0) return;
  club.joueurs.splice(i, 1);
  club.onze = (club.onze||[]).map(sl => sl.id===p.id ? { pos:sl.pos, id:null } : sl);
}

/* Probabilité de raccrocher, par âge : rien avant 33 ans, certitude à 38 */
function retireProb(age){
  if (age < 33) return 0;
  return Math.min(1, 0.10 + (age-33)*0.18);
}
FM.retireProb = retireProb;

/* ---------- Calendrier aller-retour (méthode du cercle) ---------- */
FM.makeSchedule = function(ids){
  let teams = ids.slice();
  if (teams.length % 2) teams.push(null); // bye
  const n = teams.length;
  const rounds = [];
  const arr = teams.slice();
  for (let r=0; r<n-1; r++){
    const day = [];
    for (let i=0;i<n/2;i++){
      const a = arr[i], b = arr[n-1-i];
      if (a!=null && b!=null){
        // alterner domicile/extérieur
        day.push(r%2===0 ? {dom:a, ext:b} : {dom:b, ext:a});
      }
    }
    rounds.push(day);
    // rotation (fixer le premier)
    arr.splice(1,0,arr.pop());
  }
  // Retour = inversion domicile/extérieur
  const retour = rounds.map(day => day.map(m => ({dom:m.ext, ext:m.dom})));
  return rounds.concat(retour);
};

/* ---------- Accès pratiques ---------- */
FM.myClub = () => FM.state.db.clubs.find(c => c.id === FM.state.managedClubId);
FM.clubById = id => FM.state.db.clubs.find(c => c.id === id);
FM.clubsInMyLeague = () => FM.state.db.clubs.filter(c => c.ligue === FM.state.ligueJoueur);
FM.totalMatchdays = () => FM.state.calendrier.length;

/* ---------- Classement ---------- */
FM.table = function(ligueId){
  ligueId = ligueId || FM.state.ligueJoueur;
  const clubs = FM.state.db.clubs.filter(c => c.ligue === ligueId).slice();
  clubs.sort((a,b)=>
    b.pts-a.pts || (b.bp-b.bc)-(a.bp-a.bc) || b.bp-a.bp || a.nom.localeCompare(b.nom));
  return clubs;
};
FM.myRank = function(){
  const t = FM.table();
  return t.findIndex(c => c.id === FM.state.managedClubId) + 1;
};

/* ---------- Prochain match du club géré ---------- */
FM.nextFixture = function(){
  const jd = FM.state.calendrier[FM.state.journee];
  if (!jd) return null;
  return jd.find(m => m.dom===FM.state.managedClubId || m.ext===FM.state.managedClubId) || null;
};

/* ---------- Jouer une journée complète ----------
   forcedMy (optionnel) = résultat DÉJÀ calculé du match du joueur
   {domScore, extScore, events} — utilisé par le match interactif (mi-temps). */
FM.playMatchday = function(forcedMy){
  if (FM.state.journee >= FM.totalMatchdays()) return null;
  const jd = FM.state.calendrier[FM.state.journee];
  const dayResults = [];
  let myResult = null;
  const myId = FM.state.managedClubId;

  for (const m of jd){
    const dom = FM.clubById(m.dom), ext = FM.clubById(m.ext);
    // L'IA reconstruit son onze (le club du joueur garde son onze choisi)
    if (dom.id !== myId) dom.onze = FM.autoPickXI(dom);
    if (ext.id !== myId) ext.onze = FM.autoPickXI(ext);

    const isMine = (dom.id===myId || ext.id===myId);
    const res = (isMine && forcedMy) ? forcedMy : FM.simulateMatch(dom, ext);
    // Blessures / cartons : déjà appliqués si le match a été joué en interactif
    if (!(isMine && forcedMy)){
      [dom, ext].forEach(c=>{
        const inc = FM.applyIncidents(c, FM.matchIncidents(c,1).concat(FM.matchIncidents(c,2)));
        if (c.id===myId) announceIncidents(c, inc);
      });
      delete dom._red; delete ext._red;
    }
    applyResult(dom, ext, res);
    accumulateStats(dom, ext, res);
    const r = { dom:dom.id, ext:ext.id, ds:res.domScore, es:res.extScore, events:res.events };
    dayResults.push(r);
    if (dom.id===FM.state.managedClubId || ext.id===FM.state.managedClubId) myResult = r;
  }

  FM.state.resultats[FM.state.journee] = dayResults;
  FM.state.journee++;
  advanceBackgroundLeagues();            // le reste de l'Europe joue aussi
  FM.tickAvailability();                 // blessures/suspensions : une journée de moins
  applyFinances();                       // recettes encaissées, salaires payés
  confianceEnCours();                    // les dirigeants suivent le classement

  postMatchdayUpdates(myResult);
  FM.save();
  return { dayResults, myResult };
};

/* ============================================================
   CHAMPIONNATS ÉTRANGERS — simulation de fond
   Auparavant, seule la ligue du joueur était jouée : les 235 clubs des autres
   pays finissaient la saison à 0 point et 0 match, et les places européennes
   étaient donc attribuées par ordre alphabétique. Chaque journée, les autres
   championnats avancent au prorata, avec un modèle allégé (score + buteurs,
   sans blessures ni cartons — invisible pour le joueur, et cent fois moins
   coûteux que la simulation complète).
   ============================================================ */

/* Calendrier d'une ligue : recalculé à la demande, jamais stocké. Les ids
   sont triés, donc l'ordre est stable tant que la composition ne change pas. */
const schedCache = { map:{} };
/* Le cache doit être vidé dès que la composition d'un championnat peut avoir
   changé — y compris quand l'état entier est remplacé (chargement, import).
   Une clé dérivée de l'état (saison + nombre de clubs) ne suffit pas : après
   un import, ces deux valeurs peuvent coïncider et le calendrier de la partie
   PRÉCÉDENTE était alors rejoué, faisant disputer 68 matchs à certains clubs
   et aucun à d'autres. */
FM.invalidateSchedules = function(){ schedCache.map = {}; };
function leagueSchedule(ligue){
  if (!schedCache.map[ligue]){
    const ids = FM.state.db.clubs.filter(c=>c.ligue===ligue).map(c=>c.id).sort((a,b)=>a-b);
    schedCache.map[ligue] = ids.length >= 2 ? FM.makeSchedule(ids) : [];
  }
  return schedCache.map[ligue];
}
FM.leagueSchedule = leagueSchedule;

/* Toutes les ligues hors celle du joueur (la sienne est jouée en détail) */
FM.backgroundLeagues = function(){
  const vues = new Set(), out = [];
  for (const c of FM.state.db.clubs){
    if (c.ligue === FM.state.ligueJoueur || vues.has(c.ligue)) continue;
    vues.add(c.ligue); out.push(c.ligue);
  }
  return out;
};

/* Match de fond : même modèle de score et MÊME comptabilité individuelle que
   la simulation complète. Il est essentiel de passer par accumulateStats et
   pas par un décompte allégé : celui-ci incrémentait `matchs` sans écrire
   `noteTotale`/`noteMatchs`, si bien que les joueurs étrangers arrivaient en
   fin de saison avec 38 matchs et une moyenne de 0 — donc pénalisés d'un à
   deux points de note chaque saison. Le monde entier se dégradait. */
function simulateBackground(dom, ext){
  const res = FM.simulateMatch(dom, ext);
  applyResult(dom, ext, res);
  accumulateStats(dom, ext, res);
}

/* Fait avancer les championnats étrangers pour qu'ils bouclent leur saison
   en même temps que celui du joueur. */
function advanceBackgroundLeagues(){
  const mien = FM.totalMatchdays();
  if (!mien) return;
  FM.state.progres = FM.state.progres || {};
  const avancement = FM.state.journee / mien;                 /* 0 → 1 */
  for (const lg of FM.backgroundLeagues()){
    const cal = leagueSchedule(lg);
    if (!cal.length) continue;
    const cible = Math.min(cal.length, Math.round(avancement * cal.length));
    let joue = FM.state.progres[lg] || 0;
    while (joue < cible){
      for (const m of cal[joue]){
        const dom = FM.clubById(m.dom), ext = FM.clubById(m.ext);
        if (!dom || !ext) continue;                            /* club disparu */
        dom.onze = FM.autoPickXI(dom); ext.onze = FM.autoPickXI(ext);
        simulateBackground(dom, ext);
      }
      joue++;
    }
    FM.state.progres[lg] = joue;
  }
}
FM.advanceBackgroundLeagues = advanceBackgroundLeagues;

/* Décrémente blessures et suspensions d'une journée (sauf celles du jour) */
FM.tickAvailability = function(){
  for (const c of FM.state.db.clubs) for (const p of c.joueurs){
    if (p._justInjured){ delete p._justInjured; continue; }
    if (p.blessure>0){ p.blessure--; if(!p.blessure && c.id===FM.state.managedClubId) addNews(`${p.nom} ${FM.t('est de retour de blessure.')}`, "injury"); }
    if (p.suspension>0){ p.suspension--; if(!p.suspension && c.id===FM.state.managedClubId) addNews(`${p.nom} ${FM.t('a purgé sa suspension.')}`, "card"); }
  }
};

/* Annonce les incidents du club géré dans le journal */
function announceIncidents(club, incidents){
  for (const inc of incidents){
    /* Les deux générateurs d'incidents ne nomment pas le joueur pareil :
       le match simulé produit `nom`, le match joué en direct produit
       `joueur`. Le journal affichait donc « undefined se blesse » pour tout
       incident survenu dans un match disputé à l'écran. */
    const qui = inc.nom || inc.joueur || (FM.getPlayer(club, inc.id)||{}).nom || FM.t("Un joueur");
    if (inc.type==="injury") addNews(`${qui} ${FM.t('se blesse')} (${inc.duree} ${FM.t('journées d\'indisponibilité')}).`, "injury");
    else if (inc.type==="red") addNews(`${qui} ${FM.t('est expulsé — suspendu pour la suite.')}`, "card");
    else if (inc.suspend) addNews(`${qui} : ${FM.t('5e avertissement, suspendu la prochaine journée.')}`, "card");
  }
}
FM.announceIncidents = announceIncidents;

/* Joueurs indisponibles du club géré */
FM.unavailableList = function(club){
  club = club || FM.myClub();
  return club.joueurs.filter(p=>!FM.playerAvailable(p));
};

function applyResult(dom, ext, res){
  dom.j++; ext.j++;
  dom.bp+=res.domScore; dom.bc+=res.extScore;
  ext.bp+=res.extScore; ext.bc+=res.domScore;
  if (res.domScore>res.extScore){ dom.g++; ext.p++; dom.pts+=3; }
  else if (res.domScore<res.extScore){ ext.g++; dom.p++; ext.pts+=3; }
  else { dom.n++; ext.n++; dom.pts++; ext.pts++; }
}

/* Exposée pour les coupes : un match de coupe ou d'Europe doit compter dans
   les statistiques individuelles, au même titre qu'un match de championnat.
   Jusqu'ici ces rencontres — jusqu'à un tiers de la saison d'un club — ne
   laissaient aucune trace sur les fiches de joueurs. */
FM.accumulateStats = (dom, ext, res) => accumulateStats(dom, ext, res);
/* Match de coupe ou d'Europe JOUÉ EN DIRECT : les chemins live transmettent
   un score déjà calculé, ce qui court-circuitait les seuls appels à
   accumulateStats. Le club du joueur — le seul à jouer ses matchs à l'écran —
   ne recevait donc AUCUNE statistique de coupe : 26 % de matchs en moins sur
   une saison, et un titre de meilleur buteur attribué au mauvais joueur. */
FM.creditLiveMatch = function(dom, ext, hs, as, events){
  if (!dom || !ext) return;
  accumulateStats(dom, ext, { domScore:hs, extScore:as, events:events || [] });
};
function accumulateStats(dom, ext, res){
  // Buteurs + regroupement des buts par club
  const goalsBy = {};
  for (const e of res.events){
    const c = FM.clubById(e.clubId);
    const p = FM.getPlayer(c, e.joueurId);
    if (p) p.buts++;
    (goalsBy[e.clubId] = goalsBy[e.clubId] || []).push(e.joueurId);
  }
  const domWin = res.domScore>res.extScore, extWin = res.extScore>res.domScore;
  const drew = res.domScore===res.extScore;
  /* Force respective des deux camps : sert à mesurer l'écart entre le
     résultat obtenu et le résultat attendu. simulateMatch les renvoie ;
     à défaut (résultat forcé d'un match joué en direct) on les recalcule. */
  const forceD = res.ratingDom != null ? res.ratingDom : FM.teamStrength(dom).global;
  const forceE = res.ratingExt != null ? res.ratingExt : FM.teamStrength(ext).global;
  for (const c of [dom, ext]){
    const won = (c===dom&&domWin)||(c===ext&&extWin);
    const conceded = c===dom ? res.extScore : res.domScore;
    /* Part de points attendue (0 = défaite promise, 1 = victoire promise),
       logistique sur l'écart de force, avec l'avantage du terrain. */
    const ecart = (c===dom ? forceD - forceE + 3 : forceE - forceD - 3);
    const attendu = 1 / (1 + Math.exp(-ecart/6));
    const obtenu = won ? 1 : (drew ? 0.5 : 0);
    const marques = c===dom ? res.domScore : res.extScore;
    const scorers = goalsBy[c.id] || [];
    const xi = c.onze.map(s=>FM.getPlayer(c, s.id)).filter(Boolean);
    // Passes décisives : un coéquipier (milieu/attaquant de préférence) crédité par but (~65 %)
    const passesDuJour = {};
    for (const gId of scorers){
      if (FM._rnd() < 0.65){
        /* Tirage PONDÉRÉ sur tout le onze, gardien excepté. Le filtre
           précédent excluait défenseurs et gardiens par construction — les
           latéraux, premiers pourvoyeurs dans le vrai football, affichaient
           zéro passe décisive, et la sentinelle était le meilleur passeur du
           monde parce que le tirage était uniforme parmi les milieux. */
        const cand = xi.filter(p=>p.id!==gId && p.pos!=="GB");
        const POIDS = { AG:2.6, AD:2.6, MO:2.4, DG:1.5, DD:1.5, MC:1.3, BU:1.2, MDC:0.5, DC:0.35 };
        let tot = 0;
        for (const q of cand) tot += (POIDS[q.pos] || 1);
        let tir = FM._rnd()*tot, passer = cand[0];
        for (const q of cand){ tir -= (POIDS[q.pos] || 1); if (tir <= 0){ passer = q; break; } }
        if (passer){
          passer.passes = (passer.passes||0)+1;
          passesDuJour[passer.id] = (passesDuJour[passer.id]||0) + 1;
        }
      }
    }
    // Note de match par titulaire
    for (const p of xi){
      p.matchs++;
      let note = 6.0 + FM._rnd()*0.6 - 0.3;
      const persoGoals = scorers.filter(id=>id===p.id).length;
      note += persoGoals*1.1;
      /* La passe décisive était comptée mais ne rapportait rien : les milieux
         restaient la seule ligne sans contribution valorisée. */
      note += (passesDuJour[p.id]||0) * 0.6;
      /* Résultat rapporté à l'ATTENDU, pas au résultat brut. Un bonus fixe de
         victoire faisait de la note de saison un simple décalque du
         classement : les joueurs des premiers progressaient tous, ceux des
         derniers régressaient tous, et l'écart entre clubs se creusait sans
         rappel — 13,9 à 31,6 points d'étendue en quinze saisons. Battre plus
         fort que soi rapporte maintenant, battre plus faible ne rapporte
         presque rien, et perdre contre plus fort ne coûte presque rien.  */
      note += 0.8 * (obtenu - attendu);
      /* Apport défensif. L'ancien barème (+0,6 pour un clean sheet, −0,15 par
         but encaissé) avait une espérance quasi nulle : gardiens et défenseurs
         restaient structurellement 0,25 point sous les attaquants, qui gagnent
         1,1 par but. Un gardien ne pouvait mathématiquement pas atteindre la
         bande « excellente saison ». */
      if (p.groupe==="D" || p.pos==="GB"){
        /* Pondéré par l'attendu, comme le résultat : une cage inviolée vaut
           moins quand on écrase un promu que quand on tient tête au premier. */
        const merite = 1.4 - attendu;
        note += conceded===0 ? 1.22*merite : conceded===1 ? 0.48*merite : -(conceded-1)*0.30;
      }
      /* Part individuelle de l'arrière-garde. Tout ce qui précède est un signal
         d'ÉQUIPE — les buts encaissés — que la pondération par l'attendu
         neutralise ensuite : le classement d'un gardien à la moyenne de saison
         est donc presque indépendant de son niveau réel. Les bons ne se
         détachent jamais, là où un attaquant marque et se détache tout seul. À
         potentiel égal (86+), 41,5 % des attaquants atteignaient 85 contre
         23,6 % des gardiens, et la part des gardiens dans l'élite tombait de
         1,15 à 0,84 fois leur poids parmi les titulaires en vingt saisons.
         D'où un signal propre, borné, et volontairement plus faible que le
         bruit d'équipe pour ne pas transformer la ligne en cliquet.

         Coefficient calibré sur quatre graines et vingt saisons, en dérive de
         la part de chaque ligne dans l'élite (85+) entre S0 et S20 :

             k        G       D       M       A     |dérive|
             0      −0,28   +0,14   −0,28   +0,24     0,94
             0,008  +0,01   +0,02   −0,31   +0,29     0,63
             0,012  +0,15   +0,08   −0,21   +0,06     0,50
             0,020  +0,18   −0,02   −0,28   +0,23     0,71
             0,030  +0,15   +0,42   −0,48   −0,05     1,10

         La réponse sature dès 0,012 : au-delà, tous les gardiens rejoignent
         leur potentiel et le coefficient ne fait plus qu'ajouter du bruit.
         0,012 est la seule valeur qui améliore les quatre lignes à la fois.
         La défense n'en reçoit pas : sa part dérivait déjà vers le haut, et
         lui donner le même signal (k=0,022) la portait à 1,24 en écrasant les
         milieux à 0,73. */
      if (p.pos === "GB")
        note += Math.max(-0.35, Math.min(0.35, (p.note - 72) * 0.012));
      /* Le milieu était la seule ligne sans contribution valorisée : ni but
         (poids de sélection 2,2 contre 5 pour un attaquant), ni cage inviolée.
         Sa bande « excellente » était structurellement hors d'atteinte — 0,4 %
         des milieux centraux, 0 % des sentinelles. On valorise sa part dans la
         construction : les buts de l'équipe, à un taux modeste. */
      if (p.groupe==="M") note += marques * 0.11;
      note = Math.max(4.5, Math.min(10, note));
      p.noteTotale = (p.noteTotale||0) + note;
      p.noteMatchs = (p.noteMatchs||0) + 1;
    }
  }
}

/* Moyenne de note d'un joueur (0 si jamais noté) */
FM.playerAvgNote = function(p){
  return p.noteMatchs ? (p.noteTotale/p.noteMatchs) : 0;
};

/* Classements individuels de la saison en cours (buteurs, passeurs, notes) */
FM.leaderboards = function(ligueId, minMatchs){
  ligueId = ligueId || FM.state.ligueJoueur;
  minMatchs = minMatchs || 5;
  const players = [];
  for (const c of FM.state.db.clubs){
    if (ligueId!=="ALL" && c.ligue!==ligueId) continue;
    for (const p of c.joueurs) players.push({ ...p, clubNom:c.nom });
  }
  const buteurs = players.filter(p=>p.buts>0).sort((a,b)=>b.buts-a.buts || b.passes-a.passes).slice(0,15);
  const passeurs = players.filter(p=>(p.passes||0)>0).sort((a,b)=>(b.passes||0)-(a.passes||0)).slice(0,15);
  const notes = players.filter(p=>(p.noteMatchs||0)>=minMatchs)
    .map(p=>({ ...p, avg:FM.playerAvgNote(p) }))
    .sort((a,b)=>b.avg-a.avg).slice(0,15);
  return { buteurs, passeurs, notes };
};

/* Mises à jour post-journée : forme, moral, mercato IA, actualités */
function postMatchdayUpdates(myResult){
  // Forme/moral légère variation sur tous les joueurs
  for (const c of FM.state.db.clubs){
    for (const p of c.joueurs){
      p.forme = Math.max(-3, Math.min(3, p.forme + FM._ri(-1,1)));
    }
  }
  // Moral du club joueur selon résultat
  if (myResult){
    const my = FM.myClub();
    const gagne = (myResult.dom===my.id && myResult.ds>myResult.es) || (myResult.ext===my.id && myResult.es>myResult.ds);
    const nul   = myResult.ds===myResult.es;
    const delta = gagne?4:(nul?0:-4);
    for (const s of my.onze){ const p=FM.getPlayer(my,s.id); if(p) p.moral=Math.max(30,Math.min(99,p.moral+delta)); }
    const adv = FM.clubById(myResult.dom===my.id?myResult.ext:myResult.dom);
    const s = myResult.dom===my.id ? `${myResult.ds}-${myResult.es}` : `${myResult.es}-${myResult.ds}`;
    addNews(`J${FM.state.journee} — ${my.nom} ${gagne?FM.t("s'impose"):(nul?FM.t("fait match nul"):FM.t("s'incline"))} ${s} ${FM.t('face à')} ${adv.nom}.`, "match");
  }
  // Mercato IA : offres pour nos joueurs listés, et vie du marché entre clubs IA
  generateAIOffers();
  runAIMarket();
}

/* ============================================================
   AGENDA UNIFIÉ — toutes les compétitions dans le même calendrier
   Chaque tour de coupe est rattaché à une journée de championnat, pour que
   rien ne puisse être « oublié » faute d'aller sur le bon onglet.
   ============================================================ */
/* Repères historiques, conservés pour un championnat de 38 journées. Ils ne
   servent plus que de valeurs de repli : les échéances sont désormais
   calculées AU PRORATA de la saison. Codées en dur, elles tombaient hors
   saison dans un championnat court — avec 22 journées, la 8e journée de
   phase de ligue était due à J24 et les quatre tours de phase finale à J21,
   J25, J29 et J33 : aucun n'était jamais proposé, et le club du joueur
   voyait tout son parcours européen se jouer en coulisses. */
FM.CUP_FIRST = 3;   FM.CUP_EVERY = 5;
FM.EURO_FIRST = 2;  FM.EURO_EVERY = 3;
FM.EUROKO_FIRST = 20; FM.EUROKO_EVERY = 4;

/* Nombre de tours d'une compétition, pour répartir ses échéances */
function nbTours(kind){
  const e = FM.state.europe, pc = e && e.playerComp, comp = pc ? e[pc] : null;
  if (kind === "coupe"){
    const c = FM.state.coupe;
    /* un tournoi à élimination directe de N équipes compte log2(N) tours */
    return (c && c.teams) ? Math.max(1, Math.round(Math.log2(c.teams.length))) : 6;
  }
  if (kind === "euroLp") return (comp && comp.lp && comp.lp.rounds) || 8;
  return 4;                                  /* 8es, quarts, demies, finale */
}

/* Journée à laquelle le tour `r` (0-indexé) d'une compétition est programmé.
   Tout est rapporté à la longueur réelle de la saison : la phase de ligue
   occupe les deux premiers tiers, la phase finale le dernier tiers, et la
   coupe nationale s'étale sur l'ensemble. */
function dueMatchday(kind, r){
  const T = FM.totalMatchdays() || 38;
  const n = Math.max(1, nbTours(kind));
  const place = (debut, fin, i, total) =>
    Math.max(1, Math.min(T - 1, Math.round(debut + (fin - debut) * (i + 1) / (total + 1))));
  if (kind === "coupe")  return place(2, T - 2, r, n);
  if (kind === "euroLp") return place(1, Math.round(T*0.62), r, n);
  return place(Math.round(T*0.66), T - 1, r, n);
}

/* Liste ordonnée de tous les rendez-vous EN ATTENTE (championnat + coupes).
   [{ kind, ic, nat, titre, detail, due, enRetard }]                          */
FM.pendingEvents = function(){
  const out = [];
  const j = FM.state.journee;

  // 1) Match de championnat de la journée courante
  const fx = FM.nextFixture();
  if (fx){
    const dom = FM.clubById(fx.dom), ext = FM.clubById(fx.ext);
    const chezMoi = fx.dom===FM.state.managedClubId;
    out.push({ kind:"league", ic:"cup", titre:`${FM.myClub().ligueNom} — journée ${j+1}`,
               detail:`${dom.nom} vs ${ext.nom} (${chezMoi?"domicile":"extérieur"})`, due:j, enRetard:false });
  }

  // 2) Coupe nationale : tour dû ?
  const cup = FM.state.coupe;
  if (cup && !cup.finished && cup.playerAlive){
    const due = dueMatchday("coupe", cup.round);
    if (j >= due){
      const tie = FM.playerTie(cup);
      let adv = "à jouer";
      if (tie){ const o = cup.teams[tie[0]===cup.playerSeed?tie[1]:tie[0]]; adv = o.bye ? "exempt (qualifié d'office)" : ("contre "+o.nom); }
      out.push({ kind:"coupe", ic:"cup", nat:cup.nat, titre:`${cup.nom} — ${FM.roundName(cup.alive.length)}`,
                 detail:adv, due, enRetard:j>due });
    }
  }

  // 3) Coupe d'Europe : phase de ligue ou phase finale
  const e = FM.state.europe;
  if (e && e.playerComp){
    const comp = e[e.playerComp];
    if (comp.phase==="league" && comp.lp.cur < comp.lp.rounds){
      const due = dueMatchday("euroLp", comp.lp.cur);
      if (j >= due){
        const pm = FM.lpPlayerMatch(comp);
        let d = `journée ${comp.lp.cur+1}/${comp.lp.rounds} de la phase de ligue`;
        if (pm){ const o = comp.teams[pm.playerHome?pm.away:pm.home]; d = `contre ${o.nom} (${pm.playerHome?"domicile":"extérieur"})`; }
        out.push({ kind:"euro", ic:comp.ic, titre:`${comp.nom} — phase de ligue`, detail:d, due, enRetard:j>due });
      }
    } else if (comp.ko && !comp.ko.finished && comp.ko.playerAlive){
      const due = dueMatchday("euroKo", comp.ko.round);
      if (j >= due){
        const tie = FM.playerTie(comp.ko);
        let d = "à jouer";
        if (tie){ const o = comp.ko.teams[tie[0]===comp.ko.playerSeed?tie[1]:tie[0]]; d = "contre "+o.nom; }
        out.push({ kind:"euro", ic:comp.ic, titre:`${comp.nom} — ${FM.roundName(comp.ko.alive.length)}`, detail:d, due, enRetard:j>due });
      }
    }
  }

  // 4) Tournoi international de l'été (facultatif)
  const pi = FM.state.pendingIntl;
  if (pi && !pi.fait){
    out.push({ kind:"intl", ic:"globe", nat: pi.kind==="WC"?null:"EUR",
               titre: (pi.kind==="WC"?"Coupe du Monde":"Championnat d'Europe")+" — cet été",
               detail:`facultatif · sélection : ${pi.defaultNation}`, due:j, enRetard:false, facultatif:true });
  }
  // Les rendez-vous en retard d'abord (à ne pas manquer), puis par échéance
  out.sort((a,b)=> (b.enRetard?1:0)-(a.enRetard?1:0) || a.due-b.due);
  return out;
};

/* Y a-t-il un tour de coupe à jouer avant de poursuivre le championnat ? */
FM.blockingEvents = () => FM.pendingEvents().filter(ev=>ev.kind!=="league" && !ev.facultatif && ev.enRetard);

/* ---------- PÉRIODES DE MERCATO ----------
   Deux fenêtres par saison : le mercato d'ÉTÉ (avant-saison, jusqu'à la 3e
   journée) et le mercato d'HIVER (à la trêve, autour de la mi-saison).
   En dehors, aucun transfert ni prêt n'est possible (ni pour vous, ni pour l'IA). */
FM.WINDOW_SUMMER_END = 3;      // fermé APRÈS la 3e journée
FM.WINDOW_WINTER_LEN = 3;      // durée de la fenêtre hivernale (journées)

FM.transferWindow = function(){
  const j = FM.state.journee;                       // journées déjà jouées
  const total = FM.totalMatchdays();
  const winterStart = Math.floor(total/2);
  const winterEnd = winterStart + FM.WINDOW_WINTER_LEN;
  if (j < FM.WINDOW_SUMMER_END)
    return { open:true, type:"ete", nom:FM.t("Mercato d'été"),
             info:`${FM.t("ouvert — ferme après la journée")} ${FM.WINDOW_SUMMER_END}`,
             ferme: FM.WINDOW_SUMMER_END - j };
  if (j >= winterStart && j < winterEnd)
    return { open:true, type:"hiver", nom:FM.t("Mercato d'hiver"),
             info:`${FM.t("ouvert — ferme après la journée")} ${winterEnd}`,
             ferme: winterEnd - j };
  // Fermé : prochaine ouverture
  if (j < winterStart)
    return { open:false, nom:FM.t("Mercato fermé"),
             info:`${FM.t("réouverture au mercato d'hiver (journée")} ${winterStart+1})`,
             ouvre: winterStart - j };
  return { open:false, nom:FM.t("Mercato fermé"),
           info:FM.t("réouverture au mercato d'été (saison prochaine)"),
           ouvre: total - j };
};
FM.marketOpen = () => FM.transferWindow().open;
function windowClosedMsg(){
  const w = FM.transferWindow();
  return `${w.nom} — ${w.info}.`;
}

/* ---------- MERCATO ---------- */
FM.transferMarket = function(filter={}){
  const my = FM.myClub();
  const applyFilters = arr => {
    if (filter.poste) arr = arr.filter(p=>p.groupe===filter.poste);
    if (filter.posteExact) arr = arr.filter(p=>p.pos===filter.posteExact);
    if (filter.noteMin) arr = arr.filter(p=>p.note>=filter.noteMin);
    if (filter.noteMax) arr = arr.filter(p=>p.note<=filter.noteMax);
    if (filter.potMin) arr = arr.filter(p=>p.potentiel>=filter.potMin);
    if (filter.ageMin) arr = arr.filter(p=>p.age>=filter.ageMin);
    if (filter.ageMax) arr = arr.filter(p=>p.age<=filter.ageMax);
    if (filter.valeurMax) arr = arr.filter(p=>p.valeur<=filter.valeurMax);
    if (filter.nat){ const n=filter.nat.toLowerCase(); arr=arr.filter(p=>(p.nat||"").toLowerCase()===n); }
    if (filter.q){ const q=filter.q.toLowerCase(); arr=arr.filter(p=>p.nom.toLowerCase().includes(q)); }
    return arr;
  };
  const sortFn = (key)=>{
    switch(key){
      case "valeur": return (a,b)=>b.valeur-a.valeur;
      case "valeurAsc": return (a,b)=>a.valeur-b.valeur;
      case "age": return (a,b)=>a.age-b.age;
      case "pot": return (a,b)=>b.potentiel-a.potentiel;
      default: return (a,b)=>b.note-a.note;
    }
  };
  const sorter = sortFn(filter.sort);
  const type = filter.type || "all";
  // Agents libres (sans club) : toujours présentés en tête (hors quota de liste)
  let libres = type==="transf" ? [] : applyFilters((FM.state.freeAgents || [])
    .map(p=>({ ...p, clubId:null, clubNom:FM.t("Agent libre"), dispo:true, libre:true })));
  libres.sort(sorter);
  // Joueurs sous contrat dans les autres clubs
  let list = [];
  if (type!=="libre"){
    for (const c of FM.state.db.clubs){
      if (c.id === my.id) continue;
      for (const p of c.joueurs){
        if (type==="transf" && !p.transferListe) continue;
        list.push({ ...p, clubId:c.id, clubNom:c.nom, dispo: p.transferListe });
      }
    }
    list = applyFilters(list);
  }
  list.sort((a,b)=> (b.dispo?1:0)-(a.dispo?1:0) || sorter(a,b));
  const limit = filter.limit || 120;
  return libres.concat(list).slice(0, Math.max(limit, libres.length));
};

/* Réputation de club attendue par un joueur selon son niveau */
function expectedRepFor(note){ return note>=85?5:note>=80?4:note>=75?3:note>=70?2:1; }
/* Un joueur SOUS CONTRAT accepte-t-il de rejoindre un club de réputation buyerRep ?
   Renvoie {ok, mult} : mult = surcoût exigé si le club est un cran en dessous. */
FM.playerWillingness = function(note, buyerRep){
  const exp = expectedRepFor(note);
  if (buyerRep >= exp) return { ok:true, mult:1 };
  if (buyerRep === exp-1) return { ok:true, mult:1.3, note:"il faudra le convaincre financièrement" };
  return { ok:false, reason:`vise un club plus huppé (niveau ${"★".repeat(exp)})` };
};
/* Prime de signature d'un AGENT LIBRE : il accepte tout club, mais réclame une
   prime d'autant plus élevée que le club est loin de son niveau (pas de refus).
   Le club économise l'indemnité de transfert : un agent libre reste une bonne
   affaire (≈ 40 % de moins qu'un joueur sous contrat), mais plus une machine à
   revendre — la prime était à 20 % de la valeur, contre 85-125 % au rachat. */
FM.freeAgentPrime = function(fa, buyerRep){
  const gap = Math.max(0, expectedRepFor(fa.note) - (buyerRep||1));
  const mult = 1 + 0.3*gap;                        // écart de 2 crans → ×1.6
  /* 0,60 × valeur ne recouvrait jamais les offres IA (0,85 à 1,25 × valeur) :
     acheter en été et revendre en hiver rapportait +79 % à coup sûr. À 0,95
     l'agent libre reste une bonne affaire — pas d'indemnité de transfert —
     sans être un arbitrage sans risque. */
  return Math.max(0.1, Math.round(fa.valeur * 0.95 * mult * 10)/10);
};
/* Fenêtre de mercato courante, sous forme de repère stable dans la partie */
function windowKey(){
  const w = FM.transferWindow();
  return FM.state.saison + ":" + (w.type || "hors");
}
/* Un joueur tout juste recruté ne peut pas être revendu dans la foulée :
   sans cette règle, acheter puis revendre au sein d'une même fenêtre est un
   arbitrage sans risque. */
FM.justSigned = p => !!p.signeFenetre && p.signeFenetre === windowKey();

/* Acheter : renvoie {ok, msg} */
FM.buyPlayer = function(playerId, offreM){
  const my = FM.myClub();
  if (!FM.marketOpen()) return { ok:false, msg:windowClosedMsg() };
  /* Un champ vide donne parseFloat("") === NaN : sans ce contrôle, NaN passe
     toutes les comparaisons et contamine définitivement la trésorerie. */
  if (!FM.validAmount(offreM))
    return { ok:false, msg:FM.t("Saisissez un montant d'offre valide (en M€).") };

  // 1) Agent libre : signature contre une simple prime (pas d'indemnité de transfert)
  const fa = (FM.state.freeAgents || []).find(x=>x.id===playerId);
  if (fa){
    if (my.joueurs.length >= 30) return { ok:false, msg:FM.t("Effectif complet (30 max). Vendez d'abord.") };
    const prime = FM.freeAgentPrime(fa, my.rep);           // prime à la signature (jamais de refus)
    if (offreM+1e-9 < prime) return { ok:false, msg:`${fa.nom} demande une prime d'environ ${prime.toFixed(1)} M€ pour signer.` };
    if (offreM > my.budget) return { ok:false, msg:`Budget insuffisant : ${offreM.toFixed(1)} M€ demandé, ${my.budget.toFixed(1)} M€ dispo.` };
    FM.state.freeAgents = FM.state.freeAgents.filter(x=>x.id!==playerId);
    FM.state.usedFreeAgents = FM.state.usedFreeAgents || [];
    if (!FM.state.usedFreeAgents.includes(fa.nom)) FM.state.usedFreeAgents.push(fa.nom);
    moveMoney(my, null, offreM, "primes");     /* la prime va au joueur, pas à un club */
    fa.transferListe = false; fa.contrat = FM._ri(2,4); fa.moral = Math.min(99, fa.moral+6);
    fa.signeFenetre = windowKey();
    my.joueurs.push(fa);
    my.onze = FM.autoPickXI(my);
    addNews(`${FM.t('Signature libre')} : ${fa.nom} (${fa.note}) ${FM.t("s'engage avec")} ${my.nom} (${FM.t('prime')} ${offreM.toFixed(1)} M€).`, "transfer");
    FM.save();
    return { ok:true, msg:`${fa.nom} signe librement pour une prime de ${offreM.toFixed(1)} M€ !` };
  }

  let seller=null, player=null;
  for (const c of FM.state.db.clubs){
    if (c.id===my.id) continue;
    const p = c.joueurs.find(x=>x.id===playerId);
    if (p){ seller=c; player=p; break; }
  }
  if (!player) return { ok:false, msg:FM.t("Joueur introuvable.") };
  /* Un joueur en prêt n'appartient pas au club qui l'aligne : il ne peut pas
     être vendu par lui, et son club parent le récupère en fin de saison. */
  if (player.loan)
    return { ok:false, msg:`${player.nom} ${FM.t("est en prêt : il n'est pas à vendre.")}` };
  if (my.joueurs.length >= 30) return { ok:false, msg:"Effectif complet (30 max). Vendez d'abord." };
  if (offreM > my.budget) return { ok:false, msg:`Budget insuffisant (${my.budget.toFixed(1)} M€ dispo).` };

  // Le joueur veut-il venir ? (réalisme : une star ne rejoint pas un club modeste)
  const will = FM.playerWillingness(player.note, my.rep);
  if (!will.ok) return { ok:false, msg:`${player.nom} refuse de signer : il ${will.reason}.` };

  // Le club vendeur veut-il vendre ? (réticence accrue si le joueur est un cadre)
  const cadre = player.note >= (seller.rep>=4?80:seller.rep>=3?76:72);
  if (cadre && !player.transferListe && FM._rnd() < 0.5)
    return { ok:false, msg:`${seller.nom} ne souhaite pas se séparer de ${player.nom}, un cadre de l'effectif.` };
  const seuil = player.valeur * will.mult * (player.transferListe ? 0.95 : (1.2 + seller.rep*0.07));
  if (offreM < seuil){
    return { ok:false, msg:`${seller.nom} refuse. Il faut environ ${seuil.toFixed(1)} M€ pour ${player.nom}${will.mult>1?" (et le convaincre)":""}.` };
  }
  // Le vendeur doit pouvoir se passer du joueur (effectif, gardien)
  const manque = FM.departureBlock(seller, player);
  if (manque) return { ok:false, msg:`${seller.nom} ${FM.t("ne peut pas se démunir")} : ${manque.toLowerCase()}` };
  // Transfert accepté — l'intégralité de l'indemnité va au club vendeur
  seller.joueurs = seller.joueurs.filter(p=>p.id!==playerId);
  seller.onze = FM.autoPickXI(seller);
  moveMoney(my, seller, offreM);
  player.transferListe = false;
  player.moral = Math.min(99, player.moral+8);
  player.signeFenetre = windowKey();
  my.joueurs.push(player);
  my.onze = FM.autoPickXI(my);
  addNews(`${FM.t('Recrutement')} : ${player.nom} (${player.note}) ${FM.t('rejoint')} ${my.nom} ${FM.t('pour')} ${offreM.toFixed(1)} M€.`, "transfer");
  FM.save();
  return { ok:true, msg:`${player.nom} signe pour ${offreM.toFixed(1)} M€ !` };
};

/* Lister / retirer de la liste des transferts */
FM.toggleTransferList = function(playerId){
  const my = FM.myClub();
  const p = my.joueurs.find(x=>x.id===playerId);
  if (!p) return { ok:false, msg:FM.t("Joueur introuvable.") };
  /* Ces refus étaient silencieux : le bouton ne faisait rien et rien ne
     bougeait à l'écran. On dit maintenant pourquoi. */
  if (p.loan)
    return { ok:false, msg:`${p.nom} ${FM.t("est concerné par un prêt : il n'est pas transférable.")}` };
  if (!p.transferListe && FM.justSigned(p))
    return { ok:false, msg:`${p.nom} ${FM.t("vient d'arriver : pas de revente avant le prochain mercato.")}` };
  p.transferListe = !p.transferListe;
  FM.save();
  return { ok:true, msg: p.transferListe
    ? `${p.nom} ${FM.t("est sur la liste des transferts.")}`
    : `${p.nom} ${FM.t("est retiré de la liste des transferts.")}` };
};

/* Vendre directement à un prix (offre immédiate d'un club IA) */
FM.acceptOffer = function(offreIndex){
  const o = FM.state.offres[offreIndex];
  if (!o) return { ok:false, msg:FM.t("Offre expirée.") };
  if (!FM.marketOpen()) return { ok:false, msg:windowClosedMsg() };
  const my = FM.myClub();
  const p = my.joueurs.find(x=>x.id===o.joueurId);
  if (!p) return { ok:false, msg:FM.t("Joueur déjà parti.") };
  if (p.loan) return { ok:false, msg:FM.t("Ce joueur est concerné par un prêt.") };
  const bloque = FM.departureBlock(my, p);
  if (bloque) return { ok:false, msg:bloque };
  const buyer = FM.clubById(o.clubId);
  if (!buyer) return { ok:false, msg:FM.t("Le club acheteur n'existe plus.") };
  /* L'offre peut avoir vieilli : le club doit toujours avoir les fonds. */
  if (buyer.budget + 1e-9 < o.montant){
    FM.state.offres.splice(offreIndex,1); FM.save();
    return { ok:false, msg:`${buyer.nom} ${FM.t("s'est retiré : il n'a plus les moyens de cette offre.")}` };
  }
  my.joueurs = my.joueurs.filter(x=>x.id!==p.id);
  moveMoney(buyer, my, o.montant);            /* l'acheteur paie réellement */
  my.onze = FM.autoPickXI(my);
  p.transferListe = false;
  buyer.joueurs.push(p);
  buyer.onze = FM.autoPickXI(buyer);
  addNews(`${FM.t('Vente')} : ${p.nom} ${FM.t('rejoint')} ${buyer.nom} ${FM.t('pour')} ${o.montant.toFixed(1)} M€.`, "transfer");
  FM.state.offres.splice(offreIndex,1);
  FM.save();
  return { ok:true, msg:`${p.nom} vendu pour ${o.montant.toFixed(1)} M€.` };
};
FM.rejectOffer = function(i){ FM.state.offres.splice(i,1); FM.save(); };

function generateAIOffers(){
  const my = FM.myClub();
  /* Purge des offres caduques AVANT toute chose : une offre dont le joueur
     est parti, ou dont le club acheteur n'a plus les fonds, restait affichée
     indéfiniment et empêchait toute nouvelle offre pour ce joueur. */
  FM.state.offres = (FM.state.offres || []).filter(o => {
    const p = my.joueurs.find(x => x.id === o.joueurId);
    if (!p || p.loan || !p.transferListe) return false;
    const b = FM.clubById(o.clubId);
    return !!b && b.budget + 1e-9 >= o.montant;
  });
  if (!FM.marketOpen()) return;        // pas d'offres hors periode de mercato
  const listed = my.joueurs.filter(p=>p.transferListe);
  for (const p of listed){
    if (FM._rnd() < 0.45){
      // Un club IA plausible fait une offre
      const buyers = FM.state.db.clubs.filter(c=>c.id!==my.id && c.budget > p.valeur*0.8);
      if (!buyers.length) continue;
      const buyer = buyers[FM._ri(0,buyers.length-1)];
      const montant = Math.round(p.valeur*(0.85+FM._rnd()*0.4)*10)/10;
      if (buyer.budget >= montant && !FM.state.offres.some(o=>o.joueurId===p.id)){
        FM.state.offres.push({ joueurId:p.id, joueurNom:p.nom, clubId:buyer.id, clubNom:buyer.nom, montant });
        addNews(`${buyer.nom} ${FM.t('propose')} ${montant.toFixed(1)} M€ ${FM.t('pour')} ${p.nom}.`, "transfer");
      }
    }
  }
}

/* ---------- MERCATO ENTRE CLUBS IA ----------
   Sans cette routine, aucun club de la base ne bougeait jamais : le marché
   n'était alimenté que par les joueurs que VOUS mettiez sur la liste, et les
   effectifs adverses restaient identiques d'un bout à l'autre d'une carrière.
   Chaque journée de mercato, quelques clubs listent un joueur en trop et
   quelques autres recrutent, dans la limite de leur trésorerie.            */
FM.AI_LIST_RATE = 0.06;      /* part des clubs qui bougent par journée */
FM.AI_DEALS_PER_DAY = 8;     /* transferts IA↔IA conclus par journée    */

/* Le club a-t-il un surplus à ce poste ? (base d'une mise sur liste) */
function surplusAt(club, p){
  const meme = club.joueurs.filter(x => x.groupe === p.groupe);
  const mini = p.groupe === "G" ? 2 : p.groupe === "D" ? 6 : p.groupe === "M" ? 5 : 4;
  if (meme.length <= mini) return false;
  const rang = meme.slice().sort((a,b)=>b.note-a.note).findIndex(x=>x.id===p.id);
  return rang >= mini - 1;                    /* remplaçant du remplaçant */
}

function aiListPlayers(){
  const my = FM.state.managedClubId;
  for (const c of FM.state.db.clubs){
    if (c.id === my || FM._rnd() > FM.AI_LIST_RATE) continue;
    const cand = c.joueurs.filter(p =>
      !p.loan && !p.transferListe && !FM.justSigned(p) && surplusAt(c, p) &&
      (p.age >= 30 || p.note <= 74 || p.contrat <= 1));
    if (!cand.length) continue;
    cand[FM._ri(0, cand.length-1)].transferListe = true;
  }
}

function aiDoTransfers(){
  const my = FM.state.managedClubId;
  const clubs = FM.state.db.clubs;
  const listes = [];
  for (const c of clubs){
    if (c.id === my) continue;
    for (const p of c.joueurs) if (p.transferListe && !p.loan) listes.push({ p, seller:c });
  }
  if (!listes.length) return;
  let faits = 0;
  for (let essai = 0; essai < FM.AI_DEALS_PER_DAY*4 && faits < FM.AI_DEALS_PER_DAY; essai++){
    const { p, seller } = listes[FM._ri(0, listes.length-1)];
    if (!seller.joueurs.some(x => x.id === p.id)) continue;      /* déjà parti */
    if (FM.departureBlock(seller, p)) continue;
    const prix = Math.round(p.valeur * (0.85 + FM._rnd()*0.35) * 10)/10;
    const veut = expectedRepFor(p.note);
    const buyers = clubs.filter(c =>
      c.id !== my && c.id !== seller.id && c.joueurs.length < 28 &&
      c.budget >= prix && c.rep >= veut - 1 && !FM.isD2(c.ligue) &&
      FM.squadRating(c) - 6 <= p.note);                          /* renfort utile */
    if (!buyers.length) continue;
    const buyer = buyers[FM._ri(0, buyers.length-1)];
    seller.joueurs = seller.joueurs.filter(x => x.id !== p.id);
    seller.onze = FM.autoPickXI(seller);
    moveMoney(buyer, seller, prix);
    p.transferListe = false;
    p.signeFenetre = windowKey();
    buyer.joueurs.push(p);
    buyer.onze = FM.autoPickXI(buyer);
    faits++;
    /* on ne relaie que les mouvements notables, pour ne pas noyer le journal */
    if (p.note >= 82)
      addNews(`${FM.t('Mercato')} : ${p.nom} (${p.note}) ${FM.t('quitte')} ${seller.nom} ${FM.t('pour')} ${buyer.nom} (${prix.toFixed(1)} M€).`, "transfer");
  }
}

/* Les clubs IA recrutent aussi chez les agents libres restés sans club */
function aiSignFreeAgents(){
  const my = FM.state.managedClubId;
  for (let i = 0; i < 2; i++){
    /* On relit le vivier à CHAQUE tour : le conserver dans une variable
       renvoyait au tableau d'avant la première signature, si bien que le même
       agent libre pouvait être recruté deux fois — le même objet joueur se
       retrouvait alors dans deux clubs, jouant et marquant pour les deux. */
    const libres = FM.state.freeAgents || [];
    if (libres.length < 8) return;
    const fa = libres[FM._ri(0, libres.length-1)];
    if (!fa) continue;
    const prix = FM.freeAgentPrime(fa, 3);
    const preneurs = FM.state.db.clubs.filter(c =>
      c.id !== my && c.joueurs.length < 26 && c.budget >= prix &&
      c.rep >= expectedRepFor(fa.note) - 1);
    if (!preneurs.length) continue;
    const c = preneurs[FM._ri(0, preneurs.length-1)];
    FM.state.freeAgents = FM.state.freeAgents.filter(x => x.id !== fa.id);
    /* Sans cette ligne, un vétéran recruté par un club IA était régénéré la
       saison suivante — le joueur recruté par VOUS l'était bien, lui. */
    FM.state.usedFreeAgents = FM.state.usedFreeAgents || [];
    if (!FM.state.usedFreeAgents.includes(fa.nom)) FM.state.usedFreeAgents.push(fa.nom);
    moveMoney(c, null, prix, "primes");
    fa.transferListe = false; fa.contrat = FM._ri(2,4);
    fa.signeFenetre = windowKey();
    c.joueurs.push(fa); c.onze = FM.autoPickXI(c);
  }
}

function runAIMarket(){
  if (!FM.marketOpen()) return;
  aiListPlayers();
  aiDoTransfers();
  aiSignFreeAgents();
}

/* ============================================================
   PRÊTS DE JOUEURS (entre clubs) — durée : la saison en cours
   ============================================================ */

/* Joueurs d'autres clubs disponibles au prêt (jeunes ou doublures, hors cadres) */
FM.loanablePlayers = function(filter){
  filter = filter || {};
  const my = FM.myClub();
  let list = [];
  for (const c of FM.state.db.clubs){
    if (c.id === my.id) continue;
    const ranked = c.joueurs.slice().sort((a,b)=>b.note-a.note);
    const rank = new Map(ranked.map((p,i)=>[p.id,i]));
    for (const p of c.joueurs){
      if (p.loan) continue;                                   // déjà en prêt
      const r = rank.get(p.id);
      const wonderkid = p.potentiel>=84 && p.age<=21;         // pépite protégée : jamais prêtée
      // Prêtables : doublures/jeunes de niveau modeste (les clubs ne prêtent pas leurs bons éléments)
      const prettable = !wonderkid && p.note<=77 && ( r>=16 || (p.age<=20 && r>=11) );
      if (!prettable) continue;
      list.push({ ...p, clubId:c.id, clubNom:c.nom, pret:true });
    }
  }
  if (filter.posteExact) list = list.filter(p=>p.pos===filter.posteExact);
  else if (filter.poste) list = list.filter(p=>p.groupe===filter.poste);
  if (filter.noteMin) list = list.filter(p=>p.note>=filter.noteMin);
  if (filter.ageMax) list = list.filter(p=>p.age<=filter.ageMax);
  if (filter.q){ const q=filter.q.toLowerCase(); list=list.filter(p=>p.nom.toLowerCase().includes(q)); }
  list.sort((a,b)=> b.potentiel-a.potentiel || b.note-a.note);
  return list.slice(0, filter.limit || 60);
};

/* Un joueur peut-il partir en prêt ? Le critère est RELATIF à l'effectif : un
   remplaçant reste un remplaçant même dans un grand club. Un plafond de note
   absolu (celui qui s'applique aux prêts ENTRANTS, pour qu'on n'emprunte pas
   une star) rendait ici tout prêt impossible dans les meilleurs clubs, où
   personne n'est noté sous 77. Les cadres sont protégés par leur rang, et les
   pépites par leur potentiel. */
FM.loanableAway = function(club, p){
  if (!club || !p) return false;
  const rang = club.joueurs.slice().sort((a,b)=>b.note-a.note).findIndex(x=>x.id===p.id);
  const pepite = p.potentiel>=84 && p.age<=21;
  return !pepite && (rang>=16 || (p.age<=20 && rang>=11));
};

/* Coût d'une indemnité de prêt (M€) — payée par le club PRENEUR au club
   PARENT, dans les deux sens de prêt. */
FM.loanFee = p => Math.max(0.1, Math.round(p.valeur*0.06*10)/10);

/* Joueurs réellement sous contrat dans un club (les prêts entrants ne
   comptent pas : ils repartent en fin de saison). */
FM.ownPlayers = club => club.joueurs.filter(p => !(p.loan && p.loan.borrowerId === club.id));
/* Niveau médian du championnat d'un club : sert d'ancre au centre de
   formation, pour que les clubs affaiblis ne s'enfoncent pas indéfiniment. */
FM.leagueMedian = function(club){
  if (!club || !FM.state || !FM.state.db) return 60;
  const notes = [];
  for (const c of FM.state.db.clubs)
    if (c.ligue === club.ligue) for (const p of c.joueurs) notes.push(p.note);
  if (!notes.length) return 60;
  notes.sort((a,b)=>a-b);
  return notes[Math.floor(notes.length/2)];
};
/* Minimum de joueurs par ligne pour qu'un effectif reste jouable. Sans ce
   plancher, retraites et élagages de fin de saison pouvaient laisser un club
   sans le moindre gardien de but. */
FM.POS_FLOOR = { G:2, D:5, M:4, A:3 };
/* Retirer `p` de `club` viderait-il une ligne ? (liste facultative = effectif
   de référence, pour tester un retrait sur un effectif déjà filtré) */
FM.wouldStripLine = function(club, p, liste){
  const eff = liste || club.joueurs;
  const g = p.groupe;
  const plancher = FM.POS_FLOOR[g];
  if (!plancher) return false;
  const restants = eff.filter(x => x.groupe === g && x.id !== p.id).length;
  return restants < plancher;
};
/* Un club peut-il se séparer d'un joueur de plus sans se retrouver à court ?
   Renvoie un motif de refus, ou null si l'opération est possible. */
FM.departureBlock = function(club, player){
  const own = FM.ownPlayers(club);
  if (own.length <= 16)
    return `${FM.t("Effectif trop court")} (16 ${FM.t("joueurs sous contrat minimum")}) — ${own.length} ${FM.t("actuellement")}.`;
  if (FM.wouldStripLine(club, player, own))
    return `${FM.t("Il ne resterait pas assez de joueurs à ce poste")} (${player.pos}).`;
  return null;
};
/* Un joueur revenu d'un prêt ne peut pas repartir dans la foulée : sans ce
   délai, prêter puis rappeler en boucle resterait une manipulation gratuite. */
FM.LOAN_COOLDOWN = 1;                     /* saisons */
function loanBlockedByCooldown(p){
  return p.loanCooldown != null && FM.state.saison <= p.loanCooldown;
}

/* Emprunter un joueur (prêt entrant) */
FM.loanIn = function(playerId){
  const my = FM.myClub();
  if (!FM.marketOpen()) return { ok:false, msg:windowClosedMsg() };
  if (my.joueurs.length >= 30) return { ok:false, msg:FM.t("Effectif complet (30 max).") };
  let parent=null, player=null;
  for (const c of FM.state.db.clubs){
    if (c.id===my.id) continue;
    const p = c.joueurs.find(x=>x.id===playerId);
    if (p){ parent=c; player=p; break; }
  }
  if (!player) return { ok:false, msg:"Joueur introuvable." };
  if (player.loan) return { ok:false, msg:FM.t("Ce joueur est déjà en prêt.") };
  // Réalisme : cadres et pépites protégées ne sont pas prêtés
  const r = parent.joueurs.slice().sort((a,b)=>b.note-a.note).findIndex(x=>x.id===playerId);
  const wonderkid = player.potentiel>=84 && player.age<=21;
  const prettable = !wonderkid && player.note<=77 && ( r>=16 || (player.age<=20 && r>=11) );
  if (!prettable) return { ok:false, msg:`${parent.nom} ne prête pas ${player.nom} (élément trop important).` };
  if (loanBlockedByCooldown(player))
    return { ok:false, msg:`${player.nom} ${FM.t("rentre tout juste d'un prêt : son club le garde cette saison.")}` };
  if (FM.departureBlock(parent, player))
    return { ok:false, msg:`${parent.nom} ${FM.t("a un effectif trop court pour prêter")} ${player.nom}.` };
  const fee = FM.loanFee(player);
  if (fee > my.budget) return { ok:false, msg:`Budget insuffisant pour l'indemnité de prêt (${fee.toFixed(1)} M€).` };
  parent.joueurs = parent.joueurs.filter(x=>x.id!==playerId);
  parent.onze = FM.autoPickXI(parent);
  moveMoney(my, parent, fee);                 /* l'indemnité va au club parent */
  player.loan = { parentId:parent.id, parentNom:parent.nom, borrowerId:my.id,
                  saison:FM.state.saison, fee, payeurId:my.id };
  player.transferListe = false;
  my.joueurs.push(player); my.onze = FM.autoPickXI(my);
  FM.state.prets = FM.state.prets || [];
  FM.state.prets.push({ playerId, parentId:parent.id, borrowerId:my.id, saison:FM.state.saison, type:"in" });
  addNews(`${FM.t('Prêt')} : ${player.nom} (${player.note}) ${FM.t('arrive de')} ${parent.nom} ${FM.t("jusqu'en fin de saison")} (${fee.toFixed(1)} M€).`, "loan");
  FM.save();
  return { ok:true, msg:`${player.nom} rejoint ${my.nom} en prêt.` };
};

/* Prêter un de nos joueurs à un club preneur (prêt sortant) */
FM.loanOut = function(playerId){
  const my = FM.myClub();
  if (!FM.marketOpen()) return { ok:false, msg:windowClosedMsg() };
  const player = my.joueurs.find(x=>x.id===playerId);
  if (!player) return { ok:false, msg:"Joueur introuvable." };
  if (player.loan) return { ok:false, msg:FM.t("Ce joueur est déjà concerné par un prêt.") };
  const bloque = FM.departureBlock(my, player);
  if (bloque) return { ok:false, msg:bloque };
  /* Même filtre de réalisme qu'à l'entrée : le jeu refusait qu'un club IA
     prête un cadre, mais laissait le joueur expédier le sien — un attaquant
     à 133 M€ partait chez un promu contre 4 % de sa valeur. */
  if (!FM.loanableAway(my, player))
    return { ok:false, msg:`${player.nom} ${FM.t("est un élément trop important pour partir en prêt.")}` };
  if (loanBlockedByCooldown(player))
    return { ok:false, msg:`${player.nom} ${FM.t("rentre tout juste d'un prêt : laissez-lui la saison.")}` };
  /* Le prêt contournait la règle « pas de revente dans la foulée » : on
     pouvait signer un joueur le matin et l'expédier l'après-midi. */
  if (FM.justSigned(player))
    return { ok:false, msg:`${player.nom} ${FM.t("vient d'arriver : pas de revente avant le prochain mercato.")}` };
  // Club preneur plausible : un club modeste, qui cherche du renfort ET qui a
  // les moyens de payer l'indemnité (c'est lui qui la verse, pas le vide).
  const fee = Math.max(0.1, Math.round(player.valeur*0.04*10)/10);
  const borrowers = FM.state.db.clubs.filter(c =>
    c.id!==my.id && c.joueurs.length<30 && c.budget >= fee && !FM.isD2(c.ligue));
  if (!borrowers.length) return { ok:false, msg:FM.t("Aucun club preneur disponible.") };
  borrowers.sort((a,b)=> a.rep-b.rep);
  const borrower = borrowers[FM._ri(0, Math.min(borrowers.length-1, 9))];
  my.joueurs = my.joueurs.filter(x=>x.id!==playerId);
  my.onze = FM.autoPickXI(my);
  player.loan = { parentId:my.id, parentNom:my.nom, borrowerId:borrower.id,
                  saison:FM.state.saison, fee, payeurId:borrower.id };
  player.transferListe = false;
  borrower.joueurs.push(player); borrower.onze = FM.autoPickXI(borrower);
  FM.state.prets = FM.state.prets || [];
  FM.state.prets.push({ playerId, parentId:my.id, borrowerId:borrower.id, saison:FM.state.saison, type:"out" });
  moveMoney(borrower, my, fee);               /* le preneur paie l'indemnité */
  addNews(`${FM.t('Prêt')} : ${player.nom} ${FM.t('rejoint')} ${borrower.nom} ${FM.t('pour la saison')}${fee>0?` (+${fee.toFixed(1)} M€)`:''}.`, "loan");
  FM.save();
  return { ok:true, msg:`${player.nom} est prêté à ${borrower.nom}.` };
};

/* Liste des prêts en cours impliquant le club du joueur */
FM.myLoans = function(){
  const my = FM.myClub();
  const out = [], inc = [];
  for (const c of FM.state.db.clubs) for (const p of c.joueurs){
    if (!p.loan) continue;
    if (p.loan.parentId===my.id) out.push({ ...p, holderNom:c.nom, holderId:c.id });
    else if (p.loan.borrowerId===my.id) inc.push({ ...p });
  }
  return { out, inc };
};

/* Retourne un joueur prêté à son club parent (sans effet de développement).
   `rembourse` : interruption anticipée — l'indemnité retourne à celui qui l'a
   versée, faute de quoi prêter puis rappeler serait une source d'argent. */
function returnLoan(playerId, rembourse, finSaison){
  let holder=null, player=null;
  for (const c of FM.state.db.clubs){
    const p = c.joueurs.find(x=>x.id===playerId && x.loan);
    if (p){ holder=c; player=p; break; }
  }
  if (!player) return { ok:false };
  const parent = FM.clubById(player.loan.parentId);
  const { fee, payeurId } = player.loan;
  holder.joueurs = holder.joueurs.filter(x=>x.id!==playerId);
  holder.onze = FM.autoPickXI(holder);
  const wasOut = player.loan.parentId===FM.state.managedClubId;
  delete player.loan;
  /* Saison JUSQU'À LAQUELLE le joueur reste indisponible au prêt. En fin de
     saison, processLoansEndSeason tourne AVANT l'incrément de FM.state.saison :
     sans le +1, le marqueur était déjà périmé à la reprise et le même joueur
     pouvait repartir en prêt huit saisons d'affilée. */
  player.loanCooldown = FM.state.saison + (finSaison ? 1 : 0);
  if (parent && parent.joueurs.length < 30){ parent.joueurs.push(player); parent.onze = FM.autoPickXI(parent); }
  else if (parent){
    /* Effectif plein : le joueur reste chez son détenteur une saison de plus.
       Sans ce contrôle, des rappels en série portaient l'effectif à 34 alors
       que tous les autres chemins d'arrivée s'arrêtent à 30. */
    holder.joueurs.push(player); holder.onze = FM.autoPickXI(holder);
    if (parent.id === FM.state.managedClubId)
      addNews(`${player.nom} ${FM.t("ne peut pas revenir : votre effectif est au complet (30).")}`, "loan");
  }
  else {
    /* Club parent disparu : le joueur reste chez son détenteur plutôt que de
       s'évaporer du monde — il avait été retiré de holder.joueurs juste avant. */
    holder.joueurs.push(player); holder.onze = FM.autoPickXI(holder);
  }
  FM.state.prets = (FM.state.prets||[]).filter(pr=>pr.playerId!==playerId);
  if (rembourse && fee > 0 && payeurId != null && parent){
    /* Le bénéficiaire de l'indemnité était forcément le club parent. On ne
       rembourse que ce qu'il peut réellement rendre : entre le prêt et le
       rappel sa trésorerie a pu être écrêtée ou dépensée, et un remboursement
       à découvert poussait des clubs IA en négatif — que l'écrêtage
       remontait ensuite à zéro, créant de l'argent. */
    /* Le remboursement est intégral, quitte à laisser le club parent dans le
       rouge : le plafonner à sa trésorerie faisait du rappel anticipé un
       effaceur de dette — prêter puis rappeler soldait n'importe quel
       découvert sans rien céder. */
    moveMoney(parent, FM.clubById(payeurId), fee);
  }
  return { ok:true, player, parent, holder, wasOut, fee };
}

/* Rappeler / rendre un prêt immédiatement (déclenché par le joueur) */
FM.recallLoan = function(playerId){
  if (!FM.marketOpen()) return { ok:false, msg:windowClosedMsg() };
  const r = returnLoan(playerId, true);
  if (!r.ok) return { ok:false, msg:FM.t("Prêt introuvable.") };
  addNews(`${FM.t('Prêt interrompu')} : ${r.player.nom} ${FM.t('retrouve')} ${r.parent?r.parent.nom:FM.t('son club')}${r.fee>0?` (${FM.t('indemnité remboursée')} : ${r.fee.toFixed(1)} M€)`:''}.`, "loan");
  FM.save();
  return r;
};

/* Clôture des prêts en fin de saison : retour au club parent + développement
   des jeunes prêtés (temps de jeu gagné). */
function processLoansEndSeason(){
  for (const pr of (FM.state.prets||[]).slice()){
    const r = returnLoan(pr.playerId, false, true);   /* clôture de fin de saison */
    if (!r.ok) continue;
    const p = r.player, mine = FM.state.managedClubId;
    if (pr.type==="out" && p.age<=23){
      p.potentiel = Math.min(94, p.potentiel + FM._ri(0,1));
      p.note = Math.min(p.potentiel, p.note + FM._ri(0,2));
      p.moral = Math.min(99, p.moral + 4);
      if (r.parent && r.parent.id===mine) addNews(`${FM.t('Retour de prêt')} : ${p.nom} ${FM.t('revient grandi de son expérience')} (${p.note}).`, "loan");
    } else if (r.parent && r.parent.id===mine){
      addNews(`${FM.t('Fin de prêt')} : ${p.nom} ${FM.t('est de retour au club.')}`, "loan");
    } else if (r.holder && r.holder.id===mine){
      addNews(`${FM.t('Fin de prêt')} : ${p.nom} ${FM.t('retourne à')} ${r.parent?r.parent.nom:FM.t('son club')}.`, "loan");
    }
  }
  FM.state.prets = [];
}

/* ---------- Tactique / formation ---------- */
FM.setFormation = function(f){
  const my = FM.myClub();
  my.formation = f;
  my.onze = FM.autoPickXI(my);
  FM.save();
};
FM.setTactic = function(key, val){
  const my = FM.myClub();
  my.tactique[key] = val;
  FM.save();
};
FM.setStarter = function(slotIndex, playerId){
  const my = FM.myClub();
  /* Déplacer un titulaire d'un poste à un autre libérait son ancien poste et
     laissait un trou : on pouvait vider son propre onze à la souris, et la
     force d'équipe affichait alors des valeurs négatives absurdes. Le joueur
     déjà en place PERMUTE désormais avec celui qu'on déplace. */
  const ancien = my.onze[slotIndex] ? my.onze[slotIndex].id : null;
  const depuis = my.onze.findIndex(s => s.id === playerId);
  if (depuis >= 0 && depuis !== slotIndex) my.onze[depuis].id = ancien;
  my.onze[slotIndex].id = playerId;
  FM.save();
  return { ok:true };
};

/* ---------- Fin de saison ---------- */
FM.isSeasonOver = () => FM.state.journee >= FM.totalMatchdays();

FM.endSeason = function(){
  const t = FM.table();
  const rank = t.findIndex(c=>c.id===FM.state.managedClubId)+1;
  const champ = t[0];
  FM.snapshotFinalTables();                 // mémorise le classement final pour les coupes

  /* Les compétitions que le joueur n'a pas menées à leur terme sont achevées
     ICI, avant toute lecture de statistiques : leurs matchs ajoutent des buts
     et des notes. Les trophées étaient sinon décernés sur un total partiel —
     « meilleur buteur, 22 buts » alors que la fiche du même joueur, écrite
     quelques lignes plus bas, en affichait 28. */
  if (FM.state.europe && FM.autoCompleteClubComp){
    for (const k of ["UCL","UEL","UECL"]){
      const c = FM.state.europe[k];
      if (c && !FM.compFinished(c)) FM.autoCompleteClubComp(c);
    }
  }
  /* La coupe nationale est un tournoi SIMPLE (ni .ko ni .lp) : elle se clôture
     avec FM.autoCompleteCup, pas avec autoCompleteClubComp — laquelle, ne
     trouvant aucune phase, réécrivait `finished` à false, y compris sur une
     coupe que le joueur venait de gagner. Il faut la mener à son terme ICI,
     avant toute lecture de statistiques : ses derniers tours ajoutent des
     buts, et le meilleur buteur annoncé était faux dans huit saisons sur
     douze — trois fois ce n'était même pas le bon joueur. */
  if (FM.state.coupe && !FM.state.coupe.finished && FM.autoCompleteCup)
    FM.autoCompleteCup(FM.state.coupe);

  // --- Trophées individuels du championnat (après clôture, avant remise à zéro) ---
  /* Le seuil était de 8 matchs : le titre revenait régulièrement à un
     remplaçant ayant joué le quart de la saison. On exige les deux tiers. */
  const lb = FM.leaderboards(FM.state.ligueJoueur, Math.max(12, Math.round(FM.totalMatchdays()*0.6)));
  const potm = lb.notes[0];                 // Joueur de la saison (meilleure moyenne)
  const pichichi = lb.buteurs[0];           // Meilleur buteur
  const passeur = lb.passeurs[0];           // Meilleur passeur
  const trophies = {
    joueur:   potm ? { nom:potm.nom, club:potm.clubNom, avg:+FM.playerAvgNote(potm).toFixed(2),
                      matchs:potm.noteMatchs||0 } : null,
    buteur:   pichichi ? { nom:pichichi.nom, club:pichichi.clubNom, buts:pichichi.buts } : null,
    passeur:  passeur ? { nom:passeur.nom, club:passeur.clubNom, passes:passeur.passes||0 } : null
  };
  if (trophies.buteur) addNews(`${FM.t('Meilleur buteur')} : ${trophies.buteur.nom} (${trophies.buteur.club}) — ${trophies.buteur.buts} ${FM.t('buts')}.`, "award");
  if (trophies.passeur) addNews(`${FM.t('Meilleur passeur')} : ${trophies.passeur.nom} (${trophies.passeur.club}) — ${trophies.passeur.passes} ${FM.t('passes')}.`, "award");
  if (trophies.joueur) addNews(`${FM.t('Joueur de la saison')} : ${trophies.joueur.nom} (${trophies.joueur.club}) — ${FM.t('Note moyenne')} ${trophies.joueur.avg} ${FM.t('en')} ${trophies.joueur.matchs} ${FM.t('matchs')}.`, "award");

  const euroPrize = europeanPrize();        // prime selon le parcours européen
  const euroSum = FM.state.europe ? europeSummary() : null;

  // --- Supercoupe d'Europe : vainqueur C1 vs vainqueur C3 (saison écoulée) ---
  const superCup = playSuperCup();

  // --- Coupe nationale : clôture (simulée jusqu'au bout si non terminée) ---
  const cupResult = finishDomesticCup();

  FM.state.historique.push({
    saison: FM.state.saison,
    classement: rank,
    champion: champ.nom,
    pts: FM.myClub().pts,
    europe: euroSum,
    trophies,
    superCup,
    coupe: cupResult
  });
  addNews(`${FM.t('Fin de saison')} ${FM.state.saison} : ${champ.nom} ${FM.t('champion')}. ${FM.myClub().nom} ${FM.t('termine')} ${rank}${rank===1?FM.t("er"):FM.t("e")}.`, "season");

  // Nouvelle saison : reset tables, vieillissement, budget
  const my = FM.myClub();
  let bonus = (rank<=3 ? 30 : rank<=6 ? 15 : rank<=10 ? 5 : 0) + euroPrize;
  if (superCup && superCup.playerWon) bonus += 8;
  if (cupResult){ bonus += cupResult.playerReward; if (cupResult.playerReward>0) addNews(`${FM.t('Parcours en')} ${cupResult.nom} : +${cupResult.playerReward} M€.`, "money"); }
  if (euroPrize>0) addNews(`${FM.t("Recettes des coupes d'Europe")} : +${euroPrize.toFixed(0)} M€.`, "money");
  // --- Prêts : retour au club parent (+ développement des jeunes prêtés) ---
  processLoansEndSeason();

  const seasonJustEnded = FM.state.saison;
  /* Bandes de progression en quantiles, recalculées sur la saison qui vient
     de s'achever (monde entier, joueurs ayant au moins 8 matchs notés). */
  /* Quantiles calculés PAR LIGNE (G/D/M/A). Un seuil commun appliqué à quatre
     distributions décalées de 0,10 à 0,12 point ne partage pas 5/20/50/20/5
     dans chaque ligne : il versait les gardiens dans la queue basse et les
     attaquants dans la haute. Part des gardiens parmi les joueurs notés 85+ :
     0,92× leur poids démographique au départ, 0,10× après dix saisons. */
  const bandesParLigne = (() => {
    const parG = { G:[], D:[], M:[], A:[] };
    for (const c of FM.state.db.clubs) for (const p of c.joueurs)
      if ((p.noteMatchs||0) >= 8 && parG[p.groupe]) parG[p.groupe].push(FM.playerAvgNote(p));
    const repli = { exc:6.78, bon:6.52, moy:6.22, dec:6.03 };
    const out = {};
    for (const g of Object.keys(parG)){
      const n = parG[g];
      if (n.length < 40){ out[g] = repli; continue; }
      n.sort((a,b)=>a-b);
      const q = f => n[Math.min(n.length-1, Math.floor(n.length*f))];
      out[g] = { exc:q(0.95), bon:q(0.75), moy:q(0.25), dec:q(0.05) };
    }
    out._ = repli;
    return out;
  })();
  for (const c of FM.state.db.clubs){
    c.pts=c.j=c.g=c.n=c.p=c.bp=c.bc=0;
    /* les recettes courantes sont désormais encaissées journée par journée
       (voir applyFinances) : il ne reste ici que les primes de parcours,
       qui entrent dans le circuit et sont donc portées au grand livre */
    const avantPrime = c.budget;
    c.budget = round2(c.budget + (c===my?bonus:0));
    eco().recettes += c.budget - avantPrime;
    /* Les clubs IA sont écrêtés à chaque journée, le club du joueur ne l'était
       nulle part : sa trésorerie atteignait 983 M€ en quinze saisons, soit
       cinq fois le plafond du club le plus riche du monde, et le mercato
       n'avait plus le moindre enjeu. Les dirigeants réinvestissent donc
       l'excédent en fin de saison — plafond volontairement généreux (deux
       saisons de recettes) et annoncé, pas un couperet silencieux. */
    if (c===my){
      const plafond = FM.seasonRevenue(c) * 2;
      if (c.budget > plafond){
        const repris = round2(c.budget - plafond);
        c.budget = round2(plafond);
        eco().recettes -= repris;
        addNews(`${FM.t("Les dirigeants réinvestissent")} ${repris.toFixed(0)} M€ ${FM.t("de trésorerie excédentaire dans le club (structures, centre de formation).")}`, "money");
      }
    }
    /* historique borné : 12 saisons pour notre effectif, 3 ailleurs.
       Une ligne pèse ~94 octets et il y a plus de 5 000 joueurs.        */
    const capCarriere = (c===my) ? 12 : 3;
    for (const p of c.joueurs){
      const avg = FM.playerAvgNote(p);
      // 1) Historique de carrière (bilan de la saison écoulée)
      p.carriere = p.carriere || [];
      p.carriere.push({ saison:seasonJustEnded, club:c.nom, matchs:p.matchs||0,
                        buts:p.buts||0, passes:p.passes||0, note:p.note,
                        avg:+avg.toFixed(2), sel:p.selJeunes||null });
      while (p.carriere.length > capCarriere) p.carriere.shift();
      // 2) Boost / malus de performance (si assez de matchs NOTÉS).
      //    La garde porte sur noteMatchs et non sur matchs : un joueur
      //    comptabilisé sans être noté aurait une moyenne de 0 et tomberait
      //    dans la bande « décevante » sans avoir démérité.
      let perf=0, tag=null;
      /* Seuils en QUANTILES de la saison écoulée, et non en valeurs absolues.
         Des seuils fixes ne tiennent qu'une saison : la dispersion des
         moyennes s'élargit d'année en année, si bien que la bande neutre
         passait de 54 % à 21 % du monde en vingt saisons. Un partage en
         quantiles reste stable indéfiniment : ~5 % excellents, ~20 % bons,
         ~50 % inchangés, ~20 % moyens, ~5 % décevants. */
      if ((p.noteMatchs||0) >= 8){
        const bandes = bandesParLigne[p.groupe] || bandesParLigne._;
        if (avg>=bandes.exc){ perf=FM._ri(1,2); tag=FM.t("excellente"); }
        else if (avg>=bandes.bon){ perf=1; tag=FM.t("bonne"); }
        else if (avg<=bandes.dec){ perf=-FM._ri(1,2); tag=FM.t("décevante"); }
        else if (avg<=bandes.moy){ perf=-1; tag=FM.t("moyenne"); }
      }
      // 3) Progression / déclin liés à l'âge
      let ageDelta=0;
      /* La marche vers le potentiel ne s'arrête plus net à 23 ans : elle se
         prolonge jusqu'au pic en s'atténuant. Et le déclin commence bien à
         30 ans — `p.age` vaut ici l'âge PENDANT la saison écoulée, si bien
         qu'un seuil à 31 laissait les trentenaires traverser leur saison
         sans le moindre malus. */
      if (p.note < p.potentiel){
        if (p.age<=23) ageDelta = FM._ri(0,3);
        else if (p.age<=26) ageDelta = FM._ri(0,2);
        else if (p.age<=29) ageDelta = FM._ri(0,1);
      }
      if (p.age>=30) ageDelta -= FM._ri(0,2);
      if (p.age>=34) ageDelta -= 1;              /* fin de carrière plus nette */
      // 3 bis) Travail technique de la saison (club géré uniquement)
      if (c===my){
        const tech = FM.trainingEdge("technique");
        const poids = (p.age<=23 ? 1 : 0.5);          /* les jeunes en profitent le plus */
        if (p.note < p.potentiel){
          if (tech > 0 && FM._rnd() < tech*poids) ageDelta += 1;
          else if (tech < 0 && FM._rnd() < -tech*poids) ageDelta -= 1;
        }
        /* Un bon travail technique repousse aussi le PLAFOND d'un jeune :
           sans cela, l'effet disparaissait dès qu'il atteignait son potentiel,
           et l'axe technique devenait indiscernable d'un entraînement neutre. */
        if (tech > 0 && p.age<=23 && FM._rnd() < tech*0.12)
          p.potentiel = Math.min(94, p.potentiel + 1);
      }
      // Application : les jeunes peuvent dépasser légèrement leur potentiel sur une grande saison
      /* Le potentiel plafonne à TOUT âge. La branche par défaut plafonnait à
         94 dès 24 ans : le potentiel n'était plus consulté, et l'alignement
         qui suit (note > potentiel → potentiel = note) masquait le
         dépassement au lieu de l'empêcher. */
      const ceil = (p.age<=23 && perf>0) ? Math.min(94, p.potentiel+1) : p.potentiel;
      p.note = Math.max(40, Math.min(ceil, p.note + ageDelta + perf));
      if (perf>0 && p.age<=23) p.potentiel = Math.min(94, Math.max(p.potentiel, p.note+ FM._ri(0,2)));
      // Moral selon la saison
      p.moral = Math.max(35, Math.min(99, p.moral + (perf>0?6:perf<0?-6:0)));
      if (c===my && tag && (p.matchs||0)>=8){
        if (perf>0) addNews(`${FM.t('Saison')} ${tag} — ${p.nom} (${FM.t('moy')} ${avg.toFixed(2)}) : ${FM.t('Note')} ${p.note-perf}→${p.note}.`, "up");
        else addNews(`${FM.t('Saison')} ${tag} — ${p.nom} (${FM.t('moy')} ${avg.toFixed(2)}) : ${FM.t('Note')} ${p.note-perf}→${p.note}.`, "down");
      }
      // Reset des compteurs de la saison. Les avertissements en faisaient
      // partie : sans cette remise à zéro, la fiche affichait un cumul de
      // carrière sous le libellé « cette saison », et le seuil de suspension
      // finissait par tomber tous les cinq matchs.
      p.matchs=0; p.buts=0; p.passes=0; p.noteTotale=0; p.noteMatchs=0; p.selJeunes=null;
      p.cartons=0; p.suspension=0;
      delete p.signeFenetre;
      /* loanCooldown n'est PAS effacé ici : il l'était quelques lignes après
         avoir été posé par le retour de prêt, si bien que le même joueur
         pouvait repartir en prêt six saisons d'affilée. La comparaison de
         saison le périme d'elle-même. */
      p.age++;
      /* Invariant : la note ne dépasse jamais le potentiel. Des chemins
         détournés (bonus de retour de prêt, ajustements du centre de
         formation, héritage d'une ancienne sauvegarde) laissaient 7 % du
         monde au-dessus du sien, jusqu'à +13 — un plafond affiché que le
         joueur voyait franchi. Ce qui a été atteint devient le plafond. */
      if (p.note > p.potentiel) p.potentiel = Math.min(94, p.note);
      p.valeur = FM.playerValue(p.note, p.potentiel, p.age);
      /* Le salaire suit la valeur, comme à la création du joueur. Il n'était
         écrit qu'une fois pour toutes : un jeune passé de 60 à 94 gardait son
         salaire de jeune à vie, et comme les gros salaires partaient à la
         retraite, la masse salariale mondiale fondait de 35 % en vingt
         saisons — l'argent cessait d'être une contrainte pour l'IA.
         Le contrat protège du réajustement brutal : il se renégocie par
         paliers, à l'échéance comme dans la vraie vie. */
      const salVise = Math.round((p.valeur*2.2 + p.note*0.3)*10)/10;
      const ancienSal = p.salaire || salVise;
      p.salaire = Math.round((ancienSal + (salVise - ancienSal) * (p.contrat <= 1 ? 0.7 : 0.25))*10)/10;
      p.contrat = Math.max(0, p.contrat-1);
    }

    /* --- Fins de carrière --- */
    const partants = [];
    for (const p of c.joueurs.slice()){
      if (p.age >= 33 && FM._rnd() < retireProb(p.age)) partants.push(p);
    }
    /* Les plus âgés partent EN PREMIER, et passé 40 ans le départ n'est plus
       négociable : ni le quota d'effectif ni le plancher de postes ne peuvent
       le retenir. Sans cela un club court gardait un joueur de 41 ans, faute
       de place dans le quota ou de doublure à son poste — la ligne est de
       toute façon recomplétée juste en dessous. */
    let placeDepart = Math.max(0, c.joueurs.length - 17);   /* on ne vide pas un effectif */
    partants.sort((a,b)=>b.age-a.age);
    for (const p of partants){
      const imperatif = p.age >= 40;
      if (placeDepart <= 0 && !imperatif) break;
      if (!imperatif && FM.wouldStripLine(c, p)) continue;  /* pas la dernière doublure du poste */
      retirerDuClub(c, p);
      placeDepart--;
      if (c===my) addNews(`${p.nom} (${p.age} ${FM.t('ans')}) ${FM.t('raccroche les crampons.')}`, "season");
    }
    /* Une ligne vidée par les départs est recomplétée sur-le-champ : la
       retraite ne doit jamais laisser un club sans gardien. */
    for (const g of Object.keys(FM.POS_FLOOR)){
      let manque = FM.POS_FLOOR[g] - c.joueurs.filter(x=>x.groupe===g).length;
      while (manque-- > 0) c.joueurs.push(FM.makeYouth(c, FM.POS_BY_GROUP[g]));
    }

    /* --- Centre de formation : 1 à 3 jeunes par saison selon la réputation --- */
    /* le club du joueur reçoit toujours ses jeunes : sinon l'effectif sature
       au plafond et le centre de formation ne sert plus à rien */
    const plafond = (c===my) ? 99 : 24;
    const nJeunes = Math.min(
      1 + (FM._rnd() < (c.rep>=4 ? .8 : c.rep>=3 ? .55 : .35) ? 1 : 0)
        + (FM._rnd() < (c.rep>=4 ? .35 : .12) ? 1 : 0),
      Math.max(0, plafond - c.joueurs.length)
    );
    const promus = [];
    for (let i=0; i<nJeunes; i++){
      /* si une ligne est descendue sous son plancher, le centre de formation
         comble d'abord ce trou — un club sans gardien n'a pas de sens */
      const trou = Object.keys(FM.POS_FLOOR).find(g =>
        c.joueurs.filter(x=>x.groupe===g).length < FM.POS_FLOOR[g]);
      const poste = trou ? (FM.POS_BY_GROUP[trou] || null) : null;
      const j = FM.makeYouth(c, poste);
      promus.push(j); c.joueurs.push(j);
    }

    /* --- Élagage : l'effectif revient à sa taille cible, les plus faibles
           partent. Le club du joueur n'est jamais élagué sous 24 : c'est à
           lui de gérer son effectif.                                      --- */
    const cible = (c===my) ? 28 : 21 + FM._ri(0,2);
    while (c.joueurs.length > cible){
      let sortant = null, pire = Infinity;
      for (const p of c.joueurs){
        if (promus.indexOf(p) >= 0) continue;          /* on ne jette pas la recrue du jour */
        if (FM.wouldStripLine(c, p)) continue;         /* ni le dernier tenant du poste */
        /* score de conservation : la note, moins le poids de l'âge, moins le
           surnombre à son poste — sans ce dernier terme, les lignes protégées
           par le plancher gonflaient saison après saison (jusqu'à dix
           gardiens dans un même club). */
        const surnombre = c.joueurs.filter(x=>x.groupe===p.groupe).length - FM.POS_FLOOR[p.groupe];
        /* Un troisième gardien est bien plus dispensable qu'un septième
           milieu : le surnombre pèse plus lourd sur les lignes étroites. */
        const poidsSur = p.groupe==="G" ? 6.0 : 2.2;
        const sc = p.note + Math.max(0, 22-p.age)*0.3 - Math.max(0, p.age-31)*1.4
                 - Math.max(0, surnombre)*poidsSur;
        if (sc < pire){ pire = sc; sortant = p; }
      }
      if (!sortant) break;
      retirerDuClub(c, sortant);
      if (c===my) addNews(`${sortant.nom} (${sortant.age} ${FM.t('ans')}) ${FM.t('quitte le club en fin de contrat.')}`, "transfer");
    }

    if (c===my){
      FM.state.jeunesSaison = promus.map(p=>({ id:p.id, nom:p.nom, pos:p.pos, age:p.age,
                                               note:p.note, potentiel:p.potentiel }));
      if (promus.length) addNews(`${FM.t('Centre de formation')} : `
        + promus.map(p=>`${p.nom} (${p.age} ${FM.t('ans')}, ${p.note}/${p.potentiel})`).join(", ") + ".", "up");
    }
    c.onze = FM.autoPickXI(c);
  }

  FM.state.fin = { rec:0, sal:0, alerte:false };

  // --- Convocations en sélections de jeunes (U17/U19/U21) ---
  applyYouthCallups();

  // --- Verdict des dirigeants sur l'objectif de la saison ---
  evaluerObjectif(rank, t.length);

  // --- Montées / descentes dans le championnat du joueur ---
  const promoRelegation = applyPromotionRelegation(t);
  /* le club a changé de division : on suit */
  FM.state.ligueJoueur = FM.myClub().ligue;

  FM.state.saison++;
  FM.state.journee=0;
  FM.state.resultats=[];
  FM.state.offres=[];
  FM.state.progres={};                       // les championnats étrangers repartent à zéro
  FM.invalidateSchedules();                  // la composition des divisions a changé
  FM.state.calendrier = FM.makeSchedule(FM.clubsInMyLeague().map(c=>c.id));
  FM.setObjective();                         // nouvel objectif, adapté à la division
  FM.setupEuropeanCups();                    // coupes de la nouvelle saison (selon classement final)
  FM.setupDomesticCup();                      // nouveau tirage de la coupe nationale

  // Agents libres : vieillissement + renouvellement du vivier
  if (FM.state.freeAgents){
    FM.state.freeAgents.forEach(p=>{ p.age++; if(p.age>=32) p.note=Math.max(40,p.note-FM._ri(0,2)); p.valeur=FM.playerValue(p.note,p.potentiel,p.age); });
    /* Un vétéran qui sort par la limite d'âge doit être marqué comme consommé,
       sinon le pool le régénère à l'identique : Sergio Ramos réapparaissait
       19 fois en 25 saisons, toujours 40 ans, toujours noté 73. */
    FM.state.usedFreeAgents = FM.state.usedFreeAgents || [];
    for (const p of FM.state.freeAgents)
      if (p.age > 38 && !FM.state.usedFreeAgents.includes(p.nom)) FM.state.usedFreeAgents.push(p.nom);
    FM.state.freeAgents = FM.state.freeAgents.filter(p=>p.age<=38);
  }
  /* makeFreeAgents exclut désormais les noms déjà présents dans le vivier et
     dans les clubs : la concaténation ne peut plus produire de doublon. Un
     filet de sécurité par nom reste en place, au cas où une sauvegarde
     antérieure en porterait déjà. */
  const vus = new Set();
  FM.state.freeAgents = (FM.state.freeAgents||[]).concat(FM.makeFreeAgents(28, my.pays))
    .filter(p => { if (vus.has(p.nom)) return false; vus.add(p.nom); return true; })
    .sort((a,b)=>b.note-a.note).slice(0,60);

  // Tournoi international de l'été (alterné Coupe du Monde / Championnat d'Europe)
  const endedSeason = FM.state.saison - 1;
  const wc = (endedSeason % 2 === 0);
  FM.state.pendingIntl = { kind: wc?"WC":"EURO", defaultNation: FM.nationForCountry(my.pays), fait:false };
  addNews(`${wc?FM.t("Coupe du Monde"):FM.t("Championnat d'Europe")} — ${FM.t('cet été, prenez en main une sélection (onglet Accueil).')}`, "intl");

  const pc = FM.state.europe.playerComp;
  addNews(`${FM.t('Saison')} ${FM.state.saison} : ${FM.t('nouvel objectif')} — ${FM.state.objectif}. ${FM.t('Budget')} : ${my.budget.toFixed(1)} M€.` +
    (pc ? ` ${FM.t('Qualifié en')} ${FM.state.europe[pc].nom} !` : ` (${FM.t("Non qualifié en coupe d'Europe.")})`));
  FM.save();
};

/* ---------- Convocations en sélections de jeunes (U17 / U19 / U21) ----------
   Les jeunes joueurs prometteurs sont appelés avec les équipes de jeunes de
   leur nation ; ils y gagnent de l'expérience (petit boost de développement).
   Annoncé pour le club du joueur ; enregistré sur la fiche (p.selJeunes).      */
function applyYouthCallups(){
  const my = FM.myClub();
  for (const c of FM.state.db.clubs){
    const nation = FM.nationForCountry(c.pays);
    for (const p of c.joueurs){
      if (p.age > 21) continue;
      const cat = p.age<=17 ? "U17" : p.age<=19 ? "U19" : "U21";
      // seuil de sélection : bon niveau pour l'âge
      const seuil = p.age<=17 ? 63 : p.age<=19 ? 66 : 69;
      if (p.note < seuil && p.potentiel < seuil+6) continue;
      if (FM._rnd() > 0.85) continue;             // tous les éligibles ne sont pas retenus
      const matchs = FM._ri(2,6), buts = p.groupe==="A" ? FM._ri(0,3) : FM._ri(0,1);
      p.selJeunes = { equipe:`${nation} ${cat}`, cat, nation, matchs, buts };
      // Boost de développement (expérience internationale jeune)
      if (p.age<=23) p.potentiel = Math.min(94, p.potentiel + (FM._rnd()<0.5?1:0));
      p.moral = Math.min(99, p.moral + 3);
      if (c===my) addNews(`${p.nom} (${p.age}) ${FM.t('est convoqué en')} ${nation} ${cat} !`, "intl");
    }
  }
}

/* Clôture de la coupe nationale en fin de saison : simule les tours restants,
   annonce le vainqueur, calcule la prime du parcours du joueur. */
function finishDomesticCup(){
  const cup = FM.state.coupe;
  if (!cup) return null;
  if (!cup.finished) FM.autoCompleteCup(cup);
  // Prime selon le nombre de tours réellement franchis par le joueur (hors exempts)
  const playerRoundsWon = cup.history.filter(h=>
    h.ties.some(t=>(t.a===cup.playerSeed||t.b===cup.playerSeed) && !t.bye && t.winner===cup.playerSeed)
  ).length;
  const champTeam = cup.champion!=null ? cup.teams[cup.champion] : null;
  const playerWon = cup.champion===cup.playerSeed && cup.playerSeed>=0;
  const playerReward = (playerWon ? 15 : 0) + playerRoundsWon*2;
  addNews(`${cup.nom} : ${champTeam?champTeam.nom:'—'} ${FM.t('remporte le trophée.')}` +
    (playerWon ? " "+FM.t("Bravo, c'est VOTRE club !") : ""), "cup");
  return { nom:cup.nom, ic:cup.ic, nat:cup.nat, vainqueur:champTeam?champTeam.nom:'—', playerWon, playerReward };
}

/* ---------- Supercoupe d'Europe ----------
   Oppose le vainqueur de la Ligue des Champions au vainqueur de la Ligue Europa
   de la saison qui s'achève. Simulée et annoncée ; mise en avant si le club
   du joueur est concerné. Renvoie null si les vainqueurs ne sont pas connus. */
function playSuperCup(){
  const e = FM.state.europe;
  if (!e || !e.UCL || !e.UEL) return null;
  // S'assurer que C1 & C3 ont un vainqueur (auto-complète si le joueur n'a pas terminé)
  if (!FM.compFinished(e.UCL)) FM.autoCompleteClubComp(e.UCL);
  if (!FM.compFinished(e.UEL)) FM.autoCompleteClubComp(e.UEL);
  const ucl = FM.compChampionTeam(e.UCL);
  const uel = FM.compChampionTeam(e.UEL);
  if (!ucl || !uel) return null;
  // Force d'équipe = note d'effectif pré-calculée + aléa
  const sA = (ucl.note||70)+FM._rnd()*6, sB = (uel.note||70)+FM._rnd()*6;
  /* Le score partait de 1 but garanti par camp : sur 25 finales, aucune ne
     s'est terminée sans que les deux équipes marquent, pour 4,88 buts par
     match contre 2,7 ailleurs. On tire maintenant une loi de Poisson autour
     d'une espérance dérivée de l'écart de force, comme les autres matchs. */
  const poissonSC = lam => {
    let k = 0, pr = Math.exp(-lam), cum = pr, u = FM._rnd();
    while (u > cum && k < 9){ k++; pr = pr*lam/k; cum += pr; }
    return k;
  };
  let ga = poissonSC(Math.max(0.25, 1.35 + (sA-sB)*0.06));
  let gb = poissonSC(Math.max(0.25, 1.35 + (sB-sA)*0.06));
  let winner;
  if (ga===gb){ // prolongation / tirs au but
    winner = FM._rnd() < (sA/(sA+sB)) ? ucl : uel;
  } else winner = ga>gb ? ucl : uel;
  const myId = FM.state.managedClubId;
  const isMe = t => (t.ref===myId || t.key===myId);
  const playerInvolved = isMe(ucl) || isMe(uel);
  const playerWon = isMe(winner);
  /* La catégorie retombait sur « info » faute de second argument, et le
     suffixe restait en français en mode anglais. */
  addNews(`${FM.t('Supercoupe d\'Europe')} : ${ucl.nom} ${ga}–${gb} ${uel.nom}. ${winner.nom} ${FM.t('soulève le trophée !')}` +
    (playerInvolved ? (playerWon ? " "+FM.t("Bravo, c'est VOTRE club !") : " "+FM.t("Votre club s'incline de justesse.")) : ""), "cup");
  return { ucl:ucl.nom, uel:uel.nom, ga, gb, vainqueur:winner.nom, playerInvolved, playerWon };
}

/* ---------- Montées / descentes ----------
   Reproduit le renouvellement du championnat entre deux saisons : les derniers
   du classement (hors club du joueur) sont relégués et remplacés par des promus
   générés. Le club du joueur n'est jamais relégué (pas de division inférieure
   modélisée) — la carrière continue toujours dans l'élite.                     */
function applyPromotionRelegation(finalTable){
  const lgId  = FM.state.ligueJoueur;
  const inD2  = FM.isD2(lgId);
  const d1Id  = FM.baseLeagueId(lgId), d2Id = D2ID(lgId);
  const metaD1 = FM.leagueMeta(d1Id), metaD2 = FM.leagueMeta(d2Id);
  const N = FM.nRelegated(finalTable.length);
  const myId = FM.state.managedClubId;
  ensureSecondDivision(d1Id);                 /* la D2 du pays courant doit exister */
  const d1 = FM.state.db.clubs.filter(c=>c.ligue===d1Id);
  const d2 = FM.state.db.clubs.filter(c=>c.ligue===d2Id);
  /* la division du joueur est la seule réellement disputée : l'autre est
     départagée sur la valeur des effectifs, avec une part d'aléa           */
  const auMerite = list => list.slice()
    .sort((a,b)=> (FM.squadRating(b)+FM._ri(0,6)) - (FM.squadRating(a)+FM._ri(0,6)));

  let descendants, montants;
  if (inD2){
    montants    = finalTable.slice(0, N);                       /* le classement réel décide */
    descendants = auMerite(d1).slice(-N);
  } else {
    descendants = finalTable.slice(-N);                          /* le club du joueur inclus */
    montants    = auMerite(d2).slice(0, N);
  }
  /* la première division doit conserver sa taille */
  while (montants.length < descendants.length){
    const neuf = makePromotedClub(metaD1);
    neuf.genere = true;
    FM.state.db.clubs.push(neuf);
    eco().recettes += neuf.budget || 0;      /* comme createSecondDivision */
    montants.push(neuf);
  }
  /* La réputation suit la division. Les recettes en dépendent (REV_BY_REP) et
     elle n'était jamais réassignée : un club relégué gardait sa réputation de
     première division et encaissait jusqu'à deux fois plus qu'un club de D1,
     depuis la D2. Descendre coûte donc désormais un cran, remonter en rend un. */
  const place = (c, meta, sens) => {
    c.ligue = meta.id; c.ligueNom = meta.nom;
    if (sens === "bas") c.rep = Math.max(1, (c.rep||1) - 1);
    else if (sens === "haut") c.rep = Math.min(5, (c.rep||1) + 1);
  };
  descendants.forEach(c => place(c, metaD2, "bas"));
  montants.forEach(c => place(c, metaD1, "haut"));

  const joueurDescend = descendants.some(c=>c.id===myId);
  const joueurMonte   = montants.some(c=>c.id===myId);
  if (descendants.length){
    addNews(`${FM.t('Relégations')} (${metaD1.nom}) : ${descendants.map(c=>c.nom).join(", ")}.`, "down");
    addNews(`${FM.t('Promus')} : ${montants.map(c=>c.nom).join(", ")}.`, "up");
  }
  if (joueurDescend) addNews(`${FM.t('Votre club est relégué en')} ${metaD2.nom}.`, "down");
  if (joueurMonte)   addNews(`${FM.t('Votre club retrouve la')} ${metaD1.nom} !`, "up");
  return { releguees: descendants.map(c=>c.nom), promues: montants.map(c=>c.nom),
           joueurDescend, joueurMonte };
}

/* Génère un club promu (nom unique, effectif modeste type promu) */
const PROMO_NAMES = ["Athletic","Sporting","Union","Racing","Real","Atlético","City","United",
  "Olympique","Dynamo","Rovers","Wanderers","Forest","Metropolitan","Provincial","Étoile"];
const PROMO_SUFFIX = ["FC","SC","CF","AC","Club","1919","1908","Town"];
function makePromotedClub(lgMeta){
  const existing = new Set(FM.state.db.clubs.map(c=>c.nom));
  let nom;
  for (let tries=0; tries<40; tries++){
    nom = FM._pick(PROMO_NAMES)+" "+FM._pick(PROMO_SUFFIX);
    if (!existing.has(nom)) break;
  }
  if (existing.has(nom)) nom = nom+" "+(FM.state.saison+1);
  const rep = 1;
  const budgetTotal = 16;
  const newId = Math.max(...FM.state.db.clubs.map(c=>c.id)) + 1;
  /* Les identifiants viennent du compteur global, recalé sur la partie au
     chargement (FM.syncPlayerIds). Ils ne sont plus réattribués ici : cette
     réattribution ne regardait que les joueurs SOUS CONTRAT et ignorait le
     vivier d'agents libres, dont les identifiants sont plus récents — un
     promu héritait donc des identifiants d'agents libres existants. */
  const squad = FM.makeMasterSquad(lgMeta.pays);
  const club = {
    id: newId, nom, ligue: lgMeta.id, ligueNom: lgMeta.nom, pays: lgMeta.pays,
    couleurs: ["#374151","#e5e7eb"],
    rep, budget: budgetTotal*0.2, budgetTotal,
    joueurs: squad,
    formation: "4-4-2",
    tactique: { mentalite:1, tempo:1, pressing:1, largeur:1 },
    onze: [], pts:0, j:0, g:0, n:0, p:0, bp:0, bc:0
  };
  club.onze = FM.autoPickXI(club);
  return club;
}

/* Prime européenne = phase de ligue + tours à élimination directe */
function europeanPrize(){
  const e = FM.state.europe;
  if (!e || !e.playerComp) return 0;
  const comp = e[e.playerComp], ko = comp.ko;
  const perRound = { UCL:14, UEL:7, UECL:4 }[e.playerComp] || 5;
  let prize = 6;   // participation à la phase de ligue
  if (ko){
    const roundsPlayed = ko.history.filter(h=>h.ties.some(t=>t.a===ko.playerSeed||t.b===ko.playerSeed)).length;
    prize += roundsPlayed * perRound;
    if (ko.finished && ko.champion===ko.playerSeed) prize += perRound*3;
  }
  return prize;
}
function europeSummary(){
  const e = FM.state.europe; if (!e || !e.playerComp) return null;
  const comp = e[e.playerComp], ko = comp.ko;
  let res;
  if (comp.phase==="league") res = FM.t("phase de ligue");
  else if (ko && ko.finished && ko.champion===ko.playerSeed) res = FM.t("Vainqueur");
  else if (ko && ko.playerSeed < 0){
    /* Le club n'a pas atteint la phase finale : lpFinishToKO pose playerSeed
       à −1. Aucune confrontation ne le référence, si bien que le bilan restait
       bloqué sur « en cours » — 23 saisons sur 25 dans le palmarès. */
    res = FM.t("éliminé en phase de ligue");
  }
  else if (ko){
    const lost = ko.history.find(h=>h.ties.some(t=>(t.a===ko.playerSeed||t.b===ko.playerSeed)&&t.winner!==ko.playerSeed));
    res = lost ? (FM.t("éliminé en ")+lost.nom) : FM.t("en cours");
  } else res = FM.t("en cours");
  return { comp:e.playerComp, nom:comp.nom, resultat:res };
}

/* Enregistre le résultat d'un tournoi international disputé en carrière */
FM.recordIntlResult = function(kind, nation, championNom, playerWon){
  if (FM.state.pendingIntl) FM.state.pendingIntl.fait = true;   // épreuve consommée
  const nomTournoi = kind==="WC" ? "Coupe du Monde" : "Championnat d'Europe";
  FM.state.intlPalmares = FM.state.intlPalmares || [];
  FM.state.intlPalmares.unshift({ saison:FM.state.saison, tournoi:nomTournoi, nation, champion:championNom, playerWon });
  addNews(`${nomTournoi} : ${championNom} ${FM.t('champion')}.` + (playerWon ? ` ${FM.t("Avec")} ${nation}, ${FM.t("vous êtes sur le toit du monde !")}` : ` (${FM.t("Vous dirigiez")} ${nation}.)`), "intl");
  FM.save();
};

/* ---------- Actualités ---------- */
/* kind : catégorie affichée sous forme de marqueur typographique
   (title, cup, injury, card, transfer, loan, money, intl, season, up, down, award, match) */
function addNews(txt, kind){
  FM.state.news.unshift({ txt, kind:kind||"info", saison:FM.state.saison, j:FM.state.journee });
  if(FM.state.news.length>60) FM.state.news.pop();
}
FM.addNews = addNews;

/* ---------- Sauvegarde locale ----------
   Une carrière longue doit tenir sous le quota du navigateur (5 Mo).
   Deux leviers : les champs qui valent leur valeur par défaut ne sont pas
   écrits, et l'historique de carrière est borné (voir endSeason).        */
const SAVE_DEFAULTS = { buts:0, passes:0, matchs:0, noteTotale:0, noteMatchs:0,
                        transferListe:false, selJeunes:null, blessure:0,
                        suspension:0, cartons:0 };
/* fonction classique et non fléchée : « this » est l'objet qui porte la clé,
   ce qui permet de n'alléger que les joueurs et rien d'autre */
function saveReplacer(k, v){
  if (this && this.pos !== undefined && this.note !== undefined &&
      Object.prototype.hasOwnProperty.call(SAVE_DEFAULTS, k) && v === SAVE_DEFAULTS[k]) return undefined;
  return v;
}
/* Restaure les valeurs par défaut omises et rattrape les formats anciens */
FM.migrateState = function(){
  const s = FM.state; if (!s) return;
  /* Avant toute chose : recaler le compteur d'identifiants sur la partie
     chargée, sinon les prochains joueurs créés reprendront des id existants. */
  if (FM.syncPlayerIds) FM.syncPlayerIds(s);
  if (FM.setRngCursor && typeof s.rng === "number") FM.setRngCursor(s.rng);
  FM.invalidateSchedules();
  const fix = p => { for (const k in SAVE_DEFAULTS) if (p[k] === undefined) p[k] = SAVE_DEFAULTS[k]; };
  ((s.db && s.db.clubs) || []).forEach(c => (c.joueurs || []).forEach(fix));
  (s.freeAgents || []).forEach(fix);
  (s.news || []).forEach(n => { if (!n.kind) n.kind = "info"; });
  const comp = c => { if (c && c.emoji && !c.ic){ c.ic = "cup"; delete c.emoji; } };
  comp(s.coupe);
  if (s.europe) ["UCL","UEL","UECL"].forEach(k => comp(s.europe[k]));
  if (!s.fin) s.fin = { rec:0, sal:0 };
  /* Grand livre : recréé s'il manque, et chaque poste ramené à un nombre.
     Une partie d'avant le circuit fermé repart ainsi d'une base saine. */
  if (!s.eco || typeof s.eco !== "object" || Array.isArray(s.eco)) s.eco = Object.assign({}, ECO0);
  for (const k of Object.keys(ECO0)) if (!nombreSain(s.eco[k])) s.eco[k] = 0;
  ((s.db && s.db.clubs) || []).forEach(c => {
    if (!nombreSain(c.budget)) c.budget = 0;
    if (!c.formation || (FM.FORMATIONS && !FM.FORMATIONS[c.formation])) c.formation = "4-4-2";
    if (!c.tactique || typeof c.tactique !== "object")
      c.tactique = { mentalite:1, tempo:1, pressing:1, largeur:1 };
    if (!Array.isArray(c.onze)) c.onze = [];
  });
  /* Renumérotation des identifiants en double, hérités d'une sauvegarde
     antérieure au recalage du compteur : deux joueurs partageant un id
     étaient effacés ensemble à la première vente, au premier prêt ou à la
     première retraite. Le premier vu garde son identifiant. */
  if (s.db && Array.isArray(s.db.clubs)){
    const sain = v => typeof v === "number" && isFinite(v) && v >= 0;
    const vus = new Set(), aRenumeroter = [];
    const passer = p => {
      if (!p) return;
      /* Un identifiant non numérique compte comme un doublon : il doit être
         remplacé, pas propagé. Le laisser entrer dans `vus` faisait valoir
         NaN à Math.max, et TOUS les joueurs renumérotés héritaient de NaN —
         que JSON écrivait en null, rendant la sauvegarde illisible. */
      if (!sain(p.id) || vus.has(p.id)) aRenumeroter.push(p); else vus.add(p.id);
    };
    for (const c of s.db.clubs) (c.joueurs || []).forEach(passer);
    (s.freeAgents || []).forEach(passer);
    if (aRenumeroter.length){
      const finis = [...vus].filter(sain);
      let suivant = (finis.length ? Math.max(...finis) : 0) + 1;
      /* On mémorise l'ancien identifiant pour remapper tout ce qui y renvoie */
      const remap = new Map();
      for (const p of aRenumeroter){
        const ancien = p.id;
        p.id = suivant++;
        vus.add(p.id);
        if (sain(ancien) && !remap.has(ancien)) remap.set(ancien, p.id);
      }
      if (FM.syncPlayerIds) FM.syncPlayerIds(s);
      /* Tout ce qui désigne un joueur PAR SON IDENTIFIANT doit suivre :
         sans cela un prêt devenait perpétuel (le joueur n'était jamais rendu)
         et une offre pointait dans le vide. */
      for (const c of s.db.clubs){
        const ids = new Set((c.joueurs || []).map(x => x && x.id));
        if (Array.isArray(c.onze)) c.onze.forEach(sl => {
          if (!sl || sl.id == null) return;
          if (remap.has(sl.id) && !ids.has(sl.id)) sl.id = remap.get(sl.id);
          if (!ids.has(sl.id)) sl.id = null;
        });
      }
      const suivre = (obj, cle) => {
        if (!obj || obj[cle] == null) return;
        if (remap.has(obj[cle])) obj[cle] = remap.get(obj[cle]);
      };
      (s.prets || []).forEach(pr => suivre(pr, "playerId"));
      (s.offres || []).forEach(o => suivre(o, "joueurId"));
      (s.jeunesSaison || []).forEach(j => suivre(j, "id"));
    }
  }
  if (typeof s.ver !== "number" || !isFinite(s.ver)) s.ver = 0;
  if (!Array.isArray(s.historique)) s.historique = [];
  if (!Array.isArray(s.prets)) s.prets = [];
  if (!Array.isArray(s.offres)) s.offres = [];
  if (!s.progres || typeof s.progres !== "object") s.progres = {};
};
/* Contrôle d'intégrité : mieux vaut refuser une sauvegarde abîmée que
   planter à la première action */
/* Un nombre exploitable : ni NaN, ni ±Infinity, ni chaîne, ni null.
   JSON.stringify sérialise NaN et Infinity en `null` : une trésorerie abîmée
   revenait donc silencieusement à null, et l'argent disparaissait du bilan. */
/* Une trésorerie plausible tient largement sous ce plafond. isFinite(1e308)
   est vrai : sans borne d'amplitude, une valeur extrême était acceptée, puis
   débordait en Infinity au premier calcul, et JSON la réécrivait en null —
   le jeu produisait lui-même une sauvegarde qu'il refuserait de relire. */
const MONTANT_MAX = 1e9;      /* au-delà, round2 cesse d'être exact au centime */
const nombreSain = v => typeof v === "number" && isFinite(v) && Math.abs(v) <= MONTANT_MAX;

FM.checkState = function(s){
  try { return checkStateInterne(s); }
  catch(e){ return "structure"; }            /* une forme inattendue ne doit jamais jeter */
};
function checkStateInterne(s){
  if (!s || typeof s !== "object" || Array.isArray(s)) return "format";
  if (!s.db || !Array.isArray(s.db.clubs) || !s.db.clubs.length) return "clubs";
  if (!Array.isArray(s.calendrier)) return "calendrier";
  if (!Array.isArray(s.resultats)) return "résultats";
  if (!Array.isArray(s.news)) return "actualités";
  if (s.managedClubId == null || !s.db.clubs.some(c => c.id === s.managedClubId)) return "club dirigé";
  if (typeof s.journee !== "number" || !isFinite(s.journee) || s.journee < 0) return "compteurs";
  if (typeof s.saison !== "number" || !isFinite(s.saison)) return "compteurs";
  if (s.ligueJoueur == null || !s.db.clubs.some(c => c.ligue === s.ligueJoueur)) return "championnat";
  /* Le club dirigé doit être exploitable : un effectif vide, une trésorerie
     NaN ou un onze absent font planter le premier écran. */
  const my = s.db.clubs.find(c => c.id === s.managedClubId);
  if (!Array.isArray(my.joueurs) || !my.joueurs.length) return "effectif";
  if (!Array.isArray(my.onze)) return "composition";
  /* Une composition qui désigne des joueurs absents plante au premier match */
  const idsEffectif = new Set(my.joueurs.map(p => p && p.id));
  for (const sl of my.onze){
    if (!sl || typeof sl !== "object") return "composition";
    if (sl.id != null && !idsEffectif.has(sl.id)) return "composition";
  }
  /* Coupes : elles doivent référencer des clubs qui existent */
  /* Un tableau `teams` VIDE passait ce contrôle : la sauvegarde était acceptée,
     puis l'onglet Coupe levait « Cannot read properties of undefined (reading
     'bye') » dès le premier rendu, et resolveTournamentRound plantait au tour
     suivant. On exige donc des équipes, et surtout que chaque indice encore en
     lice dans `alive` désigne bien une entrée existante de `teams` — c'est
     l'incohérence entre les deux tableaux qui fait déréférencer dans le vide,
     pas leur absence. */
  const compsOK = comp => {
    if (!comp) return true;
    if (typeof comp !== "object" || !Array.isArray(comp.teams)) return false;
    if (!comp.teams.length) return false;
    if (comp.teams.some(t => !t || typeof t !== "object")) return false;
    if (comp.alive !== undefined){
      if (!Array.isArray(comp.alive)) return false;
      if (comp.alive.some(i => !Number.isInteger(i) || i < 0 || i >= comp.teams.length)) return false;
    }
    return true;
  };
  if (!compsOK(s.coupe)) return "coupe";
  if (s.europe !== undefined){
    if (!s.europe || typeof s.europe !== "object") return "coupes d'Europe";
    for (const k of ["UCL","UEL","UECL"]) if (!compsOK(s.europe[k])) return "coupes d'Europe";
  }
  /* Le onze doit rester jouable : au moins un titulaire réel, une formation
     connue et des consignes présentes. Sans ces contrôles la sauvegarde était
     acceptée puis le moteur déréférençait dans le vide au premier match. */
  if (!my.onze.some(sl => sl && sl.id != null && idsEffectif.has(sl.id))) return "composition";
  /* `!= null` laissait passer null/undefined, sur quoi autoPickXI plante
     (`slots is not iterable`) : la sauvegarde était acceptée puis la partie
     devenait injouable au premier bouton. */
  if (FM.FORMATIONS && !FM.FORMATIONS[my.formation]) return "formation";
  if (!my.tactique || typeof my.tactique !== "object") return "consignes";
  /* Identifiants de joueurs : exploitables et uniques. Une sauvegarde
     antérieure au recalage du compteur en porte jusqu'à 412 en double, et un
     identifiant démesuré fige le compteur (au-delà de 2^53, max+1 === max). */
  /* Seul un identifiant NUMÉRIQUE DÉMESURÉ est rédhibitoire : au-delà de 2^53
     le compteur cesse d'avancer et tous les joueurs suivants partagent le même
     identifiant. Un identifiant simplement invalide ou en double est réparé
     par migrateState — y compris dans le vivier d'agents libres, qui alimente
     la renumérotation et n'était jusqu'ici jamais contrôlé. */
  const idFatal = p => p && typeof p.id === "number" && (!isFinite(p.id) || p.id < 0 || p.id > 1e12);
  for (const c of s.db.clubs) for (const p of c.joueurs) if (idFatal(p)) return "identifiants";
  if (Array.isArray(s.freeAgents)) for (const p of s.freeAgents) if (idFatal(p)) return "identifiants";
  /* Les DOUBLONS d'identifiant ne sont pas rédhibitoires : migrateState les
     renumérote. Une carrière héritée d'avant le recalage du compteur en porte
     jusqu'à 412, et la refuser en bloc serait disproportionné. */
  /* La trésorerie de CHAQUE club doit être un nombre : une seule valeur
     abîmée fausse toute la comptabilité, pas seulement la vôtre. */
  for (const c of s.db.clubs){
    if (!Array.isArray(c.joueurs)) return "effectifs";
    /* Ces contrôles ne portaient que sur le club dirigé : 270 clubs sur 271
       y échappaient, et un seul club abîmé faisait planter la 1re journée. */
    if (c.formation != null && FM.FORMATIONS && !FM.FORMATIONS[c.formation]) return "formation";
    if (!c.tactique || typeof c.tactique !== "object") return "consignes";
    if (!Array.isArray(c.onze)) return "composition";
    /* Seule la trésorerie du club DIRIGÉ est rédhibitoire : celle d'un club
       adverse est réparable, et refuser toute une carrière pour un chiffre
       abîmé chez un club de fond serait disproportionné (migrateState la
       ramène à zéro, comme il le fait déjà pour le grand livre). */
    if (c.id === s.managedClubId && !nombreSain(c.budget)) return "trésorerie";
  }
  /* Le grand livre : s'il est présent, il doit être exploitable. Absent, il
     sera recréé par migrateState. */
  if (s.eco !== undefined){
    if (!s.eco || typeof s.eco !== "object" || Array.isArray(s.eco)) return "comptabilité";
    for (const k of Object.keys(ECO0)) if (s.eco[k] !== undefined && !nombreSain(s.eco[k])) return "comptabilité";
  }
  /* Champs de liste attendus ailleurs dans le jeu */
  if (s.historique !== undefined && !Array.isArray(s.historique)) return "historique";
  if (s.freeAgents !== undefined && !Array.isArray(s.freeAgents)) return "agents libres";
  if (s.prets !== undefined && !Array.isArray(s.prets)) return "prêts";
  if (s.offres !== undefined && !Array.isArray(s.offres)) return "offres";
  /* Le calendrier doit désigner des clubs qui existent réellement */
  const ids = new Set(s.db.clubs.map(c => c.id));
  for (const jour of s.calendrier){
    if (!Array.isArray(jour)) return "calendrier";
    for (const m of jour){
      if (!m || typeof m !== "object") return "calendrier";
      if (!ids.has(m.dom) || !ids.has(m.ext)) return "calendrier";
    }
  }
  return null;
}
FM.saveError = null;   /* "quota" | "erreur" | "indisponible" | null */
FM.loadError = null;   /* "illisible" | motif d'invalidité | null */

/* ---------- ACCÈS AU STOCKAGE ----------
   En navigation privée stricte, ou cookies bloqués, le simple fait de LIRE
   localStorage lève une exception. Sans ces gardes, l'erreur remontait au
   chargement du script et la page restait entièrement blanche. Le jeu doit
   rester jouable — sans sauvegarde, mais jouable.                         */
FM.storageOK = true;
function lsGet(k){
  try { return localStorage.getItem(k); }
  catch(e){ FM.storageOK = false; return null; }
}
function lsSet(k, v){ localStorage.setItem(k, v); }   /* l'appelant gère l'échec */
function lsDel(k){ try { localStorage.removeItem(k); } catch(e){ FM.storageOK = false; } }

/* Identité de l'onglet courant et compteur de version : deux onglets ouverts
   sur la même partie s'écrasaient mutuellement en silence — quinze journées
   pouvaient disparaître sans le moindre message. Chaque écriture incrémente
   la version ; si celle du disque a bougé sans nous, c'est qu'un autre onglet
   a joué, et on refuse d'écraser. */
const SESSION_ID = "s" + Math.floor(Math.random()*1e9).toString(36) + Date.now().toString(36);
FM.sessionId = SESSION_ID;
FM.conflitOnglet = false;
/* Version que NOUS croyons être sur le disque, du fait de nos propres
   lectures et écritures. Un conflit, c'est le disque qui a bougé sans nous —
   pas une version simplement plus haute que celle de l'état en mémoire.
   Sans cette distinction, démarrer une seconde carrière ou importer une
   sauvegarde plus ancienne était pris pour un conflit et n'était jamais
   enregistré : le joueur jouait une partie qui disparaissait au rechargement. */
let verConnue = null;
function versionSurDisque(){
  const raw = lsGet(SAVE_KEY);
  if (!raw) return null;
  /* lecture ciblée : inutile de désérialiser plusieurs mégaoctets */
  const m = /"ver"\s*:\s*(\d+)/.exec(raw);
  return m ? parseInt(m[1], 10) : null;
}
/* Remplacement délibéré (nouvelle partie, import) : on adopte la lignée du
   disque, l'écriture qui suit ne peut pas être prise pour un conflit. */
function adopterVersionDisque(){ verConnue = versionSurDisque(); }
FM.adopterVersionDisque = adopterVersionDisque;
FM.save = function(){
  try {
    if (FM.rngCursor) FM.state.rng = FM.rngCursor();   // le hasard reprend où il s'est arrêté
    const surDisque = versionSurDisque();
    if (verConnue != null && surDisque != null && surDisque !== verConnue){
      /* le disque a bougé depuis notre dernière lecture ou écriture :
         un autre onglet a joué. */
      FM.conflitOnglet = true;
      FM.saveError = "conflit";
      return false;
    }
    FM.state.ver = Math.max(surDisque || 0, FM.state.ver || 0) + 1;
    FM.state.sess = SESSION_ID;
    lsSet(SAVE_KEY, JSON.stringify(FM.state, saveReplacer));
    /* La lignée n'avance qu'APRÈS une écriture réussie : la faire avancer
       avant laissait, sur un échec de quota, une version en mémoire absente
       du disque — toute écriture ultérieure était alors prise pour un conflit
       et le joueur ne pouvait plus jamais enregistrer, même le quota libéré. */
    verConnue = FM.state.ver;
    FM.saveError = null;
    FM.storageOK = true;
    FM.conflitOnglet = false;
    return true;
  } catch(e){
    if (e && (e.name === "QuotaExceededError" || e.code === 22)) FM.saveError = "quota";
    else { FM.saveError = "indisponible"; FM.storageOK = false; }
    return false;
  }
};
FM.load = function(){
  const raw = lsGet(SAVE_KEY);
  if (!raw){ FM.loadError = "absente"; return false; }
  let s;
  try { s = JSON.parse(raw); } catch(e){ FM.loadError = "illisible"; return false; }
  const bad = FM.checkState(s);
  if (bad){ FM.loadError = bad; return false; }
  /* La migration touche à des structures venues du disque : si elle échoue,
     mieux vaut refuser la sauvegarde que laisser l'exception remonter et
     laisser l'écran blanc, sans le moindre recours. */
  const ancien = FM.state;
  try {
    FM.state = s;
    FM.migrateState();
  } catch(e){
    FM.state = ancien; FM.loadError = "structure";
    return false;
  }
  FM.loadError = null;
  FM.conflitOnglet = false;                  /* la relecture résout le conflit */
  if (FM.saveError === "conflit") FM.saveError = null;
  verConnue = FM.state.ver || 0;             /* on suit désormais cette lignée */
  return true;
};
FM.hasSave = () => !!lsGet(SAVE_KEY);
FM.deleteSave = function(){ lsDel(SAVE_KEY); FM.state=null; FM.saveError=null; verConnue=null; };
/* Export / import : filet de sécurité si le navigateur refuse d'écrire */
FM.exportSave = () => JSON.stringify(FM.state, saveReplacer);
FM.importSave = function(txt){
  let s;
  try { s = JSON.parse(txt); } catch(e){ return "illisible"; }
  const bad = FM.checkState(s);
  if (bad) return bad;
  const ancien = FM.state;
  try {
    FM.state = s;
    FM.migrateState();
  } catch(e){
    FM.state = ancien;
    return "structure";
  }
  adopterVersionDisque();                    /* remplacement voulu : on écrase */
  /* La valeur de retour était ignorée : sur un quota saturé l'interface
     annonçait « Partie importée » alors que le disque n'avait pas bougé, et
     le joueur retombait sur l'ancienne partie au rechargement suivant. */
  if (!FM.save()) return FM.saveError === "quota" ? "quota" : "écriture";
  return null;
};
FM.saveSizeKo = () => Math.round(JSON.stringify(FM.state, saveReplacer).length/1024);
