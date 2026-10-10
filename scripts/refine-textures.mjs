import {writeFile} from 'node:fs/promises';
let seed=814;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
for(let n=1;n<=3;n++){
 const shapes=[];const points=[];for(let i=0;i<70;i++){const a=i/70*Math.PI*2,r=86+rand()*22;points.push(`${250+Math.cos(a)*r},${250+Math.sin(a)*r}`)}shapes.push(`<polygon points="${points.join(' ')}"/>`);
 for(let i=0;i<25;i++){const a=rand()*6.283,r=110+rand()*103;const x=250+Math.cos(a)*r,y=250+Math.sin(a)*r;const startX=250+Math.cos(a)*65,startY=250+Math.sin(a)*65;const width=4+rand()*14;shapes.push(`<path d="M${startX} ${startY} Q${250+Math.cos(a+.05)*140} ${250+Math.sin(a+.05)*140} ${x} ${y}" fill="none" stroke="black" stroke-width="${width}" stroke-linecap="round"/>`);shapes.push(`<ellipse cx="${x}" cy="${y}" rx="${width*.65}" ry="${width*.5}"/>`)}
 for(let i=0;i<87;i++){const a=rand()*6.283,r=110+rand()*123;shapes.push(`<circle cx="${250+Math.cos(a)*r}" cy="${250+Math.sin(a)*r}" r="${1+rand()*5.8}"/>`)}
 await writeFile(`public/assets/splash-${n}.svg`,`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><g fill="black">${shapes.join('')}</g></svg>`)
}
const marks=[];for(let i=0;i<250;i++){const a=i/250*Math.PI*2,r=131+Math.sin(a*7)*4+(rand()-.5)*9;marks.push(`${190+Math.cos(a)*r},${190+Math.sin(a)*r}`)}const drops=[];for(let i=0;i<180;i++){const a=rand()*6.283,r=125+rand()*45;drops.push(`<circle cx="${190+Math.cos(a)*r}" cy="${190+Math.sin(a)*r}" r="${.5+rand()*2.8}" opacity="${.4+rand()*.5}"/>`)}
await writeFile('public/assets/wine-ring.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 380"><g fill="#762438"><polygon points="${marks.join(' ')}" fill="none" stroke="#762438" stroke-width="5" opacity=".65"/>${drops.join('')}<path d="M52 232q17-27 38-14t29 4l-12 35q-31 1-55-25" opacity=".8"/></g></svg>`);
console.log('Refined original rounded ink splashes and organic wine ring.');
