self.addEventListener('push', function(event){
  const data = event.data ? event.data.json() : { title: 'HAQQ', body: 'Time for Solat' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [200, 100, 200],
      data: { url: '/vault' }
    })
  );
});

self.addEventListener('notificationclick', function(event){
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url || '/vault'));
});

self.addEventListener('message', (event)=>{
  if(event.data && event.data.type === 'SCHEDULE_SOLAT'){
    const delay = event.data.nextPrayerTime - Date.now();
    if(delay > 0){
      setTimeout(()=>{
        self.registration.showNotification(event.data.title || 'HAQQ - Solat', {
          body: event.data.body,
          icon: '/icon-192.png',
          tag: 'solat',
          vibrate: [200, 100, 200],
          data: { url: '/vault' }
        });
      }, delay);
    }
  }
});
