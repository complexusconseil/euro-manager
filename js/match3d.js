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
  // Couleur de short : blanc si le maillot est sombre, sombre sinon (contraste)
  function shortColor(kit){
    const c = hex(kit); const lum = 0.299*c.r+0.587*c.g+0.114*c.b;
    return lum < 0.5 ? new THREE.Color("#f2f2f2") : new THREE.Color("#20242c");
  }

  /* Texture du terrain (pelouse tondue + lignes) dessinée sur un canvas */
  function pitchTexture(){
    const cw=2100, ch=1360, cv=document.createElement("canvas"); cv.width=cw; cv.height=ch;
    const g=cv.getContext("2d");
    const N=18;
    for(let i=0;i<N;i++){ g.fillStyle = i%2 ? "#218a3a" : "#1d7d34"; g.fillRect(i*cw/N,0,cw/N,ch); }
    // léger grain
    g.globalAlpha=0.05;
    for(let k=0;k<2200;k++){ g.fillStyle = Math.random()<.5?"#000":"#fff"; g.fillRect(Math.random()*cw,Math.random()*ch,2,2); }
    g.globalAlpha=1;
    g.strokeStyle="rgba(255,255,255,.92)"; g.lineWidth=5; g.lineCap="round";
    const M=40;                                   // marge (touche)
    g.strokeRect(M,M,cw-2*M,ch-2*M);
    g.beginPath(); g.moveTo(cw/2,M); g.lineTo(cw/2,ch-M); g.stroke();       // ligne médiane
    g.beginPath(); g.arc(cw/2,ch/2,140,0,7); g.stroke();                    // rond central
    g.beginPath(); g.arc(cw/2,ch/2,8,0,7); g.fillStyle="#fff"; g.fill();    // point central
    // surfaces + arcs (les deux côtés)
    const boxH=520, boxW=240, y0=(ch-boxH)/2;
    const sixH=260, sixW=90, y1=(ch-sixH)/2;
    const penX=200, penR=110;
    function side(left){
      const x0 = left ? M : cw-M-boxW;
      g.strokeRect(x0,y0,boxW,boxH);
      const x1 = left ? M : cw-M-sixW;
      g.strokeRect(x1,y1,sixW,sixH);
      // point de penalty
      const px = left ? M+penX : cw-M-penX;
      g.beginPath(); g.arc(px,ch/2,6,0,7); g.fill();
      // arc de surface
      g.beginPath();
      if(left) g.arc(px,ch/2,penR,-Math.PI/2.6,Math.PI/2.6);
      else     g.arc(px,ch/2,penR,Math.PI-Math.PI/2.6,Math.PI+Math.PI/2.6);
      g.stroke();
    }
    side(true); side(false);
    // arcs de corner
    [[M,M,0],[cw-M,M,Math.PI/2],[M,ch-M,-Math.PI/2],[cw-M,ch-M,Math.PI]].forEach(([x,y])=>{
      g.beginPath(); g.arc(x,y,16,0,7); g.stroke();
    });
    const tex=new THREE.CanvasTexture(cv); tex.anisotropy=8; return tex;
  }

  /* Texture "foule" pour les tribunes (petits points colorés) */
  function crowdTexture(){
    const cw=512, ch=128, cv=document.createElement("canvas"); cv.width=cw; cv.height=ch;
    const g=cv.getContext("2d"); g.fillStyle="#161b25"; g.fillRect(0,0,cw,ch);
    const cols=["#e5e7eb","#9aa4b2","#c0392b","#2d6cdf","#e0b83a","#7d8896","#d95f8a"];
    for(let k=0;k<2600;k++){
      g.fillStyle=cols[(Math.random()*cols.length)|0];
      g.globalAlpha=0.5+Math.random()*0.5;
      g.fillRect(Math.random()*cw,Math.random()*ch,3,3);
    }
    const tex=new THREE.CanvasTexture(cv); tex.wrapS=tex.wrapT=THREE.RepeatWrapping; tex.repeat.set(10,2); return tex;
  }

  const SKIN=[0xf2c8a0,0xe0aa78,0xc68642,0x8d5524];

  /* Joueur humanoïde animé (jambes/bras articulés) */
  function makePlayer(kit){
    const grp=new THREE.Group();
    const kitMat=new THREE.MeshStandardMaterial({color:hex(kit), roughness:.75, metalness:.02});
    const shortMat=new THREE.MeshStandardMaterial({color:shortColor(kit), roughness:.8});
    const skinMat=new THREE.MeshStandardMaterial({color:SKIN[(Math.random()*SKIN.length)|0], roughness:.9});
    const sockMat=new THREE.MeshStandardMaterial({color:hex(kit), roughness:.85});

    // Torse (maillot), légèrement conique
    const torso=new THREE.Mesh(new THREE.CylinderGeometry(0.78,0.98,1.9,12), kitMat);
    torso.position.y=2.75; torso.castShadow=true; grp.add(torso);
    // Épaules
    const shoulders=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.3,2.0,8), kitMat);
    shoulders.rotation.z=Math.PI/2; shoulders.position.y=3.5; shoulders.castShadow=true; grp.add(shoulders);
    // Tête + petit cou
    const head=new THREE.Mesh(new THREE.SphereGeometry(0.62,16,12), skinMat);
    head.position.y=4.35; head.castShadow=true; grp.add(head);
    const neck=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.24,0.4,8), skinMat);
    neck.position.y=3.85; grp.add(neck);

    // Bras articulés (pivot à l'épaule)
    function arm(sx){
      const pivot=new THREE.Group(); pivot.position.set(sx,3.45,0);
      const upper=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.20,1.05,8), kitMat);
      upper.position.y=-0.5; upper.castShadow=true; pivot.add(upper);
      const fore=new THREE.Mesh(new THREE.CylinderGeometry(0.19,0.16,0.9,8), skinMat);
      fore.position.y=-1.35; pivot.add(fore);
      grp.add(pivot); return pivot;
    }
    const armL=arm(-1.02), armR=arm(1.02);

    // Jambes articulées (pivot à la hanche)
    function leg(sx){
      const pivot=new THREE.Group(); pivot.position.set(sx,1.85,0);
      const short=new THREE.Mesh(new THREE.CylinderGeometry(0.34,0.30,0.7,8), shortMat);
      short.position.y=-0.25; short.castShadow=true; pivot.add(short);
      const thigh=new THREE.Mesh(new THREE.CylinderGeometry(0.26,0.22,0.95,8), skinMat);
      thigh.position.y=-1.0; pivot.add(thigh);
      const sock=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.17,0.85,8), sockMat);
      sock.position.y=-1.75; sock.castShadow=true; pivot.add(sock);
      const boot=new THREE.Mesh(new THREE.BoxGeometry(0.42,0.24,0.7), new THREE.MeshStandardMaterial({color:0x15171c,roughness:.6}));
      boot.position.set(0,-2.2,0.12); pivot.add(boot);
      grp.add(pivot); return pivot;
    }
    const legL=leg(-0.42), legR=leg(0.42);

    grp.userData={ legL, legR, armL, armR, phase:Math.random()*6.28, facing:0 };
    return grp;
  }

  function goalMesh(x){
    const grp=new THREE.Group();
    const mat=new THREE.MeshStandardMaterial({color:0xf4f4f4, roughness:.5});
    const post=(z)=>{ const m=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.22,7,10),mat); m.position.set(x,3.5,z); m.castShadow=true; grp.add(m); };
    post(-4); post(4);
    const bar=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.22,8.4,10),mat); bar.rotation.x=Math.PI/2; bar.position.set(x,7,0); bar.castShadow=true; grp.add(bar);
    // Filet en grille (deux plans : fond + toit)
    const netMat=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.16,side:THREE.DoubleSide,wireframe:true});
    const back=new THREE.Mesh(new THREE.PlaneGeometry(8.4,7,8,6), netMat);
    back.position.set(x+(x>0?3.2:-3.2),3.5,0); back.rotation.y=Math.PI/2; grp.add(back);
    const roof=new THREE.Mesh(new THREE.PlaneGeometry(8.4,3.2,8,3), netMat);
    roof.position.set(x+(x>0?1.6:-1.6),6.8,0); roof.rotation.x=Math.PI/2; roof.rotation.z=Math.PI/2; grp.add(roof);
    return grp;
  }

  function floodlight(x,z){
    const grp=new THREE.Group();
    const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.7,34,8), new THREE.MeshStandardMaterial({color:0x8a94a6}));
    pole.position.set(x,17,z); grp.add(pole);
    const panel=new THREE.Mesh(new THREE.BoxGeometry(9,4,1), new THREE.MeshStandardMaterial({color:0x2a3240}));
    panel.position.set(x,35,z + (z>0?-1:1)); panel.lookAt(0,0,0); grp.add(panel);
    const lamp=new THREE.Mesh(new THREE.BoxGeometry(8.4,3.4,0.5), new THREE.MeshBasicMaterial({color:0xfffbe6}));
    lamp.position.set(x,35,z + (z>0?-1.6:1.6)); lamp.lookAt(0,0,0); grp.add(lamp);
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
    renderer.setSize(W(),H());
    renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    if("outputColorSpace" in renderer && THREE.SRGBColorSpace) renderer.outputColorSpace=THREE.SRGBColorSpace;
    else if("outputEncoding" in renderer && THREE.sRGBEncoding) renderer.outputEncoding=THREE.sRGBEncoding;
    if(THREE.ACESFilmicToneMapping){ renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.05; }
    wrap.insertBefore(renderer.domElement, hud);
    renderer.domElement.className="m3d-canvas";

    const scene=new THREE.Scene();
    scene.background=hex("#7db4e6"); scene.fog=new THREE.Fog(0x7db4e6,180,400);

    const cam=new THREE.PerspectiveCamera(42, W()/H(), 1, 900);
    cam.position.set(0,46,80);

    // Éclairage : ciel/sol + soleil directionnel projetant des ombres
    scene.add(new THREE.HemisphereLight(0xbfdcff, 0x2a5030, 0.85));
    scene.add(new THREE.AmbientLight(0xffffff,0.22));
    const sun=new THREE.DirectionalLight(0xfff2d8,1.15); sun.position.set(60,95,40);
    sun.castShadow=true; sun.shadow.mapSize.set(1024,1024);
    sun.shadow.camera.near=20; sun.shadow.camera.far=260;
    sun.shadow.camera.left=-80; sun.shadow.camera.right=80; sun.shadow.camera.top=60; sun.shadow.camera.bottom=-60;
    sun.shadow.bias=-0.0005;
    scene.add(sun); scene.add(sun.target);

    // Terrain
    const pitch=new THREE.Mesh(new THREE.PlaneGeometry(HALF_X*2,HALF_Z*2),
      new THREE.MeshStandardMaterial({map:pitchTexture(), roughness:.95}));
    pitch.rotation.x=-Math.PI/2; pitch.receiveShadow=true; scene.add(pitch);
    // Pelouse extérieure (bordure)
    const surround=new THREE.Mesh(new THREE.PlaneGeometry(HALF_X*2+40,HALF_Z*2+40),
      new THREE.MeshStandardMaterial({color:0x186a2c, roughness:1}));
    surround.rotation.x=-Math.PI/2; surround.position.y=-0.05; surround.receiveShadow=true; scene.add(surround);

    // Tribunes gradinées avec foule
    const crowdTex=crowdTexture();
    function stand(x,z,w,d,ry){
      const g=new THREE.Group();
      const base=new THREE.Mesh(new THREE.BoxGeometry(w,3,d), new THREE.MeshStandardMaterial({color:0x232a36, roughness:1}));
      base.position.y=1.5; g.add(base);
      const tier=new THREE.Mesh(new THREE.BoxGeometry(w,14,d),
        new THREE.MeshStandardMaterial({map:crowdTex, roughness:1}));
      tier.position.set(0,9,0); tier.rotation.y=0; g.add(tier);
      g.position.set(x,0,z); g.rotation.y=ry; return g;
    }
    const gap=12;
    scene.add(stand(0,-HALF_Z-gap,HALF_X*2+40,14,0));
    scene.add(stand(0, HALF_Z+gap,HALF_X*2+40,14,0));
    scene.add(stand(-HALF_X-gap,0,14,HALF_Z*2+10,0));
    scene.add(stand( HALF_X+gap,0,14,HALF_Z*2+10,0));
    // Projecteurs aux 4 coins
    [[-HALF_X-gap,-HALF_Z-gap],[HALF_X+gap,-HALF_Z-gap],[-HALF_X-gap,HALF_Z+gap],[HALF_X+gap,HALF_Z+gap]]
      .forEach(([x,z])=>scene.add(floodlight(x,z)));

    scene.add(goalMesh(HALF_X)); scene.add(goalMesh(-HALF_X));

    // Joueurs
    const homePos=formation(1), awayPos=formation(-1);
    const players=[];
    homePos.forEach(p=>{ const m=makePlayer(cfg.home.couleurs?cfg.home.couleurs[0]:"#e33"); m.position.copy(p); scene.add(m); players.push({m,base:p.clone(),team:0,prev:p.clone()}); });
    awayPos.forEach(p=>{ const m=makePlayer(cfg.away.couleurs?cfg.away.couleurs[0]:"#33e"); m.position.copy(p); scene.add(m); players.push({m,base:p.clone(),team:1,prev:p.clone()}); });

    const ball=new THREE.Mesh(new THREE.SphereGeometry(0.6,18,14),
      new THREE.MeshStandardMaterial({color:0xffffff,roughness:.35}));
    ball.position.set(0,0.6,0); ball.castShadow=true; scene.add(ball);

    // ---- État de simulation ----
    const evs=(cfg.events||[]).slice().sort((a,b)=>a.min-b.min);
    let ei=0, hs=0, as=0, done=false;
    let poss=Math.random()<0.5?0:1, target=new THREE.Vector3(0,0.6,0), retargetAt=0;
    let goalActive=false, goalEvent=null, celebrateUntil=0, kickoffAt=0;
    const scoreEl=hud.querySelector("#m3dScore"), minEl=hud.querySelector("#m3dMin"), feedEl=hud.querySelector("#m3dFeed");
    const MIN_RATE=2.1;
    const clock=new THREE.Clock();
    let raf=0, ended=false;

    function attackSign(t){ return t===0?1:-1; }
    function newTarget(){
      const sign=attackSign(poss);
      const x = sign*(6+Math.random()*40);
      const z = (Math.random()*2-1)*26;
      target.set(x,0.6,z);
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

    const _v=new THREE.Vector3();
    function animatePlayer(pl, dt){
      const ud=pl.m.userData;
      // vitesse (distance parcourue cette frame)
      _v.copy(pl.m.position).sub(pl.prev); _v.y=0;
      const speed=_v.length()/Math.max(dt,0.001);
      pl.prev.copy(pl.m.position);
      // orientation vers le déplacement (ou vers le ballon si immobile)
      let dirX=_v.x, dirZ=_v.z;
      if(speed<0.5){ dirX=ball.position.x-pl.m.position.x; dirZ=ball.position.z-pl.m.position.z; }
      const wantFace=Math.atan2(dirX,dirZ);
      let df=wantFace-ud.facing; while(df>Math.PI)df-=6.283; while(df<-Math.PI)df+=6.283;
      ud.facing+=df*Math.min(1,dt*8); pl.m.rotation.y=ud.facing;
      // animation de course : amplitude selon la vitesse
      const run=Math.min(1, speed/14);
      ud.phase+=dt*(4+run*16);
      const sw=Math.sin(ud.phase)*(0.15+run*0.75);
      ud.legL.rotation.x= sw; ud.legR.rotation.x=-sw;
      ud.armL.rotation.x=-sw*0.8; ud.armR.rotation.x= sw*0.8;
      // léger rebond vertical à la foulée
      pl.m.position.y=Math.abs(Math.sin(ud.phase))*0.12*run;
    }

    function loop(){
      raf=requestAnimationFrame(loop);
      const dt=Math.min(clock.getDelta(),0.05);
      const t=clock.getElapsedTime();
      const minute=Math.min(90, t*MIN_RATE);
      minEl.textContent=`${cfg.label?cfg.label+" · ":""}${Math.floor(minute)}'`;

      if(!goalActive && ei<evs.length && minute>=evs[ei].min && t>kickoffAt){
        goalActive=true; goalEvent=evs[ei]; ei++;
        poss=goalEvent.home?0:1;
        const sign=attackSign(poss);
        target.set(sign*HALF_X, 0.6, (Math.random()*2-1)*3);
      }
      if(goalActive){
        if(Math.abs(ball.position.x)>=HALF_X-3){
          registerGoal(goalEvent);
          goalActive=false; celebrateUntil=t+1.1; kickoffAt=t+1.1;
          target.set(0,0.6,0); poss=goalEvent.home?1:0;
        }
      } else if(t>retargetAt && t>celebrateUntil){
        retargetAt=t+1.2+Math.random()*1.2;
        if(Math.random()<0.35) poss=poss?0:1;
        newTarget();
      }

      // déplacement du ballon (roule + petit arc sur les frappes)
      const spd=goalActive?0.10:0.045;
      ball.position.lerp(target, Math.min(1, spd + dt));
      const arc=goalActive?1:0.25;
      ball.position.y=0.6+Math.abs(Math.sin(t*7))*0.35*arc;
      ball.rotation.x-=dt*6; ball.rotation.z+=dt*3;

      // joueurs : se rapprochent du ballon en restant proches de leur poste
      let nearest=null, nd=1e9;
      players.forEach(pl=>{
        const isGK = pl.base.x===(pl.team===0?-50:50);
        const attraction = isGK?0.03:0.22;
        const tgt=pl.base.clone().lerp(new THREE.Vector3(ball.position.x,0,ball.position.z), attraction);
        const d=pl.m.position.distanceTo(ball.position);
        if(!isGK && d<nd){ nd=d; nearest=pl; }
        pl.m.position.lerp(tgt, Math.min(1,dt*1.5));
        pl.m.position.x=Math.max(-HALF_X-2,Math.min(HALF_X+2,pl.m.position.x));
        pl.m.position.z=Math.max(-HALF_Z-2,Math.min(HALF_Z+2,pl.m.position.z));
      });
      if(nearest){
        const chase=new THREE.Vector3(ball.position.x,0,ball.position.z);
        nearest.m.position.lerp(chase, Math.min(1,dt*2.5));
      }
      players.forEach(pl=>animatePlayer(pl,dt));

      // caméra broadcast : légèrement en hauteur, suit le ballon
      const camTargetX=ball.position.x*0.6;
      cam.position.x += (camTargetX-cam.position.x)*Math.min(1,dt*1.8);
      cam.position.y += (46-cam.position.y)*Math.min(1,dt*1.8);
      cam.position.z += (80-cam.position.z)*Math.min(1,dt*1.8);
      cam.lookAt(ball.position.x*0.55, 2, ball.position.z*0.25);
      // le soleil suit la zone de jeu (ombres cohérentes)
      sun.target.position.set(ball.position.x*0.4,0,ball.position.z*0.4);

      renderer.render(scene,cam);
      if(minute>=90 && !ended){
        while(ei<evs.length){ registerGoal(evs[ei]); ei++; }
        end();
      }
    }
    loop();
  };
})();
