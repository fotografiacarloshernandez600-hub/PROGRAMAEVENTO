/* Conversación local contextual sin costo de API. */
const chatState={day:null,kind:null};
const normalize=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const hourSort=a=>Number(a.time.slice(0,2))*60+Number(a.time.slice(3,5));
function conversationalAnswer(raw){
const q=normalize(raw),kb=window.CIIIA_KNOWLEDGE||{},dayMatch=q.match(/\b(11|12|13)\b/);
if(/^(hola|holi|buenas|buenos dias|buenas tardes|buenas noches|hey|saludos|que tal|como estas)( |$)/.test(q))return {answer:"¡Hola! Qué gusto saludarte. Soy DACYT 5.0, tu guía del CIIIA 2026. Tenemos conferencias, talleres y actividades los días 11, 12 y 13 de noviembre. ¿Quieres conocer horarios, saber de qué trata el congreso o aprender algo de inteligencia artificial?",choices:["Horarios","¿Qué es el CIIIA?","¿Qué es la inteligencia artificial?"]};
if(/^(gracias|muchas gracias|te agradezco)/.test(q))return {answer:"¡Con mucho gusto! Estoy aquí para ayudarte. ¿Quieres consultar otro día, taller o conferencia?",choices:["11 de noviembre","12 de noviembre","13 de noviembre"]};
if(/^(adios|hasta luego|bye)/.test(q))return {answer:"¡Hasta pronto! Disfruta el CIIIA 2026. Será un gusto acompañarte durante el congreso.",choices:[]};
if(dayMatch)chatState.day=Number(dayMatch[1]);
if(/^(horarios|agenda|programa|ver horarios|consultar horarios)$/.test(q)){chatState.day=null;chatState.kind=null;return {answer:'¡Vamos a organizar tu visita al CIIIA! Elige un día y te mostraré sus actividades con horarios y sedes.',choices:['11 de noviembre','12 de noviembre','13 de noviembre']}}
if(/^(conferencias|talleres|actividades)$/.test(q)){chatState.kind=q==='talleres'?'Taller':q==='conferencias'?'Conferencia':'Actividad';chatState.day=null;return {answer:'¡Excelente elección! ¿De qué día quieres consultar '+q+'?',choices:['11 de noviembre','12 de noviembre','13 de noviembre']}}
if(/conferencia|ponencia magistral/.test(q))chatState.kind='Conferencia';
else if(/taller/.test(q))chatState.kind='Taller';
else if(/actividad|evento cultural|concurso/.test(q))chatState.kind='Actividad';
if(/que es el ciiia|que es ciiia|de que trata el congreso|objetivo del congreso|para que es el congreso/.test(q))return {answer:kb.what,choices:["¿Qué actividades hay?","Horarios","¿Qué temas se abordarán?"]};
if(/temas del congreso|que temas|tematicas del congreso|que se abordara/.test(q))return {answer:kb.topics,choices:["Conferencias","Talleres","¿Qué es la IA generativa?"]};
if(/cuantos conferencistas|actividades se desarrollan|que actividades hay en el congreso/.test(q))return {answer:kb.activities,choices:["Horarios","Conferencias","Talleres"]};
if(/clausura|cuando termina el congreso/.test(q))return {answer:"La clausura será el 13 de noviembre a las 13:00 en el Teatro Universitario. La fotografía oficial final está programada a las 13:30.",choices:["13 de noviembre","Horarios"]};
if(/inauguracion|cuando inicia el congreso/.test(q))return {answer:"El 11 de noviembre hay un evento cultural a las 08:00 y la inauguración del congreso está programada a las 09:00.",choices:["11 de noviembre","Conferencias"]};
if(/enlace|link|meet|registro|inscripcion|precio|costo/.test(q))return {answer:"No tengo confirmado ese dato en el programa público. Para enlaces de Meet, inscripción o costos, te recomiendo consultar directamente a la organización.",choices:["Horarios","Talleres virtuales"]};
if(/horario|a que hora|programa del dia|agenda|^dias$|^dia$/.test(q)&&!chatState.day)return {answer:"¡Claro! El programa está organizado en tres días. Elige cuál quieres consultar y te mostraré los horarios y actividades.",choices:["11 de noviembre","12 de noviembre","13 de noviembre"]};
if(/^(conferencias|talleres|actividades)$/.test(q)&&!chatState.day)return {answer:"¡Perfecto! ¿De qué día te gustaría conocer "+q+"?",choices:["11 de noviembre","12 de noviembre","13 de noviembre"]};
const dayOnly=/^(el )?(dia )?(11|12|13)( de noviembre)?$/.test(q);
const scheduleIntent=dayOnly||/horario|agenda|programa|conferencia|taller|actividad|que hay|que sucede|que tenemos|que pasa|^11|^12|^13/.test(q);
if(scheduleIntent&&chatState.day){
const items=data.filter(a=>a.day===chatState.day&&(!chatState.kind||(chatState.kind==='Taller'?a.type.includes('Taller'):a.type===chatState.kind))).sort((a,b)=>hourSort(a)-hourSort(b));
if(!items.length)return {answer:"No encontré actividades de esa categoría para el día seleccionado. Puedes elegir otro día o consultar todas las actividades.",choices:["11 de noviembre","12 de noviembre","13 de noviembre","Todas las actividades"]};
const lines=items.slice(0,9).map(a=>a.time+" — "+a.title+(a.place?" ("+a.place+")":""));
return {answer:"Para el "+chatState.day+" de noviembre"+(chatState.kind?" — "+chatState.kind.toLowerCase():"")+" encontré "+items.length+" actividades:\n"+lines.join("\n")+(items.length>9?"\nHay más actividades; puedes verlas en la agenda completa.":"")+"\n¿Quieres otro día o una categoría?",choices:["Conferencias","Talleres","11 de noviembre","12 de noviembre","13 de noviembre"]};
}
if(/todas las actividades/.test(q)){chatState.kind=null;chatState.day=null;return {answer:"¡Por supuesto! Puedes consultar todas las actividades en la agenda o elegir un día.",choices:["11 de noviembre","12 de noviembre","13 de noviembre"]}}
if(kb.faq){const matches=kb.faq.map(item=>({item,score:Math.max(0,...item.keys.map(k=>{const key=normalize(k);return q.includes(key)?key.length:0}))})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);if(matches.length)return {answer:matches[0].item.answer,choices:["Horarios","¿Qué es el CIIIA?","Talleres"]}}
const words=q.split(' ').filter(w=>w.length>3&&!['hola','horarios','donde','cuando','quien','quiero','sobre','cuales','tienen','puedes','decir','favor','congreso'].includes(w));
const matches=data.map(a=>({a,score:words.reduce((n,w)=>n+(normalize(a.title+' '+a.speaker+' '+a.place).includes(w)?1:0),0)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
if(matches.length){const found=matches.slice(0,4).map(x=>x.a);return {answer:"Encontré estas actividades relacionadas:\n"+found.map(a=>a.day+" de noviembre, "+a.time+": "+a.title+(a.place?" — "+a.place:"")).join("\n"),choices:["Horarios","Conferencias","Talleres"]}}
return {answer:"¡Buena pregunta! Puedo ayudarte con el programa del CIIIA y temas como inteligencia artificial, robótica, fibra óptica, ciberseguridad y ciencia de datos. ¿Qué te gustaría explorar?",choices:["Horarios","¿Qué es la inteligencia artificial?","¿Qué es el CIIIA?"]};
}
