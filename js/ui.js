/* ============================================================
   INTERFACE — rendu des écrans & interactions
   ============================================================ */
var FM = window.FM;
var $ = sel => document.querySelector(sel);
const el = (tag, cls, html) => { const e=document.createElement(tag); if(cls)e.className=cls; if(html!=null)e.innerHTML=html; return e; };
const money = m => (m>=0? "" : "-") + Math.abs(m).toFixed(1) + " M€";
const FLAG = {
  FRA:"🇫🇷",ENG:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",ESP:"🇪🇸",ITA:"🇮🇹",GER:"🇩🇪",POR:"🇵🇹",BRA:"🇧🇷",ARG:"🇦🇷",NED:"🇳🇱",BEL:"🇧🇪",
  GRE:"🇬🇷",CRO:"🇭🇷",NOR:"🇳🇴",DEN:"🇩🇰",SUI:"🇨🇭",AUT:"🇦🇹",TUR:"🇹🇷",UKR:"🇺🇦",SRB:"🇷🇸",POL:"🇵🇱",
  SWE:"🇸🇪",SCO:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",HUN:"🇭🇺",CZE:"🇨🇿",WAL:"🏴󠁧󠁢󠁷󠁬󠁳󠁿",ROU:"🇷🇴",URU:"🇺🇾",COL:"🇨🇴",ECU:"🇪🇨",CHI:"🇨🇱",
  PER:"🇵🇪",PAR:"🇵🇾",MAR:"🇲🇦",SEN:"🇸🇳",NGA:"🇳🇬",EGY:"🇪🇬",ALG:"🇩🇿",CIV:"🇨🇮",CMR:"🇨🇲",GHA:"🇬🇭",
  TUN:"🇹🇳",JPN:"🇯🇵",KOR:"🇰🇷",IRN:"🇮🇷",AUS:"🇦🇺",KSA:"🇸🇦",MEX:"🇲🇽",USA:"🇺🇸",CAN:"🇨🇦",RUS:"🇷🇺",
  SVK:"🇸🇰",SVN:"🇸🇮",IRL:"🇮🇪",NIR:"🇬🇧",ISL:"🇮🇸",FIN:"🇫🇮",BIH:"🇧🇦",ALB:"🇦🇱",MKD:"🇲🇰",BUL:"🇧🇬",
  GEO:"🇬🇪",ISR:"🇮🇱",MNE:"🇲🇪",KOS:"🇽🇰",BLR:"🇧🇾",KAZ:"🇰🇿",VEN:"🇻🇪",BOL:"🇧🇴",RSA:"🇿🇦",MLI:"🇲🇱",
  BFA:"🇧🇫",COD:"🇨🇩",GUI:"🇬🇳",CPV:"🇨🇻",GAB:"🇬🇦",ZAM:"🇿🇲",ANG:"🇦🇴",QAT:"🇶🇦",IRQ:"🇮🇶",UAE:"🇦🇪",
  UZB:"🇺🇿",JOR:"🇯🇴",CHN:"🇨🇳",OMA:"🇴🇲",VIE:"🇻🇳",THA:"🇹🇭",CRC:"🇨🇷",PAN:"🇵🇦",JAM:"🇯🇲",HON:"🇭🇳",
  SLV:"🇸🇻",TRI:"🇹🇹",NZL:"🇳🇿"
};

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

    const info = el("p","ml-info","🎮 Vous démarrez dans le <b>championnat de votre choix</b> (sélectionné ci-dessus), à la place de son club le plus faible, avec un effectif « maison » aux <b>noms iconiques (Castolo, Espimas, Minanda…)</b> et un petit budget. Piochez parmi les <b>agents libres</b> ou achetez à d'autres clubs, puis bâtissez une grande équipe au fil des saisons — comme la Ligue des Masters d'antan.");
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
             ["mercato","💱 Mercato"],["europe","🏆 Europe"],["coupe","🏅 Coupe"],["classement","📊 Classement"],
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
    case "coupe": renderDomesticCup(body); break;
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

/* Agenda unifié : championnat + coupes, avec les tours en retard mis en avant */
function renderAgenda(body){
  const evs = FM.pendingEvents().filter(e=>e.kind!=="intl");   // l'intl a sa propre bannière
  const cups = evs.filter(e=>e.kind!=="league");
  if (!cups.length) return;                                    // rien d'autre que le championnat
  const card = el("div","card agenda-card");
  card.appendChild(el("h3",null,"📌 Rendez-vous à jouer"));
  cups.forEach(ev=>{
    const row = el("div","agenda-row"+(ev.enRetard?" late":""));
    row.innerHTML = `<span class="ag-emoji">${ev.emoji}</span>
      <span class="ag-txt"><b>${ev.titre}</b><small>${ev.detail}</small></span>
      ${ev.enRetard?'<span class="ag-badge">à jouer</span>':''}`;
    const go = el("button","btn small primary","▶ Y aller");
    go.onclick=()=>{ currentTab = (ev.kind==="coupe") ? "coupe" : "europe"; renderGame(); };
    row.appendChild(go);
    card.appendChild(row);
  });
  card.appendChild(el("p","hint","Ces rencontres sont rattachées à votre calendrier : elles apparaissent ici et dans l'onglet Calendrier."));
  body.appendChild(card);
}

/* ============= ACCUEIL ============= */
function renderHome(body){
  const my = FM.myClub();

  // Agenda unifié : tous les rendez-vous (championnat + coupes) au même endroit
  renderAgenda(body);

  // Bannière : tournoi international de l'été (Coupe du Monde / Euro) à disputer
  const pi = FM.state.pendingIntl;
  if (pi && !pi.fait){
    const wc = pi.kind==="WC";
    const noms = wc ? FM.nationsList() : FM.nationsForEuro();
    const banner = el("div","card intl-banner");
    banner.innerHTML = `<h3>${wc?"🌍 Coupe du Monde":"🇪🇺 Championnat d'Europe"} — cet été</h3>
      <p>Prenez en main une sélection nationale et disputez le tournoi (élimination directe), en parallèle de votre carrière.</p>`;
    const row = el("div","intl-pick");
    const sel = el("select");
    noms.forEach(n=> sel.appendChild(new Option(n, n)));
    sel.value = noms.includes(pi.defaultNation) ? pi.defaultNation : noms[0];
    row.appendChild(el("label",null,"Sélection : "));
    row.appendChild(sel);
    banner.appendChild(row);
    const go = el("button","btn primary big",(wc?"🌍":"🇪🇺")+" Disputer le tournoi");
    go.onclick=()=> startCareerIntl(pi.kind, sel.value);
    banner.appendChild(go);
    const skip = el("button","btn ghost","Passer (ne pas participer)");
    skip.onclick=()=>{ FM.state.pendingIntl.fait=true; FM.save(); renderGame(); };
    banner.appendChild(skip);
    body.appendChild(banner);
  }

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
  if (use3D()){ window.FM3D.play({home,away,hs,as,events,label:opts.label,endText:opts.endText,
      minStart:opts.minStart, minEnd:opts.minEnd, startHs:opts.startHs, startAs:opts.startAs,
      contBtn:opts.contBtn}, onDone); return; }
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
  const MIN0 = opts.minStart||0, MIN1 = opts.minEnd||90;
  let s=opts.startHs||0,o=opts.startAs||0,idx=0,minute=MIN0,timer;
  sEl.textContent=`${s} - ${o}`;
  const line = e => el("div","feed-line "+(e.home?"left":"right"),`<span class="fmin">${e.min}'</span> ⚽ <b>${e.joueur}</b>`);
  function finish(){ clearInterval(timer); s=hs;o=as; sEl.textContent=`${s} - ${o}`;
    mEl.textContent=(opts.endText?opts.endText+" · ":"")+(MIN1>=90?"Coup de sifflet final ⏱":"Mi-temps ⏸");
    skip.textContent=opts.contBtn||"✔ Continuer"; skip.className="btn primary"; skip.onclick=()=>{ overlay.remove(); onDone&&onDone(); }; }
  skip.onclick=finish;
  timer=setInterval(()=>{ minute+=3; if(minute>MIN1){finish();return;}
    mEl.textContent=`${opts.label?opts.label+" · ":""}${minute}'`;
    while(idx<ord.length && ord[idx].min<=minute){ const e=ord[idx++]; if(e.home)s++;else o++;
      sEl.textContent=`${s} - ${o}`; const l=line(e); l.classList.add("flash"); feed.prepend(l); }
  },220);
}

/* ============= MATCH INTERACTIF (causerie → 1re MT → pause → 2e MT) =============
   Vos choix ont un effet RÉEL : la causerie modifie le moral, et les réglages
   + remplacements de la mi-temps sont pris en compte dans la 2e période.      */
function playMatchFlow(){
  const my = FM.myClub();
  if (my.onze.filter(s=>!s.id).length){ toast("⚠ Onze incomplet — complétez votre équipe (Tactique)."); currentTab="tactique"; renderGame(); return; }
  // Un tour de coupe en retard ne doit pas passer à la trappe
  const bloc = FM.blockingEvents();
  if (bloc.length && !confirm(`${bloc[0].emoji} ${bloc[0].titre} est à jouer avant de poursuivre le championnat.\n\nOK = y aller · Annuler = jouer quand même le championnat`)){
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
function playMatchHalves(cfg){
  const mg = cfg.managed;
  const evMap = e => ({ min:e.min, joueur:e.joueur,
    home: (cfg.homeId!==undefined && e.clubId!==undefined) ? (e.clubId===cfg.homeId)
          : (e.home!==undefined ? e.home : (e.side==="a")) });
  function kickoff(){
    const h1 = cfg.simHalf(1);
    watchMatch(cfg.home, cfg.away, h1.hs, h1.as, h1.events.map(evMap),
      { label:(cfg.label||"")+" · 1re mi-temps", minStart:0, minEnd:45,
        contBtn:"⏸ Aller à la mi-temps" }, ()=>{
      applyHalfBreak(mg);
      openHalftimePanel(mg, cfg, h1, ()=>{
        const h2 = cfg.simHalf(2);
        const hs = h1.hs+h2.hs, as = h1.as+h2.as;
        const all = h1.events.concat(h2.events).sort((a,b)=>a.min-b.min);
        const endText = cfg.endText ? cfg.endText(hs, as) : undefined;
        watchMatch(cfg.home, cfg.away, hs, as, h2.events.map(evMap),
          { label:(cfg.label||"")+" · 2e mi-temps", minStart:45, minEnd:90,
            startHs:h1.hs, startAs:h1.as, endText }, ()=>{
          if (mg && mg.club) FM.clearMatchFlags(mg.club);
          cfg.done(hs, as, all);
        });
      });
    });
  }
  if (mg) openTeamTalkPanel(mg, cfg, kickoff); else kickoff();
}

/* Fatigue de la pause (club : par joueur ; sélection : global) */
function applyHalfBreak(mg){
  if (!mg) return;
  if (mg.club) FM.applyHalfFatigue(mg.club);
  else if (mg.tac){ const pr=mg.tac.pressing; mg.tac.tired=(mg.tac.tired||0)+(pr===2?2:pr===1?0.8:0.2); }
}

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
  box.innerHTML = `<h3>🗣️ Causerie — ${cfg.label||"match"}</h3>`+head+
    `<p class="hint">Votre discours influe sur la performance de l'équipe.</p>`;
  [["calme","😌 Rassurer","Confiance en hausse — sans risque."],
   ["exigeant","🔥 Hausser le ton","Galvanise un groupe conquérant, crispe un groupe fragile."],
   ["neutre","😐 Consignes neutres","Aucun effet."]].forEach(([k,lbl,desc])=>{
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
function openHalftimePanel(mg, cfg, h1, next){
  const overlay = el("div","overlay");
  const box = el("div","card halftime-box");
  let subs = 0;
  const isClub = !!mg.club;
  const tac = isClub ? mg.club.tactique : mg.tac;
  function strengthLine(){
    if (!isClub) return `Sélection <b>${mg.nom}</b> — vos réglages s'appliquent à la 2e période (le pressing haut fatigue l'équipe).`;
    const st = FM.teamStrength(mg.club);
    return `Forces — attaque <b>${Math.round(st.att)}</b> · milieu <b>${Math.round(st.mid)}</b> · défense <b>${Math.round(st.def)}</b>. Le pressing haut fatigue ; les entrants sont frais.`;
  }
  function render(){
    box.innerHTML="";
    const mine = cfg.playerIsHome ? h1.hs : h1.as, theirs = cfg.playerIsHome ? h1.as : h1.hs;
    const verdict = mine>theirs ? "Vous menez" : mine<theirs ? "Vous êtes mené" : "Tout reste à faire";
    box.appendChild(el("h3",null,`⏸ Mi-temps — ${cfg.home.nom} ${h1.hs}-${h1.as} ${cfg.away.nom}`));
    box.appendChild(el("p","ht-verdict "+(mine>theirs?"win":mine<theirs?"lose":""),
      `${verdict}. Vos choix comptent pour la 2e période.`));
    const sl = el("p","hint"); sl.id="htStrength"; sl.innerHTML = strengthLine();
    box.appendChild(sl);
    const refresh = ()=>{ const n=document.getElementById("htStrength"); if(n) n.innerHTML=strengthLine(); };
    const set = (k,v)=>{ if(isClub) FM.setTactic(k,v); else tac[k]=v; refresh(); };
    const row = el("div","tac-row");
    row.appendChild(sliderTac("Mentalité",["Défensive","Équilibrée","Offensive"],tac.mentalite,v=>set("mentalite",v)));
    row.appendChild(sliderTac("Tempo",["Lent","Normal","Rapide"],tac.tempo,v=>set("tempo",v)));
    row.appendChild(sliderTac("Pressing",["Bas","Moyen","Haut"],tac.pressing,v=>set("pressing",v)));
    box.appendChild(row);
    if (isClub){
      const my = mg.club;
      box.appendChild(el("h4",null,`🔁 Remplacements (${subs}/3)`));
      const bench = my.joueurs.filter(p=>!my.onze.some(s=>s.id===p.id)).sort((a,b)=>b.note-a.note).slice(0,12);
      if (subs<3 && bench.length){
        const wrap = el("div","ht-subs");
        my.onze.forEach(s=>{
          const p = FM.getPlayer(my,s.id); if(!p) return;
          const line = el("div","ht-sub-row");
          line.innerHTML = `<span><span class="pos-badge ${p.groupe}">${s.slot}</span> ${p.nom} <b class="note ${noteClass(p.note)}">${p.note}</b>${p._tired?" <small>😮‍💨</small>":""}</span>`;
          const sel = el("select");
          sel.appendChild(new Option("— remplacer par —",""));
          bench.forEach(b=> sel.appendChild(new Option(`${b.pos} ${b.nom} (${b.note})`, b.id)));
          sel.onchange=()=>{ if(!sel.value) return;
            if (FM.substitute(my, p.id, parseInt(sel.value,10))){ subs++; FM.save(); render(); } };
          line.appendChild(sel);
          wrap.appendChild(line);
        });
        box.appendChild(wrap);
      } else if (subs>=3) box.appendChild(el("p","hint","Quota de remplacements atteint."));
    }
    const go = el("button","btn primary big","▶ Jouer la 2e mi-temps");
    go.onclick=()=>{ if(FM.state) FM.save(); overlay.remove(); next(); };
    box.appendChild(go);
  }
  render();
  overlay.appendChild(box); document.body.appendChild(overlay);
}

/* Match de championnat du club géré */
function runInteractiveMatch(dom, ext, opts, onFinish){
  const my = FM.myClub();
  FM.clearMatchFlags(my);
  const iAmHome = dom.id===my.id;
  playMatchHalves({
    home:{nom:dom.nom,couleurs:dom.couleurs}, away:{nom:ext.nom,couleurs:ext.couleurs},
    label:opts.label, oppName:(iAmHome?ext:dom).nom, playerIsHome:iAmHome,
    managed:{club:my},
    homeId:dom.id,
    simHalf:(h)=>{ const r=FM.simulateHalf(dom,ext,h);
      return { hs:r.domScore, as:r.extScore, events:r.events }; },     // évènements bruts
    done:(hs,as,ev)=> onFinish({ domScore:hs, extScore:as, events:ev })
  });
}

/* Causerie d'avant-match */


/* Écran de mi-temps : réglages tactiques + remplacements (effet réel en 2e MT) */


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
      <td><a class="player-link">${inXI?'⭐ ':''}${p.nom}</a></td>
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
    tr.querySelector(".player-link").onclick=()=> openPlayerCard(p, my.nom);
    if (p.loan && p.loan.borrowerId===my.id){
      // Joueur prêté chez nous : badge + rendre
      const badge = el("span","tag loan-tag","🔁 Prêt "+(p.loan.parentNom||''));
      tr.lastChild.appendChild(badge);
      const rb = el("button","btn tiny danger-ghost","Rendre");
      rb.onclick=()=>{ FM.recallLoan(p.id); renderGame(); };
      tr.lastChild.appendChild(rb);
    } else {
      const btn = el("button","btn tiny "+(p.transferListe?"danger-ghost":"ghost"), p.transferListe?"Retirer":"Vendre");
      btn.onclick=()=>{ FM.toggleTransferList(p.id); renderGame(); };
      tr.lastChild.appendChild(btn);
      const lb = el("button","btn tiny ghost","Prêter");
      if(!FM.marketOpen()){ lb.disabled=true; lb.title="Hors période de mercato"; }
      lb.onclick=()=>{ const r=FM.loanOut(p.id); toast(r.msg); renderGame(); };
      tr.lastChild.appendChild(lb);
    }
    tb.appendChild(tr);
  });
  table.appendChild(tb);
  const scroll = el("div","table-scroll"); scroll.appendChild(table);
  card.appendChild(scroll);
  card.appendChild(el("p","hint","💡 Cliquez sur un nom pour la fiche du joueur. « Prêter » envoie un joueur en prêt une saison ; les prêts entrants portent le badge 🔁."));
  body.appendChild(card);

  // Prêts sortants en cours (nos joueurs prêtés ailleurs)
  const loans = FM.myLoans();
  if (loans.out.length){
    const lc = el("div","card");
    lc.appendChild(el("h3",null,`🔁 Joueurs prêtés (${loans.out.length})`));
    loans.out.forEach(p=>{
      const row = el("div","offer-row");
      row.innerHTML = `<span><span class="pos-badge ${p.groupe}">${p.pos}</span> <b>${p.nom}</b> (${p.note}) → <b>${p.holderNom}</b> · retour fin de saison</span>`;
      const rb = el("button","btn small ghost","Rappeler");
      rb.onclick=()=>{ FM.recallLoan(p.id); renderGame(); };
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
    <td>${s.sel?('🎖️ '+s.sel.equipe):''}</td></tr>`).join("");
  const totMatch = carr.reduce((a,s)=>a+(s.matchs||0),0)+(p.matchs||0);
  const totButs = carr.reduce((a,s)=>a+(s.buts||0),0)+(p.buts||0);
  const totPasses = carr.reduce((a,s)=>a+(s.passes||0),0)+(p.passes||0);
  box.innerHTML = `
    <div class="pc-head">
      <div class="pc-badge ${p.groupe}">${p.pos}</div>
      <div class="pc-id"><b>${p.nom}</b> ${FLAG[p.nat]||''}
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
      <span>⚽ ${p.buts||0} buts</span><span>🅰️ ${p.passes||0} passes</span>
      <span>👟 ${p.matchs||0} matchs</span><span>🌟 ${p.noteMatchs?avg.toFixed(2):'—'} moy</span>
    </div>
    ${p.selJeunes?`<p class="pc-youth">🎖️ Convoqué en <b>${p.selJeunes.equipe}</b> (${p.selJeunes.matchs} matchs, ${p.selJeunes.buts} buts).</p>`:''}
    <div class="pc-career">
      <h4>Carrière — totaux : ${totMatch} matchs · ${totButs} buts · ${totPasses} passes</h4>
      ${carr.length?`<div class="table-scroll"><table class="squad-table"><thead><tr>
        <th>Saison</th><th>Club</th><th>M</th><th>⚽</th><th>🅰️</th><th>Moy</th><th>Note</th><th>Sélection</th>
        </tr></thead><tbody>${carrRows}</tbody></table></div>`
        :`<p class="hint">Première saison en cours — l'historique se construira au fil des saisons.</p>`}
    </div>`;
  const close = el("button","btn ghost","Fermer");
  close.onclick=()=>overlay.remove();
  box.appendChild(close);
  overlay.appendChild(box);
  overlay.onclick=e=>{ if(e.target===overlay) overlay.remove(); };
  document.body.appendChild(overlay);
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

/* ============= COUPE NATIONALE ============= */
function renderDomesticCup(body){
  const cup = FM.state.coupe;
  if (!cup){ body.appendChild(el("div","card",`<p class="hint">La coupe nationale se met en place en début de saison.</p>`)); return; }
  const me = FM.myClub();
  const card = el("div","card");
  card.appendChild(el("h3",null,`${cup.emoji} ${cup.nom} — ${me.nom}`));

  if (cup.finished){
    const won = cup.champion===cup.playerSeed;
    card.innerHTML += `<p class="euro-final ${won?'win':''}">${won?'🏆 VAINQUEUR DE LA COUPE ! Félicitations !':'Vainqueur : <b>'+(cup.teams[cup.champion]?cup.teams[cup.champion].nom:'—')+'</b>'}</p>`;
  } else if (cup.playerAlive){
    const tie = FM.playerTie(cup);
    const oppIdx = tie[0]===cup.playerSeed?tie[1]:tie[0];
    const opp = cup.teams[oppIdx];
    card.appendChild(el("p","round-name",`${FM.roundName(cup.alive.length)} · match sec`));
    if (opp.bye){
      // Exempt ce tour : qualification d'office
      card.appendChild(el("p","hint",`Votre club est <b>exempt</b> ce tour : qualifié d'office pour le tour suivant.`));
      const go = el("button","btn primary big","⏭ Tour suivant");
      go.onclick=()=>{ FM.resolveTournamentRound(cup); FM.save(); renderGame(); };
      card.appendChild(go);
    } else {
      const tieBox = el("div","tie-box");
      tieBox.innerHTML = `
        <div class="tie-side">${clubCrest(me,52)}<b>${me.nom}</b><small>${FM.squadRating(me)}</small></div>
        <div class="vs">VS</div>
        <div class="tie-side">${clubCrest({nom:opp.nom,couleurs:opp.couleurs},52)}<b>${opp.nom}</b><small>${opp.note}</small></div>`;
      card.appendChild(tieBox);
      const play = el("button","btn primary big","▶ Jouer le match");
      play.onclick=()=> playCupTie(cup, {noEuropeAdvance:true});
      card.appendChild(play);
      const sim = el("button","btn ghost","⏩ Simuler ce tour");
      sim.onclick=()=>{ FM.resolveTournamentRound(cup); FM.save(); renderGame(); };
      card.appendChild(sim);
    }
  } else {
    card.appendChild(el("p","round-name","Vous avez été éliminé de la coupe."));
    const b = el("button","btn ghost","⏩ Voir le vainqueur");
    b.onclick=()=>{ FM.autoCompleteCup(cup); FM.save(); renderGame(); };
    card.appendChild(b);
  }
  body.appendChild(card);
  renderCupHistory(body, cup);
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
  const homeT = comp.teams[pm.home], awayT = comp.teams[pm.away];
  const dom = FM.clubById(homeT.ref), ext = FM.clubById(awayT.ref);
  const my = FM.myClub(); FM.clearMatchFlags(my);
  playMatchHalves({
    home:{nom:homeT.nom,couleurs:homeT.couleurs}, away:{nom:awayT.nom,couleurs:awayT.couleurs},
    label:comp.nom+" · phase de ligue", oppName:(pm.playerHome?awayT:homeT).nom,
    playerIsHome:pm.playerHome, managed:{club:my}, homeId:dom.id,
    simHalf:(h)=>{ const r=FM.simulateHalf(dom,ext,h); return { hs:r.domScore, as:r.extScore, events:r.events }; },
    done:(hs,as)=>{ FM.lpResolveRound(comp,{hs,as}); FM.save(); renderGame(); }
  });
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
  // Exempt : qualification d'office, pas de match
  if (comp.teams[a].bye || comp.teams[b].bye){ finish(FM.simCupTie(comp,a,b)); return; }

  const playerA = (a===comp.playerSeed);
  const my = FM.myClub(); FM.clearMatchFlags(my);
  const infoOf = i => ({nom:comp.teams[i].nom, couleurs:comp.teams[i].couleurs});
  const clubOf = i => FM.clubById(comp.teams[i].ref);
  const oppNom = comp.teams[playerA?b:a].nom;
  const twoLeg = comp.kind==="club" && !comp.singleLeg && comp.alive.length > 2;
  const halfOf = (dom,ext) => (h)=>{ const r=FM.simulateHalf(dom,ext,h);
    return { hs:r.domScore, as:r.extScore, events:r.events }; };

  if (!twoLeg){
    const dom = clubOf(a), ext = clubOf(b);
    let pen = null;
    playMatchHalves({
      home:infoOf(a), away:infoOf(b), label:comp.nom, oppName:oppNom, playerIsHome:playerA,
      managed:{club:my}, homeId:dom.id, simHalf: halfOf(dom,ext),
      endText:(hs,as)=>{
        if (hs===as) pen = FM.penaltyShootout(comp,a,b);
        const self = playerA?hs:as, opp = playerA?as:hs;
        const won = self>opp || (self===opp && pen && ((playerA?pen[0]:pen[1])>(playerA?pen[1]:pen[0])));
        return (won?"✅ Qualifié":"❌ Éliminé") + (pen?` (tab ${playerA?pen[0]:pen[1]}-${playerA?pen[1]:pen[0]})`:"");
      },
      done:(hs,as,ev)=>{
        const winner = hs>as ? a : as>hs ? b : (pen[0]>pen[1] ? a : b);
        finish({ as:hs, es:as, pen, winner, twoLeg:false, ev1:ev });
      }
    });
    return;
  }
  // ALLER (a reçoit) puis RETOUR (b reçoit) — causerie et mi-temps à chaque manche
  const dom1 = clubOf(a), ext1 = clubOf(b);
  playMatchHalves({
    home:infoOf(a), away:infoOf(b), label:"Aller · "+comp.nom, oppName:oppNom, playerIsHome:playerA,
    managed:{club:my}, homeId:dom1.id, simHalf: halfOf(dom1,ext1),
    done:(l1h, l1a)=>{
      FM.clearMatchFlags(my);
      const dom2 = clubOf(b), ext2 = clubOf(a);
      let pen = null;
      playMatchHalves({
        home:infoOf(b), away:infoOf(a), label:"Retour · "+comp.nom, oppName:oppNom, playerIsHome:!playerA,
        managed:{club:my}, homeId:dom2.id, simHalf: halfOf(dom2,ext2),
        endText:(l2h, l2a)=>{
          const aggA = l1h + l2a, aggB = l1a + l2h;
          if (aggA===aggB) pen = FM.penaltyShootout(comp,a,b);
          const self = playerA?aggA:aggB, opp = playerA?aggB:aggA;
          const won = self>opp || (self===opp && pen && ((playerA?pen[0]:pen[1])>(playerA?pen[1]:pen[0])));
          return `Cumul ${self}-${opp}` + (pen?` · tab ${playerA?pen[0]:pen[1]}-${playerA?pen[1]:pen[0]}`:"") +
                 ` · ${won?"✅ Qualifié":"❌ Éliminé"}`;
        },
        done:(l2h, l2a, ev2)=>{
          const aggA = l1h + l2a, aggB = l1a + l2h;
          const winner = aggA>aggB ? a : aggB>aggA ? b : (pen[0]>pen[1] ? a : b);
          finish({ as:aggA, es:aggB, pen, winner, twoLeg:true,
                   leg1:{as:l1h, es:l1a}, leg2:{as:l2a, es:l2h} });
        }
      });
    }
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
let intlCareer = false;                 // tournoi disputé depuis une carrière ?
let intlKind = null, intlNation = null;

function startInternational(kind, nation){
  openSquadPicker(kind, nation, (squad, note)=>{
    intlComp = FM.makeNationTournament(kind, nation, {squad, note});
    intlCareer = false;
    renderTournament();
  });
}

/* Lance le tournoi international depuis une carrière (retour à la carrière ensuite) */
function startCareerIntl(kind, nation){
  openSquadPicker(kind, nation, (squad, note)=>{
    intlComp = FM.makeNationTournament(kind, nation, {squad, note});
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
  const GROUP_LBL={G:"🧤",D:"🛡",M:"⚙",A:"🎯"};

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
    side.appendChild(el("h4",null,`⭐ Titulaires (${stIds.length}/11)`));
    stIds.forEach(id=>side.appendChild(mk(id)));
    side.appendChild(el("h4",null,`🔁 Remplaçants (${bIds.length})`));
    if(!bIds.length) side.appendChild(el("p","hint","Ajoutez des remplaçants pour la profondeur de banc."));
    bIds.forEach(id=>side.appendChild(mk(id)));
    return side;
  }

  function render(){
    box.innerHTML="";
    box.appendChild(el("h3",null,`${kind==="WC"?"🌍 Coupe du Monde":"🇪🇺 Euro"} — Composez votre ${nation}`));
    box.appendChild(el("p","hint","Choisissez 11 titulaires + des remplaçants (23 max) parmi ~500 joueurs. ★ = titulaire, ✕ = retirer."));
    const cols=el("div","sp-cols");
    // --- Vivier (gauche) ---
    const left=el("div","sp-pool");
    const bar=el("div","sp-filters");
    const q=el("input"); q.type="text"; q.placeholder="Rechercher un joueur…"; q.value=fQ;
    q.oninput=()=>{ fQ=q.value; refreshPool(); };
    bar.appendChild(q);
    [["","Tous"],["G","🧤"],["D","🛡"],["M","⚙"],["A","🎯"]].forEach(([v,l])=>{
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
    const auto=el("button","btn ghost","↻ Sélection auto"); auto.onclick=()=>{ autoPick(); render(); };
    const go=el("button","btn primary big",(kind==="WC"?"🌍":"🇪🇺")+" Valider et jouer"); go.disabled=!validXI();
    go.onclick=()=>{ if(!validXI())return; const squad=[...sel.values()]; overlay.remove(); cb(squad, teamNote(), [...starters]); };
    const cancel=el("button","btn ghost","Annuler"); cancel.onclick=()=>{ overlay.remove(); if(FM.state){ currentTab="accueil"; renderGame(); } else renderStart(); };
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
    const play = el("button","btn primary big","▶ Jouer le match"); play.onclick=()=>playIntlTie(); card.appendChild(play);
    const sim = el("button","btn ghost","⏩ Simuler ce tour"); sim.onclick=()=>{ FM.resolveTournamentRound(comp); renderTournament(); }; card.appendChild(sim);
  } else {
    card.appendChild(el("p","round-name",`${meN.nom} a été éliminé.`));
    const b = el("button","btn ghost","⏩ Simuler jusqu'à la fin"); b.onclick=()=>{ let g=0; while(!comp.finished&&g++<10) FM.resolveTournamentRound(comp); renderTournament(); }; card.appendChild(b);
  }
  body.appendChild(card);
  renderCupHistory(body, comp);

  const foot = el("div","footbar");
  if (intlCareer){
    const r = el("button","btn ghost small","⬅ Retour à la carrière");
    r.onclick=()=>{ currentTab="accueil"; renderGame(); };
    foot.appendChild(r);
  } else {
    const q = el("button","btn ghost small","⏻ Menu principal"); q.onclick=()=>renderStart();
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
  comp._tac = comp._tac || { mentalite:1, tempo:1, pressing:1, moral:0, tired:0 };
  const tac = comp._tac; tac.tired = 0;             // fraîcheur retrouvée à chaque match
  let pen = null;
  playMatchHalves({
    home:{nom:A.nom,couleurs:A.couleurs}, away:{nom:B.nom,couleurs:B.couleurs},
    label:comp.nom, oppName:opp.nom, playerIsHome:playerA,
    managed:{ tac, nom:me.nom, note:me.note },
    simHalf:(h)=>{
      if (playerA){ const r=FM.simNationHalf(A,B,h,tac);
        return { hs:r.as, as:r.es, events:r.events.map(e=>({min:e.min,joueur:e.joueur,home:e.side==="a"})) }; }
      const r=FM.simNationHalf(B,A,h,tac);
      return { hs:r.es, as:r.as, events:r.events.map(e=>({min:e.min,joueur:e.joueur,home:e.side!=="a"})) };
    },
    endText:(hs,as)=>{
      if (hs===as) pen = FM.penaltyShootout(comp,a,b);
      const self = playerA?hs:as, o = playerA?as:hs;
      const won = self>o || (self===o && pen && ((playerA?pen[0]:pen[1])>(playerA?pen[1]:pen[0])));
      return (won?"✅ Qualifié":"❌ Éliminé") + (pen?` (tab ${playerA?pen[0]:pen[1]}-${playerA?pen[1]:pen[0]})`:"");
    },
    done:(hs,as,ev)=>{
      const winner = hs>as ? a : as>hs ? b : (pen[0]>pen[1] ? a : b);
      FM.resolveTournamentRound(comp, { as:hs, es:as, pen, winner, twoLeg:false, ev1:ev });
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
  head.innerHTML = `<h3>💱 Mercato — Budget : <span class="${my.budget<0?'neg':'pos'}">${money(my.budget)}</span></h3>
    <div class="mkt-window ${w.open?'open':'closed'}">
      <b>${w.open?'🟢 '+w.nom:'🔴 '+w.nom}</b> — ${w.info}
      ${w.open?'':'<small>Aucun achat, vente ou prêt possible pour vous comme pour les clubs IA.</small>'}
    </div>`;

  const listBox = el("div","card"); listBox.id="marketList";
  const filters = el("div","market-filters");
  const mkSel = (opts, cur, on, cls)=>{
    const s=el("select"); if(cls)s.className=cls;
    opts.forEach(([v,l])=>s.appendChild(new Option(l,v)));
    s.value=cur; s.onchange=()=>{ on(s.value); refreshMarket(listBox); }; return s;
  };
  const q = el("input"); q.type="text"; q.placeholder="Nom du joueur…"; q.value=marketFilter.q;
  q.oninput=()=>{ marketFilter.q=q.value; refreshMarket(listBox); };
  filters.appendChild(q);

  // Type : tous / agents libres / transférables / en prêt
  filters.appendChild(mkSel([["all","Tous les joueurs"],["libre","🆓 Agents libres"],["transf","Transférables"],["pret","🔁 Disponibles en prêt"]],
    marketFilter.type, v=>marketFilter.type=v));
  // Poste exact
  const posOpts = [["","Tous postes"]].concat(FM.POSITIONS.map(p=>[p, `${p} · ${FM.POS_LABEL[p]}`]));
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
  filters.appendChild(mkSel([[0,"Tout prix"],[1,"≤ 1 M€"],[5,"≤ 5 M€"],[15,"≤ 15 M€"],[30,"≤ 30 M€"],[60,"≤ 60 M€"],[Math.max(1,Math.floor(my.budget)),"≤ mon budget"]],
    marketFilter.valeurMax, v=>marketFilter.valeurMax=parseInt(v,10)));
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
  table.innerHTML = `<thead><tr><th>Poste</th><th>Nom</th><th>Club</th><th>Âge</th><th>Note</th><th>${loanMode?'Pot':'Valeur'}</th><th>Statut</th><th></th></tr></thead>`;
  const tb = el("tbody");
  list.forEach(p=>{
    const tr = el("tr", p.dispo?"listed":"");
    tr.innerHTML = `<td><span class="pos-badge ${p.groupe}">${p.pos}</span></td>
      <td><a class="player-link">${p.nom}</a> ${FLAG[p.nat]||''}</td><td>${p.clubNom}</td><td>${p.age}</td>
      <td><b class="note ${noteClass(p.note)}">${p.note}</b></td>
      <td>${loanMode?p.potentiel:(p.valeur.toFixed(1)+' M€')}</td>
      <td>${loanMode?('<span class="tag loan-tag">🔁 prêt '+FM.loanFee(p).toFixed(1)+' M€</span>')
        :(p.libre?'<span class="tag free">🆓 Libre</span>':(p.dispo?'<span class="tag">Transférable</span>':'—'))}</td><td></td>`;
    tr.querySelector(".player-link").onclick=()=> openPlayerCard(p, p.clubNom);
    const mktOpen = FM.marketOpen();
    if (loanMode){
      const btn = el("button","btn tiny primary","Prêter chez moi");
      if(!mktOpen){ btn.disabled=true; btn.title="Hors période de mercato"; }
      btn.onclick=()=>{ const r=FM.loanIn(p.id); toast(r.msg); renderGame(); };
      tr.lastChild.appendChild(btn);
    } else {
      const btn = el("button","btn tiny primary",p.libre?"Signer":"Offre");
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

/* Marqueurs de coupe programmés sur la journée `j` du championnat */
function cupMarkersFor(j){
  const out = [];
  const cup = FM.state.coupe, e = FM.state.europe;
  const mk = (emoji, txt, done) => {
    const d = el("div","fixture cup-marker"+(done?" done":""));
    d.innerHTML = `<span class="jd">${emoji}</span><span class="cm-txt">${txt}</span>`;
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
          txt += t.bye ? " · exempt" : ` · ${t.as}-${t.es} ${win?"✅":"❌"}`; }
        out.push(mk(cup.emoji, txt, true));
      } else if (!cup.finished && cup.playerAlive){
        out.push(mk(cup.emoji, `${cup.nom} — ${FM.roundName(cup.alive.length)} · à jouer`, false));
      }
    }
  }
  if (e && e.playerComp){
    const comp = e[e.playerComp];
    for (let r=0; r<comp.lp.rounds; r++){
      if (FM.EURO_FIRST + r*FM.EURO_EVERY !== j) continue;
      const played = r < comp.lp.cur;
      out.push(mk(comp.emoji, `${comp.nom} — phase de ligue J${r+1}${played?" · jouée":" · à jouer"}`, played));
    }
    if (comp.ko){
      for (let r=0; r<4; r++){
        if (FM.EUROKO_FIRST + r*FM.EUROKO_EVERY !== j) continue;
        const played = r < comp.ko.round;
        out.push(mk(comp.emoji, `${comp.nom} — phase finale, tour ${r+1}${played?" · joué":" · à jouer"}`, played));
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
    ic.appendChild(el("h3",null,"🌍 Rendez-vous internationaux"));
    if (pi && !pi.fait){
      const wc = pi.kind==="WC";
      const row = el("div","intl-fixture upcoming");
      row.innerHTML = `<span class="jd">Été</span>
        <span class="if-t">${wc?"🌍 Coupe du Monde":"🇪🇺 Championnat d'Europe"}</span>
        <span class="if-s">à suivre</span>
        <span class="if-note">facultatif · votre sélection : <b>${pi.defaultNation}</b> · jouable depuis l'Accueil</span>`;
      ic.appendChild(row);
    }
    pal.slice(0,6).forEach(e=>{
      const row = el("div","intl-fixture "+(e.playerWon?"won":"done"));
      row.innerHTML = `<span class="jd">S${e.saison}</span>
        <span class="if-t">${e.tournoi} — ${e.nation}</span>
        <span class="if-s">${e.playerWon?'🏆 Vainqueur':'Terminé'}</span>
        <span class="if-note">Champion : <b>${e.champion}</b></span>`;
      ic.appendChild(row);
    });
    body.appendChild(ic);
  }

  const card = el("div","card");
  card.appendChild(el("h3",null,"📅 Calendrier & résultats"));
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
