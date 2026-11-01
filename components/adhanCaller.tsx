'use client'
import { useEffect, useState } from 'react'
import { getLocation, getPrayerTimes } from '@/lib/prayer'
import { playAdhan, stopAdhan, unlockAudio, initAdhan } from '@/lib/adhanPlayer'

export default function AdhanCaller(){
  const [next, setNext] = useState("")
  const [enabled, setEnabled] = useState(false)
  const [unlocked, setUnlocked] = useState(false)

  useEffect(()=>{
    initAdhan();
    setUnlocked(localStorage.getItem('haqq_audio_unlocked') === 'yes');
    setEnabled(localStorage.getItem('haqq_adhan_enabled') === 'yes');

    (async()=>{
      const {lat,lng} = await getLocation();
      const pt = getPrayerTimes(lat,lng);
      const prayers = [
        { name:'Fajr', time:pt.fajr, type:'fajr' as const },
        { name:'Dhuhr', time:pt.dhuhr, type:'regular' as const },
        { name:'Asr', time:pt.asr, type:'regular' as const },
        { name:'Maghrib', time:pt.maghrib, type:'regular' as const },
        { name:'Isha', time:pt.isha, type:'regular' as const },
      ]
      setInterval(()=>{
        const now = new Date();
        for(const p of prayers){
          const diff = p.time.getTime() - now.getTime();
          if(diff > 0 && diff < 60000 && enabled && unlocked){
            playAdhan(p.type, 60);
            if(Notification.permission === 'granted'){
              new Notification(`Adhan ${p.name} 🕌`, { body: p.type==='fajr' ? 'As-salatu khayrun min an-nawm' : 'Hayya alas Salah', icon:'/icon-192.png' });
            }
          }
          if(diff > 0 && diff < 10*60*1000){
            setNext(`${p.name} in ${Math.round(diff/60000)}m`);
          }
        }
      }, 1000);
    })()
  },[enabled, unlocked])

  return (
    <div className="bg-white border rounded-[20px] p-4 space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-bold text-[#0A1931]">Adhan Madina 🕌 {enabled ? 'ON' : 'OFF'}</p>
          <p className="text-xs text-gray-500">{next || "Enable for auto adhan"}</p>
        </div>
        <button onClick={()=>{
          unlockAudio(); const v=!enabled; setEnabled(v); localStorage.setItem('haqq_adhan_enabled', v?'yes':'no'); setUnlocked(true);
        }} className={`px-4 py-2 rounded-full text-sm ${enabled ? 'bg-[#0A1931] text-white' : 'bg-gray-100'}`}>{enabled ? 'ON 🔊' : 'Enable'}</button>
      </div>
      <div className="flex gap-2">
        <button onClick={()=>playAdhan('regular',60)} className="text-xs border px-3 py-1.5 rounded-full">Test Regular</button>
        <button onClick={()=>playAdhan('fajr',60)} className="text-xs border px-3 py-1.5 rounded-full">Test Fajr 🌙</button>
        <button onClick={()=>stopAdhan()} className="text-xs bg-gray-100 px-3 py-1.5 rounded-full">Stop</button>
      </div>
    </div>
  )
            }
