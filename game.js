const $=id=>document.getElementById(id),canvas=$('game'),ctx=canvas.getContext('2d');
const worlds=[
{name:'Tokyo',title:'Tokyo, after dark.',label:'TOKYO NIGHTS',sub:'Ramen, lanternes & néons',icon:'◈',bg:'#27233e',road:'#34344d',side:'#42345a',accent:'#fd7dac',window:'#ffb976',kind:'city',speed:1.05},
{name:'Brésil',title:'Sous le soleil de Rio.',label:'BRÉSIL / COSTA DO SOL',sub:'Kiosques, cocos & parasols',icon:'☀',bg:'#b6d9c1',road:'#6a777b',side:'#e9c79b',accent:'#6fd5b8',window:'#ffe49d',kind:'beach',speed:1.1},
{name:'Paris',title:'Un rendez-vous à Paris.',label:'PARIS / HEURE DORÉE',sub:'Seine, péniches & boulangeries',icon:'♜',bg:'#b49aab',road:'#68606f',side:'#bda49b',accent:'#ffd7a5',window:'#ffdfa0',kind:'paris',speed:1},
{name:'Mexique',title:'Corazón en la carretera.',label:'MEXIQUE / RUTA DEL SOL',sub:'Taquerías & guirlandes',icon:'✹',bg:'#c59776',road:'#806866',side:'#dba57b',accent:'#f3b563',window:'#ffdc8a',kind:'desert',speed:1.15},
{name:'Indonésie',title:'Là où la jungle respire.',label:'INDONÉSIE / TROPICAL RUN',sub:'Warungs, rizières & temples',icon:'❀',bg:'#538b77',road:'#646d66',side:'#729759',accent:'#b3d889',window:'#ffd5a0',kind:'jungle',speed:1.08}];
let selected=0,mode='ready',distance=0,score=0,hp=3,x=0,target=0,objects=[],spawn=0,scroll=0,invincible=0,last=0,keys={},muted=true,audio,records={};try{records=JSON.parse(localStorage.getItem('love-drivin-hearts-v2')||'{}')}catch{}
// Each city owns a looping audio track. Files are selected locally, without upload.
const music=new Audio();music.loop=true;music.volume=.45;
const tracks=Array(5).fill(null);let musicCity=-1;
function syncMusic(){
if(musicCity!==selected){music.pause();musicCity=selected;music.removeAttribute('src');if(tracks[selected]){music.src=tracks[selected];music.load()}}
if(muted||document.hidden||!['running','ending'].includes(mode)||!tracks[selected]){music.pause();return}
music.play().catch(()=>{});
}
function musicInputs(){let root=$('music-files');root.innerHTML=worlds.map((w,i)=>`<label class="track-label">${w.name}<input type="file" accept=".mp3,audio/mpeg" data-track="${i}" aria-label="MP3 pour ${w.name}"></label>`).join('');root.querySelectorAll('input').forEach(input=>input.onchange=()=>{const file=input.files[0];if(!file)return;let i=+input.dataset.track;if(tracks[i])URL.revokeObjectURL(tracks[i]);tracks[i]=URL.createObjectURL(file);if(i===selected){musicCity=-1;syncMusic()}})}
const HEART_GOAL=20;
let elapsed=0,points=0,totalHearts=0,boss=null,completed=0,endingTime=0;
const hurtfulWords=['HAINE','PEUR','CONFLIT','RACISME','REJET','INTOLÉRANCE','PRÉJUGÉS','EXCLUSION'];
const bosses=['Camion Néon','Camion Fumée Noire','Bus des quais','4×4 Pollueur','Camion des pistes'];
function clockText(){return Math.floor(elapsed/60).toString().padStart(2,'0')+':'+Math.floor(elapsed%60).toString().padStart(2,'0')}
function beginBoss(){boss={time:0,lane:0,attack:1.8,warning:0,shots:0};objects=[];tone(180,.4)}
function nextCity(){ $('overlay').classList.remove('ending');$('overlay').style.display='none';mode='running';points+=1000;completed++;records[selected]=HEART_GOAL;try{localStorage.setItem('love-drivin-hearts-v2',JSON.stringify(records))}catch{}if(selected===worlds.length-1){finish(true);return}selected++;syncMusic();score=0;boss=null;objects=[];spawn=1.5;hp=Math.min(3,hp+1);invincible=2;list();ui()}
function bossVehicle(city){
// Distinct top-down pixel silhouettes; all remain fictional antagonists.
ctx.save();ctx.transform(1,0,-.16,1,0,0);
const paint=['#a5b3c8','#585966','#789e9b','#87725d','#a4a16a'][city];
rect(-32,-42,70,107,'#111b2c55');
for(let side of [-1,1]){let xx=side<0?-35:26;rect(xx,-32,10,22,'#192232');rect(xx,28,10,24,'#192232');rect(xx+2,-29,6,3,'#55576a');rect(xx+2,31,6,3,'#55576a')}
rect(-27,-50,54,109,paint);rect(-22,-45,44,7,'#ffffff55');rect(-22,-34,44,19,'#354b60');rect(-18,-31,13,13,'#9bbfc3');rect(18,-33,3,17,'#e7cba566');rect(-24,-51,10,4,'#fff0b0');rect(14,-51,10,4,'#fff0b0');rect(-25,54,9,5,'#ed647e');rect(16,54,9,5,'#ed647e');
if(city===0){
rect(-25,-7,50,57,'#d0d1cc');for(let i=0;i<6;i++)rect(-23,1+i*8,46,2,'#939cb0');rect(-25,7,4,34,'#f680af');rect(21,7,4,34,'#77ded0');rect(-17,12,34,18,'#38435c');sign('夜便',0,25,'#ffb5c8');rect(-18,-47,36,5,'#ee8bab');
 }else if(city===1){
// Fictional polluting truck: industrial silhouette, heavy grille and twin exhausts.
rect(-30,-49,60,105,'#555965');rect(-25,-43,50,24,'#293c49');rect(-21,-40,16,16,'#718d99');rect(-28,-56,56,8,'#333b47');
rect(-25,-12,50,62,'#3d4350');for(let i=0;i<6;i++)rect(-23,-8+i*10,46,3,'#737681');rect(-28,-13,5,65,'#92928c');rect(23,-13,5,65,'#92928c');
rect(-35,-49,7,74,'#292f3a');rect(28,-49,7,74,'#292f3a');rect(-38,-54,13,7,'#7c7d80');rect(25,-54,13,7,'#7c7d80');
rect(-32,50,64,11,'#252d37');for(let i=0;i<5;i++)rect(-28+i*12,52,6,7,'#b89b69');rect(-18,-53,10,4,'#dfaa77');rect(8,-53,10,4,'#dfaa77');
for(let side of [-1,1])for(let i=0;i<4;i++){let drift=(boss.time*28+i*18)%78;rect(side*32-7+Math.sin(i+boss.time)*4,-62-drift,14+i*4,12+i*3,i%2?'#303341aa':'#62616d88')}
}else if(city===2){
rect(-28,-53,56,117,'#6f9793');rect(-23,-48,46,18,'#344758');rect(-24,-23,48,69,'#d7d5ba');for(let i=0;i<5;i++){rect(-28,-20+i*14,7,10,'#3a5365');rect(21,-20+i*14,7,10,'#3a5365')}rect(-14,-15,28,47,'#a3b7ab');rect(-11,-10,22,7,'#c7cdb7');rect(-11,23,22,7,'#c7cdb7');rect(-23,51,46,9,'#36575f');sign('BUS',0,59,'#f8e3aa');
}else if(city===3){
// Oversized tyres, roof rack, spare wheel and visibly dirty exhaust.
for(let side of [-1,1])for(let yy of [-30,27]){rect(side<0?-40:27,yy,13,27,'#20232e');for(let j=0;j<4;j++)rect(side<0?-40:27,yy+j*7,13,2,'#55545a')}
rect(-29,-44,58,87,'#8e765e');rect(-22,-30,44,20,'#3c4e59');rect(-21,-3,42,39,'#5c594e');for(let i=0;i<4;i++)rect(-20,-1+i*10,40,3,'#b3a58a');rect(-24,-6,4,45,'#333b42');rect(20,-6,4,45,'#333b42');rect(-15,43,30,25,'#242b35');rect(-8,49,16,13,'#726f66');rect(-33,-49,66,6,'#474c53');for(let i=0;i<4;i++)rect(-24+i*14,-53,8,5,'#ffdc98');
}else{
rect(-25,-7,50,62,'#747c58');rect(-21,-3,42,53,'#b0aa7c');for(let i=0;i<5;i++)rect(-21,i*10,42,3,'#6e7654');rect(-26,-8,5,65,'#4d5c48');rect(21,-8,5,65,'#4d5c48');rect(28,-45,5,36,'#3b4147');rect(25,-49,8,6,'#242f39');rect(-17,-43,34,7,'#b5b99b');rect(-29,56,58,6,'#4e584b');
}
if(city===3||city===4){for(let i=0;i<5;i++){let drift=(boss.time*22+i*13)%65;let xx=(city===3?22:32)+Math.sin(i+boss.time)*5;rect(xx-6-i,61+drift,12+i*3,9+i*2,i%2?'#55515c88':'#81757466')}}
ctx.restore()}
function drawBoss(){if(!boss)return;let cx=project(boss.lane,125);ctx.save();ctx.translate(cx,125);ctx.scale(1.25,1.05);bossVehicle(selected);ctx.restore();rect(180,77,360,27,'#211e36dd');sign(bosses[selected]+' · ESQUIVE '+Math.ceil(18-boss.time)+' s',360,94);rect(180,105,360,4,'#51465d');rect(180,105,360*Math.max(0,1-boss.time/18),4,'#ff8297');if(boss.warning>0){for(let yy=200;yy<530;yy+=34){rect(project(boss.lane,yy)-29,yy,58,18,'#ff805e66')}sign('!',project(boss.lane,245),245,'#fff0a0')}}
function drawObstacle(o,cx){if(o.type==='word'){let width=Math.max(54,o.word.length*6+10);rect(cx-width/2+3,o.y-11,width,27,'#17162c88');rect(cx-width/2,o.y-15,width,27,'#593449');rect(cx-width/2,o.y-15,width,2,'#ff8b9b');rect(cx-width/2,o.y+10,width,2,'#b45b78');sign(o.word,cx,o.y+3,'#ffe0cb');rect(cx-9,o.y-28,3,7,'#e58a9b66');rect(cx+8,o.y-24,3,6,'#e58a9b66')}else if(o.type==='oil'){rect(cx-23,o.y-9,46,19,'#202338');rect(cx-15,o.y-14,28,29,'#202338');rect(cx-9,o.y-5,14,3,'#637083')}else{rect(cx-27,o.y+15,54,7,'#514454');rect(cx-25,o.y-14,50,27,'#df9b6d');for(let i=0;i<4;i++)rect(cx-24+i*13,o.y-12,6,23,'#fff0c0');rect(cx-22,o.y+12,5,10,'#574957');rect(cx+17,o.y+12,5,10,'#574957')}}
const W=720,H=530;function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h)}
function random(n){return Math.random()*n}function roadCenter(y){return 360+(265-y)*.29}function project(lane,y){return roadCenter(y)+lane*77}
let synth=null;
function initSynth(){if(muted)return null;try{if(!synth){audio=new(window.AudioContext||window.webkitAudioContext)();const master=audio.createGain();master.gain.value=.55;const compressor=audio.createDynamicsCompressor();master.connect(compressor);compressor.connect(audio.destination);let engine=audio.createOscillator(),engineGain=audio.createGain(),filter=audio.createBiquadFilter();engine.type='sawtooth';filter.type='lowpass';filter.frequency.value=230;engineGain.gain.value=0;engine.connect(filter);filter.connect(engineGain);engineGain.connect(master);engine.start();const noise=audio.createBuffer(1,audio.sampleRate*2,audio.sampleRate);let data=noise.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;synth={master,engine,engineGain,noise};}if(audio.state==='suspended')audio.resume().catch(()=>{});return synth}catch{return null}}
function synthNote(from,to,duration,type='triangle',volume=.12,delay=0){const sy=initSynth();if(!sy)return;let at=audio.currentTime+delay,o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.setValueAtTime(from,at);o.frequency.exponentialRampToValueAtTime(Math.max(20,to),at+duration);g.gain.setValueAtTime(.001,at);g.gain.exponentialRampToValueAtTime(volume,at+.008);g.gain.exponentialRampToValueAtTime(.001,at+duration);o.connect(g);g.connect(sy.master);o.start(at);o.stop(at+duration+.02)}
function synthNoise(duration,frequency,volume=.16,endFrequency=frequency){const sy=initSynth();if(!sy)return;let at=audio.currentTime,n=audio.createBufferSource(),f=audio.createBiquadFilter(),g=audio.createGain();n.buffer=sy.noise;f.type='bandpass';f.Q.value=.8;f.frequency.setValueAtTime(frequency,at);f.frequency.exponentialRampToValueAtTime(endFrequency,at+duration);g.gain.setValueAtTime(.001,at);g.gain.exponentialRampToValueAtTime(volume,at+.015);g.gain.exponentialRampToValueAtTime(.001,at+duration);n.connect(f);f.connect(g);g.connect(sy.master);n.start(at);n.stop(at+duration+.02)}
function soundEffect(kind){if(muted)return;if(kind==='heart'){synthNote(540,1080,.13,'sine',.17);synthNote(1000,1450,.14,'triangle',.08,.07)}else if(kind==='skid'){synthNoise(.19,1700,.09,850)}else if(kind==='oil'){synthNoise(.58,2400,.18,420);synthNote(210,65,.45,'sawtooth',.07)}else if(kind==='crash'){synthNoise(.32,850,.28,90);synthNote(110,32,.28,'triangle',.23)}else if(kind==='word'){synthNoise(.22,680,.14,180);synthNote(180,70,.2,'square',.055)}}
function updateEngine(){if(!synth)return;let active=!muted&&!document.hidden&&mode==='running',at=audio.currentTime;synth.master.gain.setTargetAtTime(muted?0:.55,at,.025);synth.engineGain.gain.setTargetAtTime(active?.045:0,at,.08);if(active){let speed=(155+Math.min(distance,3500)*.018)*worlds[selected].speed;synth.engine.frequency.setTargetAtTime(38+speed*.24+Math.abs(target-x)*22+Math.sin(elapsed*17)*1.4,at,.08)}}
function tone(freq,duration=.1){synthNote(freq,freq*1.12,duration,'triangle',.065)}
function car(cx,cy,color,player=false){ctx.save();ctx.translate(Math.round(cx),Math.round(cy));ctx.transform(1,0,-.18,1,0,0);rect(-18,-21,40,63,'#10142655');rect(-20,-16,5,14,'#171c2b');rect(15,-16,5,14,'#171c2b');rect(-20,17,5,14,'#171c2b');rect(15,17,5,14,'#171c2b');rect(-15,-30,30,64,'#642d51');rect(-17,-26,34,52,color);rect(-12,-20,24,17,'#293c54');rect(-10,-18,5,13,'#8ca8b5');rect(-11,11,22,11,'#3d4560');rect(-13,-27,26,5,'#ffffff66');rect(-12,-29,7,3,'#fff2bf');rect(5,-29,7,3,'#fff2bf');rect(-13,27,6,4,'#ff567c');rect(7,27,6,4,'#ff567c');rect(-13,-1,26,9,color);if(player){rect(-3,0,6,4,'#ffd2cc');rect(-5,-2,4,4,'#ffd2cc');rect(1,-2,4,4,'#ffd2cc')}ctx.restore()}
function palm(cx,y,w){rect(cx-3,y-24,6,42,'#8a6959');for(let i=0;i<5;i++){ctx.fillStyle=i%2?'#2c796b':'#439379';ctx.beginPath();ctx.moveTo(cx,y-25);ctx.lineTo(cx+Math.cos(i*1.3)*w,y-43+Math.sin(i*1.3)*17);ctx.lineTo(cx+Math.cos(i*1.3+.6)*w*.7,y-22);ctx.fill()}}
function building(cx,y,w,h,t,seed){rect(cx+7,y+8,w,h,'#141a2a33');rect(cx,y,w,h,t.side);rect(cx,y,w,8,t.accent);rect(cx+w-10,y+8,10,h-8,'#161a3233');for(let yy=16;yy<h-7;yy+=19)for(let xx=8;xx<w-14;xx+=15)rect(cx+xx,y+yy,6,8,(xx+yy+seed)%3?t.window:'#697083');if(t.kind==='city'){rect(cx-5,y+20,13,42,t.accent);ctx.fillStyle='#452e54';ctx.font='bold 9px monospace';ctx.fillText('夢',cx-3,y+34);ctx.fillText('夜',cx-3,y+49)}if(t.kind==='paris'){rect(cx-4,y-8,w+8,9,'#666077');rect(cx+9,y-17,w-18,10,'#79758b')}}
function parisRiver(){
ctx.fillStyle='#507f91';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(roadCenter(0)-176,0);ctx.lineTo(roadCenter(H)-176,H);ctx.lineTo(0,H);ctx.fill();
for(let i=0;i<95;i++){let y=(i*41+scroll*.48)%H,bank=roadCenter(y)-180;let xx=(i*67)%Math.max(1,bank-10);rect(xx,y,12+i%14,2,i%3?'#92b6b155':'#f9d5a777')}
for(let y=-20;y<H+20;y+=12){let bank=roadCenter(y)-174;rect(bank,y,13,13,'#d1bcaa');rect(bank+4,y+10,9,2,'#aa958c');}
for(let i=0;i<12;i++){let y=(i*51+scroll*.8)%650-60,xx=roadCenter(y)-160;rect(xx,y,3,19,'#514e60');rect(xx-3,y-5,9,8,'#f8d6a0');rect(xx-1,y+18,5,3,'#746877')}
for(let i=0;i<4;i++){let y=(i*205+scroll*(i%2?.48:.64))%950-180;boat(roadCenter(y)-236-(i%2)*36,y,i%2===0)}
}
function boat(cx,y,tourist){ctx.save();ctx.translate(Math.round(cx),Math.round(y));ctx.transform(1,0,-.29,1,0,0);
rect(-27,-58,54,121,'#24495644');for(let i=0;i<3;i++)rect(-19-i*5,66+i*6,38+i*10,2,'#b6d4cc88');
rect(-23,-53,46,104,tourist?'#efe3c9':'#453e4e');rect(-18,-62,36,117,tourist?'#efe3c9':'#453e4e');rect(-12,-67,24,126,tourist?'#efe3c9':'#453e4e');
if(tourist){rect(-18,-47,36,86,'#a4bdc1');for(let j=0;j<7;j++){rect(-17,-43+j*11,34,3,'#f7efda');rect(-2,-46,4,85,'#f7efda')}rect(-12,41,24,10,'#f7efda');rect(-9,-60,18,10,'#fcfaf0');rect(-8,43,16,5,'#bd666b');}
else{rect(-18,-48,36,72,'#8e9a81');rect(-15,-44,30,64,'#a5ad8b');for(let j=0;j<5;j++)rect(-14,-40+j*12,28,2,'#657663');rect(-17,27,34,21,'#e5c9a5');rect(-12,30,24,9,'#506c7c');rect(10,24,5,8,'#ae6970');rect(-12,-59,24,7,'#c69c7f');}
rect(-25,-31,3,9,'#242f3f');rect(22,28,3,9,'#242f3f');ctx.restore()}
function bakery(cx,y,t,seed){building(cx,y,96,96,t,seed);rect(cx+2,y+47,92,49,'#5b3c48');rect(cx+7,y+62,49,30,'#ecc688');rect(cx+61,y+60,26,36,'#302f43');rect(cx+65,y+65,18,20,'#a6b9b5');rect(cx+78,y+84,3,3,'#f7cf8d');
rect(cx-2,y+37,100,15,'#75504d');ctx.font='bold 10px monospace';ctx.fillStyle='#ffe2a5';ctx.fillText('BOULANGERIE',cx+5,y+48);
for(let i=0;i<10;i++)rect(cx-2+i*10,y+53,10,9,i%2?'#fff0d0':'#ad626b');
for(let i=0;i<4;i++){rect(cx+12+i*10,y+70,5,15,'#b77942');rect(cx+13+i*10,y+70,2,12,'#ffe2a1');rect(cx+12+i*10,y+75,4,2,'#905b39')}
rect(cx+27,y+62,2,30,'#8d6556');rect(cx+6,y+85,50,3,'#8d6556');rect(cx-12,y+78,10,19,'#413c4b');ctx.fillStyle='#f9d9ad';ctx.font='7px monospace';ctx.fillText('PAIN',cx-15,y+88);}
// Small roadside scenes, positioned outside the driving lanes.
function sign(text,cx,y,color='#ffe5b0'){ctx.fillStyle=color;ctx.font='bold 9px monospace';ctx.textAlign='center';ctx.fillText(text,cx,y);ctx.textAlign='start'}
function stall(cx,y,style){
const palettes={city:['#583a54','#f07994','#ffe7bc'],beach:['#548e80','#f1bd67','#f9eac1'],desert:['#d38e6c','#4d9c9d','#ffe1a0'],jungle:['#826d55','#72946c','#e1c89d']};let [wall,roof,light]=palettes[style];
rect(cx-39,y-48,82,76,'#16233233');rect(cx-42,y-54,80,76,wall);rect(cx-36,y-22,68,39,'#31333f');rect(cx-46,y-66,88,13,roof);rect(cx-40,y-71,76,5,roof);rect(cx-37,y-50,70,16,'#292d3b');
const labels={city:'RAMEN',beach:'ÁGUA DE COCO',desert:'TAQUERÍA',jungle:'WARUNG'};sign(labels[style],cx-2,y-39,light);
for(let i=0;i<8;i++)rect(cx-46+i*11,y-32,11,10,i%2?light:roof);rect(cx-38,y+5,72,7,roof);
if(style==='city'){
for(let side of [-1,1]){let xx=cx+side*48;rect(xx-1,y-50,2,13,'#b49589');rect(xx-6,y-39,12,18,'#ff9b83');rect(xx-3,y-41,6,22,'#ef6e84');rect(xx-5,y-20,10,2,'#f6ca9b')}
for(let i=0;i<3;i++){rect(cx-27+i*20,y-3,14,6,'#e5d4b2');rect(cx-25+i*20,y-6,10,3,'#cfb067');rect(cx-22+i*20,y-17,2,7,'#e6c8b077')}
rect(cx+49,y-38,22,54,'#8995b5');rect(cx+52,y-32,16,12,'#b3e2dd');for(let i=0;i<6;i++)rect(cx+53+i%3*5,y-14+Math.floor(i/3)*9,3,6,['#ff9aab','#f7d393','#80cfc4'][i%3]);rect(cx+53,y+7,14,4,'#30374c');
}else if(style==='beach'){
for(let i=0;i<4;i++){rect(cx-27+i*16,y-5,10,10,'#8eac65');rect(cx-24+i*16,y-8,4,4,'#e0e6b1');rect(cx-22+i*16,y-14,2,8,'#fff0d6')}
rect(cx+53,y-17,3,43,'#9c7e68');for(let i=0;i<5;i++)rect(cx+29+i*11,y-30+Math.abs(i-2)*4,11,12,i%2?'#fce8b9':'#e58e87');rect(cx+27,y+22,24,5,'#ede0bb');rect(cx+29,y+27,3,13,'#8e7968');rect(cx+46,y+27,3,13,'#8e7968');
}else if(style==='desert'){
for(let i=0;i<3;i++){rect(cx-28+i*22,y-5,17,7,'#f6ce7c');rect(cx-25+i*22,y-8,11,4,'#74a366');rect(cx-23+i*22,y-7,3,3,'#d55f60')}
for(let i=0;i<9;i++){let xx=cx-49+i*12,yy=y-91+Math.abs(i-4)*2;rect(xx,yy,12,1,'#685565');rect(xx+1,yy+2,9,11,['#e78c9b','#eec770','#61ada3'][i%3]);rect(xx+4,yy+5,3,4,'#efd0a177')}
rect(cx+46,y-2,13,23,'#b9675a');rect(cx+42,y-7,21,7,'#e39a70');for(let i=0;i<4;i++){rect(cx+47+i%2*7,y-24+Math.floor(i/2)*9,4,17,'#6f9968');rect(cx+46+i%2*7,y-26+Math.floor(i/2)*9,6,5,'#edb065')}
}else{
// Layered pitched roof and bamboo details.
for(let i=0;i<5;i++)rect(cx-46+i*7,y-67-i*5,88-i*14,5,i%2?'#a48b63':'#bc9b6d');for(let i=0;i<10;i++)rect(cx-44+i*9,y-63,2,9,'#695f4a');
for(let i=0;i<3;i++){rect(cx-26+i*21,y-4,14,6,'#ddd6af');rect(cx-23+i*21,y-9,8,5,'#f0e5bc')}rect(cx+44,y-6,22,4,'#ac8d64');rect(cx+46,y-2,3,18,'#74624e');rect(cx+61,y-2,3,18,'#74624e');
}}
function riceTerraces(cx,y){for(let row=0;row<4;row++){let width=83-row*13;rect(cx-width/2,y+row*13,width,10,row%2?'#8eae67':'#a2bc75');rect(cx-width/2,y+row*13+9,width,3,'#c0cf91');for(let col=0;col<6-row;col++){let xx=cx-width/2+8+col*12;rect(xx,y+row*13,2,7,'#477c58');rect(xx-3,y+row*13+1,3,2,'#63935b')}}}
function pedestrian(cx,y,id,kind){
// Decorative residents stay on the pavements, clear of the three driving lanes.
let step=Math.sin(scroll*.035+id*2),skin=['#ebbd98','#b98163','#8f5f4e','#d5a581'][id%4],shirt=['#ef9aab','#82b5af','#e8c787','#aaa0c7'][id%4];
rect(cx-6,y+13,16,4,'#20243533');rect(cx-4,y+5,3,9+Math.round(step*2),'#424356');rect(cx+2,y+5,3,9-Math.round(step*2),'#424356');rect(cx-5,y+13+Math.round(step*2),5,3,'#313344');rect(cx+2,y+13-Math.round(step*2),5,3,'#313344');
rect(cx-6,y-7,13,14,shirt);rect(cx-9,y-4+Math.round(step),3,10,skin);rect(cx+7,y-4-Math.round(step),3,10,skin);rect(cx-4,y-17,9,10,skin);rect(cx-5,y-19,11,5,['#45363d','#674c43','#333742'][id%3]);rect(cx+3,y-13,2,2,'#4b3941');
if(kind==='city'&&id%2===0){let uc=cx-6;rect(uc,y-27,2,24,'#d8c1ac');for(let row=0;row<3;row++)rect(uc-16+row*4,y-31-row*4,34-row*8,4,['#b1b5d1','#f0a6bc','#a0c8c7'][id%3]);rect(uc-1,y-44,3,3,'#ded1bd')}
else if(kind==='beach'){rect(cx-9,y-19,19,3,'#efcf92');rect(cx-4,y-24,9,5,'#e8bd7a');rect(cx-4,y+5,9,4,'#567c94');if(id%2){rect(cx+9,y-1,5,7,'#8da66d');rect(cx+11,y-5,1,5,'#fff0be')}}
else if(kind==='paris'&&id%2){rect(cx+8,y+1,7,11,'#b78f73');rect(cx+10,y-11,3,17,'#efc88c');rect(cx+10,y-10,2,2,'#fff0c5');rect(cx+10,y-4,2,2,'#fff0c5')}
else if(kind==='desert'&&id%3===0){rect(cx+8,y+1,8,7,'#d9bd8d');rect(cx+10,y-3,4,5,'#f1c771')}
else if(kind==='jungle'&&id%2===0){rect(cx-9,y-19,19,3,'#d3b77f');rect(cx-6,y-22,13,3,'#e4c896');rect(cx-3,y-25,7,3,'#e4c896');rect(cx+7,y+1,8,11,'#a68563');rect(cx+8,y+3,6,2,'#dac292')}
}
function residents(t){for(let i=0;i<10;i++){let side=i%2?1:-1,y=(i*97+scroll*.8)%980-180;let cx=roadCenter(y)+side*150;pedestrian(Math.round(cx),Math.round(y),i,t.kind)}}
function scenery(t){rect(0,0,W,H,t.bg);if(t.kind==='paris')parisRiver();for(let i=0;i<220;i++){let y=(i*47+scroll*.7)%560;let xx=(i*113)%720;rect(xx,y,2+(i%3),1,'#ffffff0d')}
ctx.fillStyle=t.side;ctx.beginPath();ctx.moveTo(roadCenter(0)-154,0);ctx.lineTo(roadCenter(0)+154,0);ctx.lineTo(roadCenter(H)+154,H);ctx.lineTo(roadCenter(H)-154,H);ctx.fill();ctx.fillStyle=t.road;ctx.beginPath();ctx.moveTo(roadCenter(0)-128,0);ctx.lineTo(roadCenter(0)+128,0);ctx.lineTo(roadCenter(H)+128,H);ctx.lineTo(roadCenter(H)-128,H);ctx.fill();
for(let i=0;i<14;i++){let y=(i*49+scroll)%680-80;for(let s of [-1,1]){rect(roadCenter(y)+s*137,y,9,25,i%2?'#f5d5bd':'#c58e95');}for(let l of [-.5,.5])rect(project(l,y),y,3,23,'#ddd8c077');}
for(let i=0;i<540;i++){let y=(i*37+scroll)%H,xx=roadCenter(y)-124+(i*71)%248;rect(xx,y,2,1,'#ffffff0b')}
// Keep scenery beyond the pavement; sort rows from back to front.
ctx.save();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(roadCenter(0)-176,0);ctx.lineTo(roadCenter(H)-176,H);ctx.lineTo(0,H);ctx.closePath();ctx.moveTo(roadCenter(0)+176,0);ctx.lineTo(W,0);ctx.lineTo(W,H);ctx.lineTo(roadCenter(H)+176,H);ctx.closePath();ctx.clip();
const sceneryRows=Array.from({length:8},(_,i)=>({i,y:(i*135+scroll*.8)%1080-180})).sort((a,b)=>a.y-b.y);
for(const {i,y} of sceneryRows){for(let s of [-1,1]){let cx=roadCenter(y)+s*(234+(i%2)*22);if(t.kind==='paris'&&s===-1)continue;if(t.kind==='paris'&&i%2===0){bakery(roadCenter(y)+190,y-60,t,i);continue}if(t.kind!=='paris'&&((i+(s===1?1:0))%3===0)){stall(cx,y-10,t.kind);continue}if(t.kind==='jungle'&&s===-1&&i%3===1){riceTerraces(cx,y-40);continue}if(t.kind==='city'||t.kind==='paris')building(cx-30,y-60,58+(i%3)*10,65+(i%2)*30,t,i);else if(t.kind==='desert'){if(i%2===0){rect(cx-33,y-63,66,69,i%4===0?'#c97b89':'#69a6a0');rect(cx-37,y-68,74,7,'#f2cc9d');rect(cx-10,y-22,20,29,'#614957');rect(cx-25,y-48,14,17,'#ffe1a1');rect(cx+12,y-48,14,17,'#ffe1a1');rect(cx-34,y+7,68,5,'#a97364');continue}rect(cx,y-18,8,38,'#548366');rect(cx-13,y-14,15,7,'#548366');rect(cx-13,y-29,6,20,'#548366');rect(cx+6,y-3,15,7,'#548366');rect(cx+15,y-20,6,23,'#548366');rect(cx-10,y+24,35,3,'#9e795f');
// Pixel blossoms on the main stem and raised cactus arms.
for(const [fx,fy,color] of [[cx+4,y-21,'#f18ca8'],[cx-10,y-32,'#e9747b'],[cx+18,y-23,'#f4ce79']]){rect(fx-2,fy-4,5,9,color);rect(fx-4,fy-2,9,5,color);rect(fx-1,fy-1,3,3,'#fff0b5')}}else{palm(cx,y,34);if(t.kind==='jungle'){rect(cx-30,y+33,65,5,'#9db16e');rect(cx-40,y+42,75,4,'#b3c07c');if(i%3===0){rect(cx-22,y-65,44,23,'#9d8875');rect(cx-29,y-68,58,6,'#4b524c');rect(cx-21,y-77,42,8,'#4b524c');rect(cx-12,y-86,24,10,'#4b524c')}}}}}
ctx.restore();
if(t.kind==='beach'){rect(0,0,52,H,'#77c5c1');for(let i=0;i<20;i++)rect(43,(i*40+scroll*.45)%H,12,3,'#e7efd4')}
if(t.kind==='city'){for(let i=0;i<38;i++){let y=(i*47+scroll*1.9)%H;rect((i*139)%W,y,1,9,'#bac9f133')}}
}
const endings=[
{title:'Tokyo · Un nouveau matin',lines:'Au pied du mont Fuji, le jour se lève pour chacun. Étrange pour certains, étranger quelque part : tu as le droit d’être toi, et de suivre ta route.',sky:'#bd98af',land:'#627b8c'},
{title:'Brésil · Le soleil nous rassemble',lines:'Le soleil se couche sans demander d’où tu viens. Que le voyage nous apprenne à nous rencontrer, avec nos différences, en paix.',sky:'#df9c91',land:'#397e83'},
{title:'Paris · La liberté sous les flocons',lines:'Sous la neige, la tour Eiffel veille. Être libre, c’est pouvoir aimer, partir, rester — sans avoir à s’excuser d’être soi.',sky:'#8b91b2',land:'#c5ccd2'},
{title:'Mexique · Des chemins sans frontières',lines:'Le ciel n’a pas de passeport. Étrangers aujourd’hui, compagnons de route demain : laissons une place à l’autre, et la peur derrière nous.',sky:'#c5869c',land:'#b9796e'},
{title:'Indonésie · Le voyage continue en nous',lines:'Le jour éclaire les rizières. Tu as traversé le monde sans renoncer à toi-même. Emporte la paix : aucune différence ne retire à quelqu’un sa place sous le soleil.',sky:'#b2c4ac',land:'#638e73'}];
function beginEnding(){mode='ending';endingTime=0;boss=null;objects=[];const e=endings[selected];$('overlay').classList.add('ending');$('subtitle').textContent='ESCALE RÉUSSIE · UN INSTANT DE PAIX';overlay(e.title,e.lines,selected===4?'TERMINER LE VOYAGE ♥':'CONTINUER LE VOYAGE ↗');tone(660,.5)}
function polygon(points,color){ctx.fillStyle=color;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fill()}
function drawEnding(){const e=endings[selected],t=Math.min(1,endingTime/12);rect(0,0,W,H,e.sky);
// Banded sky, pixel sun and slowly drifting clouds.
for(let i=0;i<7;i++)rect(0,170+i*26,W,26,['#edb6a5','#efc3a5','#f4cea9','#efcfaf','#d8c6b4','#b6b6b2','#a8aba9'][i]);
let sunset=selected===1||selected===3,sy=sunset?180+t*85:250-t*115;for(let row=-4;row<=4;row++){let width=68-Math.abs(row)*8;rect(535-width/2,sy+row*7,width,7,'#ffe8b7')}
for(let i=0;i<5;i++){let xx=(i*175+endingTime*4)%850-80,yy=90+(i%3)*32;rect(xx,yy,72,8,'#fff0d355');rect(xx+12,yy-7,41,7,'#fff0d355')}
if(selected===0){polygon([[80,330],[315,112],[545,330]],'#7e809d');polygon([[251,172],[315,112],[382,177],[351,166],[329,185],[303,168],[280,183]],'#f0e4dc');polygon([[0,321],[146,259],[259,327],[452,267],[720,321],[720,530],[0,530]],e.land);rect(0,337,720,193,'#789aa0');for(let i=0;i<15;i++)rect(190+i%4*15,349+i*8,190-i*6,2,'#e8cbaf55');for(let i=0;i<6;i++){let xx=i*137;rect(xx,295,5,50,'#624e63');rect(xx-20,288,49,12,'#cf9fae');rect(xx-12,280,33,12,'#e8b1bb')}}
if(selected===1){rect(0,289,W,241,e.land);for(let i=0;i<28;i++)rect((i*113)%720,300+i*7,35+i%9*6,2,'#eed4b377');polygon([[0,405],[210,365],[425,389],[720,353],[720,530],[0,530]],'#debfa0');palm(85,360,65);palm(639,365,58);polygon([[40,290],[127,205],[182,290]],'#567c84');polygon([[153,290],[215,242],[260,290]],'#6d8d8e')}
if(selected===2){rect(0,313,W,217,e.land);rect(0,349,W,73,'#798d9f');for(let i=0;i<18;i++)rect(i*43,364+i%3*12,25,2,'#dce3dc66');for(let i=0;i<9;i++){let xx=i*91;rect(xx,277,63,36,'#777e98');rect(xx-4,270,71,8,'#e3ddd5');for(let j=0;j<3;j++)rect(xx+9+j*16,286,6,10,'#ffe0b1')}
let cx=360;polygon([[cx-67,329],[cx-27,221],[cx-9,153],[cx-3,119],[cx+3,119],[cx+9,153],[cx+27,221],[cx+67,329],[cx+46,329],[cx+17,249],[cx-17,249],[cx-46,329]],'#66546b');rect(cx-39,229,78,9,'#9a7a82');rect(cx-23,189,46,6,'#9a7a82');rect(cx-2,105,4,24,'#66546b');for(let i=0;i<5;i++){let yy=208+i*21;rect(cx-15-i*7,yy,30+i*14,3,'#bd9897')}
for(let i=0;i<90;i++){let xx=(i*83+Math.sin(endingTime+i)*9)%720,yy=(i*47+endingTime*(16+i%8))%530;rect(xx,yy,i%3?2:4,3,'#fff7e6bb')}}
if(selected===3){polygon([[0,335],[125,235],[234,331],[397,254],[551,330],[720,257],[720,530],[0,530]],'#936c85');rect(0,361,W,169,e.land);for(let i=0;i<7;i++){let xx=30+i*109,yy=323+i%2*30;rect(xx,yy,72,53,['#d6a07d','#8caa9e','#bd8a9c'][i%3]);rect(xx-4,yy-6,80,7,'#edc4a0');rect(xx+28,yy+23,18,30,'#705366');rect(xx+9,yy+13,10,13,'#ffe2a6')}for(let i=0;i<5;i++){let xx=75+i*142;rect(xx,258,2,5,'#f4d8ba');rect(xx-2,263,6,5,'#f4d8ba')}}
if(selected===4){polygon([[0,325],[166,207],[269,302],[410,211],[566,297],[720,241],[720,530],[0,530]],'#72917f');for(let i=0;i<8;i++){let yy=319+i*23;rect(0,yy,W,23,i%2?'#84a476':'#a5b58a');rect(0,yy,W,4,'#d6cd9f');for(let j=0;j<22;j++){let xx=j*35+i%2*15;rect(xx,yy+11,2,8,'#518461');rect(xx-3,yy+10,3,3,'#69985e')}}palm(65,325,49);palm(651,330,53);for(let i=0;i<5;i++)rect(440+i*9,311-i*14,100-i*18,9,'#5c6260')}
rect(0,0,W,66,'#181a3022');
}
function draw(){if(mode==='ending'){drawEnding();return}const t=worlds[selected];scenery(t);residents(t);for(const o of [...objects].sort((a,b)=>a.y-b.y)){let cx=project(o.lane,o.y);if(o.type==='heart'){ctx.fillStyle='#ff8ba3';ctx.font='28px monospace';ctx.fillText('♥',cx-13,o.y+9);rect(cx-7,o.y-9,4,3,'#ffe0ca')}else if(o.type==='word'||o.type==='oil'||o.type==='barrier'){drawObstacle(o,cx)}else if(o.type==='cone'){rect(cx-16,o.y+15,32,6,'#e4cba5');rect(cx-10,o.y,20,16,'#f39d65');rect(cx-6,o.y-10,12,15,'#f39d65');rect(cx-9,o.y+5,18,4,'#ffe6bc')}else car(cx,o.y,o.color)}drawBoss();if(invincible<=0||Math.floor(invincible*12)%2===0)car(project(x,405),405,'#fa829d',true);if(mode==='running'){for(let i=0;i<3;i++)rect(project(x,448)+i*6-7,448+random(15),3,3,'#ffc58b66')}}
function ui(){ $('place').textContent=(selected+1)+'/5 · '+worlds[selected].name.toUpperCase();$('distance').textContent=clockText()+' · '+points+' PTS';$('score').textContent=boss?'BOSS · '+Math.ceil(18-boss.time)+' s':'♥ '+score+' / '+HEART_GOAL;$('health').textContent='♥ '.repeat(hp)+'♡ '.repeat(3-hp);$('progress').style.width=((selected+(boss?.75+boss.time/18*.25:score/HEART_GOAL*.75))/5*100)+'%'}
function list(){ $('destinations').innerHTML=worlds.map((t,i)=>`<button class="destination ${i===selected?'active':''}" data-world="${i}"><span>${t.icon}</span><b class="record">${records[i]?'♥ '+records[i]:''}</b><strong>${t.name}</strong><small>${t.sub}</small></button>`).join('');$('destinations').querySelectorAll('button').forEach(b=>b.onclick=()=>{if(mode==='ready'||mode==='won'||mode==='lost')select(+b.dataset.world)})}
function overlay(title,msg,button){$('heading').textContent=title;$('message').textContent=msg;$('start').textContent=button;$('overlay').style.display='flex'}
function select(i){selected=i;$('overlay').classList.remove('ending');elapsed=points=totalHearts=completed=0;boss=null;mode='ready';syncMusic();distance=score=0;hp=3;x=target=0;objects=[];$('place').textContent=String(i+1).padStart(2,'0')+' / '+worlds[i].label;$('subtitle').textContent='TON PROCHAIN SOUVENIR';overlay(worlds[i].title,'Tour complet : Tokyo → Brésil → Paris → Mexique → Indonésie. Dans chaque ville : 20 cœurs, puis esquive les mots blessants du boss pendant 18 secondes !','PRENDRE LA ROUTE ↗');list();ui()}
function start(){if(mode==='ending'){nextCity();return}if(mode==='paused'){mode='running';syncMusic();$('overlay').style.display='none';return}selected=0;elapsed=points=totalHearts=completed=0;boss=null;distance=score=0;hp=3;objects=[];spawn=.9;list();invincible=0;x=target=0;mode='running';syncMusic();$('overlay').style.display='none';tone(440);ui()}
function finish(won){mode=won?'won':'lost';syncMusic();boss=null;list();$('subtitle').textContent=won?'TOUR DU MONDE TERMINÉ':'ON REPREND LA ROUTE ?';overlay(won?'Le monde est à nous.':'Fin du voyage.',clockText()+' · '+points+' points · '+totalHearts+' cœurs · '+completed+'/5 villes terminées.', 'RECOMMENCER LE TOUR ↗');tone(won?660:130,.3)}
function pause(){keys={};if(mode==='running'){mode='paused';syncMusic();overlay('Une petite pause.','Le monde peut attendre quelques secondes.','REPRENDRE ↗')}else if(mode==='paused')start()}
function steer(d){if(mode==='running'){let next=Math.max(-1,Math.min(1,target+d));if(next!==target)soundEffect('skid');target=next}}
window.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight',' ','ArrowUp','ArrowDown'].includes(e.key))e.preventDefault();if(e.repeat)return;keys[e.key]=true;if(['ArrowLeft','q','Q','a','A'].includes(e.key))steer(-1);if(['ArrowRight','d','D'].includes(e.key))steer(1);if(e.key===' '||e.key==='Escape')pause();if(e.key==='Enter'&&mode!=='running')start()});window.addEventListener('keyup',e=>delete keys[e.key]);window.addEventListener('blur',()=>{if(mode==='running')pause()});document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='running')pause();syncMusic()});$('left').onclick=()=>steer(-1);$('right').onclick=()=>steer(1);$('pause').onclick=pause;$('start').onclick=start;$('sound').onclick=()=>{muted=!muted;$('sound').textContent=muted?'SON OFF ♪':'SON ON ♫';syncMusic();tone(550)};
let touchStart;canvas.addEventListener('pointerdown',e=>{touchStart=e.clientX;canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointerup',e=>{if(touchStart!=null){steer(e.clientX-touchStart<0?-1:1);touchStart=null}});
function update(dt){if(mode==='ending'){if(!document.hidden){endingTime+=dt;if(endingTime>=14)nextCity()}return}if(mode!=='running')return;elapsed+=dt;let speed=(155+Math.min(distance,3500)*.018)*worlds[selected].speed;scroll+=speed*dt;distance+=dt*55*worlds[selected].speed;x+=(target-x)*Math.min(1,dt*13);invincible=Math.max(0,invincible-dt);spawn-=dt;if(!boss&&spawn<=0){let lane=Math.floor(random(3))-1;objects.push({lane,y:-50,type:Math.random()<.45?'heart':['cone','barrier','oil','car'][Math.floor(random(4))],color:['#93b9bc','#f5b97f','#b8a4d4','#bfd2a0'][Math.floor(random(4))]});spawn=.85+random(.3)}for(const o of objects){o.y+=speed*dt;if(o.y>460&&!o.passed&&!o.hit&&o.type!=='heart'){o.passed=true;points+=25;}if(!o.hit&&Math.abs(o.y-405)<(o.type==='heart'?29:44)&&Math.abs(o.lane-x)<.43){o.hit=true;if(o.type==='heart'){score++;totalHearts++;points+=100;soundEffect('heart')}else if(invincible<=0){hp--;invincible=1.6;soundEffect(o.type==='oil'?'oil':o.type==='word'?'word':'crash');if(hp<=0){finish(false);break}}}}objects=objects.filter(o=>o.y<600&&!(o.hit&&o.type==='heart'));if(mode==='running'&&!boss&&score>=HEART_GOAL){beginBoss()}if(mode==='running'&&boss){boss.time+=dt;boss.attack-=dt;if(boss.warning>0){boss.warning-=dt;if(boss.warning<=0){boss.warning=0;objects.push({lane:boss.lane,y:180,type:'word',word:hurtfulWords[(selected+boss.shots++)%hurtfulWords.length]});boss.attack=1.1;}}else if(boss.attack<=0){boss.lane=Math.floor(random(3))-1;boss.warning=1;}if(boss.time>=18)beginEnding();}ui()}
function loop(time){let dt=Math.min(.04,(time-last)/1000||0);last=time;update(dt);updateEngine();if(mode==='ready')scroll+=dt*22;draw();requestAnimationFrame(loop)}musicInputs();select(0);requestAnimationFrame(loop);
