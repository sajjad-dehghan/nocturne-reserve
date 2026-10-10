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
 panel([-3.8,1.4,4.6],.32,8,4.0);
 panel([-4.6,.5,2.7],2.1,6,.30);
 panel([3.5,.7,4.2],3.0,5,.12);
 panel([-.6,-3.2,3.0],3.0,1.15,1.1);
 panel([0,4.4,1.5],2.5,1,.28);
 const generator=new THREE.PMREMGenerator(renderer);
 const texture=generator.fromScene(studio,.035,.1,50).texture;
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
