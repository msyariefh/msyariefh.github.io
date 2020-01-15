const url_base = 'https://api.football-data.org/v2';
function status(response) {
    if (response.status !== 200) {
      console.log("Aduh kena Error : " + response.status);
      return Promise.reject(new Error(response.statusText));
    } else {
      console.log("200 OK Lanjutkeun!!!")
      return Promise.resolve(response);
    }
  }
function json(response) {
    return response.json() ;
  }

  function getData(idParams, target){
    fetch(url_base + `/competitions/${idParams}/standings`,{
        headers: { 'X-Auth-Token': 'd05b43b0e31f4d6cb496ad1e6001263c' },
        type: 'GET'
      })
      .then(status)
      .then(json)
      .then(function(data){
        let logo;
          if (window.innerWidth <= 640){
            logo = "logo_klub_mini"
          }else{
            logo = "logo_klub"
          } 
        let klasemen =`
        <div class="row">
        <div class="col s12 px20">
        <ul class="tabs${target} tabs">
          <li class="tab col s3 offset-s1"><a class="active" href="#klasemen${target}">Klasemen</a></li>
          <li class="tab col s4"><a href="#skorer${target}">Top Skorer</a></li>
          <li class="tab col s3"><a href="#tanding${target}">Jadwal Tanding</a></li>
        </ul>
      </div>
        `
        klasemen +=`
        <div id=klasemen${target}>
        <h5 style="text-align:center;">Daftar Klasemen</br>
        <span style="font-weight:lighter; font-size:smaller;">${liga(data.competition.name)} (${negara(data.competition.area.name)})</span></h5>
        <h6 class="right"> Pekan ke-${data.season.currentMatchday} </h6>
        <table class="highlight striped">
            <thead>
                <tr>
                    <th>Nama Klub</th>
                    <th>M</th>
                    <th>M</th>
                    <th>S</th>
                    <th>K</th>
                    <th>P</th>
                    <th>SG</th>
                </tr>
            </thead>
        <tbody>
      `;
      data.standings[0].table.forEach(myFunction);
        function myFunction(value){
            klasemen+=`
        <tr>
          <td><a class="nama_klub" href="./info_tim.html?id=${value.team.id}">
          <div class="${logo}" style="background-image:url(${toHttps(value.team.crestUrl)});">
          </div>
          ${value.team.name}
          </a></td>
          <td>${value.playedGames}</td>
          <td>${value.won}</td>
          <td>${value.draw}</td>
          <td>${value.lost}</td>
          <td>${value.points}</td>
          <td>${value.goalDifference}</td>
        </tr>
            `;
        }
    klasemen += `
            </tbody>
        </table>
        </div>
        <div id=skorer${target}>
        <div class="wadah_prelod">
              <div class="preloader-wrapper small active">
                <div class="spinner-layer spinner-red-only">
                  <div class="circle-clipper left">
                    <div class="circle"></div>
                  </div><div class="gap-patch">
                    <div class="circle"></div>
                  </div><div class="circle-clipper right">
                    <div class="circle"></div>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <div id=tanding${target}>
        <div class="wadah_prelod">
              <div class="preloader-wrapper small active">
                <div class="spinner-layer spinner-red-only">
                  <div class="circle-clipper left">
                    <div class="circle"></div>
                  </div><div class="gap-patch">
                    <div class="circle"></div>
                  </div><div class="circle-clipper right">
                    <div class="circle"></div>
                  </div>
                </div>
              </div>
            </div>
        </div></div>
      `;
    document.getElementById(target).innerHTML = klasemen;
    var el= document.querySelector(`.tabs${target}`); var instance = M.Tabs.init(el, {});
    getSkorer(idParams, "skorer"+target)
    getCompetitionSch(idParams, "tanding"+target)

      }).catch(function(tolak){
        let tolakan = `
        <div class="section">
        <h4 class="center">Maaf Halaman Gagal di Tampilkan</h4>
        <h5 class="center">Untuk Memperbaiki silahkan Refresh Halaman ini</h5>
        <p class="grey-text center"> ${tolak}</p>
        </div>
        `
        document.getElementById(target).innerHTML = tolakan;
      })
}
function getSkorer(idParams, inner){
    fetch(url_base + `/competitions/${idParams}/scorers`,{
        headers: { 'X-Auth-Token': 'd05b43b0e31f4d6cb496ad1e6001263c' },
        type: 'GET'
      })
      .then(status)
      .then(json)
      .then(function(top){
        let skor = `
        <h5 style="text-align:center;">Top Skor</br>
        <span style="font-size:smaller;">${liga(top.competition.name)} (${negara(top.competition.area.name)})
        </span></br>
        <span style="font-weight:lighter; font-size:smaller;">Pekan ke-${top.season.currentMatchday}</span>
        </h5>
          <div class="container section">
          <div class="row">
          `;
          top.scorers.forEach(function(skorer){
            skor+=`
            <div class="row s12 card">
            <div class="col s10 skor white-text warna"><span style="font-weight:bolder;">${skorer.player.name}</span>(${skorer.team.name})</div>
            <div class="col s2 skor grey-text" style="font-weight:bold;">${skorer.numberOfGoals} Gol</div>
            </div>
            `
          });
          skor +=`
          </div></div>
          `;
          document.getElementById(inner).innerHTML = skor;
      }).catch(function(tolak){
        let tolakan = `
        <div class="section">
        <h4 class="center">Maaf Halaman Gagal di Tampilkan</h4>
        <h5 class="center">Untuk Memperbaiki silahkan Refresh Halaman ini</h5>
        <p class="grey-text center"> ${tolak}</p>
        </div>
        `
        document.getElementById(inner).innerHTML = tolakan;
      })
      
}
function getCompetitionSch(id, target){
  fetch(url_base +"/competitions/"+id+"/matches?status=SCHEDULED",{
    headers: { 'X-Auth-Token': 'd05b43b0e31f4d6cb496ad1e6001263c' },
    type : "GET"
  }).then(status).then(json).then(function(competitionsch){
    let text;
    let vs;
          if (window.innerWidth <= 640){
            text = "p"
            vs = "h6"
          }else{
            text = "h5"
            vs = "h4"
          } 
    let tambah =""
    for(i = 0;i<10; i++){
      let data = competitionsch.matches[i];
      let waktu = utcToWIB(data.utcDate);
      tambah +=`
      <div class="col s12 card" style="padding:0;">
    
    <div class="col s12 wadah-sch" style="min-height:45px;">
    <div class="col s5">
      <${text} class="center">${data.homeTeam.name}</${text}>
    </div>
    <${vs} class="col s2 center" style="margin-top:0;margin-bottom:0;">VS</${vs}>
    <div class="col s5">
      <${text} class="center">${data.awayTeam.name}</${text}>
    </div>
    </div>
    <div class="col s12 center teal lighten-1 white-text" style="margin-top: 0.5em;">${waktu.day}, ${waktu.date} ${waktu.month} ${waktu.year} </br> ${waktu.hour}:${waktu.minute} WIB</div>
    
  </div>
      `
    }
    let data = `
    <h5 class="center">Jadwal ${liga(competitionsch.competition.name)} (${negara(competitionsch.competition.area.name)})</h5>
    <div class="row section">
    <div class="container">
    ${tambah}
    </div>
    </div>
    `
    document.getElementById(target).innerHTML = data;
  }).catch(function(tolak){
    let tolakan = `
    <div class="section">
    <h4 class="center">Maaf Halaman Gagal di Tampilkan</h4>
    <h5 class="center">Untuk Memperbaiki silahkan Refresh Halaman ini</h5>
    <p class="grey-text center"> ${tolak}</p>
    </div>
    `
    console.log(tolak)
    document.getElementById(target).innerHTML = tolakan;
  })
}
function getTimById(){
  let urlParams = new URLSearchParams(window.location.search);
  let idParams = urlParams.get("id");
  fetch(url_base+ "/teams/" + idParams, {
    headers: { 'X-Auth-Token': 'd05b43b0e31f4d6cb496ad1e6001263c' },
    type: 'GET'})
    .then(status)
    .then(json)
    .then(function(data_tim){
      let img_team = `
      <a href="${data_tim.website}" title="Go to ${data_tim.name}'s Official Website">
      <img src="${toHttps(data_tim.crestUrl)}" style="height:100px;"/>
      </a>
      `
      document.getElementById("img_team").innerHTML = img_team;
      let nama_team =`
      <h3>${data_tim.name} </h3>
      <h6>( ${negara(data_tim.area.name)} )</h6>
      <h5>Markas : ${data_tim.venue}</h5>
      `
      document.getElementById("nama_team").innerHTML = nama_team;
      let tombol = `
      <a class="waves-effect waves-light btn red" onclick="favTeam(${idParams})" id="adddelfav">Tambahkan ke Tim Favorit</a>
      `;
      document.getElementById("adddel").innerHTML = tombol;
      let timHTML = 
      `

      <h4 class="center">Info Tim</h4>
      <h5 style="text-align:right;">Pelatih : ${getPelatih()} </h5>
      <table class="highlight striped centered responsive-table">
      <thead class="teal white-text">
          <tr>
          <th>Nama</th>
          <th>Asal</th>
          <th>Umur</th>
          <th>Posisi</th>
          <th>Nomor</th>
          </tr>
        </thead>
        <tbody>
    ${getDataTim()}
    </tbody>
    </table>
      `;
    function getPelatih(){
      let keluaran =""
        data_tim.squad.forEach(get)
        function get(dat){
            if(dat.role === "COACH"){
                keluaran = dat.name
            }
        }
        return keluaran
    }
    function getDataTim(){
      let data_tambahan = ""
      data_tim.squad.forEach(Fungsi);
      function Fungsi(isi){
        let nomor; 
        let posisi;
        dulu = new Date(isi.dateOfBirth)
        sekarang = new Date
        let umur = sekarang.getFullYear() - dulu.getFullYear()
        if(isi.role === "PLAYER"){
          if(isi.shirtNumber == null){
            nomor = "-"
          }else{
            nomor = isi.shirtNumber
          };
          if (isi.position === "Goalkeeper"){
            posisi = "Kiper"
          }else if(isi.position == "Defender"){
            posisi = "Pemain Belakang"
          }else if(isi.position == "Midfielder"){
            posisi = "Pemain Tengah"
          }else if(isi.position == "Attacker"){
            posisi = "Penyerang"
          }else{
            posisi = isi.position
          }
          data_tambahan +=
          `
          <tr>
          <td>${isi.name}</td>
          <td>${isi.countryOfBirth}</td>
          <td>${umur} tahun</td>
          <td>${posisi}</td>
          <td>${nomor}</td>
          </tr>
          `
        }
        
      }
      return data_tambahan

    }
      document.getElementById("infoteam").innerHTML = timHTML
      getSchedule(idParams, data_tim.name);
      cekDb(idParams);
    }).catch(function(tolak){
      let tolakan = `
      <div class="section">
      <h4 class="center">Maaf Halaman Gagal di Tampilkan</h4>
      <h5 class="center">Untuk Memperbaiki silahkan Refresh Halaman ini</h5>
      <p class="grey-text center"> ${tolak}</p>
      </div>
      `
      document.getElementById("infoteam").innerHTML = tolakan;
      getSchedule(idParams, null);
    })
}
function getSchedule(idParams, nama){
  fetch(url_base + `/teams/${idParams}/matches?status=SCHEDULED`,{
    headers: { 'X-Auth-Token': 'd05b43b0e31f4d6cb496ad1e6001263c' },
    type: 'GET'
  })
  .then(status)
  .then(json)
  .then(function(jadwal){
    let dataku = `
    <div class="container">
    <div class="row">
    `
    for(n=0; n<7; n++){
    let text;
    let vs;
          if (window.innerWidth <= 640){
            text = "p"
            vs = "h6"
          }else{
            text = "h5"
            vs = "h4"
          } 
      let data = jadwal.matches[n];
      let waktu = utcToWIB(data.utcDate);
      let babak;
      if (data.group == null){
        let n =data.stage
        if(n.search(/[0-9]/) != -1){
          babak = n.replace(/ROUND_OF_/,"") + " Besar"
        }else{
          babak = n
        }
      }
      else{babak = data.group}
      dataku +=`
      <div class="col s12 card" style="padding:0;">
      <div class="col s12"  style="padding:inherit;">
        <h5 class="col s12 teal white-text center" style="margin-top:0;">${liga(data.competition.name)}</br><span style="font-weight:lighter;font-size:smaller;">${babak}</span></h5>
        <div class="col s12 wadah-sch" style="min-height:50px;">
        <div class="col s5">
          <${text} style="text-align: right;margin-top:0;padding-right:0;">${data.homeTeam.name}</${text}>
        </div>
        <div class="col s2 vs">VS</div>
        <div class="col s5">
          <${text} style="text-align: left; margin-top:0;padding-left:0;">${data.awayTeam.name}</${text}>
        </div>
       </div>
      </div>
      <div class="col s12 center teal lighten-1 white-text" style="margin-top: 0.5em;">${waktu.day}, ${waktu.date} ${waktu.month} ${waktu.year} </br> ${waktu.hour}:${waktu.minute} WIB</div>
      </div>
      `
    }
    dataku+="</div></div>"
    document.getElementById("jadwal").innerHTML = dataku;
  }).catch(function(tolak){
    let tolakan = `
    <div class="section">
    <h4 class="center">Maaf Halaman Gagal di Tampilkan</h4>
    <h5 class="center">Untuk Memperbaiki silahkan Refresh Halaman ini</h5>
    <p class="grey-text center"> ${tolak}</p>
    </div>
    `
    document.getElementById("jadwal").innerHTML = tolakan;
  })
}
function tampilkanFavTeam(){
    let inner = `
    <div class="row">
    `;
    let dbPromise = idb.open("PWA-Db", 1, function(upgradeDb) {
      //buat db jika belum ada sekalian indexnya
        if (!upgradeDb.objectStoreNames.contains("[team_favorit]")) {
         let dataDb = upgradeDb.createObjectStore("[team_favorit]", { autoIncrement: true});
         dataDb.createIndex(`id`, `id`, {unique : true})
        }
      });
      dbPromise.then(function(db){
          let transaksi = db.transaction("[team_favorit]", "readonly");
          let store = transaksi.objectStore("[team_favorit]");
          store.getAll().then(function(fav){
            if(fav.length == 0){
              inner += `<h6 class="center grey-text">Anda Belum Memiliki Favorit Tim</h6></div>`
              document.getElementById("favtim").innerHTML = inner;
            }else{
              fav.forEach(getFavTeam);
              function getFavTeam(foo){
                fetch(url_base +"/teams/"+foo.id,{
                  headers: { 'X-Auth-Token': 'd05b43b0e31f4d6cb496ad1e6001263c' },
                  type : "GET"
                }).then(status).then(json).then(function(timdata){
                  inner += `
                  <div class="col s12 m12">
                  <div class="row" style="border:1px solid teal;">
                  <div class="col s12 m4 kotak teal white-text" style="padding-top:20px;">
                  <img src="${toHttps(timdata.crestUrl)}" style="height:100px;"/>
                  <h5 class="center">${timdata.name}</h5>
                  <h6 class="center"><span style="font-weight:bolder;">Pelatih</span></br>${getPelatih()}
                  </h6>
                  <p class="text-grey center">
                  <span style="font-weight:bolder;">Kompetisi Berjalan</span></br>
                  ${getKompetisi()}
                  </p>
                  <a onclick="hapusFav(${foo.id})" class="waves-effect waves-light btn red" id="btn-batal" style="margin-bottom:20px;">Batal Favorit</a>
                  </div>
                  <div class="col s12 m8" id="jadwal${foo.id}">
                  </div>
                  </div>
                  
                </div>
                  `
                  function getPelatih(){
                    let keluaran =""
                    timdata.squad.forEach(get)
                    function get(dat){
                        if(dat.role === "COACH"){
                            keluaran = dat.name
                        }
                    }
                    return keluaran
                }
                  function getKompetisi(){
                  let keluaran=""
                  timdata.activeCompetitions.forEach(get)
                  function get(dat){
                      keluaran +=
                      `
                      ${liga(dat.name)}</br>
                      `
                  }
                  return keluaran
                }
                
                document.getElementById("favtim").innerHTML = inner;
                jadwalTanding(foo.id, timdata.name)
                })
              }
            }
          })
    return transaksi.complete; 
                  }
          )
  }
  function jadwalTanding(num, tim){
    
    fetch(url_base + "/teams/" + num +"/matches?status=SCHEDULED", {
      headers: { 'X-Auth-Token': 'd05b43b0e31f4d6cb496ad1e6001263c' },
      type: 'GET'
    }).then(status).then(json)
      .then(function(jadwal_tanding){
        
        let isianHTML = `
    <h5 class="teal-text center" style="font-weight:bold;">Jadwal Tanding</h5>
    `
        for(i=0; i<3; i++){
          let dataku = jadwal_tanding.matches[i];
          let babak;
        if (dataku.group == null){
          let n =dataku.stage
          if(n.search(/[0-9]/) != -1){
            babak = n.replace(/ROUND_OF_/,"") + " Besar"
          }else{
            babak = n
          }
        }
        else{babak = dataku.group}
          let waktu = utcToWIB(dataku.utcDate)
          let lawan = ""
          if (dataku.awayTeam.name === tim){
            lawan = dataku.homeTeam.name
          }else{
            lawan = dataku.awayTeam.name
          }
          isianHTML +=
          `
        <hr class="teal">
        <div class="col s3 m3 teal">
        <h6 class="center white-text" style="margin:0; padding:0.1rem;">
        ${waktu.day}</br>
        <span style="font-size:smaller; font-weight:lighter;">${waktu.date} ${waktu.month}<br/>${waktu.hour}:${waktu.minute} WIB</span></h6>
        </div>
        <div class="col s2 m2">
        <h5 class="center">VS<h5>
        </div>
        <div class="col s7 m7">
        <h5>${lawan}</h5>
          </div>
          <p style="text-align:right;">${liga(dataku.competition.name)} | ${babak}</p>
          `
        }
        document.getElementById(`jadwal${num}`).innerHTML = isianHTML
    })
    
  }
  