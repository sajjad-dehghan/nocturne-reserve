import * as THREE from 'three';

export const BOTTLE_HEIGHT = 3.35;

export function createBottle({ foil = '#490916', label = '#cbbfa5' } = {}) {
  const group = new THREE.Group();
  group.name = 'Nocturne Cabernet bottle';
  const profile = [[0,0],[.29,0],[.36,.015],[.397,.05],[.406,.13],[.409,.30],[.408,1.53],[.398,1.72],[.368,1.86],[.313,2.01],[.242,2.18],[.185,2.32],[.151,2.46],[.145,2.63],[.145,3.28],[.153,3.30],[.153,3.34],[0,3.35]];
  const geo = new THREE.LatheGeometry(profile.map(([r,y]) => new THREE.Vector2(r,y)),96);
  geo.translate(0,-BOTTLE_HEIGHT/2,0);
  const glass = new THREE.MeshPhysicalMaterial({color:'#030702',metalness:.12,roughness:.12,clearcoat:.8,clearcoatRoughness:.10,ior:1.52,envMapIntensity:.8});
  const body = new THREE.Mesh(geo,glass);body.name='Dark green glass';group.add(body);
  const foilMaterial = new THREE.MeshPhysicalMaterial({color:foil,metalness:.64,roughness:.28,clearcoat:.35,clearcoatRoughness:.2});
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(.159,.153,.69,80),foilMaterial);cap.position.y=2.982-BOTTLE_HEIGHT/2;cap.name='Burgundy foil capsule';group.add(cap);
  const top = new THREE.Mesh(new THREE.CylinderGeometry(.157,.157,.015,80),foilMaterial);top.position.y=3.332-BOTTLE_HEIGHT/2;group.add(top);
  for(const y of [3.24,3.11,2.65]){const ring = new THREE.Mesh(new THREE.TorusGeometry(.158,.0055,8,80),foilMaterial);ring.rotation.x=Math.PI/2;ring.position.y=y-BOTTLE_HEIGHT/2;group.add(ring)}
  const labelGeo = new THREE.CylinderGeometry(.414,.414,1.16,96,1,true,0,Math.PI*2);
  const paper = new THREE.MeshStandardMaterial({color:label,roughness:.94,metalness:0,side:THREE.DoubleSide});
  const labelMesh=new THREE.Mesh(labelGeo,paper);labelMesh.position.y=.995-BOTTLE_HEIGHT/2;labelMesh.name='Unprinted cream paper label — reference match';group.add(labelMesh);
  return group;
}

export function createWineGlass(){
  const group=new THREE.Group();group.name='Stemmed red wine glass';
  const glass=new THREE.MeshPhysicalMaterial({color:'#fffaf0',roughness:.025,transmission:.96,thickness:.025,ior:1.48,metalness:0,transparent:true,opacity:.74,envMapIntensity:1.5,side:THREE.DoubleSide});
  const bowlProfile=[[.09,1.2],[.17,1.28],[.28,1.37],[.39,1.52],[.43,1.73],[.44,1.95],[.42,2.18],[.39,2.41],[.35,2.64],[.34,2.70],[.329,2.7],[.34,2.63],[.38,2.40],[.41,2.17],[.43,1.95],[.42,1.74],[.38,1.53],[.27,1.39],[.16,1.30],[.08,1.23]];
  const bowl=new THREE.Mesh(new THREE.LatheGeometry(bowlProfile.map(([r,y])=>new THREE.Vector2(r,y)),80),glass);group.add(bowl);
  const stem=new THREE.Mesh(new THREE.CylinderGeometry(.028,.034,1.19,32),glass);stem.position.y=.62;group.add(stem);
  const baseProfile=[[0,.025],[.37,.025],[.40,.04],[.40,.06],[.36,.085],[.16,.105],[.04,.14]];
  group.add(new THREE.Mesh(new THREE.LatheGeometry(baseProfile.map(([r,y])=>new THREE.Vector2(r,y)),80),glass));
  const wineMat=new THREE.MeshPhysicalMaterial({color:'#440816',roughness:.09,metalness:.12,clearcoat:1,clearcoatRoughness:.03,envMapIntensity:.9});
  const wineProfile=[[0,1.23],[.08,1.23],[.16,1.30],[.27,1.39],[.38,1.53],[.413,1.74],[0,1.74]];
  const wine=new THREE.Mesh(new THREE.LatheGeometry(wineProfile.map(([r,y])=>new THREE.Vector2(r,y)),80),wineMat);wine.name='Cabernet in bowl';group.add(wine);
  const surface=new THREE.Mesh(new THREE.CircleGeometry(.412,80),wineMat);surface.rotation.x=-Math.PI/2;surface.position.y=1.741;group.add(surface);
  group.position.y=-1.35;
  return group;
}

export function createWoodCase(open=false,grain=null,stamp=null){
  const group=new THREE.Group();group.name=open?'Twelve-bottle open wooden case':'Six-bottle sealed wooden case';
  const wood=new THREE.MeshStandardMaterial({color:'#ba9970',roughness:.86,map:grain,bumpMap:grain,bumpScale:.009});
  const pale=new THREE.MeshStandardMaterial({color:'#d6bd94',roughness:.92,map:grain,bumpMap:grain,bumpScale:.012});
  const dark=new THREE.MeshStandardMaterial({color:'#51432e',roughness:.94});
  const w=2.9,h=open?.84:1.35,d=1.35;
  function box(x,y,z,px,py,pz,mat=wood){const mesh=new THREE.Mesh(new THREE.BoxGeometry(x,y,z),mat);mesh.position.set(px,py,pz);group.add(mesh);return mesh}
  box(w,.12,d,0,-h/2,0,pale);box(w,h,.11,0,0,d/2,pale);box(w,h,.11,0,0,-d/2,pale);box(.11,h,d,-w/2,0,0,pale);box(.11,h,d,w/2,0,0,pale);
  if(open){const lid=box(w,.12,d,0,.96,-.68,pale);lid.rotation.x=.99;const prototype=createBottle({foil:'#77693c'});for(let i=0;i<4;i++)for(let j=0;j<3;j++){const bottle=prototype.clone();bottle.scale.setScalar(.15);bottle.rotation.x=Math.PI/2;bottle.position.set(-1.1+i*.72,.08,-.35+j*.35);group.add(bottle)}for(let i=0;i<5;i++)box(.035,.53,d-.12,-1.39+i*.69,-.05,0,wood)}else{box(w,.10,d,0,h/2,0,pale);for(const x of [-1.04,1.04]){box(.13,h+.1,.035,x,0,d/2+.075,dark);box(.13,.025,d+.1,x,h/2+.075,0,dark)}}
  // Individual grain filaments make the wood readable at catalog scale.
  if(!grain)for(let i=0;i<48;i++){const y=-h/2+.045+(i%24)*(h/24);const line=box(w*.91,.004,.005,Math.sin(i*17)*.02,y,d/2+.06,i%4===0?dark:wood);line.rotation.z=Math.sin(i*9)*.005}
  if(stamp){const mark=new THREE.Mesh(new THREE.PlaneGeometry(open?.75:1.02,open?.4:.56),new THREE.MeshBasicMaterial({map:stamp,transparent:true,opacity:.58,depthWrite:false}));mark.position.set(0,0,d/2+.062);group.add(mark)}
  for(const x of [-w/2+.09,w/2-.09])for(const y of [-h/2+.1,h/2-.1]){const nail=new THREE.Mesh(new THREE.SphereGeometry(.018,8,8),dark);nail.position.set(x,y,d/2+.08);group.add(nail)}
  group.rotation.set(.21,-.23,-.025);
  return group;
}
