import {readFile,access,readdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createBottle,createWoodCase} from '../src/models.js';
const html=await readFile('index.html','utf8');
const css=await readFile('src/style.css','utf8');
const photoSource=await readFile('src/bottle-photo.js','utf8');
const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]));
for(const match of html.matchAll(/href="#([^"]+)"/g))assert(ids.has(match[1]),`Broken anchor #${match[1]}`);
const paths=new Set([...html.matchAll(/(?:src|href)="(\/(?:assets|fonts)\/[^"#]+)"/g),...css.matchAll(/url\(['"]?(\/(?:assets|fonts)\/[^)'"#]+)['"]?\)/g)].map(x=>x[1]));
for(const path of paths)await access(`public${path}`);
for(const match of photoSource.matchAll(/['"](\/assets\/[^'"]+)['"]/g)){await access(`public${match[1]}`);paths.add(match[1])}
const models=(await readdir('public/models')).filter(file=>file.endsWith('.glb'));
for(const file of models){
 const glb=await readFile(`public/models/${file}`);
 assert.equal(glb.toString('ascii',0,4),'glTF');assert.equal(glb.readUInt32LE(4),2);assert.equal(glb.readUInt32LE(8),glb.length);
 const length=glb.readUInt32LE(12),json=JSON.parse(glb.toString('utf8',20,20+length));
 assert(json.meshes.length>0,`${file}: no geometry`);
}
assert.equal([...html.matchAll(/data-product="/g)].length,5);
// Regression: a smoothed shoulder must never pierce the paper wrap.
const bottle=createBottle(),body=bottle.getObjectByName('Dark green glass'),points=body.geometry.attributes.position;
for(let i=0;i<points.count;i++)if(points.getY(i)>-1.43&&points.getY(i)<-.29)assert(Math.hypot(points.getX(i),points.getZ(i))<.420,'Glass protrudes through the paper label');
assert.equal(createWoodCase(true).children.filter(child=>child.name==='Nocturne Cabernet bottle').length,12);
assert.equal(models.length,6);
console.log(`Verified ${paths.size} local assets, all section links, five products, ${models.length} valid GLB models, label clearance and twelve-bottle case.`);
