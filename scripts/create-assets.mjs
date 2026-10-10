import {mkdir,writeFile} from 'node:fs/promises';
await mkdir('public/assets',{recursive:true});await mkdir('public/fonts',{recursive:true});
let seed=8309;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
const dots=[];
for(let i=0;i<3200;i++){const x=rand()*320,y=rand()*320,r=.12+rand()*.66;dots.push(`<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${r.toFixed(2)}" fill="${i%3?'#624d31':'#fff9e5'}" opacity="${(.1+rand()*.25).toFixed(2)}"/>`)}
await writeFile('public/assets/paper-grain.svg',`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320">${dots.join('')}</svg>`);
for(let s=1;s<=3;s++){const shapes=[`<ellipse cx="250" cy="250" rx="105" ry="89"/>`];for(let i=0;i<28;i++){const a=rand()*Math.PI*2,r=110+rand()*100;const x=250+Math.cos(a)*r,y=250+Math.sin(a)*r,w=8+rand()*18;shapes.push(`<path d="M${250+Math.cos(a-0.17)*82} ${250+Math.sin(a-0.17)*82} Q${250+Math.cos(a)*130} ${250+Math.sin(a)*130} ${x} ${y} Q${x+w} ${y+w} ${250+Math.cos(a+0.17)*82} ${250+Math.sin(a+0.17)*82}Z"/>`)}for(let i=0;i<70;i++){const a=rand()*6.283,r=130+rand()*100;shapes.push(`<circle cx="${250+Math.cos(a)*r}" cy="${250+Math.sin(a)*r}" r="${1+rand()*6}"/>`)}await writeFile(`public/assets/splash-${s}.svg`,`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><g fill="black">${shapes.join('')}</g></svg>`)}
const ring=[];for(let i=0;i<220;i++){const a=i/220*Math.PI*2,r=132+(rand()-.5)*15;ring.push(`<circle cx="${190+Math.cos(a)*r}" cy="${190+Math.sin(a)*r}" r="${1+rand()*4}"/>`)}for(let i=0;i<70;i++){const a=rand()*6.283,r=135+rand()*45;ring.push(`<circle cx="${190+Math.cos(a)*r}" cy="${190+Math.sin(a)*r}" r="${rand()*3}"/>`)}ring.push('<path d="M80 261q25-40 49 2l-23 25q-15-1-26-27"/>');await writeFile('public/assets/wine-ring.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 380"><g fill="#762438" opacity=".9">${ring.join('')}</g></svg>`);
const css=await fetch('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&family=Libre+Caslon+Display&family=Cormorant+Garamond:ital,wght@1,400&display=swap',{headers:{'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'}}).then(r=>r.text());
await writeFile('public/fonts/google-fonts-source.css',css);
const names={'Anton':'anton-latin','Inter':'inter-latin','Libre Caslon Display':'caslon-latin','Cormorant Garamond':'cormorant-italic-latin'};
for(const [family,name] of Object.entries(names)){
 const blocks=[...css.matchAll(/(?:\/\* ([^*]+) \*\/\s*)?@font-face\s*\{([^}]+)\}/g)].filter(m=>m[2].includes(`'${family}'`));
 const block=blocks.find(m=>m[1]?.trim()==='latin')||blocks.at(-1);if(!block)throw Error(`Font missing: ${family}`);
 const url=block[2].match(/url\(([^)]+)\)/)[1];const buffer=await fetch(url).then(r=>{if(!r.ok)throw Error(`Font ${r.status}`);return r.arrayBuffer()});
 await writeFile(`public/fonts/${name}.woff2`,Buffer.from(buffer));console.log(`${name}: ${Math.round(buffer.byteLength/1024)} KB`);
}
await writeFile('public/fonts/LICENSES.md','Fonts: Anton, Inter, Libre Caslon Display and Cormorant Garamond. Distributed under the SIL Open Font License. Sources: https://fonts.google.com/. Original CSS source is retained alongside the fonts.');
console.log('Generated original paper, wine splash and wine ring vector textures.');
