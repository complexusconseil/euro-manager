/* ============================================================
   INTERFACE — rendu des écrans & interactions
   ============================================================ */
var FM = window.FM;
var $ = sel => document.querySelector(sel);
const _t = s => FM.t(s);

/* Icônes SVG (trait) — remplacent les émojis dans l'interface */
const SVG = {
  home:'<path d="M3 10.5 12 3l9 7.5M5.5 9.5V20h13V9.5"/>',
  squad:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><path d="M16 5.5a3 3 0 0 1 0 5.6M17.5 20c0-2.4-.9-4-2.2-5"/>',
  tactics:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 12h18M12 4v16"/><circle cx="12" cy="12" r="2.6"/>',
  market:'<path d="M3 7h13l-1.2 7.5H5.4L3 4H1.5"/><circle cx="7" cy="19" r="1.6"/><circle cx="14" cy="19" r="1.6"/><path d="M18 4v6M21 7h-6"/>',
  europe:'<path d="M8 4h8v3a4 4 0 0 1-8 0z"/><path d="M8 5H5v2a3 3 0 0 0 3 3M16 5h3v2a3 3 0 0 1-3 3"/><path d="M12 11v5M9 20h6M10 16h4"/>',
  cup:'<circle cx="12" cy="9" r="5.5"/><path d="M8.5 13.5 7 21l5-2.5 5 2.5-1.5-7.5"/>',
  table:'<path d="M4 20V9M10 20V4M16 20v-7M22 20H2"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  news:'<path d="M4 5h13v14a2 2 0 0 0 2 2H5a1 1 0 0 1-1-1z"/><path d="M17 9h3v10a2 2 0 0 1-2 2"/><path d="M7 9h7M7 13h7M7 17h4"/>',
  career:'<path d="M4 8h16v12H4z"/><path d="M9 8V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V8M4 13h16"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 3 2.6 15 0 18M12 3c-2.6 3-2.6 15 0 18"/>',
  ball:'<circle cx="12" cy="12" r="9"/><path d="m12 7.5 3.5 2.6-1.3 4.1h-4.4L8.5 10.1z"/><path d="M12 3v4.5M4.2 9.6l4.3.5M19.8 9.6l-4.3.5M7.2 20l2.6-3.8M16.8 20l-2.6-3.8"/>',
  whistle:'<circle cx="8" cy="13" r="5"/><path d="M13 11h8v-3M13 13h6"/>',
  play:'<path d="M7 4.5 19 12 7 19.5z"/>',
  pause:'<path d="M8 4v16M16 4v16"/>',
  hospital:'<path d="M12 6v12M6 12h12"/><circle cx="12" cy="12" r="9"/>',
  pin:'<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  target:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
  card:'<rect x="6" y="3" width="12" height="18" rx="1.5"/>',
  swap:'<path d="M4 8h13l-3-3M20 16H7l3 3"/>',
  coin:'<ellipse cx="12" cy="7" rx="8" ry="3.2"/><path d="M4 7v10c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2V7"/><path d="M4 12c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2"/>',
  check:'<path d="m4 12.5 5.5 5.5L20 6"/>',
  cross:'<path d="M6 6l12 12M18 6 6 18"/>',
  plane:'<path d="M3 13.5 21 5l-4.5 15-4-5.5-5.5-1z"/>',
  stadium:'<ellipse cx="12" cy="9" rx="9" ry="4"/><path d="M3 9v6c0 2.2 4 4 9 4s9-1.8 9-4V9"/>',
  medal:'<circle cx="12" cy="15" r="5.2"/><path d="M8.5 10.2 6 3h12l-2.5 7.2"/>',
  forward:'<path d="M4 5.5 12 12l-8 6.5zM13 5.5 21 12l-8 6.5z"/>',
  skip:'<path d="M5 5.5 15 12 5 18.5zM18 5v14"/>',
  music:'<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.6"/><circle cx="17.5" cy="16" r="2.6"/>',
  vol:'<path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z"/><path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/>',
  mute:'<path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z"/><path d="m16 9.5 5 5M21 9.5l-5 5"/>',
  prev:'<path d="M19 5.5 9 12l10 6.5zM6 5v14"/>',
  upload:'<path d="M12 17V4m0 0L7.5 8.5M12 4l4.5 4.5"/><path d="M4 15v3.5a1.5 1.5 0 0 0 1.5 1.5h13a1.5 1.5 0 0 0 1.5-1.5V15"/>',
  gloves:'<path d="M7 21V9a2 2 0 0 1 4 0V4.5a1.8 1.8 0 0 1 3.6 0V10l2-1.5a1.7 1.7 0 0 1 2.4 2.3L17 15v6z"/>',
  shield:'<path d="M12 3 4.5 6v6c0 4.6 3.2 8 7.5 9 4.3-1 7.5-4.4 7.5-9V6z"/>',
  gear:'<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v2.6M12 18.6v2.6M21.2 12h-2.6M5.4 12H2.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8M18.5 18.5l-1.8-1.8M7.3 7.3 5.5 5.5"/>',
  alert:'<path d="M12 3.5 21.5 20h-19z"/><path d="M12 9.5v5M12 17.2v.1"/>'
};
function icon(name, cls){
  return `<svg class="${cls||''}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SVG[name]||''}</svg>`;
}
/* pastilles typographiques (remplacent les anciens emoji d'état) */
const chip = (cls, txt) => `<span class="chip ${cls}">${txt}</span>`;
const outChip = p => p.blessure>0 ? chip("inj",_t("BLES.")) : chip("sus",_t("SUSP."));
/* fil d'actualités : marqueur de catégorie au lieu d'un emoji */
const NEWS_LBL = {
  title:"Titre", cup:"Coupe", injury:"Blessure", card:"Discipline", transfer:"Transfert",
  loan:"Prêt", money:"Finances", intl:"International", season:"Saison", up:"Progression",
  down:"Baisse", award:"Distinction", match:"Match", info:"Club"
};
function newsItem(n, withDate){
  const k = n.kind || "info";
  const tag = `<span class="nk">${_t(NEWS_LBL[k]||NEWS_LBL.info)}</span>`;
  const date = withDate ? `<small>S${n.saison} J${n.j}</small>` : "";
  return el("p","news-item k-"+k, date+tag+n.txt);
}
const compMark = c => (c && c.nat && FM.flag) ? FM.flag(c.nat) : icon((c&&c.ic)||"cup");
const qualChip = ok => ok ? chip("ok",_t("Qualifié")) : chip("ko",_t("Éliminé"));
const el = (tag, cls, html) => { const e=document.createElement(tag); if(cls)e.className=cls; if(html!=null)e.innerHTML=html; return e; };
const money = m => (m>=0? "" : "-") + Math.abs(m).toFixed(1) + " M€";
/* Drapeaux : SVG vectoriels (js/flags.js) — plus aucun emoji */
const FLAG = nat => nat ? FM.flag(nat) : "";

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

let startKeyHandler = null;
function renderStart(){
  const app = $("#app");
  app.innerHTML = "";
  const wrap = el("div","start pes-menu");

  /* --- bandeau supérieur : marque à gauche, langue à droite --- */
  const top = el("div","menu-top");
  const brand = el("div","brand");
  brand.innerHTML = `<div class="brand-mark">${icon("ball")}</div>
    <h1 class="logo">EURO <em>MANAGER</em></h1>`;
  top.appendChild(brand);
  const langRow = el("div","lang-row");
  [["fr","Français"],["en","English"]].forEach(([code,lbl])=>{
    const b=el("button","lang-btn"+(FM.lang()===code?" on":""),lbl);
    b.onclick=()=>{ FM.setLang(code); renderStart(); };
    langRow.appendChild(b);
  });
  top.appendChild(langRow);
  wrap.appendChild(top);
  wrap.appendChild(el("div","logo-rule"));

  /* --- sauvegarde présente mais inexploitable : on le dit, on ne plante pas --- */
  if (FM.hasSave() && FM.loadError && FM.loadError!=="absente"){
    const w = el("div","save-alert");
    w.innerHTML = `<span class="sa-txt"><b>${_t("Sauvegarde illisible")}</b> `
      + _t("La partie enregistrée est incomplète ou abîmée") + ` (${FM.loadError}).</span>`;
    const imp = el("button","btn small", icon("upload")+_t("Importer une partie"));
    imp.onclick = ()=> importSaveFile(()=>{ currentTab="accueil"; renderGame(); });
    const del = el("button","btn small danger-ghost", _t("Supprimer la sauvegarde"));
    del.onclick = ()=>{ FM.deleteSave(); FM.loadError=null; renderStart(); };
    w.appendChild(imp); w.appendChild(del);
    wrap.appendChild(w);
  }

  /* --- corps : colonne des modes | panneau du mode choisi --- */
  const bodyRow = el("div","menu-body");
  const side = el("div","menu-side");
  side.appendChild(el("div","menu-side-title",_t("Mode de jeu")));

  const MODES = [
    ["career","career",_t("Carrière"),_t("Un vrai club, saison après saison.")],
    ["master","cup","Master League",_t("Créez votre club et bâtissez une équipe.")],
    ["intl","globe",_t("International"),_t("Euro ou Coupe du Monde, à élimination directe.")]
  ];
  const modeSwitch = el("div","mode-switch");
  MODES.forEach(([m,ic,lbl,desc])=>{
    const b = el("button","mode-btn"+(startMode===m?" active":""),
      icon(ic)+`<span class="mb-txt"><b>${lbl}</b><small>${desc}</small></span>`
      +`<span class="mb-arrow">${icon("play")}</span>`);
    b.onclick=()=>{ if(FM.audio) FM.audio.sfx("tick"); startMode=m; renderStart(); };
    modeSwitch.appendChild(b);
  });
  side.appendChild(modeSwitch);
  side.appendChild(el("p","tagline",_t("Gérez un club européen — du mercato au terrain.")));
  bodyRow.appendChild(side);

  const card = el("div","card start-card");
  const curMode = MODES.find(m=>m[0]===startMode) || MODES[0];
  card.appendChild(el("h3",null,icon(curMode[1])+curMode[2]));
  card.appendChild(el("label",null,_t("Nom du manager")));
  const nameIn = el("input"); nameIn.type="text"; nameIn.value="Manager"; nameIn.id="mgrName";
  card.appendChild(nameIn);

  let ligueSel = null;
  if (startMode !== "intl"){
    card.appendChild(el("label",null,_t("Choisissez un championnat")));
    ligueSel = el("select"); ligueSel.id="ligueSel";
    FM.LEAGUES.forEach(l=> ligueSel.appendChild(new Option(`${l.nom}`, l.id)));
    card.appendChild(ligueSel);
  }

  if (startMode === "career"){
    /* ---- MODE CARRIÈRE : choisir un vrai club ---- */
    card.appendChild(el("label",null,_t("Choisissez votre club")));
    const clubSel = el("select"); clubSel.id="clubSel";
    card.appendChild(clubSel);
    const fillClubs = ()=>{
      clubSel.innerHTML="";
      const lg = FM.LEAGUES.find(l=>l.id===ligueSel.value);
      lg.clubs.forEach((c,i)=> clubSel.appendChild(new Option(`${c[0]}  ${"★".repeat(c[1])}`, i)));
    };
    ligueSel.onchange = fillClubs; fillClubs();

    const btn = el("button","btn primary big",icon("play")+_t("Démarrer la carrière"));
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
    card.appendChild(el("label",null,_t("Nom de votre club")));
    const clubName = el("input"); clubName.type="text"; clubName.value="FC Master"; clubName.id="mlName";
    card.appendChild(clubName);

    card.appendChild(el("label",null,_t("Couleurs du maillot (écusson)")));
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

    const info = el("p","ml-info","Vous démarrez dans le <b>championnat de votre choix</b> (sélectionné ci-dessus), à la place de son club le plus faible, avec un effectif « maison » aux <b>noms iconiques (Castolo, Espimas, Minanda…)</b> et un petit budget. Piochez parmi les <b>agents libres</b> ou achetez à d'autres clubs, puis bâtissez une grande équipe au fil des saisons — comme la Ligue des Masters d'antan.");
    card.appendChild(info);

    const btn = el("button","btn primary big",icon("cup")+_t("Lancer la Master League"));
    btn.onclick = ()=>{
      FM.newMasterLeague(nameIn.value.trim()||"Manager", clubName.value.trim()||"FC Master",
        ligueSel.value, 20260810, KITS[kitChoice]);
      currentTab="accueil"; renderGame();
    };
    card.appendChild(btn);

  } else {
    /* ---- MODE INTERNATIONAL : Euro / Coupe du Monde ---- */
    card.appendChild(el("label",null,_t("Compétition")));
    const compSel = el("select");
    compSel.appendChild(new Option(_t("Championnat d'Europe (16 nations)"),"EURO"));
    compSel.appendChild(new Option(_t("Coupe du Monde (32 nations)"),"WC"));
    card.appendChild(compSel);

    card.appendChild(el("label",null,_t("Choisissez votre sélection")));
    const natSel = el("select");
    card.appendChild(natSel);
    const fillNations = ()=>{
      natSel.innerHTML="";
      const list = compSel.value==="EURO" ? FM.nationsForEuro() : FM.nationsList();
      list.slice().sort((a,b)=>a.localeCompare(b)).forEach(n=> natSel.appendChild(new Option(n,n)));
      natSel.value = compSel.value==="EURO" ? "France" : "Brésil";
    };
    compSel.onchange = fillNations; fillNations();

    const info = el("p","ml-info","Disputez le tournoi à élimination directe avec la sélection de votre choix. La force de chaque nation est réaliste ; les effectifs sont représentatifs (générés).");
    card.appendChild(info);

    const btn = el("button","btn primary big",icon("globe")+_t("Lancer le tournoi"));
    btn.onclick = ()=>{ FM.setSeed(20260810 + Math.floor(natSel.selectedIndex*7 + compSel.selectedIndex*13)); startInternational(compSel.value, natSel.value); };
    card.appendChild(btn);
  }

  if (FM.hasSave() && startMode!=="intl"){
    const cont = el("button","btn ghost",icon("play")+_t("Reprendre la partie sauvegardée"));
    cont.onclick = ()=>{ if(FM.load()){ currentTab="accueil"; renderGame(); } };
    card.appendChild(cont);
    const del = el("button","btn danger-ghost",_t("Supprimer la sauvegarde"));
    del.onclick = ()=>{ if(confirm(_t("Supprimer la sauvegarde ?"))){ FM.deleteSave(); renderStart(); } };
    card.appendChild(del);
  }
  const imp = el("button","btn ghost",icon("upload")+_t("Importer une partie"));
  imp.onclick = ()=> importSaveFile(()=>{ currentTab="accueil"; renderGame(); });
  card.appendChild(imp);
  bodyRow.appendChild(card);
  wrap.appendChild(bodyRow);

  /* --- bandeau contextuel : décrit le mode survolé, comme en bas d'écran du jeu --- */
  const ctxBar = el("div","menu-ctx");
  ctxBar.innerHTML = `<span class="ctx-txt">${curMode[3]}</span>`
    + `<span class="ctx-keys"><b>&#8593; &#8595;</b> ${_t("naviguer")}`
    + ` &nbsp;·&nbsp; <b>${_t("Entrée")}</b> ${_t("valider")}</span>`;
  wrap.appendChild(ctxBar);

  /* --- pied : bande son + rappel de sauvegarde --- */
  const foot = el("div","menu-foot");
  foot.appendChild(audioBar());
  foot.appendChild(el("p","hint",_t("Partie sauvegardée automatiquement dans votre navigateur.")));
  wrap.appendChild(foot);
  app.appendChild(wrap);

  /* navigation au clavier : haut/bas avec bouclage, Entrée valide */
  if (startKeyHandler) document.removeEventListener("keydown", startKeyHandler);
  startKeyHandler = (e)=>{
    if (/^(input|select|textarea)$/i.test((e.target&&e.target.tagName)||"")) return;
    if (e.key==="ArrowDown" || e.key==="ArrowUp"){
      e.preventDefault();
      const i = MODES.findIndex(m=>m[0]===startMode);
      const n = MODES.length;
      startMode = MODES[(i + (e.key==="ArrowDown"?1:-1) + n) % n][0];   // bouclage
      if (FM.audio) FM.audio.sfx("tick");
      renderStart();
    } else if (e.key==="Enter"){
      const go = document.querySelector(".start-card .btn.primary.big");
      if (go){ e.preventDefault(); if(FM.audio) FM.audio.sfx("ok"); go.click(); }
    }
  };
  document.addEventListener("keydown", startKeyHandler);
}

/* ============= COQUE DU JEU ============= */
function renderGame(){
  if (startKeyHandler){ document.removeEventListener("keydown", startKeyHandler); startKeyHandler = null; }
  const app = $("#app");
  app.innerHTML = "";
  const my = FM.myClub();

  // Barre supérieure
  const top = el("div","topbar");
  top.style.setProperty("--kit",(my.couleurs&&my.couleurs[0])||"#1f9d4d");
  top.innerHTML = `
    <div class="club-id">
      ${clubCrest(my,48)}
      <div><span class="cname">${my.nom}${FM.state.mode==="master"?' <span class="ml-badge">Master League</span>':''}</span>
      <small>${my.ligueNom} · ${FM.state.managerName}</small></div>
    </div>
    <div class="stats">
      <div><small>${_t("Saison")}</small><b>${FM.state.saison}</b></div>
      <div><small>${_t("Journée")}</small><b>${Math.min(FM.state.journee+1,FM.totalMatchdays())}/${FM.totalMatchdays()}</b></div>
      <div><small>${_t("Classement")}</small><b>${FM.myRank()}${ord(FM.myRank())}</b></div>
      <div><small>${_t("Budget")}</small><b class="${my.budget<0?'neg':'pos'}">${money(my.budget)}</b></div>
      <div><small>${_t("Note effectif")}</small><b>${FM.squadRating(my)}</b></div>
    </div>`;
  app.appendChild(top);

  // Onglets
  const tabs = el("div","tabs");
  const T = [["accueil","home",_t("Accueil")],["effectif","squad",_t("Effectif")],["tactique","tactics",_t("Tactique")],
             ["mercato","market",_t("Mercato")],["europe","europe",_t("Europe")],["coupe","cup",_t("Coupe")],
             ["classement","table",_t("Classement")],["calendrier","calendar",_t("Calendrier")],["actus","news",_t("Actus")]];
  T.forEach(([k,ic,lbl])=>{
    const b = el("button","tab"+(currentTab===k?" active":""), icon(ic)+"<span>"+lbl+"</span>");
    b.onclick=()=>{ currentTab=k; renderGame(); };
    tabs.appendChild(b);
  });
  const alerte = saveAlert(); if (alerte) app.appendChild(alerte);
  app.appendChild(audioBar());
  app.appendChild(tabs);

  const body = el("div","content"); body.id="content";
  app.appendChild(body);

  switch(currentTab){
    case "accueil": renderHome(body); break;
    case "effectif": renderSquad(body); break;
    case "tactique": renderTactics(body); break;
    case "mercato": renderMarket(body); break;
    case "europe": renderEurope(body); break;
    case "coupe": renderDomesticCup(body); break;
    case "classement": renderTable(body); break;
    case "calendrier": renderCalendar(body); break;
    case "actus": renderNews(body); break;
  }

  // pied
  const foot = el("div","footbar");
  const quit = el("button","btn ghost small",_t("Menu principal"));
  quit.onclick = ()=>{ renderStart(); };
  foot.appendChild(quit);
  app.appendChild(foot);
}

function ord(n){ return n===1?"er":"e"; }

/* Agenda unifié : championnat + coupes, avec les tours en retard mis en avant */
function renderAgenda(body){
  const evs = FM.pendingEvents().filter(e=>e.kind!=="intl");   // l'intl a sa propre bannière
  const cups = evs.filter(e=>e.kind!=="league");
  if (!cups.length) return;                                    // rien d'autre que le championnat
  const card = el("div","card agenda-card");
  card.appendChild(el("h3",null,icon("pin")+_t("Rendez-vous à jouer")));
  cups.forEach(ev=>{
    const row = el("div","agenda-row"+(ev.enRetard?" late":""));
    row.innerHTML = `<span class="ag-emoji">${compMark(ev)}</span>
      <span class="ag-txt"><b>${ev.titre}</b><small>${ev.detail}</small></span>
      ${ev.enRetard?'<span class="ag-badge">'+_t("à jouer")+'</span>':''}`;
    const go = el("button","btn small primary",_t("Y aller"));
    go.onclick=()=>{ currentTab = (ev.kind==="coupe") ? "coupe" : "europe"; renderGame(); };
    row.appendChild(go);
    card.appendChild(row);
  });
  card.appendChild(el("p","hint",_t("Ces rencontres sont rattachées à votre calendrier : elles apparaissent ici et dans l'onglet Calendrier.")));
  body.appendChild(card);
}

/* ============= ACCUEIL ============= */
function renderSacked(body){
  const offres = FM.state.sackOffers || [];
  const card = el("div","card injury-card");
  card.appendChild(el("h3",null,icon("alert")+_t("Vous êtes remercié")));
  card.appendChild(el("p",null,
    _t("Les dirigeants ont mis fin à votre mission. Trois clubs sont prêts à vous confier leur banc.")));
  offres.forEach(o=>{
    const row = el("div","offer-row");
    row.innerHTML = `<span><b>${o.nom}</b> — ${o.ligue} · ${_t("Note effectif")} <b class="note ${noteClass(o.note)}">${o.note}</b>`
      + ` · ${_t("Budget")} ${money(o.budget)}</span>`;
    const b = el("button","btn primary small", icon("check")+_t("Prendre ce club"));
    b.onclick = ()=>{ FM.takeOverClub(o.id); currentTab="accueil"; renderGame(); };
    row.appendChild(b);
    card.appendChild(row);
  });
  const fin = el("button","btn danger-ghost",_t("Arrêter la carrière"));
  fin.onclick = ()=>{ if(confirm(_t("Supprimer la sauvegarde ?"))){ FM.deleteSave(); renderStart(); } };
  card.appendChild(fin);
  body.appendChild(card);
}

function renderHome(body){
  if (FM.state.sacked){ renderSacked(body); return; }
  const my = FM.myClub();

  // Agenda unifié : tous les rendez-vous (championnat + coupes) au même endroit
  renderAgenda(body);

  // Bannière : tournoi international de l'été (Coupe du Monde / Euro) à disputer
  const pi = FM.state.pendingIntl;
  if (pi && !pi.fait){
    const wc = pi.kind==="WC";
    const noms = wc ? FM.nationsList() : FM.nationsForEuro();
    const banner = el("div","card intl-banner");
    banner.innerHTML = `<h3>${icon("globe")}${wc?_t("Coupe du Monde"):_t("Championnat d'Europe")} — ${_t("cet été")}</h3>
      <p>${_t("Prenez en main une sélection nationale et disputez le tournoi (élimination directe), en parallèle de votre carrière.")}</p>`;
    const row = el("div","intl-pick");
    const sel = el("select");
    noms.forEach(n=> sel.appendChild(new Option(n, n)));
    sel.value = noms.includes(pi.defaultNation) ? pi.defaultNation : noms[0];
    row.appendChild(el("label",null,_t("Sélection")+" : "));
    row.appendChild(sel);
    banner.appendChild(row);
    const go = el("button","btn primary big",icon("globe")+_t("Disputer le tournoi"));
    go.onclick=()=> startCareerIntl(pi.kind, sel.value);
    banner.appendChild(go);
    const skip = el("button","btn ghost",_t("Passer (ne pas participer)"));
    skip.onclick=()=>{ FM.state.pendingIntl.fait=true; FM.save(); renderGame(); };
    banner.appendChild(skip);
    body.appendChild(banner);
  }

  if (FM.isSeasonOver()){
    const c = el("div","card center");
    const t = FM.table();
    const rank = FM.myRank();
    c.innerHTML = `<h2>${_t("Saison")} ${FM.state.saison} — ${_t("terminée")}</h2>
      <p>Champion : <b>${t[0].nom}</b></p>
      <p>${my.nom} termine <b>${rank}${ord(rank)}</b> avec ${my.pts} pts.</p>`;
    const b = el("button","btn primary big",_t("Saison suivante"));
    b.onclick=()=>{ FM.endSeason(); currentTab="accueil"; renderGame(); };
    c.appendChild(b);
    body.appendChild(c);
    return;
  }

  const indispo = FM.unavailableList(my);
  if (indispo.length){
    const w = el("div","card injury-card");
    w.innerHTML = `<h3>${icon("hospital")}${_t("Infirmerie & suspensions")} (${indispo.length})</h3>` +
      indispo.map(p=>`<div class="inj-row"><span class="pos-badge ${p.groupe}">${p.pos}</span> <b>${p.nom}</b> — ${outChip(p)} ${FM.unavailableReason(p)}</div>`).join("");
    const inXI = my.onze.map(s2=>FM.getPlayer(my,s2.id)).filter(p=>p && !FM.playerAvailable(p));
    if (inXI.length) w.innerHTML += `<p class="ht-alert">${inXI.length} indisponible(s) dans votre onze — corrigez la composition (onglet Tactique).</p>`;
    body.appendChild(w);
  }
  const fx = FM.nextFixture();
  const card = el("div","card match-card");
  if (fx){
    const dom = FM.clubById(fx.dom), ext = FM.clubById(fx.ext);
    const iAmHome = fx.dom===my.id;
    card.innerHTML = `
      <div class="match-header">${_t("Journée")} ${FM.state.journee+1} · ${FM.state.ligueJoueurNom||FM.myClub().ligueNom}</div>
      <div class="match-teams">
        <div class="side ${iAmHome?'me':''}">${clubCrest(dom,56)}<b>${dom.nom}</b><small>Note ${FM.squadRating(dom)}</small></div>
        <div class="vs">VS</div>
        <div class="side ${!iAmHome?'me':''}">${clubCrest(ext,56)}<b>${ext.nom}</b><small>Note ${FM.squadRating(ext)}</small></div>
      </div>
      <p class="match-loc">${iAmHome?icon("stadium")+_t("À domicile"):icon("plane")+_t("À l'extérieur")} · ${_t("Vous êtes")} ${iAmHome?dom.nom:ext.nom}</p>`;
  }
  const play = el("button","btn primary big",icon("play")+_t("Jouer le match"));
  play.onclick = ()=> playMatchFlow();
  card.appendChild(play);
  const sim = el("button","btn ghost",_t("Simuler rapidement"));
  sim.onclick = ()=>{
    /* Mêmes garde-fous que « Jouer le match » : sans eux on pouvait simuler
       toute une saison avec un onze incomplet, sans le moindre message. */
    const my = FM.myClub();
    if (my.onze.filter(s=>!s.id).length){
      toast(_t("Onze incomplet — complétez votre équipe (Tactique).")); currentTab="tactique"; renderGame(); return;
    }
    const bloc = FM.blockingEvents();
    if (bloc.length && confirm(`${bloc[0].titre} ${_t("est à jouer avant de poursuivre le championnat.")}\n\n${_t("OK = y aller · Annuler = jouer quand même le championnat")}`)){
      currentTab = (bloc[0].kind==="coupe") ? "coupe" : "europe"; renderGame(); return;
    }
    try { FM.playMatchday(); }
    catch(e){ toast(_t("La journée n'a pas pu être jouée. Vérifiez votre composition.")); }
    currentTab="accueil"; renderGame();
  };
  card.appendChild(sim);
  body.appendChild(card);

  // objectif + offres
  const info = el("div","card");
  const conf = FM.confiance ? FM.confiance() : 65;
  const cible = FM.state.objectifRang;
  info.innerHTML = `<h3>${icon("target")}${_t("Objectif de saison")}</h3>`
    + `<p>${cap(FM.state.objectif)} — ${_t("actuellement")} <b>${FM.myRank()}${ord(FM.myRank())}</b> / ${FM.clubsInMyLeague().length}`
    + (cible && cible < 90 ? ` · ${_t("attendu")} <b>${cible}${ord(cible)}</b>` : "") + `.</p>`
    + `<p class="conf-line"><span>${_t("Confiance des dirigeants")} : <b>${FM.confianceLabel()}</b></span>`
    + `<span class="conf-bar"><i style="width:${conf}%" class="${conf<25?'low':conf<50?'mid':''}"></i></span></p>`
    + ((FM.state.echecs||0) >= 1
        ? `<p class="ht-alert">${_t("Objectif manqué la saison passée : un second échec vous coûterait votre place.")}</p>` : "");
  body.appendChild(info);

  renderFinances(body);
  renderAcademy(body);

  if (FM.state.offres.length){
    const off = el("div","card");
    off.appendChild(el("h3",null,icon("market")+_t("Offres reçues")));
    FM.state.offres.forEach((o,i)=>{
      const row = el("div","offer-row");
      row.innerHTML = `<span><b>${o.clubNom}</b> offre <b>${o.montant.toFixed(1)} M€</b> pour ${o.joueurNom}</span>`;
      const ok = el("button","btn small primary",_t("Accepter"));
      ok.onclick=()=>{ const r=FM.acceptOffer(i); toast(r.msg); renderGame(); };
      const no = el("button","btn small ghost",_t("Refuser"));
      no.onclick=()=>{ FM.rejectOffer(i); renderGame(); };
      row.appendChild(ok); row.appendChild(no);
      off.appendChild(row);
    });
    body.appendChild(off);
  }

  // dernières actus
  const news = el("div","card");
  news.appendChild(el("h3",null,icon("news")+_t("Dernières actualités")));
  FM.state.news.slice(0,5).forEach(n=> news.appendChild(newsItem(n,false)));
  body.appendChild(news);
}

/* ============= VISUALISATION DES MATCHS (3D ou 2D) ============= */


/* Répartiteur : home/away = {nom,couleurs} ; events = [{min,joueur,home:bool}] */


/* Repli 2D animé */


/* ============= MATCH INTERACTIF (causerie → 1re MT → pause → 2e MT) =============
   Vos choix ont un effet RÉEL : la causerie modifie le moral, et les réglages
   + remplacements de la mi-temps sont pris en compte dans la 2e période.      */
function playMatchFlow(){
  const my = FM.myClub();
  if (my.onze.filter(s=>!s.id).length){ toast(_t("Onze incomplet — complétez votre équipe (Tactique).")); currentTab="tactique"; renderGame(); return; }
  // Un tour de coupe en retard ne doit pas passer à la trappe
  const bloc = FM.blockingEvents();
  if (bloc.length && !confirm(`${bloc[0].titre} est à jouer avant de poursuivre le championnat.\n\nOK = y aller · Annuler = jouer quand même le championnat`)){
    // l'utilisateur choisit de continuer le championnat
  } else if (bloc.length){
    currentTab = (bloc[0].kind==="coupe") ? "coupe" : "europe"; renderGame(); return;
  }
  const fx = FM.nextFixture();
  if (!fx){ renderGame(); return; }
  const dom = FM.clubById(fx.dom), ext = FM.clubById(fx.ext);
  runInteractiveMatch(dom, ext, {label:dom.ligueNom}, (total)=>{
    FM.playMatchday(total);                       // le reste de la journée se joue autour du nôtre
    currentTab="accueil"; renderGame();
  });
}

/* Déroulé complet d'un match joué par le manager */
let lastIncidents = [];
function playLiveMatch(cfg){
  const mg = cfg.manager;
  let minute=0, hs=0, as=0, ended=false, paused=false, speed=1, timer=null, halfDone=false;
  const goals=[];
  const overlay = el("div","overlay live-overlay");
  const box = el("div","live-screen"); overlay.appendChild(box);
  box.innerHTML = `
    <div class="ls-head">
      <div class="ls-team"><span class="ls-dot" style="background:${(cfg.home.couleurs||["#e33"])[0]}"></span><b>${cfg.home.nom}</b></div>
      <div class="ls-score"><b id="lsScore">0 - 0</b><small id="lsMin">${cfg.label||""} · 0'</small></div>
      <div class="ls-team right"><b>${cfg.away.nom}</b><span class="ls-dot" style="background:${(cfg.away.couleurs||["#38f"])[0]}"></span></div>
    </div>
    <canvas class="ls-pitch" id="lsPitch" width="640" height="330"></canvas>
    <div class="ls-ctrl">
      <button class="btn primary" id="lsPause">${_t("Pause")}</button>
      <button class="btn ghost" id="lsSpeed">1×</button>
      ${mg?('<button class="btn ghost" id="lsCoach">'+_t("Coaching")+'</button>'):''}
      <button class="btn ghost" id="lsSkip">${_t("Fin du match")}</button>
    </div>
    <div class="ls-feed" id="lsFeed"></div>`;
  document.body.appendChild(overlay);

  const $s=box.querySelector("#lsScore"), $m=box.querySelector("#lsMin"), $f=box.querySelector("#lsFeed");
  const $pause=box.querySelector("#lsPause"), $speed=box.querySelector("#lsSpeed"), $skip=box.querySelector("#lsSkip");
  const $coach=box.querySelector("#lsCoach");

  const MARK={goal:icon("ball"), yellow:chip("yel","J"), red:chip("sus","R"),
              injury:chip("inj",_t("BLES.")), info:""};
  function feed(txt, side, type){
    const l=el("div","ls-line "+(side===0?"h":side===1?"a":"n")+(type==="goal"?" goal":""),
      `<span class="ls-fmin">${minute}'</span> ${MARK[type]||""} <span>${txt}</span>`);
    $f.prepend(l); while($f.children.length>40) $f.removeChild($f.lastChild);
  }

  /* --- terrain animé : moteur de déplacement (js/pitchview.js) --- */
  const cv = box.querySelector("#lsPitch");
  const pv = FM.pitchView(cv, {
    homeColor:(cfg.home.couleurs||["#e33"])[0],
    awayColor:(cfg.away.couleurs||["#38f"])[0],
    homeRating: cfg.home.joueurs ? FM.squadRating(cfg.home) : (cfg.home.note||75),
    awayRating: cfg.away.joueurs ? FM.squadRating(cfg.away) : (cfg.away.note||75)
  });
  pv.start();

  /* --- horloge du match --- */
  function setPaused(v){
    paused=v;
    pv.setPaused(v);
    $pause.textContent = paused?_t("Reprendre"):_t("Pause");
    $pause.className = paused?"btn ghost":"btn primary";
    if (paused){ clearInterval(timer); timer=null; } else start();
  }
  function start(){
    clearInterval(timer);
    timer=setInterval(step, Math.max(90, 420/speed));
  }
  function step(){
    if (ended) return;
    minute++;
    $m.textContent=`${cfg.label?cfg.label+" · ":""}${minute}'`;
    if (minute%15===0 && cfg.fatigue) cfg.fatigue();
    const evs = cfg.tick(minute) || [];
    for (const ev of evs){
      if (ev.type==="goal"){
        if (ev.home) hs++; else as++;
        goals.push(ev); $s.textContent=`${hs} - ${as}`;
        pv.goal(ev.home?0:1);
        feed(`<b>BUT — ${ev.joueur}</b> (${ev.home?cfg.home.nom:cfg.away.nom})`, ev.home?0:1, "goal");
      } else {
        if (cfg.applyIncident) cfg.applyIncident(ev);
        const lbl = ev.type==="injury" ? `<b>${ev.joueur}</b> se blesse`
                  : ev.type==="red" ? `<b>${ev.joueur}</b> est expulsé`
                  : `<b>${ev.joueur}</b> — avertissement`;
        feed(lbl, ev.home?0:1, ev.type);
        if (mg && cfg.isMine && cfg.isMine(ev) && (ev.type==="injury"||ev.type==="red")){
          setPaused(true);
          feed(ev.type==="injury"?_t("Match en pause — pensez à remplacer votre blessé.")
                                 :_t("Match en pause — réorganisez votre équipe à 10."), -1, "info");
          if ($coach) $coach.classList.add("urgent");
        }
      }
    }
    if (minute===45 && !halfDone){ halfDone=true; feed("<b>"+_t("Mi-temps")+"</b>", -1, "info"); setPaused(true); }
    if (minute>=90) finish();
  }
  function finish(){
    if (ended) return; ended=true; clearInterval(timer); pv.stop();
    $s.textContent=`${hs} - ${as}`;
    const et = cfg.endText ? cfg.endText(hs,as) : "";
    $m.innerHTML = (et?et+" · ":"")+_t("Coup de sifflet final");
    feed(`<b>Fin du match — ${cfg.home.nom} ${hs}-${as} ${cfg.away.nom}</b>`, -1, "info");
    $pause.style.display="none"; $speed.style.display="none"; if($coach) $coach.style.display="none";
    $skip.textContent=_t("Continuer"); $skip.className="btn primary";
    $skip.onclick=()=>{ overlay.remove(); cfg.done(hs, as, goals); };
  }
  $pause.onclick=()=>setPaused(!paused);
  $speed.onclick=()=>{ speed = speed>=4?1:speed*2; $speed.textContent=speed+"×";
    pv.setTempo(1+(speed-1)*0.35); if(!paused) start(); };
  $skip.onclick=()=>{ while(minute<90 && !ended){ step(); } finish(); };
  /* La fermeture du panneau doit RELANCER le match : avec un callback vide,
     le chrono restait figé et le joueur croyait le jeu planté. */
  if ($coach) $coach.onclick=()=>{ setPaused(true); $coach.classList.remove("urgent"); openCoaching(mg, ()=>setPaused(false)); };

  if (mg) openTeamTalkPanel(mg, cfg, ()=>start()); else start();
}

/* Panneau de coaching : consignes, tactique et remplacements EN COURS DE MATCH */
function openCoaching(mg, onClose){
  const ov = el("div","overlay coach-overlay");
  const box = el("div","card coach-box"); ov.appendChild(box);
  function render(){
    box.innerHTML="";
    box.appendChild(el("h3",null,icon("whistle")+_t("Coaching")+" — "+mg.nom));
    box.appendChild(el("p","hint",mg.strength()));
    // Consignes rapides
    box.appendChild(el("h4",null,_t("Consignes")));
    const presets = el("div","coach-presets");
    [[_t("Fermer le jeu"),{mentalite:0,tempo:0,pressing:0}],
     [_t("Équilibrer"),{mentalite:1,tempo:1,pressing:1}],
     [_t("Tout attaquer"),{mentalite:2,tempo:2,pressing:2}]].forEach(([lbl,cfgP])=>{
      const b=el("button","btn ghost small",lbl);
      b.onclick=()=>{ Object.keys(cfgP).forEach(k=>mg.setTac(k,cfgP[k])); render(); };
      presets.appendChild(b);
    });
    box.appendChild(presets);
    // Curseurs
    const row = el("div","tac-row");
    row.appendChild(sliderTac("Mentalité",["Défensive","Équilibrée","Offensive"],mg.tac.mentalite,v=>{mg.setTac("mentalite",v); const n=box.querySelector(".coach-str"); if(n)n.textContent=mg.strength();}));
    row.appendChild(sliderTac("Tempo",["Lent","Normal","Rapide"],mg.tac.tempo,v=>mg.setTac("tempo",v)));
    row.appendChild(sliderTac("Pressing",["Bas","Moyen","Haut"],mg.tac.pressing,v=>{mg.setTac("pressing",v); const n=box.querySelector(".coach-str"); if(n)n.textContent=mg.strength();}));
    box.appendChild(row);
    const str=el("p","hint coach-str",mg.strength()); box.appendChild(str);
    // Remplacements
    box.appendChild(el("h4",null,`${_t("Remplacements")} (${3-mg.subsLeft()}/3)`));
    const bench = mg.bench();
    if (mg.subsLeft()>0 && bench.length){
      const wrap=el("div","ht-subs");
      mg.onField().forEach(p=>{
        const line=el("div","ht-sub-row"+(p.ko?" ko":""));
        line.innerHTML=`<span><span class="pos-badge ${FM.POS_GROUP[p.pos]||'M'}">${p.pos}</span> ${p.nom} <b class="note ${noteClass(p.note)}">${p.note}</b>${p.ko?' <span class="inc-badge">'+_t("BLES.")+'</span>':""}${p.tired>1.5?' <span class="inc-badge warn">'+_t("FATIGUÉ")+'</span>':""}</span>`;
        const sel=el("select"); sel.appendChild(new Option("— remplacer par —",""));
        bench.forEach(b2=> sel.appendChild(new Option(`${b2.pos} ${b2.nom} (${b2.note})`, b2.id)));
        sel.onchange=()=>{ if(!sel.value) return;
          if (mg.sub(p.id, parseInt(sel.value,10))) render(); };
        line.appendChild(sel); wrap.appendChild(line);
      });
      box.appendChild(wrap);
    } else box.appendChild(el("p","hint", mg.subsLeft()>0?"Aucun remplaçant disponible.":"Quota de remplacements atteint."));
    const go=el("button","btn primary big",icon("play")+_t("Reprendre le match"));
    go.onclick=()=>{ ov.remove(); onClose&&onClose(); };
    box.appendChild(go);
  }
  render();
  document.body.appendChild(ov);
}

/* Interfaces de coaching : club et sélection */
function clubManager(club){
  let left=3;
  return {
    /* `club` distingue une interface de CLUB d'une interface de SÉLECTION.
       Sans lui, la causerie prenait toujours la branche « sélection » : elle
       affichait « force undefined » et n'appelait jamais FM.teamTalk, donc
       le discours d'avant-match n'avait aucun effet sur le moral.          */
    club,
    nom: club.nom, tac: club.tactique,
    setTac:(k,v)=>FM.setTactic(k,v),
    onField:()=>club.onze.map(s=>{ const p=FM.getPlayer(club,s.id);
      return p?{id:p.id,nom:p.nom,pos:s.slot,note:p.note,tired:p._tired||0,ko:!FM.playerAvailable(p)}:null; }).filter(Boolean),
    bench:()=>club.joueurs.filter(p=>!club.onze.some(s=>s.id===p.id) && FM.playerAvailable(p))
              .sort((a,b)=>b.note-a.note).slice(0,14)
              .map(p=>({id:p.id,nom:p.nom,pos:p.pos,note:p.note})),
    sub:(o,i)=>{ if(left<=0) return false; if(FM.substitute(club,o,i)){ left--; return true; } return false; },
    subsLeft:()=>left,
    strength:()=>{ const st=FM.teamStrength(club); return `Attaque ${Math.round(st.att)} · Milieu ${Math.round(st.mid)} · Défense ${Math.round(st.def)}`; }
  };
}
function nationManager(team, tac){
  let left=3;
  return {
    nom: team.nom, tac,
    setTac:(k,v)=>{ tac[k]=v; },
    onField:()=>FM.nationOnField(team).map(p=>({id:p.id,nom:p.nom,pos:p.pos,note:p.note,tired:p._tired||0,ko:!!(p.blessure>0||p.suspension>0)})),
    bench:()=>(team.squad||[]).filter(p=>(team.starters||[]).indexOf(p.id)<0 && !(p.blessure>0) && !(p.suspension>0))
              .sort((a,b)=>b.note-a.note).map(p=>({id:p.id,nom:p.nom,pos:p.pos,note:p.note})),
    sub:(o,i)=>{ if(left<=0) return false; if(FM.substituteNation(team,o,i)){ left--; return true; } return false; },
    subsLeft:()=>left,
    strength:()=>`Force du onze ${Math.round(FM.nationXIRating(team))}`
  };
}

/* Fatigue de la pause (club : par joueur ; sélection : global) */


/* Causerie d'avant-match (clubs ET sélections) */
function openTeamTalkPanel(mg, cfg, next){
  const overlay = el("div","overlay");
  const box = el("div","card talk-box");
  let head;
  if (mg.club){
    const st = FM.teamStrength(mg.club);
    const xi = mg.club.onze.map(s=>FM.getPlayer(mg.club,s.id)).filter(Boolean);
    const moy = Math.round(xi.reduce((a,p)=>a+p.moral,0)/(xi.length||1));
    head = `<p>Face à <b>${cfg.oppName||"l'adversaire"}</b>. Attaque <b>${Math.round(st.att)}</b> · milieu <b>${Math.round(st.mid)}</b> · défense <b>${Math.round(st.def)}</b> · moral moyen <b>${moy}</b>.</p>`;
  } else {
    head = `<p>Face à <b>${cfg.oppName||"l'adversaire"}</b>. Sélection <b>${mg.nom}</b> — force <b>${mg.note}</b>.</p>`;
  }
  box.innerHTML = `<h3>${icon("whistle")}${_t("Causerie")} — ${cfg.label||""}</h3>`+head+
    `<p class="hint">${_t("Votre discours influe sur la performance de l'équipe.")}</p>`;
  [["calme",_t("Rassurer"),_t("Confiance en hausse — sans risque.")],
   ["exigeant",_t("Hausser le ton"),_t("Galvanise un groupe conquérant, crispe un groupe fragile.")],
   ["neutre",_t("Consignes neutres"),_t("Aucun effet.")]].forEach(([k,lbl,desc])=>{
    const b = el("button","btn ghost talk-opt",`<b>${lbl}</b><small>${desc}</small>`);
    b.onclick=()=>{ toast(applyTalk(mg,k)); overlay.remove(); next(); };
    box.appendChild(b);
  });
  overlay.appendChild(box); document.body.appendChild(overlay);
}
function applyTalk(mg, choice){
  if (mg.club) return FM.teamTalk(mg.club, choice).txt;
  if (choice==="calme"){ mg.tac.moral=(mg.tac.moral||0)+1.5; return "Vous rassurez le groupe : confiance en hausse."; }
  if (choice==="exigeant"){
    const up = mg.note>=78;
    mg.tac.moral=(mg.tac.moral||0)+(up?3:-2);
    return up ? "Le discours galvanise la sélection !" : "Le ton dur crispe la sélection…";
  }
  return "Consignes neutres, le groupe reste concentré.";
}

/* Écran de mi-temps (clubs : réglages + remplacements ; sélections : réglages) */


/* Match de championnat du club géré */
/* Contexte de match entre deux clubs pour l'écran live */
function clubMatchCfg(dom, ext, label, myClub){
  FM.clearMatchFlags(dom); FM.clearMatchFlags(ext);
  return {
    home:{nom:dom.nom,couleurs:dom.couleurs}, away:{nom:ext.nom,couleurs:ext.couleurs},
    /* Nom de l'adversaire : sans lui, la causerie disait « Face à
       l'adversaire » dans tous les matchs, quel que soit le mode. */
    oppName: myClub ? (dom.id===myClub.id ? ext.nom : dom.nom) : ext.nom,
    label, manager: myClub ? clubManager(myClub) : null,
    tick:(m)=>FM.liveTick(dom, ext, m),
    fatigue:()=>{ FM.liveFatigue(dom); FM.liveFatigue(ext); },
    isMine:(ev)=> !!myClub && ((ev.home && dom.id===myClub.id) || (!ev.home && ext.id===myClub.id)),
    applyIncident:(inc)=>{
      const c = inc.home ? dom : ext;
      FM.applyIncidents(c, [inc]);
      if (inc.type==="red"){ FM.sendOff(c, inc.id); }
      c._red = 0;                                  // l'infériorité vient du poste vide
      if (FM.state && c.id===FM.state.managedClubId) FM.announceIncidents(c, [inc]);
    },
    cleanup:()=>{ FM.refillXI(dom); FM.refillXI(ext); FM.clearMatchFlags(dom); FM.clearMatchFlags(ext); }
  };
}

function runInteractiveMatch(dom, ext, opts, onFinish){
  const my = FM.myClub();
  const cfg = clubMatchCfg(dom, ext, opts.label, my);
  cfg.done = (hs, as, goals)=>{ cfg.cleanup(); onFinish({ domScore:hs, extScore:as, events:goals }); };
  playLiveMatch(cfg);
}

/* Causerie d'avant-match */


/* Écran de mi-temps : réglages tactiques + remplacements (effet réel en 2e MT) */


/* ============= EFFECTIF ============= */
function renderSquad(body){
  const my = FM.myClub();
  const card = el("div","card");
  card.appendChild(el("h3",null,icon("squad")+`${_t("Effectif")} — ${my.joueurs.length} ${_t("joueurs")} · ${_t("Masse salariale")} ~${my.joueurs.reduce((a,p)=>a+p.salaire,0).toFixed(0)} k€/sem`));

  const table = el("table","squad-table");
  const showNat = my.joueurs.some(p=>p.nat);
  table.innerHTML = `<thead><tr>
    <th>${_t("Poste")}</th><th>${_t("Nom")}</th>${showNat?`<th>${_t("Nat")}</th>`:""}<th>${_t("Âge")}</th><th>${_t("Note")}</th><th>${_t("Pot")}</th>
    <th>${_t("Valeur")}</th><th>${_t("Forme")}</th><th>${_t("Moral")}</th><th title="${_t("Matchs")}">M</th><th title="${_t("Buts")}">B</th><th title="${_t("Passes déc.")}">PD</th><th title="${_t("Note moyenne")}">${_t("moy")}</th><th></th></tr></thead>`;
  const tb = el("tbody");
  const order = {G:0,D:1,M:2,A:3};
  my.joueurs.slice().sort((a,b)=> order[a.groupe]-order[b.groupe] || b.note-a.note).forEach(p=>{
    const inXI = my.onze.some(s=>s.id===p.id);
    const tr = el("tr", inXI?"in-xi":"");
    tr.innerHTML = `
      <td><span class="pos-badge ${p.groupe}">${p.pos}</span></td>
      <td><a class="player-link">${inXI?'<span class="starter-mark">★</span>':''}${p.nom}</a>${!FM.playerAvailable(p)?' <span class="inc-badge" title="'+FM.unavailableReason(p)+'">'+(p.blessure>0?_t("BLES."):_t("SUSP."))+' '+(p.blessure>0?p.blessure:p.suspension)+'</span>':''}${(p.cartons||0)%5===4?' <span class="inc-badge warn" title="'+_t("Prochain avertissement = suspension")+'">'+_t("4 CJ")+'</span>':''}</td>
      ${showNat?`<td>${FLAG(p.nat)}</td>`:""}
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
    tr.querySelector(".player-link").onclick=()=> openPlayerCard(p, my.nom);
    if (p.loan && p.loan.borrowerId===my.id){
      // Joueur prêté chez nous : badge + rendre
      const badge = el("span","tag loan-tag",_t("Prêt")+" "+(p.loan.parentNom||''));
      tr.lastChild.appendChild(badge);
      const rb = el("button","btn tiny danger-ghost",_t("Rendre"));
      rb.onclick=()=>{ const r=FM.recallLoan(p.id); if(r && r.msg) toast(r.msg); renderGame(); };
      tr.lastChild.appendChild(rb);
    } else {
      const btn = el("button","btn tiny "+(p.transferListe?"danger-ghost":"ghost"), p.transferListe?_t("Retirer"):_t("Vendre"));
      btn.onclick=()=>{ const r=FM.toggleTransferList(p.id); if(r && r.msg) toast(r.msg); renderGame(); };
      tr.lastChild.appendChild(btn);
      const lb = el("button","btn tiny ghost",_t("Prêter"));
      if(!FM.marketOpen()){ lb.disabled=true; lb.title=_t("Hors période de mercato"); }
      lb.onclick=()=>{ const r=FM.loanOut(p.id); toast(r.msg); renderGame(); };
      tr.lastChild.appendChild(lb);
    }
    tb.appendChild(tr);
  });
  table.appendChild(tb);
  const scroll = el("div","table-scroll"); scroll.appendChild(table);
  card.appendChild(scroll);
  card.appendChild(el("p","hint",_t("Cliquez sur un nom pour la fiche du joueur. « Prêter » envoie un joueur en prêt une saison ; les prêts entrants portent le badge « prêt ».")));
  body.appendChild(card);

  // Prêts sortants en cours (nos joueurs prêtés ailleurs)
  const loans = FM.myLoans();
  if (loans.out.length){
    const lc = el("div","card");
    lc.appendChild(el("h3",null,`${_t("Joueurs prêtés")} (${loans.out.length})`));
    loans.out.forEach(p=>{
      const row = el("div","offer-row");
      row.innerHTML = `<span><span class="pos-badge ${p.groupe}">${p.pos}</span> <b>${p.nom}</b> (${p.note}) → <b>${p.holderNom}</b> · retour fin de saison</span>`;
      const rb = el("button","btn small ghost",_t("Rappeler"));
      rb.onclick=()=>{ const r=FM.recallLoan(p.id); if(r && r.msg) toast(r.msg); renderGame(); };
      row.appendChild(rb);
      lc.appendChild(row);
    });
    body.appendChild(lc);
  }
}

/* Fiche joueur : identité, attributs, saison en cours, historique de carrière */
function openPlayerCard(p, clubNom){
  const overlay = el("div","overlay");
  const box = el("div","card player-card");
  const avg = FM.playerAvgNote ? FM.playerAvgNote(p) : 0;
  const carr = p.carriere || [];
  let carrRows = carr.slice().reverse().map(s=>`
    <tr><td>${s.saison}</td><td>${s.club||'—'}</td><td>${s.matchs}</td><td>${s.buts}</td>
    <td>${s.passes||0}</td><td>${s.avg?s.avg.toFixed(2):'—'}</td><td>${s.note}</td>
    <td>${s.sel?s.sel.equipe:''}</td></tr>`).join("");
  const totMatch = carr.reduce((a,s)=>a+(s.matchs||0),0)+(p.matchs||0);
  const totButs = carr.reduce((a,s)=>a+(s.buts||0),0)+(p.buts||0);
  const totPasses = carr.reduce((a,s)=>a+(s.passes||0),0)+(p.passes||0);
  box.innerHTML = `
    <div class="pc-head">
      <div class="pc-badge ${p.groupe}">${p.pos}</div>
      <div class="pc-id"><b>${p.nom}</b> ${FLAG(p.nat)}
        <small>${FM.POS_LABEL[p.pos]} · ${p.age} ans${clubNom?(' · '+clubNom):''}</small></div>
      <div class="pc-note ${noteClass(p.note)}">${p.note}</div>
    </div>
    <div class="pc-attrs">
      <div><small>Potentiel</small><b>${p.potentiel}</b></div>
      <div><small>Valeur</small><b>${p.valeur.toFixed(1)} M€</b></div>
      <div><small>Salaire</small><b>${(p.salaire||0).toFixed(1)} k€</b></div>
      <div><small>Forme</small><b>${formeIcon(p.forme)}</b></div>
      <div><small>Moral</small><b>${p.moral}</b></div>
      <div><small>Contrat</small><b>${p.contrat} an${p.contrat>1?'s':''}</b></div>
    </div>
    <div class="pc-season">
      <h4>Saison en cours</h4>
      <span>${p.buts||0} ${_t("buts")}</span><span>${p.passes||0} ${_t("passes")}</span>
      <span>${p.matchs||0} ${_t("matchs")}</span><span>${p.noteMatchs?avg.toFixed(2):'—'} ${_t("moy")}</span>
    </div>
    ${!FM.playerAvailable(p)?`<p class="pc-out">${p.blessure>0?_t("Blessé"):_t("Suspendu")} — indisponible ${p.blessure>0?p.blessure:p.suspension} journée(s).</p>`:''}
    ${(p.cartons||0)?`<p class="hint">${_t("Avertissements cette saison")} : <b>${p.cartons}</b>${(p.cartons%5===4)?" — prochain carton = suspension":""}</p>`:''}
    ${p.selJeunes?`<p class="pc-youth">${_t("Convoqué en")} <b>${p.selJeunes.equipe}</b> (${p.selJeunes.matchs} matchs, ${p.selJeunes.buts} buts).</p>`:''}
    <div class="pc-career">
      <h4>Carrière — totaux : ${totMatch} matchs · ${totButs} buts · ${totPasses} passes</h4>
      ${carr.length?`<div class="table-scroll"><table class="squad-table"><thead><tr>
        <th>${_t("Saison")}</th><th>Club</th><th>M</th><th>B</th><th>PD</th><th>${_t("Moy")}</th><th>${_t("Note")}</th><th>${_t("Sélection")}</th>
        </tr></thead><tbody>${carrRows}</tbody></table></div>`
        :`<p class="hint">Première saison en cours — l'historique se construira au fil des saisons.</p>`}
    </div>`;
  const close = el("button","btn ghost",_t("Fermer"));
  close.onclick=()=>overlay.remove();
  box.appendChild(close);
  overlay.appendChild(box);
  overlay.onclick=e=>{ if(e.target===overlay) overlay.remove(); };
  document.body.appendChild(overlay);
}

/* ============= TACTIQUE ============= */
/* ============= ENTRAÎNEMENT ============= */
function renderTraining(body){
  const card = el("div","card");
  card.appendChild(el("h3",null,icon("gear")+_t("Entraînement de la semaine")));
  card.appendChild(el("p","hint",
    _t("Répartissez le travail entre trois orientations. La part neutre est d'un tiers : au-dessus vous gagnez dans ce domaine, en dessous vous perdez.")));

  const DEFS = [
    ["physique",  _t("Physique"),  _t("Moins de blessures")],
    ["technique", _t("Technique"), _t("Progression vers le potentiel")],
    ["tactique",  _t("Tactique"),  _t("Cohésion du bloc")]
  ];
  const row = el("div","tac-row");
  const inputs = {}, vals = {};
  const bilan = el("div","fin-grid");

  function majBilan(){
    const t = FM.training();
    const tot = (t.physique+t.technique+t.tactique) || 100;
    DEFS.forEach(([k])=>{ vals[k].textContent = Math.round(t[k]/tot*100)+" %"; });
    const eB = FM.trainingEdge("physique"), eT = FM.trainingEdge("technique"), eC = FM.trainingEdge("tactique");
    /* On arrondit AVANT de formater, et on neutralise le zéro négatif :
       la répartition par défaut affichait « -0.0 note/saison ». */
    const arr = (v, d) => { const r = +v.toFixed(d); return r === 0 ? 0 : r; };
    const sgn = (v, d) => { const r = arr(v, d); return (r > 0 ? "+" : "") + r.toFixed(d); };
    const pct = v => { const r = arr(v, 0); return (r > 0 ? "+" : "") + r + " %"; };
    const cls = v => { const r = arr(v, 1); return r > 0 ? 'pos' : r < 0 ? 'neg' : ''; };
    bilan.innerHTML =
      `<div><small>${_t("Risque de blessure")}</small><b class="${cls(eB)}">${pct(-30*eB)}</b></div>` +
      `<div><small>${_t("Progression des jeunes")}</small><b class="${cls(eT)}">${sgn(eT, 1)} ${_t("note/saison")}</b></div>` +
      `<div><small>${_t("Force d'équipe")}</small><b class="${cls(eC)}">${sgn(1.8*eC, 1)}</b></div>`;
  }
  DEFS.forEach(([k,lbl,desc])=>{
    const w = el("label","tac-slider");
    w.appendChild(el("span","tac-title",lbl));
    const inp = el("input"); inp.type="range"; inp.min=0; inp.max=100; inp.step=5;
    inp.value = FM.training()[k];
    const val = el("span","tac-val");
    inputs[k]=inp; vals[k]=val;
    inp.oninput = ()=>{
      FM.setTraining({ physique:+inputs.physique.value,
                       technique:+inputs.technique.value,
                       tactique:+inputs.tactique.value });
      majBilan();
    };
    w.appendChild(inp); w.appendChild(val);
    w.appendChild(el("small","hint",desc));
    row.appendChild(w);
  });
  card.appendChild(row);
  card.appendChild(el("h4",null,_t("Effet attendu")));
  card.appendChild(bilan);
  majBilan();
  body.appendChild(card);
}

function renderTactics(body){
  const my = FM.myClub();

  // Formation + réglages
  const setup = el("div","card");
  setup.appendChild(el("h3",null,icon("tactics")+_t("Formation & consignes")));
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

  const auto = el("button","btn ghost small",_t("Composer automatiquement"));
  auto.onclick=()=>{ my.onze=FM.autoPickXI(my); FM.save(); renderGame(); };
  setup.appendChild(auto);
  body.appendChild(setup);

  // Terrain visuel
  const pitchCard = el("div","card");
  pitchCard.appendChild(el("h3",null,icon("tactics")+_t("Composition sur le terrain")));
  const st = FM.teamStrength(my);
  pitchCard.appendChild(el("p","strength-line",
    `Attaque <b>${Math.round(st.att)}</b> · Milieu <b>${Math.round(st.mid)}</b> · Défense <b>${Math.round(st.def)}</b> · Global <b>${st.global}</b>`));
  const pitch = el("div","pitch");
  const slots = FM.FORMATIONS[my.formation];
  const rows = pitchRows(my.formation);
  let si=0;
  rows.forEach(count=>{
    const line = el("div","pitch-line");
    // Ordonne la ligne de gauche à droite (DG/AG à gauche, DD/AD à droite)
    const cells=[];
    for (let k=0;k<count;k++){
      const slotIdx=si+k;
      const slot = (my.onze[slotIdx] && my.onze[slotIdx].slot) || slots[slotIdx];
      cells.push({ slotIdx, slot, lat: lateralRank(slot), ord:k });
    }
    cells.sort((a,b)=> a.lat-b.lat || a.ord-b.ord);
    cells.forEach(({slotIdx, slot})=>{
      const s = my.onze[slotIdx];
      const p = s && s.id ? FM.getPlayer(my,s.id) : null;
      const spot = el("div","spot"+(p?"":" empty"));
      spot.innerHTML = p
        ? `<div class="spot-pos">${slot}</div><div class="spot-note ${noteClass(p.note)}">${p.note}</div><div class="spot-name">${shortName(p.nom)}</div>`
        : `<div class="spot-pos">${slot}</div><div class="spot-add">+</div>`;
      spot.onclick=()=> openPlayerPicker(slotIdx, slot);
      line.appendChild(spot);
    });
    si+=count;
    pitch.appendChild(line);
  });
  pitchCard.appendChild(pitch);
  pitchCard.appendChild(el("p","hint",_t("Cliquez sur un poste pour changer le joueur titulaire.")));
  body.appendChild(pitchCard);
  renderTraining(body);
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

/* Rang latéral d'un poste pour l'affichage : 0 = gauche, 1 = axe, 2 = droite */
function lateralRank(slot){
  if (slot==="DG" || slot==="AG") return 0;
  if (slot==="DD" || slot==="AD") return 2;
  return 1;
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
  my.joueurs.slice().sort((a,b)=>(FM.playerAvailable(b)?1:0)-(FM.playerAvailable(a)?1:0) || b.note-a.note).forEach(p=>{
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
    else if (FM.compFinished(c)) stat = FM.compChampionTeam(c).nom;
    else stat = FM.roundName(c.ko.alive.length);
    const pill = el("div","comp-pill"+(e.playerComp===k?" mine":""));
    pill.innerHTML = `<span class="ce">${compMark(c)}</span><div><b>${c.nom}</b><small>${stat}</small></div>`;
    bar.appendChild(pill);
  });
  body.appendChild(bar);

  if (!e.playerComp){
    const c = el("div","card");
    c.innerHTML = `<h3>${icon("cup")}${_t("Coupes d'Europe")}</h3><p>Votre club n'est pas qualifié cette saison. Qualifiez-vous via le classement de votre championnat (places attribuées selon le coefficient UEFA de votre pays).</p>
      <p>${icon("cup")} <b>${FM.compChampionTeam(e.UCL)?FM.compChampionTeam(e.UCL).nom:'—'}</b> remporte la Ligue des Champions.</p>`;
    body.appendChild(c);
    if (e.UCL.ko) renderCupHistory(body, e.UCL.ko);
    return;
  }

  const comp = e[e.playerComp];

  if (comp.phase==="league"){ renderLeaguePhase(body, comp); return; }

  // ---- Phase à élimination directe ----
  const ko = comp.ko;
  const card = el("div","card");
  card.appendChild(el("h3",null,`${compMark(comp)}${comp.nom} — ${_t("phase finale")} (${FM.myClub().nom})`));
  if (ko.finished){
    const won = ko.champion===ko.playerSeed;
    card.innerHTML += `<p class="euro-final ${won?'win':''}">${won?_t("VAINQUEUR !"):_t("Vainqueur")+' : <b>'+ko.teams[ko.champion].nom+'</b>'}</p>`;
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
    const play = el("button","btn primary big",icon("play")+_t("Jouer le match"));
    play.onclick=()=> playCupTie(ko);
    card.appendChild(play);
    const sim = el("button","btn ghost",_t("Simuler ce tour"));
    sim.onclick=()=>{ FM.resolveTournamentRound(ko); FM.save(); renderGame(); };
    card.appendChild(sim);
  } else {
    card.appendChild(el("p","round-name","Vous avez été éliminé."));
    const b = el("button","btn ghost",_t("Voir la suite"));
    b.onclick=()=>{ let g=0; while(!ko.finished&&g++<8) FM.resolveTournamentRound(ko); FM.save(); renderGame(); };
    card.appendChild(b);
  }
  body.appendChild(card);
  renderCupHistory(body, ko);
}

/* ============= COUPE NATIONALE ============= */
function renderDomesticCup(body){
  const cup = FM.state.coupe;
  if (!cup){ body.appendChild(el("div","card",`<p class="hint">La coupe nationale se met en place en début de saison.</p>`)); return; }
  const me = FM.myClub();
  const card = el("div","card");
  card.appendChild(el("h3",null,`${compMark(cup)}${cup.nom} — ${me.nom}`));

  if (cup.finished){
    const won = cup.champion===cup.playerSeed;
    card.innerHTML += `<p class="euro-final ${won?'win':''}">${won?_t("VAINQUEUR DE LA COUPE !"):_t("Vainqueur")+' : <b>'+(cup.teams[cup.champion]?cup.teams[cup.champion].nom:'—')+'</b>'}</p>`;
  } else if (cup.playerAlive){
    const tie = FM.playerTie(cup);
    const oppIdx = tie[0]===cup.playerSeed?tie[1]:tie[0];
    const opp = cup.teams[oppIdx];
    card.appendChild(el("p","round-name",`${FM.roundName(cup.alive.length)} · match sec`));
    if (opp.bye){
      // Exempt ce tour : qualification d'office
      card.appendChild(el("p","hint",_t("Votre club est exempt ce tour : qualifié d'office pour le tour suivant.")));
      const go = el("button","btn primary big",_t("Tour suivant"));
      go.onclick=()=>{ FM.resolveTournamentRound(cup); FM.save(); renderGame(); };
      card.appendChild(go);
    } else {
      const tieBox = el("div","tie-box");
      tieBox.innerHTML = `
        <div class="tie-side">${clubCrest(me,52)}<b>${me.nom}</b><small>${FM.squadRating(me)}</small></div>
        <div class="vs">VS</div>
        <div class="tie-side">${clubCrest({nom:opp.nom,couleurs:opp.couleurs},52)}<b>${opp.nom}</b><small>${opp.note}</small></div>`;
      card.appendChild(tieBox);
      const play = el("button","btn primary big",icon("play")+_t("Jouer le match"));
      play.onclick=()=> playCupTie(cup, {noEuropeAdvance:true});
      card.appendChild(play);
      const sim = el("button","btn ghost",icon("forward")+_t("Simuler ce tour"));
      sim.onclick=()=>{ FM.resolveTournamentRound(cup); FM.save(); renderGame(); };
      card.appendChild(sim);
    }
  } else {
    card.appendChild(el("p","round-name","Vous avez été éliminé de la coupe."));
    const b = el("button","btn ghost",_t("Voir le vainqueur"));
    b.onclick=()=>{ FM.autoCompleteCup(cup); FM.save(); renderGame(); };
    card.appendChild(b);
  }
  body.appendChild(card);
  renderCupHistory(body, cup);
}

/* Phase de ligue : classement + match du joueur */
function renderLeaguePhase(body, comp){
  const card = el("div","card");
  card.appendChild(el("h3",null,`${compMark(comp)}${comp.nom} — ${_t("phase de ligue")} (J${comp.lp.cur+1}/${comp.lp.rounds})`));
  const pm = FM.lpPlayerMatch(comp);
  if (pm){
    const me = FM.myClub();
    const oppIdx = pm.playerHome?pm.away:pm.home;
    const opp = comp.teams[oppIdx];
    const box = el("div","tie-box");
    box.innerHTML = `
      <div class="tie-side">${clubCrest(me,52)}<b>${me.nom}</b><small>${pm.playerHome?_t("domicile"):_t("extérieur")}</small></div>
      <div class="vs">VS</div>
      <div class="tie-side">${clubCrest({nom:opp.nom,couleurs:opp.couleurs},52)}<b>${opp.nom}</b><small>${opp.note}</small></div>`;
    card.appendChild(box);
    const play = el("button","btn primary big",icon("play")+_t("Jouer le match"));
    play.onclick=()=> playLeagueMatch(comp);
    card.appendChild(play);
    const sim = el("button","btn ghost",_t("Simuler la journée"));
    sim.onclick=()=>{ FM.lpResolveRound(comp); FM.save(); renderGame(); };
    card.appendChild(sim);
    const simAll = el("button","btn ghost",_t("Simuler toute la phase"));
    simAll.onclick=()=>{ let g=0; while(comp.phase==="league"&&g++<40) FM.lpResolveRound(comp); FM.save(); renderGame(); };
    card.appendChild(simAll);
  }
  body.appendChild(card);

  // Classement de la phase de ligue
  const tCard = el("div","card");
  tCard.appendChild(el("h3",null,_t("Classement — les 16 premiers qualifiés")));
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
  tCard.appendChild(el("p","legend",_t("Top 16 → phase à élimination directe (aller-retour)")));
  body.appendChild(tCard);
}

/* Match de phase de ligue du joueur (match sec, animé) */
function playLeagueMatch(comp){
  const pm = FM.lpPlayerMatch(comp);
  if (!pm){ renderGame(); return; }
  const homeT = comp.teams[pm.home], awayT = comp.teams[pm.away];
  const dom = FM.clubById(homeT.ref), ext = FM.clubById(awayT.ref);
  const cfg = clubMatchCfg(dom, ext, comp.nom+" · phase de ligue", FM.myClub());
  cfg.done = (hs,as)=>{ cfg.cleanup(); FM.lpResolveRound(comp,{hs,as}); FM.save(); renderGame(); };
  playLiveMatch(cfg);
}

/* Historique des tours d'une compétition (met en avant le club du joueur) */
function renderCupHistory(body, comp){
  if (!comp.history.length) return;
  const h = el("div","card");
  h.appendChild(el("h3",null,`${compMark(comp)}${comp.nom} — ${_t("résultats")}`));
  comp.history.slice().reverse().forEach(rd=>{
    h.appendChild(el("p","cup-round-title",rd.nom));
    const list = el("div","cup-ties");
    rd.ties.forEach(t=>{
      const A=comp.teams[t.a], B=comp.teams[t.b];
      const mine = (t.a===comp.playerSeed||t.b===comp.playerSeed);
      const row = el("div","cup-tie"+(mine?" mine":""));
      if (t.bye){
        const real = A.bye ? B : A;
        row.innerHTML = `<span class="ct-a w">${real.nom}</span>
          <span class="ct-s"><em>exempt</em></span><span class="ct-b">—</span>`;
        list.appendChild(row); return;
      }
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

/* Match de coupe du joueur, avec animation (aller-retour si applicable).
   opts.noEuropeAdvance : ne pas faire avancer les coupes d'Europe (coupe nationale). */
function playCupTie(comp, opts){
  opts = opts || {};
  const tie = FM.playerTie(comp);
  if (!tie){ renderGame(); return; }
  const [a,b] = tie;
  const finish = (res)=>{ FM.resolveTournamentRound(comp,res); if(!opts.noEuropeAdvance) advanceAllCups(true); FM.save(); renderGame(); };
  if (comp.teams[a].bye || comp.teams[b].bye){ finish(FM.simCupTie(comp,a,b)); return; }

  const playerA = (a===comp.playerSeed);
  const my = FM.myClub();
  const clubOf = i => FM.clubById(comp.teams[i].ref);
  const twoLeg = comp.kind==="club" && !comp.singleLeg && comp.alive.length > 2;

  if (!twoLeg){
    const dom=clubOf(a), ext=clubOf(b);
    let pen=null;
    const cfg = clubMatchCfg(dom, ext, comp.nom, my);
    cfg.endText = (hs,as)=>{
      if (hs===as) pen = FM.penaltyShootout(comp,a,b);
      const self=playerA?hs:as, opp=playerA?as:hs;
      const won = self>opp || (self===opp && pen && ((playerA?pen[0]:pen[1])>(playerA?pen[1]:pen[0])));
      return qualChip(won)+(pen?` (tab ${playerA?pen[0]:pen[1]}-${playerA?pen[1]:pen[0]})`:"");
    };
    cfg.done = (hs,as,goals)=>{ cfg.cleanup();
      const winner = hs>as?a : as>hs?b : (pen[0]>pen[1]?a:b);
      finish({ as:hs, es:as, pen, winner, twoLeg:false, ev1:goals }); };
    playLiveMatch(cfg); return;
  }
  // ALLER puis RETOUR
  const d1=clubOf(a), e1=clubOf(b);
  const c1 = clubMatchCfg(d1, e1, "Aller · "+comp.nom, my);
  c1.done = (l1h, l1a)=>{
    c1.cleanup();
    const d2=clubOf(b), e2=clubOf(a);
    let pen=null;
    const c2 = clubMatchCfg(d2, e2, "Retour · "+comp.nom, my);
    c2.endText = (l2h,l2a)=>{
      const agA=l1h+l2a, agB=l1a+l2h;
      if (agA===agB) pen = FM.penaltyShootout(comp,a,b);
      const self=playerA?agA:agB, opp=playerA?agB:agA;
      const won = self>opp || (self===opp && pen && ((playerA?pen[0]:pen[1])>(playerA?pen[1]:pen[0])));
      return `Cumul ${self}-${opp}`+(pen?` · tab ${playerA?pen[0]:pen[1]}-${playerA?pen[1]:pen[0]}`:"")+` · `+qualChip(won);
    };
    c2.done = (l2h,l2a)=>{ c2.cleanup();
      const agA=l1h+l2a, agB=l1a+l2h;
      const winner = agA>agB?a : agB>agA?b : (pen[0]>pen[1]?a:b);
      finish({ as:agA, es:agB, pen, winner, twoLeg:true, leg1:{as:l1h,es:l1a}, leg2:{as:l2a,es:l2h} }); };
    playLiveMatch(c2);
  };
  playLiveMatch(c1);
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
  const skip = el("button","btn ghost",icon("skip")+_t("Passer"));
  box.appendChild(skip);
  document.body.appendChild(overlay);

  const feed = box.querySelector("#cFeed"), scoreEl = box.querySelector("#cScore"), minEl = box.querySelector("#cMin");
  const ordered = evs.slice().sort((x,y)=>x.min-y.min);
  let s=0,o=0,idx=0,minute=0;
  function finish(){
    clearInterval(timer);
    s=selfScore; o=oppScore;
    scoreEl.textContent = `${s} - ${o}`;
    let txt = _t("Coup de sifflet final"), verdict=null, cont=icon("check")+_t("Continuer");
    if (opts.label==="Aller"){
      txt = _t("Fin de l'aller — place au retour"); cont=icon("play")+_t("Jouer le retour");
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
    if (verdict!==null) feed.innerHTML = `<div class="tie-verdict ${verdict?'win':'lose'}">${verdict?_t("Qualifié !"):_t("Éliminé")}</div>` + feed.innerHTML;
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
      const line = el("div","feed-line "+(ev.me?"left":"right"),`<span class="fmin">${ev.min}'</span>${icon("ball")}<b>${ev.joueur}</b>`);
      line.classList.add("flash"); feed.prepend(line);
    }
  }, 220);
}

/* ============= MODE INTERNATIONAL (Euro / Coupe du Monde) ============= */
let intlComp = null;
let intlCareer = false;                 // tournoi disputé depuis une carrière ?
let intlKind = null, intlNation = null;

function startInternational(kind, nation){
  openSquadPicker(kind, nation, (squad, note, starters)=>{
    intlComp = FM.makeNationTournament(kind, nation, {squad, note, starters});
    intlCareer = false;
    renderTournament();
  });
}

/* Lance le tournoi international depuis une carrière (retour à la carrière ensuite) */
function startCareerIntl(kind, nation){
  openSquadPicker(kind, nation, (squad, note, starters)=>{
    intlComp = FM.makeNationTournament(kind, nation, {squad, note, starters});
    intlCareer = true; intlKind = kind; intlNation = nation;
    renderTournament();
  });
}

/* Écran de composition d'équipe nationale : 23 joueurs (titulaires + banc)
   choisis dans un vivier de ~500 joueurs de la nation (recherche + filtres). */
const MAX_SQUAD=23, MAX_START=11;
function openSquadPicker(kind, nation, cb){
  const pool = FM.nationPool(nation, 500);
  const players = pool.players;
  const byId = new Map(players.map(p=>[p.id,p]));
  const sel = new Map();            // id -> player (effectif)
  const starters = new Set();       // sous-ensemble titulaire
  let fPos = "", fQ = "";           // filtres du vivier
  const GROUP_LBL={G:_t("GB"),D:_t("DEF"),M:_t("MIL"),A:_t("ATT")};

  function byG(g){ return players.filter(p=>p.groupe===g).sort((a,b)=>b.note-a.note); }
  function autoPick(){
    sel.clear(); starters.clear();
    const g=byG("G"),d=byG("D"),m=byG("M"),a=byG("A");
    [...g.slice(0,1),...d.slice(0,4),...m.slice(0,3),...a.slice(0,3)].forEach(p=>{ sel.set(p.id,p); starters.add(p.id); });
    [...g.slice(1,2),...d.slice(4,8),...m.slice(3,7),...a.slice(3,6)].forEach(p=>{ if(sel.size<MAX_SQUAD) sel.set(p.id,p); });
  }
  function starterCounts(){ const c={G:0,D:0,M:0,A:0}; starters.forEach(id=>{ const p=byId.get(id); if(p)c[p.groupe]++; }); return c; }
  function validXI(){ const c=starterCounts(); return starters.size===MAX_START && c.G>=1 && c.D>=3 && c.M>=2 && c.A>=1; }
  function teamNote(){ let s=0,n=0; starters.forEach(id=>{ const p=byId.get(id); if(p){s+=p.note;n++;} }); return n?Math.round(s/n):0; }
  function add(p){
    if(sel.has(p.id)) return;
    if(sel.size>=MAX_SQUAD){ toast("Effectif complet (23)."); return; }
    sel.set(p.id,p);
    if(starters.size<MAX_START) starters.add(p.id);   // complète d'abord le onze
    render();
  }
  function remove(id){ sel.delete(id); starters.delete(id); render(); }
  function toggleStar(id){
    if(starters.has(id)) starters.delete(id);
    else { if(starters.size>=MAX_START){ toast("Déjà 11 titulaires."); return; } starters.add(id); }
    render();
  }
  autoPick();

  const overlay = el("div","overlay");
  const box = el("div","card squad-picker wide");
  overlay.appendChild(box); document.body.appendChild(overlay);

  function poolRows(){
    let list = players.filter(p=>!sel.has(p.id));
    if(fPos) list=list.filter(p=>p.groupe===fPos);
    if(fQ){ const q=fQ.toLowerCase(); list=list.filter(p=>p.nom.toLowerCase().includes(q)); }
    const shown=list.slice(0,60);
    const wrap=el("div","sp-poollist");
    shown.forEach(p=>{
      const row=el("button","sp-prow"+(p.real?" real":""),
        `<span class="pos-badge ${p.groupe}">${p.pos}</span><span class="pn">${p.nom}</span><b class="note ${noteClass(p.note)}">${p.note}</b>`);
      row.onclick=()=>add(p);
      wrap.appendChild(row);
    });
    if(!shown.length) wrap.appendChild(el("p","hint","Aucun joueur ne correspond."));
    else if(list.length>shown.length) wrap.appendChild(el("p","hint",`${shown.length} affichés sur ${list.length} — affinez la recherche.`));
    return wrap;
  }
  function squadSide(){
    const side=el("div","sp-squad");
    const mk=(id)=>{
      const p=byId.get(id); const st=starters.has(id);
      const row=el("div","sp-srow"+(st?" starter":""));
      row.innerHTML=`<span class="pos-badge ${p.groupe}">${p.pos}</span><span class="pn">${p.nom}</span><b class="note ${noteClass(p.note)}">${p.note}</b>`;
      const star=el("button","sp-mini"+(st?" on":""), st?"★":"☆"); star.title="Titulaire";
      star.onclick=()=>toggleStar(id);
      const rm=el("button","sp-mini danger","✕"); rm.onclick=()=>remove(id);
      row.appendChild(star); row.appendChild(rm);
      return row;
    };
    const ids=[...sel.keys()].sort((a,b)=>{ const A=byId.get(a),B=byId.get(b);
      const oa=({G:0,D:1,M:2,A:3})[A.groupe], ob=({G:0,D:1,M:2,A:3})[B.groupe];
      return (starters.has(b)?1:0)-(starters.has(a)?1:0) || oa-ob || B.note-A.note; });
    const stIds=ids.filter(id=>starters.has(id)), bIds=ids.filter(id=>!starters.has(id));
    side.appendChild(el("h4",null,`${_t("Titulaires")} (${stIds.length}/11)`));
    stIds.forEach(id=>side.appendChild(mk(id)));
    side.appendChild(el("h4",null,`${_t("Remplaçants")} (${bIds.length})`));
    if(!bIds.length) side.appendChild(el("p","hint","Ajoutez des remplaçants pour la profondeur de banc."));
    bIds.forEach(id=>side.appendChild(mk(id)));
    return side;
  }

  function render(){
    box.innerHTML="";
    box.appendChild(el("h3",null,icon("globe")+`${kind==="WC"?_t("Coupe du Monde"):_t("Championnat d'Europe")} — ${_t("Composez votre")} ${nation}`));
    box.appendChild(el("p","hint","Choisissez 11 titulaires + des remplaçants (23 max) parmi ~500 joueurs. ★ = titulaire, ✕ = retirer."));
    const cols=el("div","sp-cols");
    // --- Vivier (gauche) ---
    const left=el("div","sp-pool");
    const bar=el("div","sp-filters");
    const q=el("input"); q.type="text"; q.placeholder=_t("Rechercher un joueur…"); q.value=fQ;
    q.oninput=()=>{ fQ=q.value; refreshPool(); };
    bar.appendChild(q);
    [["",_t("Tous")],["G",_t("GB")],["D",_t("DEF")],["M",_t("MIL")],["A",_t("ATT")]].forEach(([v,l])=>{
      const b=el("button","sp-fbtn"+(fPos===v?" on":""),l); b.onclick=()=>{ fPos=v; render(); }; bar.appendChild(b);
    });
    left.appendChild(el("h4",null,`Vivier ${nation} (~500)`));
    left.appendChild(bar);
    const poolBox=el("div"); poolBox.id="spPoolBox"; poolBox.appendChild(poolRows()); left.appendChild(poolBox);
    function refreshPool(){ poolBox.innerHTML=""; poolBox.appendChild(poolRows()); }
    // --- Effectif (droite) ---
    const right=squadSide();
    cols.appendChild(left); cols.appendChild(right);
    box.appendChild(cols);

    const c=starterCounts();
    const sb=el("div","sp-bar");
    sb.innerHTML=`<span>Effectif : <b>${sel.size}/23</b> · Titulaires <b>${starters.size}/11</b> (GB ${c.G} · Déf ${c.D} · Mil ${c.M} · Att ${c.A})</span>
      <span>Force du onze : <b class="note ${noteClass(teamNote())}">${teamNote()}</b></span>`;
    box.appendChild(sb);
    const actions=el("div","sp-actions");
    const auto=el("button","btn ghost",_t("Sélection auto")); auto.onclick=()=>{ autoPick(); render(); };
    const go=el("button","btn primary big",icon("globe")+_t("Valider et jouer")); go.disabled=!validXI();
    go.onclick=()=>{ if(!validXI())return; const squad=[...sel.values()]; overlay.remove(); cb(squad, teamNote(), [...starters]); };
    const cancel=el("button","btn ghost",_t("Annuler")); cancel.onclick=()=>{ overlay.remove(); if(FM.state){ currentTab="accueil"; renderGame(); } else renderStart(); };
    actions.appendChild(auto); actions.appendChild(go); actions.appendChild(cancel);
    box.appendChild(actions);
  }
  render();
}

function renderTournament(){
  const comp = intlComp;
  const app = $("#app"); app.innerHTML = "";
  const meN = comp.teams[comp.playerSeed];
  const meCrest = { nom:meN.nom, couleurs:meN.couleurs };

  const top = el("div","topbar");
  top.innerHTML = `<div class="club-id">${clubCrest(meCrest,46)}
      <div><b>${meN.nom}</b><small>${comp.nom}</small></div></div>
    <div class="stats">
      <div><small>Tour</small><b>${comp.finished?'Terminé':FM.roundName(comp.alive.length)}</b></div>
      <div><small>Équipes</small><b>${comp.alive.length}</b></div>
      <div><small>Force</small><b>${meN.note}</b></div>
    </div>`;
  app.appendChild(top);

  const body = el("div","content"); app.appendChild(body);
  const card = el("div","card");
  card.appendChild(el("h3",null,`${compMark(comp)}${comp.nom}`));
  if (comp.finished){
    const won = comp.champion===comp.playerSeed;
    card.innerHTML += `<p class="euro-final ${won?'win':''}">${won?_t("CHAMPION !")+' '+meN.nom:_t("Vainqueur")+' : <b>'+comp.teams[comp.champion].nom+'</b>'}</p>`;
    // Carrière : enregistrer le résultat une seule fois
    if (intlCareer && !comp._recorded){
      comp._recorded = true;
      FM.recordIntlResult(intlKind, intlNation, comp.teams[comp.champion].nom, won);
    }
  } else if (comp.playerAlive){
    const tie = FM.playerTie(comp);
    const opp = comp.teams[tie[0]===comp.playerSeed?tie[1]:tie[0]];
    card.appendChild(el("p","round-name",FM.roundName(comp.alive.length)));
    const tb = el("div","tie-box");
    tb.innerHTML = `<div class="tie-side">${clubCrest(meCrest,52)}<b>${meN.nom}</b><small>${meN.note}</small></div>
      <div class="vs">VS</div>
      <div class="tie-side">${clubCrest({nom:opp.nom,couleurs:opp.couleurs},52)}<b>${opp.nom}</b><small>${opp.note}</small></div>`;
    card.appendChild(tb);
    const play = el("button","btn primary big",icon("play")+_t("Jouer le match")); play.onclick=()=>playIntlTie(); card.appendChild(play);
    const sim = el("button","btn ghost",icon("forward")+_t("Simuler ce tour")); sim.onclick=()=>{ FM.resolveTournamentRound(comp); renderTournament(); }; card.appendChild(sim);
  } else {
    card.appendChild(el("p","round-name",`${meN.nom} a été éliminé.`));
    const b = el("button","btn ghost",_t("Simuler jusqu'à la fin")); b.onclick=()=>{ let g=0; while(!comp.finished&&g++<10) FM.resolveTournamentRound(comp); renderTournament(); }; card.appendChild(b);
  }
  body.appendChild(card);
  renderCupHistory(body, comp);

  const foot = el("div","footbar");
  if (intlCareer){
    const r = el("button","btn ghost small",_t("Retour à la carrière"));
    r.onclick=()=>{ currentTab="accueil"; renderGame(); };
    foot.appendChild(r);
  } else {
    const q = el("button","btn ghost small",_t("Menu principal")); q.onclick=()=>renderStart();
    foot.appendChild(q);
  }
  app.appendChild(foot);
}

function playIntlTie(){
  const comp = intlComp;
  const tie = FM.playerTie(comp); if(!tie){ renderTournament(); return; }
  const [a,b] = tie;
  const A = comp.teams[a], B = comp.teams[b];
  const playerA = (a===comp.playerSeed);
  const me = comp.teams[comp.playerSeed], opp = comp.teams[playerA?b:a];
  comp._tac = comp._tac || { mentalite:1, tempo:1, pressing:1, moral:0 };
  const tac = comp._tac; tac.moral = 0;
  const forced = FM.clearNationFlags(me) || [];
  FM.clearNationFlags(opp);
  if (forced.length) toast(forced.join(" · "));
  let pen=null;
  playLiveMatch({
    home:{nom:A.nom,couleurs:A.couleurs}, away:{nom:B.nom,couleurs:B.couleurs},
    label:comp.nom, manager:nationManager(me, tac),
    tick:(m)=>FM.nationLiveTick(A, B, m, playerA?tac:null, playerA?null:tac),
    fatigue:()=>{ FM.nationLiveFatigue(A, playerA?tac.pressing:1); FM.nationLiveFatigue(B, playerA?1:tac.pressing); },
    isMine:(ev)=> (ev.home && playerA) || (!ev.home && !playerA),
    applyIncident:(inc)=>{ FM.applyNationIncident(inc.home?A:B, inc); },
    endText:(hs,as)=>{
      if (hs===as) pen = FM.penaltyShootout(comp,a,b);
      const self=playerA?hs:as, o=playerA?as:hs;
      const won = self>o || (self===o && pen && ((playerA?pen[0]:pen[1])>(playerA?pen[1]:pen[0])));
      return qualChip(won)+(pen?` (tab ${playerA?pen[0]:pen[1]}-${playerA?pen[1]:pen[0]})`:"");
    },
    done:(hs,as,goals)=>{
      (me.squad||[]).forEach(p=>{ if(p.blessure>0||p.suspension>0) p._justOut=true; });
      const winner = hs>as?a : as>hs?b : (pen[0]>pen[1]?a:b);
      FM.resolveTournamentRound(comp, { as:hs, es:as, pen, winner, twoLeg:false, ev1:goals });
      renderTournament();
    }
  });
}

/* ============= MERCATO ============= */
let marketFilter = { type:"all", poste:"", posteExact:"", noteMin:0, potMin:0, ageMax:40, valeurMax:0, sort:"note", q:"" };
function renderMarket(body){
  const my = FM.myClub();
  const w = FM.transferWindow();
  const head = el("div","card");
  head.innerHTML = `<h3>${icon("market")}${_t("Mercato")} — Budget : <span class="${my.budget<0?'neg':'pos'}">${money(my.budget)}</span></h3>
    <div class="mkt-window ${w.open?'open':'closed'}">
      <b><span class="dot ${w.open?'on':'off'}"></span>${w.nom}</b> — ${w.info}
      ${w.open?'':'<small>Aucun achat, vente ou prêt possible pour vous comme pour les clubs IA.</small>'}
    </div>`;

  const listBox = el("div","card"); listBox.id="marketList";
  const filters = el("div","market-filters");
  const mkSel = (opts, cur, on, cls)=>{
    const s=el("select"); if(cls)s.className=cls;
    /* Traduction centralisée : les libellés d'options étaient écrits en clair
       dans chaque appel et restaient donc en français en mode anglais. */
    opts.forEach(([v,l])=>s.appendChild(new Option(_t(String(l)),v)));
    s.value=cur; s.onchange=()=>{ on(s.value); refreshMarket(listBox); }; return s;
  };
  const q = el("input"); q.type="text"; q.placeholder=_t("Nom du joueur…"); q.value=marketFilter.q;
  q.oninput=()=>{ marketFilter.q=q.value; refreshMarket(listBox); };
  filters.appendChild(q);

  // Type : tous / agents libres / transférables / en prêt
  filters.appendChild(mkSel([["all","Tous les joueurs"],["libre",_t("Agents libres")],["transf","Transférables"],["pret",_t("Disponibles en prêt")]],
    marketFilter.type, v=>marketFilter.type=v));
  // Poste exact
  const posOpts = [["","Tous postes"]].concat(FM.POSITIONS.map(p=>[p, `${p} · ${_t(FM.POS_LABEL[p])}`]));
  filters.appendChild(mkSel(posOpts, marketFilter.posteExact, v=>marketFilter.posteExact=v));
  // Note min
  filters.appendChild(mkSel([[0,"Toute note"],[60,"Note ≥ 60"],[70,"Note ≥ 70"],[75,"Note ≥ 75"],[80,"Note ≥ 80"],[85,"Note ≥ 85"]],
    marketFilter.noteMin, v=>marketFilter.noteMin=parseInt(v,10)));
  // Potentiel min
  filters.appendChild(mkSel([[0,"Tout potentiel"],[75,"Potentiel ≥ 75"],[80,"Potentiel ≥ 80"],[85,"Potentiel ≥ 85"],[90,"Potentiel ≥ 90"]],
    marketFilter.potMin, v=>marketFilter.potMin=parseInt(v,10)));
  // Âge max
  filters.appendChild(mkSel([[40,"Tout âge"],[19,"≤ 19 ans"],[21,"≤ 21 ans"],[23,"≤ 23 ans"],[25,"≤ 25 ans"],[28,"≤ 28 ans"],[32,"≤ 32 ans"]],
    marketFilter.ageMax, v=>marketFilter.ageMax=parseInt(v,10)));
  // Valeur max (budget)
  /* « ≤ mon budget » doit refléter le budget RÉEL : arrondi à l'entier et
     planché à 1, il proposait des joueurs inabordables dès que la trésorerie
     passait sous 1 M€ — ou devenait négative. */
  const plafondBudget = Math.max(0.1, Math.floor(my.budget*10)/10);
  filters.appendChild(mkSel([[0,"Tout prix"],[1,"≤ 1 M€"],[5,"≤ 5 M€"],[15,"≤ 15 M€"],[30,"≤ 30 M€"],[60,"≤ 60 M€"],[plafondBudget,"≤ mon budget"]],
    marketFilter.valeurMax, v=>marketFilter.valeurMax=parseFloat(v)));
  // Tri
  filters.appendChild(mkSel([["note","Trier : note"],["pot","Trier : potentiel"],["valeur","Trier : valeur ↓"],["valeurAsc","Trier : valeur ↑"],["age","Trier : âge ↑"]],
    marketFilter.sort, v=>marketFilter.sort=v));

  head.appendChild(filters);
  body.appendChild(head);
  body.appendChild(listBox);
  refreshMarket(listBox);
}
function refreshMarket(container){
  container.innerHTML="";
  const my = FM.myClub();
  const loanMode = marketFilter.type==="pret";
  const list = loanMode
    ? FM.loanablePlayers({ posteExact:marketFilter.posteExact, noteMin:marketFilter.noteMin,
        ageMax: marketFilter.ageMax===40?null:marketFilter.ageMax, q:marketFilter.q, limit:80 })
    : FM.transferMarket({
        type: marketFilter.type, posteExact: marketFilter.posteExact,
        noteMin: marketFilter.noteMin, potMin: marketFilter.potMin,
        ageMax: marketFilter.ageMax===40?null:marketFilter.ageMax,
        valeurMax: marketFilter.valeurMax||null, sort: marketFilter.sort,
        q: marketFilter.q, limit:80
      });
  const table = el("table","squad-table");
  table.innerHTML = `<thead><tr><th>${_t("Poste")}</th><th>${_t("Nom")}</th><th>${_t("Club")}</th><th>${_t("Âge")}</th><th>${_t("Note")}</th><th>${loanMode?_t("Pot"):_t("Valeur")}</th><th>${_t("Statut")}</th><th></th></tr></thead>`;
  const tb = el("tbody");
  list.forEach(p=>{
    const tr = el("tr", p.dispo?"listed":"");
    tr.innerHTML = `<td><span class="pos-badge ${p.groupe}">${p.pos}</span></td>
      <td><a class="player-link">${p.nom}</a> ${FLAG(p.nat)}</td><td>${p.clubNom}</td><td>${p.age}</td>
      <td><b class="note ${noteClass(p.note)}">${p.note}</b></td>
      <td>${loanMode?p.potentiel:(p.valeur.toFixed(1)+' M€')}</td>
      <td>${loanMode?('<span class="tag loan-tag">'+_t("prêt")+' '+FM.loanFee(p).toFixed(1)+' M€</span>')
        :(p.libre?'<span class="tag free">'+_t("Libre")+'</span>':(p.dispo?'<span class="tag">'+_t("Transférables")+'</span>':'—'))}</td><td></td>`;
    tr.querySelector(".player-link").onclick=()=> openPlayerCard(p, p.clubNom);
    const mktOpen = FM.marketOpen();
    if (loanMode){
      const btn = el("button","btn tiny primary",_t("Prêter chez moi"));
      if(!mktOpen){ btn.disabled=true; btn.title=_t("Hors période de mercato"); }
      btn.onclick=()=>{ const r=FM.loanIn(p.id); toast(r.msg); renderGame(); };
      tr.lastChild.appendChild(btn);
    } else {
      const btn = el("button","btn tiny primary",p.libre?_t("Signer"):_t("Offre"));
      if(!mktOpen){ btn.disabled=true; btn.title="Hors période de mercato"; }
      btn.onclick=()=> openBid(p);
      tr.lastChild.appendChild(btn);
    }
    tb.appendChild(tr);
  });
  table.appendChild(tb);
  const scroll = el("div","table-scroll"); scroll.appendChild(table);
  container.appendChild(scroll);
  if(!list.length) container.appendChild(el("p","hint",loanMode?"Aucun joueur disponible en prêt selon ces filtres.":"Aucun joueur ne correspond aux filtres."));
}
function openBid(p){
  const my = FM.myClub();
  const overlay = el("div","overlay");
  const box = el("div","card picker");
  const prime = p.libre ? FM.freeAgentPrime(p, my.rep) : 0;
  const suggested = p.libre ? prime : Math.round(p.valeur*(p.dispo?1.0:1.2)*10)/10;
  box.innerHTML = `<h3>${p.libre?'Signer '+p.nom+' (libre)':'Offre pour '+p.nom}</h3>
    <p><span class="pos-badge ${p.groupe}">${p.pos}</span> ${FM.POS_LABEL[p.pos]} · ${p.clubNom} · ${p.age} ans · Note <b>${p.note}</b></p>
    <p>Valeur estimée : <b>${p.valeur.toFixed(1)} M€</b> · Votre budget : <b>${my.budget.toFixed(1)} M€</b>${p.libre?` · <b>prime demandée ≈ ${prime.toFixed(1)} M€</b> (aucune indemnité de transfert)`:''}</p>`;
  const inp = el("input"); inp.type="number"; inp.step="0.5"; inp.min="0"; inp.value=suggested;
  box.appendChild(el("label",null,p.libre?"Prime à la signature (M€)":"Montant de l'offre (M€)"));
  box.appendChild(inp);
  const msg = el("p","bid-msg","");
  const send = el("button","btn primary",_t("Soumettre l'offre"));
  send.onclick=()=>{
    /* un champ vidé donne parseFloat("") === NaN : on le refuse ici, avant
       même d'appeler le moteur, pour donner un message clair */
    const montant = parseFloat(inp.value);
    if (!FM.validAmount(montant)){
      msg.textContent = _t("Saisissez un montant en M€ (chiffres uniquement).");
      msg.className = "bid-msg ko";
      inp.focus();
      return;
    }
    const r = FM.buyPlayer(p.id, montant);
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
  card.appendChild(el("h3",null,icon("table")+`${FM.myClub().ligueNom} — ${_t("Saison")} ${FM.state.saison}`));
  const t = FM.table();
  const table = el("table","rank-table");
  table.innerHTML = `<thead><tr><th>#</th><th>${_t("Club")}</th><th>J</th><th>G</th><th>N</th><th>P</th><th>BP</th><th>BC</th><th>Diff</th><th>Pts</th></tr></thead>`;
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
  card.appendChild(el("p","legend",_t("Ligue des Champions (1-3) · Europa (4-6) · Relégation (3 derniers)")));
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
  board(icon("ball")+_t("Meilleurs buteurs"), lb.buteurs, p=>`<b>${p.buts}</b> — ${p.nom} <small>(${p.clubNom})</small>`);
  board(icon("squad")+_t("Meilleurs passeurs"), lb.passeurs, p=>`<b>${p.passes||0}</b> — ${p.nom} <small>(${p.clubNom})</small>`);
  board(icon("target")+_t("Meilleures notes"), lb.notes, p=>`<b>${FM.playerAvgNote(p).toFixed(2)}</b> — ${p.nom} <small>(${p.clubNom}, ${p.noteMatchs} m)</small>`);
  body.appendChild(boards);
}

/* Marqueurs de coupe programmés sur la journée `j` du championnat */
function cupMarkersFor(j){
  const out = [];
  const cup = FM.state.coupe, e = FM.state.europe;
  const mk = (mark, txt, done) => {
    const d = el("div","fixture cup-marker"+(done?" done":""));
    d.innerHTML = `<span class="jd">${mark}</span><span class="cm-txt">${txt}</span>`;
    return d;
  };
  if (cup){
    for (let r=0; r<=cup.round && r<8; r++){
      if (FM.CUP_FIRST + r*FM.CUP_EVERY !== j) continue;
      const hist = cup.history[r];
      if (hist){
        const t = hist.ties.find(t=>t.a===cup.playerSeed||t.b===cup.playerSeed);
        let txt = `${cup.nom} — ${hist.nom}`;
        if (t){ const win = t.winner===cup.playerSeed;
          txt += t.bye ? " · "+_t("exempt") : ` · ${t.as}-${t.es} `+qualChip(win); }
        out.push(mk(compMark(cup), txt, true));
      } else if (!cup.finished && cup.playerAlive){
        out.push(mk(compMark(cup), `${cup.nom} — ${FM.roundName(cup.alive.length)} · ${_t("à jouer")}`, false));
      }
    }
  }
  if (e && e.playerComp){
    const comp = e[e.playerComp];
    for (let r=0; r<comp.lp.rounds; r++){
      if (FM.EURO_FIRST + r*FM.EURO_EVERY !== j) continue;
      const played = r < comp.lp.cur;
      out.push(mk(compMark(comp), `${comp.nom} — ${_t("phase de ligue")} J${r+1}${played?" · "+_t("jouée"):" · "+_t("à jouer")}`, played));
    }
    if (comp.ko){
      for (let r=0; r<4; r++){
        if (FM.EUROKO_FIRST + r*FM.EUROKO_EVERY !== j) continue;
        const played = r < comp.ko.round;
        out.push(mk(compMark(comp), `${comp.nom} — ${_t("phase finale")}, ${_t("tour")} ${r+1}${played?" · "+_t("joué"):" · "+_t("à jouer")}`, played));
      }
    }
  }
  return out;
}

/* ============= CALENDRIER ============= */
function renderCalendar(body){
  const my = FM.myClub();

  // Rendez-vous internationaux à suivre (Coupe du Monde / Euro — facultatif)
  const pi = FM.state.pendingIntl;
  const pal = FM.state.intlPalmares || [];
  if ((pi && !pi.fait) || pal.length){
    const ic = el("div","card intl-cal");
    ic.appendChild(el("h3",null,icon("globe")+_t("Rendez-vous internationaux")));
    if (pi && !pi.fait){
      const wc = pi.kind==="WC";
      const row = el("div","intl-fixture upcoming");
      row.innerHTML = `<span class="jd">Été</span>
        <span class="if-t">${wc?_t("Coupe du Monde"):_t("Championnat d'Europe")}</span>
        <span class="if-s">à suivre</span>
        <span class="if-note">facultatif · votre sélection : <b>${pi.defaultNation}</b> · jouable depuis l'Accueil</span>`;
      ic.appendChild(row);
    }
    pal.slice(0,6).forEach(e=>{
      const row = el("div","intl-fixture "+(e.playerWon?"won":"done"));
      row.innerHTML = `<span class="jd">S${e.saison}</span>
        <span class="if-t">${e.tournoi} — ${e.nation}</span>
        <span class="if-s">${e.playerWon?_t("Vainqueur"):_t("Terminé")}</span>
        <span class="if-note">Champion : <b>${e.champion}</b></span>`;
      ic.appendChild(row);
    });
    body.appendChild(ic);
  }

  const card = el("div","card");
  card.appendChild(el("h3",null,icon("calendar")+_t("Calendrier & résultats")));
  const list = el("div","fixtures");
  FM.state.calendrier.forEach((jd, i)=>{
    const m = jd.find(x=>x.dom===my.id||x.ext===my.id);
    if (!m) return;
    const dom = FM.clubById(m.dom), ext = FM.clubById(m.ext);
    // Rendez-vous de coupe rattachés à cette journée
    cupMarkersFor(i).forEach(mk=> list.appendChild(mk));
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
  card.appendChild(el("h3",null,icon("news")+_t("Journal du club")));
  if (!FM.state.news.length) card.appendChild(el("p","hint",_t("Rien à signaler pour l'instant.")));
  FM.state.news.forEach(n=> card.appendChild(newsItem(n,true)));
  body.appendChild(card);

  // Historique
  if (FM.state.historique.length){
    const h = el("div","card");
    h.appendChild(el("h3",null,icon("cup")+_t("Palmarès / historique")));
    FM.state.historique.forEach(s=> h.appendChild(el("p","news-item",
      `Saison ${s.saison} — ${FM.myClub().nom} : ${s.classement}${ord(s.classement)} · Champion : ${s.champion}`)));
    body.appendChild(h);
  }
}

/* ============= FINANCES ============= */
function renderFinances(body){
  const my = FM.myClub();
  const fin = FM.state.fin || { rec:0, sal:0 };
  const masse = FM.wageBill ? FM.wageBill(my) : my.joueurs.reduce((a,p)=>a+(p.salaire||0),0);
  const solde = fin.rec - fin.sal;
  const annuel = FM.seasonRevenue ? FM.seasonRevenue(my) : 0;
  const card = el("div","card");
  card.appendChild(el("h3",null,icon("coin")+_t("Finances")));
  const g = el("div","fin-grid");
  const cell = (lbl, val, cls) => `<div><small>${lbl}</small><b class="${cls||''}">${val}</b></div>`;
  g.innerHTML =
    cell(_t("Budget de transfert"), money(my.budget), my.budget<0?"neg":"pos") +
    cell(_t("Masse salariale"), masse.toFixed(0)+" k€/"+_t("sem")) +
    cell(_t("Recettes de la saison"), fin.rec.toFixed(1)+" M€") +
    cell(_t("Salaires versés"), fin.sal.toFixed(1)+" M€") +
    cell(_t("Solde de la saison"), (solde>=0?"+":"")+solde.toFixed(1)+" M€", solde<0?"neg":"pos") +
    cell(_t("Recettes annuelles"), annuel.toFixed(0)+" M€");
  card.appendChild(g);
  card.appendChild(el("p","hint",
    _t("Les salaires sont prélevés à chaque journée et les recettes encaissées de même. Un effectif surpayé finit dans le rouge ; un bon classement fait rentrer davantage.")));
  const exp = el("button","btn small",icon("upload")+_t("Exporter la partie"));
  exp.onclick = exportSaveFile;
  card.appendChild(exp);
  body.appendChild(card);
}

/* ============= CENTRE DE FORMATION ============= */
function renderAcademy(body){
  const jeunes = FM.state.jeunesSaison || [];
  if (!jeunes.length) return;
  const my = FM.myClub();
  const card = el("div","card");
  card.appendChild(el("h3",null,icon("squad")+_t("Centre de formation")));
  card.appendChild(el("p","hint",_t("Ces joueurs viennent d'être intégrés à votre effectif. Leur potentiel indique jusqu'où ils peuvent monter.")));
  jeunes.forEach(j=>{
    const p = FM.getPlayer ? FM.getPlayer(my, j.id) : null;
    const row = el("div","inj-row");
    row.innerHTML = `<span><span class="pos-badge ${(FM.POS_GROUP&&FM.POS_GROUP[j.pos])||'M'}">${j.pos}</span> `
      + `<b>${j.nom}</b> — ${j.age} ${_t("ans")}</span>`
      + `<span>${_t("Note")} <b class="note ${noteClass(j.note)}">${(p?p.note:j.note)}</b>`
      + ` · ${_t("Potentiel")} <b>${j.potentiel}</b></span>`;
    card.appendChild(row);
  });
  body.appendChild(card);
}

/* ============= SAUVEGARDE : EXPORT / IMPORT ============= */
function exportSaveFile(){
  try{
    const blob = new Blob([FM.exportSave()], {type:"application/json"});
    const a = el("a");
    a.href = URL.createObjectURL(blob);
    a.download = `euro-manager-S${FM.state.saison}-J${FM.state.journee}.json`;
    document.body.appendChild(a); a.click();
    setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 600);
    toast(_t("Partie exportée."));
  }catch(e){ toast(_t("Export impossible.")); }
}
function importSaveFile(onDone){
  const f = el("input"); f.type="file"; f.accept="application/json,.json"; f.style.display="none";
  f.onchange = ()=>{
    const file = f.files && f.files[0]; if(!file) return;
    const r = new FileReader();
    r.onload = ()=>{
      const err = FM.importSave(String(r.result));
      if (err) toast(_t("Fichier de partie invalide")+" — "+err);
      else { toast(_t("Partie importée.")); onDone && onDone(); }
    };
    r.readAsText(file);
  };
  document.body.appendChild(f); f.click();
  setTimeout(()=>f.remove(), 1000);
}

/* Bandeau d'alerte : le navigateur n'enregistre plus la partie */
function saveAlert(){
  if (!FM.saveError) return null;
  const w = el("div","save-alert");
  w.innerHTML = `<span class="sa-txt"><b>${_t("Sauvegarde impossible")}</b> `
    + (FM.saveError==="quota"
        ? _t("La mémoire du navigateur est pleine : votre progression n'est plus enregistrée.")
        : _t("Le navigateur refuse d'enregistrer la partie."))
    + "</span>";
  const b = el("button","btn small", icon("upload")+_t("Exporter la partie"));
  b.onclick = exportSaveFile;
  w.appendChild(b);
  return w;
}

/* ============= BANDE SON ============= */
function audioBar(){
  const bar = el("div","audio-bar");
  if (!FM.audio || !FM.audio.available()){
    bar.appendChild(el("small",null,_t("Audio indisponible sur ce navigateur.")));
    return bar;
  }
  const draw = ()=>{
    bar.innerHTML = "";
    const on = FM.audio.isPlaying();
    const cur = FM.audio.current();

    const eq = el("div","eq"+(on?" play":""),"<i></i><i></i><i></i><i></i>");
    bar.appendChild(eq);

    const title = el("div","ab-title",
      `<b>${cur?cur.nom:"—"}</b><small>${_t("Bande son")}${cur&&cur.own?" · "+_t("votre fichier"):""}</small>`);
    bar.appendChild(title);

    const mk = (ic, cls, title2, fn)=>{
      const b = el("button","audio-btn"+(cls?" "+cls:""), icon(ic));
      b.title = title2; b.onclick = fn; bar.appendChild(b); return b;
    };
    mk("prev","",_t("Piste précédente"), ()=>FM.audio.prev());
    mk("play", on?"on":"", on?_t("Pause"):_t("Lecture"), ()=>{ FM.audio.toggle(); });
    if (on) bar.lastChild.innerHTML = icon("pause");
    mk("skip","",_t("Piste suivante"), ()=>FM.audio.next());

    const vol = el("input"); vol.type="range"; vol.min=0; vol.max=1; vol.step=.05;
    vol.value = FM.audio.volume(); vol.title=_t("Volume");
    vol.oninput = ()=> FM.audio.setVolume(parseFloat(vol.value));
    bar.appendChild(vol);

    const file = el("input"); file.type="file"; file.accept="audio/*";
    file.multiple = true; file.style.display="none";
    file.onchange = async ()=>{ await FM.audio.addFiles(Array.from(file.files||[])); };
    bar.appendChild(file);
    mk("upload","",_t("Ajouter mes propres musiques"), ()=>file.click());
    if (FM.audio.hasOwn()) mk("cross","",_t("Retirer mes musiques"), ()=>FM.audio.clearOwn());
  };
  FM.audio.onChange(()=>{ if (bar.isConnected) draw(); });
  draw();
  return bar;
}

/* ============= HELPERS UI ============= */
function noteClass(n){ return n>=82?"elite":n>=75?"good":n>=68?"ok":"low"; }
function formeIcon(f){ return f>=2?"↑":f===1?"↗":f===0?"→":f===-1?"↘":"↓"; }
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
  if (FM.audio) FM.audio.restore();
});
