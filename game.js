import * as THREE from 'three';

const canvas = document.querySelector('#world');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#b9ddff');
scene.fog = new THREE.Fog('#b9ddff', 24, 70);

const camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, 0.1, 150);
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;

scene.add(new THREE.HemisphereLight(0xeaf6ff, 0x7c9cba, 2.1));
const sun = new THREE.DirectionalLight(0xfff1d6, 3.2);
sun.position.set(-8, 16, 8); sun.castShadow = true;
sun.shadow.mapSize.set(1024,1024); sun.shadow.camera.left=-25;sun.shadow.camera.right=25;sun.shadow.camera.top=25;sun.shadow.camera.bottom=-25;
scene.add(sun);

const mat=(color,roughness=.8)=>new THREE.MeshStandardMaterial({color,roughness});
const M={
  grass:mat('#9edec9'), path:mat('#f5e4d0'), water:mat('#80d5ef'), white:mat('#fffaf4'),
  blue:mat('#82b8f8'), blue2:mat('#4d83cf'), pink:mat('#ffb7d6'), lavender:mat('#c9b5f3'),
  yellow:mat('#ffdc85'), brown:mat('#a97969'), dark:mat('#394d70'), skin:mat('#f2c6a8'),
  hair:mat('#5b4564'), green:mat('#69bb91'), gold:mat('#ffcf68')
};
function mesh(geo, material, x,y,z, parent=scene){const o=new THREE.Mesh(geo,material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
function box(w,h,d,material,x,y,z,parent=scene){return mesh(new THREE.BoxGeometry(w,h,d),material,x,y,z,parent)}
function sphere(r,material,x,y,z,parent=scene){return mesh(new THREE.SphereGeometry(r,18,14),material,x,y,z,parent)}
function cylinder(rt,rb,h,material,x,y,z,parent=scene,seg=20){return mesh(new THREE.CylinderGeometry(rt,rb,h,seg),material,x,y,z,parent)}
function group(x=0,y=0,z=0){const g=new THREE.Group();g.position.set(x,y,z);scene.add(g);return g}

// Ground, island paths and plaza
box(110,.4,110,M.grass,0,-.35,0);
const plaza = cylinder(10,10,.16,M.path,0,-.08,0,scene,64);
const inner = cylinder(5.8,5.8,.12,mat('#f9ecd9'),0,.02,0,scene,64);
const fountain=group(0,0,0);
cylinder(1.6,1.8,.28,M.blue2,0,.22,-1.1,fountain,40);
cylinder(1.25,1.4,.16,M.water,0,.43,-1.1,fountain,40);
cylinder(.42,.5,.8,M.white,0,.78,-1.1,fountain,24);
sphere(.27,M.water,0,1.35,-1.1,fountain);
for(let i=0;i<12;i++){const a=i*Math.PI/6;const x=Math.cos(a)*8.2,z=Math.sin(a)*8.2;box(.9,.12,.9,M.gold,x,.1,z)}
// Paths to destinations
function pathStrip(x,z,w,d,rot=0){const p=box(w,.06,d,M.path,x,.01,z);p.rotation.y=rot;return p}
pathStrip(0,12,4,13);pathStrip(12,0,13,4);pathStrip(-12,0,13,4);pathStrip(0,-12,4,13);
pathStrip(8,8,11,2.4,-Math.PI/4);pathStrip(-8,8,11,2.4,Math.PI/4);pathStrip(8,-8,11,2.4,Math.PI/4);pathStrip(-8,-8,11,2.4,-Math.PI/4);

// Trees
function tree(x,z,s=1){const g=group(x,0,z);cylinder(.18*s,.24*s,1.6*s,M.brown,0,.7*s,0,g,10);sphere(.8*s,M.green,0,1.8*s,0,g);sphere(.55*s,M.green,-.45*s,1.55*s,.1*s,g);sphere(.52*s,mat('#8dd5a8'),.4*s,1.55*s,-.08*s,g);return g}
for(const [x,z,s] of [[-17,-13,1.2],[-19,3,1.1],[-15,17,1.3],[18,-14,1.2],[19,5,1.3],[15,17,1.1],[-8,-20,1],[8,-20,1],[-22,-7,.9],[22,11,.9]])tree(x,z,s);
function flower(x,z,color){const g=group(x,.05,z);for(let i=0;i<5;i++){const a=i*Math.PI*2/5;sphere(.12,mat(color),Math.cos(a)*.18,.18,Math.sin(a)*.18,g)}sphere(.1,M.gold,0,.18,0,g)}
for(let i=0;i<38;i++){let x=(Math.random()-.5)*40,z=(Math.random()-.5)*40;if(Math.abs(x)>11||Math.abs(z)>11)flower(x,z,['#ffb7d6','#fff1a8','#d7c8ff','#ffffff'][i%4])}

// Buildings with pastel facades, roofs, windows and signs
function building(x,z,color,roofColor,label,scale=1){
 const g=group(x,0,z);
 box(4.2*scale,3.3*scale,3.4*scale,mat(color),0,1.65*scale,0,g);
 const roof=mesh(new THREE.ConeGeometry(3.2*scale,1.8*scale,4),mat(roofColor),0,4.15*scale,0,g);roof.rotation.y=Math.PI/4;
 box(.9*scale,1.55*scale,.12,mat('#9c786c'),0,.8*scale,1.76*scale,g);
 for(const wx of [-1.25,1.25]){box(.72*scale,.8*scale,.13,M.white,wx,2.15*scale,1.76*scale,g);box(.08*scale,.8*scale,.14,M.blue2,wx,2.15*scale,1.83*scale,g);box(.72*scale,.08*scale,.14,M.blue2,wx,2.15*scale,1.83*scale,g)}
 const sign=box(2.3*scale,.45*scale,.18,M.white,0,3.15*scale,1.8*scale,g);
 // floating label
 const canvas2=document.createElement('canvas');canvas2.width=512;canvas2.height=128;const ctx=canvas2.getContext('2d');
 ctx.fillStyle='#ffffff';ctx.fillRect(0,0,512,128);ctx.fillStyle='#426ba8';ctx.font='bold 48px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,256,65);
 const tex=new THREE.CanvasTexture(canvas2);const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true}));sprite.position.set(x,4.4*scale,z+1.9*scale);sprite.scale.set(3.6*scale,.9*scale,1);scene.add(sprite);
 return g;
}
building(-13,-11,'#f9c5dc','#b68ce3','STYLE SHOP',1);
building(13,-11,'#b8d7ff','#6b9de9','MUSIC LAB',1);
building(-13,12,'#ffe1a1','#f1a7c6','RHYTHM',.9);
building(13,12,'#c9b8f5','#8bb9f8','MELODY',.9);

// floating clouds and sparkles
for(let i=0;i<12;i++){const x=(Math.random()-.5)*46,z=(Math.random()-.5)*42;const y=8+Math.random()*5;const g=group(x,y,z);g.add(sphere(.8,M.white,0,0,0,g));g.add(sphere(.58,M.white,.65,.1,0,g));g.add(sphere(.52,M.white,-.55,-.05,0,g));g.scale.setScalar(.65+Math.random()*.6)}
const sparkleMat=new THREE.MeshBasicMaterial({color:'#fff7c9'});
const sparkles=[];for(let i=0;i<55;i++){const s=mesh(new THREE.SphereGeometry(.045,8,8),sparkleMat,(Math.random()-.5)*36,1+Math.random()*7,(Math.random()-.5)*36);s.userData.phase=Math.random()*6;sparkles.push(s)}

// Avatar: cute stylized full-body character with hair, face, outfit, shoes
const avatar=group(0,0,4);
const avatarParts=new THREE.Group();avatar.add(avatarParts);
function createAvatar(){
 avatarParts.clear();
 const outfitColors=['#78aef5','#f4a9d0','#b9a4ee','#79d4c0'];
 const outfit=mat(outfitColors[state.outfit%outfitColors.length]);
 // legs
 const legL=box(.28,.82,.3,M.skin,-.23,.54,0,avatarParts);
 const legR=box(.28,.82,.3,M.skin,.23,.54,0,avatarParts);
 box(.36,.18,.55,M.white,-.23,.12,.08,avatarParts);box(.36,.18,.55,M.white,.23,.12,.08,avatarParts);
 // dress/tunic
 const dress=cylinder(.42,.68,1.15,outfit,0,1.45,0,avatarParts,24);
 dress.scale.z=.72;
 // arms
 const armL=box(.22,.78,.25,M.skin,-.57,1.72,0,avatarParts);armL.rotation.z=-.18;
 const armR=box(.22,.78,.25,M.skin,.57,1.72,0,avatarParts);armR.rotation.z=.18;
 // head and hair/hijab
 sphere(.48,M.skin,0,2.42,0,avatarParts);
 sphere(.5,mat(state.hijab?'#f8f1e7':'#63496b'),0,2.55,-.06,avatarParts).scale.set(1,.95,.88);
 if(state.hijab){const hood=sphere(.53,mat(['#f8f1e7','#9fc7f6','#f5bad6','#c4b4f1'][state.outfit%4]),0,2.49,.08,avatarParts);hood.scale.set(1.04,1.08,.96);box(.76,.48,.36,mat(['#f8f1e7','#9fc7f6','#f5bad6','#c4b4f1'][state.outfit%4]),0,2.22,.04,avatarParts).rotation.x=-.1;}
 // eyes and smile
 sphere(.055,M.dark,-.16,2.43,.42,avatarParts);sphere(.055,M.dark,.16,2.43,.42,avatarParts);
 sphere(.04,M.white,-.175,2.45,.46,avatarParts);sphere(.04,M.white,.145,2.45,.46,avatarParts);
 const smile=mesh(new THREE.TorusGeometry(.11,.025,8,16,Math.PI),mat('#bd6d7c'),0,2.27,.43,avatarParts);smile.rotation.z=Math.PI;
 sphere(.1,mat('#f49db0'),-.31,2.29,.34,avatarParts);sphere(.1,mat('#f49db0'),.31,2.29,.34,avatarParts);
 // hair fringe if no hijab
 if(!state.hijab){sphere(.32,mat('#63496b'),0,2.75,.1,avatarParts).scale.set(1.2,.48,1);sphere(.2,mat('#63496b'),-.33,2.59,.12,avatarParts);sphere(.2,mat('#63496b'),.33,2.59,.12,avatarParts);}
}
const state={started:false,outfit:0,hijab:true,coins:0,stars:0,xp:0,completed:[],sound:true,mode:'explore',instrument:'piano',recording:[],cameraAngle:0};
const saved=(()=>{try{return JSON.parse(localStorage.getItem('musicverse-save')||'{}')}catch{return {}}})();
Object.assign(state,saved);
createAvatar();
avatar.position.set(0,0,4);

// NPCs and interactive instruments
function makeNPC(x,z,color,name,role){
 const g=group(x,0,z);g.userData={name,role};
 cylinder(.35,.42,.95,mat(color),0,.65,0,g,16);
 sphere(.35,M.skin,0,1.4,0,g);
 sphere(.37,mat('#604969'),0,1.54,-.05,g).scale.set(1,.5,.9);
 sphere(.045,M.dark,-.12,1.42,.31,g);sphere(.045,M.dark,.12,1.42,.31,g);
 const marker=sphere(.13,M.gold,0,2.05,0,g);marker.userData.bob=Math.random()*5;
 return g;
}
const npcLila=makeNPC(-4,1,'#f2a8d1','Lila','guide');
const npcPiano=makeNPC(10,-7,'#8cb6f2','Mika','music');
const npcRhythm=makeNPC(-11,9,'#f2c56f','Rara','rhythm');
const interactables=[npcLila,npcPiano,npcRhythm];
function makeInstrument(x,z,type,emoji,color){
 const g=group(x,0,z);g.userData={name:type,role:'instrument',type};
 if(type==='Piano'){
  box(1.8,.5,.8,mat(color),0,.5,0,g);for(let i=0;i<8;i++)box(.19,.12,.58,M.white,-.75+i*.21,.82,.04,g);
  for(let i=0;i<5;i++)box(.1,.1,.32,M.dark,-.65+i*.42,.9,-.08,g);
 }else if(type==='Drum'){
  cylinder(.55,.55,.55,mat(color),0,.55,0,g,24);cylinder(.56,.56,.08,M.white,0,.86,0,g,24);
 }else{
  box(1.2,.18,.7,mat(color),0,.6,0,g);for(let i=0;i<7;i++)box(.12,.14,.62,mat(['#ffb8d7','#ffd879','#a8d7ff','#c7b4f5'][i%4]),-.5+i*.17,.76,0,g);
 }
 const label=sphere(.12,M.gold,0,1.5,0,g);label.userData.bob=Math.random()*5;
 return g;
}
const instruments=[makeInstrument(10,-5,'Piano','🎹','#8db7f4'),makeInstrument(11,-2,'Xylophone','🎼','#f5b4d5'),makeInstrument(8,-2,'Drum','🥁','#c8b8f2')];
interactables.push(...instruments);
function save(){const data={outfit:state.outfit,hijab:state.hijab,coins:state.coins,stars:state.stars,xp:state.xp,completed:state.completed,sound:state.sound};try{localStorage.setItem('musicverse-save',JSON.stringify(data))}catch{}}
function updateHUD(){
 document.querySelector('#coins').textContent=state.coins;document.querySelector('#stars').textContent=state.stars;
 document.querySelector('#xp').textContent=state.xp;document.querySelector('#level').textContent='Lv. '+(1+Math.floor(state.xp/100));
 document.querySelector('#questProgress').textContent=`${state.completed.length} / 3 missions`;
 document.querySelector('#progressBar').style.width=(state.completed.length/3*100)+'%';
 document.querySelector('#soundBtn').textContent=state.sound?'♫':'♪̸';
 save();
}
function toast(msg){const el=document.querySelector('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),2400)}
// Audio manager: background, effects and instrument voices routed separately.
let audioCtx=null,masterGain=null,bgGain=null,sfxGain=null,instrumentGain=null,quizGain=null,bgOsc=null;
function initAudio(){
 if(audioCtx)return;audioCtx=new (window.AudioContext||window.webkitAudioContext)();
 masterGain=audioCtx.createGain();bgGain=audioCtx.createGain();sfxGain=audioCtx.createGain();instrumentGain=audioCtx.createGain();quizGain=audioCtx.createGain();
 bgGain.gain.value=.035;sfxGain.gain.value=.35;instrumentGain.gain.value=.35;quizGain.gain.value=.5;
 bgGain.connect(masterGain);sfxGain.connect(masterGain);instrumentGain.connect(masterGain);quizGain.connect(masterGain);masterGain.connect(audioCtx.destination);
 // gentle original ambient arpeggio, no copyrighted track
 bgOsc=audioCtx.createOscillator();const bgFilter=audioCtx.createBiquadFilter();bgFilter.type='lowpass';bgFilter.frequency.value=520;bgOsc.type='sine';bgOsc.frequency.value=196;bgOsc.connect(bgFilter);bgFilter.connect(bgGain);bgOsc.start();
}
function tone(freq=440,duration=.25,wave='sine',channel='instrument'){
 if(!state.sound)return;initAudio();if(audioCtx.state==='suspended')audioCtx.resume();
 const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.type=wave;osc.frequency.value=freq;gain.gain.setValueAtTime(.0001,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(.28,audioCtx.currentTime+.02);gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+duration);
 osc.connect(gain);gain.connect(channel==='sfx'?sfxGain:channel==='quiz'?quizGain:instrumentGain);osc.start();osc.stop(audioCtx.currentTime+duration+.03);
}
function playInstrument(type){
 const notes={Piano:[261.63,329.63,392,523.25],Xylophone:[523,587,659,784],Drum:[90,120,90,140]};
 const seq=notes[type]||notes.Piano;
 if(type==='Drum'){tone(seq[Math.floor(Math.random()*seq.length)],.18,'triangle');}
 else tone(seq[Math.floor(Math.random()*seq.length)],.65,'sine');
 state.recording.push({type,freq:seq[Math.floor(Math.random()*seq.length)]});
}

// Modal UI
const panel=document.querySelector('#panel'),content=document.querySelector('#panelContent');
function openPanel(kind){
 panel.classList.remove('hidden');
 document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.panel===kind));
 if(kind==='missions') renderMissions();
 if(kind==='wardrobe') renderWardrobe();
 if(kind==='music') renderMusicLab();
 if(kind==='world') renderWorldPanel();
}
function renderWorldPanel(){content.innerHTML=`<div class="eyebrow">MELODY TOWN</div><h2>Explore your world ✨</h2><p>Melody Town adalah titik awal petualanganmu. Temui karakter, cari instrumen, dan selesaikan misi musik.</p><div class="music-note"><div class="notes">♫ ♪ ♬</div><p>Tips: dekati karakter atau instrumen, lalu tekan <b>E</b> untuk berinteraksi.</p></div><button class="primary-btn" id="goExplore">Lanjut Jelajah <span>→</span></button>`;content.querySelector('#goExplore').onclick=()=>panel.classList.add('hidden')}
function renderMissions(){
 const missions=[
  {id:'meet',icon:'💫',name:'Meet Lila',desc:'Temui pemandu di tengah plaza.',reward:'20 XP · 5 coins'},
  {id:'rhythm',icon:'🥁',name:'Rhythm Explorer',desc:'Belajar membedakan tempo cepat dan lambat.',reward:'30 XP · 1 star'},
  {id:'sound',icon:'🎹',name:'Sound Collector',desc:'Coba bunyi dari tiga instrumen musik.',reward:'50 XP · 2 stars'}
 ];
 content.innerHTML=`<div class="eyebrow">QUEST JOURNAL</div><h2>Your Missions</h2><p>Selesaikan misi untuk mengumpulkan XP, coins, dan stars.</p><div class="mission-list">${missions.map(m=>`<div class="mission ${state.completed.includes(m.id)?'done':''}"><div class="mission-icon">${m.icon}</div><div><b>${m.name} ${state.completed.includes(m.id)?'✓':''}</b><small>${m.desc}<br>${m.reward}</small></div><button data-mission="${m.id}" ${state.completed.includes(m.id)?'disabled':''}>${state.completed.includes(m.id)?'Done':'Start'}</button></div>`).join('')}</div>`;
 content.querySelectorAll('[data-mission]').forEach(b=>b.onclick=()=>startMission(b.dataset.mission));
}
function startMission(id){
 if(id==='meet'){const d=avatar.position.distanceTo(npcLila.position);if(d>4){toast('Dekati Lila di tengah plaza dulu!');return}completeMission(id,20,5,0,'Kamu bertemu Lila! Misi selesai.');}
 if(id==='rhythm'){
  content.innerHTML=`<div class="eyebrow">RHYTHM EXPLORER</div><h2>Tempo Challenge 🥁</h2><p>Tempo adalah cepat atau lambatnya ketukan musik. Dengarkan contoh, lalu pilih tempo yang cocok.</p><div class="music-note"><div class="notes">♪ ♪ ♪ ♪</div><p>Contoh tempo cepat</p><button class="soft-btn" id="fastPlay">▶ Dengarkan cepat</button> <button class="soft-btn" id="slowPlay">▶ Dengarkan lambat</button></div><div class="mission-list"><button class="primary-btn" id="fastAnswer">Tempo cepat <span>→</span></button><button class="primary-btn" id="slowAnswer">Tempo lambat <span>→</span></button></div>`;
  content.querySelector('#fastPlay').onclick=()=>[0,1,2,3].forEach((n)=>setTimeout(()=>tone(500,.1,'square','quiz'),n*150));
  content.querySelector('#slowPlay').onclick=()=>[0,1,2,3].forEach((n)=>setTimeout(()=>tone(360,.2,'sine','quiz'),n*500));
  content.querySelector('#fastAnswer').onclick=()=>completeMission(id,30,0,1,'Betul! Ketukan cepat terdengar lebih rapat.');
  content.querySelector('#slowAnswer').onclick=()=>toast('Coba dengarkan contoh tempo sekali lagi ya!');
 }
 if(id==='sound'){renderMusicLab(true)}
}
function completeMission(id,xp,coins,stars,msg){
 if(state.completed.includes(id)){toast('Misi ini sudah selesai!');return}
 state.completed.push(id);state.xp+=xp;state.coins+=coins;state.stars+=stars;updateHUD();toast(msg);renderMissions();
}
function renderWardrobe(){
 const looks=[['Sky Blue','#78aef5'],['Candy Pink','#f4a9d0'],['Dream Lilac','#b9a4ee'],['Seafoam','#79d4c0']];
 content.innerHTML=`<div class="eyebrow">STYLE STUDIO</div><h2>Dress up your avatar ♡</h2><p>Pilih warna outfit dan gaya karakter favoritmu.</p><div class="wardrobe-grid">${looks.map((l,i)=>`<button class="wardrobe-item ${state.outfit===i?'selected':''}" data-look="${i}"><div class="swatch" style="background:linear-gradient(135deg,${l[1]},#fff)"></div><b>${l[0]}</b><small>${state.outfit===i?'Equipped':'Free style'}</small></button>`).join('')}</div><button class="primary-btn" id="hijabToggle">${state.hijab?'✓ Hijab style: On':'Hijab style: Off'} <span>↻</span></button>`;
 content.querySelectorAll('[data-look]').forEach(b=>b.onclick=()=>{state.outfit=Number(b.dataset.look);createAvatar();renderWardrobe();save();toast('Outfit baru dipakai!')});
 content.querySelector('#hijabToggle').onclick=()=>{state.hijab=!state.hijab;createAvatar();renderWardrobe();save()};
}
function renderMusicLab(fromMission=false){
 state.mode='instrument';if(bgGain)bgGain.gain.setTargetAtTime(0,audioCtx.currentTime,.1);
 content.innerHTML=`<div class="eyebrow">INSTRUMENT ISLAND</div><h2>Music Lab ♫</h2><p>Sentuh instrumen untuk mendengar bunyinya. Coba semuanya dan temukan suara favoritmu!</p><div class="instrument-grid">${[['Piano','🎹','Nada jernih'],['Xylophone','🎼','Nada ceria'],['Drum','🥁','Ketukan ritmis']].map(i=>`<button class="instrument" data-inst="${i[0]}"><span class="emoji">${i[1]}</span><b>${i[0]}</b><small>${i[2]}</small></button>`).join('')}</div><div class="music-note"><div class="notes">♫ ♪ ♫</div><p id="recordText">Coba bunyikan instrumen, lalu putar pola bunyimu.</p><div style="display:flex;gap:8px;margin-top:12px"><button class="soft-btn" id="playPattern">▶ Play pattern</button><button class="soft-btn" id="clearPattern">Clear</button></div></div><button class="primary-btn" id="finishSound">Selesai & kembali <span>→</span></button>`;
 content.querySelectorAll('[data-inst]').forEach(b=>b.onclick=()=>{content.querySelectorAll('[data-inst]').forEach(x=>x.classList.toggle('selected',x===b));playInstrument(b.dataset.inst);content.querySelector('#recordText').textContent=`Kamu mencoba ${b.dataset.inst}! Bunyi instrumen ditambahkan ke pola.`;if(fromMission && ['Piano','Xylophone','Drum'].every(t=>state.recording.some(r=>r.type===t))){completeMission('sound',50,0,2,'Keren! Kamu mencoba tiga instrumen.');fromMission=false}});
 content.querySelector('#playPattern').onclick=()=>{if(!state.recording.length){toast('Pilih instrumen dulu!');return}state.recording.forEach((r,i)=>setTimeout(()=>tone(r.freq,.35,'sine'),i*420));};
 content.querySelector('#clearPattern').onclick=()=>{state.recording=[];content.querySelector('#recordText').textContent='Pola bunyi dibersihkan. Coba lagi!';};
 content.querySelector('#finishSound').onclick=()=>{state.mode='explore';if(bgGain&&audioCtx)bgGain.gain.setTargetAtTime(.035,audioCtx.currentTime,.3);panel.classList.add('hidden');if(fromMission && !state.completed.includes('sound'))toast('Coba semua 3 instrumen untuk menyelesaikan misi!')};
}
document.querySelector('#closePanel').onclick=()=>{panel.classList.add('hidden');state.mode='explore';if(bgGain&&audioCtx)bgGain.gain.setTargetAtTime(.035,audioCtx.currentTime,.3)};
document.querySelectorAll('.nav-item').forEach(b=>b.onclick=()=>openPanel(b.dataset.panel));
document.querySelector('#questBtn').onclick=()=>openPanel('missions');
document.querySelector('#soundBtn').onclick=()=>{state.sound=!state.sound;if(masterGain)masterGain.gain.value=state.sound?1:0;document.querySelector('#soundBtn').textContent=state.sound?'♫':'♪̸';if(state.sound)initAudio();save();toast(state.sound?'Sound on':'Sound muted')};
document.querySelector('#startBtn').onclick=()=>{state.started=true;document.querySelector('#welcome').classList.add('hidden');initAudio();updateHUD();toast('Petualangan dimulai! Temui Lila ✨')};

// Controls, third-person camera, keyboard and touch
const keys={};let nearest=null;let cameraYaw=0;let cameraPitch=.28;let dragging=false,lastX=0,lastY=0;
addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(e.key.toLowerCase()))e.preventDefault();if(e.key.toLowerCase()==='e')interact();if(e.key==='Escape'){panel.classList.add('hidden');state.mode='explore'}});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
canvas.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(!dragging)return;cameraYaw-=(e.clientX-lastX)*.004;cameraPitch=Math.max(-.05,Math.min(.65,cameraPitch+(e.clientY-lastY)*.002));lastX=e.clientX;lastY=e.clientY});
canvas.addEventListener('pointerup',()=>dragging=false);
function interact(){
 if(!nearest){toast('Dekati karakter atau instrumen untuk berinteraksi.');return}
 if(nearest.userData.role==='guide'){
  if(!state.completed.includes('meet'))completeMission('meet',20,5,0,'Lila: Hai! Selamat datang di Melody Town. Ayo jelajahi musik!');
  else toast('Lila: Jangan lupa mencoba Rhythm Explorer dan Music Lab!');
  openPanel('missions');
 }else if(nearest.userData.role==='rhythm'){startMission('rhythm');openPanel('missions')}
 else if(nearest.userData.role==='music'){openPanel('music')}
 else if(nearest.userData.role==='instrument'){openPanel('music');toast(`Pilih ${nearest.userData.name} di Music Lab!`)}
}
function updateMovement(dt){
 if(!state.started||!panel.classList.contains('hidden'))return;
 const f=(keys.w||keys.arrowup?1:0)-(keys.s||keys.arrowdown?1:0);
 const side=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0);
 if(!f&&!side)return;
 const speed=(keys.shift?7:4.2)*dt;
 const forward=new THREE.Vector3(-Math.sin(cameraYaw),0,-Math.cos(cameraYaw));
 const right=new THREE.Vector3(Math.cos(cameraYaw),0,-Math.sin(cameraYaw));
 avatar.position.addScaledVector(forward,f*speed);avatar.position.addScaledVector(right,side*speed);
 avatar.position.x=THREE.MathUtils.clamp(avatar.position.x,-24,24);avatar.position.z=THREE.MathUtils.clamp(avatar.position.z,-24,24);
 const dir=new THREE.Vector3(forward.x*f+right.x*side,0,forward.z*f+right.z*side);if(dir.lengthSq())avatar.rotation.y=Math.atan2(dir.x,dir.z);
 avatarParts.position.y=Math.abs(Math.sin(performance.now()*.012))*.045;
}
let prev=performance.now();
function animate(now){
 requestAnimationFrame(animate);const dt=Math.min((now-prev)/1000,.04);prev=now;
 updateMovement(dt);
 const target=new THREE.Vector3(avatar.position.x,1.3,avatar.position.z);
 const dist=9.5;camera.position.set(target.x+Math.sin(cameraYaw)*dist, target.y+3.4+cameraPitch*4,target.z+Math.cos(cameraYaw)*dist);camera.lookAt(target);
 // Soft motion and bobbing markers
 const t=now*.001;interactables.forEach(o=>{const m=o.children[o.children.length-1];if(m&&m.userData.bob!==undefined)m.position.y=(o.userData.role==='guide'?2.05:1.5)+Math.sin(t*2+m.userData.bob)*.12});
 sparkles.forEach(s=>{s.position.y+=Math.sin(t+s.userData.phase)*.0008;s.scale.setScalar(.7+.3*Math.sin(t*2+s.userData.phase))});
 nearest=null;let min=3.3;for(const o of interactables){const d=avatar.position.distanceTo(o.position);if(d<min){min=d;nearest=o}}
 const hint=document.querySelector('#hint');hint.classList.toggle('show',!!nearest&&state.started&&panel.classList.contains('hidden'));
 if(nearest)hint.innerHTML=`<kbd>E</kbd> ${nearest.userData.name||nearest.userData.type||'Interaksi'}`;
 renderer.render(scene,camera);
}
requestAnimationFrame(animate);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
updateHUD();
