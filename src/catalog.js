// Development-only catalog renderer. Open /?render-products=1 to regenerate.
import * as THREE from 'three';
import {createBottle,createWoodCase} from './models.js';
import {studioEnvironment,studioLighting} from './studio.js';
import {applyBottlePhoto} from './bottle-photo.js';

export async function renderCatalog(){
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true});
 renderer.setPixelRatio(2);renderer.setSize(648,756,false);renderer.setClearColor(0,0);
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.VSMShadowMap;
 const environment=studioEnvironment(renderer);
 const grain=await new THREE.TextureLoader().loadAsync('/assets/oak-grain.webp');
 grain.colorSpace=THREE.SRGBColorSpace;grain.wrapS=grain.wrapT=THREE.RepeatWrapping;
 const canvas=document.createElement('canvas');canvas.width=canvas.height=512;
 const ctx=canvas.getContext('2d');const seal=new Image();seal.src='/assets/estate-seal.svg';await seal.decode();ctx.drawImage(seal,0,0,512,512);
 const stamp=new THREE.CanvasTexture(canvas);stamp.colorSpace=THREE.SRGBColorSpace;
 for(const kind of ['wood','magnum','bottle','half','case']){
  const scene=new THREE.Scene();scene.environment=environment;
  const key=studioLighting(scene,{shadow:true});key.position.set(-3,10,5);key.shadow.radius=32;key.shadow.camera.left=key.shadow.camera.bottom=-4;key.shadow.camera.right=key.shadow.camera.top=4;key.shadow.camera.far=30;
  const model=kind==='wood'?createWoodCase(true,grain,stamp):kind==='case'?createWoodCase(false,grain,stamp):createBottle(kind==='bottle'?{}:{foil:'#847943',format:kind==='magnum'?'magnum':kind==='half'?'half':'standard'});
  const camera=new THREE.PerspectiveCamera(27,648/756,.1,100);camera.position.set(0,.22,8.7);camera.lookAt(0,0,0);
  if(kind==='bottle')model.rotation.y=-.10;
  if(['bottle','magnum','half'].includes(kind))await applyBottlePhoto(model,{gold:kind!=='bottle'});
  if(kind==='wood'||kind==='case'){camera.position.set(3.2,2.9,7.0);camera.lookAt(0,kind==='wood'?.3:-.25,0);model.position.y=-.52;scene.add(new THREE.AmbientLight('#f8edd8',.5))}
  const box=new THREE.Box3().setFromObject(model);const ground=new THREE.Mesh(new THREE.PlaneGeometry(12,12),new THREE.ShadowMaterial({color:'#302c21',opacity:.09,depthWrite:false}));ground.rotation.x=-Math.PI/2;ground.position.y=box.min.y-.003;ground.receiveShadow=true;scene.add(ground);
  scene.add(model);renderer.render(scene,camera);
  const image=document.querySelector(kind==='bottle'?'#bottle-dock img':`[data-render="${kind}"] img`);
  image.src=renderer.domElement.toDataURL('image/png');
 }
 document.body.dataset.catalog='ready';renderer.dispose();environment.dispose();
}
