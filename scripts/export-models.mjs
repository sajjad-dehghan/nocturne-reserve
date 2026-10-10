import {mkdir,writeFile} from 'node:fs/promises';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {createBottle,createWineGlass,createWoodCase} from '../src/models.js';
globalThis.FileReader=class{readAsArrayBuffer(blob){blob.arrayBuffer().then(data=>{this.result=data;this.onloadend?.()})}readAsDataURL(blob){blob.arrayBuffer().then(data=>{this.result=`data:${blob.type};base64,${Buffer.from(data).toString('base64')}`;this.onloadend?.()})}};
await mkdir('public/models',{recursive:true});
for(const [name,model] of [['nocturne-bottle',createBottle()],['wine-glass',createWineGlass()],['wood-case-open',createWoodCase(true)],['wood-case-sealed',createWoodCase(false)]]){
  const glb=await new GLTFExporter().parseAsync(model,{binary:true});
  await writeFile(`public/models/${name}.glb`,Buffer.from(glb));
  console.log(`${name}.glb: ${Math.round(glb.byteLength/1024)} KB`);
}
