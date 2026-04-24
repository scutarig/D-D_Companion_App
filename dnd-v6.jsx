import { useState, useEffect, useCallback } from "react";
const fl=document.createElement("link");fl.href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&display=swap";fl.rel="stylesheet";document.head.appendChild(fl);

const C={
  bg:"#08080f",surface:"#0e0e1a",card:"#13131e",cardHi:"#1a1a28",
  border:"rgba(255,255,255,0.07)",borderBright:"rgba(255,255,255,0.15)",
  gold:"#f0c060",goldDim:"#8a6820",
  red:"#dc2626",redBright:"#ef4444",redDim:"#7f1d1d",
  blue:"#2563eb",blueBright:"#60a5fa",
  green:"#16a34a",greenBright:"#4ade80",
  purple:"#7c3aed",purpleBright:"#a78bfa",purpleDim:"#4c1d95",
  teal:"#0d9488",tealBright:"#2dd4bf",
  amber:"#d97706",amberBright:"#fbbf24",
  text:"#e2e0f0",textDim:"#6b6880",textBright:"#f8f7ff",
};
const F="'Calibri','Trebuchet MS','Gill Sans',sans-serif";
const FH="'Cinzel',serif";
const sx={
  app:{background:C.bg,minHeight:"100vh",fontFamily:F,color:C.text,display:"flex",flexDirection:"column"},
  hdr:{background:"linear-gradient(135deg,#0e0e1a 0%,#1a0a2e 100%)",borderBottom:"1px solid rgba(124,58,237,0.2)",padding:"8px 12px",display:"flex",alignItems:"center",gap:10,boxShadow:"0 1px 30px rgba(100,30,180,0.18)",flexShrink:0},
  hT:{fontFamily:FH,fontSize:15,fontWeight:900,color:C.gold,letterSpacing:2,margin:0,whiteSpace:"nowrap",textShadow:"0 0 20px rgba(240,192,96,0.35)"},
  hS:{color:C.textDim,fontSize:9,fontStyle:"italic",whiteSpace:"nowrap"},
  nav:{background:"#09090f",borderBottom:"1px solid rgba(124,58,237,0.18)",display:"flex",overflowX:"auto",padding:"8px 10px",gap:5,alignItems:"center",WebkitOverflowScrolling:"touch",scrollbarWidth:"none",msOverflowStyle:"none",flexShrink:0},
  nb:(a)=>({background:a?"linear-gradient(135deg,#7c3aed,#5b21b6)":"transparent",border:a?"none":`1px solid ${C.border}`,borderRadius:14,color:a?"#fff":C.textDim,fontFamily:FH,fontSize:10,fontWeight:a?700:400,padding:"6px 11px",cursor:"pointer",whiteSpace:"nowrap",transition:"all .2s",letterSpacing:.5,boxShadow:a?"0 2px 12px rgba(124,58,237,0.4)":"none",flexShrink:0}),
  main:{flex:1,padding:"10px 8px",maxWidth:980,margin:"0 auto",width:"100%",boxSizing:"border-box"},
  card:{background:"rgba(255,255,255,0.028)",border:`1px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:10,boxShadow:"0 4px 24px rgba(0,0,0,0.3)"},
  cardAccent:(col)=>({background:`${col}0a`,border:`1px solid ${col}25`,borderRadius:12,padding:14,marginBottom:10}),
  ct:{fontFamily:FH,color:C.gold,fontSize:12,fontWeight:700,marginBottom:10,letterSpacing:1,borderBottom:"1px solid rgba(240,192,96,0.15)",paddingBottom:6},
  inp:{background:"rgba(0,0,0,0.35)",border:`1px solid ${C.border}`,borderRadius:8,color:C.textBright,fontFamily:F,fontSize:14,padding:"8px 10px",width:"100%",outline:"none",boxSizing:"border-box",transition:"border-color .2s"},
  sel:{background:"rgba(0,0,0,0.35)",border:`1px solid ${C.border}`,borderRadius:8,color:C.textBright,fontFamily:F,fontSize:14,padding:"8px 10px",width:"100%",outline:"none",boxSizing:"border-box"},
  ta:{background:"rgba(0,0,0,0.35)",border:`1px solid ${C.border}`,borderRadius:8,color:C.textBright,fontFamily:F,fontSize:14,padding:"8px 10px",width:"100%",outline:"none",boxSizing:"border-box",resize:"vertical"},
  btn:(c=C.purple)=>({background:`linear-gradient(135deg,${c},${c}bb)`,border:"none",borderRadius:8,color:"#fff",fontFamily:FH,fontSize:11,fontWeight:700,padding:"7px 13px",cursor:"pointer",letterSpacing:.5,boxShadow:`0 2px 10px ${c}35`,transition:"all .2s"}),
  bsm:(c=C.purple)=>({background:`${c}18`,border:`1px solid ${c}44`,borderRadius:6,color:c,fontFamily:F,fontSize:11,padding:"4px 9px",cursor:"pointer",transition:"all .15s"}),
  g2:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:10},
  g3:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:8},
  lbl:{display:"block",color:C.textDim,fontSize:10,marginBottom:4,fontFamily:F,fontWeight:700,letterSpacing:.8,textTransform:"uppercase"},
  tag:(c=C.red)=>({background:`${c}18`,border:`1px solid ${c}44`,borderRadius:20,color:c,fontSize:11,padding:"2px 8px",display:"inline-block"}),
  pill:(c=C.purple,active=false)=>({background:active?`${c}33`:"transparent",border:`1px solid ${active?c:C.border}`,borderRadius:20,color:active?c:C.textDim,fontFamily:F,fontSize:12,fontWeight:active?700:400,padding:"4px 12px",cursor:"pointer",transition:"all .15s"}),
  row:{display:"flex",alignItems:"center",gap:8},
  jb:{display:"flex",alignItems:"center",justifyContent:"space-between"},
  statBox:(col)=>({background:`${col}12`,border:`1px solid ${col}30`,borderRadius:12,padding:"10px 8px",textAlign:"center",flex:"1 1 70px",minWidth:70}),
};

function useMobile(){const[m,setM]=useState(false);useEffect(()=>{const check=()=>setM(window.innerWidth<640);check();window.addEventListener("resize",check);return()=>window.removeEventListener("resize",check);},[]);return m;}

function usePersist(key,def){
  const[v,setRaw]=useState(def);const[rdy,setRdy]=useState(false);
  useEffect(()=>{
    // Reset to actual default (not empty) so components don't break when storage is empty
    setRaw(Array.isArray(def)?[...def]:typeof def==="object"&&def!==null?{...def}:def);
    setRdy(false);
    (async()=>{try{const r=await window.storage?.get(key);if(r?.value)setRaw(JSON.parse(r.value));}catch(e){}setRdy(true);})();
  },[key]); // eslint-disable-line
  const set=useCallback((u)=>{setRaw(prev=>{const next=typeof u==="function"?u(prev):u;try{window.storage?.set(key,JSON.stringify(next));}catch(e){}return next;});},[key]);
  return[v,set,rdy];
}

const modOf=s=>Math.floor((s-10)/2);
const modStr=s=>{const m=modOf(s);return m>=0?`+${m}`:`${m}`;};
const rollD=n=>Math.floor(Math.random()*n)+1;
const getPB=l=>l<5?2:l<9?3:l<13?4:l<17?5:6;
const ABS=["STR","DEX","CON","INT","WIS","CHA"];
const SKILLS={STR:["Athletics"],DEX:["Acrobatics","Sleight of Hand","Stealth"],CON:[],INT:["Arcana","History","Investigation","Nature","Religion"],WIS:["Animal Handling","Insight","Medicine","Perception","Survival"],CHA:["Deception","Intimidation","Performance","Persuasion"]};
const SC={STR:"#c04040",DEX:"#40c0a0",CON:"#c08040",INT:"#4080c0",WIS:"#a040c0",CHA:"#c06090"};

/* --- */
const MONSTERS=[
  {id:1,name:"Bandit",cr:"1/8",hp:11,ac:12,speed:"30ft",type:"Humanoid",size:"Medium",str:11,dex:12,con:12,int:10,wis:10,cha:10,notes:"Scimitar 1d6+1"},
  {id:2,name:"Bandit Captain",cr:"2",hp:65,ac:15,speed:"30ft",type:"Humanoid",size:"Medium",str:15,dex:16,con:14,int:14,wis:11,cha:14,notes:"Multiattack 3x. Parieren +2 AC."},
  {id:3,name:"Bugbear",cr:"1",hp:27,ac:16,speed:"30ft",type:"Humanoid",size:"Medium",str:15,dex:14,con:13,int:8,wis:11,cha:9,notes:"Brute +1d6. Surprise +2d6."},
  {id:4,name:"Cultist",cr:"1/8",hp:9,ac:12,speed:"30ft",type:"Humanoid",size:"Small",str:11,dex:12,con:10,int:10,wis:11,cha:10,notes:"Vorteil vs Charm/Fright."},
  {id:5,name:"Goblin",cr:"1/4",hp:7,ac:15,speed:"30ft",type:"Humanoid",size:"Small",str:8,dex:14,con:10,int:10,wis:8,cha:8,notes:"Nimble Escape: Disengage/Hide als Bonus."},
  {id:6,name:"Hobgoblin",cr:"1/2",hp:11,ac:18,speed:"30ft",type:"Humanoid",size:"Medium",str:13,dex:12,con:12,int:10,wis:10,cha:9,notes:"Martial Advantage +2d6 wenn Verbündeter daneben."},
  {id:7,name:"Kobold",cr:"1/8",hp:5,ac:12,speed:"30ft",type:"Humanoid",size:"Small",str:7,dex:15,con:9,int:8,wis:7,cha:8,notes:"Pack Tactics: Vorteil wenn Verbündeter daneben."},
  {id:8,name:"Orc",cr:"1/2",hp:15,ac:13,speed:"30ft",type:"Humanoid",size:"Medium",str:16,dex:12,con:16,int:7,wis:11,cha:10,notes:"Aggressive: Bonus-Aktion bewegen zu Feind."},
  {id:9,name:"Skeleton",cr:"1/4",hp:13,ac:13,speed:"30ft",type:"Undead",size:"Medium",str:10,dex:14,con:15,int:6,wis:8,cha:5,notes:"Immun Gift/Erschöpfung. Verwundbar Wucht."},
  {id:10,name:"Zombie",cr:"1/4",hp:22,ac:8,speed:"20ft",type:"Undead",size:"Medium",str:13,dex:6,con:16,int:3,wis:6,cha:5,notes:"Undead Fortitude: CON-Save DC 5+Schaden statt Tod."},
  {id:11,name:"Wolf",cr:"1/4",hp:11,ac:13,speed:"40ft",type:"Beast",size:"Medium",str:12,dex:15,con:12,int:3,wis:12,cha:6,notes:"Pack Tactics. Knockdown: STR DC11 oder Prone."},
  {id:12,name:"Giant Spider",cr:"1",hp:26,ac:14,speed:"30ft",type:"Beast",size:"Large",str:14,dex:16,con:12,int:2,wis:11,cha:4,notes:"Netz: DC11 STR oder Restrained. Biss: Gift DC11."},
  {id:13,name:"Troll",cr:"5",hp:84,ac:15,speed:"30ft",type:"Giant",size:"Large",str:18,dex:13,con:20,int:7,wis:9,cha:7,notes:"Regeneration 10HP/Rd (nicht Feuer/Säure). Multiattack."},
  {id:14,name:"Ogre",cr:"2",hp:59,ac:11,speed:"40ft",type:"Giant",size:"Large",str:19,dex:8,con:16,int:5,wis:7,cha:7,notes:"Greatclub: 2d8+4."},
  {id:15,name:"Owlbear",cr:"3",hp:59,ac:13,speed:"40ft",type:"Monstrosity",size:"Large",str:20,dex:12,con:17,int:3,wis:12,cha:7,notes:"Multiattack. Beak+Claw. Rampage."},
  {id:16,name:"Dire Wolf",cr:"1",hp:37,ac:14,speed:"50ft",type:"Beast",size:"Large",str:17,dex:15,con:15,int:3,wis:12,cha:7,notes:"Pack Tactics. Knockdown DC13."},
  {id:17,name:"Ghoul",cr:"1",hp:22,ac:12,speed:"30ft",type:"Undead",size:"Medium",str:13,dex:15,con:10,int:7,wis:10,cha:6,notes:"Klaue: Paralyze DC10. Biss: heilt 2d6."},
  {id:18,name:"Vampire Spawn",cr:"5",hp:82,ac:15,speed:"30ft",type:"Undead",size:"Medium",str:16,dex:16,con:16,int:11,wis:10,cha:12,notes:"Regeneration 10 (Heiliger Schaden/Sonnenlicht). Biss: Sog."},
  {id:19,name:"Wyvern",cr:"6",hp:110,ac:13,speed:"20ft/80ft fly",type:"Dragon",size:"Large",str:19,dex:10,con:16,int:5,wis:12,cha:6,notes:"Klaue+Stachel (Gift DC15). Multiattack."},
  {id:20,name:"Young Dragon (Red)",cr:"10",hp:178,ac:18,speed:"40ft/80ft fly",type:"Dragon",size:"Large",str:23,dex:10,con:21,int:14,wis:11,cha:19,notes:"Feueratem 9d10 DC17. Multiattack 3x."},
  {id:21,name:"Mage",cr:"6",hp:40,ac:12,speed:"30ft",type:"Humanoid",size:"Medium",str:9,dex:14,con:11,int:17,wis:12,cha:11,notes:"Zauber: Fireball, Fly, Misty Step, Cone of Cold."},
  {id:22,name:"Knight",cr:"3",hp:52,ac:18,speed:"30ft",type:"Humanoid",size:"Medium",str:16,dex:11,con:14,int:11,wis:11,cha:15,notes:"Multiattack 2x. Parieren +2 AC Reaktion."},
  {id:23,name:"Priest",cr:"2",hp:27,ac:13,speed:"30ft",type:"Humanoid",size:"Medium",str:10,dex:10,con:12,int:13,wis:16,cha:13,notes:"Zauber: Cure Wounds, Guiding Bolt, Hold Person."},
  {id:24,name:"Werewolf",cr:"3",hp:58,ac:11,speed:"30ft/50ft",type:"Humanoid",size:"Medium",str:15,dex:13,con:14,int:10,wis:11,cha:10,notes:"Immunität B/P/S nichtmagisch. Biss: Lycanthropy DC12."},
  {id:25,name:"Tarrasque",cr:"30",hp:676,ac:25,speed:"40ft",type:"Monstrosity",size:"Gargantuan",str:30,dex:11,con:30,int:3,wis:11,cha:11,notes:"Legendary Resist 3x. Reflective Carapace. Multiattack 5x."},
];

const SRD_ITEMS=[
  {id:1,name:"Langschwert",type:"Weapon",sub:"Martial Melee",dmg:"1d8 S",ac:"",eff:"",wt:"3 lb",rar:"Common",notes:"Vielseitig: 1d10 zweihändig.",custom:false},
  {id:2,name:"Kurzschwert",type:"Weapon",sub:"Simple Melee",dmg:"1d6 P",ac:"",eff:"",wt:"2 lb",rar:"Common",notes:"Finesse, leicht.",custom:false},
  {id:3,name:"Dolch",type:"Weapon",sub:"Simple Melee",dmg:"1d4 P",ac:"",eff:"",wt:"1 lb",rar:"Common",notes:"Finesse, leicht, wurfbar (20/60ft).",custom:false},
  {id:4,name:"Streitaxt",type:"Weapon",sub:"Martial Melee",dmg:"1d8 H",ac:"",eff:"",wt:"4 lb",rar:"Common",notes:"Vielseitig: 1d10.",custom:false},
  {id:5,name:"Großschwert",type:"Weapon",sub:"Martial Melee",dmg:"2d6 S",ac:"",eff:"",wt:"6 lb",rar:"Common",notes:"Schwer, zweihändig.",custom:false},
  {id:6,name:"Rapier",type:"Weapon",sub:"Martial Melee",dmg:"1d8 P",ac:"",eff:"",wt:"2 lb",rar:"Common",notes:"Finesse.",custom:false},
  {id:7,name:"Streitkolben",type:"Weapon",sub:"Simple Melee",dmg:"1d6 B",ac:"",eff:"",wt:"4 lb",rar:"Common",notes:"—",custom:false},
  {id:8,name:"Hellebarde",type:"Weapon",sub:"Martial Melee",dmg:"1d10 H",ac:"",eff:"",wt:"6 lb",rar:"Common",notes:"Schwer, Reach, zweihändig.",custom:false},
  {id:9,name:"Lanze",type:"Weapon",sub:"Martial Melee",dmg:"1d12 P",ac:"",eff:"",wt:"6 lb",rar:"Common",notes:"Reach 10ft. Nachteil auf 5ft.",custom:false},
  {id:10,name:"Langbogen",type:"Weapon",sub:"Martial Ranged",dmg:"1d8 P",ac:"",eff:"",wt:"2 lb",rar:"Common",notes:"Reichweite 150/600ft. Schwer, zweihändig.",custom:false},
  {id:11,name:"Handarmbrust",type:"Weapon",sub:"Martial Ranged",dmg:"1d6 P",ac:"",eff:"",wt:"3 lb",rar:"Common",notes:"Reichweite 30/120ft. Leicht, leichte Armbrust.",custom:false},
  {id:12,name:"Kettenpanzer",type:"Armor",sub:"Heavy Armor",dmg:"",ac:"16",eff:"",wt:"55 lb",rar:"Common",notes:"STR 13 benötigt. Nachteil Stealth.",custom:false},
  {id:13,name:"Lederpanzer",type:"Armor",sub:"Light Armor",dmg:"",ac:"11+DEX",eff:"",wt:"10 lb",rar:"Common",notes:"—",custom:false},
  {id:14,name:"Kettenhemd",type:"Armor",sub:"Medium Armor",dmg:"",ac:"13+DEX(max2)",eff:"",wt:"20 lb",rar:"Common",notes:"—",custom:false},
  {id:15,name:"Plattenpanzer",type:"Armor",sub:"Heavy Armor",dmg:"",ac:"18",eff:"",wt:"65 lb",rar:"Common",notes:"STR 15. Nachteil Stealth.",custom:false},
  {id:16,name:"Schild",type:"Armor",sub:"Shield",dmg:"",ac:"+2",eff:"",wt:"6 lb",rar:"Common",notes:"Nicht mit zweihändigen Waffen.",custom:false},
  {id:17,name:"Heiltrank",type:"Item",sub:"Potion",dmg:"",ac:"",eff:"2d4+2 HP",wt:"0.5 lb",rar:"Common",notes:"Bonus-Aktion (selbst) oder Aktion (anderer).",custom:false},
  {id:18,name:"Großer Heiltrank",type:"Item",sub:"Potion",dmg:"",ac:"",eff:"4d4+4 HP",wt:"0.5 lb",rar:"Uncommon",notes:"—",custom:false},
  {id:19,name:"Überlegener Heiltrank",type:"Item",sub:"Potion",dmg:"",ac:"",eff:"8d4+8 HP",wt:"0.5 lb",rar:"Rare",notes:"—",custom:false},
  {id:20,name:"Seil (50ft)",type:"Item",sub:"Gear",dmg:"",ac:"",eff:"",wt:"10 lb",rar:"Common",notes:"Bis 300 Pfund tragen. Zerreißen: DC 17 STR.",custom:false},
  {id:21,name:"Enterhaken",type:"Item",sub:"Gear",dmg:"",ac:"",eff:"",wt:"4 lb",rar:"Common",notes:"Mit Seil für Klettern. Wurfweite 60ft.",custom:false},
  {id:22,name:"Fackeln (10)",type:"Item",sub:"Gear",dmg:"1 B",ac:"",eff:"",wt:"10 lb",rar:"Common",notes:"Beleuchtung: 20ft hell, 20ft dämmrig. 1h.",custom:false},
  {id:23,name:"Feldration (1 Tag)",type:"Item",sub:"Gear",dmg:"",ac:"",eff:"",wt:"2 lb",rar:"Common",notes:"—",custom:false},
  {id:24,name:"Arkaner Fokus",type:"Item",sub:"Spellcasting Focus",dmg:"",ac:"",eff:"",wt:"1 lb",rar:"Common",notes:"Ersetzt materielle Komponenten ohne GP-Wert.",custom:false},
  {id:25,name:"+1 Waffe",type:"Weapon",sub:"Magic",dmg:"+1",ac:"",eff:"",wt:"—",rar:"Uncommon",notes:"+1 auf Angriff und Schaden. Magisch.",custom:false},
  {id:26,name:"+2 Waffe",type:"Weapon",sub:"Magic",dmg:"+2",ac:"",eff:"",wt:"—",rar:"Rare",notes:"+2 auf Angriff und Schaden.",custom:false},
  {id:27,name:"+3 Waffe",type:"Weapon",sub:"Magic",dmg:"+3",ac:"",eff:"",wt:"—",rar:"Very Rare",notes:"+3 auf Angriff und Schaden.",custom:false},
  {id:28,name:"+1 Rüstung",type:"Armor",sub:"Magic",dmg:"",ac:"+1",eff:"",wt:"—",rar:"Rare",notes:"+1 auf AC-Basiswert.",custom:false},
  {id:29,name:"Amulett der Gesundheit",type:"Item",sub:"Magic",dmg:"",ac:"",eff:"CON=19",wt:"—",rar:"Rare",notes:"Req. Attunement. CON wird 19 (wenn nicht höher).",custom:false},
  {id:30,name:"Ring der Unsichtbarkeit",type:"Item",sub:"Magic",dmg:"",ac:"",eff:"Unsichtbar",wt:"—",rar:"Legendary",notes:"Req. Attunement. Unsichtbar bis Angriff/Zauber.",custom:false},
  {id:31,name:"Stiefel des Elfenschritts",type:"Item",sub:"Magic",dmg:"",ac:"",eff:"Kein Stealth-Nachteil",wt:"—",rar:"Uncommon",notes:"Req. Attunement. Bewegungsgeräusche unterdrückt.",custom:false},
  {id:32,name:"Umhang des Schutzes",type:"Item",sub:"Magic",dmg:"",ac:"+1",eff:"+1 Saves",wt:"—",rar:"Uncommon",notes:"Req. Attunement. +1 AC und Saves.",custom:false},
  {id:33,name:"Handschuhe der Stärke",type:"Item",sub:"Magic",dmg:"",ac:"",eff:"STR=19",wt:"—",rar:"Rare",notes:"Req. Attunement. STR wird 19.",custom:false},
  {id:34,name:"Mithral-Rüstung",type:"Armor",sub:"Magic",dmg:"",ac:"Normal",eff:"",wt:"—",rar:"Uncommon",notes:"Kein STR-Req. Kein Nachteil auf Stealth.",custom:false},
  {id:35,name:"Vorpal-Schwert",type:"Weapon",sub:"Magic",dmg:"+3",ac:"",eff:"Nat20=Enthauptung",wt:"—",rar:"Legendary",notes:"Req. Attunement. +3. Nat20: Enthauptung (wenn kein Kopf-Immun).",custom:false},
  {id:36,name:"Froststahl",type:"Weapon",sub:"Magic",dmg:"+1d6 Kälte",ac:"",eff:"Feuer-Resist",wt:"3 lb",rar:"Very Rare",notes:"Req. Attunement. +1d6 Kälte. Feuer-Resistenz. Löscht Flammen 30ft.",custom:false},
  {id:37,name:"Tarnumhang",type:"Item",sub:"Magic",dmg:"",ac:"",eff:"Verstecken +10",wt:"—",rar:"Uncommon",notes:"+10 auf Stealth. Als Aktion vollständig unsichtbar.",custom:false},
  {id:38,name:"Alchemisten-Feuer",type:"Item",sub:"Gear",dmg:"1d4/Rd",ac:"",eff:"",wt:"1 lb",rar:"Common",notes:"Wurfwaffe (20ft). 1d4 Feuer/Runde bis gelöscht (Aktion DC10).",custom:false},
  {id:39,name:"Heilkräuter",type:"Item",sub:"Gear",dmg:"",ac:"",eff:"+1 HD",wt:"0.5 lb",rar:"Common",notes:"Hit Dice während kurzer Rast +1 Ergebnis.",custom:false},
  {id:40,name:"Schriftrolle (1. Grad)",type:"Item",sub:"Scroll",dmg:"",ac:"",eff:"1 Zauber",wt:"—",rar:"Common",notes:"Enthält einen Zauber 1. Grades. Einmal verwendbar.",custom:false},
];

const SPELLS=[
  {id:1,name:"Fire Bolt",lv:0,school:"Evocation",ct:"1 Aktion",range:"120ft",comp:"V,S",dur:"Sofort",cls:["Sorcerer","Wizard"],desc:"1d10 Feuer (5:2d10, 11:3d10, 17:4d10).",dmg:"1d10",dt:"fire"},
  {id:2,name:"Prestidigitation",lv:0,school:"Transmutation",ct:"1 Aktion",range:"10ft",comp:"V,S",dur:"1 Min.",cls:["Bard","Sorcerer","Wizard","Warlock"],desc:"Kleine magische Effekte.",dmg:"—",dt:"—"},
  {id:3,name:"Mage Hand",lv:0,school:"Conjuration",ct:"1 Aktion",range:"30ft",comp:"V,S",dur:"1 Min.",cls:["Bard","Sorcerer","Wizard","Warlock"],desc:"Ätherhand: 10lb tragen, Türen öffnen.",dmg:"—",dt:"—"},
  {id:4,name:"Eldritch Blast",lv:0,school:"Evocation",ct:"1 Aktion",range:"120ft",comp:"V,S",dur:"Sofort",cls:["Warlock"],desc:"1d10 Kraft. +1 Strahl bei Level 5/11/17.",dmg:"1d10",dt:"force"},
  {id:5,name:"Sacred Flame",lv:0,school:"Evocation",ct:"1 Aktion",range:"60ft",comp:"V,S",dur:"Sofort",cls:["Cleric"],desc:"DC DEX: 1d8 Strahlend (5:2d8, 11:3d8, 17:4d8).",dmg:"1d8",dt:"radiant"},
  {id:6,name:"Guidance",lv:0,school:"Divination",ct:"1 Aktion",range:"Touch",comp:"V,S",dur:"Conc. 1 Min.",cls:["Cleric","Druid"],desc:"Ziel: +1d4 auf einen Ability Check.",dmg:"—",dt:"—"},
  {id:7,name:"Healing Word",lv:1,school:"Evocation",ct:"Bonus",range:"60ft",comp:"V",dur:"Sofort",cls:["Bard","Cleric","Druid"],desc:"1d4+WIS HP. +1d4/Slot.",dmg:"1d4",dt:"healing"},
  {id:8,name:"Cure Wounds",lv:1,school:"Evocation",ct:"1 Aktion",range:"Touch",comp:"V,S",dur:"Sofort",cls:["Bard","Cleric","Druid","Paladin","Ranger"],desc:"1d8+Spellcasting-Mod HP. +1d8/Slot.",dmg:"1d8",dt:"healing"},
  {id:9,name:"Magic Missile",lv:1,school:"Evocation",ct:"1 Aktion",range:"120ft",comp:"V,S",dur:"Sofort",cls:["Sorcerer","Wizard"],desc:"3 Pfeile à 1d4+1 Kraft. Immer Treffer. +1 Pfeil/Slot.",dmg:"3×1d4+1",dt:"force"},
  {id:10,name:"Shield",lv:1,school:"Abjuration",ct:"Reaktion",range:"Self",comp:"V,S",dur:"1 Runde",cls:["Sorcerer","Wizard"],desc:"+5 AC bis nächster Zug. Auch vs Magic Missile.",dmg:"—",dt:"—"},
  {id:11,name:"Burning Hands",lv:1,school:"Evocation",ct:"1 Aktion",range:"Self",comp:"V,S",dur:"Sofort",cls:["Sorcerer","Wizard"],desc:"15ft Kegel: 3d6 Feuer DC DEX. +1d6/Slot.",dmg:"3d6",dt:"fire"},
  {id:12,name:"Charm Person",lv:1,school:"Enchantment",ct:"1 Aktion",range:"30ft",comp:"V,S",dur:"1 Stunde",cls:["Bard","Druid","Sorcerer","Warlock","Wizard"],desc:"DC WIS: Ziel ist Charmed. +1 Ziel/Slot.",dmg:"—",dt:"—"},
  {id:13,name:"Sleep",lv:1,school:"Enchantment",ct:"1 Aktion",range:"90ft",comp:"V,S,M",dur:"1 Min.",cls:["Bard","Sorcerer","Wizard"],desc:"5d8 HP Wesen einschläfern. +2d8/Slot.",dmg:"5d8",dt:"—"},
  {id:14,name:"Thunderwave",lv:1,school:"Evocation",ct:"1 Aktion",range:"Self",comp:"V,S",dur:"Sofort",cls:["Bard","Cleric","Druid","Sorcerer","Wizard"],desc:"15ft Würfel: 2d8 Donner DC CON + 10ft weggestoßen.",dmg:"2d8",dt:"thunder"},
  {id:15,name:"Guiding Bolt",lv:1,school:"Evocation",ct:"1 Aktion",range:"120ft",comp:"V,S",dur:"1 Runde",cls:["Cleric"],desc:"4d6 Strahlend. Nächster Angriff: Vorteil. +1d6/Slot.",dmg:"4d6",dt:"radiant"},
  {id:16,name:"Inflict Wounds",lv:1,school:"Necromancy",ct:"1 Aktion",range:"Touch",comp:"V,S",dur:"Sofort",cls:["Cleric"],desc:"3d10 Nekrose. +1d10/Slot.",dmg:"3d10",dt:"necrotic"},
  {id:17,name:"Hunter's Mark",lv:1,school:"Divination",ct:"Bonus",range:"90ft",comp:"V",dur:"Conc. 1h",cls:["Ranger"],desc:"+1d6 Schaden bei Angriffen auf Ziel. Kann wechseln.",dmg:"+1d6",dt:"—"},
  {id:18,name:"Hex",lv:1,school:"Enchantment",ct:"Bonus",range:"90ft",comp:"V,S,M",dur:"Conc. 1h",cls:["Warlock"],desc:"+1d6 Nekrose bei Treffern. Nachteil auf Attribut.",dmg:"+1d6",dt:"necrotic"},
  {id:19,name:"Thunderous Smite",lv:1,school:"Evocation",ct:"Bonus",range:"Self",comp:"V",dur:"Conc. 1 Min.",cls:["Paladin"],desc:"Nächster Treffer: +2d6 Donner. DC STR: 10ft weg+Prone.",dmg:"2d6",dt:"thunder"},
  {id:20,name:"Misty Step",lv:2,school:"Conjuration",ct:"Bonus",range:"Self",comp:"V",dur:"Sofort",cls:["Sorcerer","Warlock","Wizard"],desc:"Teleport 30ft zu freiem Platz den du siehst.",dmg:"—",dt:"—"},
  {id:21,name:"Hold Person",lv:2,school:"Enchantment",ct:"1 Aktion",range:"60ft",comp:"V,S,M",dur:"Conc. 1 Min.",cls:["Bard","Cleric","Druid","Sorcerer","Warlock","Wizard"],desc:"DC WIS: Paralyzed. +1 Ziel/Slot.",dmg:"—",dt:"—"},
  {id:22,name:"Shatter",lv:2,school:"Evocation",ct:"1 Aktion",range:"60ft",comp:"V,S,M",dur:"Sofort",cls:["Bard","Sorcerer","Warlock","Wizard"],desc:"10ft Radius: 3d8 Donner DC CON. +1d8/Slot.",dmg:"3d8",dt:"thunder"},
  {id:23,name:"Invisibility",lv:2,school:"Illusion",ct:"1 Aktion",range:"Touch",comp:"V,S,M",dur:"Conc. 1h",cls:["Bard","Sorcerer","Warlock","Wizard"],desc:"Unsichtbar bis Angriff/Zauber. +1 Ziel/Slot.",dmg:"—",dt:"—"},
  {id:24,name:"Spiritual Weapon",lv:2,school:"Evocation",ct:"Bonus",range:"60ft",comp:"V,S",dur:"1 Min.",cls:["Cleric"],desc:"Geistwaffe: 1d8+WIS Kraft. Bonus-Aktion bewegen/angreifen.",dmg:"1d8",dt:"force"},
  {id:25,name:"Fireball",lv:3,school:"Evocation",ct:"1 Aktion",range:"150ft",comp:"V,S,M",dur:"Sofort",cls:["Sorcerer","Wizard"],desc:"20ft Radius: 8d6 Feuer DC DEX. +1d6/Slot.",dmg:"8d6",dt:"fire"},
  {id:26,name:"Lightning Bolt",lv:3,school:"Evocation",ct:"1 Aktion",range:"Self",comp:"V,S,M",dur:"Sofort",cls:["Sorcerer","Wizard"],desc:"100ft Linie: 8d6 Blitz DC DEX. +1d6/Slot.",dmg:"8d6",dt:"lightning"},
  {id:27,name:"Counterspell",lv:3,school:"Abjuration",ct:"Reaktion",range:"60ft",comp:"S",dur:"Sofort",cls:["Sorcerer","Warlock","Wizard"],desc:"Zauber Lv≤3: auto. Lv4+: Spellcasting-Check DC 10+Lv.",dmg:"—",dt:"—"},
  {id:28,name:"Dispel Magic",lv:3,school:"Abjuration",ct:"1 Aktion",range:"120ft",comp:"V,S",dur:"Sofort",cls:["Bard","Cleric","Druid","Paladin","Sorcerer","Warlock","Wizard"],desc:"Alle Zauber ≤3 enden. Höher: Check DC 10+Lv.",dmg:"—",dt:"—"},
  {id:29,name:"Haste",lv:3,school:"Transmutation",ct:"1 Aktion",range:"30ft",comp:"V,S,M",dur:"Conc. 1 Min.",cls:["Sorcerer","Wizard"],desc:"Speed×2, +2 AC, Vorteil DEX-Saves, Bonus-Aktion.",dmg:"—",dt:"—"},
  {id:30,name:"Revivify",lv:3,school:"Necromancy",ct:"1 Aktion",range:"Touch",comp:"V,S,M",dur:"Sofort",cls:["Cleric","Druid","Paladin"],desc:"Tot ≤1 Min: 1 HP zurück. M: 300gp Diamant.",dmg:"1",dt:"healing"},
  {id:31,name:"Spirit Guardians",lv:3,school:"Conjuration",ct:"1 Aktion",range:"Self",comp:"V,S,M",dur:"Conc. 10 Min.",cls:["Cleric"],desc:"15ft Radius: 3d8 DC WIS. +1d8/Slot.",dmg:"3d8",dt:"radiant"},
  {id:32,name:"Polymorph",lv:4,school:"Transmutation",ct:"1 Aktion",range:"60ft",comp:"V,S,M",dur:"Conc. 1h",cls:["Bard","Druid","Sorcerer","Wizard"],desc:"DC WIS: in Tier verwandeln (CR≤Level).",dmg:"—",dt:"—"},
  {id:33,name:"Banishment",lv:4,school:"Abjuration",ct:"1 Aktion",range:"60ft",comp:"V,S,M",dur:"Conc. 1 Min.",cls:["Cleric","Paladin","Sorcerer","Warlock","Wizard"],desc:"DC CHA: gebannt. Bei 1 Min: permanent (andere Ebene).",dmg:"—",dt:"—"},
  {id:34,name:"Greater Invisibility",lv:4,school:"Illusion",ct:"1 Aktion",range:"Touch",comp:"V,S",dur:"Conc. 1 Min.",cls:["Bard","Sorcerer","Wizard"],desc:"Unsichtbar auch beim Angreifen/Zaubern.",dmg:"—",dt:"—"},
  {id:35,name:"Cone of Cold",lv:5,school:"Evocation",ct:"1 Aktion",range:"Self",comp:"V,S,M",dur:"Sofort",cls:["Sorcerer","Wizard"],desc:"60ft Kegel: 8d8 Kälte DC CON. +1d8/Slot.",dmg:"8d8",dt:"cold"},
  {id:36,name:"Mass Cure Wounds",lv:5,school:"Evocation",ct:"1 Aktion",range:"60ft",comp:"V,S",dur:"Sofort",cls:["Bard","Cleric","Druid"],desc:"6 Wesen: 3d8+Mod HP. +1d8/Slot.",dmg:"3d8",dt:"healing"},
  {id:37,name:"Hold Monster",lv:5,school:"Enchantment",ct:"1 Aktion",range:"90ft",comp:"V,S,M",dur:"Conc. 1 Min.",cls:["Bard","Sorcerer","Warlock","Wizard"],desc:"Jede Kreatur: DC WIS Paralyzed. +1 Ziel/Slot.",dmg:"—",dt:"—"},
  {id:38,name:"Disintegrate",lv:6,school:"Transmutation",ct:"1 Aktion",range:"60ft",comp:"V,S,M",dur:"Sofort",cls:["Sorcerer","Wizard"],desc:"DC DEX: 10d6+40 Kraft. Tod: Staub. +3d6/Slot.",dmg:"10d6+40",dt:"force"},
  {id:39,name:"Heal",lv:6,school:"Evocation",ct:"1 Aktion",range:"60ft",comp:"V,S",dur:"Sofort",cls:["Cleric","Druid"],desc:"70 HP. Heilt Blindheit, Taubheit, Krankheit.",dmg:"70",dt:"healing"},
  {id:40,name:"Finger of Death",lv:7,school:"Necromancy",ct:"1 Aktion",range:"60ft",comp:"V,S",dur:"Sofort",cls:["Sorcerer","Warlock","Wizard"],desc:"DC CON: 7d8+30 Nekrose. Tod=Zombie.",dmg:"7d8+30",dt:"necrotic"},
  {id:41,name:"Power Word Stun",lv:8,school:"Enchantment",ct:"1 Aktion",range:"60ft",comp:"V",dur:"Varies",cls:["Sorcerer","Warlock","Wizard"],desc:"≤150HP: Stunned. CON-Save jede Runde.",dmg:"—",dt:"—"},
  {id:42,name:"Power Word Kill",lv:9,school:"Enchantment",ct:"1 Aktion",range:"60ft",comp:"V",dur:"Sofort",cls:["Bard","Sorcerer","Warlock","Wizard"],desc:"≤100HP: sofortiger Tod.",dmg:"instant",dt:"death"},
  {id:43,name:"Wish",lv:9,school:"Conjuration",ct:"1 Aktion",range:"Self",comp:"V",dur:"Sofort",cls:["Sorcerer","Wizard"],desc:"Mächtigster Zauber. 33% Chance es nie wieder wirken zu können.",dmg:"—",dt:"—"},
];

const CONDITIONS=[
  {id:"blinded",name:"Blinded",icon:"👁️",desc:"Angriffe auf Dich haben Vorteil. Deine Angriffe haben Nachteil."},
  {id:"charmed",name:"Charmed",icon:"💜",desc:"Kannst Quelle nicht angreifen. Quelle Vorteil auf soziale Checks."},
  {id:"deafened",name:"Deafened",icon:"🔇",desc:"Nichts hören. Fehlschlag Hör-Checks."},
  {id:"exhaustion",name:"Exhaustion",icon:"😴",desc:"Stufe1: Nachteil Checks. 2: Speed÷2. 3: Nachteil Angriffe+Saves. 4: MaxHP÷2. 5: Speed=0. 6: Tod."},
  {id:"frightened",name:"Frightened",icon:"😱",desc:"Nachteil Checks/Angriffe wenn Quelle sichtbar. Nicht freiwillig näher."},
  {id:"grappled",name:"Grappled",icon:"🤝",desc:"Speed = 0."},
  {id:"incapacitated",name:"Incapacitated",icon:"💫",desc:"Keine Aktionen oder Reaktionen."},
  {id:"invisible",name:"Invisible",icon:"👻",desc:"Angriffe auf dich: Nachteil. Deine Angriffe: Vorteil."},
  {id:"paralyzed",name:"Paralyzed",icon:"⚡",desc:"Incapacitated. Kein Bewegen/Sprechen. Krit innerhalb 5ft."},
  {id:"petrified",name:"Petrified",icon:"🗿",desc:"Stein. Incapacitated. Immun Gift/Krankheit. Resist alles."},
  {id:"poisoned",name:"Poisoned",icon:"☠️",desc:"Nachteil auf Angriffe und Ability Checks."},
  {id:"prone",name:"Prone",icon:"⬇️",desc:"Nah-Angriffe Vorteil, Fern-Nachteil. Deine Angriffe Nachteil."},
  {id:"restrained",name:"Restrained",icon:"🕸️",desc:"Speed=0. Angriffe Vorteil. Deine Angriffe+DEX-Saves Nachteil."},
  {id:"stunned",name:"Stunned",icon:"⭐",desc:"Incapacitated. Kein Bewegen. Angriffe Vorteil."},
  {id:"unconscious",name:"Unconscious",icon:"💤",desc:"Incapacitated. Krit innerhalb 5ft."},
  {id:"concentration",name:"Concentration",icon:"🔮",desc:"Hält Zauber. Schaden = CON Save DC 10 oder Hälfte Schaden."},
];

const newChar=id=>({id,name:"Neuer Held",race:"Mensch",klass:"Krieger",level:1,background:"Soldat",str:10,dex:10,con:10,int:10,wis:10,cha:10,hp:10,maxHp:10,tempHp:0,ac:10,speed:30,initiative:0,hd:"1d10",hd_used:0,deathSaves:{suc:0,fail:0},saves:{STR:false,DEX:false,CON:false,INT:false,WIS:false,CHA:false},skills:{},spellAbility:"INT",spellDC:8,spellAtk:0,inspiration:false,traits:"",ideals:"",bonds:"",flaws:"",equipment:"",features:"",backstory:"",inventory:[],actions:[],gold:0,silver:0,copper:0,electrum:0,platinum:0});

/* ══════ D&D 5e CLASSES & RACES DATA ══════ */
const ALL_KLASSEN=["Barbar","Barde","Druide","Hexenmeister","Kämpfer","Kleriker","Magier","Mönch","Paladin","Schurke","Waldläufer","Zauberer","Magieschmied"];

const D3_KLASSEN=[
  {id:"barbar",name:"Barbar",icon:"🪓",hd:"W12",primary:"Stärke",saves:"STR & CON",armor:"Leicht, Mittel, Schilde",weapons:"Einfach, Kriegswaffen",tools:"keine",skills:"Wähle 2: Athletik, Einschüchterung, Tiere, Naturkunde, Wahrnehmung, Überleben",archetypes:["Pfad des Ahnenwächters","Pfad der Bestie","Pfad des Berserkers","Pfad des Schlachtenwüters","Pfad des Sturmherolds","Pfad des Totemkriegers","Pfad der Wilden Magie","Pfad des Zeloten"],srd:"https://www.dnddeutsch.de/srd/character/classes/barbarian/",table:[["1","+2","Kampfrausch, Ungerüstete Verteidigung"],["2","+2","Rücksichtsloser Angriff, Gefahrengespür"],["3","+2","Urtümlicher Pfad"],["5","+3","Zusätzlicher Angriff, Schnelle Bewegung"],["9","+4","Brutale Kritische Treffer"],["11","+4","Unberbittlicher Kampfrausch"],["20","+6","Meister der Wildnis"]],tableHead:["Stufe","ÜB","Merkmale"]},
  {id:"barde",name:"Barde",icon:"🎶",hd:"W8",primary:"Charisma",saves:"DEX & CHA",armor:"Leicht",weapons:"Einfach, Hand-Armbrust, Langschwert, Rapier, Kurzschwert",tools:"3 Musikinstrumente",skills:"Drei deiner Wahl",archetypes:["Schule der Eloquenz","Schule des Flüsterns","Schule der Geister","Schule des Herolds","Schule der Schöpfung","Schule der Schwerter","Schule des Wagemuts","Schule des Wissens","Schule des Zauberbanns"],srd:"https://www.dnddeutsch.de/srd/character/classes/bard/",table:[["1","+2","Zauberwirken, Bardische Inspiration (W6)"],["3","+2","Bardenschule, Expertise"],["5","+3","Bardische Inspiration (W8)"],["10","+4","Bardische Inspiration (W10), Magische Geheimnisse"],["20","+6","Überlegene Inspiration"]],tableHead:["Stufe","ÜB","Merkmale"]},
  {id:"druide",name:"Druide",icon:"🌿",hd:"W8",primary:"Weisheit",saves:"INT & WIS",armor:"Leicht, Mittel, Schilde (kein Metall)",weapons:"Knüppel, Dolch, Kampfstab, Sichel, Schleuder, Speer",tools:"Kräuterkundeausrüstung",skills:"Wähle 2: Arkane Kunde, Heilkunde, Tiere, Motiv, Naturkunde, Religion, Wahrnehmung, Überleben",archetypes:["Zirkel des Hirten","Zirkel des Landes","Zirkel des Mondes","Zirkel der Sporen","Zirkel der Sterne","Zirkel des Wildfeuers"],srd:"https://www.dnddeutsch.de/srd/character/classes/druid/",table:[["1","+2","Druidisch, Zauberwirken"],["2","+2","Tiergestalt, Druidenzirkel"],["18","+6","Zeitloser Körper"],["20","+6","Erzdruide"]],tableHead:["Stufe","ÜB","Merkmale"]},
  {id:"hexenmeister",name:"Hexenmeister",icon:"👁️",hd:"W8",primary:"Charisma",saves:"WIS & CHA",armor:"Leicht",weapons:"Einfach",tools:"keine",skills:"Wähle 2: Arkane Kunde, Einschüchterung, Geschichte, Nachforschung, Naturkunde, Religion, Täuschung",archetypes:["Der Abgründige","Der Dschinn","Die Fluchklinge","Der Große Alte","Der Himmlische","Der Unhold","Der Unsterbliche","Der Untote","Erzfeen"],srd:"https://www.dnddeutsch.de/srd/character/classes/warlock/",table:[["1","+2","Andersweltl. Schutzherr, Paktmagie"],["2","+2","Schauerliche Anrufungen"],["11","+4","Mystisches Arkanum (6te)"],["20","+6","Mystischer Meister"]],tableHead:["Stufe","ÜB","Merkmale"]},
  {id:"kaempfer",name:"Kämpfer",icon:"⚔️",hd:"W10",primary:"STR oder DEX",saves:"STR & CON",armor:"Alle Rüstungen, Schilde",weapons:"Einfach, Kriegswaffen",tools:"keine",skills:"Wähle 2: Akrobatik, Athletik, Einschüchterung, Geschichte, Tiere, Motiv, Wahrnehmung, Überleben",archetypes:["Arkaner Bogenschütze","Kampfmeister","Kavalier","Champion","Mystischer Ritter","Psi-Krieger","Runenritter","Samurai"],srd:"https://www.dnddeutsch.de/srd/character/classes/fighter/",table:[["1","+2","Kampfstil, Durchschnaufen"],["2","+2","Tatendrang"],["5","+3","Zusätzlicher Angriff"],["11","+4","Zusätzlicher Angriff (2)"],["20","+6","Zusätzlicher Angriff (3)"]],tableHead:["Stufe","ÜB","Merkmale"]},
  {id:"kleriker",name:"Kleriker",icon:"✝️",hd:"W8",primary:"Weisheit",saves:"WIS & CHA",armor:"Leicht, Mittel, Schilde",weapons:"Einfach",tools:"keine",skills:"Wähle 2: Geschichte, Heilkunde, Motiv, Religion, Überzeugen",archetypes:["Domäne der Dämmerung","Domäne des Friedens","Domäne des Grabes","Domäne des Krieges","Domäne des Lebens","Domäne des Lichts","Domäne der List","Domäne der Natur","Domäne der Ordnung","Domäne der Schmiede","Domäne des Sturms","Domäne des Wissens","Domäne Tod"],srd:"https://www.dnddeutsch.de/srd/character/classes/cleric/",table:[["1","+2","Zauberwirken, Göttliche Domäne"],["2","+2","Göttliche Macht fokussieren"],["10","+4","Göttliche Intervention"],["20","+6","Verbesserte Göttliche Intervention"]],tableHead:["Stufe","ÜB","Merkmale"]},
  {id:"magier",name:"Magier",icon:"🔮",hd:"W6",primary:"Intelligenz",saves:"INT & WIS",armor:"keine",weapons:"Dolch, Wurfpfeil, Schleuder, Kampfstab, Leichte Armbrust",tools:"keine",skills:"Wähle 2: Arkane Kunde, Geschichte, Heilkunde, Motiv, Nachforschung, Religion",archetypes:["Klingengesang","Kriegsmagie","Orden der Schreiber","Schule der Bannmagie","Schule der Beschwörung","Schule der Erkenntnismagie","Schule der Hervorrufung","Schule der Illusion","Schule der Nekromantie","Schule der Verwandlung","Schule der Verzauberung"],srd:"https://www.dnddeutsch.de/srd/character/classes/wizard/",table:[["1","+2","Zauberwirken, Arkane Erholung"],["2","+2","Arkane Tradition"],["18","+6","Zaubermeisterschaft"],["20","+6","Signaturzauber"]],tableHead:["Stufe","ÜB","Merkmale"]},
  {id:"moench",name:"Mönch",icon:"👊",hd:"W8",primary:"DEX & WIS",saves:"STR & DEX",armor:"keine",weapons:"Einfach, Kurzschwert",tools:"1 Handwerkszeug oder Instrument",skills:"Wähle 2: Akrobatik, Athletik, Geschichte, Motiv, Religion, Verbergen",archetypes:["Weg der offenen Hand","Weg des Schattens","Weg der vier Elemente","Weg des betrunkenen Meisters","Weg des langen Todes"],srd:"https://www.dnddeutsch.de/srd/character/classes/monk/",table:[["1","+2","Ungerüstete Verteidigung, Kampfkünste"],["2","+2","Ki, Ungerüstete Bewegung"],["5","+3","Betäubender Schlag, Extra-Angriff"],["20","+6","Vollkommenes Selbst"]],tableHead:["Stufe","ÜB","Merkmale"]},
  {id:"paladin",name:"Paladin",icon:"🛡️",hd:"W10",primary:"STR & CHA",saves:"WIS & CHA",armor:"Alle Rüstungen, Schilde",weapons:"Einfach, Kriegswaffen",tools:"keine",skills:"Wähle 2: Athletik, Einschüchterung, Heilkunde, Motiv, Überzeugen, Religion",archetypes:["Eid der Alten","Eid der Rache","Eid der Hingabe","Eid der Erlösung","Eid des Ruhmes","Eid der Wächter","Eidloser Paladin"],srd:"https://www.dnddeutsch.de/srd/character/classes/paladin/",table:[["1","+2","Göttlicher Sinn, Handauflegen"],["2","+2","Kampfstil, Zauberwirken, Göttlicher Schlag"],["5","+3","Extra-Angriff"],["20","+6","Heilige Aura"]],tableHead:["Stufe","ÜB","Merkmale"]},
  {id:"schurke",name:"Schurke",icon:"🗡️",hd:"W8",primary:"Geschicklichkeit",saves:"DEX & INT",armor:"Leicht",weapons:"Einfach, Hand-Armbrust, Langschwert, Rapier, Kurzschwert",tools:"Diebeswerkzeug",skills:"Wähle 4: Akrobatik, Athletik, Einschüchterung, Geschichte, Motiv, Nachforschung, Täuschung, Überzeugen, Taschenspielertricks, Wahrnehmung, Verbergen, Auftreten",archetypes:["Arkaner Trickser","Assassine","Phantom","Scharlatan","Seelenmesser","Spion","Unberechenbarer"],srd:"https://www.dnddeutsch.de/srd/character/classes/rogue/",table:[["1","+2","Experte, Sneak Attack 1W6"],["3","+2","Ganoventrick"],["5","+3","Unverbesserlicher Instinkt"],["11","+4","Zuverlässiges Talent"],["20","+6","Schlagtöter, Sneak Attack 10W6"]],tableHead:["Stufe","ÜB","Merkmale"]},
  {id:"waldlaeufer",name:"Waldläufer",icon:"🏹",hd:"W10",primary:"DEX & WIS",saves:"STR & DEX",armor:"Leicht, Mittel, Schilde",weapons:"Einfach, Kriegswaffen",tools:"keine",skills:"Wähle 3: Athletik, Tiere, Motiv, Naturkunde, Wahrnehmung, Überleben, Verbergen",archetypes:["Horizont-Wanderer","Jäger","Monster-Töter","Schwarminspekteur","Verdunkler"],srd:"https://www.dnddeutsch.de/srd/character/classes/ranger/",table:[["1","+2","Lieblingsfeind, Natürlicher Erkunder"],["2","+2","Kampfstil, Zauberwirken"],["5","+3","Extra-Angriff"],["20","+6","Feindesleger"]],tableHead:["Stufe","ÜB","Merkmale"]},
  {id:"zauberer",name:"Zauberer",icon:"✨",hd:"W6",primary:"Charisma",saves:"CON & CHA",armor:"keine",weapons:"Dolch, Darts, Schleuder, Kampfstab, Leichte Armbrust",tools:"keine",skills:"Wähle 2: Arkane Kunde, Einschüchterung, Geschichte, Nachforschung, Religion, Täuschung, Überzeugen",archetypes:["Drachenblut","Wilde Magie","Abgrundmagie","Göttliche Seele","Schattenmagie","Sturmmagie"],srd:"https://www.dnddeutsch.de/srd/character/classes/sorcerer/",table:[["1","+2","Zauberwirken, Zaubereiursprung"],["3","+2","Metamagie"],["20","+6","Schwindelerregender Zauber"]],tableHead:["Stufe","ÜB","Merkmale"]},
  {id:"magieschmied",name:"Magieschmied",icon:"⚙️",hd:"W8",primary:"Intelligenz",saves:"CON & INT",armor:"Leicht, Mittel, Schilde",weapons:"Einfach",tools:"Diebeswerkzeug, Handwerkerausrüstung, 1 Spezialwerkzeug",skills:"Wähle 2: Arkane Kunde, Geschichte, Motiv, Nachforschung, Religion, Naturkunde",archetypes:["Alchemist","Artillerist","Kampfschmied"],srd:"https://www.dnddeutsch.de/srd/character/classes/artificer/",table:[["1","+2","Magisches Basteln, Zauberwirken"],["2","+2","Infusionen"],["3","+2","Artifizient-Spezialisierung"],["5","+3","Extra-Angriff"],["20","+6","Seele der Artefakthändler"]],tableHead:["Stufe","ÜB","Merkmale"]},
];

const DND_RACES=[
  {name:"Mensch",traits:["+1 auf alle Attribute","Extra Fertigkeit","Extra Sprache"],speed:30,size:"Mittel",desc:"Vielseitigste und verbreitetste Rasse. Variante: +1 auf zwei Attribute + Feat + Fertigkeit."},
  {name:"Elf",traits:["Dunkelsicht 60ft","Fey-Abstammung (Vorteil vs Charm, immun Schlaf)","Trance (4h statt Schlaf)","Keen Senses (Wahrnehmungs-Proficiency)"],speed:30,size:"Mittel",desc:"Anmutige, langlebige Wesen mit Verbindung zur Natur und Magie."},
  {name:"Hochelf",traits:["DEX +2, INT +1","Dunkelsicht 60ft","Fey-Abstammung","1 Zauberer-Cantrip","Extra Sprache","Proficiency: Longsword, Shortsword, Shortbow, Longbow"],speed:30,size:"Mittel",desc:"Kultivierte Elfen mit Affinität für Magie. Bonus-Cantrip von der Zauberer-Liste."},
  {name:"Waldelfe",traits:["DEX +2, WIS +1","Dunkelsicht 60ft","Fey-Abstammung","Speed 35ft","Maske der Wildnis (Verstecken in Natur)"],speed:35,size:"Mittel",desc:"Naturbewohner mit erhöhter Bewegungsgeschwindigkeit und Tarnfähigkeit."},
  {name:"Dunkelelf (Drow)",traits:["DEX +2, CHA +1","Dunkelsicht 120ft","Fey-Abstammung","Zauber: Dancing Lights, Faerie Fire, Darkness","Sonnenlicht-Empfindlichkeit"],speed:30,size:"Mittel",desc:"Unterirdische Elfen mit mächtiger angeborener Magie, aber Schwäche im Sonnenlicht."},
  {name:"Zwerg",traits:["CON +2","Dunkelsicht 60ft","Zwerg-Robustheit (+1 HP/Level)","Stein-Kunde (Geschichte Proficiency)","Waffen-Prof.: Handaxe, Battleaxe, Light Hammer, Warhammer","Rüstungs-Prof.: Leichte/Mittlere"],speed:25,size:"Mittel",desc:"Robuste Bergbewohner. Natürliche Resistenz gegen Gift."},
  {name:"Bergzwerg",traits:["STR +2, CON +2","Dunkelsicht 60ft","Zwerg-Robustheit","Rüstungs-Proficiency"],speed:25,size:"Mittel",desc:"Kriegerische Zwerge mit erhöhter Stärke. Gut für Kämpfer und Paladine."},
  {name:"Hügelzwerg",traits:["WIS +1, CON +2","Zähigkeit (+1 HP, +1 HP/Level)","Dunkelsicht 60ft","Zwerg-Robustheit"],speed:25,size:"Mittel",desc:"Weise Zwerge mit erhöhter Gesundheit. Gut für Kleriker und Druiden."},
  {name:"Halbling",traits:["DEX +2","Glück (1er neu würfeln)","Tapferkeit (Vorteil vs Frightened)","Beweglichkeit (durch größere Kreaturen)"],speed:25,size:"Klein",desc:"Kleine, glücksbringende Wesen. Nat. Glücksfähigkeit macht Patzer selten."},
  {name:"Halbork",traits:["STR +2, CON +1","Dunkelsicht 60ft","Einschüchterung-Prof.","Unnachgiebige Ausdauer (1× LR: 1 HP statt sterben)","Wilde Angriffe (Nat20: +1 Schadenswürfel)"],speed:30,size:"Mittel",desc:"Starke Krieger mit orcischem Erbe. Unnachgiebige Ausdauer gibt Überlebensfähigkeit."},
  {name:"Halbelfe",traits:["CHA +2, zwei weitere +1","Dunkelsicht 60ft","Fey-Abstammung","Vielseitigkeit (2 Skill Proficiencies frei wählen)"],speed:30,size:"Mittel",desc:"Verbinden die besten Eigenschaften von Menschen und Elfen. Sehr vielseitig."},
  {name:"Tiefling",traits:["INT +1, CHA +2","Dunkelsicht 60ft","Höllische Resistenz (Feuer)","Zauber: Thaumaturgy, Hellish Rebuke (3), Darkness (5)"],speed:30,size:"Mittel",desc:"Nachfahren von Teufeln. Angeborene Feuermagie und Resistenz gegen Feuer."},
  {name:"Drachen-Geborener",traits:["STR +2, CHA +1","Drachen-Abstammung (Schadenstyp+Resistenz)","Atemwaffe (Kegel/Linie, STR/CON-Save)","Schaden-Resistenz (Drachen-Typ)"],speed:30,size:"Mittel",desc:"Stolze Humanoide mit Drachenblut. Mächtige Atemwaffe basierend auf Drachentyp."},
  {name:"Gnom",traits:["INT +2","Dunkelsicht 60ft","Gnomische List (Vorteil auf INT/WIS/CHA Saves vs Magie)"],speed:25,size:"Klein",desc:"Erfinderische Kleinlinge mit Magie-Resistenz. Waldzwerg: DEX+1, Tiergespräch. Gesteinsgnom: CON+1, Illusionsmagie."},
  {name:"Aarakocra",traits:["DEX +2, WIS +1","Fliegen 50ft","Klauenangriff (1d4 slashing)"],speed:25,size:"Mittel",desc:"(Elemental Evil) Vogelartige Wesen mit Flugfähigkeit. Stärkster Mobilitätsvorteil."},
  {name:"Aasimar",traits:["CHA +2","Dunkelsicht 60ft","Heilende Hände (HP=Level, 1×LR)","Licht-Träger (Light Cantrip)","Celestialer Widerstand (Nekrose/Strahlung)"],speed:30,size:"Mittel",desc:"(Volo's) Celestiale Abkömmlinge mit Heilkraft. Unterrassen: Protector (Flügel), Scourge, Fallen."},
  {name:"Tiefling (Varianten)",traits:["Je nach Abstammung: verschiedene angeborene Zauber","Andere Attributsboni je nach Teufelslord"],speed:30,size:"Mittel",desc:"(MToF) Verschiedene Tiefling-Varianten mit unterschiedlichen angeborenen Zaubern je nach Teufelslord."},
  {name:"Wasserkind (Genasi)",traits:["CON +2, je nach Element +1","Elementare Fähigkeiten je nach Abstammung"],speed:30,size:"Mittel",desc:"(Elemental Evil) Feuer: INT+1, Immunität Feuer. Wasser: WIS+1, Schwimmen. Erde: STR+1. Luft: DEX+1, Levitation."},
  {name:"Triton",traits:["STR+1, CON+1, CHA+1","Amphibiös","Dunkelsicht 60ft","Kontrolle Luft+Wasser","Kälte+Feuer Resist"],speed:30,size:"Mittel",desc:"(Volo's) Krieger der tiefen Meere mit diplomatischen Fähigkeiten."},
  {name:"Yuan-ti Pureblood",traits:["INT+1, CHA+2","Dunkelsicht 60ft","Magic Resistance (Vorteil Saves vs Magie)","Gift-Immunität","Angeborene Zauber: Poison Spray, Animal Friendship, Suggestion"],speed:30,size:"Mittel",desc:"(Volo's) Schlangenartige Humanoide. Mächtige Magie-Resistenz."},
];
const ALL_VOELKER=DND_RACES.map(r=>r.name);

const DND_BACKGROUNDS=["Akolyt","Adliger","Ausgestoßener","Entertainer","Edelmann","Fernhändler","Fischer","Forscher","Gildenmitglied","Gladiator","Handwerker","Heimatloser","Held des Volkes","Krimineller","Matrose","Pirat","Scharlatan","Söldner","Soldat","Stadtbewohner","Waldläufer","Verbrechensopfer","Wanderer","Weiser","Zögling"];

/* --- */
function DiceRoller(){
  const[res,setRes]=useState([]);const[cnt,setCnt]=useState(1);const[mod,setMod]=useState(0);const[rolling,setRolling]=useState(null);
  const DICE=[4,6,8,10,12,20,100];
  const DC={4:"#a040c0",6:"#2060c0",8:"#20a060",10:"#c07020",12:"#c02040",20:"#c9a84c",100:"#808080"};
  const go=s=>{setRolling(s);setTimeout(()=>{const rolls=Array.from({length:cnt},()=>rollD(s));const total=rolls.reduce((a,b)=>a+b,0)+parseInt(mod||0);setRes(p=>[{id:Date.now(),sides:s,cnt,rolls,mod:parseInt(mod||0),total,ts:new Date().toLocaleTimeString()},...p.slice(0,19)]);setRolling(null);},280);};
  return(<div>
    <div style={sx.card}><div style={sx.ct}>⚙️ Einstellungen</div>
      <div style={{display:"flex",gap:12}}>
        <div><label style={sx.lbl}>Anzahl</label><input type="number" min={1} max={20} value={cnt} onChange={e=>setCnt(+e.target.value)} style={{...sx.inp,width:80}}/></div>
        <div><label style={sx.lbl}>Modifier</label><input type="number" value={mod} onChange={e=>setMod(e.target.value)} style={{...sx.inp,width:80}}/></div>
      </div>
    </div>
    <div style={sx.card}><div style={sx.ct}>🎲 Würfel</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
        {DICE.map(d=><button key={d} onClick={()=>go(d)} style={{background:rolling===d?`radial-gradient(circle,${DC[d]},#000)`:`linear-gradient(135deg,${DC[d]}44,${DC[d]}22)`,border:`2px solid ${DC[d]}`,borderRadius:8,color:DC[d],fontFamily:"'Cinzel',serif",fontSize:18,fontWeight:700,width:72,height:72,cursor:"pointer",transition:"all .2s",transform:rolling===d?"scale(1.1) rotate(8deg)":"scale(1)",boxShadow:rolling===d?`0 0 20px ${DC[d]}88`:"none"}}>d{d}</button>)}
      </div>
    </div>
    {res.length>0&&<div style={sx.card}>
      <div style={{...sx.jb,marginBottom:8}}><div style={sx.ct}>📜 Verlauf</div><button onClick={()=>setRes([])} style={sx.bsm(C.red)}>Leeren</button></div>
      {res.map(r=><div key={r.id} style={{background:"#0f0f1e",borderRadius:6,padding:"10px 14px",marginBottom:6,border:`1px solid ${r.sides===20&&r.rolls[0]===20?C.gold:r.sides===20&&r.rolls[0]===1?C.red:C.border}`,boxShadow:r.sides===20&&r.rolls[0]===20?`0 0 12px ${C.goldDim}`:"none"}}>
        <div style={sx.jb}>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <span style={{color:DC[r.sides]||C.gold,fontFamily:"'Cinzel',serif",fontWeight:700}}>{r.cnt}d{r.sides}{r.mod!==0?(r.mod>0?`+${r.mod}`:r.mod):""}</span>
            {r.sides===20&&r.rolls[0]===20&&<span style={{color:C.gold,fontSize:12}}>✨ NAT 20!</span>}
            {r.sides===20&&r.rolls[0]===1&&<span style={{color:C.red,fontSize:12}}>💀 PATZER!</span>}
          </div>
          <span style={{color:C.textDim,fontSize:11}}>{r.ts}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
          <span style={{color:C.textDim,fontSize:13}}>[{r.rolls.join(", ")}]{r.mod!==0?` ${r.mod>0?"+":""}${r.mod}`:""}</span>
          <span style={{fontSize:22,fontWeight:700,color:C.textBright,marginLeft:4}}>= {r.total}</span>
        </div>
      </div>)}
    </div>}
  </div>);
}

/* --- */
function CombatTracker(){
  const[fighters,setFighters,rdy]=usePersist("combat_v4",[]);
  const[round,setRound]=usePersist("combat_round_v4",1);
  const[active,setActive]=usePersist("combat_active_v4",0);
  const[presets,setPresets]=usePersist("combat_presets_v4",[]);
  const[combatLog,setCombatLog]=usePersist("combat_log_v1",[]);
  const[customMonsters]=usePersist("bestiary_v4",[]);
  const[tab,setTab]=useState("combat");
  const[nN,setNN]=useState("");const[nI,setNI]=useState("");const[nH,setNH]=useState("");const[nA,setNA]=useState("");
  const[dmg,setDmg]=useState({});
  const[newPresetName,setNewPresetName]=useState("");
  const[monSearch,setMonSearch]=useState("");
  const[monCount,setMonCount]=useState({});
  const[manualLog,setManualLog]=useState("");

  const allMonsters=[...MONSTERS,...(customMonsters||[])];
  const sorted=[...fighters].sort((a,b)=>b.initiative-a.initiative);

  const addLog=(type,text,r)=>setCombatLog(p=>[...p,{id:Date.now()+Math.random(),round:r||0,type,text,ts:new Date().toLocaleTimeString("de")}]);

  const addFighter=()=>{
    if(!nN)return;
    const f={id:Date.now(),name:nN,initiative:+nI||0,hp:+nH||10,maxHp:+nH||10,ac:+nA||10,conditions:[],isPlayer:false};
    setFighters(p=>[...p,f]);
    addLog("join",`${nN} tritt dem Kampf bei (HP: ${nH||10}, AC: ${nA||10}, Init: ${nI||0})`);
    setNN("");setNI("");setNH("");setNA("");
  };
  const applyHP=(id,val,heal)=>{
    const v=Math.abs(+val||0);
    if(v===0)return;
    setFighters(p=>p.map(c=>{
      if(c.id!==id)return c;
      const newHp=Math.max(0,Math.min(c.maxHp,heal?c.hp+v:c.hp-v));
      const type=heal?"heal":"dmg";
      const text=heal
        ? `${c.name} wird geheilt: +${v} HP (${c.hp} → ${newHp})`
        : `${c.name} erleidet ${v} Schaden (${c.hp} → ${newHp} HP)${newHp===0?" — BEWUSSTLOS!":""}`;
      addLog(type,text);
      return{...c,hp:newHp};
    }));
    setDmg(p=>({...p,[id]:""}));
  };
  const nextTurn=()=>{
    if(!sorted.length)return;
    const nextIdx=(active+1)%sorted.length;
    let newRound=round;
    if(nextIdx===0){newRound=round+1;setRound(newRound);addLog("round",`--- Runde ${newRound} beginnt ---`,newRound);}
    const next=sorted[nextIdx];
    if(next)addLog("turn",`Zug: ${next.name} (Initiative ${next.initiative})`,nextIdx===0?newRound:round);
    setActive(nextIdx);
  };
  const togCond=(id,cn)=>setFighters(p=>p.map(c=>{
    if(c.id!==id)return c;
    const has=c.conditions.includes(cn);
    addLog("cond",`${c.name}: Condition "${cn}" ${has?"entfernt":"hinzugefuegt"}`);
    return{...c,conditions:has?c.conditions.filter(x=>x!==cn):[...c.conditions,cn]};
  }));
  const hCol=(h,m)=>{const p=h/m;return p>.5?C.greenBright:p>.25?"#c09030":C.redBright;};

  // Presets
  const savePreset=()=>{
    const name=newPresetName.trim();if(!name||!fighters.length)return;
    const template=fighters.map(f=>({name:f.name,hp:f.maxHp,ac:f.ac,isPlayer:f.isPlayer}));
    setPresets(p=>[...p.filter(x=>x.name!==name),{id:Date.now(),name,fighters:template}]);
    setNewPresetName("");
  };
  const loadPreset=(preset)=>{
    const newFighters=preset.fighters.map(f=>({id:Date.now()+Math.random(),name:f.name,initiative:0,hp:f.hp,maxHp:f.hp,ac:f.ac,conditions:[],isPlayer:f.isPlayer||false}));
    setFighters(p=>[...p,...newFighters]);
  };
  const deletePreset=id=>setPresets(p=>p.filter(x=>x.id!==id));

  // Encounter Builder: add monster to fight
  const addMonsterToFight=(m,count=1)=>{
    const newF=Array.from({length:count},()=>({id:Date.now()+Math.random(),name:count>1?`${m.name} ${Math.floor(Math.random()*100)}`:m.name,initiative:0,hp:m.hp,maxHp:m.hp,ac:m.ac,conditions:[],isPlayer:false,monsterRef:m.id}));
    setFighters(p=>[...p,...newF]);
  };

  const crN=cr=>{const n=parseFloat(cr);return isNaN(n)?0:n;};
  const crC=cr=>{const n=crN(cr);return n<1?"#40a060":n<5?"#c0a020":n<10?C.red:"#c020c0";};
  const filteredMonsters=allMonsters.filter(m=>m.name.toLowerCase().includes(monSearch.toLowerCase()));

  if(!rdy)return (<div style={{color:C.textDim,padding:20}}>Lade...</div>);

  return(<div>
    
    <div style={{...sx.jb,marginBottom:12}}>
      <div style={{fontFamily:"'Cinzel',serif",color:C.gold,fontSize:16}}>⚔️ Runde {round}</div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={nextTurn} style={sx.btn(C.green)}>▶ Nächster Zug</button>
        <button onClick={()=>{setRound(1);setActive(0);}} style={sx.btn(C.textDim)}>↺ Reset</button>
        <button onClick={()=>{setFighters([]);setRound(1);setActive(0);}} style={sx.btn(C.red)}>🗑 Leeren</button>
      </div>
    </div>

    
    <div style={{display:"flex",gap:4,marginBottom:12,overflowX:"auto",WebkitOverflowScrolling:"touch",scrollbarWidth:"none",paddingBottom:2}}>
      {[["combat","⚔️ Kampf"],["builder","🏗️ Encounter Builder"],["presets","💾 Vorlagen"],["log","📋 Kampflog"]].map(([t,l])=>(
        <button key={t} onClick={()=>setTab(t)} style={{...sx.nb(tab===t),flexShrink:0}}>{l}</button>
      ))}
    </div>

    
    {tab==="combat"&&<div>
      <div style={sx.card}>
        <div style={sx.ct}>+ Kämpfer manuell hinzufügen</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <input placeholder="Name" value={nN} onChange={e=>setNN(e.target.value)} style={{...sx.inp,width:140}} onKeyDown={e=>e.key==="Enter"&&addFighter()}/>
          <input placeholder="Init" type="number" value={nI} onChange={e=>setNI(e.target.value)} style={{...sx.inp,width:75}}/>
          <input placeholder="Max HP" type="number" value={nH} onChange={e=>setNH(e.target.value)} style={{...sx.inp,width:80}}/>
          <input placeholder="AC" type="number" value={nA} onChange={e=>setNA(e.target.value)} style={{...sx.inp,width:70}}/>
          <button onClick={addFighter} style={sx.btn(C.green)}>+ Hinzufügen</button>
        </div>
      </div>
      {sorted.length===0&&<div style={{...sx.card,color:C.textDim,textAlign:"center",fontStyle:"italic",padding:32}}>
        <div style={{fontSize:32,marginBottom:8}}>⚔️</div>
        Keine Kämpfer. Füge sie manuell hinzu, lade eine Vorlage oder benutze den Encounter Builder.
      </div>}
      {sorted.map((c,i)=>(
        <div key={c.id} style={{...sx.card,position:"relative",border:`1px solid ${i===active?C.gold:c.hp===0?C.red+"44":C.border}`,opacity:c.hp===0?.6:1,boxShadow:i===active?`0 0 16px ${C.goldDim}`:"none"}}>
          {i===active&&<div style={{position:"absolute",top:-1,left:-1,background:C.gold,borderRadius:"7px 0 4px 0",padding:"2px 8px",fontSize:10,fontFamily:"'Cinzel',serif",color:C.bg,fontWeight:700}}>AM ZUG</div>}
          <div style={{...sx.jb,marginTop:i===active?12:0}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{background:C.surface,borderRadius:4,padding:"4px",textAlign:"center",minWidth:52}}>
                <div style={{fontSize:10,color:C.textDim}}>INIT</div>
                <input type="number" value={c.initiative} onChange={e=>setFighters(p=>p.map(x=>x.id===c.id?{...x,initiative:+e.target.value}:x))} style={{...sx.inp,textAlign:"center",fontSize:18,fontWeight:700,color:C.gold,padding:"2px",background:"transparent",border:"none",width:48}}/>
              </div>
              <div>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:15,color:C.textBright,fontWeight:700}}>{c.name}</div>
                <div style={{fontSize:12,color:C.textDim}}>AC {c.ac}{c.isPlayer&&<span style={{color:C.gold,marginLeft:6}}>👤 Spieler</span>}</div>
              </div>
            </div>
            <div style={{flex:1,maxWidth:200,margin:"0 16px"}}>
              <div style={{...sx.jb,marginBottom:3}}><span style={{fontSize:13,color:hCol(c.hp,c.maxHp),fontWeight:700}}>{c.hp}/{c.maxHp} HP</span>{c.hp===0&&<span style={{color:C.red,fontSize:11}}>💀</span>}</div>
              <div style={{background:C.surface,borderRadius:10,height:8,overflow:"hidden"}}><div style={{width:`${(c.hp/c.maxHp)*100}%`,height:"100%",background:hCol(c.hp,c.maxHp),borderRadius:10,transition:"width .3s"}}/></div>
            </div>
            <div style={{display:"flex",gap:4,alignItems:"center"}}>
              <input type="number" placeholder="HP" value={dmg[c.id]||""} onChange={e=>setDmg(p=>({...p,[c.id]:e.target.value}))} style={{...sx.inp,width:70}}/>
              <button onClick={()=>applyHP(c.id,dmg[c.id],false)} style={sx.bsm(C.red)} title="Schaden">🗡️</button>
              <button onClick={()=>applyHP(c.id,dmg[c.id],true)} style={sx.bsm(C.green)} title="Heilen">💚</button>
              <button onClick={()=>setFighters(p=>p.map(x=>x.id===c.id?{...x,hp:x.maxHp}:x))} style={sx.bsm(C.blue)} title="Vollheilen">♻</button>
              <button onClick={()=>setFighters(p=>p.filter(x=>x.id!==c.id))} style={sx.bsm("#444")}>✕</button>
            </div>
          </div>
          <div style={{marginTop:8,display:"flex",flexWrap:"wrap",gap:4}}>
            {["Poisoned","Prone","Stunned","Blinded","Paralyzed","Restrained","Frightened","Invisible","Grappled","Concentration","Exhaustion"].map(cn=>(
              <button key={cn} onClick={()=>togCond(c.id,cn)} style={{background:c.conditions.includes(cn)?C.red+"88":C.surface,border:`1px solid ${c.conditions.includes(cn)?C.red:C.border}`,borderRadius:3,color:c.conditions.includes(cn)?C.textBright:C.textDim,fontSize:10,padding:"2px 6px",cursor:"pointer",fontFamily:"'Cinzel',serif"}}>{cn}</button>
            ))}
          </div>
        </div>
      ))}
    </div>}

    
    {tab==="builder"&&<div>
      <div style={sx.card}>
        <div style={sx.ct}>🏗️ Encounter Builder — Monster zum Kampf hinzufügen</div>
        <div style={{color:C.textDim,fontSize:13,marginBottom:12}}>Wähle Monster und füge sie direkt in den Kampf ein. Initiative wird auf 0 gesetzt — im Kampf-Tab anpassen.</div>
        <input value={monSearch} onChange={e=>setMonSearch(e.target.value)} placeholder="🔍 Monster suchen…" style={{...sx.inp,marginBottom:12}}/>
        <div style={{maxHeight:"60vh",overflowY:"auto"}}>
          {filteredMonsters.map(m=>{
            const cnt=monCount[m.id]||1;
            const crColor=crC(m.cr);
            return(
              <div key={m.id} style={{...sx.jb,background:C.surface,borderRadius:6,padding:"8px 12px",marginBottom:6,border:`1px solid ${C.border}`}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontFamily:"'Cinzel',serif",fontSize:14,color:C.textBright,fontWeight:700}}>{m.name}</span>
                    <span style={{fontSize:11,fontWeight:700,color:crColor}}>CR {m.cr}</span>
                    <span style={{fontSize:11,color:C.textDim}}>{m.size} {m.type}</span>
                  </div>
                  <div style={{display:"flex",gap:8,marginTop:3}}>
                    <span style={sx.tag(C.red)}>❤️ {m.hp}</span>
                    <span style={sx.tag(C.blue)}>🛡️ AC{m.ac}</span>
                    <span style={sx.tag(C.green)}>💨 {m.speed}</span>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <input type="number" min={1} max={20} value={cnt} onChange={e=>setMonCount(p=>({...p,[m.id]:Math.max(1,+e.target.value)}))} style={{...sx.inp,width:55,textAlign:"center"}}/>
                  <button onClick={()=>addMonsterToFight(m,cnt)} style={sx.btn(C.green)}>+ Zum Kampf</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>}

    
    {tab==="presets"&&<div>
      <div style={sx.card}>
        <div style={sx.ct}>💾 Kampf-Vorlage speichern</div>
        <div style={{color:C.textDim,fontSize:13,marginBottom:10}}>Speichere die aktuellen Kaempfer als Vorlage. Beim Laden werden alle Kaempfer mit Initiative=0 hinzugefuegt.</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"flex-end"}}>
          <div style={{flex:1}}><label style={sx.lbl}>Name der Vorlage</label><input value={newPresetName} onChange={e=>setNewPresetName(e.target.value)} style={sx.inp} placeholder="z.B. Goblin-Raid, Party..."/></div>
          <button onClick={savePreset} style={sx.btn(C.green)}>💾 Speichern ({fighters.length})</button>
        </div>
        {fighters.length===0&&<div style={{color:C.redBright,fontSize:12,marginTop:6}}>Keine Kaempfer vorhanden.</div>}
      </div>
      {presets.length===0&&<div style={{...sx.card,color:C.textDim,textAlign:"center",fontStyle:"italic"}}>Noch keine Vorlagen.</div>}
      {presets.map(p=>(
        <div key={p.id} style={sx.card}>
          <div style={{...sx.jb,marginBottom:8}}>
            <div style={{fontFamily:FH,color:C.gold,fontSize:15,fontWeight:700}}>📋 {p.name}</div>
            <div style={{display:"flex",gap:6}}>
              <button onClick={()=>loadPreset(p)} style={sx.btn(C.green)}>▶ Laden</button>
              <button onClick={()=>{setFighters([]);setTimeout(()=>loadPreset(p),50);}} style={sx.btn(C.blue)}>🔄 Ersetzen</button>
              <button onClick={()=>deletePreset(p.id)} style={sx.bsm(C.red)}>🗑</button>
            </div>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            {p.fighters.map((f,i)=>(
              <div key={i} style={{background:C.surface,borderRadius:6,padding:"4px 10px",border:`1px solid ${C.border}`,fontSize:13}}>
                {f.name} <span style={{color:C.textDim,fontSize:11}}>❤️{f.hp} 🛡️{f.ac}</span>
              </div>
            ))}
          </div>
          <div style={{color:C.textDim,fontSize:11,marginTop:6}}>{p.fighters.length} Kaempfer · Initiative = 0 beim Laden</div>
        </div>
      ))}
    </div>}

    {tab==="log"&&<div>
      <div style={sx.card}>
        <div style={{...sx.jb,marginBottom:12}}>
          <div style={sx.ct}>📋 Kampflog ({combatLog.length} Eintraege)</div>
          <div style={{display:"flex",gap:6}}>
            <button onClick={()=>{
              const typeStyle={round:"color:#a78bfa;font-weight:700",turn:"color:#60a5fa",dmg:"color:#ef4444",heal:"color:#4ade80",cond:"color:#fbbf24",join:"color:#a3e635",manual:"color:#e2e0f0"};
              const rows=combatLog.map(e=>`<tr><td style="color:#6b6880;width:56px;padding:3px 8px;white-space:nowrap">${e.ts}</td><td style="color:#6b6880;width:60px;padding:3px 8px">Rd.${e.round||"—"}</td><td style="${typeStyle[e.type]||""};padding:3px 8px">${e.text.replace(/</g,"&lt;")}</td></tr>`).join("");
              const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Kampflog</title><style>body{font-family:Calibri,sans-serif;padding:24px;background:#fff;color:#1a1a1a}h1{font-size:22px;margin-bottom:4px}h3{color:#555;font-weight:400;margin-bottom:20px}table{width:100%;border-collapse:collapse;font-size:13px}tr:nth-child(even){background:#f7f7f7}td{border-bottom:1px solid #e5e5e5;vertical-align:top;line-height:1.6}@media print{body{padding:12px}}</style></head><body><h1>D&D Kampflog</h1><h3>Exportiert am ${new Date().toLocaleString("de")} &bull; ${combatLog.length} Eintraege</h3><table>${rows}</table></body></html>`;
              const w=window.open("","_blank");
              w.document.write(html);w.document.close();
              w.onload=()=>w.print();
            }} style={sx.btn(C.purple)}>📄 Als PDF exportieren</button>
            <button onClick={()=>setCombatLog([])} style={sx.bsm(C.red)}>🗑 Leeren</button>
          </div>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          <input value={manualLog} onChange={e=>setManualLog(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&manualLog.trim()){addLog("manual",manualLog.trim(),round);setManualLog("");}}} style={sx.inp} placeholder="Manuellen Eintrag hinzufuegen (Enter)..."/>
          <button onClick={()=>{if(manualLog.trim()){addLog("manual",manualLog.trim(),round);setManualLog("");}}} style={sx.btn(C.blue)}>+ Eintrag</button>
        </div>
        {combatLog.length===0&&<div style={{color:C.textDim,fontStyle:"italic",textAlign:"center",padding:32}}>
          <div style={{fontSize:32,marginBottom:8}}>📋</div>
          Noch keine Eintraege. Kampf-Ereignisse werden automatisch geloggt.
        </div>}
        <div style={{maxHeight:"55vh",overflowY:"auto",display:"flex",flexDirection:"column",gap:2}}>
          {[...combatLog].reverse().map(e=>{
            const typeColor={round:C.purpleBright,turn:C.blueBright,dmg:C.redBright,heal:C.greenBright,cond:C.amberBright,join:C.tealBright,manual:C.textBright};
            const typeIcon={round:"🔁",turn:"▶",dmg:"🗡️",heal:"💚",cond:"⚡",join:"➕",manual:"📝"};
            const col=typeColor[e.type]||C.textDim;
            return(
              <div key={e.id} style={{
                display:"flex",gap:10,alignItems:"flex-start",
                padding:"5px 10px",borderRadius:6,
                background:e.type==="round"?`${C.purple}15`:e.type==="manual"?`${C.blue}0a`:"transparent",
                borderLeft:e.type==="round"?`3px solid ${C.purple}`:`3px solid transparent`,
              }}>
                <span style={{fontSize:12,minWidth:20,textAlign:"center"}}>{typeIcon[e.type]||"•"}</span>
                <span style={{fontSize:11,color:C.textDim,minWidth:48,whiteSpace:"nowrap"}}>{e.ts}</span>
                <span style={{fontSize:11,color:C.textDim,minWidth:44,whiteSpace:"nowrap"}}>Rd.{e.round||"—"}</span>
                <span style={{fontSize:13,color:col,flex:1,lineHeight:1.5}}>{e.text}</span>
                <button onClick={()=>setCombatLog(p=>p.filter(x=>x.id!==e.id))} style={{background:"none",border:"none",color:C.textDim,cursor:"pointer",fontSize:11,opacity:.5}}>✕</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>}
  </div>);
}

/* --- */
function Tokens(){
  const[slots,setSlots]=usePersist("tokens_slots_v4",[{lv:1,lbl:"1st",tot:4,used:0},{lv:2,lbl:"2nd",tot:3,used:0},{lv:3,lbl:"3rd",tot:3,used:0},{lv:4,lbl:"4th",tot:3,used:0},{lv:5,lbl:"5th",tot:2,used:0}]);
  const[custom,setCustom]=usePersist("tokens_custom_v4",[{id:1,name:"Bardic Inspiration",tot:4,used:0,color:C.blueBright,tier:"d6"},{id:2,name:"Rage",tot:2,used:0,color:C.redBright,tier:""},{id:3,name:"Wild Shape",tot:2,used:0,color:C.greenBright,tier:""}]);
  const[nT,setNT]=useState({name:"",tot:3,color:C.purple,tier:""});
  const SC=["#3060c0","#2090a0","#409040","#a08020","#802080","#204080","#800020","#406060","#a02060"];
  return(<div>
    <div style={sx.card}>
      <div style={{...sx.jb,marginBottom:8}}><div style={sx.ct}>🔮 Spell Slots</div><button onClick={()=>setSlots(p=>p.map(s=>({...s,used:0})))} style={sx.bsm(C.gold)}>↺ Langer Rast</button></div>
      {slots.map((sl,si)=>(
        <div key={sl.lv} style={{marginBottom:14}}>
          <div style={{...sx.jb,marginBottom:4}}>
            <span style={{fontFamily:"'Cinzel',serif",fontSize:13,color:C.textBright}}>{sl.lbl} Level</span>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <span style={{fontSize:12,color:C.textDim}}>{sl.tot-sl.used}/{sl.tot}</span>
              <input type="number" min={0} max={20} value={sl.tot} onChange={e=>setSlots(p=>p.map(x=>x.lv===sl.lv?{...x,tot:Math.max(0,+e.target.value)}:x))} style={{...sx.inp,width:55,padding:"2px 6px",fontSize:12}}/>
              <button onClick={()=>setSlots(p=>p.map(x=>x.lv===sl.lv?{...x,used:0}:x))} style={sx.bsm(C.goldDim)}>↺</button>
            </div>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {Array.from({length:sl.tot}).map((_,i)=><div key={i} onClick={()=>setSlots(p=>p.map(x=>x.lv===sl.lv?{...x,used:i<x.used?i:i+1}:x))} style={{width:28,height:28,borderRadius:"50%",cursor:"pointer",background:i<sl.used?"#1a1a1a":SC[si]+"cc",border:`2px solid ${i<sl.used?C.border:SC[si]}`,transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:i<sl.used?C.border:"white"}}>{i<sl.used?"×":"◆"}</div>)}
          </div>
        </div>
      ))}
      {slots.length<9&&<button onClick={()=>setSlots(p=>[...p,{lv:p.length+1,lbl:["1st","2nd","3rd","4th","5th","6th","7th","8th","9th"][p.length],tot:1,used:0}])} style={sx.bsm(C.blue)}>+ Level {slots.length+1}</button>}
    </div>
    <div style={sx.card}>
      <div style={{...sx.jb,marginBottom:8}}><div style={sx.ct}>🏷️ Eigene Ressourcen</div><button onClick={()=>setCustom(p=>p.map(t=>({...t,used:0})))} style={sx.bsm(C.gold)}>↺ Alle zurücksetzen</button></div>
      {custom.map(t=>(
        <div key={t.id} style={{background:C.surface,borderRadius:6,padding:"10px 12px",marginBottom:10,border:`1px solid ${t.color}44`}}>
          <div style={{...sx.jb,marginBottom:6}}>
            <span style={{fontFamily:"'Cinzel',serif",fontSize:13,color:t.color,fontWeight:700}}>{t.name}{t.tier&&<span style={{color:C.textDim,fontWeight:400}}> ({t.tier})</span>}</span>
            <div style={{display:"flex",gap:6}}>
              <span style={{fontSize:12,color:C.textDim}}>{t.tot-t.used}/{t.tot}</span>
              <button onClick={()=>setCustom(p=>p.map(x=>x.id===t.id?{...x,used:0}:x))} style={sx.bsm(C.goldDim)}>↺</button>
              <button onClick={()=>setCustom(p=>p.filter(x=>x.id!==t.id))} style={sx.bsm(C.red)}>✕</button>
            </div>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {Array.from({length:t.tot}).map((_,i)=><div key={i} onClick={()=>setCustom(p=>p.map(x=>x.id===t.id?{...x,used:i<x.used?i:i+1}:x))} style={{width:32,height:32,borderRadius:4,cursor:"pointer",background:i<t.used?"#1a1a1a":t.color+"99",border:`2px solid ${i<t.used?C.border:t.color}`,transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{i<t.used?"✗":"●"}</div>)}
          </div>
        </div>
      ))}
      <div style={{background:"#0f0f1e",borderRadius:6,padding:12,border:`1px dashed ${C.border}`}}>
        <div style={{...sx.ct,marginBottom:8}}>+ Neue Ressource</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"flex-end"}}>
          <div><label style={sx.lbl}>Name</label><input value={nT.name} onChange={e=>setNT(p=>({...p,name:e.target.value}))} style={{...sx.inp,width:130}}/></div>
          <div><label style={sx.lbl}>Anzahl</label><input type="number" min={1} max={20} value={nT.tot} onChange={e=>setNT(p=>({...p,tot:+e.target.value}))} style={{...sx.inp,width:70}}/></div>
          <div><label style={sx.lbl}>Typ</label><input value={nT.tier} onChange={e=>setNT(p=>({...p,tier:e.target.value}))} style={{...sx.inp,width:80}} placeholder="d8"/></div>
          <div><label style={sx.lbl}>Farbe</label><input type="color" value={nT.color} onChange={e=>setNT(p=>({...p,color:e.target.value}))} style={{height:34,width:50,border:`1px solid ${C.border}`,borderRadius:4,background:"transparent",cursor:"pointer"}}/></div>
          <button onClick={()=>{if(!nT.name)return;setCustom(p=>[...p,{...nT,id:Date.now(),used:0}]);setNT({name:"",tot:3,color:C.purple,tier:""}); }} style={sx.btn(C.green)}>Hinzufügen</button>
        </div>
      </div>
    </div>
  </div>);
}

/* --- */
function ConditionsTracker(){
  const[active,setActive]=usePersist("cond_v4",[]);
  const tog=id=>setActive(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  return(<div>
    {active.length>0&&<div style={sx.card}>
      <div style={sx.ct}>🎯 Aktive Conditions ({active.length})</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
        {CONDITIONS.filter(c=>active.includes(c.id)).map(c=>(
          <div key={c.id} style={{background:C.surface,border:`1px solid ${C.redBright}88`,borderRadius:6,padding:"8px 12px",maxWidth:260}}>
            <div style={{...sx.jb,marginBottom:4}}><span style={{fontFamily:"'Cinzel',serif",fontSize:13,color:C.redBright}}>{c.icon} {c.name}</span><button onClick={()=>tog(c.id)} style={sx.bsm(C.red)}>✕</button></div>
            <div style={{fontSize:13,color:C.textDim,lineHeight:1.5}}>{c.desc}</div>
          </div>
        ))}
      </div>
    </div>}
    <div style={sx.card}>
      <div style={sx.ct}>📋 Alle Conditions</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))",gap:8}}>
        {CONDITIONS.map(c=>(
          <div key={c.id} onClick={()=>tog(c.id)} style={{background:active.includes(c.id)?C.red+"33":C.surface,border:`1px solid ${active.includes(c.id)?C.redBright:C.border}`,borderRadius:6,padding:"8px 12px",cursor:"pointer",transition:"all .2s"}}>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:12,color:active.includes(c.id)?C.redBright:C.textBright,fontWeight:700,marginBottom:3}}>{c.icon} {c.name}</div>
            <div style={{fontSize:11,color:C.textDim,lineHeight:1.4}}>{c.desc.slice(0,80)}{c.desc.length>80?"...":""}</div>
          </div>
        ))}
      </div>
    </div>
  </div>);
}

/* --- */
function Notes(){
  const CATS=[
    {id:"all",label:"Alle",icon:"📋",color:C.textDim},
    {id:"location",label:"Location",icon:"🗺️",color:C.greenBright},
    {id:"story",label:"Story",icon:"📖",color:C.gold},
    {id:"misc",label:"Sonstiges",icon:"📝",color:C.blueBright},
  ];
  const CC={location:C.greenBright,story:C.gold,misc:C.blueBright};
  const CI={location:"🗺️",story:"📖",misc:"📝"};

  const[notes,setNotes]=usePersist("notes_v5",[
    {id:2,title:"Dunkle Waldlichtung",content:"",cat:"location"},
    {id:3,title:"Der verlorene Thron",content:"",cat:"story"},
  ]);
  const[aid,setAid]=useState(null);
  const[catFilter,setCatFilter]=useState("all");

  const filtered=catFilter==="all"?notes:notes.filter(n=>n.cat===catFilter);
  const cur=notes.find(n=>n.id===aid)||(filtered[0]||notes[0]);

  const addNote=(cat)=>{
    const n={id:Date.now(),title:"Neue Notiz",content:"",cat};
    setNotes(p=>[...p,n]);setAid(n.id);setCatFilter("all");
  };
  const upd=(id,field,val)=>setNotes(p=>p.map(n=>n.id===id?{...n,[field]:val}:n));
  const delNote=()=>{
    if(!cur)return;
    const id=cur.id;
    const rest=notes.filter(n=>n.id!==id);
    setNotes(rest);setAid(rest[0]?.id||null);
  };

  const mob=useMobile();
  return(<div style={{display:"flex",gap:12,minHeight:"65vh",flexDirection:mob?"column":"row"}}>
    <div style={{width:mob?"100%":215,flexShrink:0,display:"flex",flexDirection:"column",gap:6}}>

      <div style={{display:"flex",flexDirection:"column",gap:2}}>
        {CATS.map(c=>(
          <button key={c.id} onClick={()=>setCatFilter(c.id)} style={{
            background:catFilter===c.id?c.color+"33":C.surface,
            border:`1px solid ${catFilter===c.id?c.color:C.border}`,
            borderRadius:5,padding:"6px 10px",cursor:"pointer",textAlign:"left",
            color:catFilter===c.id?c.color:C.textDim,
            fontFamily:"'Calibri','Trebuchet MS','Gill Sans',sans-serif",
            fontSize:12,fontWeight:catFilter===c.id?700:400,
            display:"flex",alignItems:"center",justifyContent:"space-between",
          }}>
            <span>{c.icon} {c.label}</span>
            <span style={{fontSize:10,background:catFilter===c.id?c.color+"44":"transparent",borderRadius:10,padding:"1px 6px"}}>
              {c.id==="all"?notes.length:notes.filter(n=>n.cat===c.id).length}
            </span>
          </button>
        ))}
      </div>

      <div style={{display:"flex",flexWrap:"wrap",gap:4,borderTop:`1px solid ${C.border}`,paddingTop:6}}>
        {CATS.slice(1).map(c=>(
          <button key={c.id} onClick={()=>addNote(c.id)} title={`Neue ${c.label}-Notiz`} style={{
            background:"transparent",border:`1px solid ${c.color}40`,
            borderRadius:12,padding:"2px 9px",cursor:"pointer",
            color:c.color,fontSize:11,lineHeight:1.4,fontFamily:F,
          }}>+{c.icon}</button>
        ))}
        <span style={{fontSize:10,color:C.textDim,alignSelf:"center",marginLeft:2}}>Neue Notiz</span>
      </div>

      <div style={{flex:1,overflowY:"auto",maxHeight:"42vh",borderTop:`1px solid ${C.border}`,paddingTop:6}}>
        {filtered.map(n=>{
          const col=CC[n.cat]||C.textDim;
          const icon=CI[n.cat]||"📝";
          const active=cur?.id===n.id;
          return(
            <div key={n.id} onClick={()=>setAid(n.id)} style={{
              background:active?col+"22":C.surface,
              border:`1px solid ${active?col:C.border}`,
              borderLeft:`3px solid ${col}`,
              borderRadius:5,padding:"7px 9px",cursor:"pointer",marginBottom:3,transition:"all .15s",
            }}>
              <div style={{fontSize:12,color:active?col:C.textBright,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                {icon} {n.title||"(kein Titel)"}
              </div>
              <div style={{fontSize:10,color:C.textDim,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                {n.content.slice(0,34)||"(leer)"}{n.content.length>34?"...":""}
              </div>
            </div>
          );
        })}
        {filtered.length===0&&<div style={{fontSize:12,color:C.textDim,fontStyle:"italic",padding:"8px 4px"}}>Keine Eintraege.</div>}
      </div>

      {notes.length>0&&<button onClick={delNote} style={{...sx.bsm(C.red),width:"100%"}}>Notiz loeschen</button>}
    </div>

    <div style={{flex:1,display:"flex",flexDirection:"column",gap:8}}>
      {cur?(
        <>
          <div style={{
            background:C.surface,borderRadius:8,
            border:`1px solid ${CC[cur.cat]||C.border}`,
            borderLeft:`4px solid ${CC[cur.cat]||C.gold}`,
            padding:"10px 14px",display:"flex",alignItems:"center",gap:10,
          }}>
            <span style={{fontSize:18}}>{CI[cur.cat]||"📝"}</span>
            <input
              value={cur.title}
              onChange={e=>upd(cur.id,"title",e.target.value)}
              style={{
                flex:1,background:"transparent",border:"none",outline:"none",
                color:CC[cur.cat]||C.gold,
                fontFamily:"'Cinzel',serif",fontSize:17,fontWeight:700,
              }}
              placeholder="Titel eingeben..."
            />
            <select
              value={cur.cat}
              onChange={e=>upd(cur.id,"cat",e.target.value)}
              style={{
                background:C.card,border:`1px solid ${CC[cur.cat]||C.border}`,
                borderRadius:4,color:CC[cur.cat]||C.textDim,
                fontFamily:"'Calibri','Trebuchet MS','Gill Sans',sans-serif",
                fontSize:12,padding:"3px 8px",cursor:"pointer",outline:"none",
              }}
            >
              <option value="npc">Kategorie: NPC</option>
              <option value="location">Kategorie: Location</option>
              <option value="story">Kategorie: Story</option>
              <option value="misc">Kategorie: Sonstiges</option>
            </select>
          </div>
          <textarea
            value={cur.content}
            onChange={e=>upd(cur.id,"content",e.target.value)}
            style={{...sx.ta,flex:1,minHeight:400,lineHeight:1.9,fontSize:14,borderColor:CC[cur.cat]||C.border}}
            placeholder={
              cur.cat==="npc"     ?"Name, Rasse, Klasse, Motivation, Geheimnisse, Zitate...":
              cur.cat==="location"?"Beschreibung, Atmosphaere, wichtige Details, Gefahren...":
              cur.cat==="story"   ?"Plotpunkte, Hinweise, offene Faeden, Wendungen...":
                                   "Freie Notizen..."
            }
          />
        </>
      ):(
        <div style={{...sx.card,textAlign:"center",color:C.textDim,fontStyle:"italic",padding:40}}>
          <div style={{fontSize:36,marginBottom:10}}>📝</div>
          Waehle eine Notiz oder erstelle eine neue.
        </div>
      )}
    </div>
  </div>);
}

/* --- */
function Bestiary(){
  const mob2=useMobile();
  const[custom,setCustom]=usePersist("bestiary_v4",[]);
  const[search,setSearch]=useState("");const[tf,setTf]=useState("All");const[sel,setSel]=useState(null);const[showAdd,setShowAdd]=useState(false);
  const[form,setForm]=useState({name:"",cr:"1",hp:10,ac:10,speed:"30ft",type:"Beast",size:"Medium",str:10,dex:10,con:10,int:10,wis:10,cha:10,notes:""});
  const all=[...MONSTERS,...custom];
  const types=["All",...new Set(all.map(m=>m.type))].sort();
  const crN=cr=>{const n=parseFloat(cr);return isNaN(n)?0:n;};
  const filtered=all.filter(m=>(tf==="All"||m.type===tf)&&(m.name.toLowerCase().includes(search.toLowerCase())||m.type.toLowerCase().includes(search.toLowerCase()))).sort((a,b)=>crN(a.cr)-crN(b.cr));
  const crC=cr=>{const n=crN(cr);return n<1?"#40a060":n<5?"#c0a020":n<10?C.red:"#c020c0";};
  return(<div style={{display:"flex",gap:12}}>
    <div style={{width:230,flexShrink:0}}>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Monster suchen…" style={{...sx.inp,marginBottom:6}}/>
      <select value={tf} onChange={e=>setTf(e.target.value)} style={{...sx.sel,marginBottom:6}}>{types.map(t=><option key={t}>{t}</option>)}</select>
      <button onClick={()=>setShowAdd(!showAdd)} style={{...sx.btn(C.green),width:"100%",marginBottom:8}}>+ Eigenes Monster</button>
      <div style={{maxHeight:"62vh",overflowY:"auto"}}>
        {filtered.map(m=>(
          <div key={m.id} onClick={()=>{setSel(m);setShowAdd(false);}} style={{background:sel?.id===m.id?C.red+"33":C.surface,border:`1px solid ${sel?.id===m.id?C.red:C.border}`,borderRadius:4,padding:"7px 10px",cursor:"pointer",marginBottom:3}}>
            <div style={sx.jb}><span style={{fontSize:13,fontFamily:"'Cinzel',serif",color:C.textBright}}>{m.name}</span><span style={{fontSize:11,fontWeight:700,color:crC(m.cr)}}>CR {m.cr}</span></div>
            <span style={{fontSize:11,color:C.textDim}}>{m.size} {m.type}{m.custom&&<span style={{color:C.gold}}> ★</span>}</span>
          </div>
        ))}
        <div style={{textAlign:"center",fontSize:11,color:C.textDim,marginTop:6}}>{filtered.length} Monster</div>
      </div>
    </div>
    <div style={{flex:1}}>
      {showAdd?(
        <div style={sx.card}>
          <div style={sx.ct}>🐉 Neues Monster</div>
          <div style={sx.g3}>{[["name","Name","text"],["cr","CR","text"],["type","Typ","text"],["size","Größe","text"],["hp","HP","number"],["ac","AC","number"],["speed","Speed","text"]].map(([k,l,t])=><div key={k}><label style={sx.lbl}>{l}</label><input type={t} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:t==="number"?+e.target.value:e.target.value}))} style={sx.inp}/></div>)}</div>
          <div style={{marginTop:8}}><label style={sx.lbl}>Attribute</label><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{ABS.map(a=><div key={a}><label style={{...sx.lbl,textAlign:"center"}}>{a}</label><input type="number" value={form[a.toLowerCase()]} onChange={e=>setForm(p=>({...p,[a.toLowerCase()]:+e.target.value}))} style={{...sx.inp,width:60,textAlign:"center"}}/></div>)}</div></div>
          <div style={{marginTop:8}}><label style={sx.lbl}>Fähigkeiten</label><textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} style={{...sx.ta,height:70}}/></div>
          <div style={{display:"flex",gap:8,marginTop:10}}>
            <button onClick={()=>{if(!form.name)return;setCustom(p=>[...p,{...form,id:Date.now(),custom:true}]);setShowAdd(false);}} style={sx.btn(C.green)}>✓ Speichern</button>
            <button onClick={()=>setShowAdd(false)} style={sx.btn(C.red)}>✕ Abbrechen</button>
          </div>
        </div>
      ):sel?(
        <div style={sx.card}>
          <div style={{...sx.jb,marginBottom:8}}>
            <div><div style={{fontFamily:"'Cinzel',serif",fontSize:20,color:C.gold,fontWeight:700}}>{sel.name}</div><div style={{color:C.textDim,fontSize:13}}>{sel.size} {sel.type} — CR <span style={{color:crC(sel.cr),fontWeight:700}}>{sel.cr}</span></div></div>
            {sel.custom&&<button onClick={()=>{setCustom(p=>p.filter(m=>m.id!==sel.id));setSel(null);}} style={sx.bsm(C.red)}>🗑</button>}
          </div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:12}}>
            <span style={sx.tag(C.red)}>❤️ {sel.hp} HP</span><span style={sx.tag(C.blue)}>🛡️ {sel.ac} AC</span><span style={sx.tag(C.green)}>💨 {sel.speed}</span>
          </div>
          <div style={{display:"flex",gap:10,marginBottom:12,flexWrap:"wrap"}}>
            {ABS.map(a=><div key={a} style={{textAlign:"center",background:C.surface,borderRadius:4,padding:"6px 10px",minWidth:50}}><div style={{fontSize:10,color:SC[a],fontFamily:"'Cinzel',serif"}}>{a}</div><div style={{fontSize:18,fontWeight:700,color:C.textBright}}>{sel[a.toLowerCase()]}</div><div style={{fontSize:11,color:C.gold}}>{modStr(sel[a.toLowerCase()])}</div></div>)}
          </div>
          {sel.notes&&<div style={{color:C.textDim,fontSize:14,lineHeight:1.6,borderTop:`1px solid ${C.border}`,paddingTop:8}}>{sel.notes}</div>}
        </div>
      ):<div style={{...sx.card,color:C.textDim,textAlign:"center",fontStyle:"italic"}}>Monster auswählen (50 SRD) oder eigenes erstellen.</div>}
    </div>
  </div>);
}

/* --- */
function Spellbook({charId}){
  const[known,setKnown]=usePersist(`spells_known_${charId||"g"}`,[]);
  const[prepared,setPrepared]=usePersist(`spells_prep_${charId||"g"}`,[]);
  const[search,setSearch]=useState("");const[lf,setLf]=useState("All");const[cf,setCf]=useState("All");
  const[sel,setSel]=useState(null);const[view,setView]=useState("db");
  const CLASSES=["All","Bard","Cleric","Druid","Paladin","Ranger","Sorcerer","Warlock","Wizard"];
  const LVS=["All","0","1","2","3","4","5","6","7","8","9"];
  const SPC=["#808080","#3060c0","#2090a0","#409040","#a08020","#802080","#204080","#800020","#406060","#a02060"];
  const DT={fire:"🔥",cold:"❄️",lightning:"⚡",acid:"💚",thunder:"💨",radiant:"✨",necrotic:"💀",poison:"☠️",psychic:"🔮",force:"⚪",bludgeoning:"💢",healing:"💛",death:"💀"};
  const base=view==="known"?SPELLS.filter(s=>known.includes(s.id)):view==="prepared"?SPELLS.filter(s=>prepared.includes(s.id)):SPELLS;
  const shown=base.filter(s=>{
    const lm=lf==="All"||s.lv===parseInt(lf);
    const cm=cf==="All"||s.cls.includes(cf);
    const sm=!search||s.name.toLowerCase().includes(search.toLowerCase())||s.school.toLowerCase().includes(search.toLowerCase());
    return lm&&cm&&sm;
  });
  const grps={};shown.forEach(s=>{(grps[s.lv]=grps[s.lv]||[]).push(s);});
  const togKnown=id=>setKnown(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const togPrep=id=>{
    if(!known.includes(id)){setKnown(p=>[...p,id]);}
    setPrepared(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  };
  const ll=l=>l===0?"Cantrip":`Level ${l}`;
  return(<div style={{display:"flex",gap:12}}>
    <div style={{width:255,flexShrink:0}}>
      <div style={{display:"flex",gap:3,marginBottom:8,flexWrap:"wrap"}}>
        <button onClick={()=>setView("db")} style={sx.nb(view==="db")}>📚 Alle</button>
        <button onClick={()=>setView("known")} style={{...sx.nb(view==="known"),display:"flex",alignItems:"center",gap:4}}>⭐ Bekannt <span style={{background:C.blue,borderRadius:"50%",minWidth:16,height:16,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,padding:"0 2px"}}>{known.length}</span></button>
        <button onClick={()=>setView("prepared")} style={{...sx.nb(view==="prepared"),display:"flex",alignItems:"center",gap:4}}>🕯️ Vorbereitet <span style={{background:C.gold,color:C.bg,borderRadius:"50%",minWidth:16,height:16,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,padding:"0 2px",fontWeight:700}}>{prepared.length}</span></button>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Zauber suchen…" style={{...sx.inp,marginBottom:6}}/>
      <select value={cf} onChange={e=>setCf(e.target.value)} style={{...sx.sel,marginBottom:6}}>{CLASSES.map(c=><option key={c}>{c}</option>)}</select>
      <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:8}}>
        {LVS.map(l=><button key={l} onClick={()=>setLf(l)} style={{background:lf===l?SPC[parseInt(l)]||C.gold+"44":"transparent",border:`1px solid ${lf===l?SPC[parseInt(l)]||C.gold:C.border}`,borderRadius:3,color:lf===l?C.textBright:C.textDim,fontSize:10,padding:"3px 7px",cursor:"pointer",fontFamily:"'Cinzel',serif"}}>{l==="All"?"All":l==="0"?"C":l}</button>)}
      </div>
      <div style={{maxHeight:"55vh",overflowY:"auto"}}>
        {Object.keys(grps).sort((a,b)=>+a-+b).map(lv=>(
          <div key={lv}>
            <div style={{fontSize:11,color:SPC[+lv]||C.textDim,fontFamily:"'Cinzel',serif",fontWeight:700,padding:"4px 0 2px",borderBottom:`1px solid ${C.border}`,marginBottom:3}}>{ll(+lv)}</div>
            {grps[lv].map(sp=>(
              <div key={sp.id} onClick={()=>setSel(sp)} style={{background:sel?.id===sp.id?C.purple+"33":C.surface,border:`1px solid ${sel?.id===sp.id?C.purpleBright:C.border}`,borderRadius:4,padding:"5px 10px",cursor:"pointer",marginBottom:2,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div>
                  <div style={{fontSize:12,color:C.textBright,fontFamily:"'Cinzel',serif"}}>{sp.name}</div>
                  <div style={{fontSize:10,color:C.textDim}}>{sp.school}</div>
                </div>
                <div style={{display:"flex",gap:4}}>
                  <button onClick={e=>{e.stopPropagation();togPrep(sp.id);}} title="Vorbereiten" style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:prepared.includes(sp.id)?C.gold:"#444"}}>🕯️</button>
                  <button onClick={e=>{e.stopPropagation();togKnown(sp.id);}} title="Bekannt" style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:known.includes(sp.id)?C.blueBright:"#444"}}>★</button>
                </div>
              </div>
            ))}
          </div>
        ))}
        {shown.length===0&&<div style={{color:C.textDim,fontStyle:"italic",fontSize:13,padding:8}}>Keine Zauber.</div>}
      </div>
    </div>
    <div style={{flex:1}}>
      {sel?(
        <div style={sx.card}>
          <div style={{...sx.jb,marginBottom:10}}>
            <div>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:20,color:C.purpleBright,fontWeight:700}}>{sel.name}</div>
              <div style={{color:C.textDim,fontSize:13}}>{sel.lv===0?"Cantrip":ll(sel.lv)} · {sel.school}</div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>togPrep(sel.id)} style={sx.btn(prepared.includes(sel.id)?C.goldDim:C.purple)}>
                {prepared.includes(sel.id)?"🕯️ Vorbereitet":"🕯️ Vorbereiten"}
              </button>
              <button onClick={()=>togKnown(sel.id)} style={sx.btn(known.includes(sel.id)?C.blue:C.textDim)}>
                {known.includes(sel.id)?"★ Bekannt":"☆ Merken"}
              </button>
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
            {[["⏱",sel.ct],["📏",sel.range],["⏳",sel.dur],["🔤",sel.comp]].map(([ic,v])=><span key={ic} style={sx.tag(C.blue)}>{ic} {v}</span>)}
          </div>
          {sel.dmg!=="—"&&<div style={{display:"flex",gap:8,marginBottom:10}}><span style={sx.tag(C.red)}>💥 {sel.dmg}</span><span style={sx.tag(C.red)}>{DT[sel.dt]||"⚡"} {sel.dt}</span></div>}
          <div style={{fontSize:15,color:C.text,lineHeight:1.7,marginBottom:12}}>{sel.desc}</div>
          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:8,fontSize:12,color:C.textDim}}>Klassen: {sel.cls.join(", ")}</div>
          <div style={{marginTop:8,fontSize:12,color:C.textDim}}>
            <span style={{color:C.gold}}>★</span> Bekannt = du kennst den Zauber &nbsp;·&nbsp; <span style={{color:C.gold}}>🕯️</span> Vorbereitet = heute einsetzbar (Cleric/Wizard/Druid/Paladin)
          </div>
        </div>
      ):(
        <div style={{...sx.card,textAlign:"center",color:C.textDim}}>
          <div style={{fontSize:40,marginBottom:8}}>🔮</div>
          <div>Zauber aus der Liste auswählen.</div>
          <div style={{marginTop:10,display:"flex",justifyContent:"center",gap:16,fontSize:13}}>
            <span>★ = Bekannt (immer abrufbar)</span>
            <span>🕯️ = Vorbereitet (für heute)</span>
          </div>
          <div style={{marginTop:8,fontSize:13}}>{SPELLS.length} Zauber · Cantrips bis Level 9</div>
          <div style={{marginTop:4,fontSize:12,color:C.gold}}>{known.length} bekannt · {prepared.length} vorbereitet</div>
        </div>
      )}
    </div>
  </div>);
}

/* --- */
function CharSheet({char,setChar}){
  const[tab,setTab]=useState("stats");
  const u=(f,v)=>setChar(p=>({...p,[f]:v}));
  const pb=getPB(char.level);
  return(<div>
    <div style={{...sx.card,background:"linear-gradient(135deg,rgba(124,58,237,0.08),rgba(0,0,0,0.2))"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:8,marginBottom:14}}>
        <div><label style={sx.lbl}>Name</label><input value={char.name} onChange={e=>u("name",e.target.value)} style={{...sx.inp,fontSize:16,fontFamily:FH,color:C.gold,fontWeight:700}}/></div>
        <div><label style={sx.lbl}>Klasse</label>
          <select value={char.klass} onChange={e=>u("klass",e.target.value)} style={sx.sel}>
            {ALL_KLASSEN.map(k=><option key={k}>{k}</option>)}
            <option value="Eigene">Eigene...</option>
          </select>
          {char.klass==="Eigene"&&<input value={char.klassCustom||""} onChange={e=>u("klassCustom",e.target.value)} style={{...sx.inp,marginTop:4}} placeholder="Eigene Klasse..."/>}
        </div>
        <div><label style={sx.lbl}>Volk</label>
          <select value={char.race} onChange={e=>u("race",e.target.value)} style={sx.sel}>
            {ALL_VOELKER.map(r=><option key={r}>{r}</option>)}
            <option value="Eigenes">Eigenes...</option>
          </select>
          {char.race==="Eigenes"&&<input value={char.raceCustom||""} onChange={e=>u("raceCustom",e.target.value)} style={{...sx.inp,marginTop:4}} placeholder="Eigenes Volk..."/>}
        </div>
        <div><label style={sx.lbl}>Hintergrund</label>
          <select value={char.background} onChange={e=>u("background",e.target.value)} style={sx.sel}>
            {DND_BACKGROUNDS.map(b=><option key={b}>{b}</option>)}
            <option value="Eigener">Eigener...</option>
          </select>
          {char.background==="Eigener"&&<input value={char.backgroundCustom||""} onChange={e=>u("backgroundCustom",e.target.value)} style={{...sx.inp,marginTop:4}} placeholder="Eigener Hintergrund..."/>}
        </div>
        <div><label style={sx.lbl}>Level</label><input type="number" min={1} max={20} value={char.level} onChange={e=>u("level",+e.target.value)} style={sx.inp}/></div>
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"stretch"}}>
        {[["❤️","HP","hp",0,char.maxHp,C.red],["💛","Max HP","maxHp",1,999,C.amber],["💙","Temp HP","tempHp",0,999,C.blue],["🛡️","AC","ac",0,30,C.teal],["⚡","Init","initiative",-10,20,C.green],["💨","Speed","speed",0,120,C.purple]].map(([ic,l,f,mn,mx,col])=>(
          <div key={f} style={{background:`${col}12`,border:`1px solid ${col}25`,borderRadius:10,padding:"8px 12px",textAlign:"center",minWidth:70}}>
            <div style={{fontSize:10,color:col,fontFamily:FH,marginBottom:2,letterSpacing:.5}}>{ic} {l}</div>
            <input type="number" min={mn} max={mx} value={char[f]} onChange={e=>u(f,+e.target.value)} style={{...sx.inp,textAlign:"center",fontSize:22,fontWeight:700,color:C.textBright,padding:"2px 0",background:"transparent",border:"none",width:68}}/>
          </div>
        ))}
        <div style={{background:`${C.gold}12`,border:`1px solid ${C.gold}25`,borderRadius:10,padding:"8px 14px",textAlign:"center",minWidth:58}}>
          <div style={{fontSize:10,color:C.gold,fontFamily:FH,marginBottom:2,letterSpacing:.5}}>🎖️ PB</div>
          <div style={{fontSize:22,fontWeight:700,color:C.gold}}>+{pb}</div>
        </div>
        <button onClick={()=>u("inspiration",!char.inspiration)} style={{
          background:char.inspiration?"linear-gradient(135deg,#f0c060,#d97706)":"rgba(0,0,0,0.25)",
          border:`1px solid ${char.inspiration?C.gold:C.border}`,
          borderRadius:10,padding:"8px 14px",cursor:"pointer",textAlign:"center",minWidth:88,
          boxShadow:char.inspiration?"0 0 20px rgba(240,192,96,0.4)":"none",
          transition:"all .3s",
        }}>
          <div style={{fontSize:22}}>{char.inspiration?"✨":"💫"}</div>
          <div style={{fontSize:9,fontFamily:FH,fontWeight:700,color:char.inspiration?"#000":C.textDim,letterSpacing:.5,marginTop:2}}>INSPIRATION</div>
          <div style={{fontSize:8,color:char.inspiration?"#00000099":C.textDim,marginTop:1}}>{char.inspiration?"VERFUEGBAR":"INAKTIV"}</div>
        </button>
      </div>
    </div>
    <div style={{display:"flex",gap:5,marginBottom:12,overflowX:"auto",WebkitOverflowScrolling:"touch",scrollbarWidth:"none",paddingBottom:2}}>
      {[["stats","⚔️ Attribute"],["skills","🎯 Skills"],["saves","💀 Saves"],["personality","🎭 Charakter"]].map(([t,l])=>(
        <button key={t} onClick={()=>setTab(t)} style={{...sx.nb(tab===t),flexShrink:0}}>{l}</button>
      ))}
    </div>
    {tab==="stats"&&<div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:12}}>
        {ABS.map(ab=>{const val=char[ab.toLowerCase()]||10;return(
          <div key={ab} style={sx.statBox(SC[ab])}>
            <div style={{fontSize:11,fontFamily:FH,color:SC[ab],fontWeight:700,letterSpacing:1,marginBottom:2}}>{ab}</div>
            <input type="number" min={1} max={30} value={val} onChange={e=>u(ab.toLowerCase(),+e.target.value)} style={{...sx.inp,textAlign:"center",fontSize:28,fontWeight:900,color:C.textBright,padding:"4px 0",background:"transparent",border:"none"}}/>
            <div style={{fontSize:17,fontWeight:700,color:SC[ab],borderTop:`1px solid ${SC[ab]}25`,paddingTop:4,marginTop:2}}>{modStr(val)}</div>
          </div>
        );})}
      </div>
      <div style={sx.g2}>
        <div style={sx.card}><div style={sx.ct}>🏹 Hit Dice</div>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            <input value={char.hd} onChange={e=>u("hd",e.target.value)} style={{...sx.inp,width:70}} placeholder="1d10"/>
            <span style={{color:C.textBright}}>{char.level-(char.hd_used||0)}× verfügbar</span>
            <button onClick={()=>u("hd_used",Math.max(0,(char.hd_used||0)-1))} style={sx.bsm(C.green)}>+ Wiederh.</button>
            <button onClick={()=>u("hd_used",Math.min(char.level,(char.hd_used||0)+1))} style={sx.bsm(C.red)}>- Verbrauch</button>
          </div>
        </div>
      </div>
    </div>}
    {tab==="skills"&&<div style={sx.card}>
      <div style={sx.ct}>🎯 Skills <span style={{color:C.textDim,fontSize:11,fontWeight:400}}>(☑ Proficient · ☑☑ Expertise)</span></div>
      <div style={{columns:2,gap:12}}>
        {Object.entries(SKILLS).flatMap(([ab,skills])=>skills.map(skill=>{
          const pk=`skill_${skill}`,ek=`exp_${skill}`;
          const ip=char.skills[pk],ie=char.skills[ek];
          const bonus=modOf(char[ab.toLowerCase()]||10)+(ie?pb*2:ip?pb:0);
          return(<div key={skill} style={{display:"flex",alignItems:"center",gap:6,marginBottom:6,breakInside:"avoid"}}>
            <input type="checkbox" checked={ip||false} onChange={e=>setChar(p=>({...p,skills:{...p.skills,[pk]:e.target.checked}}))} title="Proficient"/>
            <input type="checkbox" checked={ie||false} onChange={e=>setChar(p=>({...p,skills:{...p.skills,[ek]:e.target.checked}}))} title="Expertise"/>
            <span style={{color:SC[ab],fontSize:10,fontFamily:"'Cinzel',serif",width:24}}>{ab}</span>
            <span style={{flex:1,fontSize:14,color:ip?C.textBright:C.text}}>{skill}</span>
            <span style={{fontSize:13,fontWeight:700,color:ip?C.gold:C.textDim,minWidth:26,textAlign:"right"}}>{bonus>=0?`+${bonus}`:bonus}</span>
          </div>);
        }))}
      </div>
    </div>}
    {tab==="saves"&&<div>
      <div style={sx.card}><div style={sx.ct}>🎯 Saving Throws</div>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          {ABS.map(ab=>{const val=char[ab.toLowerCase()]||10;const prof=char.saves[ab];const bonus=modOf(val)+(prof?pb:0);return(
            <div key={ab} style={{display:"flex",alignItems:"center",gap:6,background:C.surface,borderRadius:4,padding:"8px 12px"}}>
              <input type="checkbox" checked={prof||false} onChange={e=>setChar(p=>({...p,saves:{...p.saves,[ab]:e.target.checked}}))}/>
              <span style={{color:SC[ab],fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:13}}>{ab}</span>
              <span style={{fontSize:16,fontWeight:700,color:prof?C.gold:C.textDim}}>{bonus>=0?`+${bonus}`:bonus}</span>
            </div>
          );})}
        </div>
      </div>
      <div style={sx.card}><div style={sx.ct}>💀 Todeswürfe</div>
        <div style={{display:"flex",gap:24}}>
          {[["Erfolge",C.greenBright,"suc"],["Misserfolge",C.redBright,"fail"]].map(([lbl,col,f])=>(
            <div key={f}><div style={{fontSize:13,color:col,marginBottom:6,fontFamily:"'Cinzel',serif"}}>{lbl}</div>
              <div style={{display:"flex",gap:6}}>{[0,1,2].map(i=><div key={i} onClick={()=>setChar(p=>{const ds=p.deathSaves||{suc:0,fail:0};return{...p,deathSaves:{...ds,[f]:i<(ds[f]||0)?i:(ds[f]||0)+1}};})} style={{width:24,height:24,borderRadius:"50%",background:i<((char.deathSaves||{})[f]||0)?col:"transparent",border:`2px solid ${col}`,cursor:"pointer"}}/>)}</div>
            </div>
          ))}
        </div>
        <button onClick={()=>setChar(p=>({...p,deathSaves:{suc:0,fail:0}}))} style={{...sx.bsm(C.textDim),marginTop:10}}>Zurücksetzen</button>
      </div>
      <div style={sx.card}><div style={sx.ct}>🔮 Zauberwerte</div>
        <div style={sx.g3}>
          <div><label style={sx.lbl}>Fähigkeit</label><select value={char.spellAbility} onChange={e=>u("spellAbility",e.target.value)} style={sx.sel}>{ABS.map(a=><option key={a}>{a}</option>)}</select></div>
          <div><label style={sx.lbl}>Zauber-SG</label><input type="number" value={char.spellDC} onChange={e=>u("spellDC",+e.target.value)} style={sx.inp}/></div>
          <div><label style={sx.lbl}>Zauber-Angriff</label><input type="number" value={char.spellAtk} onChange={e=>u("spellAtk",+e.target.value)} style={sx.inp}/></div>
        </div>
      </div>
    </div>}
    {tab==="personality"&&<div>
      <div style={sx.g2}>
        {[["traits","🎭 Persönlichkeit","Ich bin…"],["ideals","💡 Ideale","Ich glaube an…"],["bonds","❤️ Bindungen","Ich sorge mich um…"],["flaws","💔 Makel","Mein größter Fehler…"]].map(([f,l,ph])=>(
          <div key={f} style={sx.card}><div style={sx.ct}>{l}</div><textarea value={char[f]} onChange={e=>u(f,e.target.value)} style={{...sx.ta,height:80}} placeholder={ph}/></div>
        ))}
      </div>
      <div style={sx.card}><div style={sx.ct}>🗡️ Features & Fähigkeiten</div><textarea value={char.features} onChange={e=>u("features",e.target.value)} style={{...sx.ta,height:90}} placeholder="Klassen-Features, Volksfähigkeiten…"/></div>
      <div style={sx.card}><div style={sx.ct}>📖 Hintergrundgeschichte</div><textarea value={char.backstory} onChange={e=>u("backstory",e.target.value)} style={{...sx.ta,height:110}} placeholder="Woher komme ich? Was motiviert mich?"/></div>
    </div>}
  </div>);
}

/* --- */
function CharActions({char,setChar}){
  const TYPES=[
    {id:"action",label:"Aktion",icon:"⚔️",color:C.red},
    {id:"bonus",label:"Bonus-Aktion",icon:"⚡",color:C.amber},
    {id:"reaction",label:"Reaktion",icon:"🛡️",color:C.blue},
  ];
  const STD_ACTIONS=[
    {type:"action",name:"Angriff",range:"5ft",toHit:"STR/DEX+PB",damage:"Waffe",description:"Einen Nahkampf- oder Fernkampfangriff mit einer Waffe ausfuehren."},
    {type:"action",name:"Zaubern",range:"Variabel",toHit:"",damage:"Zauber",description:"Einen Zauber mit Casting Time 1 Aktion wirken."},
    {type:"action",name:"Rennen (Dash)",range:"—",toHit:"",damage:"—",description:"Geschwindigkeit verdoppeln bis Ende des Zuges."},
    {type:"action",name:"Ausweichen (Dodge)",range:"—",toHit:"",damage:"—",description:"Bis Beginn deines naechsten Zuges: Angriffe gegen dich haben Nachteil (wenn du den Angreifer sehen kannst). DEX-Saves: Vorteil."},
    {type:"action",name:"Helfen (Help)",range:"5ft",toHit:"",damage:"—",description:"Einem Verbundeten helfen: Vorteil auf naechste Faehigkeitsprobe oder Angriff gegen eine Kreatur in 5ft."},
    {type:"action",name:"Verstecken (Hide)",range:"—",toHit:"",damage:"—",description:"Stealth-Check (gegen passive Perception der Feinde). Erfolg: du bist versteckt."},
    {type:"action",name:"Bereit machen (Ready)",range:"—",toHit:"",damage:"—",description:"Aktion fuer spaeter vorbereiten (Reaktion). Trigger festlegen, Aktion und Concentration-Check beachten."},
    {type:"action",name:"Suchen (Search)",range:"—",toHit:"",damage:"—",description:"Perception- oder Investigation-Check um etwas zu finden."},
    {type:"action",name:"Objekt benutzen",range:"5ft",toHit:"",damage:"—",description:"Einen magischen Gegenstand oder eine Falle/Tuer/Mechanismus benutzen."},
    {type:"action",name:"Greifen (Grapple)",range:"5ft",toHit:"STR(Athletics)",damage:"—",description:"Kreatur packen: Athletik-Check gegen Athletik/Akrobatik des Ziels. Erfolg: Kreatur Grappled (Speed 0)."},
    {type:"action",name:"Stossen (Shove)",range:"5ft",toHit:"STR(Athletics)",damage:"—",description:"Kreatur umwerfen (Prone) oder 5ft wegstossen: Athletik gegen Athletik/Akrobatik."},
    {type:"bonus",name:"Nebenhandangriff",range:"5ft",toHit:"STR/DEX",damage:"Nebenhand (kein Mod)",description:"Zwei-Waffen-Kampf: Wenn du mit leichter Waffe angegriffen hast, Nebenhandangriff ohne Schadens-Modifikator."},
    {type:"bonus",name:"Bonus-Zaubern",range:"Variabel",toHit:"",damage:"Zauber",description:"Einen Zauber mit Casting Time 1 Bonus-Aktion wirken. Du kannst in dieser Runde keinen anderen Zauber (ausser Cantrips) wirken."},
    {type:"bonus",name:"Zweiter Wind",range:"Self",toHit:"",damage:"1d10+Fighter-Lv",description:"(Kaempfer) 1× pro Kurze/Lange Rast: 1d10 + Fighter-Level HP heilen."},
    {type:"bonus",name:"Verschlaeuerter Angriff (Cunning)",range:"—",toHit:"",damage:"—",description:"(Schurke) Bonus-Aktion: Dash, Disengage oder Hide."},
    {type:"bonus",name:"Wildgestalt (Wild Shape)",range:"Self",toHit:"",damage:"—",description:"(Druide) In ein Tier verwandeln (CR-Grenze je nach Level). Bis Lange Rast: 2×."},
    {type:"bonus",name:"Kriegsschrei (Battle Cry)",range:"30ft",toHit:"",damage:"—",description:"(Barbar) Rage einleiten: +2 Schadens-Bonus, Resistance B/P/S, Vorteil STR-Checks+Saves."},
    {type:"reaction",name:"Gelegenheitsangriff",range:"5ft",toHit:"STR/DEX+PB",damage:"Waffe",description:"Wenn eine Kreatur deinen Nahkampfbereich verlässt (ohne Disengage): 1 Nahkampfangriff als Reaktion."},
    {type:"reaction",name:"Schild-Zauber (Shield)",range:"Self",toHit:"",damage:"—",description:"(Zauberer/Hexenmeister, Spell Slot 1) +5 AC bis Beginn deines naechsten Zuges. Auch gegen Magic Missile."},
    {type:"reaction",name:"Gegenzauber (Counterspell)",range:"60ft",toHit:"",damage:"—",description:"(Spell Slot 3+) Zauber Lv 3: automatisch. Lv 4+: Spellcasting-Check DC 10+Lv. Spell Slot = Zauberlevel."},
    {type:"reaction",name:"Schutzstil (Protection)",range:"5ft",toHit:"",damage:"—",description:"(Kaempfer, Protection-Stil, Schild) Angriff gegen benachbarte Kreatur: Angreifer hat Nachteil."},
    {type:"reaction",name:"Wächter-Angriff (Sentinel)",range:"5ft",toHit:"STR/DEX+PB",damage:"Waffe",description:"(Feat) Wenn Kreatur in Reichweite eine andere angreift: Reaktions-Angriff."},
  ];

  const actions=char.actions||[];
  const setActions=fn=>setChar(p=>({...p,actions:typeof fn==="function"?fn(p.actions||[]):fn}));
  const[showForm,setShowForm]=useState(false);
  const[showStd,setShowStd]=useState(false);
  const[stdFilter,setStdFilter]=useState("action");
  const[editId,setEditId]=useState(null);
  const blank={name:"",type:"action",description:"",toHit:"",damage:"",range:"",saveDC:"",saveAbility:"STR"};
  const[form,setForm]=useState(blank);
  const grouped={action:actions.filter(a=>a.type==="action"),bonus:actions.filter(a=>a.type==="bonus"),reaction:actions.filter(a=>a.type==="reaction")};

  const openNew=()=>{setForm(blank);setEditId(null);setShowForm(true);setShowStd(false);};
  const openEdit=a=>{setForm({...a});setEditId(a.id);setShowForm(true);setShowStd(false);};
  const addStd=tmpl=>{setActions(p=>[...p,{...tmpl,id:Date.now(),saveDC:"",saveAbility:"STR"}]);};
  const save=()=>{
    if(!form.name)return;
    if(editId)setActions(p=>p.map(a=>a.id===editId?{...form,id:editId}:a));
    else setActions(p=>[...p,{...form,id:Date.now()}]);
    setShowForm(false);setEditId(null);
  };
  const del=id=>setActions(p=>p.filter(a=>a.id!==id));

  return(<div>
    <div style={{...sx.jb,marginBottom:14,flexWrap:"wrap",gap:8}}>
      <div style={{fontSize:13,color:C.textDim}}>
        Aktionen, Bonus-Aktionen und Reaktionen
        {(char.pinnedActionIds||[]).length>0&&<span style={{...sx.tag(C.amber),marginLeft:8,fontSize:10}}>📌 {(char.pinnedActionIds||[]).length} auf Übersicht</span>}
      </div>
      <div style={{display:"flex",gap:6}}>
        <button onClick={()=>{setShowStd(!showStd);setShowForm(false);}} style={sx.btn(showStd?C.amber:C.teal)}>📖 Standard D&D</button>
        <button onClick={openNew} style={sx.btn(C.purple)}>+ Eigene Aktion</button>
      </div>
    </div>

    {showStd&&<div style={sx.card}>
      <div style={sx.ct}>📖 Standard D&D 5e Aktionen hinzufuegen</div>
      <div style={{display:"flex",gap:6,marginBottom:12}}>
        {TYPES.map(t=><button key={t.id} onClick={()=>setStdFilter(t.id)} style={{...sx.bsm(t.color),background:stdFilter===t.id?`${t.color}30`:`${t.color}10`,border:`1px solid ${t.color}44`,fontWeight:stdFilter===t.id?700:400}}>{t.icon} {t.label}</button>)}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {STD_ACTIONS.filter(a=>a.type===stdFilter).map((a,i)=>{
          const col=TYPES.find(t=>t.id===a.type)?.color||C.red;
          const already=actions.some(x=>x.name===a.name&&x.type===a.type);
          return(<div key={i} style={{background:`${col}08`,border:`1px solid ${col}20`,borderLeft:`3px solid ${col}`,borderRadius:8,padding:"10px 12px",display:"flex",alignItems:"flex-start",gap:10}}>
            <div style={{flex:1}}>
              <div style={{fontFamily:FH,fontSize:13,color:C.textBright,fontWeight:700,marginBottom:3}}>{a.name} {a.range&&<span style={{...sx.tag(col),marginLeft:6}}>{a.range}</span>}</div>
              {(a.toHit||a.damage)&&<div style={{display:"flex",gap:6,marginBottom:4}}>{a.toHit&&<span style={sx.tag(col)}>🎯 {a.toHit}</span>}{a.damage&&a.damage!=="—"&&<span style={sx.tag(col)}>💥 {a.damage}</span>}</div>}
              <div style={{fontSize:12,color:C.textDim,lineHeight:1.5}}>{a.description}</div>
            </div>
            <button onClick={()=>!already&&addStd(a)} style={{...sx.btn(already?C.textDim:col),opacity:already?.5:1,flexShrink:0,fontSize:10,padding:"5px 10px"}}>
              {already?"✓ Drin":"+ Hinzufuegen"}
            </button>
          </div>);
        })}
      </div>
    </div>}

    {showForm&&<div style={sx.card}>
      <div style={sx.ct}>{editId?"Aktion bearbeiten":"Neue Aktion"}</div>
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        {TYPES.map(t=>(<button key={t.id} onClick={()=>setForm(p=>({...p,type:t.id}))} style={{flex:1,padding:"10px 6px",borderRadius:10,cursor:"pointer",border:`2px solid ${form.type===t.id?t.color:C.border}`,background:form.type===t.id?`${t.color}22`:"transparent",color:form.type===t.id?t.color:C.textDim,fontFamily:FH,fontSize:11,fontWeight:700,transition:"all .15s"}}>{t.icon} {t.label}</button>))}
      </div>
      <div style={sx.g3}>
        <div style={{gridColumn:"1/3"}}><label style={sx.lbl}>Name</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} style={sx.inp} placeholder="z.B. Longsword-Angriff"/></div>
        <div><label style={sx.lbl}>Reichweite</label><input value={form.range} onChange={e=>setForm(p=>({...p,range:e.target.value}))} style={sx.inp} placeholder="5ft"/></div>
        <div><label style={sx.lbl}>Treffer +</label><input value={form.toHit} onChange={e=>setForm(p=>({...p,toHit:e.target.value}))} style={sx.inp} placeholder="+5"/></div>
        <div><label style={sx.lbl}>Schaden</label><input value={form.damage} onChange={e=>setForm(p=>({...p,damage:e.target.value}))} style={sx.inp} placeholder="1d8+3"/></div>
        <div><label style={sx.lbl}>Save DC</label><input value={form.saveDC} onChange={e=>setForm(p=>({...p,saveDC:e.target.value}))} style={sx.inp} placeholder="DC 14"/></div>
        <div><label style={sx.lbl}>Save Attribut</label><select value={form.saveAbility} onChange={e=>setForm(p=>({...p,saveAbility:e.target.value}))} style={sx.sel}>{ABS.map(a=><option key={a}>{a}</option>)}</select></div>
      </div>
      <div style={{marginTop:10}}><label style={sx.lbl}>Beschreibung</label><textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} style={{...sx.ta,height:72}} placeholder="Effekt, Bedingungen, Sonderregeln..."/></div>
      <div style={{display:"flex",gap:8,marginTop:12}}>
        <button onClick={save} style={sx.btn(C.green)}>Speichern</button>
        <button onClick={()=>setShowForm(false)} style={sx.btn(C.textDim)}>Abbrechen</button>
      </div>
    </div>}

    {TYPES.map(({id,label,icon,color})=>(
      <div key={id} style={{marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <span style={{fontSize:18}}>{icon}</span>
          <span style={{fontFamily:FH,color,fontSize:13,fontWeight:700,letterSpacing:.5}}>{label}</span>
          <span style={{background:`${color}22`,border:`1px solid ${color}44`,borderRadius:12,padding:"1px 10px",fontSize:11,color,fontWeight:700}}>{grouped[id].length}</span>
        </div>
        {grouped[id].length===0?(
          <div style={{background:`${color}08`,border:`1px dashed ${color}30`,borderRadius:10,padding:"10px 14px",color:C.textDim,fontSize:12,fontStyle:"italic"}}>
            Keine {label}en. Nutze "Standard D&D" oder "+ Eigene Aktion".
          </div>
        ):(
          grouped[id].map(action=>(
            <div key={action.id} style={{background:`${color}0c`,border:`1px solid ${color}30`,borderLeft:`3px solid ${color}`,borderRadius:10,padding:"10px 14px",marginBottom:6}}>
              <div style={{...sx.jb,marginBottom:(action.toHit||action.damage||action.saveDC)?6:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <span style={{fontFamily:FH,fontSize:13,color:C.textBright,fontWeight:700}}>{action.name}</span>
                  {action.range&&action.range!=="—"&&<span style={sx.tag(color)}>{action.range}</span>}
                </div>
                <div style={{display:"flex",gap:4}}>
                  <button onClick={()=>openEdit(action)} style={sx.bsm(C.gold)}>✎</button>
                  <button onClick={()=>{
                    const pinned=char.pinnedActionIds||[];
                    const next=pinned.includes(action.id)?pinned.filter(x=>x!==action.id):[...pinned,action.id];
                    setChar(p=>({...p,pinnedActionIds:next}));
                  }} title="Auf Übersicht anzeigen" style={{
                    ...sx.bsm((char.pinnedActionIds||[]).includes(action.id)?C.amber:C.textDim),
                    fontWeight:(char.pinnedActionIds||[]).includes(action.id)?700:400,
                  }}>📌</button>
                  <button onClick={()=>del(action.id)} style={sx.bsm(C.red)}>✕</button>
                </div>
              </div>
              {(action.toHit||action.damage||action.saveDC)&&<div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:action.description?5:0}}>
                {action.toHit&&<span style={sx.tag(color)}>🎯 {action.toHit}</span>}
                {action.damage&&action.damage!=="—"&&<span style={sx.tag(color)}>💥 {action.damage}</span>}
                {action.saveDC&&<span style={sx.tag(color)}>⚡ {action.saveDC} {action.saveAbility}</span>}
              </div>}
              {action.description&&<div style={{fontSize:12,color:C.textDim,lineHeight:1.5}}>{action.description}</div>}
            </div>
          ))
        )}
      </div>
    ))}
    {actions.length===0&&!showForm&&!showStd&&(
      <div style={{...sx.card,textAlign:"center",color:C.textDim,padding:36}}>
        <div style={{fontSize:40,marginBottom:8}}>⚔️</div>
        <div style={{fontSize:14,marginBottom:4}}>Noch keine Aktionen angelegt</div>
        <div style={{fontSize:12}}>Nutze "Standard D&D" fuer vorgefertigte Regelwerk-Aktionen oder erstelle eigene.</div>
      </div>
    )}
  </div>);
}

/* --- */
function CharInventory({char,setChar}){
  const RC={Common:C.textDim,Uncommon:"#00c040",Rare:"#3b82f6","Very Rare":"#a855f7",Legendary:"#f59e0b"};
  const RC_BG={Common:"rgba(255,255,255,0.05)",Uncommon:"rgba(0,192,64,0.1)",Rare:"rgba(59,130,246,0.1)","Very Rare":"rgba(168,85,247,0.1)",Legendary:"rgba(245,158,11,0.15)"};
  const TYPE_ICON={Weapon:"⚔️",Armor:"🛡️",Item:"📦",Potion:"🧪",Ring:"💍",Wand:"🪄",Staff:"🔱",Scroll:"📜"};

  const inv=char.inventory||[];
  const setInv=fn=>setChar(p=>({...p,inventory:typeof fn==="function"?fn(p.inventory||[]):fn}));

  const SLOTS=[
    {id:"head",label:"Kopf",icon:"👑"},
    {id:"neck",label:"Hals",icon:"📿"},
    {id:"chest",label:"Brust",icon:"🧥"},
    {id:"hands",label:"Haende",icon:"🧤"},
    {id:"ring1",label:"Ring L",icon:"💍"},
    {id:"ring2",label:"Ring R",icon:"💍"},
    {id:"main",label:"Haupthand",icon:"⚔️"},
    {id:"off",label:"Nebenhand",icon:"🛡️"},
    {id:"feet",label:"Fuesse",icon:"👢"},
    {id:"back",label:"Ruecken",icon:"🎒"},
  ];

  const slots=char.equipSlots||{};
  const setSlots=fn=>setChar(p=>({...p,equipSlots:typeof fn==="function"?fn(p.equipSlots||{}):fn}));

  const[view,setView]=useState("equip");
  const[showAdd,setShowAdd]=useState(false);
  const[search,setSearch]=useState("");
  const[selItem,setSelItem]=useState(null);
  const[selSlot,setSelSlot]=useState(null);
  const[form,setForm]=useState({name:"",type:"Item",sub:"",dmg:"",ac:"",eff:"",wt:"",rar:"Common",notes:""});

  const bagItems=inv.filter(i=>!Object.values(slots).find(s=>s&&s.uid===i.uid));
  const filtered=bagItems.filter(i=>!search||i.name.toLowerCase().includes(search.toLowerCase()));
  const totalWeight=inv.reduce((s,i)=>s+(parseFloat((i.wt||"0").replace(/[^0-9.]/g,""))||0)*(i.qty||1),0);

  const addFromSRD=item=>{setInv(p=>[...p,{...item,uid:Date.now()+Math.random(),qty:1}]);};
  const addCustom=()=>{
    if(!form.name)return;
    setInv(p=>[...p,{...form,id:Date.now(),uid:Date.now()+Math.random(),qty:1,custom:true}]);
    setForm({name:"",type:"Item",sub:"",dmg:"",ac:"",eff:"",wt:"",rar:"Common",notes:""});
    setShowAdd(false);
  };
  const removeItem=uid=>{
    setInv(p=>p.filter(i=>i.uid!==uid));
    setSlots(p=>{const n={...p};Object.keys(n).forEach(k=>{if(n[k]&&n[k].uid===uid)n[k]=null;});return n;});
    if(selItem&&selItem.uid===uid)setSelItem(null);
  };
  const equipToSlot=(slotId,item)=>{setSlots(p=>({...p,[slotId]:item}));setSelSlot(null);setSelItem(null);};
  const unequipSlot=slotId=>setSlots(p=>({...p,[slotId]:null}));
  const setQty=(uid,qty)=>setInv(p=>p.map(i=>i.uid===uid?{...i,qty:Math.max(1,qty)}:i));

  return(<div>
    {/* Gold Bar */}
    <div style={{background:"linear-gradient(135deg,rgba(240,192,96,0.1),rgba(0,0,0,0.2))",border:`1px solid ${C.gold}30`,borderRadius:12,padding:"10px 16px",marginBottom:12,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
      <span style={{fontSize:22}}>💰</span>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontFamily:FH,fontSize:13,color:C.gold,fontWeight:700,letterSpacing:.5}}>GOLD</span>
        <input type="number" min={0} value={char.gold||0} onChange={e=>setChar(p=>({...p,gold:Math.max(0,+e.target.value)}))} style={{...sx.inp,width:100,fontSize:22,fontWeight:700,color:C.gold,textAlign:"center",background:"transparent",border:`1px solid ${C.gold}40`}}/>
        <span style={{fontSize:13,color:C.gold}}>gp</span>
      </div>
      <div style={{display:"flex",gap:6}}>
        {[1,5,10,50,100].map(amt=>(
          <button key={amt} onClick={()=>setChar(p=>({...p,gold:Math.max(0,(p.gold||0)+amt)}))} style={{...sx.bsm(C.green),fontSize:10}}>+{amt}</button>
        ))}
        {[1,5,10,50,100].map(amt=>(
          <button key={-amt} onClick={()=>setChar(p=>({...p,gold:Math.max(0,(p.gold||0)-amt)}))} style={{...sx.bsm(C.red),fontSize:10}}>-{amt}</button>
        ))}
      </div>
      <span style={{fontSize:12,color:C.textDim,marginLeft:"auto"}}>⚖️ {totalWeight.toFixed(1)} lb</span>
    </div>

    <div style={{...sx.jb,marginBottom:14,flexWrap:"wrap",gap:8}}>
      <div style={{display:"flex",gap:6}}>
        {[["equip","⚔️ Ausgestattet"],["bag","🎒 Rucksack"],["srd","📦 SRD Katalog"]].map(([v,l])=>(
          <button key={v} onClick={()=>setView(v)} style={{...sx.bsm(v===view?C.purple:C.textDim),fontWeight:v===view?700:400}}>{l}</button>
        ))}
      </div>
      <button onClick={()=>setShowAdd(!showAdd)} style={sx.btn(showAdd?C.textDim:C.green)}>+ Eigenes Item</button>
    </div>

    {showAdd&&<div style={{...sx.card,marginBottom:14}}>
      <div style={sx.ct}>✏️ Eigenes Item erstellen</div>
      <div style={sx.g3}>
        <div><label style={sx.lbl}>Name</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} style={sx.inp}/></div>
        <div><label style={sx.lbl}>Typ</label>
          <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} style={sx.sel}>
            {["Weapon","Armor","Item","Potion","Ring","Wand","Staff","Scroll"].map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
        <div><label style={sx.lbl}>Seltenheit</label>
          <select value={form.rar} onChange={e=>setForm(p=>({...p,rar:e.target.value}))} style={sx.sel}>
            {["Common","Uncommon","Rare","Very Rare","Legendary"].map(r=><option key={r}>{r}</option>)}
          </select>
        </div>
        <div><label style={sx.lbl}>Schaden / AC / Effekt</label><input value={form.dmg||form.ac||form.eff} onChange={e=>setForm(p=>({...p,dmg:e.target.value}))} style={sx.inp} placeholder="1d8, AC 16, 2d4+2 HP..."/></div>
        <div><label style={sx.lbl}>Gewicht</label><input value={form.wt} onChange={e=>setForm(p=>({...p,wt:e.target.value}))} style={sx.inp} placeholder="3 lb"/></div>
        <div><label style={sx.lbl}>Subtyp</label><input value={form.sub} onChange={e=>setForm(p=>({...p,sub:e.target.value}))} style={sx.inp} placeholder="Martial Melee"/></div>
      </div>
      <div style={{marginTop:8}}><label style={sx.lbl}>Notizen</label><textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} style={{...sx.ta,height:48}}/></div>
      <div style={{display:"flex",gap:8,marginTop:10}}>
        <button onClick={addCustom} style={sx.btn(C.green)}>Hinzufuegen</button>
        <button onClick={()=>setShowAdd(false)} style={sx.btn(C.textDim)}>Abbrechen</button>
      </div>
    </div>}

    {view==="equip"&&<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(80px,1fr))",gap:8,marginBottom:14}}>
        {SLOTS.map(slot=>{
          const eq=slots[slot.id];
          const col=eq?RC[eq.rar]||C.textDim:C.border;
          const isSelTarget=selItem&&selSlot===slot.id;
          return(<div key={slot.id}
            onClick={()=>{
              if(selItem){equipToSlot(slot.id,selItem);}
              else if(eq){setSelItem(eq);setSelSlot(slot.id);}
              else{setSelSlot(slot.id);}
            }}
            style={{
              background:eq?RC_BG[eq.rar]||"rgba(255,255,255,0.05)":"rgba(0,0,0,0.25)",
              border:`2px solid ${selSlot===slot.id&&!selItem?C.gold:eq?col:C.border}`,
              borderRadius:12,padding:"10px 6px",textAlign:"center",cursor:"pointer",
              transition:"all .2s",minHeight:70,
              boxShadow:eq?`0 0 12px ${col}30`:"none",
            }}>
            <div style={{fontSize:18,marginBottom:3}}>{eq?TYPE_ICON[eq.type]||"📦":slot.icon}</div>
            <div style={{fontSize:9,color:C.textDim,fontFamily:F,letterSpacing:.5,textTransform:"uppercase"}}>{slot.label}</div>
            {eq&&<div style={{fontSize:10,color:col,fontWeight:700,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{eq.name}</div>}
            {eq&&<button onClick={e=>{e.stopPropagation();unequipSlot(slot.id);}} style={{background:"none",border:"none",color:C.textDim,cursor:"pointer",fontSize:10,marginTop:2}}>✕</button>}
          </div>);
        })}
      </div>
      {selItem&&<div style={{...sx.card,background:`${RC[selItem.rar]||C.purple}15`,border:`1px solid ${RC[selItem.rar]||C.purple}40`,marginBottom:12}}>
        <div style={{fontSize:12,color:C.textDim,marginBottom:6}}>Klicke einen Ausruestungsslot um <strong style={{color:RC[selItem.rar]||C.gold}}>{selItem.name}</strong> auszustatten, oder:</div>
        <button onClick={()=>{setSelItem(null);setSelSlot(null);}} style={sx.bsm(C.textDim)}>Abbrechen</button>
      </div>}
      {bagItems.length===0&&<div style={{textAlign:"center",color:C.textDim,fontSize:12,padding:12}}>Rucksack ist leer. Wechsle zu "Rucksack" um Items hinzuzufuegen.</div>}
    </div>}

    {view==="bag"&&<div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Items suchen..." style={{...sx.inp,marginBottom:12}}/>
      {filtered.length===0&&<div style={{...sx.card,textAlign:"center",color:C.textDim,padding:32}}>
        <div style={{fontSize:36,marginBottom:8}}>🎒</div>Rucksack leer. Fuege Items aus dem SRD-Katalog hinzu.
      </div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8}}>
        {filtered.map(item=>{
          const col=RC[item.rar]||C.textDim;
          const bg=RC_BG[item.rar]||"rgba(255,255,255,0.04)";
          const isSelected=selItem&&selItem.uid===item.uid;
          return(<div key={item.uid} onClick={()=>setSelItem(isSelected?null:item)} style={{
            background:isSelected?`${col}22`:bg,
            border:`2px solid ${isSelected?col:col+"40"}`,
            borderRadius:12,padding:"12px",cursor:"pointer",transition:"all .15s",
            boxShadow:isSelected?`0 0 14px ${col}40`:"none",
          }}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <span style={{fontSize:22}}>{TYPE_ICON[item.type]||"📦"}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:FH,fontSize:12,color:C.textBright,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>
                <div style={{fontSize:10,color:col,fontWeight:700}}>{item.rar}</div>
              </div>
            </div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:6}}>
              {item.dmg&&item.dmg!=="—"&&<span style={sx.tag(C.red)}>⚔️{item.dmg}</span>}
              {item.ac&&<span style={sx.tag(C.blue)}>🛡️{item.ac}</span>}
              {item.eff&&<span style={sx.tag(C.green)}>✨{item.eff}</span>}
              {item.wt&&<span style={{fontSize:9,color:C.textDim}}>⚖️{item.wt}</span>}
            </div>
            {item.notes&&<div style={{fontSize:11,color:C.textDim,lineHeight:1.4,marginBottom:6}}>{item.notes.slice(0,60)}{item.notes.length>60?"...":""}</div>}
            <div style={{display:"flex",gap:4,alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:4}}>
                <span style={{fontSize:10,color:C.textDim}}>×</span>
                <input type="number" min={1} value={item.qty||1} onChange={e=>{e.stopPropagation();setQty(item.uid,+e.target.value);}} onClick={e=>e.stopPropagation()} style={{...sx.inp,width:44,padding:"2px 6px",fontSize:12,textAlign:"center"}}/>
              </div>
              {isSelected&&<button onClick={e=>{e.stopPropagation();setView("equip");}} style={sx.bsm(C.purple)}>Ausstatten</button>}
              <button onClick={e=>{e.stopPropagation();removeItem(item.uid);}} style={sx.bsm(C.red)}>🗑</button>
            </div>
          </div>);
        })}
      </div>
    </div>}

    {view==="srd"&&<div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 SRD-Items suchen..." style={{...sx.inp,marginBottom:12}}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:6}}>
        {SRD_ITEMS.filter(i=>!search||i.name.toLowerCase().includes(search.toLowerCase())).map(item=>{
          const col=RC[item.rar]||C.textDim;
          const already=inv.some(i=>i.name===item.name);
          return(<div key={item.id} style={{background:already?"rgba(0,0,0,0.2)":RC_BG[item.rar]||"rgba(255,255,255,0.04)",border:`1px solid ${already?C.border:col+"40"}`,borderRadius:10,padding:"10px 12px",display:"flex",gap:8,alignItems:"flex-start",opacity:already?.6:1}}>
            <div style={{flex:1}}>
              <div style={{fontFamily:FH,fontSize:12,color:C.textBright,fontWeight:700,marginBottom:2}}>{item.name}</div>
              <div style={{fontSize:10,color:col}}>{item.rar} · {item.sub||item.type}</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:4}}>
                {item.dmg&&item.dmg!=="—"&&<span style={sx.tag(C.red)}>⚔️{item.dmg}</span>}
                {item.ac&&<span style={sx.tag(C.blue)}>🛡️{item.ac}</span>}
                {item.eff&&<span style={sx.tag(C.green)}>✨{item.eff}</span>}
              </div>
            </div>
            <button onClick={()=>!already&&addFromSRD(item)} style={{...sx.btn(already?C.textDim:C.green),fontSize:10,padding:"5px 10px",flexShrink:0,opacity:already?.5:1}}>
              {already?"✓":"+ Nehmen"}
            </button>
          </div>);
        })}
      </div>
    </div>}
  </div>);
}

/* ══════ LEVEL-UP ASSISTENT ══════ */
function LevelUpAssistant({char,setChar}){
  const newLevel=char.level+1;
  const pb=getPB(newLevel);
  const pbOld=getPB(char.level);
  const hdNum=parseInt((char.hd||"d8").replace(/[^0-9]/g,""))||8;
  const conMod=modOf(char.con||10);

  const[hpChoice,setHpChoice]=useState("avg"); // "avg" | "max" | "roll"
  const[rolledHp,setRolledHp]=useState(null);
  const[doneInfo,setDoneInfo]=useState(null); // snapshot of what was achieved

  const avgHp=Math.floor(hdNum/2)+1+conMod;
  const maxHp=hdNum+conMod;
  const chosenHp=hpChoice==="max"?maxHp:hpChoice==="roll"&&rolledHp!=null?Math.max(1,rolledHp+conMod):avgHp;

  const classData=D3_KLASSEN.find(c=>c.name===char.klass)||null;
  const newPbFeature=pb>pbOld;

  // Spell slot table (simple approximation for full casters)
  const FULL_CASTER_SLOTS={
    Barde:[0,[2],[3],[4,2],[4,3],[4,3,2],[4,3,3],[4,3,3,1],[4,3,3,2],[4,3,3,3,1],[4,3,3,3,2],[4,3,3,3,2,1],[4,3,3,3,2,1],[4,3,3,3,2,1,1],[4,3,3,3,2,1,1],[4,3,3,3,2,1,1,1],[4,3,3,3,2,1,1,1],[4,3,3,3,2,1,1,1,1],[4,3,3,3,3,1,1,1,1],[4,3,3,3,3,2,1,1,1],[4,3,3,3,3,2,2,1,1]],
  };
  const FULL_CASTERS=["Barde","Kleriker","Druide","Magier","Zauberer"];
  const isFullCaster=FULL_CASTERS.includes(char.klass);

  const doLevelUp=()=>{
    // Snapshot the achieved values BEFORE updating the character
    setDoneInfo({
      reachedLevel:newLevel,
      hpGained:chosenHp,
      newPb:pb,
      oldPb:pbOld,
    });
    setChar(p=>({
      ...p,
      level:newLevel,
      maxHp:p.maxHp+chosenHp,
      hp:p.hp+chosenHp,
      hd_used:Math.max(0,(p.hd_used||0)-1), // regain 1 HD on levelup
    }));
  };

  if(newLevel>20&&!doneInfo)return(<div style={sx.card}><div style={{...sx.ct}}>⬆️ Level-Up</div><div style={{color:C.textDim,fontSize:14}}>Level 20 erreicht — maximales Level!</div></div>);

  if(doneInfo)return(<div style={{...sx.card,background:`${C.purple}10`,border:`1px solid ${C.purple}40`}}>
    <div style={{textAlign:"center",padding:20}}>
      <div style={{fontSize:48,marginBottom:10}}>🎉</div>
      <div style={{fontFamily:FH,fontSize:22,color:C.gold,fontWeight:700,marginBottom:6}}>Level {doneInfo.reachedLevel} erreicht!</div>
      <div style={{fontSize:14,color:C.textDim,marginBottom:16}}>
        +{doneInfo.hpGained} Max HP · PB {doneInfo.newPb>doneInfo.oldPb?`+${doneInfo.newPb} (war +${doneInfo.oldPb})`:`+${doneInfo.newPb}`}
      </div>
      <button onClick={()=>setDoneInfo(null)} style={sx.btn(C.purple)}>Zurück zum Assistenten</button>
    </div>
  </div>);

  return(<div>
    {/* Header */}
    <div style={{...sx.card,background:"linear-gradient(135deg,rgba(124,58,237,0.1),rgba(0,0,0,0.2))",marginBottom:12}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
        <span style={{fontSize:36}}>⬆️</span>
        <div>
          <div style={{fontFamily:FH,fontSize:18,color:C.gold,fontWeight:700}}>{char.name}</div>
          <div style={{fontSize:13,color:C.textDim}}>{char.klass} · Level {char.level} → <span style={{color:C.purpleBright,fontWeight:700}}>Level {newLevel}</span></div>
        </div>
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <span style={sx.tag(C.purple)}>⬆️ Level {newLevel}</span>
        <span style={sx.tag(C.gold)}>🎖️ PB +{pb}{newPbFeature&&<span style={{color:C.amberBright}}> (↑ von +{pbOld})</span>}</span>
        <span style={sx.tag(C.teal)}>🎲 {char.hd}</span>
      </div>
    </div>

    {/* 1. HP */}
    <div style={sx.card}>
      <div style={sx.ct}>1. Trefferpunkte</div>
      <div style={{fontSize:13,color:C.textDim,marginBottom:12}}>
        CON-Mod: <strong style={{color:C.textBright}}>{modStr(char.con||10)}</strong> · Hit Dice: <strong style={{color:C.textBright}}>{char.hd}</strong>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
        {[["avg",`Durchschnitt (${avgHp} HP)`,C.blue],["max",`Maximum (${maxHp} HP)`,C.green],["roll","Würfeln",C.amber]].map(([v,l,col])=>(
          <button key={v} onClick={()=>setHpChoice(v)} style={{
            flex:"1 1 120px",padding:"10px",borderRadius:10,cursor:"pointer",
            background:hpChoice===v?`${col}22`:"transparent",
            border:`2px solid ${hpChoice===v?col:C.border}`,
            color:hpChoice===v?col:C.textDim,fontFamily:FH,fontSize:11,fontWeight:hpChoice===v?700:400,
          }}>{l}</button>
        ))}
      </div>
      {hpChoice==="roll"&&<div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
        <span style={{fontSize:13,color:C.textDim}}>Ergebnis des {char.hd}-Wurfs:</span>
        <input type="number" min={1} max={hdNum} value={rolledHp??""} onChange={e=>setRolledHp(Math.max(1,Math.min(hdNum,+e.target.value)))} style={{...sx.inp,width:80}} placeholder={`1-${hdNum}`}/>
        <button onClick={()=>setRolledHp(Math.floor(Math.random()*(hdNum))+1)} style={sx.btn(C.amber)}>🎲 Würfeln</button>
      </div>}
      <div style={{background:`${C.green}12`,border:`1px solid ${C.green}30`,borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:12}}>
        <span style={{fontSize:24}}>❤️</span>
        <div>
          <div style={{fontSize:12,color:C.textDim}}>Neue Max HP</div>
          <div style={{fontSize:22,fontWeight:700,color:C.greenBright}}>{char.maxHp} + {chosenHp} = <span style={{color:C.gold}}>{char.maxHp+chosenHp}</span></div>
        </div>
      </div>
    </div>

    {/* 2. Klassenmerkmale */}
    {classData&&<div style={sx.card}>
      <div style={sx.ct}>2. Klassenmerkmale auf Level {newLevel}</div>
      {classData&&(
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {(()=>{
            const lvlFeatures=[];
            if(newLevel===4||newLevel===8||newLevel===12||newLevel===16||newLevel===19)
              lvlFeatures.push({name:"Attributswerterhöhung (ASI)",desc:"Zwei verschiedene Attribute um je 1 erhöhen, oder ein Feat nehmen."});
            if(newLevel===5)
              lvlFeatures.push({name:"Extra-Angriff (falls Klasse)",desc:"Viele Klassen erhalten ab Level 5 einen zweiten Angriff pro Runde."});
            if(newPbFeature)
              lvlFeatures.push({name:`Proficiency Bonus erhöht sich`,desc:`PB steigt von +${pbOld} auf +${pb}.`});
            if(lvlFeatures.length===0)
              return <div style={{fontSize:13,color:C.textDim,fontStyle:"italic"}}>Prüfe dein Regelwerk auf Level-{newLevel}-Features deiner Klasse ({char.klass}).</div>;
            return lvlFeatures.map((f,i)=>(
              <div key={i} style={{background:`${C.purple}0a`,border:`1px solid ${C.purple}20`,borderLeft:`3px solid ${C.purple}`,borderRadius:8,padding:"8px 12px"}}>
                <div style={{fontFamily:FH,fontSize:13,color:C.purpleBright,fontWeight:700,marginBottom:3}}>{f.name}</div>
                <div style={{fontSize:12,color:C.textDim,lineHeight:1.5}}>{f.desc}</div>
              </div>
            ));
          })()}
        </div>
      )}
    </div>}

    {/* 3. Spell Slots */}
    {isFullCaster&&<div style={sx.card}>
      <div style={sx.ct}>3. Zauberplätze</div>
      <div style={{fontSize:13,color:C.textDim,marginBottom:10}}>
        Als {char.klass} auf Level {newLevel} hast du folgende Zauberplätze:
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {["1st","2nd","3rd","4th","5th","6th","7th","8th","9th"].map((lbl,i)=>{
          const slots=(FULL_CASTER_SLOTS[char.klass]||FULL_CASTER_SLOTS.Barde)[newLevel]?.[i]||0;
          if(!slots)return null;
          return(<div key={i} style={{background:`${C.blue}12`,border:`1px solid ${C.blue}25`,borderRadius:8,padding:"8px 14px",textAlign:"center",minWidth:60}}>
            <div style={{fontSize:10,color:C.textDim,fontFamily:FH,marginBottom:2}}>{lbl}</div>
            <div style={{fontSize:20,fontWeight:700,color:C.blueBright}}>{slots}</div>
          </div>);
        })}
      </div>
      <div style={{fontSize:12,color:C.textDim,marginTop:8}}>Aktualisiere deine Spell Slots manuell im Tokens-Tab falls nötig.</div>
    </div>}

    {/* 4. Notizen */}
    <div style={sx.card}>
      <div style={sx.ct}>{isFullCaster?"4.":"3."} Erinnerungen für Level {newLevel}</div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {[
          newLevel===2&&"Wähle deine Unterklasse / deinen Archetypen falls noch nicht geschehen.",
          newLevel===3&&"Viele Klassen erhalten auf Level 3 ihre Unterklassen-Features.",
          newLevel===5&&"Extra-Angriff: Prüfe ob deine Klasse jetzt einen zweiten Angriff bekommt.",
          (newLevel===4||newLevel===8||newLevel===12||newLevel===16||newLevel===19)&&"ASI oder Feat: Wähle 2 Attributspunkte ODER ein Feat (wenn DM erlaubt).",
          newLevel===10&&"Prüfe ob deine Klasse auf Level 10 ein besonderes Feature hat.",
          newLevel===20&&"Maximales Level! Überprüfe das Capstone-Feature deiner Klasse.",
          "Passive Wahrnehmung neu berechnen: 10 + WIS-Mod + PB (wenn Proficiency).",
          "Rettungswürfe und Skills aktualisieren falls PB gestiegen.",
          "Prüfe ob neue Zauber zur Auswahl stehen (Spellbook-Tab).",
        ].filter(Boolean).map((tip,i)=>(
          <div key={i} style={{display:"flex",gap:8,fontSize:12,color:C.text,lineHeight:1.5}}>
            <span style={{color:C.gold,flexShrink:0}}>💡</span>
            <span>{tip}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Confirm Button */}
    <div style={{...sx.card,background:`${C.green}10`,border:`1px solid ${C.green}40`}}>
      <div style={{...sx.jb,flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontFamily:FH,fontSize:14,color:C.greenBright,fontWeight:700}}>Level-Up bestätigen</div>
          <div style={{fontSize:12,color:C.textDim}}>
            Level {char.level} → {newLevel} · Max HP +{chosenHp} ({char.maxHp} → {char.maxHp+chosenHp}) · PB +{pb}
          </div>
        </div>
        <button onClick={doLevelUp} style={{...sx.btn(C.green),fontSize:13,padding:"10px 20px"}}>
          ⬆️ Jetzt Level-Up durchführen
        </button>
      </div>
    </div>
  </div>);
}

/* --- */
function CharManager(){
  const[chars,setChars]=usePersist("chars_v4",[newChar(1)]);
  const[aid,setAid]=usePersist("chars_active_v4",1);
  const[subtab,setSubtab]=useState("sheet");
  const[slots,setSlots]=usePersist("tokens_slots_v4",[{lv:1,lbl:"1st",tot:4,used:0},{lv:2,lbl:"2nd",tot:3,used:0},{lv:3,lbl:"3rd",tot:3,used:0},{lv:4,lbl:"4th",tot:3,used:0},{lv:5,lbl:"5th",tot:2,used:0}]);
  const[restMode,setRestMode]=useState(null);
  const[shortHpVal,setShortHpVal]=useState(5);
  const[shortResult,setShortResult]=useState(null);

  const active=chars.find(c=>c.id===aid)||chars[0];
  const setActive=upd=>setChars(prev=>prev.map(c=>c.id===aid?(typeof upd==="function"?upd(c):upd):c));
  const addChar=()=>{const id=Date.now();setChars(p=>[...p,newChar(id)]);setAid(id);};
  const delChar=id=>{if(chars.length<=1)return;const nx=chars.find(c=>c.id!==id);setChars(p=>p.filter(c=>c.id!==id));setAid(nx?.id);};

  const doLongRest=()=>{
    setActive(p=>{
      const regainHD=Math.max(1,Math.floor(p.level/2));
      return{...p,hp:p.maxHp,tempHp:0,deathSaves:{suc:0,fail:0},hd_used:Math.max(0,(p.hd_used||0)-regainHD)};
    });
    setSlots(p=>p.map(s=>({...s,used:0})));
    setRestMode("long_done");
  };

  const doShortRest=()=>{
    const hp=Math.max(0,shortHpVal||0);
    setActive(p=>({...p,hp:Math.min(p.maxHp,p.hp+hp)}));
    setShortResult({healed:hp});
    setRestMode("short_done");
  };

  const importJSON=(e)=>{
    const file=e.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=ev=>{
      try{
        const data=JSON.parse(ev.target.result);
        if(data&&data.name){
          const id=Date.now();
          const newC={...newChar(id),...data,id};
          setChars(p=>[...p,newC]);setAid(id);
        }else{alert("Ungültige Charakter-Datei.");}
      }catch{alert("JSON konnte nicht gelesen werden.");}
    };
    reader.readAsText(file);
    e.target.value="";
  };

  if(!active)return null;
  const hdAvail=active.level-(active.hd_used||0);

  return(<div>
    <div style={{background:"rgba(255,255,255,0.03)",border:`1px solid ${C.border}`,borderRadius:14,padding:"12px 16px",marginBottom:14}}>
      <div style={{...sx.jb,flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <span style={{fontSize:11,color:C.textDim,fontFamily:FH,letterSpacing:1}}>CHARAKTER</span>
          {chars.map(c=>(
            <button key={c.id} onClick={()=>setAid(c.id)} style={{
              background:c.id===aid?"linear-gradient(135deg,#7c3aed44,#5b21b622)":"transparent",
              border:`1px solid ${c.id===aid?C.purple:C.border}`,
              borderRadius:20,color:c.id===aid?C.purpleBright:C.textBright,
              fontFamily:FH,fontSize:12,padding:"5px 14px",cursor:"pointer",fontWeight:c.id===aid?700:400,
              boxShadow:c.id===aid?"0 0 12px rgba(124,58,237,0.3)":"none",transition:"all .2s",
            }}>{c.name} <span style={{color:C.textDim,fontSize:10}}>Lv.{c.level}</span></button>
          ))}
          <button onClick={addChar} style={sx.bsm(C.green)}>+ Neu</button>
          {chars.length>1&&<button onClick={()=>delChar(aid)} style={sx.bsm(C.red)}>🗑</button>}
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <button onClick={()=>setRestMode(restMode==="short"?null:"short")} style={{
            ...sx.bsm(C.teal),
            background:restMode==="short"?`${C.teal}30`:`${C.teal}18`,
            border:`1px solid ${C.teal}55`,fontWeight:700,
          }}>🌙 Kurze Rast</button>
          <button onClick={()=>setRestMode(restMode==="long_confirm"?null:"long_confirm")} style={{
            ...sx.bsm(C.purple),
            background:restMode==="long_confirm"?`${C.purple}30`:`${C.purple}18`,
            border:`1px solid ${C.purple}55`,fontWeight:700,
          }}>🌟 Lange Rast</button>
          <span style={{fontSize:10,color:C.textDim}}>💾 Auto-Speichern</span>
        </div>
      </div>

      {restMode==="short"&&(
        <div style={{marginTop:12,padding:"12px 14px",background:"rgba(13,148,136,0.1)",border:`1px solid ${C.teal}40`,borderRadius:10}}>
          <div style={{fontSize:13,color:C.tealBright,fontFamily:FH,fontWeight:700,marginBottom:8}}>🌙 Kurze Rast — HP wiederherstellen</div>
          <div style={{fontSize:12,color:C.textDim,marginBottom:10}}>
            Aktuelle HP: <strong style={{color:C.textBright}}>{active.hp} / {active.maxHp}</strong>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <label style={{...sx.lbl,marginBottom:0,whiteSpace:"nowrap"}}>HP-Betrag:</label>
            <input type="number" min={0} max={active.maxHp} value={shortHpVal} onChange={e=>setShortHpVal(Math.max(0,+e.target.value))} style={{...sx.inp,width:80}}/>
            <button onClick={doShortRest} style={sx.btn(C.teal)}>Heilen</button>
            <button onClick={()=>setRestMode(null)} style={sx.bsm(C.textDim)}>Abbrechen</button>
          </div>
        </div>
      )}

      {restMode==="short_done"&&shortResult&&(
        <div style={{marginTop:12,padding:"12px 14px",background:"rgba(13,148,136,0.1)",border:`1px solid ${C.teal}40`,borderRadius:10,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
          <div style={{fontSize:22}}>🌙</div>
          <div>
            <div style={{fontSize:14,color:C.tealBright,fontWeight:700}}>Kurze Rast abgeschlossen!</div>
            <div style={{fontSize:12,color:C.textDim}}><strong style={{color:C.greenBright}}>+{shortResult.healed} HP</strong> wiederhergestellt</div>
          </div>
          <button onClick={()=>setRestMode(null)} style={sx.bsm(C.textDim)}>✕</button>
        </div>
      )}

      {restMode==="long_confirm"&&(
        <div style={{marginTop:12,padding:"12px 14px",background:"rgba(124,58,237,0.1)",border:`1px solid ${C.purple}40`,borderRadius:10}}>
          <div style={{fontSize:13,color:C.purpleBright,fontFamily:FH,fontWeight:700,marginBottom:6}}>🌟 Lange Rast — Bestaetigen</div>
          <div style={{fontSize:12,color:C.textDim,marginBottom:10}}>
            Stellt wieder her: <strong style={{color:C.textBright}}>volle HP</strong>, <strong style={{color:C.textBright}}>alle Spell Slots</strong>, <strong style={{color:C.textBright}}>Temp HP &rarr; 0</strong>, <strong style={{color:C.textBright}}>Todeswuerfe reset</strong>,{" "}
            <strong style={{color:C.textBright}}>{Math.max(1,Math.floor(active.level/2))} Hit Dice</strong> wiederhergestellt.
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={doLongRest} style={sx.btn(C.purple)}>🌟 Lange Rast durchfuehren</button>
            <button onClick={()=>setRestMode(null)} style={sx.bsm(C.textDim)}>Abbrechen</button>
          </div>
        </div>
      )}

      {restMode==="long_done"&&(
        <div style={{marginTop:12,padding:"12px 14px",background:"rgba(124,58,237,0.1)",border:`1px solid ${C.purple}40`,borderRadius:10,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
          <div style={{fontSize:22}}>🌟</div>
          <div>
            <div style={{fontSize:14,color:C.purpleBright,fontWeight:700}}>Lange Rast abgeschlossen!</div>
            <div style={{fontSize:12,color:C.textDim}}>HP voll &bull; Alle Spell Slots zurueck &bull; Hit Dice teilweise wiederhergestellt</div>
          </div>
          <button onClick={()=>setRestMode(null)} style={sx.bsm(C.textDim)}>✕</button>
        </div>
      )}
    </div>

    <div style={{display:"flex",gap:5,marginBottom:14,overflowX:"auto",WebkitOverflowScrolling:"touch",scrollbarWidth:"none",paddingBottom:4}}>
      {[["sheet","📜 Bogen"],["levelup","⬆️ Level-Up"],["aktionen","⚔️ Aktionen"],["spells","🔮 Spellbook"],["inventory","🗡️ Ausruestung"],["tokens","🏷️ Tokens"],["conditions","⚡ Conditions"]].map(([t,l])=>(
        <button key={t} onClick={()=>setSubtab(t)} style={{...sx.nb(subtab===t),flexShrink:0}}>{l}</button>
      ))}
    </div>
    {subtab==="sheet"&&<CharSheet char={active} setChar={setActive}/>}
    {subtab==="levelup"&&<LevelUpAssistant char={active} setChar={setActive}/>}
    {subtab==="aktionen"&&<CharActions char={active} setChar={setActive}/>}
    {subtab==="spells"&&<Spellbook key={aid} charId={aid}/>}
    {subtab==="inventory"&&<CharInventory char={active} setChar={setActive}/>}
    {subtab==="tokens"&&<Tokens/>}
    {subtab==="conditions"&&<ConditionsTracker/>}
  </div>);
}

/* --- */
/* ══════════ ÜBERSICHT ══════════ */
function Overview(){
  const[chars,setChars]=usePersist("chars_v4",[newChar(1)]);
  const[aid]=usePersist("chars_active_v4",1);
  const[slots,setSlots]=usePersist("tokens_slots_v4",[{lv:1,lbl:"1st",tot:4,used:0},{lv:2,lbl:"2nd",tot:3,used:0},{lv:3,lbl:"3rd",tot:3,used:0},{lv:4,lbl:"4th",tot:3,used:0},{lv:5,lbl:"5th",tot:2,used:0}]);
  const[custom,setCustom]=usePersist("tokens_custom_v4",[]);
  const[activeConds,setActiveConds]=usePersist("cond_v4",[]);
  const[restMode,setRestMode]=useState(null);
  const[shortHpVal,setShortHpVal]=useState(5);
  const[shortResult,setShortResult]=useState(null);

  const[prepIds,setPrepIds]=useState([]);
  const[knownIds,setKnownIds]=useState([]);
  useEffect(()=>{
    if(!aid&&aid!==0)return;
    (async()=>{
      try{
        const pr=await window.storage?.get(`spells_prep_${aid}`);
        const kr=await window.storage?.get(`spells_known_${aid}`);
        setPrepIds(pr?.value?JSON.parse(pr.value):[]);
        setKnownIds(kr?.value?JSON.parse(kr.value):[]);
      }catch(e){setPrepIds([]);setKnownIds([]);}
    })();
  },[aid]);

  const char=chars.find(c=>c.id===aid)||chars[0];
  const setChar=upd=>setChars(prev=>prev.map(c=>c.id===aid?(typeof upd==="function"?upd(c):upd):c));

  if(!char) return null;

  const pb=getPB(char.level);
  const equipSlots=char.equipSlots||{};
  const equipped=Object.entries(equipSlots).filter(([,v])=>v).map(([slot,item])=>({slot,item}));

  const preparedSpells=SPELLS.filter(s=>prepIds.includes(s.id)&&s.lv>0);
  const cantrips=SPELLS.filter(s=>knownIds.includes(s.id)&&s.lv===0);
  const SLOT_LABELS=["","1st","2nd","3rd","4th","5th","6th","7th","8th","9th"];
  const SC2=["#3060c0","#2090a0","#409040","#a08020","#802080","#204080","#800020","#406060","#a02060"];
  const RC={Common:C.textDim,Uncommon:"#00c040",Rare:"#3b82f6","Very Rare":"#a855f7",Legendary:"#f59e0b"};
  const TYPE_ICON={Weapon:"⚔️",Armor:"🛡️",Item:"📦",Potion:"🧪",Ring:"💍",Wand:"🪄",Staff:"🔱",Scroll:"📜"};
  const SLOT_NAMES={head:"Kopf",neck:"Hals",chest:"Brust",hands:"Haende",ring1:"Ring L",ring2:"Ring R",main:"Haupthand",off:"Nebenhand",feet:"Fuesse",back:"Ruecken"};

  const activeCss=activeConds.map(id=>CONDITIONS.find(c=>c.id===id)).filter(Boolean);
  const hpPct=char.hp/char.maxHp;
  const hpCol=hpPct>.5?C.greenBright:hpPct>.25?C.amberBright:C.redBright;

  const doLongRest=()=>{
    setChar(p=>{
      const regain=Math.max(1,Math.floor(p.level/2));
      return{...p,hp:p.maxHp,tempHp:0,deathSaves:{suc:0,fail:0},hd_used:Math.max(0,(p.hd_used||0)-regain)};
    });
    setSlots(p=>p.map(s=>({...s,used:0})));
    setRestMode("long_done");
  };
  const doShortRest=()=>{
    const hp=Math.max(0,shortHpVal||0);
    setChar(p=>({...p,hp:Math.min(p.maxHp,p.hp+hp)}));
    setShortResult({healed:hp});
    setRestMode("short_done");
  };

  const StatBox=({icon,label,val,col})=>(
    <div style={{background:`${col}12`,border:`1px solid ${col}25`,borderRadius:12,padding:"10px 14px",textAlign:"center",flex:"1 1 85px",minWidth:85}}>
      <div style={{fontSize:10,color:col,fontFamily:FH,letterSpacing:.5,marginBottom:4}}>{icon} {label}</div>
      <div style={{fontSize:32,fontWeight:900,color:C.textBright,lineHeight:1}}>{val}</div>
    </div>
  );

  return(<div>
    <div style={{...sx.jb,marginBottom:8,flexWrap:"wrap",gap:4}}>
      <div>
        <div style={{fontFamily:FH,fontSize:18,color:C.gold,fontWeight:900}}>{char.name}</div>
        <div style={{fontSize:12,color:C.textDim}}>{char.race} · {char.klass} · Level {char.level}</div>
      </div>
      <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
        <button onClick={()=>setRestMode(restMode==="short"?null:"short")} style={{...sx.bsm(C.teal),border:`1px solid ${C.teal}55`,fontWeight:700}}>🌙 Kurze Rast</button>
        <button onClick={()=>setRestMode(restMode==="long_confirm"?null:"long_confirm")} style={{...sx.bsm(C.purple),border:`1px solid ${C.purple}55`,fontWeight:700}}>🌟 Lange Rast</button>
      </div>
    </div>

    {restMode==="short"&&<div style={{background:`${C.teal}10`,border:`1px solid ${C.teal}40`,borderRadius:10,padding:"10px 14px",marginBottom:10,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
      <span style={{fontSize:12,color:C.tealBright,fontFamily:FH,fontWeight:700}}>🌙 Kurze Rast</span>
      <span style={{fontSize:12,color:C.textDim}}>HP-Betrag:</span>
      <input type="number" min={0} max={char.maxHp} value={shortHpVal} onChange={e=>setShortHpVal(+e.target.value)} style={{...sx.inp,width:72}}/>
      <button onClick={doShortRest} style={sx.btn(C.teal)}>Heilen</button>
      <button onClick={()=>setRestMode(null)} style={sx.bsm(C.textDim)}>✕</button>
    </div>}
    {restMode==="short_done"&&<div style={{background:`${C.teal}10`,border:`1px solid ${C.teal}40`,borderRadius:10,padding:"10px 14px",marginBottom:10,display:"flex",gap:10,alignItems:"center"}}>
      <span style={{fontSize:18}}>🌙</span><span style={{fontSize:14,color:C.tealBright,fontWeight:700}}>Kurze Rast: <span style={{color:C.greenBright}}>+{shortResult?.healed} HP</span></span>
      <button onClick={()=>setRestMode(null)} style={sx.bsm(C.textDim)}>✕</button>
    </div>}
    {restMode==="long_confirm"&&<div style={{background:`${C.purple}10`,border:`1px solid ${C.purple}40`,borderRadius:10,padding:"10px 14px",marginBottom:10}}>
      <div style={{fontSize:13,color:C.purpleBright,fontFamily:FH,fontWeight:700,marginBottom:6}}>🌟 Lange Rast bestätigen</div>
      <div style={{fontSize:12,color:C.textDim,marginBottom:8}}>Stellt wieder her: volle HP · alle Spell Slots · Todeswürfe reset · {Math.max(1,Math.floor(char.level/2))} Hit Dice</div>
      <div style={{display:"flex",gap:8}}><button onClick={doLongRest} style={sx.btn(C.purple)}>🌟 Durchführen</button><button onClick={()=>setRestMode(null)} style={sx.bsm(C.textDim)}>Abbrechen</button></div>
    </div>}
    {restMode==="long_done"&&<div style={{background:`${C.purple}10`,border:`1px solid ${C.purple}40`,borderRadius:10,padding:"10px 14px",marginBottom:10,display:"flex",gap:10,alignItems:"center"}}>
      <span style={{fontSize:18}}>🌟</span><span style={{fontSize:14,color:C.purpleBright,fontWeight:700}}>Lange Rast abgeschlossen! HP voll · Slots zurück</span>
      <button onClick={()=>setRestMode(null)} style={sx.bsm(C.textDim)}>✕</button>
    </div>}

    {/* ROW 1 — Vitalwerte */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
      {/* HP */}
      <div style={{background:`${hpCol}10`,border:`1px solid ${hpCol}30`,borderRadius:12,padding:"10px 14px"}}>
        <div style={{...sx.jb,marginBottom:4}}>
          <span style={{fontFamily:FH,fontSize:10,color:hpCol,letterSpacing:.5}}>❤️ HP</span>
          <span style={{fontSize:10,color:C.textDim}}>Max {char.maxHp}</span>
        </div>
        <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:5}}>
          <input type="number" min={0} max={char.maxHp} value={char.hp}
            onChange={e=>setChar(p=>({...p,hp:Math.max(0,Math.min(p.maxHp,+e.target.value))}))}
            style={{...sx.inp,fontSize:36,fontWeight:900,color:hpCol,padding:0,background:"transparent",border:"none",width:70,lineHeight:1}}/>
          <span style={{fontSize:14,color:C.textDim}}>/ {char.maxHp}</span>
        </div>
        <div style={{background:"rgba(0,0,0,0.3)",borderRadius:8,height:7,overflow:"hidden",marginBottom:7}}>
          <div style={{width:`${Math.max(0,Math.min(100,char.hp/char.maxHp*100))}%`,height:"100%",background:hpCol,borderRadius:8,transition:"width .4s"}}/>
        </div>
        <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
          {[1,5,10].map(n=><button key={`h+${n}`} onClick={()=>setChar(p=>({...p,hp:Math.min(p.maxHp,p.hp+n)}))} style={{...sx.bsm(C.greenBright),fontSize:10,padding:"2px 7px"}}>+{n}</button>)}
          {[1,5,10].map(n=><button key={`h-${n}`} onClick={()=>setChar(p=>({...p,hp:Math.max(0,p.hp-n)}))} style={{...sx.bsm(C.redBright),fontSize:10,padding:"2px 7px"}}>-{n}</button>)}
          <button onClick={()=>setChar(p=>({...p,hp:p.maxHp}))} style={{...sx.bsm(C.teal),fontSize:10,padding:"2px 7px"}}>Max</button>
        </div>
        {char.hp===0&&<div style={{marginTop:8}}>
          <div style={{fontSize:10,color:C.redBright,fontWeight:700,fontFamily:FH,marginBottom:6}}>💀 TODESWÜRFE</div>
          <div style={{display:"flex",gap:10,marginBottom:6}}>
            <div>
              <div style={{fontSize:9,color:C.greenBright,marginBottom:4,fontFamily:FH}}>✔ ERFOLGE</div>
              <div style={{display:"flex",gap:4}}>
                {[0,1,2].map(i=><div key={i} onClick={()=>setChar(p=>({...p,deathSaves:{...p.deathSaves,suc:i<(p.deathSaves?.suc||0)?i:(p.deathSaves?.suc||0)+1}}))}
                  style={{width:26,height:26,borderRadius:"50%",cursor:"pointer",border:`2px solid ${C.greenBright}`,
                    background:i<(char.deathSaves?.suc||0)?C.greenBright:"transparent",
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,transition:"all .2s",
                  }}>{i<(char.deathSaves?.suc||0)?"✔":"○"}</div>)}
              </div>
            </div>
            <div>
              <div style={{fontSize:9,color:C.redBright,marginBottom:4,fontFamily:FH}}>✘ FEHLSCHLÄGE</div>
              <div style={{display:"flex",gap:4}}>
                {[0,1,2].map(i=><div key={i} onClick={()=>setChar(p=>({...p,deathSaves:{...p.deathSaves,fail:i<(p.deathSaves?.fail||0)?i:(p.deathSaves?.fail||0)+1}}))}
                  style={{width:26,height:26,borderRadius:"50%",cursor:"pointer",border:`2px solid ${C.redBright}`,
                    background:i<(char.deathSaves?.fail||0)?C.redBright:"transparent",
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,transition:"all .2s",
                  }}>{i<(char.deathSaves?.fail||0)?"✘":"○"}</div>)}
              </div>
            </div>
            <button onClick={()=>setChar(p=>({...p,deathSaves:{suc:0,fail:0},hp:1}))} style={{...sx.bsm(C.green),alignSelf:"flex-end",fontSize:10}}>↺ 1HP</button>
          </div>
          {(char.deathSaves?.suc||0)>=3&&<div style={{fontSize:11,color:C.greenBright,fontWeight:700}}>✔ Stabil</div>}
          {(char.deathSaves?.fail||0)>=3&&<div style={{fontSize:11,color:C.redBright,fontWeight:700}}>✘ TOD</div>}
        </div>}
      </div>
      {/* Temp HP */}
      <div style={{background:`${C.blueBright}10`,border:`1px solid ${C.blueBright}30`,borderRadius:12,padding:"10px 14px"}}>
        <div style={{...sx.jb,marginBottom:4}}>
          <span style={{fontFamily:FH,fontSize:10,color:C.blueBright,letterSpacing:.5}}>💙 TEMP HP</span>
          <button onClick={()=>setChar(p=>({...p,tempHp:0}))} style={{...sx.bsm(C.textDim),fontSize:9,padding:"1px 5px"}}>✕</button>
        </div>
        <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:5}}>
          <input type="number" min={0} value={char.tempHp||0}
            onChange={e=>setChar(p=>({...p,tempHp:Math.max(0,+e.target.value)}))}
            style={{...sx.inp,fontSize:36,fontWeight:900,color:C.blueBright,padding:0,background:"transparent",border:"none",width:70,lineHeight:1}}/>
        </div>
        <div style={{background:"rgba(0,0,0,0.3)",borderRadius:8,height:7,overflow:"hidden",marginBottom:7}}>
          <div style={{width:`${char.tempHp>0?Math.min(100,(char.tempHp/(char.maxHp||1))*100):0}%`,height:"100%",background:C.blueBright,borderRadius:8,transition:"width .4s"}}/>
        </div>
        <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
          {[1,5].map(n=><button key={`t+${n}`} onClick={()=>setChar(p=>({...p,tempHp:Math.max(0,(p.tempHp||0)+n)}))} style={{...sx.bsm(C.blueBright),fontSize:10,padding:"2px 7px"}}>+{n}</button>)}
          {[1,5].map(n=><button key={`t-${n}`} onClick={()=>setChar(p=>({...p,tempHp:Math.max(0,(p.tempHp||0)-n)}))} style={{...sx.bsm(C.redBright),fontSize:10,padding:"2px 7px"}}>-{n}</button>)}
        </div>
      </div>
    </div>
    {/* ROW 1b — Kampfwerte + Gold + Inspiration kompakt */}
    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10,alignItems:"stretch"}}>
      {[["🛡️","AC",char.ac,C.teal],["⚡","Init",modStr(modOf(char.dex||10)),C.green],["💨","Speed",`${char.speed}ft`,C.blue],["🎖️","PB",`+${pb}`,C.gold]].map(([icon,label,val,col])=>(
        <div key={label} style={{background:`${col}12`,border:`1px solid ${col}25`,borderRadius:10,padding:"8px 12px",textAlign:"center",flex:"1 1 70px",minWidth:70}}>
          <div style={{fontSize:9,color:col,fontFamily:FH,letterSpacing:.5,marginBottom:3}}>{icon} {label}</div>
          <div style={{fontSize:26,fontWeight:900,color:C.textBright,lineHeight:1}}>{val}</div>
        </div>
      ))}
      {/* Gold */}
      <div style={{background:`${C.gold}12`,border:`1px solid ${C.gold}30`,borderRadius:10,padding:"8px 12px",textAlign:"center",flex:"1 1 80px",minWidth:80}}>
        <div style={{fontSize:9,color:C.gold,fontFamily:FH,letterSpacing:.5,marginBottom:3}}>💰 GOLD</div>
        <input type="number" min={0} value={char.gold||0}
          onChange={e=>setChar(p=>({...p,gold:Math.max(0,+e.target.value)}))}
          style={{...sx.inp,textAlign:"center",fontSize:22,fontWeight:900,color:C.gold,padding:0,background:"transparent",border:"none",width:68}}/>
        <div style={{fontSize:8,color:C.goldDim}}>gp</div>
      </div>
      {/* Inspiration */}
      <button onClick={()=>setChar(p=>({...p,inspiration:!p.inspiration}))} style={{
        flex:"0 0 auto",minWidth:76,
        background:char.inspiration?"linear-gradient(135deg,#f0c060,#d97706)":"rgba(0,0,0,0.25)",
        border:`2px solid ${char.inspiration?C.gold:C.border}`,
        borderRadius:10,padding:"8px 6px",cursor:"pointer",textAlign:"center",
        boxShadow:char.inspiration?"0 0 16px rgba(240,192,96,0.35)":"none",transition:"all .3s",
      }}>
        <div style={{fontSize:20}}>{char.inspiration?"✨":"💫"}</div>
        <div style={{fontSize:8,fontFamily:FH,fontWeight:700,color:char.inspiration?"#000":C.textDim,letterSpacing:.5,marginTop:2}}>INSPIRATION</div>
        <div style={{fontSize:7,color:char.inspiration?"#00000099":C.textDim}}>{char.inspiration?"AKTIV":"INAKTIV"}</div>
      </button>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12,marginBottom:12}}>
      {/* LEFT — Ausgerüstet + Conditions */}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>

        {/* Equipped Items */}
        <div style={sx.card}>
          <div style={sx.ct}>⚔️ Ausgerüstete Items</div>
          {equipped.length===0?(
            <div style={{fontSize:12,color:C.textDim,fontStyle:"italic"}}>Keine Items ausgestattet (Charakter → Ausrüstung)</div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {equipped.map(({slot,item})=>{
                const col=RC[item.rar]||C.textDim;
                return(<div key={slot} style={{display:"flex",alignItems:"center",gap:8,background:`${col}0c`,border:`1px solid ${col}25`,borderLeft:`3px solid ${col}`,borderRadius:8,padding:"6px 10px"}}>
                  <span style={{fontSize:16}}>{TYPE_ICON[item.type]||"📦"}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:FH,fontSize:12,color:C.textBright,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>
                    <div style={{fontSize:10,color:C.textDim}}>{SLOT_NAMES[slot]||slot}</div>
                  </div>
                  <div style={{display:"flex",gap:4,flexShrink:0}}>
                    {item.dmg&&item.dmg!=="—"&&<span style={sx.tag(C.red)}>⚔️{item.dmg}</span>}
                    {item.ac&&<span style={sx.tag(C.blue)}>🛡️{item.ac}</span>}
                    {item.eff&&<span style={sx.tag(C.green)}>✨{item.eff}</span>}
                  </div>
                </div>);
              })}
            </div>
          )}
        </div>

        {/* Active Conditions */}
        <div style={sx.card}>
          <div style={sx.ct}>⚡ Aktive Conditions
            {activeCss.length>0&&<span style={{...sx.tag(C.red),marginLeft:8}}>{activeCss.length}</span>}
          </div>
          {activeCss.length===0?(
            <div style={{fontSize:12,color:C.textDim,fontStyle:"italic"}}>Keine aktiven Conditions</div>
          ):(
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {activeCss.map(c=>(
                <div key={c.id} style={{background:`${C.red}18`,border:`1px solid ${C.red}44`,borderRadius:8,padding:"6px 10px",display:"flex",alignItems:"center",gap:6,cursor:"pointer"}} onClick={()=>setActiveConds(p=>p.filter(x=>x!==c.id))}>
                  <span style={{fontSize:14}}>{c.icon}</span>
                  <div>
                    <div style={{fontSize:12,color:C.redBright,fontWeight:700,fontFamily:FH}}>{c.name}</div>
                    <div style={{fontSize:10,color:C.textDim,maxWidth:160,lineHeight:1.3}}>{c.desc.slice(0,60)}{c.desc.length>60?"...":""}</div>
                  </div>
                  <span style={{fontSize:10,color:C.textDim,marginLeft:2}}>✕</span>
                </div>
              ))}
            </div>
          )}
          <div style={{marginTop:8,display:"flex",flexWrap:"wrap",gap:4}}>
            {CONDITIONS.filter(c=>!activeConds.includes(c.id)).map(c=>(
              <button key={c.id} onClick={()=>setActiveConds(p=>[...p,c.id])} style={{...sx.bsm(C.textDim),fontSize:10,padding:"2px 8px"}} title={c.desc}>{c.icon} {c.name}</button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — Spells + Cantrips */}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>

        {/* Vorbereitete Zauber */}
        <div style={sx.card}>
          <div style={sx.ct}>🔮 Vorbereitete Zauber
            <span style={{...sx.tag(C.purple),marginLeft:8}}>{preparedSpells.length}</span>
          </div>
          {preparedSpells.length===0?(
            <div style={{fontSize:12,color:C.textDim,fontStyle:"italic"}}>Keine Zauber vorbereitet (Charakter → Spellbook → 🕯️)</div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              {preparedSpells.map(sp=>(
                <div key={sp.id} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 8px",background:`${C.purple}0a`,borderRadius:7,border:`1px solid ${C.purple}20`}}>
                  <span style={{fontSize:11,background:SC2[sp.lv-1]||C.purple,borderRadius:8,padding:"1px 7px",color:"#fff",fontWeight:700,fontFamily:FH,whiteSpace:"nowrap"}}>{SLOT_LABELS[sp.lv]}</span>
                  <span style={{fontSize:13,color:C.textBright,fontFamily:FH,fontWeight:600,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sp.name}</span>
                  <span style={{fontSize:10,color:C.textDim}}>{sp.school}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cantrips */}
        <div style={sx.card}>
          <div style={sx.ct}>✨ Cantrips
            <span style={{...sx.tag(C.teal),marginLeft:8}}>{cantrips.length}</span>
          </div>
          {cantrips.length===0?(
            <div style={{fontSize:12,color:C.textDim,fontStyle:"italic"}}>Keine Cantrips bekannt (Charakter → Spellbook → ★)</div>
          ):(
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {cantrips.map(sp=>(
                <div key={sp.id} style={{...sx.tag(C.teal),fontFamily:FH,fontSize:11,cursor:"default"}} title={sp.desc}>{sp.name}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

    {/* ROW 3 — Spell Slots + Tokens */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12}}>

      {/* Spell Slots */}
      <div style={sx.card}>
        <div style={{...sx.jb,marginBottom:10}}>
          <div style={sx.ct}>🔮 Spell Slots</div>
          <button onClick={()=>setSlots(p=>p.map(s=>({...s,used:0})))} style={sx.bsm(C.gold)}>↺ Alle zurück</button>
        </div>
        {slots.filter(sl=>sl.tot>0).map((sl,si)=>(
          <div key={sl.lv} style={{marginBottom:8}}>
            <div style={{...sx.jb,marginBottom:3}}>
              <span style={{fontSize:11,color:C.textBright,fontFamily:FH}}>{sl.lbl}</span>
              <span style={{fontSize:10,color:C.textDim}}>{sl.tot-sl.used}/{sl.tot}</span>
            </div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {Array.from({length:sl.tot}).map((_,i)=>(
                <div key={i} onClick={()=>setSlots(p=>p.map(x=>x.lv===sl.lv?{...x,used:i<x.used?i:i+1}:x))} style={{
                  width:22,height:22,borderRadius:"50%",cursor:"pointer",
                  background:i<sl.used?"rgba(0,0,0,0.5)":SC2[si]+"cc",
                  border:`2px solid ${i<sl.used?"rgba(255,255,255,0.1)":SC2[si]}`,
                  transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:10,color:i<sl.used?"rgba(255,255,255,0.2)":"#fff",
                  boxShadow:i>=sl.used?`0 0 6px ${SC2[si]}44`:"none",
                }}>{i<sl.used?"×":"◆"}</div>
              ))}
            </div>
          </div>
        ))}
        {slots.every(s=>s.tot===0)&&<div style={{fontSize:12,color:C.textDim,fontStyle:"italic"}}>Keine Spell Slots konfiguriert (Charakter → Tokens)</div>}
      </div>

      {/* Custom Tokens */}
      <div style={sx.card}>
        <div style={{...sx.jb,marginBottom:10}}>
          <div style={sx.ct}>🏷️ Ressourcen</div>
          <button onClick={()=>setCustom(p=>p.map(t=>({...t,used:0})))} style={sx.bsm(C.gold)}>↺ Alle zurück</button>
        </div>
        {custom.length===0?(
          <div style={{fontSize:12,color:C.textDim,fontStyle:"italic"}}>Keine Ressourcen (Charakter → Tokens)</div>
        ):(
          custom.map(tok=>(
            <div key={tok.id} style={{marginBottom:10}}>
              <div style={{...sx.jb,marginBottom:4}}>
                <span style={{fontSize:12,color:tok.color,fontFamily:FH,fontWeight:700}}>{tok.name}{tok.tier&&<span style={{color:C.textDim,fontWeight:400,fontSize:10}}> ({tok.tier})</span>}</span>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <span style={{fontSize:10,color:C.textDim}}>{tok.tot-tok.used}/{tok.tot}</span>
                  <button onClick={()=>setCustom(p=>p.map(t=>t.id===tok.id?{...t,used:0}:t))} style={sx.bsm(C.goldDim)}>↺</button>
                </div>
              </div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                {Array.from({length:tok.tot}).map((_,i)=>(
                  <div key={i} onClick={()=>setCustom(p=>p.map(t=>t.id===tok.id?{...t,used:i<t.used?i:i+1}:t))} style={{
                    width:24,height:24,borderRadius:5,cursor:"pointer",
                    background:i<tok.used?"rgba(0,0,0,0.5)":tok.color+"99",
                    border:`2px solid ${i<tok.used?"rgba(255,255,255,0.1)":tok.color}`,
                    transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,
                  }}>{i<tok.used?"✗":"●"}</div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>

    {/* AKTIONEN — ganz unten */}
    {(()=>{
      const actions=char.actions||[];
      const pinned=char.pinnedActionIds||[];
      const pinnedActions=actions.filter(a=>pinned.includes(a.id));
      const ACT_TYPES=[{id:"action",label:"Aktion",icon:"⚔️",col:C.red},{id:"bonus",label:"Bonus-Aktion",icon:"⚡",col:C.amber},{id:"reaction",label:"Reaktion",icon:"🛡️",col:C.blue}];
      return(<div style={{...sx.card,marginTop:12}}>
        <div style={sx.ct}>
          ⚔️ Aktionen
          <span style={{...sx.tag(C.red),marginLeft:8,fontSize:10}}>{pinnedActions.length}</span>
          <span style={{float:"right",fontSize:11,color:C.textDim,fontWeight:400}}>(Pin im Aktionen-Tab mit 📌)</span>
        </div>
        {pinnedActions.length===0?(
          <div style={{fontSize:12,color:C.textDim,fontStyle:"italic"}}>Keine Aktionen gepinnt. Im Charakter → ⚔️ Aktionen → 📌 klicken.</div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10}}>
            {ACT_TYPES.map(({id,label,icon,col})=>{
              const grp=pinnedActions.filter(a=>a.type===id);
              return(<div key={id}>
                <div style={{fontSize:11,color:col,fontFamily:FH,fontWeight:700,marginBottom:6,letterSpacing:.5,borderBottom:`1px solid ${col}25`,paddingBottom:4}}>{icon} {label} <span style={{opacity:.6}}>({grp.length})</span></div>
                {grp.length===0?<div style={{fontSize:11,color:C.textDim,fontStyle:"italic"}}>—</div>:(
                  grp.map(action=>(
                    <div key={action.id} style={{background:`${col}0a`,border:`1px solid ${col}25`,borderLeft:`3px solid ${col}`,borderRadius:7,padding:"6px 9px",marginBottom:5}}>
                      <div style={{fontFamily:FH,fontSize:12,color:C.textBright,fontWeight:700,marginBottom:2}}>{action.name}</div>
                      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:action.description?3:0}}>
                        {action.range&&action.range!=="—"&&<span style={sx.tag(col)}>{action.range}</span>}
                        {action.toHit&&<span style={sx.tag(col)}>🎯{action.toHit}</span>}
                        {action.damage&&action.damage!=="—"&&<span style={sx.tag(col)}>💥{action.damage}</span>}
                        {action.saveDC&&<span style={sx.tag(col)}>⚡{action.saveDC} {action.saveAbility}</span>}
                      </div>
                      {action.description&&<div style={{fontSize:11,color:C.textDim,lineHeight:1.4}}>{action.description.slice(0,80)}{action.description.length>80?"...":""}</div>}
                    </div>
                  ))
                )}
              </div>);
            })}
          </div>
        )}
      </div>);
    })()}
  </div>);
}

/* ══════════ ITEMS LISTE ══════════ */
function ItemsList(){
  const[items,setItems]=usePersist("items_list_v1",[
    {id:1,name:"Heiltrank",type:"Potion",rar:"Common",desc:"Stellt 2d4+2 HP wieder her. Als Bonus-Aktion trinken.",qty:3,value:"50 gp",weight:"0.5 lb",notes:"",custom:false},
    {id:2,name:"Seil (50ft)",type:"Gear",rar:"Common",desc:"Hanfseil, traegt bis zu 300 Pfund.",qty:1,value:"1 gp",weight:"10 lb",notes:"",custom:false},
    {id:3,name:"Enterhaken",type:"Gear",rar:"Common",desc:"Zum Klettern, wird mit Seil verwendet.",qty:1,value:"2 gp",weight:"4 lb",notes:"",custom:false},
  ]);
  const[search,setSearch]=useState("");
  const[typeFilter,setTypeFilter]=useState("Alle");
  const[sel,setSel]=useState(null);
  const[showForm,setShowForm]=useState(false);
  const[form,setForm]=useState({name:"",type:"Gear",rar:"Common",desc:"",qty:1,value:"",weight:"",notes:""});
  const TYPES=["Alle","Weapon","Armor","Potion","Gear","Magic","Scroll","Ring","Wand","Tool","Mount","Other"];
  const RC={Common:C.textDim,Uncommon:"#00c040",Rare:"#3b82f6","Very Rare":"#a855f7",Legendary:"#f59e0b"};
  const TYPE_ICON={Weapon:"⚔️",Armor:"🛡️",Potion:"🧪",Gear:"🎒",Magic:"✨",Scroll:"📜",Ring:"💍",Wand:"🪄",Tool:"🔧",Mount:"🐴",Other:"📦"};

  const filtered=items.filter(i=>(typeFilter==="Alle"||i.type===typeFilter)&&(i.name.toLowerCase().includes(search.toLowerCase())||i.type.toLowerCase().includes(search.toLowerCase())));
  const save=()=>{
    if(!form.name)return;
    if(sel&&sel.custom){setItems(p=>p.map(i=>i.id===sel.id?{...form,id:sel.id,custom:true}:i));setSel({...form,id:sel.id,custom:true});}
    else{const n={...form,id:Date.now(),custom:true};setItems(p=>[...p,n]);setSel(n);}
    setShowForm(false);
  };
  const del=id=>{setItems(p=>p.filter(i=>i.id!==id));setSel(null);};

  const mob=useMobile();
  return(<div style={{display:"flex",gap:14,flexDirection:mob?"column":"row"}}>
    <div style={{width:mob?"100%":240,flexShrink:0,display:"flex",flexDirection:"column",gap:6}}>
      <button onClick={()=>{setForm({name:"",type:"Gear",rar:"Common",desc:"",qty:1,value:"",weight:"",notes:""});setSel(null);setShowForm(true);}} style={{...sx.btn(C.green),width:"100%"}}>+ Neues Item</button>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Suchen..." style={sx.inp}/>
      <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} style={sx.sel}>
        {TYPES.map(t=><option key={t}>{t}</option>)}
      </select>
      <div style={{fontSize:11,color:C.textDim,marginLeft:2}}>{filtered.length} Items</div>
      <div style={{flex:1,overflowY:"auto",maxHeight:"70vh",display:"flex",flexDirection:"column",gap:4}}>
        {filtered.map(item=>{
          const col=RC[item.rar]||C.textDim;
          const active=sel?.id===item.id;
          return(<div key={item.id} onClick={()=>{setSel(item);setShowForm(false);}} style={{background:active?`${col}18`:C.surface,border:`1px solid ${active?col:C.border}`,borderLeft:`3px solid ${col}`,borderRadius:8,padding:"8px 10px",cursor:"pointer",transition:"all .15s"}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:14}}>{TYPE_ICON[item.type]||"📦"}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:FH,fontSize:12,color:active?col:C.textBright,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>
                <div style={{fontSize:10,color:C.textDim}}>{item.type} · <span style={{color:col}}>{item.rar}</span>{item.qty>1&&<span style={{color:C.blue}}> ×{item.qty}</span>}</div>
              </div>
            </div>
          </div>);
        })}
      </div>
    </div>

    <div style={{flex:1}}>
      {showForm&&<div style={sx.card}>
        <div style={sx.ct}>{sel?.custom?"Item bearbeiten":"Neues Item"}</div>
        <div style={sx.g3}>
          <div style={{gridColumn:"1/3"}}><label style={sx.lbl}>Name</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} style={sx.inp} placeholder="Item-Name"/></div>
          <div><label style={sx.lbl}>Typ</label><select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} style={sx.sel}>{TYPES.slice(1).map(t=><option key={t}>{t}</option>)}</select></div>
          <div><label style={sx.lbl}>Seltenheit</label><select value={form.rar} onChange={e=>setForm(p=>({...p,rar:e.target.value}))} style={sx.sel}>{["Common","Uncommon","Rare","Very Rare","Legendary"].map(r=><option key={r}>{r}</option>)}</select></div>
          <div><label style={sx.lbl}>Anzahl</label><input type="number" min={1} value={form.qty} onChange={e=>setForm(p=>({...p,qty:+e.target.value}))} style={sx.inp}/></div>
          <div><label style={sx.lbl}>Wert</label><input value={form.value} onChange={e=>setForm(p=>({...p,value:e.target.value}))} style={sx.inp} placeholder="50 gp"/></div>
          <div><label style={sx.lbl}>Gewicht</label><input value={form.weight} onChange={e=>setForm(p=>({...p,weight:e.target.value}))} style={sx.inp} placeholder="1 lb"/></div>
        </div>
        <div style={{marginTop:8}}><label style={sx.lbl}>Beschreibung</label><textarea value={form.desc} onChange={e=>setForm(p=>({...p,desc:e.target.value}))} style={{...sx.ta,height:70}} placeholder="Effekte, Eigenschaften, Beschreibung..."/></div>
        <div style={{marginTop:6}}><label style={sx.lbl}>Eigene Notizen</label><textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} style={{...sx.ta,height:48}} placeholder="Fundort, Kaufpreis, Besonderheiten..."/></div>
        <div style={{display:"flex",gap:8,marginTop:12}}>
          <button onClick={save} style={sx.btn(C.green)}>Speichern</button>
          <button onClick={()=>setShowForm(false)} style={sx.btn(C.textDim)}>Abbrechen</button>
        </div>
      </div>}

      {sel&&!showForm&&<div style={sx.card}>
        <div style={{...sx.jb,marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:28}}>{TYPE_ICON[sel.type]||"📦"}</span>
            <div>
              <div style={{fontFamily:FH,fontSize:20,color:RC[sel.rar]||C.gold,fontWeight:700}}>{sel.name}</div>
              <div style={{fontSize:12,color:C.textDim}}>{sel.type} · <span style={{color:RC[sel.rar]||C.textDim}}>{sel.rar}</span></div>
            </div>
          </div>
          <div style={{display:"flex",gap:6}}>
            <button onClick={()=>{setForm({...sel});setShowForm(true);}} style={sx.bsm(C.gold)}>✎ Bearbeiten</button>
            {sel.custom&&<button onClick={()=>del(sel.id)} style={sx.bsm(C.red)}>🗑 Loeschen</button>}
          </div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
          {sel.qty>1&&<span style={sx.tag(C.blue)}>×{sel.qty}</span>}
          {sel.value&&<span style={sx.tag(C.gold)}>💰 {sel.value}</span>}
          {sel.weight&&<span style={sx.tag(C.textDim)}>⚖️ {sel.weight}</span>}
        </div>
        {sel.desc&&<div style={{fontSize:14,color:C.text,lineHeight:1.7,marginBottom:sel.notes?10:0}}>{sel.desc}</div>}
        {sel.notes&&<div style={{background:"rgba(255,255,255,0.04)",border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px",fontSize:13,color:C.textDim,lineHeight:1.6,fontStyle:"italic"}}>{sel.notes}</div>}
      </div>}

      {!sel&&!showForm&&<div style={{...sx.card,textAlign:"center",color:C.textDim,padding:48}}>
        <div style={{fontSize:40,marginBottom:10}}>📦</div>
        <div style={{fontSize:15,marginBottom:4}}>Item aus der Liste waehlen</div>
        <div style={{fontSize:12}}>oder "+ Neues Item" erstellen</div>
      </div>}
    </div>
  </div>);
}

/* ══════════ NPC LISTE ══════════ */
function NpcList(){
  const[npcs,setNpcs]=usePersist("npc_list_v1",[
    {id:1,name:"Tavil, der Wirt",role:"Wirt",location:"Zum Goldenen Pfeil",race:"Mensch",alignment:"Neutral Gut",status:"lebendig",attitude:"freundlich",desc:"Ein grossgewachsener, kahlkoepfiger Mann mit weissem Bart. Fuehrt die Taverne seit 30 Jahren.",notes:"Kennt viele Geruechte. Tochter ist verschwunden.",custom:false},
    {id:2,name:"Lady Mira Ashveil",role:"Stadtvogt",location:"Hafenstadt Silverton",race:"Mensch",alignment:"Rechtschaffen Neutral",status:"lebendig",attitude:"neutral",desc:"Strenge Buergerin, mittleres Alter, immer in formellen Gewaendern. Misstrauisch gegenueber Abenteurern.",notes:"Hat Verbindungen zur Gilde. Verdaechtig.",custom:false},
  ]);
  const[search,setSearch]=useState("");
  const[attFilter,setAttFilter]=useState("Alle");
  const[sel,setSel]=useState(null);
  const[showForm,setShowForm]=useState(false);
  const blank={name:"",role:"",location:"",race:"",alignment:"",status:"lebendig",attitude:"neutral",desc:"",notes:""};
  const[form,setForm]=useState(blank);

  const ATT_COL={freundlich:C.greenBright,neutral:C.textDim,feindlich:C.redBright,unbekannt:C.amber};
  const ATT_ICON={freundlich:"💚",neutral:"⚪",feindlich:"❤️",unbekannt:"❓"};
  const STATUS_COL={lebendig:C.greenBright,tot:C.redBright,unbekannt:C.textDim,gefangen:C.amber};

  const filtered=npcs.filter(n=>(attFilter==="Alle"||n.attitude===attFilter)&&(n.name.toLowerCase().includes(search.toLowerCase())||n.role.toLowerCase().includes(search.toLowerCase())||n.location.toLowerCase().includes(search.toLowerCase())));

  const save=()=>{
    if(!form.name)return;
    if(sel&&sel.custom){setNpcs(p=>p.map(n=>n.id===sel.id?{...form,id:sel.id,custom:true}:n));setSel({...form,id:sel.id,custom:true});}
    else{const n={...form,id:Date.now(),custom:true};setNpcs(p=>[...p,n]);setSel(n);}
    setShowForm(false);
  };
  const del=id=>{setNpcs(p=>p.filter(n=>n.id!==id));setSel(null);};

  const mob=useMobile();
  return(<div style={{display:"flex",gap:14,flexDirection:mob?"column":"row"}}>
    <div style={{width:mob?"100%":240,flexShrink:0,display:"flex",flexDirection:"column",gap:6}}>
      <button onClick={()=>{setForm(blank);setSel(null);setShowForm(true);}} style={{...sx.btn(C.purple),width:"100%"}}>+ Neuer NPC</button>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Name, Rolle, Ort..." style={sx.inp}/>
      <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
        {["Alle","freundlich","neutral","feindlich","unbekannt"].map(a=>(
          <button key={a} onClick={()=>setAttFilter(a)} style={{...sx.bsm(ATT_COL[a]||C.textDim),fontWeight:attFilter===a?700:400,background:attFilter===a?`${ATT_COL[a]||C.textDim}22`:`${ATT_COL[a]||C.textDim}08`}}>{ATT_ICON[a]||"📋"} {a}</button>
        ))}
      </div>
      <div style={{fontSize:11,color:C.textDim,marginLeft:2}}>{filtered.length} NPCs</div>
      <div style={{flex:1,overflowY:"auto",maxHeight:"68vh",display:"flex",flexDirection:"column",gap:4}}>
        {filtered.map(npc=>{
          const col=ATT_COL[npc.attitude]||C.textDim;
          const active=sel?.id===npc.id;
          return(<div key={npc.id} onClick={()=>{setSel(npc);setShowForm(false);}} style={{background:active?`${col}18`:C.surface,border:`1px solid ${active?col:C.border}`,borderLeft:`3px solid ${col}`,borderRadius:8,padding:"8px 10px",cursor:"pointer",transition:"all .15s"}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:16}}>{ATT_ICON[npc.attitude]||"👤"}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:FH,fontSize:12,color:active?col:C.textBright,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{npc.name}</div>
                <div style={{fontSize:10,color:C.textDim,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{npc.role}{npc.location&&` · ${npc.location}`}</div>
              </div>
              <span style={{fontSize:9,color:STATUS_COL[npc.status]||C.textDim,fontWeight:700,whiteSpace:"nowrap"}}>{npc.status}</span>
            </div>
          </div>);
        })}
      </div>
    </div>

    <div style={{flex:1}}>
      {showForm&&<div style={sx.card}>
        <div style={sx.ct}>{sel?.custom?"NPC bearbeiten":"Neuer NPC"}</div>
        <div style={sx.g3}>
          <div style={{gridColumn:"1/3"}}><label style={sx.lbl}>Name</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} style={sx.inp} placeholder="Name des NPC"/></div>
          <div><label style={sx.lbl}>Rolle / Beruf</label><input value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))} style={sx.inp} placeholder="Wirt, Haendler..."/></div>
          <div><label style={sx.lbl}>Ort</label><input value={form.location} onChange={e=>setForm(p=>({...p,location:e.target.value}))} style={sx.inp} placeholder="Stadt, Taverne..."/></div>
          <div><label style={sx.lbl}>Rasse</label><input value={form.race} onChange={e=>setForm(p=>({...p,race:e.target.value}))} style={sx.inp} placeholder="Mensch, Elf..."/></div>
          <div><label style={sx.lbl}>Gesinnung</label><input value={form.alignment} onChange={e=>setForm(p=>({...p,alignment:e.target.value}))} style={sx.inp} placeholder="Rechtsch. Gut..."/></div>
          <div><label style={sx.lbl}>Status</label>
            <select value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))} style={sx.sel}>
              {["lebendig","tot","unbekannt","gefangen"].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div><label style={sx.lbl}>Einstellung</label>
            <select value={form.attitude} onChange={e=>setForm(p=>({...p,attitude:e.target.value}))} style={sx.sel}>
              {["freundlich","neutral","feindlich","unbekannt"].map(a=><option key={a}>{a}</option>)}
            </select>
          </div>
        </div>
        <div style={{marginTop:8}}><label style={sx.lbl}>Beschreibung / Aussehen</label><textarea value={form.desc} onChange={e=>setForm(p=>({...p,desc:e.target.value}))} style={{...sx.ta,height:80}} placeholder="Aussehen, Persoenlichkeit, Besonderheiten..."/></div>
        <div style={{marginTop:6}}><label style={sx.lbl}>DM-Notizen / Plot-Verbindungen</label><textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} style={{...sx.ta,height:60}} placeholder="Geheimnis, Verbindungen, Quest-Relevanz..."/></div>
        <div style={{display:"flex",gap:8,marginTop:12}}>
          <button onClick={save} style={sx.btn(C.green)}>Speichern</button>
          <button onClick={()=>setShowForm(false)} style={sx.btn(C.textDim)}>Abbrechen</button>
        </div>
      </div>}

      {sel&&!showForm&&<div style={sx.card}>
        <div style={{...sx.jb,marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:32}}>{ATT_ICON[sel.attitude]||"👤"}</span>
            <div>
              <div style={{fontFamily:FH,fontSize:20,color:ATT_COL[sel.attitude]||C.gold,fontWeight:700}}>{sel.name}</div>
              <div style={{fontSize:12,color:C.textDim}}>{sel.role}{sel.location&&<span> · {sel.location}</span>}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:6}}>
            <button onClick={()=>{setForm({...sel});setShowForm(true);}} style={sx.bsm(C.gold)}>✎ Bearbeiten</button>
            {sel.custom&&<button onClick={()=>del(sel.id)} style={sx.bsm(C.red)}>🗑 Loeschen</button>}
          </div>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
          {sel.race&&<span style={sx.tag(C.purple)}>🧬 {sel.race}</span>}
          {sel.alignment&&<span style={sx.tag(C.blue)}>⚖️ {sel.alignment}</span>}
          <span style={{...sx.tag(STATUS_COL[sel.status]||C.textDim)}}>● {sel.status}</span>
          <span style={{...sx.tag(ATT_COL[sel.attitude]||C.textDim)}}>{ATT_ICON[sel.attitude]} {sel.attitude}</span>
        </div>
        {sel.desc&&<div style={{fontSize:14,color:C.text,lineHeight:1.75,marginBottom:sel.notes?12:0}}>{sel.desc}</div>}
        {sel.notes&&<div style={{background:`${C.purple}0a`,border:`1px solid ${C.purple}25`,borderRadius:8,padding:"10px 12px",fontSize:13,color:C.textDim,lineHeight:1.6,borderLeft:`3px solid ${C.purple}`}}>
          <div style={{fontSize:10,color:C.purple,fontFamily:FH,fontWeight:700,marginBottom:4}}>DM-NOTIZEN</div>
          {sel.notes}
        </div>}
      </div>}

      {!sel&&!showForm&&<div style={{...sx.card,textAlign:"center",color:C.textDim,padding:48}}>
        <div style={{fontSize:40,marginBottom:10}}>👥</div>
        <div style={{fontSize:15,marginBottom:4}}>NPC aus der Liste waehlen</div>
        <div style={{fontSize:12}}>oder "+ Neuer NPC" erstellen</div>
      </div>}
    </div>
  </div>);
}

/* ══════ KLASSEN & VÖLKER REFERENZ ══════ */
function KlassenRef(){
  const mob=useMobile();
  const[sel,setSel]=useState(null);
  const CL_COL={Barbar:"#dc2626",Barde:"#a78bfa",Druide:"#4ade80",Hexenmeister:"#9d174d",Kämpfer:"#0d9488",Kleriker:"#f59e0b",Magier:"#60a5fa",Mönch:"#fb923c",Paladin:"#fde68a",Schurke:"#9ca3af",Waldläufer:"#22c55e",Zauberer:"#e879f9",Magieschmied:"#38bdf8"};
  return(<div style={{display:"flex",gap:12,flexDirection:mob?"column":"row"}}>
    <div style={{width:mob?"100%":190,flexShrink:0,display:"flex",flexDirection:"column",gap:3}}>
      <div style={{fontSize:10,color:C.textDim,fontFamily:FH,letterSpacing:1,marginBottom:6,paddingBottom:6,borderBottom:`1px solid ${C.border}`}}>
        {D3_KLASSEN.length} KLASSEN · <a href="https://www.dnddeutsch.de/klassen-und-archetypen/" target="_blank" rel="noreferrer" style={{color:C.purpleBright,textDecoration:"none"}}>dnddeutsch.de ↗</a>
      </div>
      {D3_KLASSEN.map(k=>{
        const col=CL_COL[k.name]||C.purpleBright;
        const active=sel?.id===k.id;
        return(<button key={k.id} onClick={()=>setSel(k)} style={{
          background:active?`${col}22`:"transparent",border:`1px solid ${active?col:C.border}`,borderLeft:`3px solid ${col}`,
          borderRadius:7,padding:"6px 10px",cursor:"pointer",textAlign:"left",
          color:active?col:C.textBright,fontFamily:FH,fontSize:12,fontWeight:active?700:400,transition:"all .15s",display:"flex",alignItems:"center",gap:7,
        }}>
          <span style={{fontSize:15,flexShrink:0}}>{k.icon}</span>
          <div>
            <div>{k.name}</div>
            <div style={{fontSize:9,color:C.textDim,fontWeight:400,marginTop:1}}>HD {k.hd} · {k.saves}</div>
          </div>
        </button>);
      })}
    </div>
    <div style={{flex:1}}>
      {sel?(<div>
        <div style={{...sx.card,background:`linear-gradient(135deg,${CL_COL[sel.name]||C.purple}12,rgba(0,0,0,0.2))`}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
            <span style={{fontSize:36}}>{sel.icon}</span>
            <div>
              <div style={{fontFamily:FH,fontSize:20,color:CL_COL[sel.name]||C.gold,fontWeight:700}}>{sel.name}</div>
              <a href={sel.srd} target="_blank" rel="noreferrer" style={{fontSize:11,color:C.purpleBright,textDecoration:"none"}}>→ SRD auf dnddeutsch.de</a>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:7,marginBottom:8}}>
            {[["🎲 HD",sel.hd],["⭐ Primär",sel.primary],["💾 Saves",sel.saves],["🛡️ Rüstungen",sel.armor],["⚔️ Waffen",sel.weapons],["🔧 Werkzeuge",sel.tools]].map(([lbl,val])=>(
              <div key={lbl} style={{background:"rgba(255,255,255,0.04)",borderRadius:7,padding:"6px 10px"}}>
                <div style={{fontSize:9,color:C.textDim,fontFamily:FH,letterSpacing:.5,marginBottom:2}}>{lbl}</div>
                <div style={{fontSize:12,color:C.textBright}}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{background:"rgba(255,255,255,0.04)",borderRadius:7,padding:"6px 10px"}}>
            <div style={{fontSize:9,color:C.textDim,fontFamily:FH,letterSpacing:.5,marginBottom:2}}>🎯 FERTIGKEITEN</div>
            <div style={{fontSize:12,color:C.textBright}}>{sel.skills}</div>
          </div>
        </div>
        <div style={sx.card}>
          <div style={sx.ct}>🏰 Archetypen ({sel.archetypes.length})</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            {sel.archetypes.map(a=><span key={a} style={{...sx.tag(CL_COL[sel.name]||C.purple),fontFamily:FH,fontSize:11}}>{a}</span>)}
          </div>
        </div>
        <div style={sx.card}>
          <div style={sx.ct}>📋 Merkmale (Auszug)</div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead><tr>{sel.tableHead.map(h=><th key={h} style={{textAlign:"left",padding:"4px 7px",color:CL_COL[sel.name]||C.gold,fontFamily:FH,fontSize:10,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
              <tbody>{sel.table.map((row,i)=><tr key={i} style={{background:i%2===0?"rgba(255,255,255,0.02)":"transparent"}}>{row.map((cell,j)=><td key={j} style={{padding:"4px 7px",color:j===row.length-1?C.text:C.textBright,borderBottom:`1px solid rgba(255,255,255,0.04)`,lineHeight:1.5}}>{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </div>
      </div>):(
        <div style={{...sx.card,textAlign:"center",color:C.textDim,padding:48}}>
          <div style={{fontSize:40,marginBottom:10}}>⚔️</div>
          <div style={{fontSize:15,fontFamily:FH,color:C.textBright,marginBottom:6}}>D&D 5e Klassen</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center",marginTop:10}}>
            {D3_KLASSEN.map(k=><span key={k.id} onClick={()=>setSel(k)} style={{...sx.tag(CL_COL[k.name]||C.purple),cursor:"pointer",fontFamily:FH,fontSize:11}}>{k.icon} {k.name}</span>)}
          </div>
        </div>
      )}
    </div>
  </div>);
}

function VoelkerRef(){
  const mob=useMobile();
  const[sel,setSel]=useState(null);
  const RACE_COL={Mensch:"#c9a84c",Elf:"#4ade80",Hochelf:"#60a5fa",Waldelfe:"#22c55e","Dunkelelf (Drow)":"#a78bfa",Zwerg:"#fb923c",Bergzwerg:"#f97316",Hügelzwerg:"#d97706",Halbling:"#34d399",Halbork:"#dc2626",Halbelfe:"#c084fc",Tiefling:"#f472b6","Drachen-Geborener":"#ef4444",Gnom:"#38bdf8",Aarakocra:"#a3e635","Tiefling (Varianten)":"#e879f9",Aasimar:"#fde68a","Wasserkind (Genasi)":"#06b6d4",Triton:"#3b82f6","Yuan-ti Pureblood":"#4ade80"};
  const RACE_ICON={Mensch:"👤",Elf:"🧝",Hochelf:"🔮",Waldelfe:"🌿","Dunkelelf (Drow)":"🕷️",Zwerg:"⛏️",Bergzwerg:"🏔️",Hügelzwerg:"🍄",Halbling:"🍀",Halbork:"⚔️",Halbelfe:"✨",Tiefling:"😈","Drachen-Geborener":"🐉",Gnom:"🔧",Aarakocra:"🦅","Tiefling (Varianten)":"🌑",Aasimar:"👼","Wasserkind (Genasi)":"💧",Triton:"🌊","Yuan-ti Pureblood":"🐍"};
  return(<div style={{display:"flex",gap:12,flexDirection:mob?"column":"row"}}>
    <div style={{width:mob?"100%":190,flexShrink:0,display:"flex",flexDirection:"column",gap:3}}>
      <div style={{fontSize:10,color:C.textDim,fontFamily:FH,letterSpacing:1,marginBottom:6,paddingBottom:6,borderBottom:`1px solid ${C.border}`}}>{DND_RACES.length} VÖLKER · D&D 5e</div>
      {DND_RACES.map(r=>{
        const col=RACE_COL[r.name]||C.purpleBright;
        const active=sel?.name===r.name;
        return(<button key={r.name} onClick={()=>setSel(r)} style={{
          background:active?`${col}22`:"transparent",border:`1px solid ${active?col:C.border}`,borderLeft:`3px solid ${col}`,
          borderRadius:7,padding:"6px 10px",cursor:"pointer",textAlign:"left",
          color:active?col:C.textBright,fontFamily:FH,fontSize:12,fontWeight:active?700:400,transition:"all .15s",display:"flex",alignItems:"center",gap:7,
        }}>
          <span style={{fontSize:14,flexShrink:0}}>{RACE_ICON[r.name]||"🧬"}</span>
          <div>
            <div>{r.name}</div>
            <div style={{fontSize:9,color:C.textDim,fontWeight:400,marginTop:1}}>{r.size} · {r.speed}ft</div>
          </div>
        </button>);
      })}
    </div>
    <div style={{flex:1}}>
      {sel?(<div>
        <div style={{...sx.card,background:`linear-gradient(135deg,${RACE_COL[sel.name]||C.purple}12,rgba(0,0,0,0.2))`}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
            <span style={{fontSize:36}}>{RACE_ICON[sel.name]||"🧬"}</span>
            <div>
              <div style={{fontFamily:FH,fontSize:20,color:RACE_COL[sel.name]||C.gold,fontWeight:700}}>{sel.name}</div>
              <div style={{display:"flex",gap:6,marginTop:4}}>
                <span style={sx.tag(RACE_COL[sel.name]||C.purple)}>📏 {sel.size}</span>
                <span style={sx.tag(RACE_COL[sel.name]||C.purple)}>💨 {sel.speed}ft</span>
              </div>
            </div>
          </div>
          <div style={{fontSize:13,color:C.text,lineHeight:1.6}}>{sel.desc}</div>
        </div>
        <div style={sx.card}>
          <div style={sx.ct}>🧬 Rassenmerkmale</div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {sel.traits.map((t,i)=>(
              <div key={i} style={{display:"flex",gap:8,background:"rgba(255,255,255,0.03)",borderRadius:7,padding:"7px 10px",border:`1px solid ${C.border}`,borderLeft:`3px solid ${RACE_COL[sel.name]||C.purple}`}}>
                <span style={{color:RACE_COL[sel.name]||C.teal,fontSize:12,minWidth:14}}>▸</span>
                <span style={{fontSize:13,color:C.text,lineHeight:1.5}}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>):(
        <div style={{...sx.card,textAlign:"center",color:C.textDim,padding:48}}>
          <div style={{fontSize:40,marginBottom:10}}>🧬</div>
          <div style={{fontSize:15,fontFamily:FH,color:C.textBright,marginBottom:6}}>D&D 5e Völker</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center",marginTop:10}}>
            {DND_RACES.map(r=><span key={r.name} onClick={()=>setSel(r)} style={{...sx.tag(RACE_COL[r.name]||C.purple),cursor:"pointer",fontFamily:FH,fontSize:11}}>{RACE_ICON[r.name]||"🧬"} {r.name}</span>)}
          </div>
        </div>
      )}
    </div>
  </div>);
}

function QuickRef(){
  const[section,setSection]=useState("conditions");
  const SECTIONS=[{id:"conditions",label:"⚡ Zustände"},{id:"combat",label:"⚔️ Kampf"},{id:"actions",label:"🎯 Aktionen"},{id:"movement",label:"💨 Bewegung"},{id:"resting",label:"🌙 Rasten"},{id:"magic",label:"🔮 Magie"},{id:"checks",label:"🎲 Checks"},{id:"tables",label:"📊 Tabellen"}];
  const RULES={
    combat:[
      {t:"Initiative",b:"1d20+DEX-Mod. Höchste geht zuerst."},
      {t:"Angriff & Treffer",b:"1d20+Angriffs-Bonus vs AC. Nat20=Krit (Würfel×2). Nat1=Fehlschlag. Vorteil=2d20 höchsten, Nachteil=niedrigsten."},
      {t:"Trefferpunkte & Tod",b:"Bei 0 HP: bewusstlos. Todeswürfe: 3× Erfolg (≥10)=stabil, 3× Fehlschlag=tod. Nat20=1HP sofort. Nat1=2 Fehlschläge."},
      {t:"Deckung",b:"Halbe: +2 AC/DEX-Saves. Dreiviertel: +5 AC/DEX-Saves. Voll: nicht direkt angreifbar."},
      {t:"Konzentration",b:"Max 1 Konz.-Zauber. Schaden: CON-Save DC max(10, halber Schaden). Fehlschlag=Ende."},
      {t:"Gelegenheitsangriff",b:"Kreatur verlässt Nahkampfbereich ohne Disengage: 1 Nahkampfangriff als Reaktion."},
      {t:"Fernkampf in Nahkampf",b:"Fernkampfangriffe in 5ft: Nachteil."},
      {t:"Unsichtbarkeit",b:"Angriffe gegen unsichtbare: Nachteil. Von unsichtbarer: Vorteil."},
    ],
    actions:[
      {t:"Angriff",typ:"Aktion",b:"1+ Nahkampf/Fernkampfangriff (Extra-Angriffe bei höherem Level)."},
      {t:"Zaubern",typ:"Aktion",b:"Zauber mit Casting Time 1 Aktion. Wenn Bonus-Aktion-Zauber: nur Cantrips als Aktion."},
      {t:"Dash",typ:"Aktion",b:"Bewegungsreichweite verdoppeln bis Ende des Zuges."},
      {t:"Ausweichen",typ:"Aktion",b:"Angriffe gegen dich: Nachteil. DEX-Saves: Vorteil. Bis nächster Zug."},
      {t:"Helfen",typ:"Aktion",b:"Verbündeter: Vorteil auf nächsten Angriff/Check gegen Ziel in 5ft."},
      {t:"Verstecken",typ:"Aktion",b:"Verbergen-Check vs passive Wahrnehmung. Nur wenn unbeobachtet."},
      {t:"Bereit machen",typ:"Aktion",b:"Trigger+Reaktion planen. Zauber mit Konzentration."},
      {t:"Greifen",typ:"Aktion",b:"Athletik vs Athletik/Akrobatik. Erfolg: Grappled (Speed 0)."},
      {t:"Umwerfen",typ:"Aktion",b:"Athletik vs Athletik/Akrobatik. Erfolg: Prone oder 5ft weg."},
      {t:"Nebenhandangriff",typ:"Bonus",b:"Nach Angriff mit leichter Waffe: leichte Nebenhandwaffe. Kein Schadens-Mod."},
      {t:"Bonus-Zaubern",typ:"Bonus",b:"Zauber mit Casting Time Bonus-Aktion. Dann nur Cantrips als Hauptaktion."},
      {t:"Gelegenheitsangriff",typ:"Reaktion",b:"Kreatur verlässt Nahkampfbereich ohne Disengage: 1 Nahkampfangriff."},
    ],
    movement:[
      {t:"Grundbewegung",b:"Volle Bewegung pro Runde (meist 30ft). Teilbar vor/nach Aktionen. Schwieriges Gelände: 2× Kosten."},
      {t:"Stehen nach Prone",b:"Kostet halbe Bewegung."},
      {t:"Klettern/Schwimmen",b:"2× Bewegungskosten. Klettern: Athletik-Check wenn schwierig."},
      {t:"Springen",b:"Weitsprung: STR-Score ft (mit Anlauf). Hochsprung: 3+STR-Mod ft."},
      {t:"Fallen",b:"Fallschaden: 1d6/10ft (max 20d6). Landen=Prone."},
      {t:"Disengage",b:"Aktion: keine Gelegenheitsangriffe bis Zugende. Schurke: Bonus-Aktion."},
    ],
    resting:[
      {t:"Kurze Rast (1h)",b:"Hit Dice ausgeben: würfle HD+CON-Mod pro HD. Kurz-Rast-Fähigkeiten nachladen."},
      {t:"Lange Rast (8h)",b:"Volle HP. Alle Spell Slots zurück. HD bis Hälfte Level regeneriert. Nur 1×/24h."},
      {t:"Erschöpfung",b:"1:Nachteil Checks. 2:Speed÷2. 3:Nachteil Angriffe+Saves. 4:MaxHP÷2. 5:Speed=0. 6:Tod."},
    ],
    magic:[
      {t:"Spell-Save DC",b:"8 + PB + Spellcasting-Mod. Angriffs-Bonus: PB + Spellcasting-Mod."},
      {t:"Spell Slots",b:"Ressource für Zauber. Cantrips kostenlos. Höherer Slot = stärker."},
      {t:"Ritual-Zaubern",b:"Ritual-Tag: +10 Min. aber kein Slot-Verbrauch. Kleriker/Druide/Barde: alle bekannten Rituale."},
      {t:"Counterspell",b:"Reaktion in 60ft. Grad≤3: auto. Grad4+: Spellcasting-Check DC 10+Grad."},
      {t:"Dispel Magic",b:"Grad3-Slot: alle Zauber ≤3 enden. Höherer Slot: Ability-Check DC 10+Grad."},
    ],
    checks:[
      {t:"Fähigkeitsprobe",b:"1d20+Mod (+PB bei Proficiency). DC: 5=trivial, 10=einfach, 15=mittel, 20=schwer, 25=sehr schwer."},
      {t:"Passive Checks",b:"10+Mod(+PB). Vorteil:+5. Nachteil:-5."},
      {t:"Vorteil/Nachteil",b:"Vorteil: 2d20 höchsten. Nachteil: niedrigsten. Mehrfach: kein Stacken. Beides=normal."},
      {t:"Rettungswürfe",b:"1d20+Mod(+PB). Gegen DC des Effekts. Erfolg: kein/halber Effekt."},
    ],
  };

  const COL={combat:C.amber,actions:C.red,movement:C.green,resting:C.purple,magic:C.purpleBright,checks:C.teal};
  const ACTIONCOLS={Aktion:C.red,Bonus:C.amber,Reaktion:C.blue};

  const Card=({title,body,col})=>(<div style={{...sx.card,borderLeft:`3px solid ${col||C.border}`,marginBottom:0}}>
    <div style={{fontFamily:FH,fontSize:12,color:col||C.gold,fontWeight:700,marginBottom:5}}>{title}</div>
    <div style={{fontSize:13,color:C.text,lineHeight:1.6}}>{body}</div>
  </div>);

  const PB_TABLE=[["1-4","+2"],["5-8","+3"],["9-12","+4"],["13-16","+5"],["17-20","+6"]];
  const DC_TABLE=[["5","Trivial"],["10","Einfach"],["15","Mittel"],["20","Schwer"],["25","Sehr schwer"],["30","Nahezu unmöglich"]];
  const CRIT_TABLE=[["Nat 20 Angriff","Auto-Treffer + Krit (Würfel×2)"],["Nat 1 Angriff","Auto-Fehlschlag"],["Nat 20 Todeswurf","Sofort 1 HP"],["Nat 1 Todeswurf","2 Fehlschläge"]];
  const XP_TABLE=[["1","300"],["2","600"],["3","1.800"],["4","3.800"],["5","7.500"],["6","9.000"],["7","11.000"],["8","14.000"],["9","16.000"],["10","21.000"]];

  const Tbl=({title,headers,rows,col})=>(<div style={{...sx.card,borderLeft:`3px solid ${col}`,marginBottom:0}}>
    <div style={{fontFamily:FH,fontSize:12,color:col,fontWeight:700,marginBottom:8}}>{title}</div>
    <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
      <thead><tr>{headers.map((h,i)=><th key={i} style={{textAlign:"left",padding:"3px 6px",color:C.textDim,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((row,i)=><tr key={i} style={{background:i%2===0?"rgba(255,255,255,0.02)":"transparent"}}>{row.map((cell,j)=><td key={j} style={{padding:"3px 6px",color:C.textBright,borderBottom:`1px solid rgba(255,255,255,0.04)`}}>{cell}</td>)}</tr>)}</tbody>
    </table>
  </div>);

  return(<div>
    <div style={{display:"flex",gap:5,marginBottom:14,flexWrap:"wrap"}}>
      {SECTIONS.map(s=><button key={s.id} onClick={()=>setSection(s.id)} style={sx.nb(section===s.id)}>{s.label}</button>)}
    </div>
    {section==="conditions"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:8}}>
      {CONDITIONS.map(c=><Card key={c.id} title={`${c.icon} ${c.name}`} body={c.desc} col={C.redBright}/>)}
    </div>}
    {["combat","movement","resting","magic","checks"].includes(section)&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:8}}>
      {(RULES[section]||[]).map((r,i)=><Card key={i} title={r.t} body={r.b} col={COL[section]}/>)}
    </div>}
    {section==="actions"&&<div>
      {["Aktion","Bonus","Reaktion"].map(typ=>{
        const col=ACTIONCOLS[typ];
        const items=RULES.actions.filter(a=>a.typ===typ);
        return(<div key={typ} style={{marginBottom:14}}>
          <div style={{fontFamily:FH,fontSize:13,color:col,fontWeight:700,marginBottom:8,borderBottom:`1px solid ${col}30`,paddingBottom:4}}>{typ==="Aktion"?"⚔️":typ==="Bonus"?"⚡":"🛡️"} {typ} ({items.length})</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:6}}>
            {items.map((a,i)=><div key={i} style={{background:`${col}0a`,border:`1px solid ${col}20`,borderLeft:`3px solid ${col}`,borderRadius:8,padding:"8px 10px"}}>
              <div style={{fontFamily:FH,fontSize:12,color:C.textBright,fontWeight:700,marginBottom:3}}>{a.t}</div>
              <div style={{fontSize:12,color:C.textDim,lineHeight:1.5}}>{a.b}</div>
            </div>)}
          </div>
        </div>);
      })}
    </div>}
    {section==="tables"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10}}>
      <Tbl title="Proficiency Bonus" headers={["Level","PB"]} rows={PB_TABLE} col={C.gold}/>
      <Tbl title="Difficulty Class" headers={["DC","Schwierigkeit"]} rows={DC_TABLE} col={C.amber}/>
      <Tbl title="Kritische Würfe" headers={["Wurf","Effekt"]} rows={CRIT_TABLE} col={C.red}/>
      <Tbl title="XP zum nächsten Level" headers={["Level","XP"]} rows={XP_TABLE} col={C.purple}/>
    </div>}
  </div>);
}

function CurrencyTab(){
  const[chars,setChars]=usePersist("chars_v4",[newChar(1)]);
  const[aid]=usePersist("chars_active_v4",1);
  const char=chars.find(c=>c.id===aid)||chars[0];
  const setChar=upd=>setChars(prev=>prev.map(c=>c.id===aid?(typeof upd==="function"?upd(c):upd):c));

  const[convFrom,setConvFrom]=useState("gp");
  const[convAmt,setConvAmt]=useState(1);

  if(!char)return null;

  // All currencies with their GP value
  const CURR=[
    {id:"pp",label:"Platin",short:"PP",icon:"🪙",color:"#e2e8f0",gpVal:10},
    {id:"gold",label:"Gold",short:"GP",icon:"💰",color:C.gold,gpVal:1},
    {id:"electrum",label:"Elektrum",short:"EP",icon:"🔵",color:"#67e8f9",gpVal:0.5},
    {id:"silver",label:"Silber",short:"SP",icon:"⚪",color:"#94a3b8",gpVal:0.1},
    {id:"copper",label:"Kupfer",short:"CP",icon:"🟤",color:"#b45309",gpVal:0.01},
  ];

  const totalGP=CURR.reduce((sum,c)=>{
    const val=char[c.id]||0;
    return sum+val*c.gpVal;
  },0);

  const convBaseGP=(convAmt||0)*(CURR.find(c=>c.id===convFrom)?.gpVal||1);

  // Auto-convert all coins to optimal denomination
  const autoConvert=()=>{
    let cp=(char.copper||0)+(char.silver||0)*10+(char.electrum||0)*50+(char.gold||0)*100+(char.pp||0)*1000;
    const pp=Math.floor(cp/1000);cp%=1000;
    const gp=Math.floor(cp/100);cp%=100;
    const ep=Math.floor(cp/50);cp%=50;
    const sp=Math.floor(cp/10);cp%=10;
    setChar(p=>({...p,pp,gold:gp,electrum:ep,silver:sp,copper:cp}));
  };

  return(<div>
    <div style={{fontFamily:FH,fontSize:16,color:C.gold,fontWeight:700,marginBottom:14}}>
      💰 Währung & Münzen
    </div>

    {/* Wallet */}
    <div style={sx.card}>
      <div style={{...sx.jb,marginBottom:12,flexWrap:"wrap",gap:8}}>
        <div style={sx.ct}>👜 Geldbeutel — {char.name}</div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <span style={{fontSize:12,color:C.textDim}}>Gesamt: <strong style={{color:C.gold}}>{totalGP.toFixed(2)} GP</strong></span>
          <button onClick={autoConvert} style={sx.btn(C.teal)}>⟳ Optimieren</button>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
        {CURR.map(c=>(
          <div key={c.id} style={{background:`${c.color}12`,border:`1px solid ${c.color}40`,borderRadius:12,padding:"12px 14px"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
              <span style={{fontSize:18}}>{c.icon}</span>
              <div>
                <div style={{fontFamily:FH,fontSize:11,color:c.color,fontWeight:700,letterSpacing:.5}}>{c.short}</div>
                <div style={{fontSize:10,color:C.textDim}}>{c.label}</div>
              </div>
              <div style={{marginLeft:"auto",fontSize:10,color:C.textDim}}>=&nbsp;{c.gpVal}GP</div>
            </div>
            <input
              type="number" min={0}
              value={char[c.id]||0}
              onChange={e=>setChar(p=>({...p,[c.id]:Math.max(0,+e.target.value)}))}
              style={{...sx.inp,fontSize:24,fontWeight:700,color:c.color,textAlign:"center",background:"transparent",border:`1px solid ${c.color}40`,borderRadius:8}}
            />
            <div style={{display:"flex",gap:3,marginTop:6,justifyContent:"center"}}>
              {[1,5,10].map(n=>(
                <button key={n} onClick={()=>setChar(p=>({...p,[c.id]:Math.max(0,(p[c.id]||0)+n)}))} style={{...sx.bsm(c.color),fontSize:10,padding:"2px 7px"}}>+{n}</button>
              ))}
              {[1,5,10].map(n=>(
                <button key={-n} onClick={()=>setChar(p=>({...p,[c.id]:Math.max(0,(p[c.id]||0)-n)}))} style={{...sx.bsm(C.red),fontSize:10,padding:"2px 7px"}}>-{n}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Umrechner */}
    <div style={sx.card}>
      <div style={sx.ct}>🔄 Währungsrechner</div>
      <div style={{display:"flex",gap:10,alignItems:"flex-end",flexWrap:"wrap",marginBottom:14}}>
        <div>
          <label style={sx.lbl}>Betrag</label>
          <input type="number" min={0} value={convAmt} onChange={e=>setConvAmt(Math.max(0,+e.target.value))} style={{...sx.inp,width:100}}/>
        </div>
        <div>
          <label style={sx.lbl}>Währung</label>
          <select value={convFrom} onChange={e=>setConvFrom(e.target.value)} style={{...sx.sel,width:130}}>
            {CURR.map(c=><option key={c.id} value={c.id}>{c.icon} {c.label} ({c.short})</option>)}
          </select>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:8}}>
        {CURR.map(c=>{
          const result=convBaseGP/c.gpVal;
          const isFrom=c.id===convFrom;
          return(<div key={c.id} style={{background:isFrom?`${c.color}25`:`${c.color}0a`,border:`1px solid ${c.color}${isFrom?"60":"25"}`,borderRadius:10,padding:"10px 12px",textAlign:"center"}}>
            <div style={{fontSize:16,marginBottom:4}}>{c.icon}</div>
            <div style={{fontFamily:FH,fontSize:11,color:c.color,marginBottom:4}}>{c.short}</div>
            <div style={{fontSize:20,fontWeight:700,color:isFrom?c.color:C.textBright}}>
              {result===Math.floor(result)?result.toLocaleString("de"):result.toFixed(2)}
            </div>
            {!isFrom&&<div style={{fontSize:10,color:C.textDim,marginTop:2}}>{c.label}</div>}
          </div>);
        })}
      </div>
      <div style={{marginTop:12,fontSize:12,color:C.textDim,borderTop:`1px solid ${C.border}`,paddingTop:10}}>
        <strong style={{color:C.textBright}}>Umrechnungskurs:</strong> 1 PP = 10 GP = 20 EP = 100 SP = 1.000 CP
      </div>
    </div>

    {/* Transaktion */}
    <div style={sx.card}>
      <div style={sx.ct}>📝 Transaktion buchen</div>
      <TransactionHelper char={char} setChar={setChar} CURR={CURR}/>
    </div>
  </div>);
}

function TransactionHelper({char,setChar,CURR}){
  const[amt,setAmt]=useState("");
  const[curr,setCurr]=useState("gold");
  const[desc,setDesc]=useState("");
  const[log,setLog]=useState([]);

  const book=(dir)=>{
    const n=Math.max(0,+amt||0);
    if(!n)return;
    const sign=dir==="add"?1:-1;
    setChar(p=>({...p,[curr]:Math.max(0,(p[curr]||0)+sign*n)}));
    setLog(l=>[{id:Date.now(),dir,amt:n,curr,desc,ts:new Date().toLocaleTimeString("de")},...l.slice(0,19)]);
    setAmt("");setDesc("");
  };

  return(<div>
    <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"flex-end",marginBottom:12}}>
      <div>
        <label style={sx.lbl}>Betrag</label>
        <input type="number" min={0} value={amt} onChange={e=>setAmt(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&book("add")}
          style={{...sx.inp,width:90}} placeholder="0"/>
      </div>
      <div>
        <label style={sx.lbl}>Währung</label>
        <select value={curr} onChange={e=>setCurr(e.target.value)} style={{...sx.sel,width:110}}>
          {CURR.map(c=><option key={c.id} value={c.id}>{c.icon} {c.short}</option>)}
        </select>
      </div>
      <div style={{flex:1,minWidth:120}}>
        <label style={sx.lbl}>Notiz (optional)</label>
        <input value={desc} onChange={e=>setDesc(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&book("add")}
          style={sx.inp} placeholder="z.B. Sold, Kauf, Beute..."/>
      </div>
      <button onClick={()=>book("add")} style={sx.btn(C.green)}>+ Erhalten</button>
      <button onClick={()=>book("sub")} style={sx.btn(C.red)}>- Ausgeben</button>
    </div>
    {log.length>0&&<div>
      <div style={{fontSize:11,color:C.textDim,marginBottom:6,fontFamily:FH,letterSpacing:.5}}>LETZTE TRANSAKTIONEN</div>
      <div style={{display:"flex",flexDirection:"column",gap:4,maxHeight:200,overflowY:"auto"}}>
        {log.map(e=>{
          const cur=CURR.find(c=>c.id===e.curr);
          const col=e.dir==="add"?C.greenBright:C.redBright;
          return(<div key={e.id} style={{display:"flex",alignItems:"center",gap:10,padding:"5px 8px",background:"rgba(255,255,255,0.03)",borderRadius:6,borderLeft:`3px solid ${col}`}}>
            <span style={{fontSize:12,color:col,fontWeight:700,minWidth:60}}>{e.dir==="add"?"+":"-"}{e.amt} {cur?.short}</span>
            <span style={{fontSize:12,color:C.text,flex:1}}>{e.desc||"—"}</span>
            <span style={{fontSize:10,color:C.textDim}}>{e.ts}</span>
          </div>);
        })}
      </div>
    </div>}
  </div>);
}

const MAIN_TABS=[
  {id:"overview",label:"🗺️ Übersicht"},
  {id:"char",label:"📜 Charakter"},
  {id:"currency",label:"💰 Währung"},
  {id:"notes",label:"📝 Notizen"},
  {id:"items",label:"📦 Items"},
  {id:"npcs",label:"👥 NPCs"},
  {id:"combat",label:"⚔️ Kampf"},
  {id:"dice",label:"🎲 Würfel"},
];
const REF_TABS=[
  {id:"bestiary",label:"🐉 Bestiary"},
  {id:"klassen",label:"⚔️ Klassen"},
  {id:"voelker",label:"🧬 Völker"},
  {id:"quickref",label:"📋 Schnellreferenz"},
];

export default function App(){
  const[tab,setTab]=usePersist("app_tab_v5","overview");
  const[chars]=usePersist("chars_v4",[newChar(1)]);
  const[aid]=usePersist("chars_active_v4",1);
  const active=chars.find(c=>c.id===aid)||chars[0];
  const[dropOpen,setDropOpen]=useState(false);

  const exportJSON=()=>{
    if(!active)return;
    const blob=new Blob([JSON.stringify(active,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download=`${active.name||"charakter"}.json`;a.click();
    URL.revokeObjectURL(url);
  };
  const exportPDF=()=>{
    if(!active)return;
    const pb=getPB(active.level);
    const modS=s=>{const m=Math.floor((s-10)/2);return m>=0?`+${m}`:String(m);};
    const attrs=["str","dex","con","int","wis","cha"].map(a=>`<tr><td>${a.toUpperCase()}</td><td>${active[a]||10}</td><td>${modS(active[a]||10)}</td></tr>`).join("");
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${active.name}</title><style>body{font-family:Calibri,sans-serif;padding:20px;max-width:680px}h1{margin:0}h3{border-bottom:1px solid #ccc;margin-top:16px}table{border-collapse:collapse;width:100%;font-size:13px}td,th{border:1px solid #ddd;padding:4px 8px}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:8px 0}.box{border:1px solid #ccc;padding:6px;text-align:center}.bv{font-size:20px;font-weight:bold}</style></head><body><h1>${active.name}</h1><p>${active.race} · ${active.klass} · Level ${active.level} · PB +${pb}</p><div class="grid"><div class="box"><div style="font-size:10px">HP</div><div class="bv">${active.hp}/${active.maxHp}</div></div><div class="box"><div style="font-size:10px">AC</div><div class="bv">${active.ac}</div></div><div class="box"><div style="font-size:10px">Init</div><div class="bv">${modS(active.dex||10)}</div></div><div class="box"><div style="font-size:10px">Gold</div><div class="bv">${active.gold||0}gp</div></div></div><h3>Attribute</h3><table><tr><th>Attr</th><th>Wert</th><th>Mod</th></tr>${attrs}</table>${active.traits?`<h3>Persönlichkeit</h3><p>${active.traits}</p>`:""}${active.features?`<h3>Merkmale</h3><p>${active.features}</p>`:""}<p style="font-size:10px;color:#999">D&D Companion · ${new Date().toLocaleDateString("de")}</p></body></html>`;
    const w=window.open("","_blank");w.document.write(html);w.document.close();setTimeout(()=>w.print(),300);
  };

  const isRef=REF_TABS.some(t=>t.id===tab);

  return(<div style={sx.app} onClick={()=>setDropOpen(false)}>
    <header style={sx.hdr}>
      <span style={{fontSize:20,flexShrink:0}}>🐉</span>
      <div style={{flexShrink:0}}>
        <h1 style={sx.hT}>D&D</h1>
        <div style={sx.hS}>COMPANION v5.1</div>
      </div>
      <div style={{marginLeft:"auto",display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
        {active&&<span style={{fontSize:11,color:C.gold,fontFamily:FH,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{active.name}</span>}
        <button onClick={exportJSON} style={{...sx.bsm(C.teal),fontSize:10,padding:"4px 8px"}}>⬇️ JSON</button>
        <button onClick={exportPDF} style={{...sx.bsm(C.amber),fontSize:10,padding:"4px 8px"}}>📄 PDF</button>
      </div>
    </header>
    <div style={{position:"relative",zIndex:100,flexShrink:0}} onClick={()=>setDropOpen(false)}>
      <nav style={sx.nav}>
        {MAIN_TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={sx.nb(tab===t.id)}>{t.label}</button>)}
        <button onClick={e=>{e.stopPropagation();setDropOpen(p=>!p);}} style={{...sx.nb(isRef),paddingRight:14,flexShrink:0}}>
          📚 Referenz {dropOpen?"▲":"▼"}
        </button>
      </nav>
      {dropOpen&&<div onClick={e=>e.stopPropagation()} style={{
        position:"absolute",top:"100%",right:0,zIndex:9999,
        background:C.card,border:`1px solid ${C.purple}44`,borderRadius:10,
        padding:"6px",minWidth:180,marginTop:0,
        boxShadow:"0 8px 32px rgba(0,0,0,0.8)",
      }}>
        {REF_TABS.map(t=>(
          <button key={t.id} onClick={()=>{setTab(t.id);setDropOpen(false);}} style={{
            display:"block",width:"100%",textAlign:"left",
            background:tab===t.id?`${C.purple}33`:"transparent",
            border:"none",borderRadius:7,color:tab===t.id?C.purpleBright:C.textBright,
            fontFamily:FH,fontSize:11,padding:"8px 12px",cursor:"pointer",
            transition:"all .15s",
          }}>{t.label}</button>
        ))}
      </div>}
    </div>
    <div style={sx.main}>
      {tab==="overview"&&<Overview/>}
      {tab==="char"&&<CharManager/>}
      {tab==="currency"&&<CurrencyTab/>}
      {tab==="notes"&&<Notes/>}
      {tab==="items"&&<ItemsList/>}
      {tab==="npcs"&&<NpcList/>}
      {tab==="combat"&&<CombatTracker/>}
      {tab==="dice"&&<DiceRoller/>}
      {tab==="bestiary"&&<Bestiary/>}
      {tab==="klassen"&&<KlassenRef/>}
      {tab==="voelker"&&<VoelkerRef/>}
      {tab==="quickref"&&<QuickRef/>}
    </div>
  </div>);
}
