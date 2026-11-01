let adhanRegular: HTMLAudioElement | null = null;
let adhanFajr: HTMLAudioElement | null = null;
let activeAudio: HTMLAudioElement | null = null;
let fadeInterval: any = null;

function createAudio(src: string){
  const a = new Audio(src);
  a.preload = 'auto';
  a.volume = 1.0;
  a.setAttribute('playsinline','');
  return a;
}

export function initAdhan(){
  if(adhanRegular && adhanFajr) return;
  adhanRegular = createAudio('/adhan.mp3');
  adhanFajr = createAudio('/adhan-fajr.mp3');
}

export async function playAdhan(type: 'regular' | 'fajr' = 'regular', durationSec = 60){
  if(!adhanRegular) initAdhan();
  activeAudio = type === 'fajr' ? adhanFajr! : adhanRegular!;
  [adhanRegular, adhanFajr].forEach(a=>{ if(a && a!==activeAudio){ a.pause(); a.currentTime=0; } });
  try{
    activeAudio!.currentTime = 0;
    activeAudio!.volume = 1.0;
    await activeAudio!.play();
    setTimeout(()=> fadeOutAndStop(), durationSec * 1000);
    return true;
  }catch(e){ console.log("Play blocked", e); return false; }
}

function fadeOutAndStop(){
  if(!activeAudio) return;
  let vol = activeAudio.volume;
  fadeInterval = setInterval(()=>{
    if(vol > 0.1){ vol -= 0.1; activeAudio!.volume = vol; }
    else { clearInterval(fadeInterval); stopAdhan(); }
  }, 250);
}

export function stopAdhan(){
  if(fadeInterval) clearInterval(fadeInterval);
  [adhanRegular, adhanFajr].forEach(a=>{ if(a){ a.pause(); a.currentTime=0; a.volume=1.0; } });
  activeAudio = null;
}

export function unlockAudio(){
  initAdhan();
  adhanRegular!.play().then(()=>{ adhanRegular!.pause(); adhanRegular!.currentTime=0; }).catch(()=>{});
  adhanFajr!.play().then(()=>{ adhanFajr!.pause(); adhanFajr!.currentTime=0; }).catch(()=>{});
  localStorage.setItem('haqq_audio_unlocked','yes');
}
