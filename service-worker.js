importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');
if(workbox){
  console.log("berhasil");
}else{
  console.log("gagal")
}
workbox.loadModule('workbox-strategies');
workbox.precaching.precacheAndRoute([
  { url: '/index.html', revision: '2.4' },
  { url: '/404.html', revision: '2.35' },
  { url: '/info_tim.html', revision: '2.35' },
  { url: '/favorit.html', revision: '2.35' },
  { url: '/favicon.ico', revision: '2.35' },
  { url: '/service-worker.js', revision: '2.4' },
  { url: '/asset/manifest.json', revision: '2.35' },
  { url: '/asset/css/materialize.min.css', revision: '2.35' },
  { url: '/asset/css/own.css', revision: '2.35' },
  { url: '/asset/js/idb.js', revision: '2.35' },
  { url: '/asset/js/main.js', revision: '2.4' },
  { url: '/asset/js/getdata.js', revision: '2.35' },
  { url: '/asset/js/materialize.min.js', revision: '2.35' },
  { url: '/asset/img/epl_logo.svg', revision: '2.35' },
  { url: '/asset/img/laliga.svg', revision: '2.35' },
  { url: '/asset/img/seriea.svg', revision: '2.35' },
  { url: '/asset/img/logo.png', revision: '2.35' },
  { url: '/asset/img/logo-192.png', revision: '2.35' },
], { ignoreURLParametersMatching: [/.*/],}
);

workbox.routing.registerRoute(
  /^https:\/\/api\.football-data\.org\/v2\//,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'fetchAPI'
  })
);

self.addEventListener('push', function(event) {
  let body;

  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Ada Kesalahan';
  }

  let options = {
    body: body,
    icon: '/asset/img/logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {action: 'explore', title: 'Lihat'},
      {action: 'close', title: 'Biarkan'}
    ]
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});

self.addEventListener('notificationclick', event => {
  const notification = event.notification;
  const action = event.action;

  if (action === 'close') {
    notification.close();
  } else {
    clients.openWindow('/favorit.html');
    notification.close();
  }

});



