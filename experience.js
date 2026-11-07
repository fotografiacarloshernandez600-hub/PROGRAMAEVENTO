/* Experiencias locales gratuitas CIIIA 2026 */
(()=>{'use strict';
const $=s=>document.querySelector(s);
const facts=[
'La IA generativa puede crear textos, imágenes y código, pero sus respuestas deben verificarse.',
'El aprendizaje automático descubre patrones a partir de datos.',
'La fibra óptica transmite información mediante pulsos de luz.',
'La ciberseguridad protege datos, redes y dispositivos.',
'Una red neuronal artificial procesa información mediante capas de operaciones matemáticas.',
'La IA responsable considera privacidad, transparencia y sesgos.',
'El procesamiento del lenguaje natural permite analizar y generar texto.',
'La robótica combina sensores, control, mecánica y programación.'
];
const quiz=[
{q:'¿Qué tecnología permite aprender patrones a partir de datos?',options:['Aprendizaje automático','Fibra óptica','Impresión 3D'],correct:0,why:'El aprendizaje automático utiliza datos para identificar patrones y hacer predicciones.'},
{q:'¿Qué transmite información mediante pulsos de luz?',options:['Bluetooth','Fibra óptica','GPS'],correct:1,why:'La fibra óptica utiliza luz para transportar señales.'},
{q:'¿Cuál es una buena práctica al utilizar IA generativa?',options:['Compartir contraseñas','Confiar en todo','Verificar sus respuestas'],correct:2,why:'Los modelos generativos pueden equivocarse.'},
{q:'¿Qué significa NLP o PLN?',options:['Procesamiento del lenguaje natural','Protocolo de luz neuronal','Programa de lógica numérica'],correct:0,why:'El PLN estudia cómo procesar lenguaje humano mediante computadoras.'},
{q:'¿Qué disciplina protege sistemas y datos?',options:['Robótica','Ciberseguridad','Realidad aumentada'],correct:1,why:'La ciberseguridad ayuda a prevenir accesos no autorizados y ataques.'}
];
const randomFact=()=>facts[Math.floor(Math.random()*facts.length)];
let quizIndex=0,score=0,locked=false;
const quizBox=$('#quizGame'),factText=$('#factText'),factNext=$('#factNext');
function showFact(){if(factText)factText.textContent=randomFact()}
function showQuiz(){if(!quizBox)return;locked=false;const item=quiz[quizIndex];quizBox.replaceChildren();const counter=document.createElement('p');counter.className='game-meta';counter.textContent='Pregunta '+(quizIndex+1)+' de '+quiz.length+' · Puntos: '+score;const heading=document.createElement('h3');heading.textContent=item.q;const options=document.createElement('div');options.className='quiz-options';const feedback=document.createElement('p');feedback.className='quiz-feedback';item.options.forEach((opt,i)=>{const btn=document.createElement('button');btn.type='button';btn.textContent=opt;btn.onclick=()=>{if(locked)return;locked=true;options.querySelectorAll('button').forEach(b=>b.disabled=true);if(i===item.correct){score++;btn.classList.add('correct');feedback.textContent='¡Correcto! '+item.why}else{btn.classList.add('incorrect');options.children[item.correct].classList.add('correct');feedback.textContent='La respuesta correcta es: '+item.options[item.correct]+'. '+item.why}const next=document.createElement('button');next.className='quiz-next';next.textContent=quizIndex===quiz.length-1?'Ver resultado':'Siguiente pregunta';next.onclick=()=>{quizIndex++;if(quizIndex===quiz.length){quizBox.replaceChildren();const end=document.createElement('h3');end.textContent='¡Reto completado! '+score+'/'+quiz.length;const again=document.createElement('button');again.textContent='Volver a jugar';again.onclick=()=>{quizIndex=0;score=0;showQuiz()};quizBox.append(end,again)}else showQuiz()};quizBox.append(feedback,next)};options.appendChild(btn)});quizBox.append(counter,heading,options)};
showFact();showQuiz();factNext?.addEventListener('click',showFact);
const secret=$('#futureOverlay'),secretClose=$('#futureClose');
function futureMode(){if(!secret)return;secret.hidden=false;document.body.classList.add('future-active');secretClose?.focus();if(typeof window.speakRobot==='function')window.speakRobot('Protocolo de innovación activado. Bienvenido al futuro de la inteligencia artificial.')}
function endFuture(){if(!secret)return;secret.hidden=true;document.body.classList.remove('future-active')}
secretClose?.addEventListener('click',endFuture);secret?.addEventListener('click',e=>{if(e.target===secret)endFuture()});document.addEventListener('keydown',e=>{if(e.key==='Escape')endFuture()});
window.CIIIAExperience={futureMode,showFact};
const planner=$('#myAgenda'),plannerCount=$('#myAgendaCount'),plannerExport=$('#plannerExport');
function refreshPlanner(){if(!planner)return;const ids=typeof fav!=='undefined'?[...fav]:[];const selected=data.filter(a=>ids.includes(a.id)).sort((a,b)=>a.day-b.day||a.time.localeCompare(b.time));plannerCount.textContent=selected.length+' actividades guardadas';planner.replaceChildren();if(!selected.length){const p=document.createElement('p');p.textContent='Guarda actividades con la estrella ☆ de la agenda para crear tu itinerario.';planner.append(p);return}selected.forEach(a=>{const item=document.createElement('div');item.className='planner-item';item.textContent=a.day+' nov · '+a.time+' · '+a.title+(a.place?' · '+a.place:'');planner.append(item)})}
plannerExport?.addEventListener('click',()=>{const ids=typeof fav!=='undefined'?[...fav]:[];const selected=data.filter(a=>ids.includes(a.id)).sort((a,b)=>a.day-b.day||a.time.localeCompare(b.time));if(!selected.length)return;const content='Mi itinerario CIIIA 2026\n\n'+selected.map(a=>a.day+' de noviembre, '+a.time+' — '+a.title+' — '+(a.place||'Sede por confirmar')).join('\n');const blob=new Blob([content],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='mi-itinerario-ciiia-2026.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
document.addEventListener('ciiia:favorites-updated',refreshPlanner);refreshPlanner();
})();
