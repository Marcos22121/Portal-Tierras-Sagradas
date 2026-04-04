const fs = require('fs');
let content = fs.readFileSync('C:/Users/marco/OneDrive/Desktop/Portal-Tierras-Sagradas/app/videojuegos/peak-of-binohmo-sword/page.tsx', 'utf8');

const t1_mins = ['piedra', 'cobre', 'estano', 'hierro', 'plata', 'oro'];
const t2_mins = ['esmeralda', 'diamante', 'stellar-saphirus', 'crimson-obsidian', 'mithrill', 'blood-corundom'];
const t3_mins = ['adamantio', 'oricalco', 'paladio', 'titanio', 'ferrolumbre-min', 'neodimio', 'iridio', 'neutronio', 'fragmento-infinito'];

let lines = content.split('\n');
let inSection = null;

for(let i=0; i<lines.length; i++) {
   if (lines[i].includes('id: \'minerales\', ')) inSection = 'minerales';
   else if (lines[i].includes('id: \'minerales-miticos\'')) inSection = 'minerales-miticos';
   else if (lines[i].includes('id: \'armas-t1\'')) inSection = 'armas-t1';
   else if (lines[i].includes('id: \'armas-t2\'')) inSection = 'armas-t2';
   else if (lines[i].includes('id: \'armas-t3\'')) inSection = 'armas-t3';
   else if (lines[i].includes('id: \'armas-miticas\'')) inSection = 'armas-miticas';
   else if (lines[i].includes('id: \'upgrades\'')) inSection = 'upgrades';
   else if (lines[i].includes('id: \'habilidades\'')) inSection = 'habilidades';
   else if (lines[i].includes('id: \'gemas\'')) inSection = 'gemas';
   else if (lines[i].includes('id: \'pergaminos\'')) inSection = 'pergaminos';

   let line = lines[i];
   if (line.includes('rarity: ')) {
       if (inSection === 'minerales') {
          t1_mins.forEach(id => { if(line.includes("id: '"+id+"'")) lines[i] = line.replace(/rarity: '[^']+'/, "rarity: 'Tier 1'"); });
          t2_mins.forEach(id => { if(line.includes("id: '"+id+"'")) lines[i] = line.replace(/rarity: '[^']+'/, "rarity: 'Tier 2'"); });
          t3_mins.forEach(id => { if(line.includes("id: '"+id+"'")) lines[i] = line.replace(/rarity: '[^']+'/, "rarity: 'Tier 3'"); });
       }
       else if (inSection === 'minerales-miticos') {
          lines[i] = line.replace(/rarity: '[^']+'/, "rarity: 'Mítico'");
       }
       else if (inSection === 'armas-t1') {
          lines[i] = line.replace(/rarity: '[^']+'/, "rarity: 'Tier 1'");
       }
       else if (inSection === 'armas-t2') {
          lines[i] = line.replace(/rarity: '[^']+'/, "rarity: 'Tier 2'");
       }
       else if (inSection === 'armas-t3') {
          lines[i] = line.replace(/rarity: '[^']+'/, "rarity: 'Tier 3'");
       }
       else if (inSection === 'armas-miticas') {
          lines[i] = line.replace(/rarity: '[^']+'/, "rarity: 'Mítica'");
       }
       else if (inSection === 'upgrades') {
          lines[i] = line.replace(/rarity: '[^']+'/, "rarity: 'Mejora'");
       }
       else if (inSection === 'habilidades') {
          lines[i] = line.replace(/rarity: '[^']+'/, "rarity: 'Habilidad'");
       }
       else if (inSection === 'pergaminos') {
          lines[i] = line.replace(/rarity: '[^']+'/, "rarity: 'Pergamino'");
       }
   }
}

content = lines.join('\n');
fs.writeFileSync('C:/Users/marco/OneDrive/Desktop/Portal-Tierras-Sagradas/app/videojuegos/peak-of-binohmo-sword/page.tsx', content);
console.log('done');
