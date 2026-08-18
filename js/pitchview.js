/* ============================================================
   EURO MANAGER — vue de terrain animée
   Chaque pion est un joueur avec un rôle, une inertie et une
   position de base dans le bloc d'équipe. Le bloc coulisse avec
   le ballon, la ligne défensive monte et descend, un presseur
   sort au duel, et le ballon circule par passes réelles.
   ============================================================ */
(function(){
"use strict";
const FM = window.FM = window.FM || {};

/* ---------- Formation de base (équipe attaquant vers la droite)
   x : 0 = sa propre ligne de but, 1 = but adverse
   y : 0 = haut de l'écran, 1 = bas                          ---------- */
const BASE = [
  { r:"GK", x:0.045, y:0.50 },
  { r:"DF", x:0.20,  y:0.16 }, { r:"DF", x:0.185, y:0.38 },
  { r:"DF", x:0.185, y:0.62 }, { r:"DF", x:0.20,  y:0.84 },
  { r:"MF", x:0.42,  y:0.20 }, { r:"MF", x:0.40,  y:0.50 }, { r:"MF", x:0.42, y:0.80 },
  { r:"FW", x:0.66,  y:0.26 }, { r:"FW", x:0.70,  y:0.50 }, { r:"FW", x:0.66, y:0.74 }
];

/* ---------- Physique : ressort amorti, constantes en mètres terrain ----------
   a = ω²·(cible − p) − 2ζω·v  →  paramétré par l'état, donc il encaisse une
   cible qui bouge à chaque image ; un easing en fonction du temps remettrait
   la vitesse à zéro à chaque changement de cible (d'où l'effet saccadé).  */
const OMEGA      = 4.2;    /* pulsation propre (rad/s) : t95 ≈ 4,7/ω ≈ 1,1 s */
const ZETA       = 0.80;   /* amortissement : ~1,5 % de dépassement, humain   */
const OMEGA_SPR  = 5.4;    /* course au ballon : plus vif                     */
const ZETA_SPR   = 0.75;
const A_MAX_M    = 9.0;    /* accélération maximale (m/s²)                    */
const V_BASE_M   = 5.0;    /* course d'entretien (m/s)                        */
const V_SPRINT_M = 8.2;    /* sprint (m/s)                                    */
const SEP_M      = 2.2;    /* distance de non-superposition (m)               */
const SEP_FORCE  = 36;
const WANDER_M   = 0.45;   /* amplitude de l'errement (m)                     */
const PASS_MS    = 18;     /* vitesse d'une passe au sol (m/s)                */
const SHOT_MS    = 27;     /* vitesse d'un tir (m/s)                          */
const PASS_OPT_M = 22;     /* distance de passe idéale (m)                    */
const PASS_SIG_M = 12;     /* largeur de la cloche autour de l'optimum (m)    */
const LANE_M     = 4.5;    /* couloir de passe fermé en deçà (m)              */
const CARRY_GAP_M= 0.9;    /* le ballon précède le porteur (m)                */
const TAU_CARRY  = 0.10;   /* constante de temps du ballon conduit (s)        */

const clamp = (v,a,b) => v<a?a:(v>b?b:v);
const dist  = (ax,ay,bx,by) => Math.hypot(ax-bx, ay-by);

FM.pitchView = function(canvas, opts){
  opts = opts || {};
  /* Un canvas sans contexte 2D (mémoire GPU saturée, canvas détaché du DOM,
     navigateur qui refuse l'accélération) faisait lever une exception à
     chaque image. On rend alors une vue inerte : le match se joue quand même,
     seule l'animation manque. */
  const g = canvas.getContext && canvas.getContext("2d");
  if (!g){
    const rien = ()=>{};
    return { start:rien, stop:rien, setPaused:rien, setTempo:rien, goal:rien,
             kickoff:rien, indisponible:true,
             state(){ return { pos:0, ball:{x:0,y:0,carrier:-1}, players:[] }; } };
  }
  const W = canvas.width, H = canvas.height;
  const M = 12;                                  /* marge = ligne de touche */
  const PX = x => M + x*(W-2*M);                 /* 0..1 → pixels (longueur) */
  const PY = y => M + y*(H-2*M);                 /* 0..1 → pixels (largeur)  */
  const M2PX = (W-2*M)/105;                      /* 1 mètre en pixels        */
  const A_MAX = A_MAX_M*M2PX, V_BASE = V_BASE_M*M2PX, V_SPRINT = V_SPRINT_M*M2PX;
  const SEP_DIST = SEP_M*M2PX, WANDER_A = WANDER_M*M2PX;
  const colH = opts.homeColor || "#e33";
  const colA = opts.awayColor || "#38f";
  /* écart de niveau : influe sur la possession et la réussite des passes */
  const edge = clamp(((opts.homeRating||75) - (opts.awayRating||75)) / 60, -.35, .35);

  /* ---------- Joueurs ---------- */
  const P = [];
  for (let t=0; t<2; t++){
    BASE.forEach((b,i)=>{
      /* l'équipe 1 attaque vers la gauche : on retourne l'axe long */
      const bx = t===0 ? b.x : 1-b.x;
      P.push({
        team:t, role:b.r, idx:i,
        bx, by:b.y,
        x:PX(bx), y:PY(b.y), vx:0, vy:0,
        ph: (t*11+i)*1.913,                      /* déphasage de l'errement */
        touch: 0.30 + (i%5)*0.03,                /* cadence des touches de balle */
        vmax: b.r==="FW" ? V_BASE*1.08 : b.r==="GK" ? V_BASE*.62 : V_BASE
      });
    });
  }
  const teamOf = t => P.filter(p=>p.team===t);
  const gkOf   = t => P.find(p=>p.team===t && p.role==="GK");
  /* sens d'attaque : équipe 0 vers la droite (+1), équipe 1 vers la gauche (−1) */
  const dirOf  = t => t===0 ? 1 : -1;
  /* progression du ballon dans le sens d'attaque de l'équipe t (0 = son but) */
  const progFor = t => { const u=(ball.x-M)/(W-2*M); return t===0 ? u : 1-u; };

  /* ---------- Ballon ---------- */
  const ball = { x:W/2, y:H/2, carrier:null, flight:null, dead:0 };
  let pos = Math.random()<.5+edge ? 0 : 1;       /* équipe en possession    */
  let nextAction = 0.8;                          /* compte à rebours (s)    */
  let intent = null;                             /* passe en préparation    */
  let celebrating = 0;

  /* ---------- Cibles ---------- */
  function computeTargets(time){
    const bY = clamp((ball.y-M)/(H-2*M), 0, 1);

    for (let t=0; t<2; t++){
      const attacking = (pos===t);
      const prog = progFor(t);                    /* 0 = ballon près de SON but */
      /* avancée du bloc : on monte avec le ballon, davantage en possession */
      const adv = clamp(prog*0.42 + (attacking?0.10:0.0) - 0.14, -0.13, 0.34);
      /* compacité : bloc resserré quand on défend bas */
      const comp = attacking ? 1.06 : 0.86;
      /* ligne défensive commune aux quatre défenseurs */
      const lineX = clamp(0.17*comp + adv*1.15, 0.06, 0.60);

      const mates = teamOf(t);
      /* presseur : le plus proche du ballon dans l'équipe qui défend */
      let presser = null, second = null;
      if (!attacking){
        let d1=1e9, d2=1e9;
        for (const p of mates){
          if (p.role==="GK") continue;
          const d = dist(p.x,p.y,ball.x,ball.y);
          if (d<d1){ d2=d1; second=presser; d1=d; presser=p; }
          else if (d<d2){ d2=d; second=p; }
        }
      }

      for (const p of mates){
        const sgn = dirOf(t);
        let tx, ty, sprint=false;

        if (p.role==="GK"){
          /* reste sur sa ligne, sort un peu quand le ballon approche */
          const own = t===0 ? 0 : 1;
          const outFrac = 0.045 + 0.055*(1-prog<0?0:(1-prog))*(prog<0.30?1:0.25);
          tx = own===0 ? outFrac : 1-outFrac;
          ty = 0.5 + (bY-0.5)*0.52;
        } else if (p===presser){
          /* duel : on va au ballon en laissant une distance de contact */
          const d = Math.max(1, dist(p.x,p.y,ball.x,ball.y));
          const stand = 11;
          tx = ((ball.x + (p.x-ball.x)/d*stand) - M)/(W-2*M);
          ty = ((ball.y + (p.y-ball.y)/d*stand) - M)/(H-2*M);
          sprint = true;
        } else if (p===second){
          /* couverture : entre le ballon et son propre but */
          const goalX = t===0 ? M : W-M;
          tx = ((ball.x*0.62 + goalX*0.38) - M)/(W-2*M);
          ty = ((ball.y*0.72 + (H/2)*0.28) - M)/(H-2*M);
        } else {
          /* position de bloc : base + avancée + coulissement latéral */
          const lateral = p.role==="DF" ? 0.30 : p.role==="MF" ? 0.24 : 0.16;
          const own = (p.bx - (t===0?0:1)) * sgn;   /* 0..1 depuis son but  */
          let ax = p.role==="DF" ? lineX : own*comp + adv;
          if (p.role==="FW" && attacking) ax += 0.09 + 0.10*prog;   /* appel */
          if (p.role==="FW" && !attacking) ax -= 0.05;              /* replis */
          tx = t===0 ? ax : 1-ax;
          ty = clamp(p.by + (bY-0.5)*lateral, 0.05, 0.95);
          if (ball.carrier === p) {                 /* le porteur perce      */
            tx = clamp((p.x-M)/(W-2*M) + sgn*0.045, 0.03, 0.97);
            ty = clamp((p.y-M)/(H-2*M) + (0.5-((p.y-M)/(H-2*M)))*0.05, 0.05, 0.95);
            sprint = true;
          }
        }
        /* errement : deux sinusoïdes déphasées, jamais parfaitement immobile */
        p.tx = PX(clamp(tx,0.01,0.99)) + Math.sin(time*0.83 + p.ph)*WANDER_A;
        p.ty = PY(clamp(ty,0.02,0.98)) + Math.sin(time*1.07 + p.ph*1.7)*WANDER_A;
        p.sprint = sprint;
      }
    }
  }

  /* ---------- Intégration du mouvement ---------- */
  function stepPlayers(dt){
    for (const p of P){
      const w = p.sprint ? OMEGA_SPR : OMEGA, z = p.sprint ? ZETA_SPR : ZETA;
      let ax = w*w*(p.tx - p.x) - 2*z*w*p.vx;
      let ay = w*w*(p.ty - p.y) - 2*z*w*p.vy;
      /* séparation : on ne se marche pas dessus */
      for (const q of P){
        if (q===p) continue;
        const dx=p.x-q.x, dy=p.y-q.y;
        const d2=dx*dx+dy*dy;
        if (d2 < SEP_DIST*SEP_DIST && d2>0.01){
          const d=Math.sqrt(d2), f=(SEP_DIST-d)/SEP_DIST*SEP_FORCE;
          ax += dx/d*f; ay += dy/d*f;
        }
      }
      const am = Math.hypot(ax,ay);
      if (am > A_MAX){ ax = ax/am*A_MAX; ay = ay/am*A_MAX; }
      p.vx += ax*dt; p.vy += ay*dt;
      const vmax = p.sprint ? V_SPRINT : p.vmax;
      const vm = Math.hypot(p.vx,p.vy);
      if (vm > vmax){ p.vx = p.vx/vm*vmax; p.vy = p.vy/vm*vmax; }
      p.x = clamp(p.x + p.vx*dt, 4, W-4);
      p.y = clamp(p.y + p.vy*dt, 4, H-4);
    }
  }

  /* ---------- Ballon ---------- */
  function stepBall(dt){
    if (ball.flight){
      const f = ball.flight;
      f.t += dt/f.dur;
      if (f.t >= 1){
        ball.x = f.tox; ball.y = f.toy; ball.flight = null;
        if (f.onArrive) f.onArrive();
      } else {
        /* décélération du ballon : sortie en douceur */
        const e = 1 - Math.pow(1-f.t, 2.1);
        ball.x = f.fx + (f.tox-f.fx)*e;
        ball.y = f.fy + (f.toy-f.fy)*e;
      }
      return;
    }
    if (ball.carrier){
      const c = ball.carrier;
      const vm = Math.hypot(c.vx,c.vy);
      /* direction de conduite : la course, sinon le but adverse ; et si une
         passe se prépare, on s'oriente vers le receveur pressenti           */
      let lx, ly;
      if (intent && intent.tgt){
        const d = Math.max(1, dist(c.x,c.y,intent.tgt.x,intent.tgt.y));
        lx = (intent.tgt.x-c.x)/d; ly = (intent.tgt.y-c.y)/d;
      } else if (vm > V_BASE*0.15){ lx = c.vx/vm; ly = c.vy/vm; }
      else { lx = dirOf(c.team); ly = 0; }
      /* touches de balle : on module l'écart, pas la position               */
      const gap = (CARRY_GAP_M + 0.3*Math.sin(clock/c.touch*2*Math.PI))*M2PX + 6;
      const tx = c.x + lx*gap, ty = c.y + ly*gap;
      /* convergence indépendante du framerate : jamais un coefficient fixe  */
      const alpha = 1 - Math.exp(-dt/TAU_CARRY);
      ball.x += (tx-ball.x)*alpha;
      ball.y += (ty-ball.y)*alpha;
    }
  }

  /* speedMS : vitesse du ballon en mètres par seconde */
  function fly(tox, toy, speedMS, onArrive){
    const d = dist(ball.x, ball.y, tox, toy)/M2PX;          /* en mètres */
    ball.flight = { fx:ball.x, fy:ball.y, tox, toy, t:0,
                    dur: clamp(d/(speedMS||PASS_MS), .22, 1.6), onArrive };
    ball.carrier = null; intent = null;
  }

  /* le défenseur le plus proche du segment de passe peut intercepter */
  function interceptor(fromX, fromY, toX, toY, defTeam){
    const dx=toX-fromX, dy=toY-fromY, L2=dx*dx+dy*dy || 1;
    let best=null, bd=1e9;
    for (const p of P){
      if (p.team!==defTeam || p.role==="GK") continue;
      const u = clamp(((p.x-fromX)*dx + (p.y-fromY)*dy)/L2, 0, 1);
      const px = fromX+dx*u, py = fromY+dy*u;
      const d = dist(p.x,p.y,px,py);
      if (d < bd){ bd = d; best = p; }
    }
    return { p:best, d:bd };
  }

  function giveTo(p){ ball.carrier = p; pos = p.team; ball.flight = null; intent = null; }

  function chooseAction(){
    const c = ball.carrier;
    if (!c) return 1.0;
    const t = c.team, sgn = dirOf(t), prog = progFor(t);
    const mates = teamOf(t).filter(m=>m!==c && m.role!=="GK");

    /* tir : seulement dans le dernier tiers, et d'autant plus qu'on est près */
    if (prog > 0.74 && Math.random() < 0.16 + (prog-0.74)*1.1){
      const goalX = t===0 ? W-M+2 : M-2;
      const goalY = H/2 + (Math.random()-0.5)*H*0.20;
      fly(goalX, goalY, SHOT_MS, ()=>{
        ball.dead = 0.7;                           /* arrêt / sortie de but */
        const other = 1-t;
        setTimeout(()=>{ if(!ball.flight) giveTo(gkOf(other)); }, 0);
      });
      return 1.6 + Math.random()*0.8;
    }

    /* passe : progression vers l'avant, cloche de distance autour de 22 m,
       et surtout ouverture du couloir — c'est elle qui fait naître les
       interceptions au lieu de les tirer au sort.                          */
    let best=null, bs=-1e9;
    for (const m of mates){
      const dM = dist(c.x,c.y,m.x,m.y)/M2PX;
      if (dM < 5) continue;
      const progression = (m.x-c.x)*sgn / (W*0.5);                  /* −1..1 */
      const distFactor = Math.exp(-Math.pow(dM-PASS_OPT_M,2)/(2*PASS_SIG_M*PASS_SIG_M));
      const laneM = interceptor(c.x,c.y,m.x,m.y,1-t).d / M2PX;
      const ouverture = clamp(laneM/LANE_M, 0, 2);                  /* 0..2   */
      const s = 1.0*progression + 0.8*distFactor + 1.2*ouverture
              + (Math.random()-0.5)*0.7;
      if (s>bs){ bs=s; best=m; }
    }
    if (!best || Math.random() < 0.18){
      /* conduite de balle : le porteur avance seul */
      return 0.55 + Math.random()*0.5;
    }
    /* le ballon s'oriente vers le receveur ~250 ms avant le départ */
    const it = interceptor(c.x,c.y,best.x,best.y,1-t);
    /* couloir fermé → interception d'autant plus probable, sans tirage arbitraire */
    const risque = clamp(1 - (it.d/M2PX)/LANE_M, 0, 1);
    const cut = !!it.p && Math.random() < risque*0.85 - edge*(t===0?1:-1)*0.35;
    /* le ballon s'oriente vers le receveur ~250 ms avant le départ */
    intent = { tgt:best, cutP: cut ? it.p : null, t:0.25 };
    return 9;                                    /* la passe part à l'échéance */
  }

  /* duel au sol : le presseur colle le porteur assez longtemps → récupération */
  let duel = 0;
  function stepDuel(dt){
    const c = ball.carrier;
    if (!c) { duel = 0; return; }
    let close=null, cd=1e9;
    for (const p of P){
      if (p.team===c.team) continue;
      const d = dist(p.x,p.y,c.x,c.y);
      if (d<cd){ cd=d; close=p; }
    }
    if (close && cd < 15){
      duel += dt;
      if (duel > 0.42 && Math.random() < dt*2.4){ giveTo(close); duel = 0; }
    } else duel = Math.max(0, duel - dt);
  }

  /* ---------- Rendu ---------- */
  function drawPitch(){
    /* pelouse et bandes tondues */
    g.fillStyle = "#2f8f47"; g.fillRect(0,0,W,H);
    g.fillStyle = "rgba(255,255,255,.07)";
    for (let i=0;i<10;i+=2) g.fillRect(i*W/10, 0, W/10, H);
    g.strokeStyle = "rgba(255,255,255,.9)"; g.lineWidth = 2;
    g.strokeRect(M, M, W-2*M, H-2*M);
    g.beginPath(); g.moveTo(W/2, M); g.lineTo(W/2, H-M); g.stroke();
    g.beginPath(); g.arc(W/2, H/2, 40, 0, 7); g.stroke();
    g.beginPath(); g.arc(W/2, H/2, 2.5, 0, 7); g.fillStyle="rgba(255,255,255,.9)"; g.fill();
    /* surfaces de réparation et de but */
    const bH = H*0.58, sH = H*0.26, bW = 66, sW = 24;
    g.strokeRect(M, H/2-bH/2, bW, bH);        g.strokeRect(W-M-bW, H/2-bH/2, bW, bH);
    g.strokeRect(M, H/2-sH/2, sW, sH);        g.strokeRect(W-M-sW, H/2-sH/2, sW, sH);
    g.beginPath(); g.arc(M+46, H/2, 2.2, 0, 7); g.fill();
    g.beginPath(); g.arc(W-M-46, H/2, 2.2, 0, 7); g.fill();
    /* arcs de cercle des surfaces */
    g.beginPath(); g.arc(M+46, H/2, 30, -0.9, 0.9); g.stroke();
    g.beginPath(); g.arc(W-M-46, H/2, 30, Math.PI-0.9, Math.PI+0.9); g.stroke();
    /* corners */
    [[M,M,0,1.571],[W-M,M,1.571,3.142],[M,H-M,4.712,6.283],[W-M,H-M,3.142,4.712]]
      .forEach(([cx,cy,a1,a2])=>{ g.beginPath(); g.arc(cx,cy,7,a1,a2); g.stroke(); });
    /* buts */
    g.lineWidth = 3; g.strokeStyle = "rgba(255,255,255,.95)";
    g.beginPath(); g.moveTo(M-5,H/2-19); g.lineTo(M-5,H/2+19); g.stroke();
    g.beginPath(); g.moveTo(W-M+5,H/2-19); g.lineTo(W-M+5,H/2+19); g.stroke();
  }

  function drawActors(){
    /* ombres portées */
    g.fillStyle = "rgba(0,0,0,.22)";
    for (const p of P){ g.beginPath(); g.ellipse(p.x+1.5, p.y+3, 6.5, 3.2, 0, 0, 7); g.fill(); }
    for (const p of P){
      const carrying = ball.carrier===p;
      g.beginPath(); g.arc(p.x, p.y, carrying?7:6, 0, 7);
      g.fillStyle = p.team===0 ? colH : colA; g.fill();
      g.lineWidth = 1.6;
      g.strokeStyle = carrying ? "#ffffff" : "rgba(0,0,0,.55)";
      g.stroke();
      if (p.role==="GK"){                       /* gardien : liseré jaune    */
        g.beginPath(); g.arc(p.x, p.y, 3, 0, 7);
        g.fillStyle = "#ffd83d"; g.fill();
      }
    }
    /* ballon + ombre */
    g.fillStyle = "rgba(0,0,0,.25)";
    g.beginPath(); g.ellipse(ball.x+1.5, ball.y+2.5, 4, 2, 0, 0, 7); g.fill();
    g.beginPath(); g.arc(ball.x, ball.y, 4.2, 0, 7);
    g.fillStyle = "#fff"; g.fill();
    g.lineWidth = 1; g.strokeStyle = "rgba(0,0,0,.45)"; g.stroke();
  }

  /* ---------- Boucle ---------- */
  let raf = 0, last = 0, clock = 0, paused = false, tempo = 1;
  function frame(ts){
    /* En pause, l'image est figée : inutile de la redessiner soixante fois
       par seconde. On sort de la boucle et setPaused(false) la relance. */
    if (paused){ raf = 0; return; }
    raf = requestAnimationFrame(frame);
    if (!last) last = ts;
    let dt = (ts-last)/1000; last = ts;
    dt = clamp(dt, 0, 0.05);                    /* onglet en arrière-plan   */
    {
      const d = dt*tempo;
      clock += d;
      if (celebrating > 0){
        celebrating -= d;
        if (celebrating <= 0) kickoff(celebrateSide===0 ? 1 : 0);
      } else if (ball.dead > 0){
        ball.dead -= d;
      } else {
        if (intent && ball.carrier){
          intent.t -= d;
          if (intent.t <= 0){
            const tgt = intent.cutP || intent.tgt;
            fly(tgt.x + tgt.vx*0.25, tgt.y + tgt.vy*0.25, PASS_MS, ()=> giveTo(tgt));
            nextAction = 0.75 + Math.random()*1.15;
          }
        }
        nextAction -= d;
        if (!ball.flight && !intent && ball.carrier && nextAction <= 0) nextAction = chooseAction();
        if (!ball.flight && !ball.carrier && nextAction <= -1.2){
          /* ballon sans maître trop longtemps : le plus proche le récupère */
          let best=null, bd=1e9;
          for (const p of P){ const dd=dist(p.x,p.y,ball.x,ball.y); if(dd<bd){bd=dd;best=p;} }
          if (best) giveTo(best);
          nextAction = 0.9;
        }
        stepDuel(d);
      }
      computeTargets(clock);
      stepPlayers(d);
      stepBall(d);
    }
    drawPitch();
    drawActors();
  }

  let celebrateSide = 0;
  function kickoff(side){
    pos = side;
    for (const p of P){
      p.x = PX(p.bx); p.y = PY(p.by); p.vx = 0; p.vy = 0;
    }
    ball.x = W/2; ball.y = H/2; ball.flight = null; ball.dead = 0.35;
    const mid = teamOf(side).find(p=>p.role==="MF" && p.idx===6) || teamOf(side)[6];
    ball.carrier = mid;
    nextAction = 0.9;
  }

  kickoff(pos);

  return {
    start(){ if(!raf){ last=0; raf = requestAnimationFrame(frame); } },
    stop(){ cancelAnimationFrame(raf); raf = 0; },
    setPaused(v){
      paused = !!v;
      if (!v){ last = 0; if (!raf) raf = requestAnimationFrame(frame); }
    },
    setTempo(v){ tempo = clamp(v, 0.5, 3); },
    /* but marqué : le ballon finit au fond, puis engagement adverse */
    goal(side){
      celebrateSide = side;
      const gx = side===0 ? W-M+4 : M-4;
      fly(gx, H/2 + (Math.random()-0.5)*26, 320, null);
      celebrating = 2.0;
    },
    /* possession forcée (mi-temps, reprise) */
    kickoff,
    /* lecture d'état : sert aux tests de naturalité du mouvement */
    state(){
      return {
        pos,
        ball:{ x:ball.x, y:ball.y, carrier: ball.carrier?P.indexOf(ball.carrier):-1,
               flying: !!ball.flight },
        players: P.map(p=>({ team:p.team, role:p.role, x:p.x, y:p.y,
                             v:Math.hypot(p.vx,p.vy) }))
      };
    }
  };
};

})();
