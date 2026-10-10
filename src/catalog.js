// Development-only catalog renderer. Open /?render-products=1 to regenerate.
import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {createBottle,createWoodCase} from './models.js';

export async function renderCatalog(){
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true});
 renderer.setPixelRatio(1.5);renderer.setSize(360,420,false);renderer.setClearColor(0,0);
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
 const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();
 const environment=pmrem.fromScene(room,.035).texture;room.dispose();pmrem.dispose();
 const grain=await new THREE.TextureLoader().loadAsync('/assets/oak-grain.webp');
 grain.colorSpace=THREE.SRGBColorSpace;grain.wrapS=grain.wrapT=THREE.RepeatWrapping;
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;
 const ctx=canvas.getContext('2d');ctx.strokeStyle=ctx.fillStyle='#735334';ctx.lineWidth=3;
 ctx.beginPath();ctx.arc(256,108,70,0,Math.PI*2);ctx.stroke();ctx.font='56px Georgia';
 ctx.textAlign='center';ctx.fillText('N',256,128);ctx.font='22px Georgia';ctx.fillText('NOCTURNE',256,215);
 const stamp=new THREE.CanvasTexture(canvas);stamp.colorSpace=THREE.SRGBColorSpace;
 for(const kind of ['wood','magnum','bottle','half','case']){
  const scene=new THREE.Scene();scene.environment=environment;
  scene.add(new THREE.AmbientLight('#fff6df',.85));
  for(const [color,intensity,position] of [['#fff8e5',2.4,[-4,6,6]],['#ffffff',1.5,[5,3,-1]],['#d1dfb3',.6,[-2,-1,3]]]){
   const light=new THREE.DirectionalLight(color,intensity);light.position.set(...position);scene.add(light);
  }
  const model=kind==='wood'?createWoodCase(true,grain,stamp):kind==='case'?createWoodCase(false,grain,stamp):createBottle(kind==='bottle'?{}:{foil:'#88814d'});
  const camera=new THREE.PerspectiveCamera(29,360/420,.1,100);camera.position.set(0,.22,7.3);camera.lookAt(0,0,0);
  if(kind==='half')model.scale.setScalar(.65);
  if(kind==='magnum'){model.scale.set(1.10,1.04,1.10);model.rotation.y=.10}
  if(kind==='bottle')model.rotation.y=-.10;
  if(kind==='wood'||kind==='case'){camera.position.set(0,1.2,7);camera.lookAt(0,0,0);model.position.y=-.48}
  scene.add(model);renderer.render(scene,camera);
  const image=document.querySelector(kind==='bottle'?'#bottle-dock img':`[data-render="${kind}"] img`);
  image.src=renderer.domElement.toDataURL('image/png');
 }
 document.body.dataset.catalog='ready';renderer.dispose();environment.dispose();
}
