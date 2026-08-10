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
    joueurs: FM.makeMasterSquad(lgMeta.pays),
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

/* ---------- Jouer une journée complète ---------- */
FM.playMatchday = function(){
  if (FM.state.journee >= FM.totalMatchdays()) return null;
  const jd = FM.state.calendrier[FM.state.journee];
  const dayResults = [];
  let myResult = null;

  for (const m of jd){
    const dom = FM.clubById(m.dom), ext = FM.clubById(m.ext);
    // L'IA reconstruit son onze (le club du joueur garde son onze choisi)
    if (dom.id !== FM.state.managedClubId) dom.onze = FM.autoPickXI(dom);
    if (ext.id !== FM.state.managedClubId) ext.onze = FM.autoPickXI(ext);

    const res = FM.simulateMatch(dom, ext);
    applyResult(dom, ext, res);
    accumulateStats(dom, ext, res);
    const r = { dom:dom.id, ext:ext.id, ds:res.domScore, es:res.extScore, events:res.events };
    dayResults.push(r);
    if (dom.id===FM.state.managedClubId || ext.id===FM.state.managedClubId) myResult = r;
  }

  FM.state.resultats[FM.state.journee] = dayResults;
  FM.state.journee++;

  postMatchdayUpdates(myResult);
  FM.save();
  return { dayResults, myResult };
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

/* ---------- MERCATO ---------- */
FM.transferMarket = function(filter={}){
  const my = FM.myClub();
  const applyFilters = arr => {
    if (filter.poste) arr = arr.filter(p=>p.groupe===filter.poste);
    if (filter.noteMin) arr = arr.filter(p=>p.note>=filter.noteMin);
    if (filter.ageMax) arr = arr.filter(p=>p.age<=filter.ageMax);
    if (filter.valeurMax) arr = arr.filter(p=>p.valeur<=filter.valeurMax);
    if (filter.q){ const q=filter.q.toLowerCase(); arr=arr.filter(p=>p.nom.toLowerCase().includes(q)); }
    return arr;
  };
  // Agents libres (sans club) : toujours présentés en tête (hors quota de liste)
  let libres = applyFilters((FM.state.freeAgents || [])
    .map(p=>({ ...p, clubId:null, clubNom:"🆓 Agent libre", dispo:true, libre:true })));
  libres.sort((a,b)=>b.note-a.note);
  // Joueurs sous contrat dans les autres clubs
  let list = [];
  for (const c of FM.state.db.clubs){
    if (c.id === my.id) continue;
    for (const p of c.joueurs) list.push({ ...p, clubId:c.id, clubNom:c.nom, dispo: p.transferListe });
  }
  list = applyFilters(list);
  list.sort((a,b)=> (b.dispo?1:0)-(a.dispo?1:0) || b.note-a.note);
  const limit = filter.limit || 120;
  return libres.concat(list).slice(0, Math.max(limit, libres.length));
};

/* Acheter : renvoie {ok, msg} */
FM.buyPlayer = function(playerId, offreM){
  const my = FM.myClub();

  // 1) Agent libre : signature contre une simple prime (pas d'indemnité de transfert)
  const fa = (FM.state.freeAgents || []).find(x=>x.id===playerId);
  if (fa){
    if (my.joueurs.length >= 30) return { ok:false, msg:"Effectif complet (30 max). Vendez d'abord." };
    if (offreM > my.budget) return { ok:false, msg:`Budget insuffisant (${my.budget.toFixed(1)} M€ dispo).` };
    const prime = fa.valeur * 0.2;             // prime à la signature attendue
    if (offreM < prime) return { ok:false, msg:`${fa.nom} attend une prime d'environ ${prime.toFixed(1)} M€ pour signer.` };
    FM.state.freeAgents = FM.state.freeAgents.filter(x=>x.id!==playerId);
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

  // Le club vendeur accepte-t-il ?
  const seuil = player.valeur * (player.transferListe ? 0.9 : (1.15 + seller.rep*0.06));
  if (offreM < seuil){
    return { ok:false, msg:`${seller.nom} refuse. Il faut environ ${seuil.toFixed(1)} M€ pour ${player.nom}.` };
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
  p.transferListe = !p.transferListe;
  FM.save();
};

/* Vendre directement à un prix (offre immédiate d'un club IA) */
FM.acceptOffer = function(offreIndex){
  const o = FM.state.offres[offreIndex];
  if (!o) return { ok:false, msg:"Offre expirée." };
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
  for (const c of FM.state.db.clubs){
    c.pts=c.j=c.g=c.n=c.p=c.bp=c.bc=0;
    c.budget += c.budgetTotal*0.12 + (c===my?bonus:0);
    for (const p of c.joueurs){
      p.age++; p.matchs=0; p.buts=0; p.passes=0; p.noteTotale=0; p.noteMatchs=0;
      // progression / déclin
      if (p.age<=23 && p.note<p.potentiel) p.note=Math.min(p.potentiel,p.note+FM._ri(0,3));
      else if (p.age>=31) p.note=Math.max(40,p.note-FM._ri(0,2));
      p.valeur = FM.playerValue(p.note, p.potentiel, p.age);
      p.contrat = Math.max(0, p.contrat-1);
    }
    c.onze = FM.autoPickXI(c);
  }

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
