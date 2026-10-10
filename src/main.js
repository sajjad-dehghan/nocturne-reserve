import './style.css';
import * as THREE from 'three';
import {studioEnvironment,studioLighting} from './studio.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {createBottle,BOTTLE_HEIGHT} from './models.js';
import {applyBottlePhoto} from './bottle-photo.js';

gsap.registerPlugin(ScrollTrigger);
const $=(selector)=>document.querySelector(selector);
const $$=(selector)=>[...document.querySelectorAll(selector)];
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const mobile=matchMedia('(max-width: 600px)');
let scene,renderer,camera,bottle,shadow,envMap,keyLight;
let dirty=true,lastWidth=0,lastHeight=0,stageVisible=true;

async function initScene(){
 try{
   renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
   renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setClearColor(0x000000,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
   renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.VSMShadowMap;$('#bottle-stage').append(renderer.domElement);
   scene=new THREE.Scene();envMap=studioEnvironment(renderer);scene.environment=envMap;keyLight=studioLighting(scene,{shadow:true});
   camera=new THREE.OrthographicCamera(-innerWidth/2,innerWidth/2,innerHeight/2,-innerHeight/2,.1,4000);camera.position.z=1200;
   bottle=createBottle();bottle.rotation.y=-.16;scene.add(bottle);
   applyBottlePhoto(bottle).then(()=>{dirty=true;document.body.dataset.bottleRender='photographic'}).catch(()=>{document.body.dataset.bottleRender='procedural'});
   shadow=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.ShadowMaterial({color:'#28271f',opacity:.14,depthWrite:false}));shadow.receiveShadow=true;scene.add(shadow);
   renderer.domElement.addEventListener('webglcontextlost',(event)=>{event.preventDefault();document.body.classList.add('no-webgl');renderer.domElement.hidden=true;});
   renderer.domElement.addEventListener('webglcontextrestored',()=>{location.reload()});
 }catch(error){document.body.classList.add('no-webgl');console.error('3D rendering unavailable. Static product fallback enabled.',error)}
}

function clamp(x,min=0,max=1){return Math.min(max,Math.max(min,x))}
function updateScene(){
 if(!renderer||!camera||!bottle||!dirty||document.hidden)return;dirty=false;
 const w=innerWidth,h=innerHeight;
 if(w!==lastWidth||h!==lastHeight){renderer.setSize(w,h);camera.left=-w/2;camera.right=w/2;camera.top=h/2;camera.bottom=-h/2;camera.updateProjectionMatrix();lastWidth=w;lastHeight=h}
 const allocation=$('#allocation').getBoundingClientRect();const dock=$('#bottle-dock').getBoundingClientRect();const hero=$('#home').getBoundingClientRect();
 const initial=clamp(scrollY/(h*.8));
 let height=Math.min(h*.815,850),cx=w*.5,cy=h*.50,rotation=-.34*(1-initial),twist=.015+Math.sin(scrollY*.0007)*.015;
 let visible=true;
 if(mobile.matches||reducedMotion.matches){
   visible=hero.bottom>h*.18&&hero.top>-h*.85;
   height=mobile.matches?Math.min(h*.57,510):height;cy=mobile.matches?hero.top+hero.height*.64:h*.51+hero.top;rotation=reducedMotion.matches?-.31:-.31;
 }else{
   const dockProgress=clamp((h*.88-allocation.top)/(h*.62));
   const smooth=dockProgress*dockProgress*(3-2*dockProgress);
   const destinationHeight=dock.height*.83;
   height=THREE.MathUtils.lerp(height,destinationHeight,smooth);
   cx=THREE.MathUtils.lerp(cx,dock.left+dock.width/2,smooth);
   cy=THREE.MathUtils.lerp(cy,dock.top+dock.height/2,smooth);
   rotation*=1-smooth;twist=THREE.MathUtils.lerp(twist,-.13,smooth);
   visible=allocation.bottom>-200&&dock.top<h+height;
   if(allocation.top>h)visible=true;
 }
 $('#bottle-stage').classList.toggle('mobile-hidden',!visible);
 if(!visible){if(stageVisible){renderer.clear();stageVisible=false}return}stageVisible=true;
 const scale=height/BOTTLE_HEIGHT;bottle.scale.setScalar(scale);bottle.position.set(cx-w/2,h/2-cy,0);bottle.rotation.set(.012,twist,rotation);
 shadow.position.set(cx-w/2,h/2-cy,-height*.065);shadow.scale.set(height*.9,height*1.35,1);
 keyLight.position.copy(bottle.position).add(new THREE.Vector3(-height*.7,height*.8,height*1.6));keyLight.target.position.copy(bottle.position);
 const sc=keyLight.shadow.camera;sc.left=sc.bottom=-height*.7;sc.right=sc.top=height*.7;sc.near=1;sc.far=height*4;sc.updateProjectionMatrix();
 renderer.render(scene,camera);
}

function updatePage(){
 dirty=true;
 const max=document.documentElement.scrollHeight-innerHeight;$('.progress-fill').style.height=`${max>0?clamp(scrollY/max)*100:0}%`;
 const estate=$('#estate').getBoundingClientRect();const footer=$('footer').getBoundingClientRect();const dark=estate.top<80&&estate.bottom>80||footer.top<80;
 $('.masthead').classList.toggle('on-dark',dark);$('.rail').classList.toggle('on-dark',dark);
 $('.scroll-cue').classList.toggle('cue-hidden',$('#home').getBoundingClientRect().bottom<170);
}
for(const splash of $$('[data-splash]'))splash.style.setProperty('--splash',`url('/assets/splash-${splash.dataset.splash}.svg')`);
initScene();updatePage();gsap.ticker.add(updateScene);
if(import.meta.env.DEV && new URLSearchParams(location.search).has('render-products'))import('./catalog.js').then(({renderCatalog})=>renderCatalog());
addEventListener('scroll',updatePage,{passive:true});addEventListener('resize',updatePage,{passive:true});reducedMotion.addEventListener('change',updatePage);mobile.addEventListener('change',updatePage);document.addEventListener('visibilitychange',()=>{dirty=true});
const initialChapter=location.hash?document.getElementById(location.hash.slice(1)):null;
document.fonts.ready.then(()=>{ScrollTrigger.refresh();if(initialChapter&&location.hash===`#${initialChapter.id}`)initialChapter.scrollIntoView({behavior:'instant',block:'start'});updatePage()});
for(const img of $$('main img'))img.addEventListener('load',()=>{updatePage();ScrollTrigger.refresh()});
if(!reducedMotion.matches){
 gsap.fromTo('.estate-seal',{rotation:-21},{rotation:-6,ease:'none',scrollTrigger:{trigger:'#home',start:'top top',end:'bottom top',scrub:true}});
 gsap.to('.wine-ring',{rotation:24,ease:'none',scrollTrigger:{trigger:'#tasting',start:'top bottom',end:'bottom top',scrub:true}});
}

const nav=$('#navigation'),dialog=$('#content-dialog');let opener;
function openDialog(markup,trigger){opener=trigger||document.activeElement;$('#dialog-content').innerHTML=markup;const title=$('#dialog-content h2');if(title){title.id='dialog-title';dialog.setAttribute('aria-labelledby','dialog-title')}dialog.showModal();document.body.style.overflow='hidden'}
function closeDialog(target){target.close();document.body.style.overflow='';opener?.focus({preventScroll:true})}
$$('.dialog-close').forEach(btn=>btn.addEventListener('click',()=>closeDialog(btn.closest('dialog'))));
$$('dialog').forEach(el=>{el.addEventListener('click',event=>{if(event.target===el){const r=el.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeDialog(el)}});el.addEventListener('close',()=>{document.body.style.overflow='';$('.menu-trigger').setAttribute('aria-expanded','false')})});
$('.menu-trigger').addEventListener('click',event=>{opener=event.currentTarget;nav.showModal();document.body.style.overflow='hidden';event.currentTarget.setAttribute('aria-expanded','true')});
function navigateChapter(event,link,target){
 event.preventDefault();const destination=document.querySelector(link.hash);if(!destination)return;
 closeDialog(target);history.pushState(null,'',link.hash);
 requestAnimationFrame(()=>destination.scrollIntoView({behavior:reducedMotion.matches?'auto':'smooth',block:'start'}));
}
$$('#navigation a').forEach(link=>link.addEventListener('click',event=>navigateChapter(event,link,nav)));

const products={wood:{name:'Original wood',description:'Twelve 750ml bottles, presented in an open wooden estate case.'},magnum:{name:'1.5L magnum',description:'A larger format for the long table. Forty made for the release.'},bottle:{name:'750ml reserve',description:'The signature release. Single-vineyard Cabernet Sauvignon, vintage 2018.'},half:{name:'375ml half',description:'The same reserve in a smaller format. Cellar-door allocation.'},case:{name:'Six-bottle case',description:'Six 750ml bottles, sealed in a wooden estate case.'}};
function reservation(product='case',trigger){
 const selected=products[product];
 openDialog(`<p class="eyebrow">The allocation</p><h2>RESERVE A CASE</h2><p>${selected.description}</p><form id="reservation-form"><label for="format">Your format</label><select id="format" name="format">${Object.entries(products).map(([id,p])=>`<option value="${id}" ${id===product?'selected':''}>${p.name}</option>`).join('')}</select><label for="name">Your name</label><input id="name" name="name" autocomplete="name" required maxlength="100"/><label for="email">Email address</label><input id="email" name="email" type="email" autocomplete="email" required/><button type="submit" class="button burgundy">Save reservation</button><p class="small-note">This is a design study. Your reservation is saved on this device only. No order, payment or email is sent.</p><p id="reservation-status" role="status"></p></form>`,trigger);
 $('#reservation-form').addEventListener('submit',event=>{event.preventDefault();const form=new FormData(event.currentTarget);const record={format:form.get('format'),name:form.get('name'),email:form.get('email'),created:new Date().toISOString()};try{const records=JSON.parse(localStorage.getItem('nocturne-reservations')||'[]');records.push(record);localStorage.setItem('nocturne-reservations',JSON.stringify(records));$('#reservation-status').textContent=`Your ${products[record.format].name.toLowerCase()} reservation is saved on this device.`;$('#reservation-status').className='inline-notice';event.currentTarget.querySelector('button[type="submit"]').disabled=true}catch{$('#reservation-status').textContent='Your browser could not save this reservation. Please allow local storage and try again.'}});
}
$$('.reserve-trigger').forEach(btn=>btn.addEventListener('click',event=>{event.preventDefault();reservation('case',btn)}));
$$('[data-product]').forEach(btn=>btn.addEventListener('click',()=>reservation(btn.dataset.product,btn)));
const details={abv:{title:'WARM. COMPOSED.',body:'Alcohol is one part of a wine’s structure. At 14.5%, this reserve is intended to feel generous without losing its balance. Serve slightly cool, at sixteen degrees, and let the glass warm slowly in your hand.'},oak:{title:'TWENTY-TWO MONTHS.',body:'Barrique is a small oak barrel. In this illustrative reserve, one third of the barrels are new; the others have already held one or two vintages. The intention is a fine savoury frame around the fruit, rather than an overt taste of wood.'},ph:{title:'THE QUIET STRUCTURE.',body:'Acidity brings freshness and shape. The illustrative pH of 3.62 sits alongside total acidity of 5.9 g/L. Those numbers describe the structure; the glass tells the rest of the story.'}};
$$('[data-detail]').forEach(btn=>btn.addEventListener('click',()=>{const info=details[btn.dataset.detail];openDialog(`<p class="eyebrow">Reserve MMXVIII</p><h2>${info.title}</h2><p>${info.body}</p><p class="small-note">Illustrative tasting and production notes for this independent design study.</p>`,btn)}));
$('.film-trigger').addEventListener('click',event=>openDialog(`<img class="dialog-photo" src="/assets/winemaker-v3.webp" alt="An artisan working with oak barrels"/><p class="eyebrow">From the cellar</p><h2>TIME DOES THE WORK.</h2><p>The reserve’s story is one of small parcels, patient maturation and attention at every stage — from a cool night in the vineyard to the quiet of the barrel room.</p><p class="small-note">Original AI-generated editorial portrait. This reference-inspired design study does not include an original winemaker film.</p>`,event.currentTarget));
$('#pairings-trigger').addEventListener('click',event=>openDialog(`<p class="eyebrow">At the long table</p><h2>FAT. SALT. TIME.</h2><h3>RIB OF BEEF</h3><p>Over coals, rested well, with rosemary and coarse salt. Let the char meet the wine’s savoury edge.</p><h3>BONE MARROW</h3><p>On burnt toast, with parsley and a little lemon. Richness and freshness in the same mouthful.</p><h3>AGED SHEEP CHEESE</h3><p>A hard, nutty cheese at the end of the night. Serve the wine slightly cool in a generous glass.</p>`,event.currentTarget));
$('.search-trigger').addEventListener('click',event=>{openDialog(`<p class="eyebrow">Explore the estate</p><h2>WHAT BRINGS YOU?</h2><label for="estate-search">Search</label><input id="estate-search" type="search" placeholder="Try reserve, tasting or estate…"/><div id="search-results" class="search-results" aria-live="polite"></div>`,event.currentTarget);const items=[['The reserve — vintage and technical notes','#reserve','reserve wine oak abv acidity vintage'],['The character — style and winemaker','#character','character winemaker style'],['Tasting notes — fruit, cedar and flowers','#tasting','taste tasting fruit cedar violet iris'],['The allocation — bottles and cases','#allocation','allocation bottle case magnum buy reserve'],['At the table — food pairings','#table','food beef pairings table'],['The estate — vineyard and practice','#estate','estate vineyard cellar land practice']];function search(){const query=$('#estate-search').value.trim().toLowerCase();const matches=items.filter(item=>!query||`${item[0]} ${item[2]}`.toLowerCase().includes(query));$('#search-results').innerHTML=matches.length?matches.map(item=>`<a href="${item[1]}">${item[0]}</a>`).join(''):'<p>No matching chapter. Try “reserve” or “estate”.</p>';$$('#search-results a').forEach(link=>link.addEventListener('click',event=>navigateChapter(event,link,dialog)))}$('#estate-search').addEventListener('input',search);search();$('#estate-search').focus()});
const information={cellar:['THE CELLAR DOOR.','Explore the estate and its approach to the reserve. This independent design study has no operating tasting room or booking service.'],trade:['TRADE ENQUIRIES.','The case formats in this study demonstrate the product allocation experience. No real trade orders or enquiries are transmitted.'],stockists:['FIND THE RESERVE.','This is an independent visual study; there is no live stockist directory. Explore the available illustrative formats in the allocation chapter.'],press:['THE ESTATE JOURNAL.','Original generated photography and procedural 3D assets accompany this reference-inspired design study. The product narrative is illustrative.']};
$$('[data-info]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();const [title,body]=information[link.dataset.info];openDialog(`<p class="eyebrow">Nocturne Estate & Cellars</p><h2>${title}</h2><p>${body}</p>`,link)}));
$('#allocation-form').addEventListener('submit',event=>{event.preventDefault();const input=$('#allocation-email');try{localStorage.setItem('nocturne-allocation-email',input.value);$('#newsletter-status').textContent='Saved on this device. No email has been sent.';input.value=''}catch{$('#newsletter-status').textContent='This browser could not save your email. Please try again.'}});


