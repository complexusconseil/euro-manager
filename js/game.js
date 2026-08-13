/* ============================================================
   CARRIÈRE — état du jeu, calendrier, classement, mercato, sauvegarde
   ============================================================ */
var FM = window.FM;
var SAVE_KEY = "fm_carriere_save_v1";

FM.state = null;

/* ---------- Nouvelle partie ---------- */
FM.newGame = function(managerName, clubId, seed){
  FM.setSeed(seed || 20260810);
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
    objectif: objectifFor(club)
  };
  addNews(`Bienvenue ${FM.state.managerName} ! Vous prenez les rênes de ${club.nom}. Objectif : ${FM.state.objectif}.`);
  FM.setupEuropeanCups();
  const pc0 = FM.state.europe.playerComp;
  if (pc0) addNews(`🏆 ${club.nom} est engagé en ${FM.state.europe[pc0].nom} cette saison !`);
  FM.setupDomesticCup();
  addNews(`${FM.state.coupe.emoji} ${FM.state.coupe.nom} : le tirage est fait, à vous de jouer !`);
  FM.state.freeAgents = FM.makeFreeAgents(46, club.pays);
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
    objectif: "assurer le maintien et bâtir votre club"
  };
  addNews(`⚽ Master League — ${FM.state.managerName} fonde ${mlClub.nom} et intègre la ${lgMeta.nom} (à la place de ${removed.nom}). Budget de départ : ${mlClub.budget.toFixed(1)} M€. Bâtissez une équipe compétitive !`);
  FM.setupEuropeanCups();                     // (un promu n'est en général pas qualifié)
  FM.setupDomesticCup();                       // engagé en coupe nationale dès la 1re saison
  addNews(`${FM.state.coupe.emoji} Engagé en ${FM.state.coupe.nom} : une chance de titre dès cette saison !`);
  // ML : vivier d'agents libres plus fourni pour bâtir l'équipe avec un budget fixé
  FM.state.freeAgents = FM.makeFreeAgents(56, lgMeta.pays);
  addNews(`🆓 ${FM.state.freeAgents.length} agents libres disponibles : recrutez malin avec votre budget (onglet Mercato).`);
  FM.save();
  return FM.state;
};

function objectifFor(club){
  if (club.rep >= 5) return "remporter le titre";
  if (club.rep === 4) return "terminer sur le podium";
  if (club.rep === 3) return "accrocher une place européenne (top 6)";
  if (club.rep === 2) return "atteindre le milieu de tableau";
  return "assurer le maintien";
}

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
  FM.tickAvailability();                 // blessures/suspensions : une journée de moins

  postMatchdayUpdates(myResult);
  FM.save();
  return { dayResults, myResult };
};

/* Décrémente blessures et suspensions d'une journée (sauf celles du jour) */
FM.tickAvailability = function(){
  for (const c of FM.state.db.clubs) for (const p of c.joueurs){
    if (p._justInjured){ delete p._justInjured; continue; }
    if (p.blessure>0){ p.blessure--; if(!p.blessure && c.id===FM.state.managedClubId) addNews(`💪 ${p.nom} est de retour de blessure.`); }
    if (p.suspension>0){ p.suspension--; if(!p.suspension && c.id===FM.state.managedClubId) addNews(`✅ ${p.nom} a purgé sa suspension.`); }
  }
};

/* Annonce les incidents du club géré dans le journal */
function announceIncidents(club, incidents){
  for (const inc of incidents){
    if (inc.type==="injury") addNews(`🤕 ${inc.nom} se blesse (${inc.duree} journée${inc.duree>1?'s':''} d'indisponibilité).`);
    else if (inc.type==="red") addNews(`🟥 ${inc.nom} est expulsé — suspendu pour la suite.`);
    else if (inc.suspend) addNews(`🟨 ${inc.nom} : 5e avertissement, suspendu la prochaine journée.`);
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
  for (const c of [dom, ext]){
    const won = (c===dom&&domWin)||(c===ext&&extWin);
    const conceded = c===dom ? res.extScore : res.domScore;
    const scorers = goalsBy[c.id] || [];
    const xi = c.onze.map(s=>FM.getPlayer(c, s.id)).filter(Boolean);
    // Passes décisives : un coéquipier (milieu/attaquant de préférence) crédité par but (~65 %)
    for (const gId of scorers){
      if (FM._rnd() < 0.65){
        const cand = xi.filter(p=>p.id!==gId);
        const off = cand.filter(p=>p.groupe==="M"||p.groupe==="A");
        const passer = FM._pick(off.length ? off : cand);
        if (passer) passer.passes = (passer.passes||0)+1;
      }
    }
    // Note de match par titulaire
    for (const p of xi){
      p.matchs++;
      let note = 6.0 + FM._rnd()*0.6 - 0.3;
      const persoGoals = scorers.filter(id=>id===p.id).length;
      note += persoGoals*1.1;
      if (won) note += 0.4; else if (drew) note += 0.1; else note -= 0.2;
      if (p.groupe==="D" || p.pos==="GB"){ note += conceded===0 ? 0.6 : -conceded*0.15; }
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
    addNews(`J${FM.state.journee} — ${my.nom} ${gagne?"s'impose":(nul?"fait match nul":"s'incline")} ${s} face à ${adv.nom}.`);
  }
  // Mercato IA : offres pour nos joueurs listés
  generateAIOffers();
}

/* ============================================================
   AGENDA UNIFIÉ — toutes les compétitions dans le même calendrier
   Chaque tour de coupe est rattaché à une journée de championnat, pour que
   rien ne puisse être « oublié » faute d'aller sur le bon onglet.
   ============================================================ */
FM.CUP_FIRST = 3;   FM.CUP_EVERY = 5;    // coupe nationale : J4, J9, J14…
FM.EURO_FIRST = 2;  FM.EURO_EVERY = 3;   // phase de ligue : J3, J6, J9…
FM.EUROKO_FIRST = 20; FM.EUROKO_EVERY = 4; // phase finale : J21, J25…

/* Journée à laquelle le tour `r` (0-indexé) d'une compétition est programmé */
function dueMatchday(kind, r){
  if (kind==="coupe") return FM.CUP_FIRST + r*FM.CUP_EVERY;
  if (kind==="euroLp") return FM.EURO_FIRST + r*FM.EURO_EVERY;
  return FM.EUROKO_FIRST + r*FM.EUROKO_EVERY;
}

/* Liste ordonnée de tous les rendez-vous EN ATTENTE (championnat + coupes).
   [{ kind, emoji, titre, detail, due, enRetard }]                          */
FM.pendingEvents = function(){
  const out = [];
  const j = FM.state.journee;

  // 1) Match de championnat de la journée courante
  const fx = FM.nextFixture();
  if (fx){
    const dom = FM.clubById(fx.dom), ext = FM.clubById(fx.ext);
    const chezMoi = fx.dom===FM.state.managedClubId;
    out.push({ kind:"league", emoji:"🏆", titre:`${FM.myClub().ligueNom} — journée ${j+1}`,
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
      out.push({ kind:"coupe", emoji:cup.emoji, titre:`${cup.nom} — ${FM.roundName(cup.alive.length)}`,
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
        out.push({ kind:"euro", emoji:comp.emoji, titre:`${comp.nom} — phase de ligue`, detail:d, due, enRetard:j>due });
      }
    } else if (comp.ko && !comp.ko.finished && comp.ko.playerAlive){
      const due = dueMatchday("euroKo", comp.ko.round);
      if (j >= due){
        const tie = FM.playerTie(comp.ko);
        let d = "à jouer";
        if (tie){ const o = comp.ko.teams[tie[0]===comp.ko.playerSeed?tie[1]:tie[0]]; d = "contre "+o.nom; }
        out.push({ kind:"euro", emoji:comp.emoji, titre:`${comp.nom} — ${FM.roundName(comp.ko.alive.length)}`, detail:d, due, enRetard:j>due });
      }
    }
  }

  // 4) Tournoi international de l'été (facultatif)
  const pi = FM.state.pendingIntl;
  if (pi && !pi.fait){
    out.push({ kind:"intl", emoji: pi.kind==="WC"?"🌍":"🇪🇺",
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
    return { open:true, type:"ete", nom:"Mercato d'été",
             info:`ouvert — ferme après la journée ${FM.WINDOW_SUMMER_END}`,
             ferme: FM.WINDOW_SUMMER_END - j };
  if (j >= winterStart && j < winterEnd)
    return { open:true, type:"hiver", nom:"Mercato d'hiver",
             info:`ouvert — ferme après la journée ${winterEnd}`,
             ferme: winterEnd - j };
  // Fermé : prochaine ouverture
  if (j < winterStart)
    return { open:false, nom:"Mercato fermé",
             info:`réouverture au mercato d'hiver (journée ${winterStart+1})`,
             ouvre: winterStart - j };
  return { open:false, nom:"Mercato fermé",
           info:"réouverture au mercato d'été (saison prochaine)",
           ouvre: total - j };
};
FM.marketOpen = () => FM.transferWindow().open;
function windowClosedMsg(){
  const w = FM.transferWindow();
  return `⛔ ${w.nom} — ${w.info}.`;
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
    .map(p=>({ ...p, clubId:null, clubNom:"🆓 Agent libre", dispo:true, libre:true })));
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
   prime d'autant plus élevée que le club est loin de son niveau (pas de refus). */
FM.freeAgentPrime = function(fa, buyerRep){
  const gap = Math.max(0, expectedRepFor(fa.note) - (buyerRep||1));
  const mult = 1 + 0.3*gap;                        // écart de 2 crans → ×1.6
  return Math.max(0.1, Math.round(fa.valeur * 0.2 * mult * 10)/10);
};

/* Acheter : renvoie {ok, msg} */
FM.buyPlayer = function(playerId, offreM){
  const my = FM.myClub();
  if (!FM.marketOpen()) return { ok:false, msg:windowClosedMsg() };

  // 1) Agent libre : signature contre une simple prime (pas d'indemnité de transfert)
  const fa = (FM.state.freeAgents || []).find(x=>x.id===playerId);
  if (fa){
    if (my.joueurs.length >= 30) return { ok:false, msg:"Effectif complet (30 max). Vendez d'abord." };
    const prime = FM.freeAgentPrime(fa, my.rep);           // prime à la signature (jamais de refus)
    if (offreM+1e-9 < prime) return { ok:false, msg:`${fa.nom} demande une prime d'environ ${prime.toFixed(1)} M€ pour signer.` };
    if (offreM > my.budget) return { ok:false, msg:`Budget insuffisant : ${offreM.toFixed(1)} M€ demandé, ${my.budget.toFixed(1)} M€ dispo.` };
    FM.state.freeAgents = FM.state.freeAgents.filter(x=>x.id!==playerId);
    FM.state.usedFreeAgents = FM.state.usedFreeAgents || [];
    if (!FM.state.usedFreeAgents.includes(fa.nom)) FM.state.usedFreeAgents.push(fa.nom);
    my.budget -= offreM;
    fa.transferListe = false; fa.contrat = FM._ri(2,4); fa.moral = Math.min(99, fa.moral+6);
    my.joueurs.push(fa);
    my.onze = FM.autoPickXI(my);
    addNews(`✍️ Signature libre : ${fa.nom} (${fa.note}, ${FM.POS_LABEL[fa.pos]}) s'engage avec ${my.nom} (prime ${offreM.toFixed(1)} M€).`);
    FM.save();
    return { ok:true, msg:`${fa.nom} signe librement pour une prime de ${offreM.toFixed(1)} M€ !` };
  }

  let seller=null, player=null;
  for (const c of FM.state.db.clubs){
    if (c.id===my.id) continue;
    const p = c.joueurs.find(x=>x.id===playerId);
    if (p){ seller=c; player=p; break; }
  }
  if (!player) return { ok:false, msg:"Joueur introuvable." };
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
  // Transfert accepté
  seller.joueurs = seller.joueurs.filter(p=>p.id!==playerId);
  seller.budget += offreM * 0.9;
  seller.onze = FM.autoPickXI(seller);
  my.budget -= offreM;
  player.transferListe = false;
  player.moral = Math.min(99, player.moral+8);
  my.joueurs.push(player);
  my.onze = FM.autoPickXI(my);
  addNews(`✅ Recrutement : ${player.nom} (${player.note}, ${FM.POS_LABEL[player.pos]}) rejoint ${my.nom} pour ${offreM.toFixed(1)} M€.`);
  FM.save();
  return { ok:true, msg:`${player.nom} signe pour ${offreM.toFixed(1)} M€ !` };
};

/* Lister / retirer de la liste des transferts */
FM.toggleTransferList = function(playerId){
  const my = FM.myClub();
  const p = my.joueurs.find(x=>x.id===playerId);
  if (!p) return;
  if (p.loan) return;                 // un joueur prêté ne peut pas être vendu
  p.transferListe = !p.transferListe;
  FM.save();
};

/* Vendre directement à un prix (offre immédiate d'un club IA) */
FM.acceptOffer = function(offreIndex){
  const o = FM.state.offres[offreIndex];
  if (!o) return { ok:false, msg:"Offre expirée." };
  if (!FM.marketOpen()) return { ok:false, msg:windowClosedMsg() };
  const my = FM.myClub();
  const p = my.joueurs.find(x=>x.id===o.joueurId);
  if (!p) return { ok:false, msg:"Joueur déjà parti." };
  if (my.joueurs.length <= 16) return { ok:false, msg:"Effectif trop court (16 min)." };
  const buyer = FM.clubById(o.clubId);
  my.joueurs = my.joueurs.filter(x=>x.id!==p.id);
  my.budget += o.montant;
  my.onze = FM.autoPickXI(my);
  p.transferListe = false;
  buyer.joueurs.push(p);
  buyer.onze = FM.autoPickXI(buyer);
  addNews(`💰 Vente : ${p.nom} rejoint ${buyer.nom} pour ${o.montant.toFixed(1)} M€.`);
  FM.state.offres.splice(offreIndex,1);
  FM.save();
  return { ok:true, msg:`${p.nom} vendu pour ${o.montant.toFixed(1)} M€.` };
};
FM.rejectOffer = function(i){ FM.state.offres.splice(i,1); FM.save(); };

function generateAIOffers(){
  if (!FM.marketOpen()) return;        // pas d'offres hors periode de mercato
  const my = FM.myClub();
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
        addNews(`📩 ${buyer.nom} propose ${montant.toFixed(1)} M€ pour ${p.nom}.`);
      }
    }
  }
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

/* Coût d'une indemnité de prêt (M€) */
FM.loanFee = p => Math.max(0.1, Math.round(p.valeur*0.06*10)/10);

/* Emprunter un joueur (prêt entrant) */
FM.loanIn = function(playerId){
  const my = FM.myClub();
  if (!FM.marketOpen()) return { ok:false, msg:windowClosedMsg() };
  if (my.joueurs.length >= 30) return { ok:false, msg:"Effectif complet (30 max)." };
  let parent=null, player=null;
  for (const c of FM.state.db.clubs){
    if (c.id===my.id) continue;
    const p = c.joueurs.find(x=>x.id===playerId);
    if (p){ parent=c; player=p; break; }
  }
  if (!player) return { ok:false, msg:"Joueur introuvable." };
  if (player.loan) return { ok:false, msg:"Ce joueur est déjà en prêt." };
  // Réalisme : cadres et pépites protégées ne sont pas prêtés
  const r = parent.joueurs.slice().sort((a,b)=>b.note-a.note).findIndex(x=>x.id===playerId);
  const wonderkid = player.potentiel>=84 && player.age<=21;
  const prettable = !wonderkid && player.note<=77 && ( r>=16 || (player.age<=20 && r>=11) );
  if (!prettable) return { ok:false, msg:`${parent.nom} ne prête pas ${player.nom} (élément trop important).` };
  const fee = FM.loanFee(player);
  if (fee > my.budget) return { ok:false, msg:`Budget insuffisant pour l'indemnité de prêt (${fee.toFixed(1)} M€).` };
  parent.joueurs = parent.joueurs.filter(x=>x.id!==playerId);
  parent.onze = FM.autoPickXI(parent);
  my.budget -= fee;
  player.loan = { parentId:parent.id, parentNom:parent.nom, borrowerId:my.id, saison:FM.state.saison };
  player.transferListe = false;
  my.joueurs.push(player); my.onze = FM.autoPickXI(my);
  FM.state.prets = FM.state.prets || [];
  FM.state.prets.push({ playerId, parentId:parent.id, borrowerId:my.id, saison:FM.state.saison, type:"in" });
  addNews(`🔁 Prêt : ${player.nom} (${player.note}) arrive de ${parent.nom} jusqu'en fin de saison (indemnité ${fee.toFixed(1)} M€).`);
  FM.save();
  return { ok:true, msg:`${player.nom} rejoint ${my.nom} en prêt.` };
};

/* Prêter un de nos joueurs à un club preneur (prêt sortant) */
FM.loanOut = function(playerId){
  const my = FM.myClub();
  if (!FM.marketOpen()) return { ok:false, msg:windowClosedMsg() };
  const player = my.joueurs.find(x=>x.id===playerId);
  if (!player) return { ok:false, msg:"Joueur introuvable." };
  if (player.loan) return { ok:false, msg:"Ce joueur est déjà concerné par un prêt." };
  if (my.joueurs.length <= 16) return { ok:false, msg:"Effectif trop court (16 min) pour prêter." };
  // Club preneur plausible : plutôt un club modeste qui cherche du renfort
  const borrowers = FM.state.db.clubs.filter(c=>c.id!==my.id && c.joueurs.length<30);
  if (!borrowers.length) return { ok:false, msg:"Aucun club preneur disponible." };
  borrowers.sort((a,b)=> a.rep-b.rep);
  const borrower = borrowers[FM._ri(0, Math.min(borrowers.length-1, 9))];
  my.joueurs = my.joueurs.filter(x=>x.id!==playerId);
  my.onze = FM.autoPickXI(my);
  player.loan = { parentId:my.id, parentNom:my.nom, borrowerId:borrower.id, saison:FM.state.saison };
  player.transferListe = false;
  borrower.joueurs.push(player); borrower.onze = FM.autoPickXI(borrower);
  FM.state.prets = FM.state.prets || [];
  FM.state.prets.push({ playerId, parentId:my.id, borrowerId:borrower.id, saison:FM.state.saison, type:"out" });
  const fee = Math.round(player.valeur*0.04*10)/10;
  my.budget += fee;
  addNews(`🔁 Prêt : ${player.nom} rejoint ${borrower.nom} pour la saison${fee>0?` (vous percevez ${fee.toFixed(1)} M€)`:''}.`);
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

/* Retourne un joueur prêté à son club parent (sans effet de développement) */
function returnLoan(playerId){
  let holder=null, player=null;
  for (const c of FM.state.db.clubs){
    const p = c.joueurs.find(x=>x.id===playerId && x.loan);
    if (p){ holder=c; player=p; break; }
  }
  if (!player) return { ok:false };
  const parent = FM.clubById(player.loan.parentId);
  holder.joueurs = holder.joueurs.filter(x=>x.id!==playerId);
  holder.onze = FM.autoPickXI(holder);
  const wasOut = player.loan.parentId===FM.state.managedClubId;
  delete player.loan;
  if (parent){ parent.joueurs.push(player); parent.onze = FM.autoPickXI(parent); }
  FM.state.prets = (FM.state.prets||[]).filter(pr=>pr.playerId!==playerId);
  return { ok:true, player, parent, holder, wasOut };
}

/* Rappeler / rendre un prêt immédiatement (déclenché par le joueur) */
FM.recallLoan = function(playerId){
  const r = returnLoan(playerId);
  if (r.ok){
    addNews(`🔁 Prêt interrompu : ${r.player.nom} retrouve ${r.parent?r.parent.nom:'son club'}.`);
    FM.save();
  }
  return r;
};

/* Clôture des prêts en fin de saison : retour au club parent + développement
   des jeunes prêtés (temps de jeu gagné). */
function processLoansEndSeason(){
  for (const pr of (FM.state.prets||[]).slice()){
    const r = returnLoan(pr.playerId);
    if (!r.ok) continue;
    const p = r.player, mine = FM.state.managedClubId;
    if (pr.type==="out" && p.age<=23){
      p.potentiel = Math.min(94, p.potentiel + FM._ri(0,1));
      p.note = Math.min(p.potentiel, p.note + FM._ri(0,2));
      p.moral = Math.min(99, p.moral + 4);
      if (r.parent && r.parent.id===mine) addNews(`🔁 Retour de prêt : ${p.nom} revient grandi de son expérience (note ${p.note}).`);
    } else if (r.parent && r.parent.id===mine){
      addNews(`🔁 Fin de prêt : ${p.nom} est de retour au club.`);
    } else if (r.holder && r.holder.id===mine){
      addNews(`🔁 Fin de prêt : ${p.nom} retourne à ${r.parent?r.parent.nom:'son club'}.`);
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
  // retire le joueur de tout autre slot
  my.onze.forEach(s=>{ if(s.id===playerId) s.id=null; });
  my.onze[slotIndex].id = playerId;
  FM.save();
};

/* ---------- Fin de saison ---------- */
FM.isSeasonOver = () => FM.state.journee >= FM.totalMatchdays();

FM.endSeason = function(){
  const t = FM.table();
  const rank = t.findIndex(c=>c.id===FM.state.managedClubId)+1;
  const champ = t[0];
  FM.snapshotFinalTables();                 // mémorise le classement final pour les coupes

  // --- Trophées individuels du championnat (avant remise à zéro des stats) ---
  const lb = FM.leaderboards(FM.state.ligueJoueur, 8);
  const potm = lb.notes[0];                 // Joueur de la saison (meilleure moyenne)
  const pichichi = lb.buteurs[0];           // Meilleur buteur
  const passeur = lb.passeurs[0];           // Meilleur passeur
  const trophies = {
    joueur:   potm ? { nom:potm.nom, club:potm.clubNom, avg:+FM.playerAvgNote(potm).toFixed(2) } : null,
    buteur:   pichichi ? { nom:pichichi.nom, club:pichichi.clubNom, buts:pichichi.buts } : null,
    passeur:  passeur ? { nom:passeur.nom, club:passeur.clubNom, passes:passeur.passes||0 } : null
  };
  if (trophies.buteur) addNews(`👑 Meilleur buteur ${FM.state.ligueJoueur} : ${trophies.buteur.nom} (${trophies.buteur.club}) — ${trophies.buteur.buts} buts.`);
  if (trophies.passeur) addNews(`🅰️ Meilleur passeur : ${trophies.passeur.nom} (${trophies.passeur.club}) — ${trophies.passeur.passes} passes déc.`);
  if (trophies.joueur) addNews(`🌟 Joueur de la saison : ${trophies.joueur.nom} (${trophies.joueur.club}) — note moyenne ${trophies.joueur.avg}.`);

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
  addNews(`🏁 Fin de saison ${FM.state.saison} : ${champ.nom} champion. ${FM.myClub().nom} termine ${rank}${rank===1?"er":"e"}.`);

  // Nouvelle saison : reset tables, vieillissement, budget
  const my = FM.myClub();
  let bonus = (rank<=3 ? 30 : rank<=6 ? 15 : rank<=10 ? 5 : 0) + euroPrize;
  if (superCup && superCup.playerWon) bonus += 8;
  if (cupResult){ bonus += cupResult.playerReward; if (cupResult.playerReward>0) addNews(`💶 Parcours en ${cupResult.nom} : +${cupResult.playerReward} M€.`); }
  if (euroPrize>0) addNews(`💶 Recettes des coupes d'Europe : +${euroPrize.toFixed(0)} M€.`);
  // --- Prêts : retour au club parent (+ développement des jeunes prêtés) ---
  processLoansEndSeason();

  const seasonJustEnded = FM.state.saison;
  for (const c of FM.state.db.clubs){
    c.pts=c.j=c.g=c.n=c.p=c.bp=c.bc=0;
    c.budget += c.budgetTotal*0.12 + (c===my?bonus:0);
    for (const p of c.joueurs){
      const avg = FM.playerAvgNote(p);
      // 1) Historique de carrière (bilan de la saison écoulée)
      p.carriere = p.carriere || [];
      p.carriere.push({ saison:seasonJustEnded, club:c.nom, matchs:p.matchs||0,
                        buts:p.buts||0, passes:p.passes||0, note:p.note,
                        avg:+avg.toFixed(2), sel:p.selJeunes||null });
      if (p.carriere.length>20) p.carriere.shift();
      // 2) Boost / malus de performance (si assez de matchs joués)
      let perf=0, tag=null;
      if ((p.matchs||0) >= 8){
        if (avg>=7.4){ perf=FM._ri(1,2); tag="excellente"; }
        else if (avg>=7.0){ perf=1; tag="bonne"; }
        else if (avg<=6.0){ perf=-FM._ri(1,2); tag="décevante"; }
        else if (avg<=6.4){ perf=-1; tag="moyenne"; }
      }
      // 3) Progression / déclin liés à l'âge
      let ageDelta=0;
      if (p.age<=23 && p.note<p.potentiel) ageDelta=FM._ri(0,3);
      else if (p.age>=31) ageDelta=-FM._ri(0,2);
      // Application : les jeunes peuvent dépasser légèrement leur potentiel sur une grande saison
      const ceil = (p.age<=23 && perf>0) ? Math.min(94, p.potentiel+1) : (p.age<=23 ? p.potentiel : 94);
      p.note = Math.max(40, Math.min(ceil, p.note + ageDelta + perf));
      if (perf>0 && p.age<=23) p.potentiel = Math.min(94, Math.max(p.potentiel, p.note+ FM._ri(0,2)));
      // Moral selon la saison
      p.moral = Math.max(35, Math.min(99, p.moral + (perf>0?6:perf<0?-6:0)));
      if (c===my && tag && (p.matchs||0)>=8){
        if (perf>0) addNews(`📈 Saison ${tag} de ${p.nom} (moy ${avg.toFixed(2)}) : note ${p.note-perf}→${p.note}.`);
        else addNews(`📉 Saison ${tag} de ${p.nom} (moy ${avg.toFixed(2)}) : note ${p.note-perf}→${p.note}.`);
      }
      // Reset des compteurs de la saison
      p.matchs=0; p.buts=0; p.passes=0; p.noteTotale=0; p.noteMatchs=0; p.selJeunes=null;
      p.age++;
      p.valeur = FM.playerValue(p.note, p.potentiel, p.age);
      p.contrat = Math.max(0, p.contrat-1);
    }
    c.onze = FM.autoPickXI(c);
  }

  // --- Convocations en sélections de jeunes (U17/U19/U21) ---
  applyYouthCallups();

  // --- Montées / descentes dans le championnat du joueur ---
  const promoRelegation = applyPromotionRelegation(t);

  FM.state.saison++;
  FM.state.journee=0;
  FM.state.resultats=[];
  FM.state.offres=[];
  FM.state.calendrier = FM.makeSchedule(FM.clubsInMyLeague().map(c=>c.id));
  FM.setupEuropeanCups();                    // coupes de la nouvelle saison (selon classement final)
  FM.setupDomesticCup();                      // nouveau tirage de la coupe nationale

  // Agents libres : vieillissement + renouvellement du vivier
  if (FM.state.freeAgents){
    FM.state.freeAgents.forEach(p=>{ p.age++; if(p.age>=32) p.note=Math.max(40,p.note-FM._ri(0,2)); p.valeur=FM.playerValue(p.note,p.potentiel,p.age); });
    FM.state.freeAgents = FM.state.freeAgents.filter(p=>p.age<=38);
  }
  FM.state.freeAgents = (FM.state.freeAgents||[]).concat(FM.makeFreeAgents(28, my.pays))
    .sort((a,b)=>b.note-a.note).slice(0,60);

  // Tournoi international de l'été (alterné Coupe du Monde / Championnat d'Europe)
  const endedSeason = FM.state.saison - 1;
  const wc = (endedSeason % 2 === 0);
  FM.state.pendingIntl = { kind: wc?"WC":"EURO", defaultNation: FM.nationForCountry(my.pays), fait:false };
  addNews(`🌍 ${wc?"Coupe du Monde":"Championnat d'Europe"} cet été — prenez en main une sélection (onglet Accueil).`);

  const pc = FM.state.europe.playerComp;
  addNews(`Saison ${FM.state.saison} : nouvel objectif — ${FM.state.objectif}. Budget mercato : ${my.budget.toFixed(1)} M€.` +
    (pc ? ` Qualifié en ${FM.state.europe[pc].nom} !` : ` (Non qualifié en coupe d'Europe.)`));
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
      if (c===my) addNews(`🎖️ ${p.nom} (${p.age} ans) est convoqué en ${nation} ${cat} !`);
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
  addNews(`${cup.emoji} ${cup.nom} : ${champTeam?champTeam.nom:'—'} remporte le trophée.` +
    (playerWon ? " 🏆 Bravo, c'est VOTRE club !" : ""));
  return { nom:cup.nom, emoji:cup.emoji, vainqueur:champTeam?champTeam.nom:'—', playerWon, playerReward };
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
  let ga = 1 + Math.round(Math.max(0,(sA-sB))/5 + FM._rnd()*2);
  let gb = 1 + Math.round(Math.max(0,(sB-sA))/5 + FM._rnd()*2);
  let winner;
  if (ga===gb){ // prolongation / tirs au but
    winner = FM._rnd() < (sA/(sA+sB)) ? ucl : uel;
  } else winner = ga>gb ? ucl : uel;
  const myId = FM.state.managedClubId;
  const isMe = t => (t.ref===myId || t.key===myId);
  const playerInvolved = isMe(ucl) || isMe(uel);
  const playerWon = isMe(winner);
  addNews(`🏆⭐ Supercoupe d'Europe : ${ucl.nom} ${ga}–${gb} ${uel.nom}. ${winner.nom} soulève le trophée !` +
    (playerInvolved ? (playerWon ? " Bravo, c'est VOTRE club !" : " Votre club s'incline de justesse.") : ""));
  return { ucl:ucl.nom, uel:uel.nom, ga, gb, vainqueur:winner.nom, playerInvolved, playerWon };
}

/* ---------- Montées / descentes ----------
   Reproduit le renouvellement du championnat entre deux saisons : les derniers
   du classement (hors club du joueur) sont relégués et remplacés par des promus
   générés. Le club du joueur n'est jamais relégué (pas de division inférieure
   modélisée) — la carrière continue toujours dans l'élite.                     */
function applyPromotionRelegation(finalTable){
  const lgId = FM.state.ligueJoueur;
  const lgMeta = FM.LEAGUES.find(l=>l.id===lgId);
  const N = finalTable.length >= 20 ? 3 : (finalTable.length >= 14 ? 2 : 1);
  // Candidats à la descente : du bas vers le haut, hors club du joueur
  const relegated = [];
  for (let i=finalTable.length-1; i>=0 && relegated.length<N; i--){
    if (finalTable[i].id !== FM.state.managedClubId) relegated.push(finalTable[i]);
  }
  const relIds = new Set(relegated.map(c=>c.id));
  FM.state.db.clubs = FM.state.db.clubs.filter(c=>!relIds.has(c.id));
  // Promus générés
  const promoted = [];
  for (let i=0;i<relegated.length;i++){
    const club = makePromotedClub(lgMeta);
    FM.state.db.clubs.push(club);
    promoted.push(club.nom);
  }
  if (relegated.length){
    addNews(`⬇️ Relégations (${lgMeta.nom}) : ${relegated.map(c=>c.nom).join(", ")}.`);
    addNews(`⬆️ Promus : ${promoted.join(", ")}.`);
  }
  return { releguees: relegated.map(c=>c.nom), promues: promoted };
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
  // Ids joueurs garantis uniques (PID est réinitialisé au rechargement de page)
  let maxPid = 0;
  for (const c of FM.state.db.clubs) for (const p of c.joueurs) if (p.id>maxPid) maxPid=p.id;
  const squad = FM.makeMasterSquad(lgMeta.pays);
  squad.forEach(p => { p.id = ++maxPid; });
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
  if (comp.phase==="league") res = "phase de ligue";
  else if (ko && ko.finished && ko.champion===ko.playerSeed) res = "Vainqueur 🏆";
  else if (ko){
    const lost = ko.history.find(h=>h.ties.some(t=>(t.a===ko.playerSeed||t.b===ko.playerSeed)&&t.winner!==ko.playerSeed));
    res = lost ? ("éliminé en "+lost.nom) : "en cours";
  } else res = "en cours";
  return { comp:e.playerComp, nom:comp.nom, resultat:res };
}

/* Enregistre le résultat d'un tournoi international disputé en carrière */
FM.recordIntlResult = function(kind, nation, championNom, playerWon){
  if (FM.state.pendingIntl) FM.state.pendingIntl.fait = true;   // épreuve consommée
  const nomTournoi = kind==="WC" ? "Coupe du Monde" : "Championnat d'Europe";
  FM.state.intlPalmares = FM.state.intlPalmares || [];
  FM.state.intlPalmares.unshift({ saison:FM.state.saison, tournoi:nomTournoi, nation, champion:championNom, playerWon });
  addNews(`🌍 ${nomTournoi} : ${championNom} champion.` + (playerWon ? ` 🏆 Avec ${nation}, vous êtes sur le toit du monde !` : ` (Vous dirigiez ${nation}.)`));
  FM.save();
};

/* ---------- Actualités ---------- */
function addNews(txt){ FM.state.news.unshift({ txt, saison:FM.state.saison, j:FM.state.journee }); if(FM.state.news.length>60) FM.state.news.pop(); }
FM.addNews = addNews;

/* ---------- Sauvegarde locale ---------- */
FM.save = function(){
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(FM.state)); } catch(e){ console.warn("save fail", e); }
};
FM.load = function(){
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return false;
  try { FM.state = JSON.parse(raw); return true; } catch(e){ return false; }
};
FM.hasSave = () => !!localStorage.getItem(SAVE_KEY);
FM.deleteSave = function(){ localStorage.removeItem(SAVE_KEY); FM.state=null; };
