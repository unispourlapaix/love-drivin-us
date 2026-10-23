let tiltWanted=true,tiltPending=false,tiltAutoAttempted=false;try{tiltWanted=localStorage.getItem('love-drivin-tilt')!=='off'}catch{}
let tiltSensitivity=7;try{const saved=Number(localStorage.getItem('love-drivin-tilt-angle'));if(saved>=4&&saved<=14)tiltSensitivity=saved}catch{}
let tiltEnabled=false,tiltCenter=null,tiltLast=null,tiltFiltered=0,tiltTimer=null;
function tiltAngle(event){if(!Number.isFinite(event.gamma)||!Number.isFinite(event.beta))return null;const angle=(screen.orientation?.angle??window.orientation??0)*Math.PI/180;return event.gamma*Math.cos(angle)+event.beta*Math.sin(angle)}
function stopTilt(message='Pilotage tactile activé.'){tiltEnabled=false;tiltCenter=null;clearTimeout(tiltTimer);window.removeEventListener('deviceorientation',onTilt);$('tilt-toggle').textContent='ACTIVER L’INCLINAISON';$('tilt-toggle').setAttribute('aria-pressed','false');$('tilt-center').hidden=true;$('tilt-status').textContent=message}
function onTilt(event){const value=tiltAngle(event);if(value===null||!tiltEnabled)return;tiltLast=value;if(tiltCenter===null){tiltCenter=value;tiltFiltered=0;clearTimeout(tiltTimer);$('tilt-status').textContent='Prêt ! Incline doucement à gauche ou à droite. Recentrer mémorise ta position.'}if(document.hidden||mode!=='running')return;tiltFiltered=tiltFiltered*.55+(value-tiltCenter)*.45;let lane=target;if(tiltFiltered>tiltSensitivity)lane=1;else if(tiltFiltered< -tiltSensitivity)lane=-1;else if(Math.abs(tiltFiltered)<tiltSensitivity*.5)lane=0;if(lane!==target)steer(lane-target)}
async function enableTilt(){if(tiltEnabled||tiltPending)return;tiltPending=true;try{if(!window.isSecureContext){stopTilt('Ouvre le jeu en HTTPS sur ton téléphone pour utiliser les capteurs.');return}if(!window.DeviceOrientationEvent){stopTilt('Capteurs indisponibles : utilise les boutons tactiles.');return}try{const eventType=window.DeviceOrientationEvent;if(typeof eventType.requestPermission==='function'){const permission=await eventType.requestPermission();if(permission!=='granted'){stopTilt('Accès aux capteurs refusé. Les boutons tactiles restent disponibles.');return}}tiltEnabled=true;tiltCenter=null;tiltLast=null;tiltFiltered=0;window.addEventListener('deviceorientation',onTilt);$('tilt-toggle').textContent='DÉSACTIVER L’INCLINAISON';$('tilt-toggle').setAttribute('aria-pressed','true');$('tilt-center').hidden=false;$('tilt-status').textContent='Tiens le téléphone dans ta position de conduite…';tiltTimer=setTimeout(()=>{if(tiltCenter===null)stopTilt('Aucun signal reçu. Vérifie les autorisations des capteurs ou utilise les boutons.')},6000)}catch{stopTilt('Activation impossible. Les boutons tactiles restent disponibles.')}}finally{tiltPending=false}}
function autoTiltFromGesture(){if(!tiltWanted||tiltEnabled||tiltAutoAttempted||!window.matchMedia?.('(pointer:coarse)').matches)return;tiltAutoAttempted=true;void enableTilt()}
$('tilt-toggle').onclick=()=>{tiltWanted=!tiltEnabled;try{localStorage.setItem('love-drivin-tilt',tiltWanted?'on':'off')}catch{}if(!tiltWanted){stopTilt();return}return enableTilt()};
$('tilt-center').onclick=()=>{tiltCenter=tiltLast;tiltFiltered=0;if(mode==='running')steer(-target);$('tilt-status').textContent='Centre recalibré. Bonne route !'};
screen.orientation?.addEventListener('change',()=>{tiltCenter=null;tiltLast=null;tiltFiltered=0});

function portraitMobile(){return typeof window.matchMedia==='function'&&window.matchMedia('(pointer:coarse) and (orientation:portrait)').matches}
let fullscreenBusy=false,orientationLocked=false,hadFullscreen=false,immersive=false;
function fullscreenActive(){return !!(document.fullscreenElement||document.webkitFullscreenElement)}
function fullscreenStatus(message){for(const id of ['fullscreen-status','rotate-fullscreen-status']){const el=$(id);if(el)el.textContent=message}}
function viewportSize(){const root=document.documentElement,v=window.visualViewport;const h=v&&v.scale===1?Math.min(window.innerHeight,v.height):window.innerHeight;const w=v&&v.scale===1?Math.min(window.innerWidth,v.width):window.innerWidth;if(h>0)root.style.setProperty('--game-vh',h+'px');if(w>0)root.style.setProperty('--game-vw',w+'px')}
function syncFullscreenButtons(){const active=fullscreenActive()||immersive;for(const id of ['fullscreen','rotate-fullscreen']){const button=$(id);if(!button)continue;button.disabled=fullscreenBusy;button.setAttribute('aria-pressed',String(active));button.textContent=fullscreenActive()?'QUITTER LE PLEIN ÉCRAN':immersive?'QUITTER LE MODE ÉCRAN':'PLEIN ÉCRAN'}viewportSize()}
function checkLandscape(){viewportSize();if(portraitMobile()&&mode==='running')pause()}
function unlockLandscape(){if(orientationLocked){try{screen.orientation?.unlock?.()}catch{}orientationLocked=false}}
function fullscreenChanged(){const active=fullscreenActive();if(hadFullscreen&&!active){unlockLandscape();if(mode==='running')pause();fullscreenStatus('Plein écran fermé. Reprends le voyage quand tu es prêt.')}hadFullscreen=active;syncFullscreenButtons();checkLandscape()}
async function toggleFullscreen(){if(fullscreenBusy)return;fullscreenBusy=true;syncFullscreenButtons();const root=document.documentElement;try{
if(fullscreenActive()){const exit=document.exitFullscreen||document.webkitExitFullscreen;if(exit)await exit.call(document);unlockLandscape();if(mode==='running')pause();fullscreenStatus('Plein écran fermé. Reprends le voyage quand tu es prêt.');return}
if(immersive){immersive=false;root.classList.remove('immersive-game');if(mode==='running')pause();fullscreenStatus('Mode écran fermé.');return}
const request=root.requestFullscreen||root.webkitRequestFullscreen;
if(!request||document.fullscreenEnabled===false){immersive=true;root.classList.add('immersive-game');fullscreenStatus('Ce navigateur ne permet pas le plein écran du jeu. Tourne le téléphone ; sur iPhone, ajoute le jeu à l’écran d’accueil pour masquer les barres.');return}
try{await request.call(root)}catch{fullscreenStatus('Le navigateur a refusé le plein écran. Ouvre le jeu directement dans Safari ou Chrome, puis tourne le téléphone.');return}
hadFullscreen=fullscreenActive();
// Orientation locking is optional: a rejection must not cancel successful fullscreen.
if(typeof screen.orientation?.lock==='function'){try{await screen.orientation.lock('landscape');orientationLocked=true}catch{fullscreenStatus('Plein écran activé. Tourne le téléphone horizontalement.')}}else fullscreenStatus('Plein écran activé. Tourne le téléphone horizontalement.');
}catch{fullscreenStatus('Le plein écran est indisponible. Tourne le téléphone pour continuer.')}finally{fullscreenBusy=false;syncFullscreenButtons();checkLandscape()}}
for(const id of ['fullscreen','rotate-fullscreen'])if($(id))$(id).onclick=toggleFullscreen;
window.addEventListener('resize',checkLandscape);window.addEventListener('orientationchange',()=>{tiltCenter=null;tiltLast=null;tiltFiltered=0;checkLandscape()});window.visualViewport?.addEventListener('resize',viewportSize);
document.addEventListener('fullscreenchange',fullscreenChanged);document.addEventListener('webkitfullscreenchange',fullscreenChanged);document.addEventListener('visibilitychange',()=>{if(document.hidden){if(mode==='running')pause();if(typeof syncMusic==='function')syncMusic()}});
syncFullscreenButtons();checkLandscape();

// Browsers without an explicit permission prompt can listen immediately.
if(tiltWanted&&window.isSecureContext&&window.DeviceOrientationEvent&&typeof window.DeviceOrientationEvent.requestPermission!=='function'&&window.matchMedia?.('(pointer:coarse)').matches){tiltAutoAttempted=true;void enableTilt()}

const sensitivityInput=$('tilt-sensitivity');if(sensitivityInput){sensitivityInput.value=18-tiltSensitivity;sensitivityInput.oninput=()=>{tiltSensitivity=18-Number(sensitivityInput.value);try{localStorage.setItem('love-drivin-tilt-angle',String(tiltSensitivity))}catch{}}}
