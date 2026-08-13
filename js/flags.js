/* ============================================================
   EURO MANAGER — drapeaux vectoriels
   Remplace les emoji drapeaux (illisibles sous Windows, absents
   de nombreuses polices) par de petits SVG dessinés à la main.
   Syntaxe : "type|couleurs[|marque:couleur]"
   ============================================================ */
(function(){
"use strict";
const FM = window.FM = window.FM || {};

/* types :
   s   plein                     v/h   3 bandes égales (vert./horiz.)
   v2/h2  2 bandes               vu    2 bandes verticales 2:3
   hu  3 bandes horiz. 1:2:1     hu2   3 bandes horiz. 2:1:1
   cr  croix centrée             nc    croix nordique
   sal sautoir                   d     diagonale
   q   4 quartiers
   marques : disc, star, cres, tri (triangle au guindant), cant (canton) */
const P = {
FRA:"v|#002654,#fff,#ce1126",           ENG:"cr|#fff,#ce1126",
ESP:"hu|#aa151b,#f1bf00,#aa151b",       ITA:"v|#008c45,#f4f5f0,#cd212a",
GER:"h|#000,#dd0000,#ffce00",           POR:"vu|#046a38,#da291c|disc:#ffe000",
BRA:"s|#009b3a|disc:#ffdf00",           ARG:"h|#74acdf,#fff,#74acdf|disc:#f6b40e",
NED:"h|#ae1c28,#fff,#21468b",           BEL:"v|#000,#fdda24,#ef3340",
GRE:"cant|#0d5eaf,#fff",                CRO:"h|#ff0000,#fff,#171796",
NOR:"nc|#ba0c2f,#fff,#00205b",          DEN:"nc|#c8102e,#fff,#c8102e",
SUI:"cr|#da291c,#fff",                  AUT:"h|#ed2939,#fff,#ed2939",
TUR:"s|#e30a17|cres:#fff",              UKR:"h2|#005bbb,#ffd500",
SRB:"h|#c6363c,#0c4076,#fff",           POL:"h2|#fff,#dc143c",
SWE:"nc|#006aa7,#fecc00,#006aa7",       SCO:"sal|#0065bf,#fff",
HUN:"h|#cd2a3e,#fff,#436f4d",           CZE:"h2|#fff,#d7141a|tri:#11457e",
WAL:"h2|#fff,#00ad48|disc:#c8102e",     ROU:"v|#002b7f,#fcd116,#ce1126",
URU:"cant|#fff,#0038a8",                COL:"hu2|#fcd116,#003893,#ce1126",
ECU:"hu2|#ffdd00,#034ea2,#ef3340",      CHI:"h2|#fff,#d52b1e|cant:#0039a6",
PER:"v|#d91023,#fff,#d91023",           PAR:"h|#d52b1e,#fff,#0038a8",
MAR:"s|#c1272d|star:#006233",           SEN:"v|#00853f,#fdef42,#e31b23|star:#00853f",
NGA:"v|#008751,#fff,#008751",           EGY:"h|#ce1126,#fff,#000",
ALG:"v2|#006233,#fff|cres:#d21034",     CIV:"v|#f77f00,#fff,#009e60",
CMR:"v|#007a5e,#ce1126,#fcd116",        GHA:"h|#ce1126,#fcd116,#006b3f|star:#000",
TUN:"s|#e70013|disc:#fff",              JPN:"s|#fff|disc:#bc002d",
KOR:"s|#fff|disc:#cd2e3a",              IRN:"h|#239f40,#fff,#da0000",
AUS:"s|#00247d|cant:#012169",           KSA:"s|#006c35",
MEX:"v|#006847,#fff,#ce1126",           USA:"h|#b31942,#fff,#b31942|cant:#0a3161",
CAN:"hu|#d80621,#fff,#d80621",          RUS:"h|#fff,#0039a6,#d52b1e",
SVK:"h|#fff,#0b4ea2,#ee1c25",           SVN:"h|#fff,#0000a0,#de2918",
IRL:"v|#169b62,#fff,#ff883e",           NIR:"cr|#fff,#ce1126",
ISL:"nc|#02529c,#fff,#dc1e35",          FIN:"nc|#fff,#003580,#003580",
BIH:"s|#002395|tri:#fecb00",            ALB:"s|#e41e20|disc:#1c1c1c",
MKD:"s|#d20000|disc:#ffe600",           BUL:"h|#fff,#00966e,#d62612",
GEO:"cr|#fff,#ff0000",                  ISR:"h|#fff,#0038b8,#fff|star:#0038b8",
MNE:"s|#c40308|disc:#d4af37",           KOS:"s|#244aa5|disc:#d0a650",
BLR:"h2|#ce1720,#4aa657",               KAZ:"s|#00afca|disc:#fec50c",
VEN:"h|#ffcc00,#00247d,#cf142b",        BOL:"h|#d52b1e,#f9e300,#007a33",
RSA:"h|#007a4d,#fff,#de3831|tri:#000",  MLI:"v|#14b53a,#fcd116,#ce1126",
BFA:"h2|#ef2b2d,#009e49|star:#fcd116",  COD:"d|#007fff,#f7d618",
GUI:"v|#ce1126,#fcd116,#009460",        CPV:"h|#003893,#fff,#003893",
GAB:"h|#009e60,#fcd116,#3a75c4",        ZAM:"s|#198a00",
ANG:"h2|#ce1126,#000",                  QAT:"vu|#fff,#8a1538",
IRQ:"h|#ce1126,#fff,#000",              UAE:"h|#00732f,#fff,#000|tri:#ce1126",
UZB:"h|#0099b5,#fff,#1eb53a",           JOR:"h|#000,#fff,#007a3d|tri:#ce1126",
CHN:"s|#de2910|star:#ffde00",           OMA:"h|#fff,#db161b,#008000|tri:#db161b",
VIE:"s|#da251d|star:#ff0",              THA:"h|#a51931,#241d4f,#a51931",
CRC:"h|#002b7f,#fff,#ce1126",           PAN:"q|#fff,#da121a,#0000ab,#fff",
JAM:"sal|#009b3a,#fed100",              HON:"h|#0073cf,#fff,#0073cf",
SLV:"h|#0f47af,#fff,#0f47af",           TRI:"d|#ce1126,#000",
NZL:"s|#00247d|cant:#012169",           EUR:"s|#003399|disc:#ffcc00",
WLD:"s|#123a5f|disc:#5ec8f5"
};

/* ---------- Constructeur SVG (viewBox 30×20) ---------- */
function shapes(spec){
  const parts = spec.split("|");
  const type  = parts[0];
  const c     = (parts[1]||"#888").split(",");
  const mark  = parts[2] || "";
  let g = "";
  const rect = (x,y,w,h,f) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"/>`;

  switch(type){
    case "s":   g = rect(0,0,30,20,c[0]); break;
    case "v":   g = rect(0,0,10,20,c[0])+rect(10,0,10,20,c[1])+rect(20,0,10,20,c[2]); break;
    case "v2":  g = rect(0,0,15,20,c[0])+rect(15,0,15,20,c[1]); break;
    case "vu":  g = rect(0,0,12,20,c[0])+rect(12,0,18,20,c[1]); break;
    case "h":   g = rect(0,0,30,6.67,c[0])+rect(0,6.67,30,6.66,c[1])+rect(0,13.33,30,6.67,c[2]); break;
    case "h2":  g = rect(0,0,30,10,c[0])+rect(0,10,30,10,c[1]); break;
    case "hu":  g = rect(0,0,30,5,c[0])+rect(0,5,30,10,c[1])+rect(0,15,30,5,c[2]); break;
    case "hu2": g = rect(0,0,30,10,c[0])+rect(0,10,30,5,c[1])+rect(0,15,30,5,c[2]); break;
    case "q":   g = rect(0,0,15,10,c[0])+rect(15,0,15,10,c[1])+rect(0,10,15,10,c[2])+rect(15,10,15,10,c[3]); break;
    case "d":   g = rect(0,0,30,20,c[0])+`<path d="M0 20 L30 0 L30 4 L6 20 Z" fill="${c[1]}"/>`; break;
    case "cr":  g = rect(0,0,30,20,c[0])+rect(12,0,6,20,c[1])+rect(0,7,30,6,c[1]); break;
    case "nc":  g = rect(0,0,30,20,c[0])+rect(9,0,6,20,c[1])+rect(0,7,30,6,c[1])
                  + rect(10.5,0,3,20,c[2]||c[1])+rect(0,8.5,30,3,c[2]||c[1]); break;
    case "sal": g = rect(0,0,30,20,c[0])
                  + `<path d="M0 0 L4 0 L30 17 L30 20 L26 20 L0 3 Z" fill="${c[1]}"/>`
                  + `<path d="M30 0 L26 0 L0 17 L0 20 L4 20 L30 3 Z" fill="${c[1]}"/>`; break;
    case "cant":/* champ rayé + canton uni (Grèce, Uruguay) */
      g = rect(0,0,30,20,c[1]);
      for (let i=0;i<5;i++) g += rect(0,i*4,30,2,c[0]);
      g += rect(0,0,12,8,c[0]);
      break;
    default:    g = rect(0,0,30,20,c[0]);
  }
  if (mark){
    const [kind,mc] = mark.split(":");
    if (kind==="disc")  g += `<circle cx="15" cy="10" r="4.4" fill="${mc}"/>`;
    if (kind==="star")  g += star(15,10,4.6,mc);
    if (kind==="cres")  g += `<circle cx="14" cy="10" r="4.4" fill="${mc}"/>`
                          +  `<circle cx="15.9" cy="10" r="3.5" fill="${c[0]}"/>`
                          +  star(21,10,2.6,mc);
    if (kind==="tri")   g += `<path d="M0 0 L11 10 L0 20 Z" fill="${mc}"/>`;
    if (kind==="cant")  g += `<rect x="0" y="0" width="15" height="10" fill="${mc}"/>`
                          +  `<path d="M0 0 L15 10 M15 0 L0 10" stroke="#fff" stroke-width="1.4"/>`;
  }
  return g;
}
function star(cx,cy,r,fill){
  let d="";
  for (let i=0;i<5;i++){
    const a1 = -Math.PI/2 + i*2*Math.PI/5, a2 = a1 + Math.PI/5;
    d += (i?"L":"M") + (cx+r*Math.cos(a1)).toFixed(2) + " " + (cy+r*Math.sin(a1)).toFixed(2)
       + "L" + (cx+r*.42*Math.cos(a2)).toFixed(2) + " " + (cy+r*.42*Math.sin(a2)).toFixed(2);
  }
  return `<path d="${d}Z" fill="${fill}"/>`;
}

const cache = {};
/* FM.flag("FRA")        → <svg class="flag">…
   FM.flag("FRA","big")  → version agrandie                       */
FM.flag = function(code, cls){
  const key = (code||"")+"|"+(cls||"");
  if (cache[key]) return cache[key];
  const spec = P[code] || P.WLD;
  const svg = `<svg class="flag${cls?" "+cls:""}" viewBox="0 0 30 20" `
            + `preserveAspectRatio="none" aria-hidden="true">${shapes(spec)}</svg>`;
  return (cache[key] = svg);
};
FM.hasFlag = code => !!P[code];
FM.FLAG_SPECS = P;

})();
