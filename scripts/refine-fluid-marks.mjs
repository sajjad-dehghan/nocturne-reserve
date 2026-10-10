import {writeFile} from 'node:fs/promises';
let seed=216;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
const gaussian=(x,s)=>Math.exp(-x*x/(s*s));
function closedCurve(points){return points.map((p,i)=>{const prev=points[(i+points.length-1)%points.length],next=points[(i+1)%points.length],after=points[(i+2)%points.length];return `${i?'':'M'+p.join(' ')} C${p[0]+(next[0]-prev[0])/6} ${p[1]+(next[1]-prev[1])/6} ${next[0]-(after[0]-p[0])/6} ${next[1]-(after[1]-p[1])/6} ${next.join(' ')}`}).join(' ')+' Z'}
for(let n=1;n<=3;n++){
 const tongues=Array.from({length:9},()=>({angle:rand()*Math.PI*2,reach:25+rand()*64,spread:.025+rand()*.05}));
 const points=Array.from({length:240},(_,i)=>{const a=i/240*Math.PI*2;let r=148+9*Math.sin(a*3+n)+7*Math.cos(a*7+n)+4*Math.sin(a*13);for(const t of tongues){const d=Math.atan2(Math.sin(a-t.angle),Math.cos(a-t.angle));r+=t.reach*gaussian(d,t.spread)}return[250+Math.cos(a)*r,250+Math.sin(a)*r]});
 const droplets=Array.from({length:64},()=>{const a=rand()*Math.PI*2,r=166+rand()*73,size=.7+rand()*4.2;return `<ellipse cx="${250+Math.cos(a)*r}" cy="${250+Math.sin(a)*r}" rx="${size}" ry="${size*(.7+rand()*.6)}" opacity="${.55+rand()*.4}"/>`}).join('');
 await writeFile(`public/assets/splash-${n}.svg`,`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><g fill="black"><path d="${closedCurve(points)}"/>${droplets}</g></svg>`);
}
const ring=[];
for(let layer=0;layer<9;layer++){
 const points=Array.from({length:160},(_,i)=>{const a=i/160*Math.PI*2,r=133+layer*.58+1.8*Math.sin(a*5)+.9*Math.cos(a*17)+Math.sin(a*31)*.5;return[190+Math.cos(a)*r,190+Math.sin(a)*r]});
 ring.push(`<path d="${closedCurve(points)}" fill="none" stroke="#762438" stroke-width="${.7+rand()*.8}" opacity="${.12+rand()*.24}"/>`);
}
for(let i=0;i<165;i++){const a=rand()*Math.PI*2,r=132+rand()*14;ring.push(`<circle cx="${190+Math.cos(a)*r}" cy="${190+Math.sin(a)*r}" r="${.35+rand()*1.6}" fill="#762438" opacity="${.12+rand()*.4}"/>`)}
ring.push('<path d="M59 245q-8-29 8-27t18 5q14 22-1 28t-25-6" fill="#762438" opacity=".4"/>');
await writeFile('public/assets/wine-ring.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 380">${ring.join('')}</svg>`);
console.log('Organic liquid silhouettes and a capillary wine ring saved.');
