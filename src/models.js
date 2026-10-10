import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

export const BOTTLE_HEIGHT = 3.5;

function turnedGeometry(profile,segments=96,samples=96){
 const curve=new THREE.CatmullRomCurve3(profile.map(([r,y])=>new THREE.Vector3(r,y,0)),false,'centripetal');
 return new THREE.LatheGeometry(curve.getPoints(samples).map(p=>new THREE.Vector2(Math.max(0,p.x),p.y)),segments);
}

let paperTexture;
function uncoatedPaper(){
 if(typeof document==='undefined')return null;
 if(paperTexture)return paperTexture;
 const canvas=document.createElement('canvas');canvas.width=canvas.height=256;
 const ctx=canvas.getContext('2d'),pixels=ctx.createImageData(256,256);let seed=1824;
 for(let i=0;i<pixels.data.length;i+=4){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const value=248+(seed%8);pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=value;pixels.data[i+3]=255}
 ctx.putImageData(pixels,0,0);paperTexture=new THREE.CanvasTexture(canvas);paperTexture.colorSpace=THREE.SRGBColorSpace;
 paperTexture.wrapS=paperTexture.wrapT=THREE.RepeatWrapping;paperTexture.repeat.set(3,1);return paperTexture;
}

export function createBottle({ foil = '#690d14', label = '#d8ceb6', format='standard', detail=96 } = {}) {
  const group = new THREE.Group();
  group.name = 'Nocturne Cabernet bottle';
  const profile = [[0,.09],[.15,.09],[.25,.036],[.30,.032],[.332,.057],[.349,.115],[.353,.23],[.353,.40],[.353,.65],[.353,.9],[.353,1.15],[.353,1.35],[.353,1.46],[.350,1.61],[.330,1.79],[.296,1.98],[.254,2.18],[.205,2.38],[.162,2.57],[.134,2.72],[.125,2.84],[.125,3.43],[.134,3.45],[.134,3.49],[0,3.5]];
  const geo = turnedGeometry(profile,detail,96);
  geo.translate(0,-BOTTLE_HEIGHT/2,0);
  const glass = new THREE.MeshPhysicalMaterial({color:'#030b05',metalness:0,roughness:.055,clearcoat:1,clearcoatRoughness:.035,ior:1.52,envMapIntensity:1.05});
  const body = new THREE.Mesh(geo,glass);body.name='Dark green glass';group.add(body);
  const foilMaterial = new THREE.MeshPhysicalMaterial({color:foil,metalness:.58,roughness:.31,clearcoat:.18,clearcoatRoughness:.24,envMapIntensity:1});
  const cap= new THREE.Mesh(turnedGeometry([[.127,2.78],[.130,2.785],[.132,2.81],[.132,3.36],[.138,3.405],[.144,3.42],[.144,3.463],[.139,3.485],[.115,3.497],[0,3.5]],detail,48),foilMaterial);
  cap.position.y=-BOTTLE_HEIGHT/2;cap.name='Rolled metallic capsule with curved lip';group.add(cap);
  for(const [y,r] of [[3.365,.133],[2.798,.132]]){const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.0023,6,detail),foilMaterial);ring.rotation.x=Math.PI/2;ring.position.y=y-BOTTLE_HEIGHT/2;group.add(ring)}
  const labelGeo = new THREE.CylinderGeometry(.355,.355,1.155,detail,1,true,0,Math.PI*2);
  const paperMap=uncoatedPaper();
  const paper = new THREE.MeshStandardMaterial({color:label,roughness:.97,metalness:0,map:paperMap,bumpMap:paperMap,bumpScale:.00035,side:THREE.DoubleSide});
  const labelMesh=new THREE.Mesh(labelGeo,paper);labelMesh.position.y=.895-BOTTLE_HEIGHT/2;labelMesh.name='Warm uncoated paper, full wrap';group.add(labelMesh);
  const seam=new THREE.Mesh(new THREE.BoxGeometry(.002,1.154,.002),paper);seam.position.set(0,.895-BOTTLE_HEIGHT/2,-.356);group.add(seam);
  if(format==='magnum')group.scale.set(1.27,1.12,1.27);
  if(format==='half')group.scale.set(.76,.76,.76);
  group.traverse(mesh=>{if(mesh.isMesh){mesh.castShadow=true;mesh.receiveShadow=false}});
  return group;
}

export function createWineGlass(){
  const group=new THREE.Group();group.name='Stemmed red wine glass';
  const glass=new THREE.MeshPhysicalMaterial({color:'#fffef9',roughness:.035,transmission:1,thickness:.026,ior:1.5,metalness:0,envMapIntensity:1.1,side:THREE.DoubleSide});
  const bowlProfile=[[.09,1.2],[.17,1.28],[.28,1.37],[.39,1.52],[.43,1.73],[.44,1.95],[.42,2.18],[.39,2.41],[.35,2.64],[.34,2.70],[.329,2.7],[.34,2.63],[.38,2.40],[.41,2.17],[.43,1.95],[.42,1.74],[.38,1.53],[.27,1.39],[.16,1.30],[.08,1.23]];
  const bowl=new THREE.Mesh(turnedGeometry(bowlProfile,112,100),glass);group.add(bowl);
  const stem=new THREE.Mesh(turnedGeometry([[.065,.11],[.033,.20],[.020,.31],[.018,1.06],[.025,1.16],[.072,1.235]],64,48),glass);group.add(stem);
  const baseProfile=[[0,.025],[.37,.025],[.40,.04],[.40,.06],[.36,.085],[.16,.105],[.04,.14]];
  group.add(new THREE.Mesh(turnedGeometry(baseProfile,112,48),glass));
  const wineMat=new THREE.MeshPhysicalMaterial({color:'#420511',roughness:.055,metalness:0,transmission:.12,thickness:.16,attenuationColor:'#6f1023',attenuationDistance:.4,ior:1.345,clearcoat:.25,clearcoatRoughness:.045,envMapIntensity:.9});
  const wineProfile=[[0,1.23],[.08,1.23],[.16,1.30],[.27,1.39],[.38,1.53],[.413,1.74],[0,1.74]];
  const wine=new THREE.Mesh(new THREE.LatheGeometry(wineProfile.map(([r,y])=>new THREE.Vector2(r,y)),80),wineMat);wine.name='Cabernet in bowl';group.add(wine);
  const surface=new THREE.Mesh(new THREE.CircleGeometry(.412,80),wineMat);surface.rotation.x=-Math.PI/2;surface.position.y=1.741;group.add(surface);
  group.position.y=-1.35;
  return group;
}

export function createWoodCase(open=false,grain=null,stamp=null){
 const group=new THREE.Group();group.name=open?'Twelve-bottle hinged oak case':'Six-bottle sealed oak case';
 const wood=new THREE.MeshStandardMaterial({color:'#efe3ce',roughness:.83,map:grain,bumpMap:grain,bumpScale:.004});
 const endGrain=new THREE.MeshStandardMaterial({color:'#c5b397',roughness:.91,map:grain,bumpMap:grain,bumpScale:.005});
 const metal=new THREE.MeshStandardMaterial({color:'#514b3c',metalness:.32,roughness:.68});
 const w=2.62,h=open?1.02:.70,d=2.29,t=.075,geometryCache=new Map();
 function board(x,y,z,px,py,pz,mat=wood,parent=group){
  const id=[x,y,z].join(':');if(!geometryCache.has(id))geometryCache.set(id,new RoundedBoxGeometry(x,y,z,2,Math.min(.012,x/5,y/5,z/5)));
  const mesh=new THREE.Mesh(geometryCache.get(id),mat);mesh.position.set(px,py,pz);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
 }
 board(w,t,d,0,-h/2,0);
 // Visible horizontal board joints and thicker end pieces give the case real construction.
 for(let row=0;row<2;row++)for(const z of [-d/2,d/2])board(w,h/2-.007,t,0,-h/4+row*h/2,z);
 for(const x of [-w/2,w/2])board(t,h,d,x,0,0,endGrain);
 const lid=new THREE.Group();lid.position.set(0,h/2,-d/2);group.add(lid);
 for(let plank=0;plank<4;plank++)board(w/4-.008,t,d,-w*.375+plank*w/4,0,d/2,wood,lid);
 for(const x of [-.83,.83])board(.13,.045,d-.12,x,-.058,d/2,endGrain,lid);
 if(open){
  lid.rotation.x=-1.19;
  const prototype=createBottle({foil:'#7e703c',detail:48});
  // Six full-size horizontal bottles per layer, two layers; the caps face the opening.
  for(let row=0;row<2;row++)for(let i=0;i<6;i++){
   const bottle=prototype.clone();bottle.scale.setScalar(.565);bottle.rotation.x=-Math.PI/2;
   bottle.position.set(-1.015+i*.406,-.235+row*.38,.005);group.add(bottle);
  }
  for(let i=0;i<5;i++)board(.018,.39,d-.15,-.812+i*.406,.12,0,endGrain);
  for(const x of [-.85,.85]){board(.18,.018,.21,x,h/2+.01,-d/2,metal);board(.18,.14,.018,x,h/2+.045,-d/2-.01,metal)}
 }else{
  for(const x of [-.94,.94]){
   for(const z of [-d/2-.043,d/2+.043])board(.085,h+.086,.018,x,0,z,metal);
   for(const y of [-h/2-.05,h/2+.05])board(.085,.018,d+.10,x,y,0,metal);
  }
 }
 if(stamp){const mark=new THREE.Mesh(new THREE.PlaneGeometry(.60,.60),new THREE.MeshBasicMaterial({map:stamp,transparent:true,opacity:.63,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}));mark.position.set(0,0,d/2+t/2+.002);group.add(mark)}
 const nailGeometry=new THREE.SphereGeometry(.012,8,6);
 for(const x of [-w/2+.12,w/2-.12])for(const y of [-h/2+.09,h/2-.09])for(const z of [-d/2-t/2-.006,d/2+t/2+.006]){const nail=new THREE.Mesh(nailGeometry,metal);nail.position.set(x,y,z);group.add(nail)}
 group.rotation.set(0,-.22,0);
 return group;
}
