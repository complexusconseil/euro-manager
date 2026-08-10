/* ============================================================
   MOTEUR 3D DE MATCH — rendu immersif du terrain (Three.js)
   FM3D.play(cfg, onDone) : visualise un match.
   cfg = { home:{nom,couleurs}, away:{nom,couleurs}, hs, as,
           events:[{min,joueur,home}], label, endText }
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

  const HALF_X = 52.5, HALF_Z = 34;   // demi-dimensions du terrain

  function hex(c){ return new THREE.Color(c || "#888888"); }

  /* Texture du terrain (pelouse + lignes) dessinée sur un canvas */
  function pitchTexture(){
    const cw=1050, ch=680, cv=document.createElement("canvas"); cv.width=cw; cv.height=ch;
    const g=cv.getContext("2d");
    // bandes de pelouse
    for(let i=0;i<20;i++){ g.fillStyle = i%2 ? "#2f9c46" : "#2a913f"; g.fillRect(i*cw/20,0,cw/20,ch); }
    g.strokeStyle="rgba(255,255,255,.9)"; g.lineWidth=4;
    g.strokeRect(20,20,cw-40,ch-40);
    g.beginPath(); g.moveTo(cw/2,20); g.lineTo(cw/2,ch-20); g.stroke();
    g.beginPath(); g.arc(cw/2,ch/2,70,0,7); g.stroke();
    g.beginPath(); g.arc(cw/2,ch/2,4,0,7); g.fillStyle="#fff"; g.fill();
    // surfaces
    const boxH=260, boxW=120, y0=(ch-boxH)/2;
    g.strokeRect(20,y0,boxW,boxH); g.strokeRect(cw-20-boxW,y0,boxW,boxH);
    const sixH=130, sixW=50, y1=(ch-sixH)/2;
    g.strokeRect(20,y1,sixW,sixH); g.strokeRect(cw-20-sixW,y1,sixW,sixH);
    const tex=new THREE.CanvasTexture(cv); tex.anisotropy=4; return tex;
  }

  function makePlayer(color){
    const grp=new THREE.Group();
    const body=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.3,4.2,10),
      new THREE.MeshStandardMaterial({color:hex(color), roughness:.8}));
    body.position.y=2.6; grp.add(body);
    const head=new THREE.Mesh(new THREE.SphereGeometry(1.0,12,10),
      new THREE.MeshStandardMaterial({color:0xf0c9a0, roughness:.9}));
    head.position.y=5.4; grp.add(head);
    return grp;
  }

  function goalMesh(x){
    const grp=new THREE.Group();
    const mat=new THREE.MeshStandardMaterial({color:0xffffff});
    const post=(z)=>{ const m=new THREE.Mesh(new THREE.BoxGeometry(0.4,7,0.4),mat); m.position.set(x,3.5,z); grp.add(m); };
    post(-4); post(4);
    const bar=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.4,8.4),mat); bar.position.set(x,7,0); grp.add(bar);
    const net=new THREE.Mesh(new THREE.PlaneGeometry(8.4,7),
      new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.12,side:THREE.DoubleSide}));
    net.position.set(x+(x>0?2.5:-2.5),3.5,0); net.rotation.y=Math.PI/2; grp.add(net);
    return grp;
  }

  function formation(sign){ // sign +1 : attaque vers +X
    const pos=[];
    pos.push([sign*-50,0]);                                   // GK
    [-22,-8,8,22].forEach(z=>pos.push([sign*-32,z]));         // DEF
    [-18,0,18].forEach(z=>pos.push([sign*-12,z]));            // MID
    [-16,0,16].forEach(z=>pos.push([sign*6,z]));              // FWD
    return pos.map(p=>new THREE.Vector3(p[0],0,p[1]));
  }

  FM3D.play = function(cfg, onDone){
    const overlay=document.createElement("div"); overlay.className="overlay overlay3d";
    const wrap=document.createElement("div"); wrap.className="m3d-wrap"; overlay.appendChild(wrap);
    // HUD
    const hud=document.createElement("div"); hud.className="m3d-hud";
    hud.innerHTML=`<div class="m3d-score">
        <span class="t">${cfg.home.nom}</span>
        <b id="m3dScore">0 - 0</b>
        <span class="t">${cfg.away.nom}</span>
      </div>
      <div class="m3d-min" id="m3dMin">${cfg.label||""} · 0'</div>
      <div class="m3d-feed" id="m3dFeed"></div>`;
    wrap.appendChild(hud);
    const btn=document.createElement("button"); btn.className="btn ghost m3d-skip"; btn.textContent="⏭ Passer";
    wrap.appendChild(btn);
    document.body.appendChild(overlay);

    const W=()=>wrap.clientWidth, H=()=>wrap.clientHeight;
    const renderer=new THREE.WebGLRenderer({antialias:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7));
    renderer.setSize(W(),H()); wrap.insertBefore(renderer.domElement, hud);
    renderer.domElement.className="m3d-canvas";

    const scene=new THREE.Scene();
    scene.background=hex("#8fc7ee"); scene.fog=new THREE.Fog(0x8fc7ee,140,320);
    const cam=new THREE.PerspectiveCamera(45, W()/H(), 1, 800);
    cam.position.set(0,44,74);

    scene.add(new THREE.AmbientLight(0xffffff,.75));
    const sun=new THREE.DirectionalLight(0xffffff,.85); sun.position.set(40,80,30); scene.add(sun);

    // Terrain
    const pitch=new THREE.Mesh(new THREE.PlaneGeometry(HALF_X*2,HALF_Z*2),
      new THREE.MeshStandardMaterial({map:pitchTexture(), roughness:1}));
    pitch.rotation.x=-Math.PI/2; scene.add(pitch);
    // Bordure/tribunes
    const standMat=new THREE.MeshStandardMaterial({color:0x2b3446, roughness:1});
    [[0,-HALF_Z-8,HALF_X*2+30,10],[0,HALF_Z+8,HALF_X*2+30,10]].forEach(([x,z,w,d])=>{
      const s=new THREE.Mesh(new THREE.BoxGeometry(w,12,d),standMat); s.position.set(x,6,z); scene.add(s);
    });
    [[-HALF_X-8,0,10,HALF_Z*2+30],[HALF_X+8,0,10,HALF_Z*2+30]].forEach(([x,z,w,d])=>{
      const s=new THREE.Mesh(new THREE.BoxGeometry(w,12,d),standMat); s.position.set(x,6,z); scene.add(s);
    });
    scene.add(goalMesh(HALF_X)); scene.add(goalMesh(-HALF_X));

    // Joueurs
    const homePos=formation(1), awayPos=formation(-1);
    const players=[];
    homePos.forEach(p=>{ const m=makePlayer(cfg.home.couleurs?cfg.home.couleurs[0]:"#e33"); m.position.copy(p); scene.add(m); players.push({m,base:p.clone(),team:0}); });
    awayPos.forEach(p=>{ const m=makePlayer(cfg.away.couleurs?cfg.away.couleurs[0]:"#33e"); m.position.copy(p); scene.add(m); players.push({m,base:p.clone(),team:1}); });

    const ball=new THREE.Mesh(new THREE.SphereGeometry(0.85,16,12),
      new THREE.MeshStandardMaterial({color:0xffffff,roughness:.4}));
    ball.position.set(0,0.85,0); scene.add(ball);

    // ---- État de simulation ----
    const evs=(cfg.events||[]).slice().sort((a,b)=>a.min-b.min);
    let ei=0, hs=0, as=0, done=false;
    let poss=Math.random()<0.5?0:1, target=new THREE.Vector3(0,0.85,0), retargetAt=0;
    let goalActive=false, goalEvent=null, celebrateUntil=0, kickoffAt=0;
    const scoreEl=hud.querySelector("#m3dScore"), minEl=hud.querySelector("#m3dMin"), feedEl=hud.querySelector("#m3dFeed");
    const MIN_RATE=2.1; // minutes de jeu par seconde réelle (~43s)
    const clock=new THREE.Clock();
    let raf=0, ended=false;

    function attackSign(t){ return t===0?1:-1; }
    function newTarget(){
      const sign=attackSign(poss);
      const x = sign*(6+Math.random()*40);
      const z = (Math.random()*2-1)*26;
      target.set(x,0.85,z);
    }
    function registerGoal(ev){
      if(ev.home) hs++; else as++;
      scoreEl.textContent=`${hs} - ${as}`;
      const line=document.createElement("div"); line.className="m3d-goal";
      line.innerHTML=`⚽ <b>${ev.joueur||"But"}</b> <small>${ev.min}' · ${ev.home?cfg.home.nom:cfg.away.nom}</small>`;
      feedEl.prepend(line);
      overlay.classList.add("goal-flash"); setTimeout(()=>overlay.classList.remove("goal-flash"),650);
    }
    function finishScores(){ hs=cfg.hs; as=cfg.as; scoreEl.textContent=`${hs} - ${as}`; }

    function end(){
      if(ended) return; ended=true; done=true;
      cancelAnimationFrame(raf);
      finishScores();
      minEl.textContent = (cfg.endText? cfg.endText+" · " : "") + "Coup de sifflet final ⏱";
      btn.textContent="✔ Continuer"; btn.className="btn primary m3d-skip";
      btn.onclick=()=>{ cleanup(); onDone&&onDone(); };
    }
    function cleanup(){
      cancelAnimationFrame(raf);
      try{ renderer.dispose(); renderer.forceContextLoss&&renderer.forceContextLoss(); }catch(e){}
      overlay.remove(); window.removeEventListener("resize",onResize);
    }
    btn.onclick=end;
    function onResize(){ renderer.setSize(W(),H()); cam.aspect=W()/H(); cam.updateProjectionMatrix(); }
    window.addEventListener("resize",onResize);

    function loop(){
      raf=requestAnimationFrame(loop);
      const dt=Math.min(clock.getDelta(),0.05);
      const t=clock.getElapsedTime();
      const minute=Math.min(90, t*MIN_RATE);
      minEl.textContent=`${cfg.label?cfg.label+" · ":""}${Math.floor(minute)}'`;

      // déclenchement des buts
      if(!goalActive && ei<evs.length && minute>=evs[ei].min && t>kickoffAt){
        goalActive=true; goalEvent=evs[ei]; ei++;
        poss=goalEvent.home?0:1;
        const sign=attackSign(poss);
        target.set(sign*HALF_X, 0.85, (Math.random()*2-1)*3);
      }
      if(goalActive){
        // le ballon fonce vers le but
        if(Math.abs(ball.position.x)>=HALF_X-3){
          registerGoal(goalEvent);
          goalActive=false; celebrateUntil=t+1.1; kickoffAt=t+1.1;
          target.set(0,0.85,0); poss=goalEvent.home?1:0; // remise au centre, l'autre engage
        }
      } else if(t>retargetAt && t>celebrateUntil){
        retargetAt=t+1.2+Math.random()*1.2;
        if(Math.random()<0.35) poss=poss?0:1;   // changement de possession
        newTarget();
      }

      // déplacement du ballon
      const spd=goalActive?0.10:0.045;
      ball.position.lerp(target, Math.min(1, spd + dt));
      ball.position.y=0.85+Math.abs(Math.sin(t*8))*0.3*(goalActive?1:0.3);

      // déplacement des joueurs (suivent le ballon, restent près de leur position)
      let nearest=null, nd=1e9;
      players.forEach(pl=>{
        const isGK = pl.base.x===(pl.team===0?-50:50);
        const attraction = isGK?0.03:0.22;
        const tgt=pl.base.clone().lerp(new THREE.Vector3(ball.position.x,0,ball.position.z), attraction);
        // le plus proche du ballon le presse
        const d=pl.m.position.distanceTo(ball.position);
        if(!isGK && d<nd){ nd=d; nearest=pl; }
        pl.m.position.lerp(tgt, Math.min(1,dt*1.5));
        pl.m.position.x=Math.max(-HALF_X-2,Math.min(HALF_X+2,pl.m.position.x));
        pl.m.position.z=Math.max(-HALF_Z-2,Math.min(HALF_Z+2,pl.m.position.z));
      });
      if(nearest){ nearest.m.position.lerp(new THREE.Vector3(ball.position.x,0,ball.position.z), Math.min(1,dt*2.5)); }

      // caméra broadcast qui suit le jeu
      const camTargetX=ball.position.x*0.55;
      cam.position.x += (camTargetX-cam.position.x)*Math.min(1,dt*2);
      cam.position.y += (44-cam.position.y)*Math.min(1,dt*2);
      cam.position.z += (74-cam.position.z)*Math.min(1,dt*2);
      cam.lookAt(ball.position.x*0.5, 2, ball.position.z*0.25);

      renderer.render(scene,cam);
      if(minute>=90 && !ended){ // s'assurer que tous les buts sont comptés
        while(ei<evs.length){ registerGoal(evs[ei]); ei++; }
        end();
      }
    }
    loop();
  };
})();
