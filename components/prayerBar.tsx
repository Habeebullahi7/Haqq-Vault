'use client'
import { useEffect, useState } from 'react'
import { getLocation, getPrayerTimes } from '@/lib/prayer'
import { scheduleSolatNotification, requestPermission } from '@/lib/notify'

export default function PrayerBar(){
  const [times, setTimes] = useState<any>(null)
  const [next, setNext] = useState("")

  useEffect(()=>{
    (async()=>{
      try{
        const {lat,lng} = await getLocation();
        const pt = getPrayerTimes(lat,lng);
        setTimes(pt);
        await requestPermission();
        
        const prayers = [
          { n:'Fajr', t:pt.fajr, fajr:true },
          { n:'Dhuhr', t:pt.dhuhr, fajr:false },
          { n:'Asr', t:pt.asr, fajr:false },
          { n:'Maghrib', t:pt.maghrib, fajr:false },
          { n:'Isha', t:pt.isha, fajr:false },
        ]
        const now = new Date();
        const upcoming = prayers.find(p=> p.t > now) || prayers[0];
        setNext(`${upcoming.n} ${upcoming.t.toLocaleTimeString()}`);
        
        // Schedule SW notification for next prayer
        if(upcoming.t > now){
          scheduleSolatNotification(upcoming.n, upcoming.t, upcoming.fajr);
        }
      }catch(e){ console.log(e) }
    })()
  },[])

  if(!times) return <div className="bg-white border rounded-[16px] p-3 text-xs">📍 Allow location for solat times</div>

  return (
    <div className="bg-[#0A1931] text-white rounded-[16px] p-4 flex justify-between items-center">
      <div>
        <p className="text-[11px] text-white/50 tracking-widest">NEXT SOLAT</p>
        <p className="font-bold">{next}</p>
        <p className="text-[11px] text-white/40 mt-1">Fajr {times.fajr.toLocaleTimeString()} | Asr {times.asr.toLocaleTimeString()} | Maghrib {times.maghrib.toLocaleTimeString()}</p>
      </div>
      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
    </div>
  )
}
