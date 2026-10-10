import * as THREE from 'three';

// A controlled product-photography rig: the reflected strips remain continuous
// over the long shoulder, rather than reflecting a room full of ceiling lamps.
export function studioEnvironment(renderer){
 const studio=new THREE.Scene();studio.background=new THREE.Color('#080b09');
 function panel(position,width,height,strength){
  const material=new THREE.MeshBasicMaterial({color:new THREE.Color('white').multiplyScalar(strength),side:THREE.DoubleSide,toneMapped:false});
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(width,height),material);
  mesh.position.set(...position);mesh.lookAt(0,0,0);studio.add(mesh);
 }
 panel([-2.1,1.4,4.6],.72,8,7.0);
 panel([-6.2,.5,.8],.30,6,7.0);
 panel([.6,.5,5.5],2.40,3.6,.65);
 panel([4.7,.7,2.4],.30,7,3.0);
 panel([.2,-3.2,3.0],4.0,1.2,3.0);
 panel([0,4.4,1.5],2.5,1,.60);
 const generator=new THREE.PMREMGenerator(renderer);
 const texture=generator.fromScene(studio,.012,.1,50).texture;
 generator.dispose();studio.traverse(e=>{e.geometry?.dispose();e.material?.dispose()});
 return texture;
}

export function studioLighting(scene,{shadow=false}={}){
 scene.add(new THREE.HemisphereLight('#fff9ec','#5c5547',.55));
 const key=new THREE.DirectionalLight('#fff8e8',1.8);key.position.set(-4,6,8);
 const fill=new THREE.DirectionalLight('#e6edde',.18);fill.position.set(5,2,4);
 scene.add(key,fill,key.target);
 if(shadow){
  key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.radius=18;key.shadow.blurSamples=16;
  key.shadow.bias=-.00015;key.shadow.normalBias=.03;
 }
 return key;
}
