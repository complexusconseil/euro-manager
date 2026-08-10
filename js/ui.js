/* ============================================================
   INTERFACE — rendu des écrans & interactions
   ============================================================ */
var FM = window.FM;
var $ = sel => document.querySelector(sel);
const el = (tag, cls, html) => { const e=document.createElement(tag); if(cls)e.className=cls; if(html!=null)e.innerHTML=html; return e; };
const money = m => (m>=0? "" : "-") + Math.abs(m).toFixed(1) + " M€";
const FLAG = { FRA:"🇫🇷",ENG:"🏴",ESP:"🇪🇸",ITA:"🇮🇹",GER:"🇩🇪",POR:"🇵🇹",BRA:"🇧🇷",ARG:"🇦🇷",NED:"🇳🇱",BEL:"🇧🇪" };

/* ---- Écussons (crests) générés aux couleurs du club ---- */
function clubMonogram(nom){
  let m="";
  for (const w of nom.split(/\s+/)){
    if (/^[A-Z0-9]{2,}$/.test(w)) m += w;        // sigle déjà en capitales (SG, RB)
    else if (w.length) m += w[0].toUpperCase();
  }
  return m.slice(0,3);
}
function textColorFor(bg){
  const c=(bg||"#333").replace('#','');
  const r=parseInt(c.slice(0,2),16)||0,g=parseInt(c.slice(2,4),16)||0,b=parseInt(c.slice(4,6),16)||0;
  return (0.299*r+0.587*g+0.114*b)>150 ? "#111" : "#fff";
}
function clubCrest(club, size){
  size=size||40;
  const cols=(club.couleurs&&club.couleurs.length>=2)?club.couleurs:["#3a4557","#e6edf3"];
  const c1=cols[0], c2=cols[1];
  const mono=clubMonogram(club.nom), txt=textColorFor(c1);
  const d="M50 4 L92 16 V52 C92 78 72 92 50 98 C28 92 8 78 8 52 V16 Z";
  return `<svg class="crest" width="${size}" height="${size}" viewBox="0 0 100 100" aria-label="${club.nom}">
    <path d="${d}" fill="${c1}" stroke="${c2}" stroke-width="7"/>
    <text x="50" y="63" text-anchor="middle" font-size="34" font-weight="800" fill="${txt}" font-family="Segoe UI,Arial,sans-serif">${mono}</text>
  </svg>`;
}

let currentTab = "accueil";

/* ============= ÉCRAN DE DÉMARRAGE ============= */
let startMode = "career";                 // "career" | "master"
const KITS = [
  ["#111827","#e5e7eb"],["#d90429","#ffffff"],["#0353a4","#ffd500"],
  ["#006400","#ffffff"],["#6a040f","#e0aaff"],["#ff6d00","#111827"],
  ["#00b4d8","#03045e"],["#212529","#ffd166"]
];
let kitChoice = 0;

function renderStart(){
  const app = $("#app");
  app.innerHTML = "";
  const wrap = el("div","start");
  wrap.appendChild(el("h1","logo","⚽ Euro Manager"));
  wrap.appendChild(el("p","tagline","Gérez un club européen — du mercato au terrain."));

  // Sélecteur de mode
  const modeSwitch = el("div","mode-switch");
  [["career","🏅 Carrière"],["master","🏆 Master League"],["intl","🌍 International"]].forEach(([m,lbl])=>{
    const b = el("button","mode-btn"+(startMode===m?" active":""),lbl);
    b.onclick=()=>{ startMode=m; renderStart(); };
    modeSwitch.appendChild(b);
  });
  wrap.appendChild(modeSwitch);

  const card = el("div","card start-card");
  card.appendChild(el("label",null,"Nom du manager"));
  const nameIn = el("input"); nameIn.type="text"; nameIn.value="Manager"; nameIn.id="mgrName";
  card.appendChild(nameIn);

  let ligueSel = null;
  if (startMode !== "intl"){
    card.appendChild(el("label",null,"Choisissez un championnat"));
    ligueSel = el("select"); ligueSel.id="ligueSel";
    FM.LEAGUES.forEach(l=> ligueSel.appendChild(new Option(`${l.nom}`, l.id)));
    card.appendChild(ligueSel);
  }

  if (startMode === "career"){
    /* ---- MODE CARRIÈRE : choisir un vrai club ---- */
    card.appendChild(el("label",null,"Choisissez votre club"));
    const clubSel = el("select"); clubSel.id="clubSel";
    card.appendChild(clubSel);
    const fillClubs = ()=>{
      clubSel.innerHTML="";
      const lg = FM.LEAGUES.find(l=>l.id===ligueSel.value);
      lg.clubs.forEach((c,i)=> clubSel.appendChild(new Option(`${c[0]}  ${"★".repeat(c[1])}`, i)));
    };
    ligueSel.onchange = fillClubs; fillClubs();

    const btn = el("button","btn primary big","🚀 Démarrer la carrière");
    btn.onclick = ()=>{
      FM.setSeed(20260810);
      const tmp = FM.buildDatabase();
      const lgId = ligueSel.value;
      const idx = parseInt(clubSel.value,10);
      const chosen = tmp.clubs.filter(c=>c.ligue===lgId)[idx];
      FM.newGame(nameIn.value.trim()||"Manager", chosen.id, 20260810);
      currentTab="accueil"; renderGame();
    };
    card.appendChild(btn);

  } else if (startMode === "master"){
    /* ---- MODE MASTER LEAGUE : créer son club ---- */
    card.appendChild(el("label",null,"Nom de votre club"));
    const clubName = el("input"); clubName.type="text"; clubName.value="FC Master"; clubName.id="mlName";
    card.appendChild(clubName);

    card.appendChild(el("label",null,"Couleurs du maillot (écusson)"));
    const kitRow = el("div","kit-row");
    KITS.forEach((k,i)=>{
      const sw = el("button","kit-swatch"+(kitChoice===i?" active":""));
      sw.style.background = `linear-gradient(135deg, ${k[0]} 55%, ${k[1]} 55%)`;
      sw.title = "Kit "+(i+1);
      sw.onclick = (e)=>{
        e.preventDefault(); kitChoice=i;
        // mise à jour visuelle sans re-render (préserve les champs saisis)
        kitRow.querySelectorAll(".kit-swatch").forEach((s,j)=>s.classList.toggle("active", j===i));
      };
      kitRow.appendChild(sw);
    });
    card.appendChild(kitRow);

    const info = el("p","ml-info","🎮 Vous démarrez avec un effectif « maison » modeste et un petit budget, à la place du club le plus faible du championnat. Recrutez, progressez et bâtissez une grande équipe au fil des saisons — comme la Ligue des Masters d'antan.");
    card.appendChild(info);

    const btn = el("button","btn primary big","🏆 Lancer la Master League");
    btn.onclick = ()=>{
      FM.newMasterLeague(nameIn.value.trim()||"Manager", clubName.value.trim()||"FC Master",
        ligueSel.value, 20260810, KITS[kitChoice]);
      currentTab="accueil"; renderGame();
    };
    card.appendChild(btn);

  } else {
    /* ---- MODE INTERNATIONAL : Euro / Coupe du Monde ---- */
    card.appendChild(el("label",null,"Compétition"));
    const compSel = el("select");
    compSel.appendChild(new Option("Championnat d'Europe (16 nations)","EURO"));
    compSel.appendChild(new Option("Coupe du Monde (32 nations)","WC"));
    card.appendChild(compSel);

    card.appendChild(el("label",null,"Choisissez votre sélection"));
    const natSel = el("select");
    card.appendChild(natSel);
    const fillNations = ()=>{
      natSel.innerHTML="";
      const list = compSel.value==="EURO" ? FM.nationsForEuro() : FM.nationsList();
      list.slice().sort((a,b)=>a.localeCompare(b)).forEach(n=> natSel.appendChild(new Option(n,n)));
      natSel.value = compSel.value==="EURO" ? "France" : "Brésil";
    };
    compSel.onchange = fillNations; fillNations();

    const info = el("p","ml-info","🌍 Disputez le tournoi à élimination directe avec la sélection de votre choix. La force de chaque nation est réaliste ; les effectifs sont représentatifs (générés).");
    card.appendChild(info);

    const btn = el("button","btn primary big","🌍 Lancer le tournoi");
    btn.onclick = ()=>{ FM.setSeed(20260810 + Math.floor(natSel.selectedIndex*7 + compSel.selectedIndex*13)); startInternational(compSel.value, natSel.value); };
    card.appendChild(btn);
  }

  if (FM.hasSave() && startMode!=="intl"){
    const cont = el("button","btn ghost","▶ Reprendre la partie sauvegardée");
    cont.onclick = ()=>{ if(FM.load()){ currentTab="accueil"; renderGame(); } };
    card.appendChild(cont);
    const del = el("button","btn danger-ghost","🗑 Supprimer la sauvegarde");
    del.onclick = ()=>{ if(confirm("Supprimer la sauvegarde ?")){ FM.deleteSave(); renderStart(); } };
    card.appendChild(del);
  }
  wrap.appendChild(card);

  // Bascule rendu 3D / 2D des matchs
  const rt = el("label","render-toggle");
  const cb = el("input"); cb.type="checkbox"; cb.checked = localStorage.getItem("fm_render2d")!=="1";
  cb.onchange = ()=>{ localStorage.setItem("fm_render2d", cb.checked?"0":"1"); };
  rt.appendChild(cb);
  const has3d = window.FM3D && FM3D.available();
  rt.appendChild(el("span",null,"🎮 Rendu 3D des matchs (immersif)"+(has3d?"":" — indisponible sur ce navigateur")));
  if(!has3d) cb.disabled=true;
  wrap.appendChild(rt);

  wrap.appendChild(el("p","hint","💾 Partie sauvegardée automatiquement dans votre navigateur (localStorage)."));
  app.appendChild(wrap);
}

/* ============= COQUE DU JEU ============= */
function renderGame(){
  const app = $("#app");
  app.innerHTML = "";
  const my = FM.myClub();

  // Barre supérieure
  const top = el("div","topbar");
  top.innerHTML = `
    <div class="club-id">
      ${clubCrest(my,46)}
      <div><b>${my.nom}${FM.state.mode==="master"?' <span class="ml-badge">Master League</span>':''}</b><small>${my.ligueNom} · ${FM.state.managerName}</small></div>
    </div>
    <div class="stats">
      <div><small>Saison</small><b>${FM.state.saison}</b></div>
      <div><small>Journée</small><b>${Math.min(FM.state.journee+1,FM.totalMatchdays())}/${FM.totalMatchdays()}</b></div>
      <div><small>Classement</small><b>${FM.myRank()}${ord(FM.myRank())}</b></div>
      <div><small>Budget</small><b class="${my.budget<0?'neg':'pos'}">${money(my.budget)}</b></div>
      <div><small>Note effectif</small><b>${FM.squadRating(my)}</b></div>
    </div>`;
  app.appendChild(top);

  // Onglets
  const tabs = el("div","tabs");
  const T = [["accueil","🏠 Accueil"],["effectif","👥 Effectif"],["tactique","📋 Tactique"],
             ["mercato","💱 Mercato"],["europe","🏆 Europe"],["classement","📊 Classement"],
             ["calendrier","📅 Calendrier"],["actus","📰 Actus"]];
  T.forEach(([k,lbl])=>{
    const b = el("button","tab"+(currentTab===k?" active":""),lbl);
    b.onclick=()=>{ currentTab=k; renderGame(); };
    tabs.appendChild(b);
  });
  app.appendChild(tabs);

  const body = el("div","content"); body.id="content";
  app.appendChild(body);

  switch(currentTab){
    case "accueil": renderHome(body); break;
    case "effectif": renderSquad(body); break;
    case "tactique": renderTactics(body); break;
    case "mercato": renderMarket(body); break;
    case "europe": renderEurope(body); break;
    case "classement": renderTable(body); break;
    case "calendrier": renderCalendar(body); break;
    case "actus": renderNews(body); break;
  }

  // pied
  const foot = el("div","footbar");
  const quit = el("button","btn ghost small","⏻ Menu principal");
  quit.onclick = ()=>{ renderStart(); };
  foot.appendChild(quit);
  app.appendChild(foot);
}

function ord(n){ return n===1?"er":"e"; }

/* ============= ACCUEIL ============= */
function renderHome(body){
  const my = FM.myClub();
  if (FM.isSeasonOver()){
    const c = el("div","card center");
    const t = FM.table();
    const rank = FM.myRank();
    c.innerHTML = `<h2>🏁 Saison ${FM.state.saison} terminée</h2>
      <p>Champion : <b>${t[0].nom}</b></p>
      <p>${my.nom} termine <b>${rank}${ord(rank)}</b> avec ${my.pts} pts.</p>`;
    const b = el("button","btn primary big","➡ Saison suivante");
    b.onclick=()=>{ FM.endSeason(); currentTab="accueil"; renderGame(); };
    c.appendChild(b);
    body.appendChild(c);
    return;
  }

  const fx = FM.nextFixture();
  const card = el("div","card match-card");
  if (fx){
    const dom = FM.clubById(fx.dom), ext = FM.clubById(fx.ext);
    const iAmHome = fx.dom===my.id;
    card.innerHTML = `
      <div class="match-header">Journée ${FM.state.journee+1} · ${FM.state.ligueJoueurNom||FM.myClub().ligueNom}</div>
      <div class="match-teams">
        <div class="side ${iAmHome?'me':''}">${clubCrest(dom,56)}<b>${dom.nom}</b><small>Note ${FM.squadRating(dom)}</small></div>
        <div class="vs">VS</div>
        <div class="side ${!iAmHome?'me':''}">${clubCrest(ext,56)}<b>${ext.nom}</b><small>Note ${FM.squadRating(ext)}</small></div>
      </div>
      <p class="match-loc">${iAmHome?'🏟 À domicile':'✈ À l\'extérieur'} · Vous êtes ${iAmHome?dom.nom:ext.nom}</p>`;
  }
  const play = el("button","btn primary big","▶ Jouer le match");
  play.onclick = ()=> playMatchFlow();
  card.appendChild(play);
  const sim = el("button","btn ghost","⏩ Simuler rapidement");
  sim.onclick = ()=>{ FM.playMatchday(); currentTab="accueil"; renderGame(); };
  card.appendChild(sim);
  body.appendChild(card);

  // objectif + offres
  const info = el("div","card");
  info.innerHTML = `<h3>🎯 Objectif de saison</h3><p>${cap(FM.state.objectif)} — actuellement <b>${FM.myRank()}${ord(FM.myRank())}</b> / ${FM.clubsInMyLeague().length}.</p>`;
  body.appendChild(info);

  if (FM.state.offres.length){
    const off = el("div","card");
    off.appendChild(el("h3",null,"📩 Offres reçues"));
    FM.state.offres.forEach((o,i)=>{
      const row = el("div","offer-row");
      row.innerHTML = `<span><b>${o.clubNom}</b> offre <b>${o.montant.toFixed(1)} M€</b> pour ${o.joueurNom}</span>`;
      const ok = el("button","btn small primary","Accepter");
      ok.onclick=()=>{ const r=FM.acceptOffer(i); toast(r.msg); renderGame(); };
      const no = el("button","btn small ghost","Refuser");
      no.onclick=()=>{ FM.rejectOffer(i); renderGame(); };
      row.appendChild(ok); row.appendChild(no);
      off.appendChild(row);
    });
    body.appendChild(off);
  }

  // dernières actus
  const news = el("div","card");
  news.appendChild(el("h3",null,"📰 Dernières actualités"));
  FM.state.news.slice(0,5).forEach(n=> news.appendChild(el("p","news-item",n.txt)));
  body.appendChild(news);
}

/* ============= VISUALISATION DES MATCHS (3D ou 2D) ============= */
function use3D(){ return localStorage.getItem("fm_render2d")!=="1" && window.FM3D && FM3D.available(); }

/* Répartiteur : home/away = {nom,couleurs} ; events = [{min,joueur,home:bool}] */
function watchMatch(home, away, hs, as, events, opts, onDone){
  opts = opts || {};
  if (use3D()){ window.FM3D.play({home,away,hs,as,events,label:opts.label,endText:opts.endText}, onDone); return; }
  animate2D(home, away, hs, as, events, opts, onDone);
}

/* Repli 2D animé */
function animate2D(home, away, hs, as, events, opts, onDone){
  const overlay = el("div","overlay");
  const box = el("div","match-live card");
  box.innerHTML = `<div class="live-head">
      <div class="lh-team">${clubCrest(home,34)} ${home.nom}</div>
      <div class="live-score" id="lS">0 - 0</div>
      <div class="lh-team">${away.nom} ${clubCrest(away,34)}</div></div>
    ${opts.label?`<div class="leg-label">${opts.label}</div>`:''}
    <div class="live-min" id="lM">Coup d'envoi…</div>
    <div class="live-feed" id="lF"></div>`;
  overlay.appendChild(box);
  const skip = el("button","btn ghost","⏭ Passer"); box.appendChild(skip);
  document.body.appendChild(overlay);
  const feed=box.querySelector("#lF"), sEl=box.querySelector("#lS"), mEl=box.querySelector("#lM");
  const ord = events.slice().sort((a,b)=>a.min-b.min);
  let s=0,o=0,idx=0,minute=0,timer;
  const line = e => el("div","feed-line "+(e.home?"left":"right"),`<span class="fmin">${e.min}'</span> ⚽ <b>${e.joueur}</b>`);
  function finish(){ clearInterval(timer); s=hs;o=as; sEl.textContent=`${s} - ${o}`;
    mEl.textContent=(opts.endText?opts.endText+" · ":"")+"Coup de sifflet final ⏱";
    skip.textContent="✔ Continuer"; skip.className="btn primary"; skip.onclick=()=>{ overlay.remove(); onDone&&onDone(); }; }
  skip.onclick=finish;
  timer=setInterval(()=>{ minute+=3; if(minute>90){finish();return;}
    mEl.textContent=`${opts.label?opts.label+" · ":""}${minute}'`;
    while(idx<ord.length && ord[idx].min<=minute){ const e=ord[idx++]; if(e.home)s++;else o++;
      sEl.textContent=`${s} - ${o}`; const l=line(e); l.classList.add("flash"); feed.prepend(l); }
  },220);
}

/* Match de championnat du joueur */
function playMatchFlow(){
  const my = FM.myClub();
  if (my.onze.filter(s=>!s.id).length){ toast("⚠ Onze incomplet — complétez votre équipe (Tactique)."); currentTab="tactique"; renderGame(); return; }
  const res = FM.playMatchday();
  const mr = res.myResult;
  if (!mr){ renderGame(); return; }
  const dom = FM.clubById(mr.dom), ext = FM.clubById(mr.ext);
  const events = mr.events.map(e=>({ min:e.min, joueur:e.joueur, home:e.clubId===dom.id }));
  watchMatch({nom:dom.nom,couleurs:dom.couleurs}, {nom:ext.nom,couleurs:ext.couleurs}, mr.ds, mr.es, events,
    {label:`${dom.ligueNom}`}, ()=>{ currentTab="accueil"; renderGame(); });
}

/* ============= EFFECTIF ============= */
function renderSquad(body){
  const my = FM.myClub();
  const card = el("div","card");
  card.appendChild(el("h3",null,`👥 Effectif — ${my.joueurs.length} joueurs · Masse salariale ~${my.joueurs.reduce((a,p)=>a+p.salaire,0).toFixed(0)} k€/sem`));

  const table = el("table","squad-table");
  table.innerHTML = `<thead><tr>
    <th>Poste</th><th>Nom</th><th>Nat</th><th>Âge</th><th>Note</th><th>Pot</th>
    <th>Valeur</th><th>Forme</th><th>Moral</th><th title="Matchs">M</th><th title="Buts">⚽</th><th title="Passes déc.">🅰️</th><th title="Note moyenne">Moy</th><th></th></tr></thead>`;
  const tb = el("tbody");
  const order = {G:0,D:1,M:2,A:3};
  my.joueurs.slice().sort((a,b)=> order[a.groupe]-order[b.groupe] || b.note-a.note).forEach(p=>{
    const inXI = my.onze.some(s=>s.id===p.id);
    const tr = el("tr", inXI?"in-xi":"");
    tr.innerHTML = `
      <td><span class="pos-badge ${p.groupe}">${p.pos}</span></td>
      <td>${inXI?'⭐ ':''}${p.nom}</td>
      <td>${FLAG[p.nat]||''}</td>
      <td>${p.age}</td>
      <td><b class="note ${noteClass(p.note)}">${p.note}</b></td>
      <td>${p.potentiel}</td>
      <td>${p.valeur.toFixed(1)} M€</td>
      <td>${formeIcon(p.forme)}</td>
      <td>${moralBar(p.moral)}</td>
      <td>${p.matchs||0}</td>
      <td>${p.buts}</td>
      <td>${p.passes||0}</td>
      <td>${p.noteMatchs?('<b class="note '+noteClass((FM.playerAvgNote(p))*10)+'">'+FM.playerAvgNote(p).toFixed(2)+'</b>'):'—'}</td>
      <td></td>`;
    const btn = el("button","btn tiny "+(p.transferListe?"danger-ghost":"ghost"), p.transferListe?"Retirer":"Vendre");
    btn.onclick=()=>{ FM.toggleTransferList(p.id); renderGame(); };
    tr.lastChild.appendChild(btn);
    tb.appendChild(tr);
  });
  table.appendChild(tb);
  const scroll = el("div","table-scroll"); scroll.appendChild(table);
  card.appendChild(scroll);
  body.appendChild(card);
}

/* ============= TACTIQUE ============= */
function renderTactics(body){
  const my = FM.myClub();

  // Formation + réglages
  const setup = el("div","card");
  setup.appendChild(el("h3",null,"📋 Formation & consignes"));
  const row = el("div","tac-row");
  const fLabel = el("label",null,"Formation");
  const fSel = el("select");
  Object.keys(FM.FORMATIONS).forEach(f=> fSel.appendChild(new Option(f,f)));
  fSel.value = my.formation;
  fSel.onchange=()=>{ FM.setFormation(fSel.value); renderGame(); };
  fLabel.appendChild(fSel);
  row.appendChild(fLabel);

  row.appendChild(sliderTac("Mentalité", ["Défensive","Équilibrée","Offensive"], my.tactique.mentalite, v=>{FM.setTactic("mentalite",v);}));
  row.appendChild(sliderTac("Tempo", ["Lent","Normal","Rapide"], my.tactique.tempo, v=>{FM.setTactic("tempo",v);}));
  row.appendChild(sliderTac("Pressing", ["Bas","Moyen","Haut"], my.tactique.pressing, v=>{FM.setTactic("pressing",v);}));
  setup.appendChild(row);

  const auto = el("button","btn ghost small","🔄 Composer automatiquement");
  auto.onclick=()=>{ my.onze=FM.autoPickXI(my); FM.save(); renderGame(); };
  setup.appendChild(auto);
  body.appendChild(setup);

  // Terrain visuel
  const pitchCard = el("div","card");
  pitchCard.appendChild(el("h3",null,"🟩 Composition sur le terrain"));
  const st = FM.teamStrength(my);
  pitchCard.appendChild(el("p","strength-line",
    `Attaque <b>${Math.round(st.att)}</b> · Milieu <b>${Math.round(st.mid)}</b> · Défense <b>${Math.round(st.def)}</b> · Global <b>${st.global}</b>`));
  const pitch = el("div","pitch");
  const slots = FM.FORMATIONS[my.formation];
  const rows = pitchRows(my.formation);
  let si=0;
  rows.forEach(count=>{
    const line = el("div","pitch-line");
    for (let k=0;k<count;k++){
      const slotIdx=si;
      const s = my.onze[slotIdx];
      const p = s && s.id ? FM.getPlayer(my,s.id) : null;
      const spot = el("div","spot"+(p?"":" empty"));
      spot.innerHTML = p
        ? `<div class="spot-pos">${slots[slotIdx]}</div><div class="spot-note ${noteClass(p.note)}">${p.note}</div><div class="spot-name">${shortName(p.nom)}</div>`
        : `<div class="spot-pos">${slots[slotIdx]}</div><div class="spot-add">+</div>`;
      spot.onclick=()=> openPlayerPicker(slotIdx, slots[slotIdx]);
      line.appendChild(spot);
      si++;
    }
    pitch.appendChild(line);
  });
  pitchCard.appendChild(pitch);
  pitchCard.appendChild(el("p","hint","Cliquez sur un poste pour changer le joueur titulaire."));
  body.appendChild(pitchCard);
}

function sliderTac(title, labels, val, onchange){
  const box = el("label","tac-slider");
  box.appendChild(el("span","tac-title",title));
  const out = el("span","tac-val",labels[val]);
  const inp = el("input"); inp.type="range"; inp.min=0; inp.max=2; inp.value=val;
  inp.oninput=()=>{ out.textContent=labels[inp.value]; onchange(parseInt(inp.value,10)); };
  box.appendChild(inp); box.appendChild(out);
  return box;
}

function pitchRows(formation){
  // Nombre de joueurs par ligne pour l'affichage (GK en bas)
  const map = {
    "4-4-2":[1,4,4,2], "4-3-3":[1,4,3,3], "4-2-3-1":[1,4,2,3,1],
    "3-5-2":[1,3,5,2], "5-3-2":[1,5,3,2], "4-5-1":[1,4,5,1]
  };
  return map[formation] || [1,4,4,2];
}

function openPlayerPicker(slotIdx, slotPos){
  const my = FM.myClub();
  const overlay = el("div","overlay");
  const box = el("div","card picker");
  box.appendChild(el("h3",null,`Choisir un joueur — ${FM.POS_LABEL[slotPos]} (${slotPos})`));
  const list = el("div","picker-list");
  const usedIds = new Set(my.onze.filter((_,i)=>i!==slotIdx).map(s=>s.id));
  my.joueurs.slice().sort((a,b)=>b.note-a.note).forEach(p=>{
    const row = el("div","picker-row"+(usedIds.has(p.id)?" used":""));
    row.innerHTML = `<span class="pos-badge ${p.groupe}">${p.pos}</span>
      <b>${p.nom}</b> <span class="note ${noteClass(p.note)}">${p.note}</span>
      <small>${formeIcon(p.forme)} ${usedIds.has(p.id)?'· déjà titulaire':''}</small>`;
    row.onclick=()=>{ FM.setStarter(slotIdx, p.id); overlay.remove(); renderGame(); };
    list.appendChild(row);
  });
  box.appendChild(list);
  const close = el("button","btn ghost","Fermer");
  close.onclick=()=> overlay.remove();
  box.appendChild(close);
  overlay.appendChild(box);
  overlay.onclick=e=>{ if(e.target===overlay) overlay.remove(); };
  document.body.appendChild(overlay);
}

/* ============= COUPES D'EUROPE ============= */
function renderEurope(body){
  const e = FM.state.europe;
  if (!e){ body.appendChild(el("div","card",`<p class="hint">Les coupes d'Europe se mettent en place en début de saison.</p>`)); return; }

  // Bandeau des 3 compétitions
  const bar = el("div","comp-bar");
  ["UCL","UEL","UECL"].forEach(k=>{
    const c=e[k];
    let stat;
    if (c.phase==="league") stat = `Phase de ligue J${c.lp.cur}/${c.lp.rounds}`;
    else if (FM.compFinished(c)) stat = "🏆 "+FM.compChampionTeam(c).nom;
    else stat = FM.roundName(c.ko.alive.length);
    const pill = el("div","comp-pill"+(e.playerComp===k?" mine":""));
    pill.innerHTML = `<span class="ce">${c.emoji}</span><div><b>${c.nom}</b><small>${stat}</small></div>`;
    bar.appendChild(pill);
  });
  body.appendChild(bar);

  if (!e.playerComp){
    const c = el("div","card");
    c.innerHTML = `<h3>🏆 Coupes d'Europe</h3><p>Votre club n'est pas qualifié cette saison. Qualifiez-vous via le classement de votre championnat (places attribuées selon le coefficient UEFA de votre pays).</p>
      <p>🏆 <b>${FM.compChampionTeam(e.UCL)?FM.compChampionTeam(e.UCL).nom:'—'}</b> remporte la Ligue des Champions.</p>`;
    body.appendChild(c);
    if (e.UCL.ko) renderCupHistory(body, e.UCL.ko);
    return;
  }

  const comp = e[e.playerComp];

  if (comp.phase==="league"){ renderLeaguePhase(body, comp); return; }

  // ---- Phase à élimination directe ----
  const ko = comp.ko;
  const card = el("div","card");
  card.appendChild(el("h3",null,`${comp.emoji} ${comp.nom} — phase finale (${FM.myClub().nom})`));
  if (ko.finished){
    const won = ko.champion===ko.playerSeed;
    card.innerHTML += `<p class="euro-final ${won?'win':''}">${won?'🏆 VAINQUEUR ! Félicitations !':'Vainqueur : <b>'+ko.teams[ko.champion].nom+'</b>'}</p>`;
  } else if (ko.playerAlive){
    const tie = FM.playerTie(ko);
    const opp = ko.teams[tie[0]===ko.playerSeed?tie[1]:tie[0]];
    const me = FM.myClub();
    card.appendChild(el("p","round-name",`${FM.roundName(ko.alive.length)}${ko.alive.length>2?' · aller-retour':' · match sec'}`));
    const tieBox = el("div","tie-box");
    tieBox.innerHTML = `
      <div class="tie-side">${clubCrest(me,52)}<b>${me.nom}</b><small>${FM.squadRating(me)}</small></div>
      <div class="vs">VS</div>
      <div class="tie-side">${clubCrest({nom:opp.nom,couleurs:opp.couleurs},52)}<b>${opp.nom}</b><small>${opp.note}</small></div>`;
    card.appendChild(tieBox);
    const play = el("button","btn primary big","▶ Jouer le match");
    play.onclick=()=> playCupTie(ko);
    card.appendChild(play);
    const sim = el("button","btn ghost","⏩ Simuler ce tour");
    sim.onclick=()=>{ FM.resolveTournamentRound(ko); FM.save(); renderGame(); };
    card.appendChild(sim);
  } else {
    card.appendChild(el("p","round-name","Vous avez été éliminé."));
    const b = el("button","btn ghost","⏩ Voir la suite");
    b.onclick=()=>{ let g=0; while(!ko.finished&&g++<8) FM.resolveTournamentRound(ko); FM.save(); renderGame(); };
    card.appendChild(b);
  }
  body.appendChild(card);
  renderCupHistory(body, ko);
}

/* Phase de ligue : classement + match du joueur */
function renderLeaguePhase(body, comp){
  const card = el("div","card");
  card.appendChild(el("h3",null,`${comp.emoji} ${comp.nom} — phase de ligue (J${comp.lp.cur+1}/${comp.lp.rounds})`));
  const pm = FM.lpPlayerMatch(comp);
  if (pm){
    const me = FM.myClub();
    const oppIdx = pm.playerHome?pm.away:pm.home;
    const opp = comp.teams[oppIdx];
    const box = el("div","tie-box");
    box.innerHTML = `
      <div class="tie-side">${clubCrest(me,52)}<b>${me.nom}</b><small>${pm.playerHome?'🏟 domicile':'✈ extérieur'}</small></div>
      <div class="vs">VS</div>
      <div class="tie-side">${clubCrest({nom:opp.nom,couleurs:opp.couleurs},52)}<b>${opp.nom}</b><small>${opp.note}</small></div>`;
    card.appendChild(box);
    const play = el("button","btn primary big","▶ Jouer le match");
    play.onclick=()=> playLeagueMatch(comp);
    card.appendChild(play);
    const sim = el("button","btn ghost","⏩ Simuler la journée");
    sim.onclick=()=>{ FM.lpResolveRound(comp); FM.save(); renderGame(); };
    card.appendChild(sim);
    const simAll = el("button","btn ghost","⏩⏩ Simuler toute la phase");
    simAll.onclick=()=>{ let g=0; while(comp.phase==="league"&&g++<40) FM.lpResolveRound(comp); FM.save(); renderGame(); };
    card.appendChild(simAll);
  }
  body.appendChild(card);

  // Classement de la phase de ligue
  const tCard = el("div","card");
  tCard.appendChild(el("h3",null,"Classement — les 16 premiers qualifiés"));
  const table = el("table","rank-table");
  table.innerHTML = `<thead><tr><th>#</th><th>Club</th><th>J</th><th>G</th><th>N</th><th>P</th><th>Diff</th><th>Pts</th></tr></thead>`;
  const tb = el("tbody");
  FM.lpTable(comp).forEach((row,i)=>{
    const t = comp.teams[row.idx];
    const tr = el("tr", row.idx===comp.playerIdx?"me":"");
    if (i<16) tr.classList.add("ucl");
    tr.innerHTML = `<td>${i+1}</td><td class="club-cell">${clubCrest({nom:t.nom,couleurs:t.couleurs},22)}<span>${t.nom}</span></td>
      <td>${row.j}</td><td>${row.g}</td><td>${row.n}</td><td>${row.p}</td>
      <td>${row.diff>0?'+':''}${row.diff}</td><td><b>${row.pts}</b></td>`;
    tb.appendChild(tr);
  });
  table.appendChild(tb);
  const scroll = el("div","table-scroll"); scroll.appendChild(table);
  tCard.appendChild(scroll);
  tCard.appendChild(el("p","legend","🟩 Top 16 → phase à élimination directe (aller-retour)"));
  body.appendChild(tCard);
}

/* Match de phase de ligue du joueur (match sec, animé) */
function playLeagueMatch(comp){
  const pm = FM.lpPlayerMatch(comp);
  if (!pm){ renderGame(); return; }
  const m = FM.simLeagueMatch(comp, pm.home, pm.away);   // hs=domicile, as=extérieur
  const me = FM.myClub();
  const oppIdx = pm.playerHome?pm.away:pm.home;
  const opp = { nom:comp.teams[oppIdx].nom, couleurs:comp.teams[oppIdx].couleurs };
  const homeT = comp.teams[pm.home], awayT = comp.teams[pm.away];
  const evs = m.events.map(ev=>({ min:ev.min, joueur:ev.joueur, home:ev.home }));
  watchMatch({nom:homeT.nom,couleurs:homeT.couleurs}, {nom:awayT.nom,couleurs:awayT.couleurs}, m.hs, m.as, evs,
    {label:"Phase de ligue"}, ()=>{ FM.lpResolveRound(comp, { hs:m.hs, as:m.as }); FM.save(); renderGame(); });
}

/* Historique des tours d'une compétition (met en avant le club du joueur) */
function renderCupHistory(body, comp){
  if (!comp.history.length) return;
  const h = el("div","card");
  h.appendChild(el("h3",null,`${comp.emoji} ${comp.nom} — résultats`));
  comp.history.slice().reverse().forEach(rd=>{
    h.appendChild(el("p","cup-round-title",rd.nom));
    const list = el("div","cup-ties");
    rd.ties.forEach(t=>{
      const A=comp.teams[t.a], B=comp.teams[t.b];
      const mine = (t.a===comp.playerSeed||t.b===comp.playerSeed);
      const row = el("div","cup-tie"+(mine?" mine":""));
      const legs = t.twoLeg && t.leg1 && t.leg2 ? ` <em>(${t.leg1.as}-${t.leg1.es}, ${t.leg2.as}-${t.leg2.es})</em>` : '';
      row.innerHTML = `<span class="ct-a ${t.winner===t.a?'w':''}">${A.nom}</span>
        <span class="ct-s">${t.as}-${t.es}${t.pen?` <em>tab ${t.pen[0]}-${t.pen[1]}</em>`:''}${legs}</span>
        <span class="ct-b ${t.winner===t.b?'w':''}">${B.nom}</span>`;
      list.appendChild(row);
    });
    h.appendChild(list);
  });
  body.appendChild(h);
}

/* Avance d'un tour les coupes où le joueur n'est PAS (ou toutes) */
function advanceAllCups(othersOnly){
  const e = FM.state.europe; if(!e) return;
  ["UCL","UEL","UECL"].forEach(k=>{
    if (othersOnly && e.playerComp===k) return;
    if (!e[k].finished) FM.resolveTournamentRound(e[k]);
  });
  FM.save();
}

/* Match de coupe du joueur, avec animation (aller-retour si applicable) */
function playCupTie(comp){
  const tie = FM.playerTie(comp);
  if (!tie){ renderGame(); return; }
  const [a,b] = tie;
  const res = FM.simCupTie(comp, a, b);
  const playerA = (a===comp.playerSeed);
  const me = FM.myClub();
  const oppTeam = comp.teams[playerA?b:a];
  const opp = { nom:oppTeam.nom, couleurs:oppTeam.couleurs };
  const finish = ()=>{ FM.resolveTournamentRound(comp, res); advanceAllCups(true); FM.save(); renderGame(); };

  const meInfo = {nom:me.nom, couleurs:me.couleurs};
  if (!res.twoLeg){
    const selfScore = playerA?res.as:res.es, oppScore = playerA?res.es:res.as;
    const evs = (res.ev1||[]).map(ev=>({ min:ev.min, joueur:ev.joueur, home:(ev.side==="a")===playerA }));
    const won = selfScore>oppScore || (selfScore===oppScore && res.pen && ((playerA?res.pen[0]:res.pen[1])>(playerA?res.pen[1]:res.pen[0])));
    const ptxt = res.pen ? ` (tab ${playerA?res.pen[0]:res.pen[1]}-${playerA?res.pen[1]:res.pen[0]})` : "";
    watchMatch(meInfo, opp, selfScore, oppScore, evs, {label:comp.nom, endText:(won?"✅ Qualifié":"❌ Éliminé")+ptxt}, finish);
    return;
  }
  // ALLER puis RETOUR, verdict au cumul
  const l1s = playerA?res.leg1.as:res.leg1.es, l1o = playerA?res.leg1.es:res.leg1.as;
  const l1ev = (res.leg1.ev||[]).map(ev=>({ min:ev.min, joueur:ev.joueur, home:(ev.home===playerA) }));
  const l2s = playerA?res.leg2.as:res.leg2.es, l2o = playerA?res.leg2.es:res.leg2.as;
  const l2ev = (res.leg2.ev||[]).map(ev=>({ min:ev.min, joueur:ev.joueur, home:(ev.home!==playerA) }));
  const aggS=l1s+l2s, aggO=l1o+l2o;
  const won = aggS>aggO || (aggS===aggO && res.pen && ((playerA?res.pen[0]:res.pen[1])>(playerA?res.pen[1]:res.pen[0])));
  const ptxt = res.pen ? ` tab ${playerA?res.pen[0]:res.pen[1]}-${playerA?res.pen[1]:res.pen[0]}` : "";
  watchMatch(meInfo, opp, l1s, l1o, l1ev, {label:"Aller · "+comp.nom}, ()=>{
    watchMatch(meInfo, opp, l2s, l2o, l2ev,
      {label:"Retour", endText:`Cumul ${aggS}-${aggO}${ptxt} · ${won?"✅ Qualifié":"❌ Éliminé"}`}, finish);
  });
}

/* Overlay animé d'un match (équipe du joueur à gauche). opts.label = manche,
   opts.agg = cumul (affiche le verdict de qualification au retour).          */
function animateMatch(me, opp, selfScore, oppScore, pen, playerA, evs, opts, onDone){
  opts = opts || {};
  const overlay = el("div","overlay");
  const box = el("div","match-live card");
  box.innerHTML = `<div class="live-head">
      <div class="lh-team">${clubCrest(me,34)} ${me.nom}</div>
      <div class="live-score" id="cScore">0 - 0</div>
      <div class="lh-team">${opp.nom} ${clubCrest({nom:opp.nom,couleurs:opp.couleurs},34)}</div>
    </div>
    ${opts.label?`<div class="leg-label">${opts.label}</div>`:''}
    <div class="live-min" id="cMin">Coup d'envoi…</div>
    <div class="live-feed" id="cFeed"></div>`;
  overlay.appendChild(box);
  const skip = el("button","btn ghost","⏭ Passer");
  box.appendChild(skip);
  document.body.appendChild(overlay);

  const feed = box.querySelector("#cFeed"), scoreEl = box.querySelector("#cScore"), minEl = box.querySelector("#cMin");
  const ordered = evs.slice().sort((x,y)=>x.min-y.min);
  let s=0,o=0,idx=0,minute=0;
  function finish(){
    clearInterval(timer);
    s=selfScore; o=oppScore;
    scoreEl.textContent = `${s} - ${o}`;
    let txt = "Coup de sifflet final ⏱", verdict=null, cont="✔ Continuer";
    if (opts.label==="Aller"){
      txt = "Fin de l'aller — place au retour"; cont="▶ Jouer le retour";
    } else {
      const ag = opts.agg;
      if (ag){
        txt = `Cumul : ${ag.self}-${ag.opp}` + (ag.pen?` · tab ${ag.playerA?ag.pen[0]:ag.pen[1]}-${ag.playerA?ag.pen[1]:ag.pen[0]}`:"");
        const won = ag.self>ag.opp || (ag.self===ag.opp && ag.pen && ((ag.playerA?ag.pen[0]:ag.pen[1])>(ag.playerA?ag.pen[1]:ag.pen[0])));
        verdict = won;
      } else {
        if (pen){ txt = `Tirs au but : ${playerA?pen[0]:pen[1]}-${playerA?pen[1]:pen[0]}`; }
        verdict = selfScore>oppScore || (selfScore===oppScore && pen && ((playerA?pen[0]:pen[1])>(playerA?pen[1]:pen[0])));
      }
    }
    minEl.textContent = txt;
    if (verdict!==null) feed.innerHTML = `<div class="tie-verdict ${verdict?'win':'lose'}">${verdict?'✅ Qualifié !':'❌ Éliminé'}</div>` + feed.innerHTML;
    skip.textContent=cont; skip.className="btn primary";
    skip.onclick=()=>{ overlay.remove(); onDone(); };
  }
  skip.onclick = finish;
  const timer = setInterval(()=>{
    minute += 3;
    if (minute>90){ finish(); return; }
    minEl.textContent = `${minute}'`;
    while (idx<ordered.length && ordered[idx].min<=minute){
      const ev = ordered[idx++];
      if (ev.me) s++; else o++;
      scoreEl.textContent = `${s} - ${o}`;
      const line = el("div","feed-line "+(ev.me?"left":"right"),`<span class="fmin">${ev.min}'</span> ⚽ <b>${ev.joueur}</b>`);
      line.classList.add("flash"); feed.prepend(line);
    }
  }, 220);
}

/* ============= MODE INTERNATIONAL (Euro / Coupe du Monde) ============= */
let intlComp = null;

function startInternational(kind, nation){
  intlComp = FM.makeNationTournament(kind, nation);
  renderTournament();
}

function renderTournament(){
  const comp = intlComp;
  const app = $("#app"); app.innerHTML = "";
  const meN = comp.teams[comp.playerSeed];
  const meCrest = { nom:meN.nom, couleurs:meN.couleurs };

  const top = el("div","topbar");
  top.innerHTML = `<div class="club-id">${clubCrest(meCrest,46)}
      <div><b>${meN.nom}</b><small>${comp.emoji} ${comp.nom}</small></div></div>
    <div class="stats">
      <div><small>Tour</small><b>${comp.finished?'Terminé':FM.roundName(comp.alive.length)}</b></div>
      <div><small>Équipes</small><b>${comp.alive.length}</b></div>
      <div><small>Force</small><b>${meN.note}</b></div>
    </div>`;
  app.appendChild(top);

  const body = el("div","content"); app.appendChild(body);
  const card = el("div","card");
  card.appendChild(el("h3",null,`${comp.emoji} ${comp.nom}`));
  if (comp.finished){
    const won = comp.champion===comp.playerSeed;
    card.innerHTML += `<p class="euro-final ${won?'win':''}">${won?'🏆 CHAMPION ! '+meN.nom+' remporte le tournoi !':'Vainqueur : <b>'+comp.teams[comp.champion].nom+'</b>'}</p>`;
  } else if (comp.playerAlive){
    const tie = FM.playerTie(comp);
    const opp = comp.teams[tie[0]===comp.playerSeed?tie[1]:tie[0]];
    card.appendChild(el("p","round-name",FM.roundName(comp.alive.length)));
    const tb = el("div","tie-box");
    tb.innerHTML = `<div class="tie-side">${clubCrest(meCrest,52)}<b>${meN.nom}</b><small>${meN.note}</small></div>
      <div class="vs">VS</div>
      <div class="tie-side">${clubCrest({nom:opp.nom,couleurs:opp.couleurs},52)}<b>${opp.nom}</b><small>${opp.note}</small></div>`;
    card.appendChild(tb);
    const play = el("button","btn primary big","▶ Jouer le match"); play.onclick=()=>playIntlTie(); card.appendChild(play);
    const sim = el("button","btn ghost","⏩ Simuler ce tour"); sim.onclick=()=>{ FM.resolveTournamentRound(comp); renderTournament(); }; card.appendChild(sim);
  } else {
    card.appendChild(el("p","round-name",`${meN.nom} a été éliminé.`));
    const b = el("button","btn ghost","⏩ Simuler jusqu'à la fin"); b.onclick=()=>{ let g=0; while(!comp.finished&&g++<10) FM.resolveTournamentRound(comp); renderTournament(); }; card.appendChild(b);
  }
  body.appendChild(card);
  renderCupHistory(body, comp);

  const foot = el("div","footbar");
  const q = el("button","btn ghost small","⏻ Menu principal"); q.onclick=()=>renderStart();
  foot.appendChild(q); app.appendChild(foot);
}

function playIntlTie(){
  const comp = intlComp;
  const tie = FM.playerTie(comp); if(!tie){ renderTournament(); return; }
  const [a,b] = tie; const res = FM.simCupMatch(comp,a,b); const playerA=(a===comp.playerSeed);
  const meN = comp.teams[comp.playerSeed], oppN = comp.teams[playerA?b:a];
  const selfScore = playerA?res.as:res.es, oppScore = playerA?res.es:res.as;
  const evs = res.events.map(ev=>({min:ev.min, joueur:ev.joueur, home:(ev.side==="a")===playerA}));
  const won = selfScore>oppScore || (selfScore===oppScore && res.pen && ((playerA?res.pen[0]:res.pen[1])>(playerA?res.pen[1]:res.pen[0])));
  const ptxt = res.pen ? ` (tab ${playerA?res.pen[0]:res.pen[1]}-${playerA?res.pen[1]:res.pen[0]})` : "";
  watchMatch({nom:meN.nom,couleurs:meN.couleurs}, {nom:oppN.nom,couleurs:oppN.couleurs},
    selfScore, oppScore, evs, {label:comp.nom, endText:(won?"✅ Qualifié":"❌ Éliminé")+ptxt},
    ()=>{ FM.resolveTournamentRound(comp,res); renderTournament(); });
}

/* ============= MERCATO ============= */
let marketFilter = { poste:"", noteMin:0, ageMax:40, q:"" };
function renderMarket(body){
  const my = FM.myClub();
  const head = el("div","card");
  head.innerHTML = `<h3>💱 Mercato — Budget : <span class="${my.budget<0?'neg':'pos'}">${money(my.budget)}</span></h3>`;

  const filters = el("div","market-filters");
  const q = el("input"); q.type="text"; q.placeholder="Rechercher un joueur…"; q.value=marketFilter.q;
  q.oninput=()=>{ marketFilter.q=q.value; refreshMarket(listBox); };
  filters.appendChild(q);

  const posSel = el("select");
  posSel.appendChild(new Option("Tous postes",""));
  [["G","Gardiens"],["D","Défenseurs"],["M","Milieux"],["A","Attaquants"]].forEach(([v,l])=>posSel.appendChild(new Option(l,v)));
  posSel.value=marketFilter.poste;
  posSel.onchange=()=>{ marketFilter.poste=posSel.value; refreshMarket(listBox); };
  filters.appendChild(posSel);

  const noteSel = el("select");
  [0,60,70,75,80,85].forEach(n=> noteSel.appendChild(new Option(n?`Note ≥ ${n}`:"Toute note", n)));
  noteSel.value=marketFilter.noteMin;
  noteSel.onchange=()=>{ marketFilter.noteMin=parseInt(noteSel.value,10); refreshMarket(listBox); };
  filters.appendChild(noteSel);

  const ageSel = el("select");
  [40,21,23,25,28,32].forEach(a=> ageSel.appendChild(new Option(a===40?"Tout âge":`≤ ${a} ans`, a)));
  ageSel.value=marketFilter.ageMax;
  ageSel.onchange=()=>{ marketFilter.ageMax=parseInt(ageSel.value,10); refreshMarket(listBox); };
  filters.appendChild(ageSel);

  head.appendChild(filters);
  body.appendChild(head);

  const listBox = el("div","card"); listBox.id="marketList";
  body.appendChild(listBox);
  refreshMarket(listBox);
}
function refreshMarket(container){
  container.innerHTML="";
  const my = FM.myClub();
  const list = FM.transferMarket({
    poste: marketFilter.poste, noteMin: marketFilter.noteMin,
    ageMax: marketFilter.ageMax===40?null:marketFilter.ageMax,
    q: marketFilter.q, limit:80
  });
  const table = el("table","squad-table");
  table.innerHTML = `<thead><tr><th>Poste</th><th>Nom</th><th>Club</th><th>Âge</th><th>Note</th><th>Valeur</th><th>Statut</th><th></th></tr></thead>`;
  const tb = el("tbody");
  list.forEach(p=>{
    const tr = el("tr", p.dispo?"listed":"");
    tr.innerHTML = `<td><span class="pos-badge ${p.groupe}">${p.pos}</span></td>
      <td>${p.nom} ${FLAG[p.nat]||''}</td><td>${p.clubNom}</td><td>${p.age}</td>
      <td><b class="note ${noteClass(p.note)}">${p.note}</b></td>
      <td>${p.valeur.toFixed(1)} M€</td>
      <td>${p.dispo?'<span class="tag">Transférable</span>':'—'}</td><td></td>`;
    const btn = el("button","btn tiny primary","Offre");
    btn.onclick=()=> openBid(p);
    tr.lastChild.appendChild(btn);
    tb.appendChild(tr);
  });
  table.appendChild(tb);
  const scroll = el("div","table-scroll"); scroll.appendChild(table);
  container.appendChild(scroll);
  if(!list.length) container.appendChild(el("p","hint","Aucun joueur ne correspond aux filtres."));
}
function openBid(p){
  const my = FM.myClub();
  const overlay = el("div","overlay");
  const box = el("div","card picker");
  const suggested = Math.round(p.valeur*(p.dispo?1.0:1.2)*10)/10;
  box.innerHTML = `<h3>Offre pour ${p.nom}</h3>
    <p><span class="pos-badge ${p.groupe}">${p.pos}</span> ${FM.POS_LABEL[p.pos]} · ${p.clubNom} · ${p.age} ans · Note <b>${p.note}</b></p>
    <p>Valeur estimée : <b>${p.valeur.toFixed(1)} M€</b> · Votre budget : <b>${my.budget.toFixed(1)} M€</b></p>`;
  const inp = el("input"); inp.type="number"; inp.step="0.5"; inp.min="0"; inp.value=suggested;
  box.appendChild(el("label",null,"Montant de l'offre (M€)"));
  box.appendChild(inp);
  const msg = el("p","bid-msg","");
  const send = el("button","btn primary","💰 Soumettre l'offre");
  send.onclick=()=>{
    const r = FM.buyPlayer(p.id, parseFloat(inp.value));
    msg.textContent = r.msg; msg.className = "bid-msg "+(r.ok?"ok":"ko");
    if (r.ok){ setTimeout(()=>{ overlay.remove(); renderGame(); },900); }
  };
  box.appendChild(send);
  box.appendChild(msg);
  const close = el("button","btn ghost","Annuler");
  close.onclick=()=> overlay.remove();
  box.appendChild(close);
  overlay.appendChild(box);
  overlay.onclick=e=>{ if(e.target===overlay) overlay.remove(); };
  document.body.appendChild(overlay);
}

/* ============= CLASSEMENT ============= */
function renderTable(body){
  const card = el("div","card");
  card.appendChild(el("h3",null,`🏆 ${FM.myClub().ligueNom} — Saison ${FM.state.saison}`));
  const t = FM.table();
  const table = el("table","rank-table");
  table.innerHTML = `<thead><tr><th>#</th><th>Club</th><th>J</th><th>G</th><th>N</th><th>P</th><th>BP</th><th>BC</th><th>Diff</th><th>Pts</th></tr></thead>`;
  const tb = el("tbody");
  t.forEach((c,i)=>{
    const tr = el("tr", c.id===FM.state.managedClubId?"me":"");
    let zone=""; const total=t.length;
    if (i<3) zone="ucl"; else if (i<6) zone="uel"; else if (i>=total-3) zone="rel";
    if (zone) tr.classList.add(zone);
    tr.innerHTML = `<td>${i+1}</td><td class="club-cell">${clubCrest(c,22)}<span>${c.nom}</span></td>
      <td>${c.j}</td><td>${c.g}</td><td>${c.n}</td><td>${c.p}</td>
      <td>${c.bp}</td><td>${c.bc}</td><td>${c.bp-c.bc>0?'+':''}${c.bp-c.bc}</td><td><b>${c.pts}</b></td>`;
    tb.appendChild(tr);
  });
  table.appendChild(tb);
  const scroll = el("div","table-scroll"); scroll.appendChild(table);
  card.appendChild(scroll);
  card.appendChild(el("p","legend","🟩 Ligue des Champions (1-3) · 🟦 Europa (4-6) · 🟥 Relégation (3 derniers)"));
  body.appendChild(card);

  // Classements individuels : buteurs, passeurs, notes
  const lb = FM.leaderboards(FM.state.ligueJoueur, 5);
  const boards = el("div","boards");
  function board(title, items, fmt){
    if (!items.length) return;
    const sc = el("div","card board");
    sc.appendChild(el("h3",null,title));
    const ol = el("ol","scorers");
    items.slice(0,10).forEach(p=> ol.appendChild(el("li",null,fmt(p))));
    sc.appendChild(ol);
    boards.appendChild(sc);
  }
  board("👟 Meilleurs buteurs", lb.buteurs, p=>`<b>${p.buts}</b> — ${p.nom} <small>(${p.clubNom})</small>`);
  board("🅰️ Meilleurs passeurs", lb.passeurs, p=>`<b>${p.passes||0}</b> — ${p.nom} <small>(${p.clubNom})</small>`);
  board("🌟 Meilleures notes", lb.notes, p=>`<b>${FM.playerAvgNote(p).toFixed(2)}</b> — ${p.nom} <small>(${p.clubNom}, ${p.noteMatchs} m)</small>`);
  body.appendChild(boards);
}

/* ============= CALENDRIER ============= */
function renderCalendar(body){
  const my = FM.myClub();
  const card = el("div","card");
  card.appendChild(el("h3",null,"📅 Calendrier & résultats"));
  const list = el("div","fixtures");
  FM.state.calendrier.forEach((jd, i)=>{
    const m = jd.find(x=>x.dom===my.id||x.ext===my.id);
    if (!m) return;
    const dom = FM.clubById(m.dom), ext = FM.clubById(m.ext);
    const res = FM.state.resultats[i];
    let scoreTxt = "—", cls="upcoming";
    if (res){
      const r = res.find(x=>x.dom===m.dom&&x.ext===m.ext);
      if (r){
        scoreTxt = `${r.ds} - ${r.es}`;
        const won = (r.dom===my.id&&r.ds>r.es)||(r.ext===my.id&&r.es>r.ds);
        const draw = r.ds===r.es;
        cls = won?"won":(draw?"draw":"lost");
      }
    } else if (i===FM.state.journee){ cls="next"; }
    const row = el("div","fixture "+cls);
    row.innerHTML = `<span class="jd">J${i+1}</span>
      <span class="ft-dom ${m.dom===my.id?'me':''}">${dom.nom}</span>
      <span class="ft-score">${scoreTxt}</span>
      <span class="ft-ext ${m.ext===my.id?'me':''}">${ext.nom}</span>`;
    list.appendChild(row);
  });
  card.appendChild(list);
  body.appendChild(card);
}

/* ============= ACTUS ============= */
function renderNews(body){
  const card = el("div","card");
  card.appendChild(el("h3",null,"📰 Journal du club"));
  if (!FM.state.news.length) card.appendChild(el("p","hint","Rien à signaler pour l'instant."));
  FM.state.news.forEach(n=> card.appendChild(el("p","news-item",`<small>S${n.saison} J${n.j}</small> ${n.txt}`)));
  body.appendChild(card);

  // Historique
  if (FM.state.historique.length){
    const h = el("div","card");
    h.appendChild(el("h3",null,"📚 Palmarès / historique"));
    FM.state.historique.forEach(s=> h.appendChild(el("p","news-item",
      `Saison ${s.saison} — ${FM.myClub().nom} : ${s.classement}${ord(s.classement)} · Champion : ${s.champion}`)));
    body.appendChild(h);
  }
}

/* ============= HELPERS UI ============= */
function noteClass(n){ return n>=82?"elite":n>=75?"good":n>=68?"ok":"low"; }
function formeIcon(f){ return f>=2?"🔥":f===1?"↗":f===0?"→":f===-1?"↘":"❄"; }
function moralBar(m){ const w=Math.round(m); return `<span class="moral"><span style="width:${w}%"></span></span>`; }
function shortName(n){ const parts=n.split(" "); return parts.length>1?parts[0][0]+". "+parts.slice(1).join(" "):n; }
function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
function toast(msg){
  const t = el("div","toast",msg);
  document.body.appendChild(t);
  setTimeout(()=>t.classList.add("show"),10);
  setTimeout(()=>{ t.classList.remove("show"); setTimeout(()=>t.remove(),300); },2200);
}

/* ============= INIT ============= */
window.addEventListener("DOMContentLoaded", ()=>{
  if (FM.hasSave() && FM.load()) { renderGame(); }
  else renderStart();
});
