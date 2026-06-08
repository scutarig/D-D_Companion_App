// D&D 5e Beast forms for Wild Shape / Polymorph
// cr: numeric (0, 0.125, 0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8)
// crLabel: display string

export const BEASTS = [
  // ── CR 0 ──────────────────────────────────────────────────────────────────
  { id:"frog",       name:"Frog",        crLabel:"0",    cr:0,     size:"Tiny",   hp:1,  ac:11, speed:"10ft, swim 10ft", str:1,dex:13,con:8,int:1,wis:8,cha:3,
    attacks:[], traits:["Amphibious","Standing Leap: 10ft weit / 5ft hoch"], fly:false, swim:true },
  { id:"crab",       name:"Crab",        crLabel:"0",    cr:0,     size:"Tiny",   hp:2,  ac:11, speed:"20ft, swim 20ft", str:2,dex:11,con:10,int:1,wis:8,cha:2,
    attacks:[{name:"Klaue",bonus:0,dmg:"1",dmgType:"bludgeoning"}], traits:["Amphibious"], fly:false, swim:true },
  { id:"spider",     name:"Spider",      crLabel:"0",    cr:0,     size:"Tiny",   hp:1,  ac:12, speed:"20ft, climb 20ft", str:2,dex:14,con:8,int:1,wis:10,cha:2,
    attacks:[{name:"Biss",bonus:4,dmg:"1 + Gift",dmgType:"piercing",note:"DC 9 CON oder 2 Gift"}], traits:["Spider Climb","Web Sense"], fly:false, swim:false },
  { id:"hawk",       name:"Hawk",        crLabel:"0",    cr:0,     size:"Tiny",   hp:1,  ac:13, speed:"10ft, fly 60ft", str:5,dex:16,con:8,int:2,wis:14,cha:6,
    attacks:[{name:"Klauen",bonus:5,dmg:"1",dmgType:"slashing"}], traits:["Keen Sight: Vorteil WIS Perception (Sicht)"], fly:true, swim:false },

  // ── CR 1/8 ──────────────────────────────────────────────────────────────
  { id:"giant_rat",  name:"Giant Rat",   crLabel:"1/8",  cr:0.125, size:"Small",  hp:7,  ac:12, speed:"30ft", str:7,dex:15,con:11,int:2,wis:10,cha:4,
    attacks:[{name:"Biss",bonus:4,dmg:"1d4+2",dmgType:"piercing"}], traits:["Pack Tactics: Vorteil wenn Verbündeter neben Ziel","Keen Smell: Vorteil WIS Perception (Geruch)"], fly:false, swim:false },
  { id:"mastiff",    name:"Mastiff",     crLabel:"1/8",  cr:0.125, size:"Medium", hp:5,  ac:12, speed:"40ft", str:13,dex:14,con:12,int:3,wis:12,cha:7,
    attacks:[{name:"Biss",bonus:3,dmg:"1d6+1",dmgType:"piercing",note:"DC 11 STR oder Prone"}], traits:["Keen Hearing & Smell: Vorteil auf relevante Perception"], fly:false, swim:false },
  { id:"blood_hawk", name:"Blood Hawk",  crLabel:"1/8",  cr:0.125, size:"Small",  hp:7,  ac:12, speed:"10ft, fly 60ft", str:6,dex:14,con:10,int:3,wis:14,cha:5,
    attacks:[{name:"Schnabel",bonus:4,dmg:"1d4+2",dmgType:"piercing"}], traits:["Pack Tactics","Keen Sight"], fly:true, swim:false },
  { id:"poisonous_snake", name:"Poisonous Snake", crLabel:"1/8", cr:0.125, size:"Tiny", hp:2, ac:13, speed:"30ft, swim 30ft", str:2,dex:16,con:11,int:1,wis:10,cha:3,
    attacks:[{name:"Biss",bonus:5,dmg:"1 + Gift",dmgType:"piercing",note:"DC 10 CON: 2d5 Gift, oder halb"}], traits:["Blind Senses 10ft"], fly:false, swim:true },

  // ── CR 1/4 ──────────────────────────────────────────────────────────────
  { id:"wolf",       name:"Wolf",        crLabel:"1/4",  cr:0.25,  size:"Medium", hp:11, ac:13, speed:"40ft", str:12,dex:15,con:12,int:3,wis:12,cha:6,
    attacks:[{name:"Biss",bonus:4,dmg:"2d4+2",dmgType:"piercing",note:"DC 11 STR oder Prone"}], traits:["Pack Tactics","Keen Hearing & Smell"], fly:false, swim:false },
  { id:"boar",       name:"Boar",        crLabel:"1/4",  cr:0.25,  size:"Medium", hp:11, ac:11, speed:"40ft", str:13,dex:11,con:12,int:2,wis:9,cha:5,
    attacks:[{name:"Stoßzahn",bonus:3,dmg:"1d6+1",dmgType:"slashing",note:"DC 11 STR oder Prone"}], traits:["Charge: +2d6 Schaden + Prone DC 11 (wenn 20ft Anlauf)","Relentless (1×): Bleibt bei 1 HP wenn tödlicher Treffer (1×/Rast)"], fly:false, swim:false },
  { id:"panther",    name:"Panther",     crLabel:"1/4",  cr:0.25,  size:"Medium", hp:13, ac:12, speed:"50ft, climb 40ft", str:14,dex:15,con:10,int:3,wis:14,cha:7,
    attacks:[{name:"Biss",bonus:4,dmg:"1d6+2",dmgType:"piercing"},{name:"Klaue",bonus:4,dmg:"1d4+2",dmgType:"slashing",note:"DC 12 STR oder Prone"}], traits:["Keen Smell","Pounce: Prone DC 12 + Bonus-Aktion Biss nach Sprung"], fly:false, swim:false },
  { id:"elk",        name:"Elk",         crLabel:"1/4",  cr:0.25,  size:"Large",  hp:13, ac:10, speed:"50ft", str:16,dex:10,con:12,int:2,wis:10,cha:6,
    attacks:[{name:"Ramme",bonus:5,dmg:"2d6+3",dmgType:"bludgeoning",note:"DC 13 STR oder Prone (nach 20ft Anlauf)"},{name:"Hufe",bonus:5,dmg:"2d4+3",dmgType:"bludgeoning"}], traits:["Charge: Ramm-Angriff mit 20ft Anlauf → Prone DC 13"], fly:false, swim:false },
  { id:"giant_bat",  name:"Giant Bat",   crLabel:"1/4",  cr:0.25,  size:"Large",  hp:22, ac:13, speed:"10ft, fly 60ft", str:15,dex:16,con:11,int:2,wis:12,cha:6,
    attacks:[{name:"Biss",bonus:4,dmg:"1d6+2",dmgType:"piercing"}], traits:["Echolocation: Kein Vorteil blind","Keen Hearing: Vorteil WIS Perception (Gehör)"], fly:true, swim:false },
  { id:"constrictor_snake", name:"Constrictor Snake", crLabel:"1/4", cr:0.25, size:"Large", hp:13, ac:12, speed:"30ft, swim 30ft", str:15,dex:14,con:12,int:1,wis:10,cha:3,
    attacks:[{name:"Biss",bonus:4,dmg:"1d6+2",dmgType:"piercing"},{name:"Constrict",bonus:4,dmg:"1d8+2",dmgType:"bludgeoning",note:"Grappled DC 14 STR, Restraint bis Grapple endet"}], traits:[], fly:false, swim:true },
  { id:"riding_horse", name:"Riding Horse", crLabel:"1/4", cr:0.25, size:"Large", hp:13, ac:10, speed:"60ft", str:16,dex:10,con:12,int:2,wis:11,cha:7,
    attacks:[{name:"Hufe",bonus:5,dmg:"2d4+3",dmgType:"bludgeoning"}], traits:[], fly:false, swim:false },

  // ── CR 1/2 ──────────────────────────────────────────────────────────────
  { id:"ape",        name:"Ape",         crLabel:"1/2",  cr:0.5,   size:"Medium", hp:19, ac:12, speed:"30ft, climb 30ft", str:16,dex:14,con:14,int:6,wis:12,cha:7,
    attacks:[{name:"Faust",bonus:5,dmg:"2d6+3",dmgType:"bludgeoning"},{name:"Steinwurf",bonus:5,dmg:"1d6+3",dmgType:"bludgeoning",range:"25/50ft"}], traits:["Keen Smell: Vorteil Perception (Geruch)"], fly:false, swim:false },
  { id:"black_bear", name:"Black Bear",  crLabel:"1/2",  cr:0.5,   size:"Medium", hp:19, ac:11, speed:"40ft, climb 30ft", str:15,dex:10,con:14,int:2,wis:12,cha:7,
    attacks:[{name:"Biss",bonus:4,dmg:"1d6+2",dmgType:"piercing"},{name:"Klauen",bonus:4,dmg:"2d6+2",dmgType:"slashing"}], traits:["Keen Smell: Vorteil Perception (Geruch)","Multiattack: Biss + Klauen"], fly:false, swim:false },
  { id:"crocodile",  name:"Crocodile",   crLabel:"1/2",  cr:0.5,   size:"Large",  hp:19, ac:12, speed:"20ft, swim 30ft", str:15,dex:10,con:13,int:2,wis:10,cha:5,
    attacks:[{name:"Biss",bonus:4,dmg:"1d10+2",dmgType:"piercing",note:"Grappled DC 12 STR, Restraint bis Grapple endet"}], traits:["Hold Breath: 15 Min."], fly:false, swim:true },
  { id:"giant_wasp", name:"Giant Wasp",  crLabel:"1/2",  cr:0.5,   size:"Medium", hp:13, ac:12, speed:"10ft, fly 50ft", str:10,dex:14,con:10,int:1,wis:10,cha:3,
    attacks:[{name:"Stich",bonus:4,dmg:"1d6+2",dmgType:"piercing",note:"DC 11 CON: 3d6 Gift, oder halb. Bei 0 HP vergiftet 1d4 Tage"}], traits:[], fly:true, swim:false },
  { id:"warhorse",   name:"Warhorse",    crLabel:"1/2",  cr:0.5,   size:"Large",  hp:19, ac:11, speed:"60ft", str:18,dex:12,con:13,int:2,wis:12,cha:7,
    attacks:[{name:"Hufe",bonus:6,dmg:"2d6+4",dmgType:"bludgeoning"}], traits:["Trampling Charge: Prone DC 14 + Bonus-Aktion Hufe nach Charge"], fly:false, swim:false },

  // ── CR 1 ────────────────────────────────────────────────────────────────
  { id:"brown_bear", name:"Brown Bear",  crLabel:"1",    cr:1,     size:"Large",  hp:34, ac:11, speed:"40ft, climb 30ft", str:19,dex:10,con:16,int:2,wis:13,cha:7,
    attacks:[{name:"Biss",bonus:6,dmg:"1d8+4",dmgType:"piercing"},{name:"Klauen",bonus:6,dmg:"2d6+4",dmgType:"slashing"}], traits:["Keen Smell: Vorteil Perception (Geruch)","Multiattack: Biss + Klauen"], fly:false, swim:false },
  { id:"dire_wolf",  name:"Dire Wolf",   crLabel:"1",    cr:1,     size:"Large",  hp:37, ac:14, speed:"50ft", str:17,dex:15,con:15,int:3,wis:12,cha:7,
    attacks:[{name:"Biss",bonus:5,dmg:"2d6+3",dmgType:"piercing",note:"DC 13 STR oder Prone"}], traits:["Keen Hearing & Smell","Pack Tactics"], fly:false, swim:false },
  { id:"giant_eagle", name:"Giant Eagle", crLabel:"1",   cr:1,     size:"Large",  hp:26, ac:13, speed:"10ft, fly 80ft", str:16,dex:17,con:13,int:8,wis:14,cha:10,
    attacks:[{name:"Schnabel",bonus:5,dmg:"1d6+3",dmgType:"piercing"},{name:"Klauen",bonus:5,dmg:"2d6+3",dmgType:"slashing"}], traits:["Keen Sight: Vorteil Perception (Sicht)","Multiattack: Klauen + Schnabel"], fly:true, swim:false },
  { id:"giant_spider", name:"Giant Spider", crLabel:"1", cr:1,     size:"Large",  hp:26, ac:14, speed:"30ft, climb 30ft", str:14,dex:16,con:12,int:2,wis:11,cha:4,
    attacks:[{name:"Biss",bonus:5,dmg:"1d8+3",dmgType:"piercing",note:"DC 11 CON: 2d8 Gift, oder halb. Bei 0 HP: paralyzed 1 Stunde"},{name:"Web",bonus:5,dmg:"—",range:"30/60ft",note:"DC 12 STR: Restraint (Entkommen DC 12 STR oder Slash 10 AC 10)"}], traits:["Spider Climb","Web Sense"], fly:false, swim:false },
  { id:"lion",       name:"Lion",        crLabel:"1",    cr:1,     size:"Large",  hp:26, ac:12, speed:"50ft", str:17,dex:15,con:13,int:3,wis:12,cha:8,
    attacks:[{name:"Biss",bonus:5,dmg:"1d8+3",dmgType:"piercing"},{name:"Klaue",bonus:5,dmg:"1d6+3",dmgType:"slashing",note:"DC 13 STR oder Prone"}], traits:["Keen Smell","Pack Tactics","Pounce: Prone DC 13 + Bonus-Aktion Biss","Multiattack: Klaue + Biss"], fly:false, swim:false },
  { id:"tiger",      name:"Tiger",       crLabel:"1",    cr:1,     size:"Large",  hp:37, ac:12, speed:"40ft", str:17,dex:15,con:14,int:3,wis:12,cha:8,
    attacks:[{name:"Biss",bonus:5,dmg:"1d10+3",dmgType:"piercing"},{name:"Klaue",bonus:5,dmg:"1d6+3",dmgType:"slashing",note:"DC 13 STR oder Prone"}], traits:["Keen Smell","Pounce: Prone DC 13 + Bonus-Aktion Biss","Multiattack: Klaue + Biss"], fly:false, swim:false },
  { id:"giant_toad", name:"Giant Toad",  crLabel:"1",    cr:1,     size:"Large",  hp:39, ac:11, speed:"20ft, swim 40ft", str:15,dex:13,con:13,int:2,wis:10,cha:3,
    attacks:[{name:"Biss",bonus:4,dmg:"1d6+2",dmgType:"piercing",note:"Grappled DC 13 STR. Restraint, Verschlucken bei Medium oder kleiner"}], traits:["Amphibious","Standing Leap: 20ft weit / 10ft hoch","Swallow: Bei Grapple → Verschluckt (blind, restrained, 3d6 Säure/Runde)"], fly:false, swim:true },

  // ── CR 2 ────────────────────────────────────────────────────────────────
  { id:"polar_bear", name:"Polar Bear",  crLabel:"2",    cr:2,     size:"Large",  hp:42, ac:12, speed:"40ft, swim 30ft", str:20,dex:10,con:16,int:2,wis:13,cha:7,
    attacks:[{name:"Biss",bonus:7,dmg:"1d8+5",dmgType:"piercing"},{name:"Klauen",bonus:7,dmg:"2d6+5",dmgType:"slashing"}], traits:["Keen Smell","Multiattack: Biss + Klauen"], fly:false, swim:true },
  { id:"allosaurus", name:"Allosaurus",  crLabel:"2",    cr:2,     size:"Large",  hp:51, ac:13, speed:"60ft", str:19,dex:13,con:17,int:2,wis:12,cha:5,
    attacks:[{name:"Biss",bonus:6,dmg:"2d10+4",dmgType:"piercing"},{name:"Klaue",bonus:6,dmg:"1d8+4",dmgType:"slashing",note:"DC 14 STR oder Prone"}], traits:["Pounce: Prone DC 14 + Bonus-Aktion Biss (nach 30ft Anlauf)","Multiattack: Klaue + Biss"], fly:false, swim:false },
  { id:"rhinoceros", name:"Rhinoceros",  crLabel:"2",    cr:2,     size:"Large",  hp:45, ac:11, speed:"40ft", str:21,dex:8,con:15,int:2,wis:12,cha:6,
    attacks:[{name:"Gore",bonus:7,dmg:"2d8+5",dmgType:"bludgeoning"}], traits:["Charge: +4d8 Schaden + Prone DC 15 STR (nach 20ft Anlauf)"], fly:false, swim:false },
  { id:"saber_tooth", name:"Saber-toothed Tiger", crLabel:"2", cr:2, size:"Large", hp:52, ac:12, speed:"40ft", str:18,dex:14,con:15,int:3,wis:12,cha:8,
    attacks:[{name:"Biss",bonus:6,dmg:"1d10+4",dmgType:"piercing"},{name:"Klaue",bonus:6,dmg:"2d6+4",dmgType:"slashing",note:"DC 14 STR oder Prone"}], traits:["Keen Smell","Pounce: Prone DC 14 + Bonus-Aktion Biss","Multiattack: Klaue + Biss"], fly:false, swim:false },

  // ── CR 3 ────────────────────────────────────────────────────────────────
  { id:"giant_scorpion", name:"Giant Scorpion", crLabel:"3", cr:3, size:"Large", hp:52, ac:15, speed:"40ft", str:15,dex:13,con:15,int:1,wis:9,cha:3,
    attacks:[{name:"Klaue",bonus:4,dmg:"1d8+2",dmgType:"bludgeoning",note:"Grappled DC 12 STR. Zwei Klauen"},{name:"Stich",bonus:4,dmg:"1d10+2",dmgType:"piercing",note:"DC 12 CON: 4d10 Gift, oder halb"}], traits:["Multiattack: 2× Klaue + 1× Stich"], fly:false, swim:false },
  { id:"killer_whale",   name:"Killer Whale",   crLabel:"3", cr:3, size:"Huge",  hp:90, ac:12, speed:"swim 60ft", str:19,dex:10,con:13,int:3,wis:12,cha:7,
    attacks:[{name:"Biss",bonus:6,dmg:"5d6+4",dmgType:"piercing"}], traits:["Echolocation","Keen Hearing","Hold Breath: 30 Min."], fly:false, swim:true },
  { id:"ankylosaurus",   name:"Ankylosaurus",   crLabel:"3", cr:3, size:"Huge",  hp:68, ac:15, speed:"30ft", str:19,dex:11,con:15,int:2,wis:12,cha:5,
    attacks:[{name:"Schwanzkeule",bonus:6,dmg:"4d6+4",dmgType:"bludgeoning",note:"DC 14 STR oder Prone"}], traits:[], fly:false, swim:false },

  // ── CR 4 ────────────────────────────────────────────────────────────────
  { id:"elephant",   name:"Elephant",    crLabel:"4",    cr:4,     size:"Huge",  hp:76, ac:11, speed:"40ft", str:22,dex:9,con:17,int:3,wis:11,cha:6,
    attacks:[{name:"Gore",bonus:8,dmg:"3d8+6",dmgType:"piercing"},{name:"Trampeln",bonus:8,dmg:"4d10+6",dmgType:"bludgeoning",note:"DC 12 DEX oder Prone; nur wenn bereits Prone"}], traits:["Trampling Charge: Prone DC 12 STR + Bonus-Aktion Trampeln","Multiattack: Gore + Trampeln"], fly:false, swim:false },

  // ── CR 5 ────────────────────────────────────────────────────────────────
  { id:"triceratops", name:"Triceratops", crLabel:"5",   cr:5,     size:"Huge",  hp:114, ac:13, speed:"50ft", str:22,dex:9,con:17,int:2,wis:11,cha:5,
    attacks:[{name:"Gore",bonus:9,dmg:"4d8+6",dmgType:"piercing"},{name:"Trampeln",bonus:9,dmg:"4d10+6",dmgType:"bludgeoning",note:"DC 13 STR oder Prone"}], traits:["Trampling Charge: Prone DC 13 + Bonus-Aktion Trampeln","Multiattack: Gore + Trampeln"], fly:false, swim:false },
  { id:"mammoth",     name:"Mammoth",     crLabel:"5",   cr:5,     size:"Huge",  hp:126, ac:13, speed:"40ft", str:24,dex:9,con:21,int:3,wis:11,cha:6,
    attacks:[{name:"Gore",bonus:10,dmg:"4d10+7",dmgType:"piercing"},{name:"Trampeln",bonus:10,dmg:"4d12+7",dmgType:"bludgeoning",note:"DC 18 STR oder Prone"}], traits:["Trampling Charge: Gore mit 20ft Anlauf → DC 18 STR oder Prone + Bonus-Aktion Trampeln"], fly:false, swim:false },
];

// Wild Shape CR limits per Druid level (PHB rules)
// [no_fly_no_swim_cr, no_fly_cr, cr]
export const WILD_SHAPE_LIMITS = {
  2:  { cr: 0.25,  noFly: true,  noSwim: true  },
  3:  { cr: 0.25,  noFly: true,  noSwim: true  },
  4:  { cr: 0.5,   noFly: true,  noSwim: false },
  5:  { cr: 0.5,   noFly: true,  noSwim: false },
  6:  { cr: 0.5,   noFly: true,  noSwim: false },
  7:  { cr: 0.5,   noFly: true,  noSwim: false },
  8:  { cr: 1,     noFly: false, noSwim: false },
  9:  { cr: 1,     noFly: false, noSwim: false },
  10: { cr: 1,     noFly: false, noSwim: false },
  11: { cr: 1,     noFly: false, noSwim: false },
  12: { cr: 1,     noFly: false, noSwim: false },
  13: { cr: 1,     noFly: false, noSwim: false },
  14: { cr: 1,     noFly: false, noSwim: false },
  15: { cr: 1,     noFly: false, noSwim: false },
  16: { cr: 1,     noFly: false, noSwim: false },
  17: { cr: 1,     noFly: false, noSwim: false },
  18: { cr: 1,     noFly: false, noSwim: false },
  19: { cr: 1,     noFly: false, noSwim: false },
  20: { cr: 1,     noFly: false, noSwim: false },
};
// Circle of Moon doubles the CR: Math.floor(level/3)
export const MOON_DRUID_CR = (level) => Math.max(1, Math.floor(level / 3));

export const CR_LABELS = ["0","1/8","1/4","1/2","1","2","3","4","5","6","7","8"];
export const CR_VALUES = [0, 0.125, 0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8];

export function getBeastsForLevel(level, isMoonDruid = false) {
  const limit = WILD_SHAPE_LIMITS[Math.max(2, Math.min(20, level))];
  if (!limit) return [];
  const maxCr = isMoonDruid ? MOON_DRUID_CR(level) : limit.cr;
  return BEASTS.filter(b => {
    if (b.cr > maxCr) return false;
    if (limit.noFly && b.fly) return false;
    // Level 2: no swim per strict RAW (no swim speed), but many DMs allow it
    return true;
  });
}
