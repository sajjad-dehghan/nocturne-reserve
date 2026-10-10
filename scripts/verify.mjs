import {readFile,access,readdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const html=await readFile('index.html','utf8');
const css=await readFile('src/style.css','utf8');
const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]));
for(const match of html.matchAll(/href="#([^"]+)"/g))assert(ids.has(match[1]),`Broken anchor #${match[1]}`);
const paths=new Set([...html.matchAll(/(?:src|href)="(\/(?:assets|fonts)\/[^"#]+)"/g),...css.matchAll(/url\(['"]?(\/(?:assets|fonts)\/[^)'"#]+)['"]?\)/g)].map(x=>x[1]));
for(const path of paths)await access(`public${path}`);
for(const file of await readdir('public/models')){
 const glb=await readFile(`public/models/${file}`);
 assert.equal(glb.toString('ascii',0,4),'glTF');assert.equal(glb.readUInt32LE(4),2);assert.equal(glb.readUInt32LE(8),glb.length);
 const length=glb.readUInt32LE(12),json=JSON.parse(glb.toString('utf8',20,20+length));
 assert(json.meshes.length>0,`${file}: no geometry`);
}
assert.equal([...html.matchAll(/data-product="/g)].length,5);
console.log(`Verified ${paths.size} local assets, all section links, five products and four valid GLB models.`);
