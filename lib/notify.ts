export async function requestPermission(){
  if(!('Notification' in window)) return false;
  const perm = await Notification.requestPermission();
  return perm === 'granted';
}

export function scheduleSolatNotification(name: string, time: Date, isFajr = false){
  if(!navigator.serviceWorker.controller) return;
  navigator.serviceWorker.controller.postMessage({
    type: 'SCHEDULE_SOLAT',
    title: `Adhan - ${name} 🕌`,
    body: isFajr ? 'As-salatu khayrun min an-nawm - Time for Fajr' : `Hayya alas Salah - Time for ${name}`,
    nextPrayerTime: time.getTime()
  });
}

export async function localVaultReminder(count: number){
  if(Notification.permission !== 'granted') return;
  new Notification('HAQQ Vault', {
    body: `You have ${count} uncleared rights. Don't sleep with people's haqq on you.`,
    icon: '/icon-192.png'
  });
}
