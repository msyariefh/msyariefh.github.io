function negara(params){
  if (params == "England"){
    return "Inggris"
  }else if (params == "Germany"){
    return "Jerman"
  }else if (params == "Italy"){
    return "Italia"
  }else if (params == "Spain"){
    return "Spanyol"
  }else{return params}
}
function liga(params){
  if (params == "Premier League"){
    return "Liga Primer"
  }else if (params == "Primera Division"){
    return "LA Liga"
  }else{return params}
}
function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
function toHttps(uri){
  let n = uri.replace(/http:/,"https:");
  return n;
}
function utcToWIB(utc){
  let _hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  let _bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]; 
  let date = new Date(utc);
  let sekarang = new Date()
      let jam = addZero(date.getHours());
      let menit = addZero(date.getMinutes());
      let tanggal = date.getDate();
      let hari;
      let bulan = _bulan[date.getMonth()]
      let tahun = date.getFullYear();
      if(tahun == sekarang.getFullYear() && bulan == sekarang.getMonth() && tanggal == sekarang.getDate()){
        hari = "Hari ini"
      }else if(tahun == sekarang.getFullYear() && bulan == sekarang.getMonth() && tanggal == (sekarang.getDate() + 1)){
        hari = `Besok`
      }else{
        hari = _hari[date.getDay()]
      }
    return ({day : hari, date : tanggal, month : bulan, year : tahun, hour : jam, minute : menit})
}

//Service worker
function requestPermission() { 
 if (('PushManager' in window)) {
  navigator.serviceWorker.getRegistration().then(function(registration) {
      registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: "BGf73YEkfqfM0WWP2xMOjlfw5RwLM-LaEBTLVW1KtWxpR2UabnmFWZ5HGCHkY7kgrBy5PRk8_VwnJnuk9lE01Tc"
      }).then(function(subscribe) {
          console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
          console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
              null, new Uint8Array(subscribe.getKey('p256dh')))));
          console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
              null, new Uint8Array(subscribe.getKey('auth')))));
      }).catch(function(e) {
          console.error('Tidak dapat melakukan subscribe ', e.message);
      });
  });
}
      function urlBase64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding)
          .replace(/-/g, '+')
          .replace(/_/g, '/');
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
  }}

//cek Db
function cekDb(value){
  //buat db jika belum ada sekalian indexnya
    let dbPromise = idb.open("PWA-Db", 1, function(upgradeDb) {
      //buat db jika belum ada sekalian indexnya
        if (!upgradeDb.objectStoreNames.contains("[team_favorit]")) {
         let dataDb = upgradeDb.createObjectStore("[team_favorit]", { autoIncrement: true});
         dataDb.createIndex(`id`, `id`, {unique : true})
        }
      });
    dbPromise.then(function(db){
      //buka transaksi
        let transaksi = db.transaction("[team_favorit]", "readonly");
        //lakukan transaksi put dengan db
        let store = transaksi.objectStore("[team_favorit]");
        //pilih transaksi seperti apa
        store.getAll()
        .then(
            function(h){
                if(h.length > 0){
                    h.forEach(get)
                function get(k){
                    if(k.id == value){
                        document.getElementById("adddelfav").classList.add("del");
                        document.getElementById("adddelfav").innerHTML = "Hapus dari Tim Favorit"
                    }
                    //jgn lupa tutup transaksi, yakali pergi tanpa bayar
                    return transaksi.complete; 
                }
                }
            }
        )
    })
}

//tambah dan hapus tim favorit

function favTeam(id){
  let perintah;
  if(document.getElementById("adddelfav").classList.contains("del")){
    perintah = "del"
  }else{
    perintah = "add"
  }
  dBteamFav(id, perintah);
  if(perintah === "add"){
    M.toast({html: 'Tim ditambahkan ke Favorit'})
  }else if(perintah === "del"){
    M.toast({html: 'Tim dihapus dari Favorit'})
  };
};
function dBteamFav(value, asign){
    let dbPromise = idb.open("PWA-Db", 1, function(upgradeDb) {
      //buat db jika belum ada sekalian indexnya
        if (!upgradeDb.objectStoreNames.contains("[team_favorit]")) {
         let dataDb = upgradeDb.createObjectStore("[team_favorit]", { autoIncrement: true});
         dataDb.createIndex(`id`, `id`, {unique : true})
        }
      });
    //panggil dBPromise as promise dengan then
    dbPromise.then(function(db){
      //buka db transaction dengan status readwrite karna data bakal berubah
        let transaksi = db.transaction("[team_favorit]", "readwrite");
        //lakukan transaksi put dengan db
        let store = transaksi.objectStore("[team_favorit]");
        //karena idb bersifat promise, kita bisa nambah aksi lain di then
        if(asign === "add"){
          store.put({"id" : value}, value).then(function(){
              document.getElementById("adddelfav").classList.add("del");
              document.getElementById("adddelfav").innerHTML = "Hapus dari Tim Favorit";
          })
        }else if(asign === "del"){
          store.delete(value).then(function(){
              document.getElementById("adddelfav").classList.remove("del");
              document.getElementById("adddelfav").innerHTML = "Tambahkan ke Tim Favorit";
          })
        };
                    //tutup transaksi biar aman
                return transaksi.complete; 
                }
        )
    }
    //buat favorit.html

function hapusFav(val){
  let dbi = idb.open("PWA-Db", 1);
  dbi.then(function(db){
    let transaksi = db.transaction("[team_favorit]", "readwrite");
    let store = transaksi.objectStore("[team_favorit]");
      store.delete(val)
      .then(function(){
          M.toast({html: 'Tim dihapus dari Favorit'});
          tampilkanFavTeam();
      })
      return transaksi.complete
  })
}
