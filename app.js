const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let day='all',favoritesOnly=false;let fav=new Set;
try{fav=new Set(JSON.parse(localStorage.getItem('ciiia-favorites')||'[]'))}catch{}
$('#count').textContent=data.length;
function render(){
let q=$('#search').value.toLocaleLowerCase('es'),cat=$('#category').value;
let matches=data.filter(a=>(day==='all'||String(a.day)===day)&&(cat==='all'||a.type===cat)&&(!favoritesOnly||fav.has(a.id))&&[a.title,a.speaker,a.place,a.time,a.mode].join(' ').toLocaleLowerCase('es').includes(q)).sort((a,b)=>a.day-b.day||a.time.localeCompare(b.time));
$('#resultCount').textContent=matches.length+' actividades encontradas';
$('#cards').innerHTML=matches.map(a=>'<article class="activity"><div class="activity-top"><span class="tag">'+esc(a.type)+'</span><button class="favorite '+(fav.has(a.id)?'saved':'')+'" data-id="'+a.id+'" aria-label="Guardar favorito">'+(fav.has(a.id)?'★':'☆')+'</button></div><h3>'+esc(a.title)+'</h3><p class="speaker">'+esc(a.speaker||'Programa CIIIA 2026')+'</p><div class="activity-meta"><span>◷ '+esc(a.time)+' · '+a.day+' de noviembre</span><span>⌖ '+esc(a.place||'Sede por confirmar')+' · '+esc(a.mode)+'</span></div></article>').join('')||'<p>No se encontraron actividades con esos filtros.</p>';
document.querySelectorAll('.favorite').forEach(b=>b.onclick=()=>{let id=Number(b.dataset.id);fav.has(id)?fav.delete(id):fav.add(id);try{localStorage.setItem('ciiia-favorites',JSON.stringify([...fav]))}catch{}render();document.dispatchEvent(new Event('ciiia:favorites-updated'))});
}
document.querySelectorAll('[data-day]').forEach(b=>b.onclick=()=>{day=b.dataset.day;document.querySelectorAll('[data-day]').forEach(x=>x.classList.toggle('active',x===b));render()});
$('#search').oninput=render;$('#category').onchange=render;$('#favToggle').onclick=()=>{favoritesOnly=!favoritesOnly;$('#favToggle').textContent=favoritesOnly?'★ Mostrando favoritos':'☆ Ver mis favoritos';render()};render();
function respond(q){
let t=q.toLocaleLowerCase('es');const info=window.CIIIA_KNOWLEDGE||{};if(/qu[eé] es (el |la )?(ciiia|congreso)|de qu[eé] trata|objetivo del congreso|prop[oó]sito del congreso|para qu[eé] es/.test(t))return info.what;if(/qu[eé] temas|temas se|tem[aá]ticas|se abordar[aá]|aprendizaje autom[aá]tico|ciberseguridad|[eé]tica/.test(t))return info.topics;if(/qu[eé] actividades|actividades se|cu[aá]ntos conferencistas|participantes del congreso|quienes participan/.test(t))return info.activities;if(/clausura|termina el congreso|cierre/.test(t))return 'La clausura está programada para el viernes 13 de noviembre a las 13:00, en el Teatro Universitario. A las 13:30 se realizará la fotografía oficial final.';
if(/inauguraci[oó]n|comienza el congreso|inicia el congreso/.test(t))return 'El 11 de noviembre a las 08:00 hay un evento cultural de profesores y estudiantes DACYTI. La inauguración del congreso es a las 09:00.';
if(/meet|enlace|link/.test(t))return 'El programa identifica algunas actividades como virtuales por Meet, pero no incluye enlaces de acceso. Consulta con la organización.';
let ds=t.match(/(?:d[ií]a\s*)?(11|12|13)(?:\s*de\s*noviembre)?/);
let terms=t.normalize('NFD').replace(/[\u0300-\u036f]/g,'').split(/\W+/).filter(w=>w.length>3&&!['para','como','donde','cuales','cuando','sobre','talleres','conferencias','noviembre','actividades','programa','quiero','tienen','horario','hora','dime','estan'].includes(w));
let matches=data.filter(a=>(!ds||a.day===Number(ds[1]))&&(!/taller/.test(t)||a.type.includes('Taller'))&&(!/conferencia/.test(t)||a.type==='Conferencia')&&(!/virtual/.test(t)||a.mode==='Virtual'||a.type==='Taller virtual')&&(!/presencial/.test(t)||a.mode==='Presencial')&&(!terms.length||terms.some(w=>(a.title+' '+a.speaker+' '+a.place).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(w))));
if(!matches.length&&ds)matches=data.filter(a=>a.day===Number(ds[1]));
if(!matches.length)return 'No encontré una coincidencia clara en el programa. Prueba con una fecha (11, 12 o 13 de noviembre), un tema, un ponente o el nombre de una actividad.';
return 'Encontré '+matches.length+' actividad(es) relacionada(s):\n\n'+matches.slice(0,7).map(a=>'• '+a.day+'/nov · '+a.time+': '+a.title+(a.speaker?' — '+a.speaker:'')+' ('+(a.place||'sede no indicada')+')').join('\n')+(matches.length>7?'\n\nY '+(matches.length-7)+' más. Usa los filtros de la agenda para verlas todas.':'');
}
function showChoices(choices){let old=$('#chatChoices');if(old)old.remove();if(!choices?.length)return;const panel=document.createElement('div');panel.id='chatChoices';panel.className='chat-choices';for(const label of choices){const button=document.createElement('button');button.type='button';button.textContent=label;button.onclick=()=>ask(label);panel.appendChild(button)}$('#messages').appendChild(panel);$('#messages').scrollTop=$('#messages').scrollHeight}
async function ask(q){if(!q.trim())return;if(/(?:activa|activar|inicia|iniciar|abre|modo)\s+(?:el\s+)?modo\s+futuro|modo\s+futuro/i.test(q)){window.CIIIAExperience?.futureMode();return}const m=$('#messages');const old=$('#chatChoices');if(old)old.remove();const user=document.createElement('div');user.className='message user';user.textContent=q;m.appendChild(user);const result=conversationalAnswer(q);const bot=document.createElement('div');bot.className='message bot';bot.textContent=result.answer;m.appendChild(bot);showChoices(result.choices);m.scrollTop=m.scrollHeight;speakRobot(result.answer)}
$('#chatForm').onsubmit=e=>{e.preventDefault();ask($('#question').value);$('#question').value=''};
document.querySelectorAll('.suggest').forEach(b=>b.onclick=()=>{ask(b.textContent);location.hash='asistente'});

let voiceEnabled=true;let currentSpeech=null;let mobileSpeechWatchdog=null;let lastRobotAnswer='';const replayAudioButton=$('#playRobotAudio');replayAudioButton?.addEventListener('click',()=>{if(lastRobotAnswer)fallbackSpeakRobot(lastRobotAnswer)});const synth=window.speechSynthesis;const robot=$('#robotAvatar'),status=$('#robotStatus');
function stopRobot(){clearTimeout(mobileSpeechWatchdog);stopLocalVisemes();if(synth)synth.cancel();robot.classList.remove('speaking','mouth-open');status.textContent='Listo para ayudarte';currentSpeech=null}
function fallbackSpeakRobot(text){
 lastRobotAnswer=text;if(replayAudioButton)replayAudioButton.hidden=false;
 stopRobot();
 if(!voiceEnabled||!synth||typeof SpeechSynthesisUtterance==='undefined'){status.textContent='Voz no compatible con este navegador';return}
 const u=new SpeechSynthesisUtterance(text);
 u.lang='es-MX';u.rate=0.98;u.pitch=1;u.volume=1;
 const voices=synth.getVoices();
 const es=voices.find(v=>v.lang.toLowerCase()==='es-mx'&&v.localService)||voices.find(v=>v.lang.toLowerCase().startsWith('es')&&v.localService)||voices.find(v=>v.lang.toLowerCase().startsWith('es'));
 if(es)u.voice=es;
 let started=false;
 u.onstart=()=>{started=true;robot.classList.add('speaking');status.textContent='Hablando…';animateLocalVisemes()};
 u.onboundary=()=>{robot.classList.remove('mouth-open');void robot.offsetWidth;robot.classList.add('mouth-open')};
 u.onend=()=>{clearTimeout(mobileSpeechWatchdog);stopLocalVisemes();robot.classList.remove('speaking');status.textContent='Listo para ayudarte'};
 u.onerror=e=>{clearTimeout(mobileSpeechWatchdog);stopLocalVisemes();robot.classList.remove('speaking');status.textContent=e.error==='not-allowed'?'Toca de nuevo para activar el audio':'No se pudo reproducir la voz'};
 currentSpeech=u;
 // En Safari/Chrome móvil, iniciar el audio en el gesto que envía el mensaje.
 try{synth.speak(u);synth.resume()}catch{status.textContent='No se pudo iniciar el audio';return}
 mobileSpeechWatchdog=setTimeout(()=>{if(currentSpeech===u&&!started){status.textContent='Toca «Escuchar respuesta» para intentar activar el audio';stopLocalVisemes()}},3500);
}
/* Visemas temporizados: cuando Azure Speech está configurado, el SDK entrega
   IDs de visema alineados al audio generado. Sin Azure se usa la voz local. */
let azurePlayer=null,azureSynth=null,visemeFrames=[],visemeRaf=0,speechSerial=0;
const visemeMouth=$('#visemeMouth');
let localVisemeTimer=null;
function animateLocalVisemes(){clearInterval(localVisemeTimer);let step=0;localVisemeTimer=setInterval(()=>{setViseme([1,4,7,10,13,16,19,5,2,0][step++%10])},115)}
function stopLocalVisemes(){clearInterval(localVisemeTimer);localVisemeTimer=null;setViseme(0)}
function setViseme(id){if(!visemeMouth)return;visemeMouth.dataset.viseme=String(id);visemeMouth.style.opacity=id===0?'0.15':'1'}
const baseStopRobot=stopRobot;
stopRobot=function(){speechSerial++;if(azureSynth){try{azureSynth.close()}catch{}azureSynth=null}if(azurePlayer){try{azurePlayer.pause()}catch{}azurePlayer=null}cancelAnimationFrame(visemeRaf);visemeFrames=[];setViseme(0);baseStopRobot()};
function speakRobot(text){lastRobotAnswer=text;if(replayAudioButton)replayAudioButton.hidden=false;if(!voiceEnabled)return;const isAppleMobile=/iPad|iPhone|iPod/.test(navigator.userAgent)||(/Macintosh/.test(navigator.userAgent)&&navigator.maxTouchPoints>1);if(isAppleMobile||/Android|Mobile/i.test(navigator.userAgent)){fallbackSpeakRobot(text);return}const sdk=window.SpeechSDK;if(!sdk){fallbackSpeakRobot(text);return}const requestId=++speechSerial;fetch('/api/speech-token').then(async r=>{if(!r.ok)throw Error('Azure no configurado');return r.json()}).then(({token,region})=>{if(requestId!==speechSerial)return;stopRobot();const id=speechSerial;const config=sdk.SpeechConfig.fromAuthorizationToken(token,region);config.speechSynthesisVoiceName='es-MX-DaliaNeural';config.speechSynthesisOutputFormat=sdk.SpeechSynthesisOutputFormat.Audio24Khz48KBitRateMonoMp3;azurePlayer=new sdk.SpeakerAudioDestination();const audioConfig=sdk.AudioConfig.fromSpeakerOutput(azurePlayer);azureSynth=new sdk.SpeechSynthesizer(config,audioConfig);visemeFrames=[];robot.classList.add('speaking');status.textContent='Hablando con sincronización de visemas…';azureSynth.visemeReceived=(_,e)=>{visemeFrames.push({t:e.audioOffset/10000000,id:e.visemeId});visemeFrames.sort((a,b)=>a.t-b.t)};let last=-1;function tick(){if(id!==speechSerial)return;const time=azurePlayer?azurePlayer.currentTime:0;let active=0;for(const frame of visemeFrames){if(frame.t<=time+.025)active=frame.id;else break}if(active!==last){setViseme(active);last=active}visemeRaf=requestAnimationFrame(tick)}tick();azurePlayer.onAudioEnd=()=>{if(id!==speechSerial)return;cancelAnimationFrame(visemeRaf);robot.classList.remove('speaking');setViseme(0);status.textContent='Listo para ayudarte';if(azureSynth){azureSynth.close();azureSynth=null}};azureSynth.speakTextAsync(text,()=>{},()=>{if(id===speechSerial){stopRobot();fallbackSpeakRobot(text)}})}).catch(()=>{if(requestId===speechSerial)fallbackSpeakRobot(text)})}
