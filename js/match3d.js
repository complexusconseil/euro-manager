/* ============================================================
   MOTEUR DE MATCH — vue tactique 3D + tableau de bord en direct
   Terrain 3D visible, joueurs représentés par des PIONS (pucks) qui se
   déplacent, ballon suivi, et un DASHBOARD continu (possession, tirs,
   corners, fautes, momentum, commentaire live).
   FM3D.play(cfg, onDone) — cfg = { home:{nom,couleurs}, away:{nom,couleurs},
   hs, as, events:[{min,joueur,home}], label, endText }
   ============================================================ */
(function(){
  const FM3D = { };
  window.FM3D = FM3D;

  FM3D.available = function(){
    if (typeof THREE === "undefined") return false;
    try {
      const c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
    } catch(e){ return false; }
  };

  const HALF_X = 52.5, HALF_Z = 34;
  function hex(c){ return new THREE.Color(c || "#888888"); }

  function pitchTexture(){
    const cw=2100, ch=1360, cv=document.createElement("canvas"); cv.width=cw; cv.height=ch;
    const g=cv.getContext("2d"); const N=18;
    for(let i=0;i<N;i++){ g.fillStyle = i%2 ? "#1f8038" : "#1b7332"; g.fillRect(i*cw/N,0,cw/N,ch); }
    g.globalAlpha=0.05; for(let k=0;k<1800;k++){ g.fillStyle=Math.random()<.5?"#000":"#fff"; g.fillRect(Math.random()*cw,Math.random()*ch,2,2); }
    g.globalAlpha=1; g.strokeStyle="rgba(255,255,255,.9)"; g.lineWidth=5; g.lineCap="round";
    const M=40; g.strokeRect(M,M,cw-2*M,ch-2*M);
    g.beginPath(); g.moveTo(cw/2,M); g.lineTo(cw/2,ch-M); g.stroke();
    g.beginPath(); g.arc(cw/2,ch/2,140,0,7); g.stroke();
    g.beginPath(); g.arc(cw/2,ch/2,8,0,7); g.fillStyle="#fff"; g.fill();
    const boxH=520,boxW=240,y0=(ch-boxH)/2, sixH=260,sixW=90,y1=(ch-sixH)/2, penX=200,penR=110;
    function side(left){
      g.strokeRect(left?M:cw-M-boxW,y0,boxW,boxH);
      g.strokeRect(left?M:cw-M-sixW,y1,sixW,sixH);
      const px=left?M+penX:cw-M-penX; g.beginPath(); g.arc(px,ch/2,6,0,7); g.fill();
      g.beginPath(); if(left) g.arc(px,ch/2,penR,-Math.PI/2.6,Math.PI/2.6); else g.arc(px,ch/2,penR,Math.PI-Math.PI/2.6,Math.PI+Math.PI/2.6); g.stroke();
    }
    side(true); side(false);
    [[M,M],[cw-M,M],[M,ch-M],[cw-M,ch-M]].forEach(([x,y])=>{ g.beginPath(); g.arc(x,y,16,0,7); g.stroke(); });
    const tex=new THREE.CanvasTexture(cv); tex.anisotropy=8; return tex;
  }
  function crowdTexture(){
    const cw=512,ch=128,cv=document.createElement("canvas"); cv.width=cw; cv.height=ch;
    const g=cv.getContext("2d"); g.fillStyle="#141a24"; g.fillRect(0,0,cw,ch);
    const cols=["#e5e7eb","#9aa4b2","#c0392b","#2d6cdf","#e0b83a","#7d8896"];
    for(let k=0;k<2200;k++){ g.fillStyle=cols[(Math.random()*cols.length)|0]; g.globalAlpha=0.5+Math.random()*0.5; g.fillRect(Math.random()*cw,Math.random()*ch,3,3); }
    const tex=new THREE.CanvasTexture(cv); tex.wrapS=tex.wrapT=THREE.RepeatWrapping; tex.repeat.set(10,2); return tex;
  }

  /* Pion (puck) : disque plat coloré, avec anneau sombre pour le contraste */
  function makeToken(kit){
    const grp=new THREE.Group();
    const base=new THREE.Mesh(new THREE.CylinderGeometry(2.3,2.3,0.25,24),
      new THREE.MeshStandardMaterial({color:0x0c0f14, roughness:.9}));
    base.position.y=0.13; base.castShadow=true; grp.add(base);
    const disc=new THREE.Mesh(new THREE.CylinderGeometry(1.9,1.9,0.5,24),
      new THREE.MeshStandardMaterial({color:hex(kit), roughness:.55, metalness:.05}));
    disc.position.y=0.42; disc.castShadow=true; grp.add(disc);
    const top=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.1,0.54,20),
      new THREE.MeshStandardMaterial({color:hex(kit).clone().offsetHSL(0,0,0.12), roughness:.5}));
    top.position.y=0.45; grp.add(top);
    return grp;
  }

  function formation(sign){
    const pos=[];
    pos.push([sign*-50,0]);
    [-22,-8,8,22].forEach(z=>pos.push([sign*-32,z]));
    [-18,0,18].forEach(z=>pos.push([sign*-12,z]));
    [-16,0,16].forEach(z=>pos.push([sign*6,z]));
    return pos.map(p=>new THREE.Vector3(p[0],0,p[1]));
  }

  FM3D.play = function(cfg, onDone){
    const homeCol = cfg.home.couleurs?cfg.home.couleurs[0]:"#e33";
    const awayCol = cfg.away.couleurs?cfg.away.couleurs[0]:"#38f";
    const overlay=document.createElement("div"); overlay.className="overlay overlay3d";
    const wrap=document.createElement("div"); wrap.className="m3d-wrap"; overlay.appendChild(wrap);

    // ---- Tableau de bord (HUD) ----
    const hud=document.createElement("div"); hud.className="m3d-hud";
    hud.innerHTML=`<div class="m3d-score">
        <span class="t" style="border-color:${homeCol}">${cfg.home.nom}</span>
        <b id="m3dScore">0 - 0</b>
        <span class="t" style="border-color:${awayCol}">${cfg.away.nom}</span>
      </div>
      <div class="m3d-min" id="m3dMin">${cfg.label||""} · 0'</div>`;
    wrap.appendChild(hud);

    const feed=document.createElement("div"); feed.className="m3d-feed"; feed.id="m3dFeed"; wrap.appendChild(feed);

    const dash=document.createElement("div"); dash.className="m3d-dash";
    dash.innerHTML=`
      <div class="m3d-poss">
        <div class="mp-label"><span>Possession</span></div>
        <div class="mp-bar"><i id="m3dPossH" style="background:${homeCol}">50%</i><i id="m3dPossA" style="background:${awayCol}">50%</i></div>
      </div>
      <div class="m3d-stats">
        <div class="ms-col"><b id="msH-t">0</b><b id="msH-c">0</b><b id="msH-k">0</b><b id="msH-f">0</b></div>
        <div class="ms-lbl"><span>Tirs</span><span>Cadrés</span><span>Corners</span><span>Fautes</span></div>
        <div class="ms-col"><b id="msA-t">0</b><b id="msA-c">0</b><b id="msA-k">0</b><b id="msA-f">0</b></div>
      </div>
      <div class="m3d-mom"><span>Momentum</span><div class="mm-bar"><i id="m3dMom"></i></div></div>`;
    wrap.appendChild(dash);

    const btn=document.createElement("button"); btn.className="btn ghost m3d-skip"; btn.textContent="⏭ Passer"; wrap.appendChild(btn);

    // Contrôles de lecture (pause / vitesse) — rend le match agréable à suivre
    let speedMul=1;
    const ctrl=document.createElement("div"); ctrl.className="m3d-ctrl";
    const bPause=document.createElement("button"); bPause.className="m3d-cbtn"; bPause.textContent="⏸";
    const bSpeed=document.createElement("button"); bSpeed.className="m3d-cbtn"; bSpeed.textContent="1×";
    bPause.onclick=()=>{ if(speedMul>0){ speedMul=0; bPause.textContent="▶"; bPause.classList.add("on"); } else { speedMul=1; bSpeed.textContent="1×"; bPause.textContent="⏸"; bPause.classList.remove("on"); } };
    bSpeed.onclick=()=>{ speedMul = speedMul>=3?1 : (speedMul<=0?1:speedMul+1); bSpeed.textContent=speedMul+"×"; bPause.textContent="⏸"; bPause.classList.remove("on"); };
    ctrl.appendChild(bPause); ctrl.appendChild(bSpeed); wrap.appendChild(ctrl);

    document.body.appendChild(overlay);

    // ---- Rendu 3D ----
    const W=()=>wrap.clientWidth, H=()=>wrap.clientHeight;
    const renderer=new THREE.WebGLRenderer({antialias:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7));
    renderer.setSize(W(),H());
    renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    if("outputColorSpace" in renderer && THREE.SRGBColorSpace) renderer.outputColorSpace=THREE.SRGBColorSpace;
    else if("outputEncoding" in renderer && THREE.sRGBEncoding) renderer.outputEncoding=THREE.sRGBEncoding;
    if(THREE.ACESFilmicToneMapping){ renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.02; }
    wrap.insertBefore(renderer.domElement, hud); renderer.domElement.className="m3d-canvas";

    const scene=new THREE.Scene();
    scene.background=hex("#0e1420"); scene.fog=new THREE.Fog(0x0e1420,220,460);
    const cam=new THREE.PerspectiveCamera(40, W()/H(), 1, 900);
    cam.position.set(0,66,70);

    scene.add(new THREE.HemisphereLight(0xbfd8ff,0x24402a,0.8));
    scene.add(new THREE.AmbientLight(0xffffff,0.25));
    const sun=new THREE.DirectionalLight(0xfff2d8,1.05); sun.position.set(50,95,35);
    sun.castShadow=true; sun.shadow.mapSize.set(1024,1024);
    sun.shadow.camera.near=20; sun.shadow.camera.far=260;
    sun.shadow.camera.left=-80; sun.shadow.camera.right=80; sun.shadow.camera.top=60; sun.shadow.camera.bottom=-60;
    sun.shadow.bias=-0.0005; scene.add(sun); scene.add(sun.target);

    const pitch=new THREE.Mesh(new THREE.PlaneGeometry(HALF_X*2,HALF_Z*2),
      new THREE.MeshStandardMaterial({map:pitchTexture(), roughness:.95}));
    pitch.rotation.x=-Math.PI/2; pitch.receiveShadow=true; scene.add(pitch);
    const surround=new THREE.Mesh(new THREE.PlaneGeometry(HALF_X*2+60,HALF_Z*2+60),
      new THREE.MeshStandardMaterial({color:0x14532a, roughness:1}));
    surround.rotation.x=-Math.PI/2; surround.position.y=-0.05; surround.receiveShadow=true; scene.add(surround);

    const crowdTex=crowdTexture();
    function stand(x,z,w,d){ const tier=new THREE.Mesh(new THREE.BoxGeometry(w,13,d),
      new THREE.MeshStandardMaterial({map:crowdTex, roughness:1})); tier.position.set(x,7,z); scene.add(tier); }
    const gap=12;
    stand(0,-HALF_Z-gap,HALF_X*2+40,12); stand(0,HALF_Z+gap,HALF_X*2+40,12);
    stand(-HALF_X-gap,0,12,HALF_Z*2+8); stand(HALF_X+gap,0,12,HALF_Z*2+8);
    // buts (cages simples)
    function goal(x){ const m=new THREE.MeshStandardMaterial({color:0xf0f0f0});
      const g=new THREE.Group();
      [-4,4].forEach(z=>{ const p=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,7,8),m); p.position.set(x,3.5,z); p.castShadow=true; g.add(p); });
      const bar=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,8.4,8),m); bar.rotation.x=Math.PI/2; bar.position.set(x,7,0); g.add(bar);
      scene.add(g); }
    goal(HALF_X); goal(-HALF_X);

    const homePos=formation(1), awayPos=formation(-1);
    const tokens=[];
    homePos.forEach(p=>{ const m=makeToken(homeCol); m.position.copy(p); scene.add(m); tokens.push({m,base:p.clone(),team:0}); });
    awayPos.forEach(p=>{ const m=makeToken(awayCol); m.position.copy(p); scene.add(m); tokens.push({m,base:p.clone(),team:1}); });

    const ball=new THREE.Mesh(new THREE.SphereGeometry(0.95,20,16),
      new THREE.MeshStandardMaterial({color:0xffffff,roughness:.25,emissive:0x333333})); ball.castShadow=true; scene.add(ball);
    // Anneau de mise en avant du porteur du ballon
    const ring=new THREE.Mesh(new THREE.TorusGeometry(2.7,0.28,8,28),
      new THREE.MeshBasicMaterial({color:0xffe066})); ring.rotation.x=-Math.PI/2; ring.position.y=0.7; scene.add(ring);
    // Traînée du ballon (petites sphères qui s'estompent)
    const trail=[]; for(let i=0;i<6;i++){ const s=new THREE.Mesh(new THREE.SphereGeometry(0.55,10,8),
      new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.12})); s.visible=false; scene.add(s); trail.push(s); }
    let trailI=0;

    // ---- Simulation + statistiques ----
    const evs=(cfg.events||[]).slice().sort((a,b)=>a.min-b.min);
    const MIN0 = cfg.minStart||0, MIN1 = cfg.minEnd||90;
    let ei=0, hs=cfg.startHs||0, as=cfg.startAs||0;
    let poss=Math.random()<0.5?0:1;
    const target=new THREE.Vector3(0,0.95,0);
    let goalActive=false, goalEvent=null, celebrateUntil=0, kickoffAt=0, phaseAt=0, passAt=0;
    let carrier=null;
    let possAcc=[0.1,0.1], momentum=0;         // momentum: -1 (away) .. +1 (home)
    const stat={h:{t:0,c:0,k:0,f:0}, a:{t:0,c:0,k:0,f:0}};
    const scoreEl=hud.querySelector("#m3dScore"), minEl=hud.querySelector("#m3dMin");
    scoreEl.textContent=`${hs} - ${as}`;
    const el=id=>document.getElementById(id);
    const MIN_RATE=2.0; let simT=0; const clock=new THREE.Clock(); let raf=0, ended=false;

    function attackSign(t){ return t===0?1:-1; }
    // Passe : le ballon va vers un coéquipier (biais vers l'avant), avec risque d'interception
    function passBall(){
      if (Math.random()<0.16) poss = poss?0:1;                // interception / récupération
      const s=attackSign(poss);
      const team=tokens.filter(tk=>tk.team===poss && tk!==carrier && tk.base.x!==(poss===0?-50:50));
      team.sort((a,b)=> (b.m.position.x*s) - (a.m.position.x*s));   // les plus avancés d'abord
      const idx = Math.min(team.length-1, Math.floor(Math.random()*Math.random()*team.length)); // biais vers l'avant
      const rec = team[idx] || tokens.find(tk=>tk.team===poss);
      if (rec){ target.copy(rec.m.position); target.y=0.95; }
    }

    function feedLine(txt, side){
      const line=document.createElement("div");
      line.className="m3d-fl "+(side===0?"h":side===1?"a":"n");
      line.innerHTML=txt; feed.prepend(line);
      while(feed.children.length>7) feed.removeChild(feed.lastChild);
    }
    const teamName=s=> s===0?cfg.home.nom:cfg.away.nom;
    const BUILD=["fait tourner le ballon","cherche la faille","installe son jeu","presse haut","combine bien"];
    const CHANCE=["tente sa chance","frappe… à côté !","voit sa frappe contrée","manque le cadre de peu","alerte la défense"];
    const SAVE=["oblige le gardien à s'employer !","bute sur le portier !","voit le gardien repousser sa frappe !"];
    const pick=a=>a[(Math.random()*a.length)|0];

    function updateDash(){
      const tot=possAcc[0]+possAcc[1];
      const ph=Math.round(possAcc[0]/tot*100), pa=100-ph;
      const bh=el("m3dPossH"), ba=el("m3dPossA");
      bh.style.width=ph+"%"; bh.textContent=ph+"%"; ba.style.width=pa+"%"; ba.textContent=pa+"%";
      el("msH-t").textContent=stat.h.t; el("msH-c").textContent=stat.h.k; el("msH-k").textContent=stat.h.c; el("msH-f").textContent=stat.h.f;
      el("msA-t").textContent=stat.a.t; el("msA-c").textContent=stat.a.k; el("msA-k").textContent=stat.a.c; el("msA-f").textContent=stat.a.f;
      el("m3dMom").style.left = (50 + momentum*45) + "%";
    }
    function phase(side){
      const s=stat[side===0?"h":"a"], r=Math.random();
      if(r<0.5){ feedLine(`<b>${teamName(side)}</b> ${pick(BUILD)}.`, side); }
      else if(r<0.72){ s.t++; feedLine(`⚡ Occasion — <b>${teamName(side)}</b> ${pick(CHANCE)}`, side); }
      else if(r<0.86){ s.t++; s.k++; feedLine(`🧤 <b>${teamName(side)}</b> ${pick(SAVE)}`, side); }
      else if(r<0.95){ s.c++; feedLine(`⛳ Corner pour <b>${teamName(side)}</b>.`, side); }
      else { const f=side===0?"a":"h"; stat[f].f++; feedLine(`🟨 Faute de <b>${teamName(side===0?1:0)}</b>.`, side===0?1:0); }
      updateDash();
    }
    function registerGoal(ev){
      const s=ev.home?"h":"a"; stat[s].t++; stat[s].k++;
      if(ev.home) hs++; else as++; scoreEl.textContent=`${hs} - ${as}`;
      momentum = ev.home?0.9:-0.9;
      feedLine(`⚽ <b>BUT ${teamName(ev.home?0:1)} !</b> ${ev.joueur||""} <small>(${ev.min}')</small>`, ev.home?0:1);
      updateDash();
      overlay.classList.add("goal-flash"); setTimeout(()=>overlay.classList.remove("goal-flash"),650);
    }
    function finishScores(){ hs=cfg.hs; as=cfg.as; scoreEl.textContent=`${hs} - ${as}`; }

    function end(){
      if(ended) return; ended=true; cancelAnimationFrame(raf); finishScores(); updateDash();
      minEl.textContent = (cfg.endText? cfg.endText+" · " : "") + "Coup de sifflet final ⏱";
      feedLine(`⏱ <b>Fin du match — ${cfg.home.nom} ${hs}-${as} ${cfg.away.nom}</b>`, -1);
      btn.textContent=cfg.contBtn||"✔ Continuer"; btn.className="btn primary m3d-skip";
      btn.onclick=()=>{ cleanup(); onDone&&onDone(); };
    }
    function cleanup(){ cancelAnimationFrame(raf); try{ renderer.dispose(); renderer.forceContextLoss&&renderer.forceContextLoss(); }catch(e){} overlay.remove(); window.removeEventListener("resize",onResize); }
    btn.onclick=end;
    function onResize(){ renderer.setSize(W(),H()); cam.aspect=W()/H(); cam.updateProjectionMatrix(); }
    window.addEventListener("resize",onResize);

    // lissage image-indépendant : facteur = 1 - e^(-k·dt)
    const smooth=(k,dt)=>1-Math.exp(-k*dt);

    function loop(){
      raf=requestAnimationFrame(loop);
      const rdt=Math.min(clock.getDelta(),0.05);       // temps réel écoulé (rendu)
      const dt=rdt*speedMul;                            // temps simulé (0 si pause)
      simT+=dt;
      const minute=Math.min(MIN1, MIN0 + simT*MIN_RATE);
      minEl.textContent=`${cfg.label?cfg.label+" · ":""}${Math.floor(minute)}'`;

      if(dt>0){
        possAcc[poss]+=dt;
        momentum += ((poss===0?1:-1)*0.15 - momentum)*smooth(0.6,dt) + (Math.random()-0.5)*dt*0.3;
        momentum=Math.max(-1,Math.min(1,momentum));

        // phases de jeu (commentaire + stats)
        if(!goalActive && simT>phaseAt && simT>celebrateUntil){
          phaseAt=simT+1.5+Math.random()*1.9;
          const s = Math.random() < (0.5 + momentum*0.35) ? 0 : 1;
          phase(s);
        }
        // passes régulières : le ballon circule entre les pions
        if(!goalActive && simT>passAt && simT>celebrateUntil){
          passAt=simT+0.55+Math.random()*0.7; passBall();
        }
        // buts synchronisés sur les évènements réels
        if(!goalActive && ei<evs.length && minute>=evs[ei].min && simT>kickoffAt){
          goalActive=true; goalEvent=evs[ei]; ei++; poss=goalEvent.home?0:1;
          target.set(attackSign(poss)*HALF_X,0.95,(Math.random()*2-1)*3);
        }
        if(goalActive && Math.abs(ball.position.x)>=HALF_X-3){
          registerGoal(goalEvent); goalActive=false; celebrateUntil=simT+1.1; kickoffAt=simT+1.1; phaseAt=simT+1.3; passAt=simT+1.2;
          target.set(0,0.95,0); poss=goalEvent.home?1:0;
        }
      }

      // ballon : déplacement souple (plus vif sur une frappe au but)
      const k = goalActive?7.5:5.5;
      ball.position.lerp(target, smooth(k,rdt));
      ball.position.y=0.95+Math.abs(Math.sin(simT*8))*0.35*(goalActive?1:0.22);
      ball.rotation.x-=rdt*6; ball.rotation.z+=rdt*3;
      // traînée
      if(dt>0){ const s=trail[trailI]; s.visible=true; s.position.copy(ball.position); trailI=(trailI+1)%trail.length;
        trail.forEach((sp,i)=>{ if(sp.visible){ const age=(trailI-i+trail.length)%trail.length; sp.material.opacity=0.10*(1-age/trail.length); } }); }

      // pions : convergent souplement vers le ballon en gardant leur poste
      let best=null, nd=1e9;
      const bx=ball.position.x, bz=ball.position.z;
      tokens.forEach(tk=>{
        const isGK = tk.base.x===(tk.team===0?-50:50);
        const attr = isGK?0.05:0.26;
        tk._tx = tk.base.x + (bx-tk.base.x)*attr;
        tk._tz = tk.base.z + (bz-tk.base.z)*attr;
        const dx=tk.m.position.x-bx, dz=tk.m.position.z-bz, d=dx*dx+dz*dz;
        if(!isGK && d<nd){ nd=d; best=tk; }
      });
      // le porteur = pion le plus proche du ballon de l'équipe en possession
      if(best){ carrier=best;
        best._tx += (bx-best._tx)*0.6; best._tz += (bz-best._tz)*0.6; }
      const fSlow=smooth(4,rdt);
      tokens.forEach(tk=>{
        tk.m.position.x += (tk._tx-tk.m.position.x)*fSlow;
        tk.m.position.z += (tk._tz-tk.m.position.z)*fSlow;
        tk.m.position.x=Math.max(-HALF_X-2,Math.min(HALF_X+2,tk.m.position.x));
        tk.m.position.z=Math.max(-HALF_Z-2,Math.min(HALF_Z+2,tk.m.position.z));
      });
      // anneau du porteur (suit le ballon de près)
      ring.position.x += (bx-ring.position.x)*smooth(12,rdt);
      ring.position.z += (bz-ring.position.z)*smooth(12,rdt);

      // caméra tactique fluide
      const fc=smooth(2.2,rdt);
      cam.position.x += (bx*0.32-cam.position.x)*fc;
      cam.position.y += (66-cam.position.y)*fc;
      cam.position.z += (72-cam.position.z)*fc;
      cam.lookAt(bx*0.28, 0, bz*0.14);
      sun.target.position.set(bx*0.3,0,bz*0.3);

      renderer.render(scene,cam);
      if(minute>=MIN1 && !ended){ while(ei<evs.length){ registerGoal(evs[ei]); ei++; } end(); }
    }
    updateDash(); loop();
  };
})();
