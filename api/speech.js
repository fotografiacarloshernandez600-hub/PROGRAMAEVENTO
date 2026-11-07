// Genera MP3 real en el servidor para evitar fallos de speechSynthesis en Safari.
module.exports=async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='GET'&&req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 const key=process.env.AZURE_SPEECH_KEY,region=process.env.AZURE_SPEECH_REGION;
 if(!key||!region)return res.status(503).json({error:'SPEECH_NOT_CONFIGURED'});
 const text=String(req.query?.text||req.body?.text||'').trim().slice(0,1200);
 if(!text)return res.status(400).json({error:'Empty text'});
 const escaped=text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
 const ssml='<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="es-MX"><voice name="es-MX-DaliaNeural">'+escaped+'</voice></speak>';
 try{
  const response=await fetch('https://'+region+'.tts.speech.microsoft.com/cognitiveservices/v1',{method:'POST',headers:{'Ocp-Apim-Subscription-Key':key,'Content-Type':'application/ssml+xml','X-Microsoft-OutputFormat':'audio-24khz-48kbitrate-mono-mp3','User-Agent':'CIIIA-DACYTI-5'},body:ssml});
  if(!response.ok)return res.status(502).json({error:'TTS_PROVIDER_ERROR'});
  const bytes=Buffer.from(await response.arrayBuffer());
  res.setHeader('Content-Type','audio/mpeg');res.setHeader('Content-Length',String(bytes.length));
  return res.status(200).send(bytes);
 }catch{return res.status(502).json({error:'TTS_UNAVAILABLE'})}
};