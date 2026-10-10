import * as THREE from 'three';
import {BOTTLE_HEIGHT} from './models.js';

// A reference-guided photographic plate supplies the glass/foil detail.
// The measured 3D silhouette remains the shadow caster and editable model.
// Crop only the texture coordinates: the original alpha PNG is preserved.
const textures=new Map();
export async function applyBottlePhoto(group,{gold=false}={}){
 const path=gold?'/assets/bottle-gold-v3.webp':'/assets/bottle-photo-v3.webp';
 if(!textures.has(path))textures.set(path,new THREE.TextureLoader().loadAsync(path).then(texture=>{
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.offset.set(293/974,1-1558/1615);
  texture.repeat.set(387/974,1510/1615);
  texture.anisotropy=4;
  return texture;
 }));
 const texture=await textures.get(path);
 const shadowOnly=new THREE.MeshBasicMaterial({colorWrite:false,depthWrite:false});
 group.traverse(mesh=>{if(mesh.isMesh)mesh.material=shadowOnly});
 const artwork=new THREE.Mesh(new THREE.PlaneGeometry(BOTTLE_HEIGHT*.242,BOTTLE_HEIGHT),new THREE.MeshBasicMaterial({map:texture,color:'#eee5db',transparent:true,alphaTest:.012,depthWrite:false,toneMapped:false}));
 artwork.name='Reference-guided photographic bottle plate';artwork.position.z=.425;artwork.renderOrder=2;
 group.add(artwork);return artwork;
}
