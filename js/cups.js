/* ============================================================
   COMPÉTITIONS — Coupes d'Europe (clubs) & tournois de sélections
   Moteur générique à élimination directe (bracket) + données nations.
   ============================================================ */
var FM = window.FM || {};
window.FM = FM;

/* ---------------- Sélections nationales ----------------
   [nom, note, confédération, poolNoms]  (note 0-99)                */
const NATIONS = [
  ["France",88,"UEFA","FRA"],["Espagne",87,"UEFA","ESP"],["Angleterre",86,"UEFA","ENG"],
  ["Portugal",85,"UEFA","POR"],["Allemagne",84,"UEFA","GER"],["Pays-Bas",84,"UEFA","NED"],
  ["Italie",83,"UEFA","ITA"],["Belgique",82,"UEFA","BEL"],["Croatie",81,"UEFA","ITA"],
  ["Norvège",79,"UEFA","NED"],["Danemark",79,"UEFA","NED"],["Suisse",78,"UEFA","GER"],
  ["Autriche",78,"UEFA","GER"],["Turquie",77,"UEFA","ITA"],["Ukraine",77,"UEFA","NED"],
  ["Serbie",77,"UEFA","ITA"],["Pologne",76,"UEFA","GER"],["Suède",75,"UEFA","NED"],
  ["Écosse",74,"UEFA","ENG"],["Hongrie",74,"UEFA","GER"],["Rép. Tchèque",76,"UEFA","GER"],
  ["Grèce",73,"UEFA","ITA"],["Pays de Galles",73,"UEFA","ENG"],["Roumanie",73,"UEFA","ITA"],
  ["Brésil",87,"CONMEBOL","BRA"],["Argentine",88,"CONMEBOL","ARG"],["Uruguay",82,"CONMEBOL","ARG"],
  ["Colombie",81,"CONMEBOL","ESP"],["Équateur",77,"CONMEBOL","ESP"],["Chili",74,"CONMEBOL","ESP"],
  ["Pérou",72,"CONMEBOL","ESP"],["Paraguay",71,"CONMEBOL","ESP"],
  ["Maroc",80,"CAF","FRA"],["Sénégal",79,"CAF","FRA"],["Nigeria",77,"CAF","ENG"],
  ["Égypte",76,"CAF","FRA"],["Algérie",76,"CAF","FRA"],["Côte d'Ivoire",76,"CAF","FRA"],
  ["Cameroun",75,"CAF","FRA"],["Ghana",75,"CAF","ENG"],["Tunisie",74,"CAF","FRA"],
  ["Japon",79,"AFC","POR"],["Corée du Sud",78,"AFC","POR"],["Iran",76,"AFC","POR"],
  ["Australie",75,"AFC","ENG"],["Arabie Saoudite",73,"AFC","POR"],
  ["Mexique",76,"CONCACAF","ESP"],["États-Unis",76,"CONCACAF","ENG"],["Canada",75,"CONCACAF","ENG"]
];

/* Génère un onze/effectif représentatif pour une sélection (noms générés) */
FM.makeNationSquad = function(nat){
  const pool = (window.FM.__NAMES && window.FM.__NAMES[nat.pool]) ? nat.pool : "FRA";
  const plan = ["GB","DD","DC","DC","DG","MDC","MC","MO","AD","AG","BU",  // onze
                "GB","DC","DD","MC","MO","AG","BU"];                        // banc
  return plan.map((pos,i)=>{
    const base = nat.note + FM._ri(-8, 6);
    const note = Math.max(60, Math.min(93, base));
    return { id:100000+nat.note*100+i, nom: FM._nameFrom(pool), pos, groupe:FM.POS_GROUP[pos],
             note, buts:0 };
  });
};

/* ---------------- Ordre de seeding (bracket standard) ---------------- */
function seedOrder(n){
  let pls = [1,2];
  const rounds = Math.log2(n);
  for (let r=1; r<rounds; r++){
    const out=[], sum=pls.length*2+1;
    for (const p of pls){ out.push(p); out.push(sum-p); }
    pls = out;
  }
  return pls; // seeds 1..n en ordre de bracket
}

/* ---------------- Création d'un tournoi générique ----------------
   teams: [{ ref, nom, pays, couleurs, note, squad? }]  (déjà tries ou non)
   playerRefId: identifiant de l'équipe du joueur (ou null)               */
FM.makeTournament = function(id, nom, emoji, kind, teams, playerKey){
  // tri par note décroissante -> seeds
  const sorted = teams.slice().sort((a,b)=> b.note - a.note);
  const n = sorted.length; // doit être une puissance de 2
  const order = seedOrder(n); // [1..n]
  const bracket = order.map(s => s-1); // indices dans sorted, en ordre de bracket
  const playerSeed = playerKey!=null ? sorted.findIndex(t=>t.key===playerKey) : -1;
  return {
    id, nom, emoji, kind,
    teams: sorted,
    alive: bracket,              // indices (dans teams) encore en lice, ordre bracket
    round: 0,
    roundsTotal: Math.log2(n),
    history: [],                 // [{round, ties:[{a,b,as,es,pen,winner}]}]
    playerSeed,
    playerAlive: playerSeed>=0,
    finished: false,
    champion: null
  };
};

/* Nom du tour selon le nombre d'équipes restantes */
FM.roundName = function(aliveCount){
  switch(aliveCount){
    case 2: return "Finale";
    case 4: return "Demi-finales";
    case 8: return "Quarts de finale";
    case 16: return "Huitièmes de finale";
    case 32: return "Seizièmes de finale";
    case 64: return "Trente-deuxièmes";
    default: return "Tour à "+aliveCount;
  }
};

/* Paires du tour courant : [[iTeam, jTeam], ...] */
FM.tournamentPairs = function(comp){
  const pairs=[];
  for (let k=0;k<comp.alive.length;k+=2) pairs.push([comp.alive[k], comp.alive[k+1]]);
  return pairs;
};

/* Le match du joueur ce tour (ou null) */
FM.playerTie = function(comp){
  if (!comp.playerAlive) return null;
  const pairs = FM.tournamentPairs(comp);
  for (const [a,b] of pairs) if (a===comp.playerSeed || b===comp.playerSeed) return [a,b];
  return null;
};

/* Simule un match de coupe entre deux équipes du tournoi.
   Renvoie {as, es, pen, events} — 'as' buts de l'équipe a.            */
FM.simCupMatch = function(comp, ai, bi, forcedResult){
  const A = comp.teams[ai], B = comp.teams[bi];
  let as, es, events=[];
  if (forcedResult){
    as = forcedResult.as; es = forcedResult.es; events = forcedResult.events||[];
  } else if (comp.kind==="club"){
    const ca = FM.clubById(A.ref), cb = FM.clubById(B.ref);
    const r = FM.simulateMatch(ca, cb);
    as = r.domScore; es = r.extScore;
    events = r.events.map(e=>({min:e.min, joueur:e.joueur, side: e.clubId===ca.id?"a":"b"}));
  } else {
    const r = simByRating(A, B);
    as = r.as; es = r.es; events = r.events;
  }
  // Prolongation/tirs au but si nul (élimination directe)
  let pen = null;
  if (as === es){
    const ra = A.note, rb = B.note;
    const pA = 0.5 + (ra - rb) * 0.012;
    const aWin = FM._rnd() < Math.max(0.2, Math.min(0.8, pA));
    pen = aWin ? [FM._ri(4,5), FM._ri(2,4)] : [FM._ri(2,4), FM._ri(4,5)];
    if (pen[0]===pen[1]) pen[aWin?0:1]++;
  }
  const winner = as>es ? ai : es>as ? bi : (pen[0]>pen[1] ? ai : bi);
  return { as, es, pen, events, winner };
};

/* Simulation par note (sélections) */
function simByRating(A, B){
  const diff = A.note - B.note;
  const xgA = Math.max(0.2, 1.3 + diff*0.05);
  const xgB = Math.max(0.2, 1.3 - diff*0.05);
  const as = poissonR(xgA), es = poissonR(xgB);
  const events = [];
  addNationGoals(events, A, as, "a");
  addNationGoals(events, B, es, "b");
  events.sort((x,y)=>x.min-y.min);
  return { as, es, events };
}
function poissonR(lambda){ const L=Math.exp(-lambda); let k=0,p=1; do{k++;p*=FM._rnd();}while(p>L); return Math.min(6,k-1); }
function addNationGoals(events, team, n, side){
  const squad = team.squad || [];
  const weights = squad.map(p=>({p, w: p.groupe==="A"?5:p.groupe==="M"?2:0.4}));
  const tot = weights.reduce((a,x)=>a+x.w,0) || 1;
  for (let i=0;i<n;i++){
    let r=FM._rnd()*tot, ch = squad.length?squad[squad.length-1]:{nom:"?"};
    for (const x of weights){ r-=x.w; if(r<=0){ ch=x.p; break; } }
    events.push({ min:FM._ri(1,90), joueur: ch.nom, side });
  }
}

/* Résout le tour courant.
   playerRes (optionnel) = résultat déjà calculé du match du joueur, orienté
   sur la paire [a,b] telle que renvoyée par FM.playerTie (évite une 2e simu). */
FM.resolveTournamentRound = function(comp, playerRes){
  if (comp.finished) return null;
  const pairs = FM.tournamentPairs(comp);
  const ties=[], winners=[];
  for (const [a,b] of pairs){
    const isPlayer = comp.playerAlive && (a===comp.playerSeed || b===comp.playerSeed);
    const res = (isPlayer && playerRes) ? playerRes : FM.simCupMatch(comp, a, b);
    ties.push({ a, b, as:res.as, es:res.es, pen:res.pen, winner:res.winner });
    winners.push(res.winner);
    if (isPlayer && res.winner!==comp.playerSeed) comp.playerAlive = false;
  }
  comp.history.push({ round: comp.round, nom: FM.roundName(comp.alive.length), ties });
  comp.alive = winners;
  comp.round++;
  if (comp.alive.length===1){
    comp.finished = true;
    comp.champion = comp.alive[0];
  }
  return comp.history[comp.history.length-1];
};

/* ---------------- COUPES D'EUROPE (clubs) ----------------
   Qualification selon le classement final (ou réputation en saison 1).   */
FM.setupEuropeanCups = function(){
  const st = FM.state;
  const leagues = FM.LEAGUES.map(l=>l.id);
  const uclPool=[], uelPool=[], ueclPool=[], rest=[];

  for (const lid of leagues){
    let ordered;
    const fin = st._finalOrder && st._finalOrder[lid];
    if (fin && fin.length){
      ordered = fin.map(id=>FM.clubById(id)).filter(Boolean);
    } else {
      ordered = FM.state.db.clubs.filter(c=>c.ligue===lid)
        .sort((a,b)=> b.rep-a.rep || FM.squadRating(b)-FM.squadRating(a));
    }
    ordered.forEach((c,pos)=>{
      if (pos<4) uclPool.push(c.id);
      else if (pos<6) uelPool.push(c.id);
      else if (pos<8) ueclPool.push(c.id);
      else rest.push(c.id);
    });
  }
  // Complète chaque coupe à sa taille cible avec les meilleurs restants
  const byRating = ids => ids.slice().sort((a,b)=>FM.squadRating(FM.clubById(b))-FM.squadRating(FM.clubById(a)));
  let leftover = byRating(rest.concat());
  function fill(pool, size){
    let arr = byRating(pool);
    while (arr.length<size && leftover.length){ arr.push(leftover.shift()); }
    if (arr.length>size){ leftover = byRating(leftover.concat(arr.slice(size))); arr = arr.slice(0,size); }
    return arr;
  }
  const ucl = fill(uclPool,32), uel = fill(uelPool,16), uecl = fill(ueclPool,16);

  const toTeam = id => { const c=FM.clubById(id); return { key:id, ref:id, nom:c.nom, pays:c.pays, couleurs:c.couleurs, note:FM.squadRating(c) }; };
  const myId = st.managedClubId;
  let playerComp=null;
  if (ucl.includes(myId)) playerComp="UCL";
  else if (uel.includes(myId)) playerComp="UEL";
  else if (uecl.includes(myId)) playerComp="UECL";

  st.europe = {
    playerComp,
    UCL: FM.makeTournament("UCL","Ligue des Champions","🏆","club",ucl.map(toTeam), playerComp==="UCL"?myId:null),
    UEL: FM.makeTournament("UEL","Ligue Europa","🥈","club",uel.map(toTeam), playerComp==="UEL"?myId:null),
    UECL:FM.makeTournament("UECL","Ligue Conférence","🥉","club",uecl.map(toTeam), playerComp==="UECL"?myId:null)
  };
  return st.europe;
};

/* Mémorise l'ordre final des championnats (appelé en fin de saison) */
FM.snapshotFinalTables = function(){
  const order={};
  for (const lid of FM.LEAGUES.map(l=>l.id)) order[lid] = FM.table(lid).map(c=>c.id);
  FM.state._finalOrder = order;
};

/* ---------------- TOURNOIS DE SÉLECTIONS (Euro / Coupe du Monde) ---------------- */
FM.makeNationTournament = function(kind, playerNationName){
  const all = NATIONS.map(([nom,note,confed,pool])=>({nom,note,confed,pool}));
  let pool;
  if (kind==="EURO") pool = all.filter(n=>n.confed==="UEFA").sort((a,b)=>b.note-a.note).slice(0,16);
  else pool = all.slice().sort((a,b)=>b.note-a.note).slice(0,32); // Coupe du Monde : 32 meilleures
  // garantir la présence de la sélection du joueur
  if (playerNationName && !pool.find(n=>n.nom===playerNationName)){
    const pn = all.find(n=>n.nom===playerNationName);
    if (pn){ pool[pool.length-1]=pn; }
  }
  const teams = pool.map(n=>{
    const squad = FM.makeNationSquad(n);
    return { key:n.nom, ref:n.nom, nom:n.nom, pays:n.pool, couleurs:natColors(n.nom), note:n.note, squad };
  });
  const nom = kind==="EURO" ? "Championnat d'Europe" : "Coupe du Monde";
  const emoji = kind==="EURO" ? "🇪🇺" : "🌍";
  return FM.makeTournament(kind, nom, emoji, "nation", teams, playerNationName);
};
FM.nationsList = () => NATIONS.map(n=>n[0]);
FM.nationsForEuro = () => NATIONS.filter(n=>n[2]==="UEFA").map(n=>n[0]);

function natColors(name){
  const map={ "France":["#0055A4","#EF4135"],"Espagne":["#C60B1E","#FFC400"],"Angleterre":["#FFFFFF","#CE1124"],
    "Portugal":["#006600","#FF0000"],"Allemagne":["#000000","#FFCE00"],"Pays-Bas":["#AE1C28","#21468B"],
    "Italie":["#008C45","#CD212A"],"Belgique":["#000000","#FDDA24"],"Brésil":["#FEDF00","#009C3B"],
    "Argentine":["#75AADB","#FFFFFF"],"Croatie":["#FF0000","#FFFFFF"],"Maroc":["#C1272D","#006233"],
    "Japon":["#BC002D","#FFFFFF"],"Uruguay":["#5CBFEB","#FFFFFF"],"Mexique":["#006847","#CE1126"] };
  return map[name] || ["#334155","#e2e8f0"];
}

FM.NATIONS = NATIONS;
