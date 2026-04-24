export const modOf = s => Math.floor((s - 10) / 2);
export const modStr = s => { const m = modOf(s); return m >= 0 ? `+${m}` : `${m}`; };
export const rollD = n => Math.floor(Math.random() * n) + 1;
export const getPB = l => l < 5 ? 2 : l < 9 ? 3 : l < 13 ? 4 : l < 17 ? 5 : 6;

export const newChar = id => ({
  id, name:"Neuer Held", race:"Mensch", klass:"Kämpfer", level:1, background:"Soldat",
  str:10, dex:10, con:10, int:10, wis:10, cha:10,
  hp:10, maxHp:10, tempHp:0, ac:10, speed:30, initiative:0,
  hd:"W10", hd_used:0, deathSaves:{suc:0,fail:0},
  saves:{STR:false,DEX:false,CON:false,INT:false,WIS:false,CHA:false},
  skills:{}, spellAbility:"INT", spellDC:8, spellAtk:0, inspiration:false,
  traits:"", ideals:"", bonds:"", flaws:"", equipment:"", features:"", backstory:"",
  inventory:[], actions:[], gold:0, silver:0, copper:0, electrum:0, platinum:0,
});
