// Extracted from Syuze; MIT Copyright (c) 2026 Songhai. See SOURCE-LICENSE.txt.
// Fabula's only additional asset surface. Original audio stays in Storage;
// playback state is local and never becomes a transcript or document.
export function createVoiceControls(item, players) {
 const root=document.createElement('div');root.className='voice-bar';
 const audio=document.createElement('audio');audio.preload='metadata';audio.hidden=true;
 const play=document.createElement('button');play.type='button';play.className='voice-play';
 const track=document.createElement('input');track.type='range';track.min='0';track.max='1';track.step='0.01';track.value='0';track.setAttribute('aria-label','Voice playback position');
 const time=document.createElement('span');time.className='voice-time';
 const rate=document.createElement('button');rate.type='button';rate.className='voice-rate';rate.textContent='1×';rate.setAttribute('aria-label','Playback speed, 1 times');
 const fmt=n=>Number.isFinite(n)?`${Math.floor(n/60)}:${String(Math.floor(n%60)).padStart(2,'0')}`:'—:—';
 const pause=()=>audio.pause();players.add(pause);
 let source='',restoreTime=0,failure='';
 const failureMessage=error=>{
  if(error?.name==='NotAllowedError')return 'Playback blocked';
  if(error?.name==='NotSupportedError')return 'Audio format unsupported';
  const code=audio.error?.code;
  if(code===2)return 'Audio network error';
  if(code===3)return 'Audio decode error';
  if(code===4)return 'Audio format unsupported';
  if(code===1)return 'Audio loading stopped';
  return 'Audio unavailable';
 };
 function paint(){
  play.textContent=audio.paused?'▶':'Ⅱ';play.setAttribute('aria-label',audio.paused?'Play voice note':'Pause voice note');
  const duration=Number.isFinite(audio.duration)?audio.duration:0;
  track.disabled=!duration;track.max=String(duration||1);track.value=String(audio.currentTime);
  track.setAttribute('aria-valuetext',`${fmt(audio.currentTime)} of ${fmt(audio.duration)}`);
  // Idle it says how long the note is; playing, how far along.
  time.textContent=failure|| (source?(audio.currentTime>0?fmt(audio.currentTime):fmt(audio.duration)):'Waiting to sync');
  time.title=failure||'';
  if(failure)time.setAttribute('role','alert');else time.removeAttribute('role');
  root.dataset.state=failure?'error':!source?'waiting':audio.paused?'ready':'playing';
  play.disabled=!source;
  track.style.setProperty('--r',String(duration?Math.min(1,audio.currentTime/duration):0));
 }
 play.onclick=async()=>{if(!source)return;if(audio.paused){failure='';if(audio.error){audio.src=source;audio.load();}players.forEach(p=>{if(p!==pause)p();});try{await audio.play();}catch(error){failure=failureMessage(error);paint();}}else audio.pause();};
 track.oninput=()=>{if(Number.isFinite(audio.duration))audio.currentTime=Number(track.value);paint();};
 rate.onclick=()=>{const rates=[1,1.5,2];audio.playbackRate=rates[(rates.indexOf(audio.playbackRate)+1)%rates.length];rate.textContent=`${audio.playbackRate}×`;rate.setAttribute('aria-label',`Playback speed, ${audio.playbackRate} times`);};
 for(const event of ['play','pause','timeupdate','durationchange','ended'])audio.addEventListener(event,paint);
 audio.addEventListener('loadedmetadata',()=>{if(restoreTime&&Number.isFinite(audio.duration))audio.currentTime=Math.min(restoreTime,audio.duration);restoreTime=0;failure='';paint();});
 audio.addEventListener('error',()=>{failure=failureMessage();paint();});
 for(const event of ['pointerdown','click','dblclick','keydown'])root.addEventListener(event,e=>e.stopPropagation());
 root.update=next=>{const url=next.audioUrl||'';if(url!==source){restoreTime=audio.currentTime;audio.pause();source=url;failure='';if(url)audio.src=url;else audio.removeAttribute('src');}rate.disabled=!url;paint();};
 root.dispose=()=>{audio.pause();audio.removeAttribute('src');audio.load();players.delete(pause);};
 root.append(play,track,time,rate,audio);root.update(item);return root;
}
