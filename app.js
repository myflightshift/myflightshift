'use strict';
const KEY='flightdesk-flights-v1',THEME='myflightshift-theme',RETENTION_KEY='myflightshift-retention-v1';
const $=id=>document.getElementById(id);
const fields=['datum','flug','ziel','start','ende','std','counter','ac','pax','agenten','bemerkung','airlineCode'];
const airline={FR:'Ryanair',QR:'Qatar Airways',CI:'China Airlines',SK:'SAS',EW:'Eurowings',LS:'Jet2.com',G9:'Air Arabia',OS:'Austrian Airlines',LH:'Lufthansa',LX:'SWISS',W6:'Wizz Air',U2:'easyJet',TK:'Turkish Airlines',EK:'Emirates',BA:'British Airways',KL:'KLM',MS:'Egyptair',AF:'Air France',IB:'Iberia',LO:'LOT Polish Airlines',A3:'Aegean Airlines',JU:'Air Serbia',OU:'Croatia Airlines',PC:'Pegasus Airlines',XQ:'SunExpress',DE:'Condor',VY:'Vueling',AY:'Finnair',EI:'Aer Lingus',TP:'TAP Air Portugal',ET:'Ethiopian Airlines',EY:'Etihad Airways',SV:'Saudia',UA:'United Airlines',DL:'Delta Air Lines',AA:'American Airlines',AC:'Air Canada',SQ:'Singapore Airlines',CX:'Cathay Pacific',AI:'Air India','6E':'IndiGo',FZ:'flydubai','5W':'Wizz Air Abu Dhabi','D8':'Norwegian Air Sweden',DY:'Norwegian',BT:'airBaltic',RO:'TAROM',FB:'Bulgaria Air',KM:'KM Malta Airlines',AT:'Royal Air Maroc',TU:'Tunisair',BJ:'Nouvelair',TO:'Transavia France',HV:'Transavia',SN:'Brussels Airlines','4Y':'Discover Airlines',EN:'Air Dolomiti','B6':'JetBlue',QF:'Qantas',NZ:'Air New Zealand'};
Object.assign(airline,{"4M":"Mavi Gök Airlines","A2":"Animawings","A9":"Georgian Airways","BR":"EVA Air","HU":"Hainan Airlines","J2":"Azerbaijan Airlines","LY":"EL AL","MU":"China Eastern Airlines","OV":"SalamAir","PE":"People’s","RB":"Syrian Airlines","RJ":"Royal Jordanian","SM":"Air Cairo","V7":"Volotea","XK":"Air Corsica","XX":"Charterflug"});
let flights=[],editing=null,day=localDay(new Date()),installPrompt=null,filterText='';
function localDay(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function dateAt(d,t){if(!d||!/^\d{2}:\d{2}$/.test(t||''))return null;let x=new Date(`${d}T${t}:00`);return isNaN(x)?null:x}
function status(f,now=new Date()){const s=dateAt(f.datum,f.start),e=dateAt(f.datum,f.ende);if(!s)return 'Folgt';if(e&&e<s)e.setDate(e.getDate()+1);if(e&&now>=e)return 'Beendet';return now>=s?'Aktuell':'Folgt'}
function code(f){return (String(f||'').trim().toUpperCase().match(/^([A-Z0-9]{2})[\s-]*(?=\d)/)||[])[1]||'✈'}
const localLogos=Object.freeze({"4M":"webp","A2":"webp","A9":"webp","AY":"webp","BR":"webp","BT":"webp","CI":"webp","DE":"webp","DY":"webp","EW":"webp","FR":"png","G9":"webp","HU":"webp","J2":"webp","JU":"webp","KM":"webp","LO":"webp","LS":"webp","LY":"webp","MU":"png","OS":"webp","OV":"webp","PE":"webp","QR":"webp","RB":"webp","RJ":"webp","SK":"webp","SM":"webp","SV":"webp","TU":"webp","U2":"webp","V7":"webp","XK":"webp","XX":"webp"});
function flightAirlineCode(f){return (f.airlineCode&&airline[f.airlineCode])?f.airlineCode:code(f.flug)}
function airlineLogo(c){const name=airline[c]||'Unbekannte Airline';return localLogos[c]?`<img src="./airline-logos/${c}.${localLogos[c]}" alt="${escape(name)} Logo" loading="lazy" decoding="async">`:`<span class="logo-fallback" aria-label="${escape(name)}">${escape(c)}</span>`}
function updateAirlinePreview(){const input=document.querySelector('#flightForm [name="flug"]');const automatic=code(input.value);const chosen=$('airlineCode').value;const c=chosen||automatic;const el=$('airlinePreview');if(!el)return;el.innerHTML=airline[c]?`<span class="preview-logo">${airlineLogo(c)}</span><span><strong>${escape(airline[c])}</strong><small>${chosen?'Manuell ausgewählt':'Automatisch erkannt'} · ${escape(c)}</small></span>`:`<span class="preview-logo">✈</span><span><strong>${input.value.trim()?'Airline nicht erkannt':'Airline wird automatisch erkannt'}</strong><small>${input.value.trim()?'Bitte Flugnummer prüfen oder Airline auswählen':'Zum Beispiel FR 1111 oder OS 123'}</small></span>`}
const airlineSelect=$('airlineCode');
for(const c of Object.keys(localLogos).sort((a,b)=>airline[a].localeCompare(airline[b],'de'))){const opt=document.createElement('option');opt.value=c;opt.textContent=`${airline[c]} (${c})`;airlineSelect.append(opt)}
airlineSelect.addEventListener('change',updateAirlinePreview);
function escape(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function read(){try{let x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch{return []}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(flights));return true}catch{toast('Speichern fehlgeschlagen: Speicher voll oder gesperrt');return false}}
function toast(s){$('toast').textContent=s;$('toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.remove('show'),3000)}
function render(){let now=new Date(),items=flights.filter(f=>f.datum===day),live=items.filter(f=>status(f,now)==='Aktuell').sort((a,b)=>a.start.localeCompare(b.start)),next=items.filter(f=>status(f,now)==='Folgt').sort((a,b)=>a.start.localeCompare(b.start)),done=items.filter(f=>status(f,now)==='Beendet').sort((a,b)=>b.ende.localeCompare(a.ende));$('day').value=day;$('dateLabel').textContent=new Date(`${day}T12:00:00`).toLocaleDateString('de-AT',{weekday:'long',day:'numeric',month:'long',year:'numeric'});$('countAll').textContent=items.length;$('countLive').textContent=live.length;$('countNext').textContent=next.length;$('countDone').textContent=done.length;$('openCount').textContent=(live.length+next.length)+' Einsätze';$('doneCount').textContent=done.length+' abgeschlossen';renderSpotlight(live,next);const matches=f=>[f.flug,f.ziel,f.counter,f.agenten].some(v=>String(v||'').toLocaleLowerCase('de').includes(filterText));renderCards('openList',[...live,...next].filter(matches));renderCards('doneList',done.filter(matches))}
function renderSpotlight(live,next){const f=live[0]||next[0],el=$('spotlightContent'),state=$('spotlightState');if(!f){state.textContent='Kein Einsatz';el.onclick=null;el.style.cursor='default';el.innerHTML='<div class="spotlight-empty">Noch kein Einsatz für diesen Tag. <strong>+ Flug</strong> zum Eintragen verwenden.</div>';return}const s=status(f),c=flightAirlineCode(f);state.textContent=s==='Aktuell'?'● Läuft gerade':'◷ Als Nächstes';el.innerHTML=`<div class="spotlight-logo">${airlineLogo(c,true)}</div><div class="spotlight-main"><div class="spotlight-flight">${escape(f.flug)} <span>→ ${escape(f.ziel)}</span></div><div class="spotlight-meta">${escape(airline[c]||'Airline')} · ${s==='Aktuell'?'Check-in läuft':'Check-in beginnt'} um ${escape(f.start)}</div><div class="spotlight-location">${escape(f.counter?'Counter / Gate '+f.counter:'Counter / Gate noch nicht eingetragen')}</div></div><div class="spotlight-time"><span>START</span><strong>${escape(f.start)}</strong><small>Ende ${escape(f.ende||'—')}</small></div>`;el.onclick=()=>openEditor(f.id);el.style.cursor='pointer';}
function renderCards(id,list){const parent=$(id);parent.replaceChildren();if(!list.length){let d=document.createElement('div');d.className='empty';d.textContent=id==='openList'?'Keine aktuellen oder kommenden Flüge':'Noch keine beendeten Flüge';parent.append(d);return}for(const f of list){let s=status(f),c=flightAirlineCode(f),el=document.createElement('article');el.className='flightcard';el.tabIndex=0;el.setAttribute('role','button');el.setAttribute('aria-label',`${f.flug}, ${f.ziel}, bearbeiten`);el.innerHTML=`<div class="logo" aria-label="${escape(airline[c]||c)}">${airlineLogo(c)}</div><div class="details"><div class="flighttop"><strong>${escape(f.flug)}</strong><span class="destination">${escape(f.ziel)}</span></div><div class="meta">Counter/Gate ${escape(f.counter||'—')} · STD ${escape(f.std||'—')} · Ende ${escape(f.ende||'—')}<br>${escape(airline[c]||c)}${f.agenten?' · '+escape(f.agenten):''}</div></div><div class="right"><strong>${escape(f.start||'—')}</strong><span class="pill ${s==='Aktuell'?'live':s==='Beendet'?'done':''}">${s}</span></div>`;el.addEventListener('click',()=>openEditor(f.id));el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openEditor(f.id)}});parent.append(el)}}
function openEditor(id=null){editing=id;let f=flights.find(x=>x.id===id)||{};$('modalTitle').textContent=id?'Flug bearbeiten':'Neuen Flug hinzufügen';for(let name of fields){$('flightForm').elements[name].value=f[name]??(name==='datum'?day:'')}$('delete').hidden=!id;updateAirlinePreview();$('editor').showModal()}
function closeEditor(){$('editor').close();editing=null}
document.querySelector('#flightForm [name="flug"]').addEventListener('input',updateAirlinePreview);$('filter').addEventListener('input',e=>{filterText=e.target.value.trim().toLocaleLowerCase('de');render()});$('new').onclick=()=>openEditor();$('close').onclick=closeEditor;$('cancel').onclick=closeEditor;
$('flightForm').onsubmit=e=>{e.preventDefault();let data={};for(let name of fields)data[name]=$('flightForm').elements[name].value.trim();data.flug=data.flug.toUpperCase();if(!dateAt(data.datum,data.start)||!dateAt(data.datum,data.ende)){toast('Bitte gültige Start- und Endzeit eingeben');return}data.id=editing||((crypto.randomUUID&&crypto.randomUUID())||String(Date.now())+Math.random());let old=flights.slice();flights=editing?flights.map(f=>f.id===editing?data:f):[...flights,data];if(!save()){flights=old;return}day=data.datum;closeEditor();render();toast('Flug gespeichert')};
$('delete').onclick=()=>{if(!editing||!confirm('Diesen Flug wirklich löschen?'))return;let old=flights.slice();flights=flights.filter(f=>f.id!==editing);if(!save()){flights=old;return}closeEditor();render();toast('Flug gelöscht')};
$('day').onchange=e=>{if(e.target.value){day=e.target.value;render()}};$('today').onclick=()=>{day=localDay(new Date());render()};function shift(n){let d=new Date(`${day}T12:00:00`);d.setDate(d.getDate()+n);day=localDay(d);render()}$('prev').onclick=()=>shift(-1);$('next').onclick=()=>shift(1);
$('export').onclick=()=>{try{const blob=new Blob([JSON.stringify({app:'MyFlightShift',version:1,exported:new Date().toISOString(),flights},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`myflightshift-backup-${localDay(new Date())}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);toast('Backup-Datei erstellt – bitte sicher aufbewahren')}catch{toast('Backup konnte nicht erstellt werden')}};
// Backups are JSON files stored by the user, never uploaded to a server.
function validBackupFlight(x){return x&&typeof x==='object'&&!Array.isArray(x)&&dayNumber(x.datum)!==null&&typeof x.flug==='string'&&x.flug.trim().length>0&&x.flug.length<=30&&typeof x.start==='string'&&dateAt(x.datum,x.start)!==null&&typeof x.ende==='string'&&dateAt(x.datum,x.ende)!==null&&fields.every(k=>x[k]===undefined||['string','number'].includes(typeof x[k]))}
$('import').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{
 if(file.size>5*1024*1024)throw Error('Backup ist zu groß (maximal 5 MB)');
 let data=JSON.parse(await file.text());if(!Array.isArray(data)){if(!data||data.app!=='MyFlightShift')throw Error('Keine MyFlightShift-Sicherung');data=data.flights}
 if(!Array.isArray(data)||data.length>10000||!data.every(validBackupFlight))throw Error('Backup enthält ungültige Flüge');
 const cleaned=data.map(x=>{const f={};for(const k of fields)f[k]=String(x[k]??'');f.id=String(x.id||((crypto.randomUUID&&crypto.randomUUID())||Date.now()+Math.random()));return f});
 if(!confirm(`${cleaned.length} Flüge aus der Sicherung wiederherstellen?\n\nDie derzeit gespeicherten ${flights.length} Flüge werden ersetzt. Falls du diese behalten möchtest, zuerst „Backup herunterladen“ wählen.`))return;
 const old=flights.slice();flights=cleaned;if(!save()){flights=old;return}applyRetention(true);render();toast(`${cleaned.length} Flüge wiederhergestellt`)
 }catch(err){alert('Backup konnte nicht importiert werden: '+(err.message||'Ungültige Datei'))}finally{e.target.value=''}};

// Local calendar dates prevent time-zone and daylight-saving changes from shifting the retention day.
function dayNumber(iso){if(!/^\d{4}-\d{2}-\d{2}$/.test(String(iso||'')))return null;const [y,m,d]=iso.split('-').map(Number),v=Date.UTC(y,m-1,d),dt=new Date(v);return dt.getUTCFullYear()===y&&dt.getUTCMonth()===m-1&&dt.getUTCDate()===d?Math.floor(v/86400000):null}
function getRetention(){try{const s=JSON.parse(localStorage.getItem(RETENTION_KEY)||'{}');return {days:['7','30','90','never'].includes(String(s.days))?String(s.days):'30',warning:s.warning!==false}}catch{return {days:'30',warning:true}}}
function storeRetention(){const s={days:$('retentionDays').value,warning:$('retentionWarning').checked};try{localStorage.setItem(RETENTION_KEY,JSON.stringify(s))}catch{toast('Einstellung konnte nicht gespeichert werden')}return s}
function updateRetentionInfo(){const s=getRetention();$('retentionDays').value=s.days;$('retentionWarning').checked=s.warning;$('retentionInfo').textContent=s.days==='never'?'Keine automatische Löschung aktiv.':'Flüge werden '+s.days+' Tage nach ihrem Einsatzdatum beim nächsten Öffnen oder Verwenden entfernt. Eine Vorwarnung erscheint ab 3 Tagen vor der Löschung.'}
let lastRetentionCheck='';
function applyRetention(force=false){const now=localDay(new Date()),settings=getRetention(),today=dayNumber(now);if(!force&&lastRetentionCheck===now)return;if(settings.days==='never'){lastRetentionCheck=now;return;}const days=Number(settings.days),expired=flights.filter(f=>{const d=dayNumber(f.datum);return d!==null&&today-d>=days}),upcoming=flights.filter(f=>{const d=dayNumber(f.datum);return d!==null&&today-d>=days-3&&today-d<days});
if(expired.length){if(settings.warning){const ok=confirm(`${expired.length} Flug/Flüge sind mindestens ${days} Tage alt und werden jetzt automatisch aus diesem Browser gelöscht.\n\nExportierte Backups sind nicht betroffen.\n\nOK = Löschen, Abbrechen = vorerst behalten.`);if(!ok){lastRetentionCheck=now;return}}const previous=flights.slice();flights=flights.filter(f=>!expired.includes(f));if(!save()){flights=previous;return}toast(`${expired.length} alte Flüge gelöscht`)}
lastRetentionCheck=now;
if(upcoming.length&&settings.warning){const warnedKey='myflightshift-retention-warned-'+now;try{if(!sessionStorage.getItem(warnedKey)){sessionStorage.setItem(warnedKey,'1');setTimeout(()=>alert(`Hinweis: ${upcoming.length} Flug/Flüge erreichen innerhalb der nächsten 3 Tage die Aufbewahrungsfrist von ${days} Tagen. Sichere sie bei Bedarf über „Backup exportieren“. Die automatische Löschung erfolgt beim nächsten Öffnen oder Verwenden nach Fristablauf.`),100)}}catch{}}
}
$('retentionDays').addEventListener('change',()=>{storeRetention();updateRetentionInfo();applyRetention(true);render()});
$('retentionWarning').addEventListener('change',()=>{storeRetention();updateRetentionInfo()});
$('clearAll').addEventListener('click',()=>{if(!flights.length){toast('Keine Flüge vorhanden');return}if(!confirm(`Wirklich alle ${flights.length} gespeicherten Flüge auf diesem Gerät löschen? Diese Aktion kann nicht rückgängig gemacht werden.`))return;const old=flights.slice();flights=[];if(!save()){flights=old;return}render();toast('Alle Flüge gelöscht')});

function theme(){let t=localStorage.getItem(THEME);document.body.classList.toggle('light',t!=='dark')}theme();$('theme').onclick=()=>{localStorage.setItem(THEME,document.body.classList.contains('light')?'dark':'light');theme()};
// Installationshinweise: plattformspezifisch, ohne automatische Installation zu behaupten.
const installBanner=$('installBanner'), installButton=$('installBannerButton'), installSettings=$('install');
const installDialog=$('installDialog');
const ua=navigator.userAgent||'';
const ios=/iPad|iPhone|iPod/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const android=/Android/i.test(ua);
const iosChrome=ios&&/CriOS/i.test(ua), iosFirefox=ios&&/FxiOS/i.test(ua);
const isStandalone=()=>window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const canPrompt=()=>!!installPrompt;
const installDismissKey='myflightshift-install-dismissed-v1.4';
function showInstallDialog(){
  let title='MyFlightShift installieren',body='';
  if(location.protocol==='file:'||!window.isSecureContext){body='<p>Die Installation als Web-App ist erst möglich, wenn deine Website über <strong>HTTPS</strong> erreichbar ist.</p><p>Bitte warte auf die SSL-Aktivierung bei ALL-INKL. Du kannst die Website bis dahin im Browser testen.</p>'}
  else if(ios){body='<p><strong>So installierst du MyFlightShift auf deinem iPhone oder iPad:</strong></p><ol><li>Öffne <strong>myflightshift.at</strong> in <strong>Safari</strong>.'+(iosChrome||iosFirefox?' Du verwendest gerade einen anderen Browser.':'')+'</li><li>Tippe auf <strong>Teilen</strong> (Quadrat mit Pfeil nach oben).</li><li>Wähle <strong>Zum Home-Bildschirm</strong>.</li><li>Aktiviere, falls angezeigt, <strong>Als Web-App öffnen</strong> und tippe auf <strong>Hinzufügen</strong>.</li></ol><p>Danach findest du MyFlightShift wie eine App auf deinem Home-Bildschirm.</p>'}
  else if(android){body='<p><strong>So installierst du MyFlightShift auf Android:</strong></p><ol><li>Öffne die Website in <strong>Chrome</strong>.</li><li>Tippe auf das <strong>Drei-Punkte-Menü (⋮)</strong>.</li><li>Wähle <strong>App installieren</strong> oder <strong>Zum Startbildschirm hinzufügen</strong>.</li><li>Bestätige die Installation.</li></ol><p>Falls keine Installationsoption erscheint, prüfe, ob die Seite über HTTPS geladen wird.</p>'}
  else {body='<p><strong>Installation am Computer:</strong></p><ol><li>Öffne MyFlightShift in <strong>Chrome oder Edge</strong>.</li><li>Wähle im Browsermenü <strong>App installieren</strong> bzw. <strong>Apps → Diese Website als App installieren</strong>.</li><li>Bestätige die Installation.</li></ol><p>Die genaue Bezeichnung hängt vom Browser ab.</p>'}
  $('installDialogTitle').textContent=title;$('installDialogBody').innerHTML=body;
  if(typeof installDialog.showModal==='function')installDialog.showModal();else alert(installDialog.textContent);
}
function refreshInstallUI(){
  const installed=isStandalone();
  installBanner.hidden=installed||sessionStorage.getItem(installDismissKey)==='1';
  installSettings.hidden=installed;
  if(installed)return;
  $('installSummary').textContent=(location.protocol==='file:'||!window.isSecureContext)?'Für die Installation muss zuerst HTTPS aktiviert werden.':ios?'Auf dem iPhone über Safari zum Home-Bildschirm hinzufügen.':android?'Kostenlos auf deinem Android-Startbildschirm installieren.':'Als eigenständige App auf deinem Gerät nutzen.';
  installButton.textContent=(location.protocol==='file:'||!window.isSecureContext)?'So geht’s':canPrompt()?'Jetzt installieren':ios?'iPhone-Anleitung':android?'Installieren':'Installationsanleitung';
  installSettings.textContent=canPrompt()?'App installieren':'App installieren – Anleitung';
}
async function requestInstallation(){
  if(isStandalone())return;
  if(location.protocol!=='file:'&&window.isSecureContext&&installPrompt){
    const event=installPrompt;installPrompt=null;
    try{await event.prompt();await event.userChoice;}catch(e){showInstallDialog()}
    refreshInstallUI();
  }else showInstallDialog();
}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;refreshInstallUI()});
window.addEventListener('appinstalled',()=>{installPrompt=null;installBanner.hidden=true;installSettings.hidden=true;toast('MyFlightShift wurde installiert!')});
installButton.addEventListener('click',requestInstallation);
installSettings.addEventListener('click',requestInstallation);
$('installDismiss').addEventListener('click',()=>{sessionStorage.setItem(installDismissKey,'1');refreshInstallUI()});
$('installDialogClose').addEventListener('click',()=>installDialog.close());
$('installDialogDone').addEventListener('click',()=>installDialog.close());
refreshInstallUI();
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
flights=read();updateRetentionInfo();applyRetention(true);render();setInterval(()=>{applyRetention();render()},60000);document.addEventListener('visibilitychange',()=>{if(!document.hidden){applyRetention(true);render()}});
