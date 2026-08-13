/* ============================================================
   MOTEUR — sélection du onze, forces d'équipe, simulation de match
   ============================================================ */
var FM = window.FM;

/* Compatibilité poste ↔ poste demandé (1 = parfait) */
function posFit(playerPos, slotPos){
  if (playerPos === slotPos) return 1;
  if (FM.POS_GROUP[playerPos] === FM.POS_GROUP[slotPos]) return 0.9;
  // Gardien uniquement gardien
  if (FM.POS_GROUP[slotPos] === "G" || FM.POS_GROUP[playerPos] === "G") return 0.4;
  return 0.72;
}

/* Un joueur est-il sélectionnable ? (ni blessé, ni suspendu) */
FM.playerAvailable = p => !p || (!(p.blessure>0) && !(p.suspension>0));
FM.unavailableReason = p => (p.blessure>0) ? `blessé (${p.blessure} j.)`
                          : (p.suspension>0) ? `suspendu (${p.suspension} j.)` : null;

/* Choisit le meilleur onze pour la formation du club (glouton par slot) */
FM.autoPickXI = function(club){
  const slots = FM.FORMATIONS[club.formation];
  const used = new Set();
  const xi = [];
  for (const slot of slots){
    let best=null, bestScore=-1e9;
    for (const p of club.joueurs){
      if (used.has(p.id)) continue;
      let score = p.note * posFit(p.pos, slot) + p.forme*0.5;
      if (!FM.playerAvailable(p)) score -= 1000;   // indisponible : uniquement en dernier recours
      if (score > bestScore){ bestScore=score; best=p; }
    }
    if (best){ used.add(best.id); xi.push({ id:best.id, slot }); }
  }
  return xi;
};

/* Récupère l'objet joueur depuis un id dans un club */
FM.getPlayer = (club, id) => club.joueurs.find(p => p.id === id);

/* Force d'une ligne (déf / milieu / att) à partir du onze */
FM.teamStrength = function(club){
  let att=0, mid=0, def=0, gk=0, cnt={A:0,M:0,D:0,G:0};
  for (const s of club.onze){
    const p = FM.getPlayer(club, s.id);
    if (!p) continue;
    let eff = p.note * posFit(p.pos, s.slot) + p.forme + (p.moral-70)*0.1;
    if (p._fresh) eff += 1.5;                 // entrant frais (remplaçant)
    if (p._tired) eff -= p._tired;            // fatigue accumulée (pressing intense)
    const g = FM.POS_GROUP[s.slot];
    if (g==="G"){ gk += eff; cnt.G++; }
    else if (g==="D"){ def += eff; cnt.D++; }
    else if (g==="M"){ mid += eff; cnt.M++; }
    else { att += eff; cnt.A++; }
  }
  def = (def + gk*1.0) / Math.max(1, cnt.D + cnt.G);
  mid = mid / Math.max(1, cnt.M);
  att = att / Math.max(1, cnt.A);

  // Influence tactique
  const t = club.tactique;
  const mentBonus = (t.mentalite-1); // -1..1
  att += mentBonus*3;
  def -= mentBonus*2.5;
  const pressBonus = (t.pressing-1);
  mid += pressBonus*1.5;

  // Infériorité numérique après une exclusion
  if (club._red){
    const k = club._red;
    att -= k*5; mid -= k*4.5; def -= k*4;
  }

  return {
    att, mid, def,
    global: Math.round((att*0.34 + mid*0.32 + def*0.34))
  };
};

/* Note moyenne d'un effectif (pour affichage) */
FM.squadRating = function(club){
  const xi = club.onze.map(s=>FM.getPlayer(club,s.id)).filter(Boolean);
  if (!xi.length) return 0;
  return Math.round(xi.reduce((a,p)=>a+p.note,0)/xi.length);
};

/* ---------- Simulation d'un match ----------
   Renvoie {domScore, extScore, events:[{min,club,joueur}]}     */
FM.simulateMatch = function(dom, ext, opts={}){
  const homeAdv = 3;
  const sD = FM.teamStrength(dom);
  const sE = FM.teamStrength(ext);

  // xG basé sur att vs def adverse + milieu (possession)
  const midDiff = (sD.mid - sE.mid);
  const homeXg = baseXg(sD.att + homeAdv, sE.def) * (1 + midDiff*0.012) * tempoMul(dom);
  const awayXg = baseXg(sE.att, sD.def + homeAdv*0.5) * (1 - midDiff*0.012) * tempoMul(ext);

  const domScore = poisson(Math.max(0.15, homeXg));
  const extScore = poisson(Math.max(0.15, awayXg));

  const events = [];
  addGoalEvents(events, dom, domScore, true);
  addGoalEvents(events, ext, extScore, false);
  events.sort((a,b)=>a.min-b.min);

  return { domScore, extScore, events, ratingDom:sD.global, ratingExt:sE.global };
};

function baseXg(att, def){
  const diff = att - def;                 // écart de niveau
  return 1.25 + diff*0.055;               // ~1.25 but de base + écart
}
function tempoMul(club){ return 0.92 + club.tactique.tempo*0.08; }

function poisson(lambda){
  const L = Math.exp(-lambda);
  let k=0, p=1;
  do { k++; p *= FM._rnd(); } while (p > L);
  return Math.min(7, k-1);
}

/* ---------- MATCH INTERACTIF (mi-temps par mi-temps) ----------
   Rejoue 45 minutes avec les réglages ACTUELS du club : changer de mentalité,
   de tempo, de pressing ou faire des remplacements à la pause a donc un
   effet réel sur la seconde période.                                        */
FM.simulateHalf = function(dom, ext, half){
  const homeAdv = 3;
  const sD = FM.teamStrength(dom), sE = FM.teamStrength(ext);
  const midDiff = (sD.mid - sE.mid);
  const homeXg = baseXg(sD.att + homeAdv, sE.def) * (1 + midDiff*0.012) * tempoMul(dom) * 0.5;
  const awayXg = baseXg(sE.att, sD.def + homeAdv*0.5) * (1 - midDiff*0.012) * tempoMul(ext) * 0.5;
  const domScore = poisson(Math.max(0.08, homeXg));
  const extScore = poisson(Math.max(0.08, awayXg));
  const events = [];
  addGoalEvents(events, dom, domScore, true, half);
  addGoalEvents(events, ext, extScore, false, half);
  events.sort((a,b)=>a.min-b.min);
  return { domScore, extScore, events, ratingDom:sD.global, ratingExt:sE.global };
};

/* Fatigue de fin de mi-temps : un pressing haut use l'équipe pour la suite */
FM.applyHalfFatigue = function(club){
  const t = club.tactique;
  const cost = t.pressing===2 ? 2.0 : t.pressing===1 ? 0.8 : 0.2;
  for (const s of club.onze){
    const p = FM.getPlayer(club, s.id);
    if (p){ p._tired = (p._tired||0) + cost; p._fresh = false; }
  }
};
/* Nettoie les marqueurs temporaires de match */
FM.clearMatchFlags = function(club){
  for (const p of club.joueurs){ delete p._tired; delete p._fresh; }
  delete club._red;
};

/* ---------- BLESSURES & CARTONS ----------
   Incidents d'une mi-temps pour les 11 sur le terrain. Le pressing haut et un
   tempo élevé augmentent le risque, tout comme l'âge et la fatigue.          */
FM.matchIncidents = function(club, half){
  const out = [];
  const t = club.tactique || {mentalite:1,tempo:1,pressing:1};
  const press = 0.7 + t.pressing*0.35;
  const tempo = 0.85 + t.tempo*0.15;
  const lo = half===2?46:1, hi = half===1?45:90;
  for (const s of club.onze){
    const p = FM.getPlayer(club, s.id);
    if (!p) continue;
    const ageF = p.age>=32 ? 1.5 : p.age<=20 ? 1.2 : 1;
    const fatigue = 1 + (p._tired||0)*0.06;
    // Blessure
    if (FM._rnd() < 0.010 * press * tempo * ageF * fatigue){
      const sev = FM._rnd();
      const duree = sev<0.55 ? FM._ri(1,2) : sev<0.85 ? FM._ri(3,5) : FM._ri(6,12);
      out.push({ type:"injury", id:p.id, nom:p.nom, min:FM._ri(lo,hi), duree });
      continue;                       // pas de carton dans la foulée
    }
    // Cartons (défenseurs et sentinelles plus exposés)
    const rugueux = FM.POS_GROUP[s.slot]==="D" || s.slot==="MDC";
    if (FM._rnd() < 0.040 * press * (rugueux?1.6:1)){
      const rouge = FM._rnd() < 0.06;
      out.push({ type: rouge?"red":"yellow", id:p.id, nom:p.nom, min:FM._ri(lo,hi) });
    }
  }
  out.sort((a,b)=>a.min-b.min);
  return out;
};

/* Applique les incidents : indisponibilités, cumul de cartons, exclusions */
FM.applyIncidents = function(club, incidents){
  for (const inc of incidents){
    const p = FM.getPlayer(club, inc.id);
    if (!p) continue;
    if (inc.type==="injury"){
      p.blessure = Math.max(p.blessure||0, inc.duree);
      p._justInjured = true;
      p._tired = (p._tired||0) + 3;                 // s'il reste sur le terrain, il est diminué
    } else if (inc.type==="red"){
      p.suspension = (p.suspension||0) + FM._ri(1,3);
      p._justInjured = true;
      club._red = (club._red||0) + 1;               // infériorité numérique
    } else {
      p.cartons = (p.cartons||0) + 1;
      if (p.cartons % 5 === 0){                     // 5 avertissements = 1 match de suspension
        p.suspension = (p.suspension||0) + 1;
        p._justInjured = true;
        inc.suspend = true;
      }
    }
  }
  return incidents;
};
/* Remplacement : sort `outId`, entre `inId` (le remplaçant est frais) */
FM.substitute = function(club, outId, inId){
  const slot = club.onze.find(s=>s.id===outId);
  if (!slot) return false;
  if (club.onze.some(s=>s.id===inId)) return false;
  const p = FM.getPlayer(club, inId);
  if (!p) return false;
  slot.id = inId; p._fresh = true; delete p._tired;
  return true;
};

/* Causerie d'avant-match : influe sur le moral (donc sur la performance) */
FM.teamTalk = function(club, choice){
  const xi = club.onze.map(s=>FM.getPlayer(club,s.id)).filter(Boolean);
  let delta = 0, txt = "";
  if (choice==="calme"){ delta = 3; txt="Vous rassurez le groupe : confiance en hausse."; }
  else if (choice==="exigeant"){
    // Risqué : galvanise un groupe au moral haut, plombe un groupe fragile
    const moyMoral = xi.reduce((a,p)=>a+p.moral,0)/(xi.length||1);
    delta = moyMoral>=72 ? 6 : -4;
    txt = delta>0 ? "Le discours galvanise un groupe déjà conquérant !" : "Le ton dur crispe un groupe fragile…";
  } else { delta = 0; txt="Consignes neutres, le groupe reste concentré."; }
  xi.forEach(p=> p.moral = Math.max(30, Math.min(99, p.moral + delta)));
  return { delta, txt };
};

function addGoalEvents(events, club, n, isHome, half){
  // Buteurs pondérés par poste (attaquants plus probables)
  const weights = club.onze.map(s=>{
    const p = FM.getPlayer(club,s.id); if(!p) return null;
    const g = FM.POS_GROUP[s.slot];
    const w = g==="A"?5 : g==="M"?2.2 : g==="D"?0.6 : 0.05;
    return { p, w };
  }).filter(Boolean);
  const total = weights.reduce((a,x)=>a+x.w,0);
  const lo = half===2 ? 46 : 1, hi = half===1 ? 45 : 90;
  for (let i=0;i<n;i++){
    let r = FM._rnd()*total, chosen=weights[0].p;
    for (const x of weights){ r-=x.w; if(r<=0){ chosen=x.p; break; } }
    events.push({ min: FM._ri(lo,hi), club: club.nom, clubId: club.id, joueur: chosen.nom, joueurId: chosen.id, isHome });
  }
}
