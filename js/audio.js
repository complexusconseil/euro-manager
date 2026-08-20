/* ============================================================
   EURO MANAGER — bande son
   Musiques originales synthétisées en Web Audio (aucun fichier,
   aucune requête réseau) dans l'esprit des menus de gestion des
   années 2000. Le joueur peut aussi charger ses propres fichiers
   audio : ils sont conservés localement (IndexedDB) et rejoués.
   ============================================================ */
(function(){
"use strict";
const FM = window.FM = window.FM || {};
FM.t = FM.t || (s=>s);

/* ---------- Théorie : gammes & accords ---------- */
const CH = { m:[0,3,7], M:[0,4,7], m7:[0,3,7,10], M7:[0,4,7,11],
             d7:[0,4,7,10], sus:[0,5,7], m6:[0,3,7,9] };
const hz = n => 440 * Math.pow(2, (n-69)/12);

/* ---------- Pistes originales ----------
   prog : suite d'accords [degré en demi-tons depuis la tonique, type]
   kick/snare/hat : masques de 16 doubles-croches
   bass : rythme (indices de pas) ; lead : [pas, degré d'accord, durée]
------------------------------------------- */
const TRACKS = [
{ id:"kickoff", nom:"Coup d'envoi", en:"Kick-off", bpm:126, root:45, mood:"drive",
  prog:[[0,"m"],[8,"M"],[5,"M"],[3,"M"]],
  kick:[0,4,8,10,14], snare:[4,12], hat:[0,2,4,6,8,10,12,14],
  bass:[0,3,6,8,11,14], lead:[[0,2,2],[2,1,2],[4,0,4],[8,2,2],[10,3,2],[12,2,4]],
  padType:"sawtooth", leadType:"square", bright:1 },

{ id:"floodlights", nom:"Sous les projecteurs", en:"Floodlights", bpm:112, root:48, mood:"open",
  prog:[[0,"M7"],[9,"m7"],[5,"M7"],[7,"d7"]],
  kick:[0,8], snare:[4,12], hat:[2,6,10,14],
  bass:[0,6,8,14], lead:[[0,0,4],[4,2,4],[8,3,2],[10,2,2],[12,1,4]],
  padType:"sawtooth", leadType:"triangle", bright:.75 },

{ id:"transfer", nom:"Fenêtre de transferts", en:"Transfer Window", bpm:118, root:43, mood:"tense",
  prog:[[0,"m"],[0,"m"],[10,"M"],[7,"sus"]],
  kick:[0,6,8,14], snare:[4,12], hat:[0,1,4,5,8,9,12,13],
  bass:[0,2,4,6,8,10,12,14], lead:[[0,0,1],[2,1,1],[4,2,1],[6,1,1],[8,3,1],[10,2,1],[12,1,2]],
  padType:"square", leadType:"sawtooth", bright:.85 },

{ id:"boardroom", nom:"Salle de conseil", en:"Boardroom", bpm:92, root:50, mood:"calm",
  prog:[[0,"m7"],[5,"m7"],[10,"M7"],[3,"M7"]],
  kick:[0,10], snare:[8], hat:[4,12],
  bass:[0,8], lead:[[0,1,6],[8,2,4],[12,0,4]],
  padType:"triangle", leadType:"sine", bright:.55 },

{ id:"extratime", nom:"Prolongation", en:"Extra Time", bpm:140, root:41, mood:"urgent",
  prog:[[0,"m"],[3,"M"],[7,"m"],[5,"M"]],
  kick:[0,3,6,8,11,14], snare:[4,12], hat:[0,2,4,6,8,10,12,14],
  bass:[0,2,3,6,8,10,11,14], lead:[[0,2,2],[3,3,1],[4,2,1],[6,1,2],[8,0,2],[11,1,1],[12,2,4]],
  padType:"sawtooth", leadType:"sawtooth", bright:1.1 }
];

/* ---------- État ---------- */
let ctx=null, master=null, bus=null;
const S = {
  playing:false, idx:0, vol:.5, step:0, nextT:0, timer:null,
  custom:[],          /* {nom, blob, url} chargés par le joueur */
  voix:[],            /* voix programmées par le séquenceur, pour les couper */
  el:null,            /* <audio> pour les fichiers du joueur     */
  onChange:null,
  onPisteMorte:null
};
const LS_ON="fm_music_on", LS_VOL="fm_music_vol", LS_IDX="fm_music_idx";

/* ---------- Contexte audio ---------- */
function boot(){
  if (ctx) return true;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return false;
  ctx = new AC();
  master = ctx.createGain(); master.gain.value = S.vol;
  bus = ctx.createDynamicsCompressor();
  bus.threshold.value=-16; bus.ratio.value=4; bus.attack.value=.004; bus.release.value=.2;
  bus.connect(master); master.connect(ctx.destination);
  return true;
}

/* ---------- Voix ----------
   Le séquenceur programme jusqu'à 250 ms de musique À L'AVANCE. Rien ne les
   arrêtait : `pause()` se contentait de suspendre le contexte, si bien que le
   premier bruitage de menu — qui le réveille — faisait sonner la fin de la
   musique par-dessus (0,44 de crête contre 0,004 pour le bruitage seul), et
   changer de piste superposait 1,3 s de l'ancienne sur la nouvelle. On tient
   donc la liste des voix en cours pour pouvoir les couper net. Les bruitages
   n'y entrent pas : ils durent 40 à 120 ms et ne se recouvrent pas. */
let enSequence = false;
function enregistrer(n, g){
  if (!enSequence) return;
  const v = { n, g };
  S.voix.push(v);
  n.addEventListener("ended", ()=>{ const i = S.voix.indexOf(v); if (i>=0) S.voix.splice(i,1); });
}
const FONDU = 0.03;                 /* s */
function couperVoix(){
  if (!ctx) { S.voix.length = 0; return; }
  const t = ctx.currentTime, fin = t + FONDU;
  for (const v of S.voix){
    /* Couper net produit un CLIC. Suspendre le contexte juste après le figeait
       sans le rendre, et il ressortait au réveil : le premier bruitage de menu
       claquait à onze fois son propre niveau. On referme donc l'enveloppe. */
    try {
      if (v.g){
        const val = Math.max(1e-4, v.g.gain.value);
        v.g.gain.cancelScheduledValues(t);
        v.g.gain.setValueAtTime(val, t);
        v.g.gain.exponentialRampToValueAtTime(1e-4, fin);
      }
    } catch(e){}
    try { v.n.stop(fin); } catch(e){}
  }
  S.voix.length = 0;
}

/* ---------- Voix ---------- */
function env(g, t, a, d, peak){
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(peak, t+a);
  g.gain.exponentialRampToValueAtTime(.0001, t+a+d);
}
function tone(t, f, dur, type, peak, cutoff){
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t);
  let node = g;
  if (cutoff){
    const lp = ctx.createBiquadFilter();
    lp.type="lowpass"; lp.frequency.setValueAtTime(cutoff, t);
    lp.Q.value=6; g.connect(lp); node = lp;
  }
  env(g, t, .008, dur, peak);
  o.connect(g); node.connect(bus);
  o.start(t); o.stop(t+dur+.06); enregistrer(o, g);
}
function kick(t){
  const o=ctx.createOscillator(), g=ctx.createGain();
  o.type="sine";
  o.frequency.setValueAtTime(128, t);
  o.frequency.exponentialRampToValueAtTime(44, t+.10);
  g.gain.setValueAtTime(.9, t);
  g.gain.exponentialRampToValueAtTime(.0001, t+.24);
  o.connect(g); g.connect(bus); o.start(t); o.stop(t+.28); enregistrer(o, g);
}
function noise(t, dur, hp, peak, q){
  const n = Math.floor(ctx.sampleRate*dur)+1;
  const buf = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i=0;i<n;i++) d[i] = (Math.random()*2-1) * (1 - i/n);
  const src = ctx.createBufferSource(); src.buffer = buf;
  const f = ctx.createBiquadFilter(); f.type="highpass"; f.frequency.value=hp; f.Q.value=q||1;
  const g = ctx.createGain(); g.gain.setValueAtTime(peak, t);
  g.gain.exponentialRampToValueAtTime(.0001, t+dur);
  src.connect(f); f.connect(g); g.connect(bus); src.start(t); src.stop(t+dur+.02); enregistrer(src, g);
}
const snare = t => { noise(t,.16,1200,.26); tone(t,185,.10,"triangle",.19); };
const hat   = t => noise(t,.03,5200,.055,.9);
function pad(t, notes, dur, type, bright){
  notes.forEach((n,i)=>{
    const o=ctx.createOscillator(), o2=ctx.createOscillator(),
          g=ctx.createGain(), lp=ctx.createBiquadFilter();
    o.type=type; o2.type=type;
    o.frequency.value = hz(n); o2.frequency.value = hz(n)*1.0035;
    lp.type="lowpass";
    lp.frequency.setValueAtTime(300, t);
    lp.frequency.linearRampToValueAtTime(700+900*bright, t+dur*.55);
    lp.frequency.linearRampToValueAtTime(340, t+dur);
    g.gain.setValueAtTime(.0001, t);
    g.gain.linearRampToValueAtTime(.052/(1+i*.35), t+dur*.28);
    g.gain.setValueAtTime(.052/(1+i*.35), t+dur*.72);
    g.gain.exponentialRampToValueAtTime(.0001, t+dur);
    o.connect(lp); o2.connect(lp); lp.connect(g); g.connect(bus);
    o.start(t); o2.start(t); o.stop(t+dur+.05); o2.stop(t+dur+.05);
    enregistrer(o, g); enregistrer(o2, g);
  });
}

/* ---------- Séquenceur ---------- */
function chordNotes(tr, bar){
  const c = tr.prog[bar % tr.prog.length];
  const shape = CH[c[1]] || CH.m;
  return { root: tr.root + c[0], notes: shape.map(s => tr.root + c[0] + s + 12) };
}
function scheduleStep(tr, step, t){
  enSequence = true;
  try { sequencer(tr, step, t); } finally { enSequence = false; }
}
function sequencer(tr, step, t){
  const bar = Math.floor(step/16) % tr.prog.length;
  const s = step % 16;
  const { root, notes } = chordNotes(tr, Math.floor(step/16));
  const spb = 60/tr.bpm/4;

  if (tr.kick.includes(s))  kick(t);
  if (tr.snare.includes(s)) snare(t);
  if (tr.hat.includes(s))   hat(t);
  if (tr.bass.includes(s))  tone(t, hz(root-12), spb*1.7, "sawtooth", .22, 340+140*tr.bright);
  if (s===0) pad(t, notes, spb*16, tr.padType, tr.bright);

  for (const [ls, deg, dur] of tr.lead){
    if (ls!==s) continue;
    const n = notes[deg % notes.length] + (deg>=notes.length?12:0) + 12;
    tone(t, hz(n), spb*dur*.9, tr.leadType, .09, 2600);
    tone(t+.012, hz(n+12), spb*dur*.5, "sine", .03, 4000);   /* octave discrète */
  }
  /* respiration : contretemps de charley toutes les 4 mesures */
  if (bar===3 && s===15) noise(t,.05,4500,.05);
}
function tick(){
  if (!S.playing || S.el) return;
  const tr = TRACKS[S.idx % TRACKS.length];
  const spb = 60/tr.bpm/4;
  while (S.nextT < ctx.currentTime + .25){
    scheduleStep(tr, S.step, S.nextT);
    S.step = (S.step+1) % (16*tr.prog.length*2);
    S.nextT += spb;
  }
}

/* ---------- Pistes du joueur (fichiers locaux) ---------- */
/* Retire la piste importée en cours de lecture, du disque comme de la
   playlist, et renvoie true si elle a bien été retirée.
   Motif : un fichier illisible (vide, encodage non supporté, blob perdu) ne
   déclenche JAMAIS "ended" — le seul événement écouté jusqu'ici. La lecture
   restait donc bloquée dessus en silence, et comme l'index de piste est
   mémorisé, la bande son du jeu était éteinte pour toutes les sessions
   suivantes. Le splice fait avancer S.idx sur la piste suivante de lui-même ;
   si toutes les pistes du joueur échouent, la playlist retombe sur les
   compositions embarquées et la boucle s'arrête d'elle-même. */
function retirerPisteMorte(){
  const i = S.idx - TRACKS.length;
  const mort = (i >= 0) ? S.custom[i] : null;
  if (!mort) return false;
  try{ URL.revokeObjectURL(mort.url); }catch(e){}
  S.custom.splice(i, 1);
  if (mort.cle != null) idbDelete(mort.cle);
  if (S.idx >= playlist().length) S.idx = 0;
  if (S.onPisteMorte) S.onPisteMorte(mort.nom);
  return true;
}
function ensureEl(){
  if (S.el) return S.el;
  const a = new Audio();
  a.volume = S.vol;
  a.addEventListener("ended", ()=> FM.audio.next());
  a.addEventListener("error", ()=>{
    /* vider src dans stopEl() lève aussi un "error" : ne pas le confondre
       avec un fichier réellement illisible. */
    if (a.__ferme || S.el !== a) return;
    if (retirerPisteMorte()){ if (S.playing) startCurrent(); else if (S.onChange) S.onChange(); }
    else FM.audio.next();
  });
  S.el = a;
  return a;
}
function stopEl(){ if (S.el){ S.el.__ferme = true; S.el.pause(); S.el.src=""; S.el=null; } }

/* IndexedDB : conserve les fichiers du joueur entre deux sessions */
const DB_NAME="fm_music", STORE="tracks";
function idb(){
  return new Promise((res,rej)=>{
    if (!window.indexedDB) return rej(new Error("no idb"));
    const r = indexedDB.open(DB_NAME,1);
    r.onupgradeneeded = ()=> r.result.createObjectStore(STORE,{autoIncrement:true});
    r.onsuccess = ()=> res(r.result);
    r.onerror = ()=> rej(r.error);
  });
}
async function idbAll(){
  try{
    const db = await idb();
    return await new Promise((res,rej)=>{
      const tx = db.transaction(STORE,"readonly").objectStore(STORE).getAll();
      tx.onsuccess = ()=> res(tx.result||[]); tx.onerror = ()=> rej(tx.error);
    });
  }catch(e){ return []; }
}
/* Les clés du magasin, dans le même ordre que idbAll() : sans elles on ne peut
   supprimer qu'en bloc, et une seule piste illisible imposait d'effacer toute
   la bibliothèque du joueur. */
async function idbAllKeys(){
  try{
    const db = await idb();
    return await new Promise((res,rej)=>{
      const tx = db.transaction(STORE,"readonly").objectStore(STORE).getAllKeys();
      tx.onsuccess = ()=> res(tx.result||[]); tx.onerror = ()=> rej(tx.error);
    });
  }catch(e){ return []; }
}
async function idbAdd(rec){
  try{
    const db = await idb();
    return await new Promise((res,rej)=>{
      const tx = db.transaction(STORE,"readwrite").objectStore(STORE).add(rec);
      tx.onsuccess=()=>res(tx.result); tx.onerror=()=>rej(tx.error);
    });
  }catch(e){ return null; }
}
async function idbDelete(cle){
  try{
    const db = await idb();
    await new Promise((res,rej)=>{
      const tx = db.transaction(STORE,"readwrite").objectStore(STORE).delete(cle);
      tx.onsuccess=res; tx.onerror=()=>rej(tx.error);
    });
  }catch(e){}
}
async function idbClear(){
  try{
    const db = await idb();
    await new Promise((res,rej)=>{
      const tx = db.transaction(STORE,"readwrite").objectStore(STORE).clear();
      tx.onsuccess=res; tx.onerror=()=>rej(tx.error);
    });
  }catch(e){}
}

/* ---------- API publique ---------- */
const playlist = () => TRACKS.map(t=>({ id:t.id, nom: FM.lang && FM.lang()==="en" ? t.en : t.nom, own:false }))
                       .concat(S.custom.map((c,i)=>({ id:"own"+i, nom:c.nom, own:true })));

function current(){
  const all = playlist();
  return all[S.idx % all.length] || all[0];
}
function startCurrent(){
  const all = playlist();
  const cur = all[S.idx % all.length];
  stopEl();
  couperVoix();          /* sinon 1,3 s de l'ancienne piste se superpose */
  if (cur && cur.own){
    const own = S.custom[S.idx - TRACKS.length];
    const a = ensureEl();
    a.src = own.url; a.volume = S.vol; a.loop = false;
    a.play().catch(err => {
      /* NotAllowedError = politique d'autoplay du navigateur, le fichier n'y
         est pour rien : surtout ne pas le supprimer. Toute autre erreur veut
         dire que cette piste-là est illisible. */
      if (err && err.name === "NotAllowedError") return;
      if (a.__ferme || S.el !== a) return;
      if (retirerPisteMorte() && S.playing) startCurrent();
    });
  } else {
    S.step = 0; S.nextT = ctx.currentTime + .08;
  }
  if (S.onChange) S.onChange();
}

FM.audio = {
  tracks: playlist,
  current,
  isPlaying: ()=> S.playing,
  volume: ()=> S.vol,
  hasOwn: ()=> S.custom.length>0,

  available(){ return !!(window.AudioContext || window.webkitAudioContext); },

  play(){
    if (!boot()) return false;
    if (ctx.state==="suspended") ctx.resume();
    S.playing = true;
    startCurrent();
    if (!S.timer) S.timer = setInterval(tick, 25);
    try{ localStorage.setItem(LS_ON,"1"); }catch(e){}
    if (S.onChange) S.onChange();
    return true;
  },
  pause(){
    S.playing = false;
    if (S.timer){ clearInterval(S.timer); S.timer=null; }
    stopEl();
    couperVoix();        /* sinon le prochain bruitage réveille le contexte
                            et rejoue la fin de la musique par-dessus */
    /* Geler seulement APRÈS que les enveloppes se soient refermées : suspendre
       dans la foulée figeait le fondu au lieu de le rendre. */
    if (ctx){ const c = ctx; setTimeout(()=>{ if (!S.playing) c.suspend(); }, FONDU*1000 + 30); }
    try{ localStorage.setItem(LS_ON,"0"); }catch(e){}
    if (S.onChange) S.onChange();
  },
  toggle(){ S.playing ? this.pause() : this.play(); },
  next(){
    S.idx = (S.idx+1) % playlist().length;
    try{ localStorage.setItem(LS_IDX, String(S.idx)); }catch(e){}
    if (S.playing) startCurrent(); else if (S.onChange) S.onChange();
  },
  prev(){
    const n = playlist().length;
    S.idx = (S.idx-1+n) % n;
    try{ localStorage.setItem(LS_IDX, String(S.idx)); }catch(e){}
    if (S.playing) startCurrent(); else if (S.onChange) S.onChange();
  },
  select(i){
    S.idx = i % playlist().length;
    try{ localStorage.setItem(LS_IDX, String(S.idx)); }catch(e){}
    if (S.playing) startCurrent(); else if (S.onChange) S.onChange();
  },
  setVolume(v){
    S.vol = Math.max(0, Math.min(1, v));
    if (master) master.gain.setTargetAtTime(S.vol, ctx.currentTime, .05);
    if (S.el) S.el.volume = S.vol;
    try{ localStorage.setItem(LS_VOL, String(S.vol)); }catch(e){}
  },
  onChange(fn){ S.onChange = fn; },
  /* prévenue quand une piste importée s'avère illisible et est retirée */
  onPisteMorte(fn){ S.onPisteMorte = fn; },

  /* bruitages de menu : tick sec au déplacement, son plus plein à la validation */
  sfx(kind){
    if (!boot()) return;
    if (ctx.state === "suspended") ctx.resume();
    const t = ctx.currentTime + 0.001;
    if (kind === "ok"){
      tone(t,      660, .07, "square", .055, 3200);
      tone(t+.055, 990, .12, "square", .05,  3600);
    } else if (kind === "back"){
      tone(t, 430, .09, "triangle", .05, 2400);
    } else {
      tone(t, 1150, .04, "square", .035, 3000);
    }
  },

  /* fichiers du joueur */
  /* Renvoie {ajoutes, ignores} : un fichier écarté l'était en silence, et
     l'import semblait n'avoir rien fait du tout. */
  async addFiles(files){
    let ajoutes = 0, ignores = 0;
    for (const f of files){
      /* Repli sur l'extension quand le navigateur ne devine pas le type : un
         vrai MP3 sans type MIME était rejeté comme un fichier texte. */
      const estAudio = (f.type && f.type.startsWith("audio")) ||
                       /\.(mp3|m4a|aac|ogg|oga|opus|wav|flac|weba|webm)$/i.test(f.name || "");
      if (!estAudio){ ignores++; continue; }
      const nom = f.name.replace(/\.[^.]+$/,"");
      /* la clé est conservée pour pouvoir retirer CETTE piste-là si elle
         s'avère illisible, sans effacer toute la bibliothèque */
      const cle = await idbAdd({ nom, blob:f });
      S.custom.push({ nom, blob:f, url:URL.createObjectURL(f), cle });
      ajoutes++;
    }
    if (S.onChange) S.onChange();
    return { ajoutes, ignores };
  },
  async clearOwn(){
    S.custom.forEach(c=>URL.revokeObjectURL(c.url));
    S.custom = [];
    await idbClear();
    if (S.idx >= playlist().length) S.idx = 0;
    if (S.playing) startCurrent(); else if (S.onChange) S.onChange();
  },

  async restore(){
    try{ const v = localStorage.getItem(LS_VOL); if (v!==null) S.vol = parseFloat(v); }catch(e){}
    try{ const i = localStorage.getItem(LS_IDX); if (i!==null) S.idx = parseInt(i,10)||0; }catch(e){}
    const recs = await idbAll();
    const cles = await idbAllKeys();
    S.custom = recs.map((r,i)=>({ nom:r.nom, blob:r.blob, url:URL.createObjectURL(r.blob), cle:cles[i] }));
    if (S.onChange) S.onChange();
    /* reprise automatique après un geste du joueur (politique des navigateurs) */
    let wanted=false;
    try{ wanted = localStorage.getItem(LS_ON)==="1"; }catch(e){}
    if (wanted){
      const go = ()=>{ document.removeEventListener("pointerdown", go);
                       document.removeEventListener("keydown", go);
                       FM.audio.play(); };
      document.addEventListener("pointerdown", go, {once:true});
      document.addEventListener("keydown", go, {once:true});
    }
  }
};

})();
