importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');
workbox.loadModule('workbox-strategies');

workbox.precaching.precacheAndRoute([
  { url: '/index.html', revision: '1.1' },
  { url: '/404.html', revision: '1.1' },
  { url: '/info_tim.html', revision: '1.1' },
  { url: '/favorit.html', revision: '1.1' },
  { url: '/favicon.ico', revision: '1' },
  { url: '/service-worker.js', revision: '1.1' },
  { url: '/asset/manifest.json', revision: '1' },
  { url: '/asset/css/materialize.min.css', revision: '1' },
  { url: '/asset/css/own.css', revision: '1.1' },
  { url: '/asset/js/idb.js', revision: '1' },
  { url: '/asset/js/main.js', revision: '1.1' },
  { url: '/asset/js/materialize.min.js', revision: '1' },
  { url: '/asset/img/bundesliga.svg', revision: '1' },
  { url: '/asset/img/epl_logo.svg', revision: '1' },
  { url: '/asset/img/laliga.svg', revision: '1' },
  { url: '/asset/img/seriea.svg', revision: '1' },
  { url: '/asset/img/logo.png', revision: '1' },
  { url: '/asset/img/logo-192.png', revision: '1' },
]);

workbox.routing.registerRoute(
  /^https:\/\/api\.football-data\.org\/v2\/competitions\//,
  //Karena batas request per menit ke football-data.org hanya 10req/menit (tapi kenyataannya bisa sampai 12 si) gunakan ini agar tidak sering blank page
  //karena di index ada 12 request ke API, jadi pakai ini agar page lain bisa diakses
  workbox.strategies.cacheFirst({
    cacheName: 'fetchAPIIndex',
    plugins: [
      new workbox.expiration.Plugin({
        //set timer 1 hari supaya tetap update
        maxAgeSeconds: 1 * 24 * 60 * 60, 
      }),
    ],
  })
);
workbox.routing.registerRoute(
  /^https:\/\/api\.football-data\.org\/v2\/teams\//,
  //karena digunakan juga untuk halaman favorit dan ada jadwal harian (kemungkinan besar) gunakan ini aja enak kayaknya
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'fetchAPITeam',
    plugins: [
      new workbox.expiration.Plugin({
        //timnya banyak batasin lah
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60, 
      }),
    ],
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



