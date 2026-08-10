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
  ["Mexique",76,"CONCACAF","ESP"],["États-Unis",76,"CONCACAF","ENG"],["Canada",75,"CONCACAF","ENG"],
  ["Russie",76,"UEFA","RUS"]
];

/* Effectif d'une sélection pour un tournoi.
   Si des données réelles existent, on applique une VARIATION de rassemblement :
   forme (±2), 1 à 3 absents (blessure / choix du sélectionneur), et des
   remplaçants appelés (retours de forme, jeunes). Sinon, effectif généré.   */
FM.makeNationSquad = function(nat){
  const pool = (window.FM.__NAMES && window.FM.__NAMES[nat.pool]) ? nat.pool : "FRA";
  const real = window.FM.NATION_SQUADS && window.FM.NATION_SQUADS[nat.nom];
  if (real && real.length >= 14){
    const nOut = FM._ri(1,3), out = new Set();
    while (out.size < nOut && out.size < real.length-11) out.add(FM._ri(0, real.length-1));
    const squad = [];
    real.forEach((p,i)=>{
      if (out.has(i)) return;                                   // absent ce rassemblement
      const note = Math.max(58, Math.min(93, p[3] + FM._ri(-2,2)));  // forme du moment
      squad.push({ id:100000+nat.note*100+i, nom:p[0], pos:p[1], groupe:FM.POS_GROUP[p[1]], note, buts:0 });
    });
    const need = Math.max(0, 18 - squad.length), fillPos = ["MC","DC","BU","AD","DG","GB"];
    for (let k=0;k<need;k++){
      const pos = fillPos[k%fillPos.length];
      const note = Math.max(60, nat.note - FM._ri(4,10));
      squad.push({ id:100000+nat.note*100+50+k, nom:FM._nameFrom(pool), pos, groupe:FM.POS_GROUP[pos], note, buts:0 });
    }
    return squad;
  }
  const plan = ["GB","DD","DC","DC","DG","MDC","MC","MO","AD","AG","BU","GB","DC","DD","MC","MO","AG","BU"];
  return plan.map((pos,i)=>{
    const note = Math.max(60, Math.min(93, nat.note + FM._ri(-8, 6)));
    return { id:100000+nat.note*100+i, nom: FM._nameFrom(pool), pos, groupe:FM.POS_GROUP[pos], note, buts:0 };
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

/* Un match "brut" (buts domicile/extérieur + événements orientés dom/ext) */
function rawMatch(comp, homeIdx, awayIdx){
  const H = comp.teams[homeIdx], A = comp.teams[awayIdx];
  if (comp.kind==="club"){
    const r = FM.simulateMatch(FM.clubById(H.ref), FM.clubById(A.ref));
    return { hs:r.domScore, as:r.extScore, events:r.events.map(e=>({min:e.min, joueur:e.joueur, home:e.clubId===FM.clubById(H.ref).id})) };
  }
  const r = simByRating(H, A);
  return { hs:r.as, as:r.es, events:r.events.map(e=>({min:e.min, joueur:e.joueur, home:e.side==="a"})) };
}

/* Confrontation. Coupes de clubs = ALLER-RETOUR (sauf finale, sec).
   Sélections = match sec. Renvoie un objet orienté sur (a,b) :
   {as,es}=score cumulé, pen, winner, twoLeg, leg1/leg2 {as,es} orientés a/b. */
FM.simCupTie = function(comp, ai, bi){
  const A = comp.teams[ai], B = comp.teams[bi];
  // Exempt (bye) : l'équipe réelle passe sans jouer
  if (A.bye || B.bye){
    const winner = A.bye ? bi : ai;
    return { as:0, es:0, pen:null, winner, twoLeg:false, ev1:[], bye:true };
  }
  // Coupe nationale = match sec (singleLeg) ; coupes d'Europe = aller-retour sauf finale
  const twoLeg = comp.kind==="club" && !comp.singleLeg && comp.alive.length > 2;
  if (!twoLeg){
    const m = FM.simCupMatch(comp, ai, bi);
    return { as:m.as, es:m.es, pen:m.pen, winner:m.winner, twoLeg:false, ev1:m.events };
  }
  // Aller : a reçoit. Retour : b reçoit.
  const l1 = rawMatch(comp, ai, bi);            // hs=a, as=b
  const l2 = rawMatch(comp, bi, ai);            // hs=b, as=a
  const aggA = l1.hs + l2.as, aggB = l1.as + l2.hs;
  let pen = null;
  if (aggA === aggB){
    const pA = 0.5 + (comp.teams[ai].note - comp.teams[bi].note) * 0.012;
    const aWin = FM._rnd() < Math.max(0.2, Math.min(0.8, pA));
    pen = aWin ? [FM._ri(4,5), FM._ri(2,4)] : [FM._ri(2,4), FM._ri(4,5)];
    if (pen[0]===pen[1]) pen[aWin?0:1]++;
  }
  const winner = aggA>aggB ? ai : aggB>aggA ? bi : (pen[0]>pen[1] ? ai : bi);
  return {
    as:aggA, es:aggB, pen, winner, twoLeg:true,
    leg1:{ as:l1.hs, es:l1.as, ev:l1.events },     // aller (a domicile)
    leg2:{ as:l2.as, es:l2.hs, ev:l2.events }      // retour (b domicile) -> orienté a/b
  };
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
    const res = (isPlayer && playerRes) ? playerRes : FM.simCupTie(comp, a, b);
    ties.push({ a, b, as:res.as, es:res.es, pen:res.pen, winner:res.winner, bye:res.bye,
                twoLeg:res.twoLeg, leg1:res.leg1?{as:res.leg1.as,es:res.leg1.es}:null,
                leg2:res.leg2?{as:res.leg2.as,es:res.leg2.es}:null });
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

/* ================= PHASE DE LIGUE (saison régulière) =================
   Chaque coupe de clubs : une phase de ligue (championnat, N équipes, R
   journées, classement unique) puis une phase à élimination directe
   (16 premiers, aller-retour).                                          */
function shuffleArr(a){ for(let i=a.length-1;i>0;i--){const j=Math.floor(FM._rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }

function buildLeagueSchedule(N, R){
  const played=new Set(), homeCount=new Array(N).fill(0), sched=[];
  const key=(a,b)=>a<b?a+'-'+b:b+'-'+a;
  for(let r=0;r<R;r++){
    let round=null, attempt=0;
    while(attempt++<400){
      const order=shuffleArr([...Array(N).keys()]);
      const used=new Set(), pairs=[]; let ok=true;
      for(const t of order){
        if(used.has(t))continue;
        let partner=-1;
        for(const u of order){ if(u!==t && !used.has(u) && !played.has(key(t,u))){ partner=u; break; } }
        if(partner<0){ ok=false; break; }
        used.add(t); used.add(partner);
        const home = homeCount[t]<=homeCount[partner]?t:partner;
        pairs.push(home===t?[t,partner]:[partner,t]);
      }
      if(ok && used.size===N){ round=pairs; break; }
    }
    if(!round){ const idx=[...Array(N).keys()]; round=[]; for(let i=0;i<N/2;i++) round.push([idx[i],idx[N-1-i]]); }
    round.forEach(([h,a])=>{ played.add(key(h,a)); homeCount[h]++; });
    sched.push(round);
  }
  return sched;
}

FM.makeClubComp = function(id, nom, emoji, teams, playerKey){
  const sorted = teams.slice().sort((a,b)=>b.note-a.note);
  const N = sorted.length;
  const rounds = N>=32 ? 8 : 6;
  const playerIdx = playerKey!=null ? sorted.findIndex(t=>t.key===playerKey) : -1;
  return {
    id, nom, emoji, kind:"club",
    teams: sorted, playerIdx,
    phase: "league",
    lp: { rounds, cur:0, schedule: buildLeagueSchedule(N, rounds),
          results: [], stats: sorted.map(()=>({pts:0,j:0,g:0,n:0,p:0,bf:0,bc:0})) },
    ko: null, playerAlive: playerIdx>=0, finished:false, champion:null
  };
};

/* Un match brut d'une phase de ligue (exposé pour l'UI) */
FM.simLeagueMatch = (comp, h, a) => rawMatch(comp, h, a);

/* Classement de la phase de ligue */
FM.lpTable = function(comp){
  return comp.teams.map((t,i)=>{
    const s = comp.lp.stats[i];
    return { idx:i, pts:s.pts, j:s.j, g:s.g, n:s.n, p:s.p, bf:s.bf, bc:s.bc, diff:s.bf-s.bc, note:t.note };
  }).sort((a,b)=> b.pts-a.pts || b.diff-a.diff || b.bf-a.bf || b.note-a.note);
};

/* Match du joueur dans la journée courante (ou null) */
FM.lpPlayerMatch = function(comp){
  if(comp.playerIdx<0 || comp.phase!=="league" || comp.lp.cur>=comp.lp.rounds) return null;
  for(const [h,a] of comp.lp.schedule[comp.lp.cur])
    if(h===comp.playerIdx || a===comp.playerIdx) return { home:h, away:a, playerHome:h===comp.playerIdx };
  return null;
};

function applyLP(stats,h,a,hs,as){
  const S=stats[h], T=stats[a]; S.j++; T.j++; S.bf+=hs; S.bc+=as; T.bf+=as; T.bc+=hs;
  if(hs>as){ S.g++; T.p++; S.pts+=3; } else if(hs<as){ T.g++; S.p++; T.pts+=3; } else { S.n++; T.n++; S.pts++; T.pts++; }
}

/* Résout la journée courante (playerRes {hs,as} orienté domicile/extérieur du match du joueur) */
FM.lpResolveRound = function(comp, playerRes){
  const r=comp.lp.cur; if(r>=comp.lp.rounds) return null;
  const results=[];
  for(const [h,a] of comp.lp.schedule[r]){
    const isP = comp.playerIdx>=0 && (h===comp.playerIdx || a===comp.playerIdx);
    let hs,as;
    if(isP && playerRes){ hs=playerRes.hs; as=playerRes.as; }
    else { const m=rawMatch(comp,h,a); hs=m.hs; as=m.as; }
    applyLP(comp.lp.stats,h,a,hs,as);
    results.push({h,a,hs,as});
  }
  comp.lp.results.push(results); comp.lp.cur++;
  if(comp.lp.cur>=comp.lp.rounds) FM.lpFinishToKO(comp);
  return results;
};

/* Fin de la phase de ligue -> phase à élimination directe (16 premiers) */
FM.lpFinishToKO = function(comp){
  const table = FM.lpTable(comp);
  const top = table.slice(0,16).map(row=>comp.teams[row.idx]);   // classés 1..16
  const order = seedOrder(16);
  const bracket = order.map(s=>s-1);
  let playerSeed = -1;
  if(comp.playerIdx>=0){ const pk=comp.teams[comp.playerIdx].key; playerSeed = top.findIndex(t=>t.key===pk); }
  comp.ko = {
    id:comp.id, nom:comp.nom, emoji:comp.emoji, kind:"club",
    teams: top, alive: bracket, round:0, roundsTotal:4,
    history:[], playerSeed, playerAlive: playerSeed>=0, finished:false, champion:null
  };
  comp.phase = "ko";
  comp.playerAlive = comp.ko.playerAlive;
};

/* Simule entièrement une compétition (ligue puis KO) — pour les coupes non jouées */
FM.autoCompleteClubComp = function(comp){
  let g=0;
  while(comp.phase==="league" && comp.lp.cur<comp.lp.rounds && g++<40) FM.lpResolveRound(comp);
  g=0;
  while(comp.ko && !comp.ko.finished && g++<8) FM.resolveTournamentRound(comp.ko);
  comp.finished = !!(comp.ko && comp.ko.finished);
  comp.champion = comp.ko ? comp.ko.champion : null;
};

/* Helpers d'état (une coupe de clubs) */
FM.compFinished = comp => !!(comp.ko && comp.ko.finished);
FM.compChampionTeam = comp => (comp.ko && comp.ko.finished) ? comp.ko.teams[comp.ko.champion] : null;

/* ---------------- COUPE NATIONALE (par championnat) ----------------
   Élimination directe en MATCH SEC entre tous les clubs du championnat.
   L'effectif est complété par des « exempts » (byes) pour atteindre une
   puissance de 2 : les têtes de série entrent en jouant un premier tour
   contre un exempt (elles se qualifient d'office).                        */
FM.CUP_NAMES = {
  L1:["Coupe de France","🇫🇷"], PL:["FA Cup","🏴󠁧󠁢󠁥󠁮󠁧󠁿"], LL:["Copa del Rey","🇪🇸"],
  SA:["Coppa Italia","🇮🇹"], BL:["DFB-Pokal","🇩🇪"], POR:["Taça de Portugal","🇵🇹"],
  NER:["KNVB Beker","🇳🇱"], BEL:["Coupe de Belgique","🇧🇪"], TUR:["Türkiye Kupası","🇹🇷"],
  SCO:["Scottish Cup","🏴󠁧󠁢󠁳󠁣󠁴󠁿"], RUS:["Coupe de Russie","🇷🇺"], GRE:["Coupe de Grèce","🇬🇷"],
  SUI:["Coupe de Suisse","🇨🇭"], AUT:["ÖFB-Cup","🇦🇹"], UKR:["Coupe d'Ukraine","🇺🇦"]
};

FM.makeDomesticCup = function(leagueId, playerClubId){
  const clubs = FM.state.db.clubs.filter(c=>c.ligue===leagueId);
  const teams = clubs.map(c=>({ key:c.id, ref:c.id, nom:c.nom, pays:c.pays,
                                couleurs:c.couleurs, note:FM.squadRating(c) }));
  teams.sort((a,b)=>b.note-a.note);                 // seeding
  let size=1; while(size < teams.length) size*=2;   // puissance de 2 supérieure
  const need = size - teams.length;                 // nombre d'exempts à ajouter
  for(let i=0;i<need;i++){
    teams.push({ key:"BYE"+i, ref:null, nom:"Exempt", couleurs:["#2a3342","#4b5563"], note:-1, bye:true });
  }
  const meta = FM.CUP_NAMES[leagueId] || ["Coupe nationale","🏆"];
  const playerKey = clubs.some(c=>c.id===playerClubId) ? playerClubId : null;
  const comp = FM.makeTournament("CUP", meta[0], meta[1], "club", teams, playerKey);
  comp.singleLeg = true;      // match sec à chaque tour (y compris la finale)
  return comp;
};

/* Simule entièrement la coupe nationale (tours restants) */
FM.autoCompleteCup = function(comp){
  let g=0; while(comp && !comp.finished && g++<10) FM.resolveTournamentRound(comp);
};

/* ---------------- COUPES D'EUROPE (clubs) ----------------
   Qualification selon le CLASSEMENT de chaque championnat et le
   COEFFICIENT UEFA du pays (nombre de places allouées par rang).          */
FM.LEAGUE_COEFF = { LL:1, PL:2, SA:3, BL:4, L1:5, POR:6, NER:7, BEL:8, TUR:9, SCO:10, RUS:11, GRE:12, SUI:13, AUT:14, UKR:15 };
function coeffSlots(rank){
  if (rank<=5)  return { cl:4, el:2, ecl:1 };   // grands championnats
  if (rank<=8)  return { cl:2, el:2, ecl:2 };   // championnats intermédiaires
  if (rank<=12) return { cl:1, el:1, ecl:2 };   // championnats plus modestes
  return { cl:1, el:1, ecl:1 };
}

FM.setupEuropeanCups = function(){
  const st = FM.state;
  const cl=[], el=[], ecl=[], rest=[];
  for (const lg of FM.LEAGUES){
    const lid = lg.id;
    let ordered;
    const fin = st._finalOrder && st._finalOrder[lid];
    if (fin && fin.length) ordered = fin.map(id=>FM.clubById(id)).filter(Boolean);
    else ordered = FM.state.db.clubs.filter(c=>c.ligue===lid)
        .sort((a,b)=> b.rep-a.rep || FM.squadRating(b)-FM.squadRating(a));
    const s = coeffSlots(FM.LEAGUE_COEFF[lid] || 20);
    ordered.forEach((c,pos)=>{
      if (pos < s.cl) cl.push(c.id);
      else if (pos < s.cl+s.el) el.push(c.id);
      else if (pos < s.cl+s.el+s.ecl) ecl.push(c.id);
      else rest.push(c.id);
    });
  }
  const byRating = ids => ids.slice().sort((a,b)=>FM.squadRating(FM.clubById(b))-FM.squadRating(FM.clubById(a)));
  let leftover = byRating(rest);
  function fill(pool, size){
    let arr = byRating(pool);
    while (arr.length<size && leftover.length) arr.push(leftover.shift());
    if (arr.length>size){ leftover = byRating(leftover.concat(arr.slice(size))); arr = arr.slice(0,size); }
    return arr;
  }
  const ucl = fill(cl,36), uel = fill(el,36), uecl = fill(ecl,24);

  const toTeam = id => { const c=FM.clubById(id); return { key:id, ref:id, nom:c.nom, pays:c.pays, couleurs:c.couleurs, note:FM.squadRating(c) }; };
  const myId = st.managedClubId;
  let playerComp=null;
  if (ucl.includes(myId)) playerComp="UCL";
  else if (uel.includes(myId)) playerComp="UEL";
  else if (uecl.includes(myId)) playerComp="UECL";

  st.europe = {
    playerComp,
    UCL: FM.makeClubComp("UCL","Ligue des Champions","🏆",ucl.map(toTeam), playerComp==="UCL"?myId:null),
    UEL: FM.makeClubComp("UEL","Ligue Europa","🥈",uel.map(toTeam), playerComp==="UEL"?myId:null),
    UECL:FM.makeClubComp("UECL","Ligue Conférence","🥉",uecl.map(toTeam), playerComp==="UECL"?myId:null)
  };
  // Les coupes où le joueur n'est pas sont simulées entièrement (affichage du champion)
  ["UCL","UEL","UECL"].forEach(k=>{ if(playerComp!==k) FM.autoCompleteClubComp(st.europe[k]); });
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

/* Correspondance code pays d'un championnat -> nom de sélection nationale */
FM.COUNTRY_NATION = { FRA:"France", ENG:"Angleterre", ESP:"Espagne", ITA:"Italie",
  GER:"Allemagne", POR:"Portugal", NED:"Pays-Bas", BEL:"Belgique", TUR:"Turquie",
  SCO:"Écosse", RUS:"Russie", GRE:"Grèce", SUI:"Suisse", AUT:"Autriche", UKR:"Ukraine" };
FM.nationForCountry = code => FM.COUNTRY_NATION[code] || "France";

function natColors(name){
  const map={ "France":["#0055A4","#EF4135"],"Espagne":["#C60B1E","#FFC400"],"Angleterre":["#FFFFFF","#CE1124"],
    "Portugal":["#006600","#FF0000"],"Allemagne":["#000000","#FFCE00"],"Pays-Bas":["#AE1C28","#21468B"],
    "Italie":["#008C45","#CD212A"],"Belgique":["#000000","#FDDA24"],"Brésil":["#FEDF00","#009C3B"],
    "Argentine":["#75AADB","#FFFFFF"],"Croatie":["#FF0000","#FFFFFF"],"Maroc":["#C1272D","#006233"],
    "Japon":["#BC002D","#FFFFFF"],"Uruguay":["#5CBFEB","#FFFFFF"],"Mexique":["#006847","#CE1126"] };
  return map[name] || ["#334155","#e2e8f0"];
}

FM.NATIONS = NATIONS;
