var tasks_raw_data

function load_server_json(){
    send = { params: {worker:"default"}}
    window.api.httpRequest("requestTasksProperties",send)
      window.api.receive("fromMainRequestTaskProperties", (data) => {
        if (data == "errorFlag")
        {
          console.log("errorFla")
          return
        }
        tasks_raw_data=data
        console.log(tasks_raw_data)
        refreshTable(tasks_raw_data)
      });
  }


//texts
const old_name_server = document.getElementById('s_old_name')
const s_name = document.getElementById('s_name')
const s_address = document.getElementById('s_ip')
const s_color = document.getElementById('s_color')
const s_period = document.getElementById('s_period')
const s_lat = document.getElementById('s_latitude')
const s_long = document.getElementById('s_longitude')
const s_work = document.getElementById('s_worker')
//form
const form_for_server_upadddel = document.getElementById('sform')
//buttons for server operations
const loadnewserv = document.getElementById('loadnewserv')
const update = document.getElementById('upsave')
const pause = document.getElementById('pause')


function loadSpecs(name){
  var i = 0
  while (tasks_raw_data[i]){
    if (tasks_raw_data[i].name == name){
      showMenu()
        s_name.value = tasks_raw_data[i].name
        s_address.value = tasks_raw_data[i].address
        s_color.value = tasks_raw_data[i].color
        s_period.value = tasks_raw_data[i].frequency
        s_lat.value = tasks_raw_data[i].latitude
        s_long.value = tasks_raw_data[i].longitude
        s_work.value = tasks_raw_data[i].worker
        return true
    }
  i++;
  }
}
loadnewserv.addEventListener('click', async () => { //load server from list
    if (!loadSpecs(old_name_server.value)){
        txt = "Server: \"" + old_name_server.value +"\" not found"
        alert(txt)
    }
    else{
      old_name_server.value = ""
    }
  })

function correctData(count){//validity check
  i = 0
  validity = true
  while (i<=count){//kontrola nutno pro průchod skrze všechna pole co mají být kontrolována
    if (!form_for_server_upadddel[i].checkValidity()) {
      form_for_server_upadddel[i].reportValidity()
      validity = false
    }
    i++;
  }
  return validity
}

update.addEventListener('click', async () => {  //update/save 

  if (correctData(6)){

    l_na = []
    l_ad = []
    canc = false
    will_update_byName = false
    will_update_byAddress = false
    tt = tasks_raw_data

    tt.forEach(element => {
      l_na.push(element.name)
      l_ad.push(element.address)
    });
    nn = s_name.value, addr = s_address.value
    if (l_na.indexOf(nn)==l_ad.indexOf(addr)&&l_na.indexOf(nn)!=-1){//jm je addr je
      txt = "Update 1 " + nn
      will_update_byName = true
    }
    else if (l_na.indexOf(nn) == l_ad.indexOf(addr) && l_na.indexOf(nn) == -1){//jm a addr nejsou
      txt = "Add "+nn
    }
    else if (l_na.indexOf(nn) != -1 && l_ad.indexOf(addr) == -1){//jm je addr neni
      txt = "Update 2 "+nn
      will_update_byName = true
    }
    else if (l_na.indexOf(nn) == -1 && l_ad.indexOf(addr) != -1){//jm neni addr je
      txt = "Update 3 "+nn
      will_update_byAddress = true
    }
    else if (l_na.indexOf(nn) == -1 && l_ad.indexOf(addr) == -1){
      txt = "Already used address "+addr+" and name "+nn
      canc = true
    }


    if (confirm(txt) == true && canc == false) {
      send={params: {"name":s_name.value,"address":s_address.value,"color":s_color.value,"time":s_period.value,"latitude":parseFloat(s_lat.value), "longitude":parseFloat(s_long.value),"worker":s_work.value, "task":"ping", "hide":false}}
      if(will_update_byName){
        send.params.oldAddress = tasks_raw_data[l_na.indexOf(nn)].address
        send.params.runing = tasks_raw_data[l_na.indexOf(nn)].runing
        window.api.httpRequest("requestUpdateTask",send)   
      }
      else if(will_update_byAddress){
        send.params.oldAddress = tasks_raw_data[l_ad.indexOf(addr)].address
        send.params.runing = tasks_raw_data[l_ad.indexOf(addr)].runing
        window.api.httpRequest("requestUpdateTask",send)
      }
      else
      {
        send.params.runing = true
        window.api.httpRequest("requestAddTask",send)
      }
      clear();
      load_server_json();
      hideSettMenu();
    } 
    else {
      console.log("You canceled!");
    }
  }
  loadAllDataNew(); //v graphs.js obnoví změny aby byli při překliknutí ihned viditelné
  updateMapPoints(); //v maps.js obnoví body v mapě
})
function dellAdress(Dname){

  l_na = []
  l_ad = []
  canc = false

  tasks_raw_data.forEach(element => {
    l_na.push(element.name)
    l_ad.push(element.address)
  });

  var i = 0
  var found = false
    tasks_raw_data.forEach(element => {
      if(element.name == Dname){
        txt = "delete: " + Dname
        found = true
        if (confirm(txt) == true) {
          send = l_ad[l_na.indexOf(Dname)]
          window.api.httpRequest("requestDelTask",{params:{'address':send}})
          clear()
          load_server_json()
        } else {
          console.log("You canceled!");
        }
      }
      i++
    });
    txt = Dname + " not found!"
    if(found == false){
      alert(txt)
    }
    loadAllDataNew();//v graphs.js obnoví změny aby byli při překliknutí ihned viditelné
    updateMapPoints(); //v maps.js obnoví body v mapě
}

function clear(){
  s_name.value = ""
  s_address.value = ""
  s_color.value = "#000000"
  s_period.value = ""
  s_long.value = ""
  s_lat.value = ""
}

function pausStart(name){
  found = false
    tasks_raw_data.forEach(element => {
      if(element.name == name){
        found = true
        element.runing == true ? txt = "Pause: " + name: txt = "Start: " + name
        if (confirm(txt) == true) {
          poss = tasks_raw_data.indexOf(element)
          
          send={params: {'address':element.address, 'runing':tasks_raw_data[poss].runing == false ? true : false}}
          window.api.httpRequest("requestPauseStartTask",send)
          clear()
          load_server_json()
        } else {
          console.log("You canceled!");
        }
      }
    });
    if (!found){
      alert("Not found")
    }
    loadAllDataNew();//v graphs.js obnoví změny aby byli při překliknutí ihned viditelné
}

function hideTask(name){
  found = false
    tasks_raw_data.forEach(element => {
      if(element.name == name){
        found = true
        element.runing == true ? txt = "Show in graphs: " + name: txt = "Hide in graphs: " + name
        if (confirm(txt) == true) {
          poss = tasks_raw_data.indexOf(element)
          
          send={params: {'address':element.address, 'hide':tasks_raw_data[poss].hide == false ? true : false}}
          window.api.httpRequest("requestHideTask",send)
          clear()
          load_server_json()
        } else {
          console.log("You canceled!");
        }
      }
    });
    if (!found){
      alert("Not found")
    }
    loadAllDataNew(); //v graphs.js obnoví změny aby byli při překliknutí ihned viditelné
    updateMapPoints(); //v maps.js obnoví body v mapě
}


const paus = document.getElementById('runing')
paus.addEventListener('click', async () => {
  if (correctData(1)){
    pausStart(s_name.value)
  }
})


window.api.receive_cmd("fromMainhowHideSwitch", () => {
  console.log(tasks_raw_data)
  window.api.send("toMainJsonSave",tasks_raw_data)
});


document.querySelectorAll('.tabH').forEach(item => {
  item.addEventListener('click', event => {
    if (item.id[4]!="x"){
      sortTable(item.id[4])
    }
  })
})


document.querySelectorAll('.dropdown').forEach(item => {
  item.addEventListener('click', event => {
    contextMenu.classList.remove("show-context-menu");
    //console.log(item, position)
    if(item.id == "PauseStart"){
      console.log(item.id,tasks_raw_data[position].name)
      pausStart(tasks_raw_data[position].name)
    }
    if(item.id == "Delete"){
      console.log(item.id,tasks_raw_data[position].name)
      dellAdress(tasks_raw_data[position].name)
    }
    if(item.id == "Hide"){
      console.log(item.id,tasks_raw_data[position].name)//TODO force to dont show data in graph but dont stop task
      hideTask(tasks_raw_data[position].name)
    }
  })
})


var contextMenu = document.getElementById("context-menu");

// Hide context menu on click outside
document.addEventListener("click", function(event) {
contextMenu.classList.remove("show-context-menu");
});

document.addEventListener('scroll', function(event) {
  contextMenu.classList.remove("show-context-menu");
});


// sort table by ithem
tableA = document.getElementById("myTable");
var prevClickedHeader = null;
function sortTable(n) {
  var rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  switching = true;
  dir = "asc";
  while (switching) {
    switching = false;
    rows = tableA.rows;
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount ++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
  
  if (prevClickedHeader) {
    prevClickedHeader.innerHTML = prevClickedHeader.innerHTML.replace(/[↑↓]/g, "");
  }
  var arrow = dir === "asc" ? "&uarr;" : "&darr;";
  tableA.rows[0].getElementsByTagName("TH")[n].innerHTML += arrow;
  prevClickedHeader = tableA.rows[0].getElementsByTagName("TH")[n];
}




// Generate table rows and cells

var position = 0

function appendTableData(data){
  data.forEach(function callback(rowData, index){

      var row = document.createElement("tr");
      row.setAttribute("id", "row" + index);
      row.classList.add("tabRow");

      row.addEventListener('contextmenu', event => {
        position = parseInt(row.id.replace(/\D/g, ''));
          // Show context menu on right click
          event.preventDefault();
          contextMenu.classList.add("show-context-menu");
          contextMenu.style.left = event.pageX + "px";
          contextMenu.style.top = event.pageY + "px";
      })




      var updateCell = document.createElement("td");
      const buttonU = document.createElement("button");
      var img = document.createElement("img");
      img.src = "pics/Update.png";
      img.height = 20;
      buttonU.appendChild(img);
      buttonU.addEventListener("click", function() {
        const pozice = parseInt(row.id.replace(/\D/g, ''));
        loadSpecs(tasks_raw_data[pozice].name)
      });
      updateCell.appendChild(buttonU);
      row.appendChild(updateCell)

      var idCell = document.createElement("td");
      n = (index+1 >= 10 ? '0' : '00') + (index+1)
      

      generate(row ,idCell, n, index)

      var nameCell = document.createElement("td");
      generate(row ,nameCell, rowData["name"], index)

      var addressCell = document.createElement("td");
      generate(row ,addressCell, rowData["address"], index)

      var colorCell = document.createElement("td");
      colorCell.style.backgroundColor = rowData["color"];
      colorCell.setAttribute("id", "row" + index);
      row.appendChild(colorCell);

      var periodCell = document.createElement("td");
      generate(row, periodCell, rowData["frequency"], index)

      var periodCell = document.createElement("td");
      periodCell.innerHTML = "Lat: " + rowData["latitude"]+"<br>Lon: " + rowData["longitude"];
      periodCell.setAttribute("id", "row" + index);
      row.appendChild(periodCell);

      var periodCell = document.createElement("td");
      generate(row, periodCell, rowData["worker"], index)

      var pauseCell = document.createElement("td");
      const buttonP = document.createElement("button");
      var img = document.createElement("img");
      img.src = rowData["runing"]==true?"pics/Pause.png":"pics/Start.png";
      img.height = 20;
      buttonP.appendChild(img);
      buttonP.addEventListener("click", function() {
        pausStart(tasks_raw_data[index].name)
      });
      pauseCell.appendChild(buttonP);
      row.appendChild(pauseCell)
      //pauseCell.style.backgroundColor = rowData["runing"]==false?"red":"green";


      var hideCell = document.createElement("td");
      const buttonH = document.createElement("button");
      var img = document.createElement("img");
      img.src = rowData["hide"]==false?"pics/Show.png":"pics/Hide.png";
      img.height = 20;
      buttonH.appendChild(img);
      buttonH.addEventListener("click", function() {
        hideTask(tasks_raw_data[index].name)
      });
      hideCell.appendChild(buttonH);
      row.appendChild(hideCell)
      //hideCell.style.backgroundColor = rowData["hide"]==true?"gray":"white";


      var dellCell = document.createElement("td");
      const buttonD = document.createElement("button");
      var img = document.createElement("img");
      img.src = "pics/Trash.png";  // Zde nastavte cestu k vaší ikoně
      img.height = 20;
      buttonD.appendChild(img);
      buttonD.addEventListener("click", function() {
        dellAdress(tasks_raw_data[index].name)
      });
      dellCell.appendChild(buttonD);
      row.appendChild(dellCell)

      tableA.appendChild(row);
    });
}


//appendTableData(data)
function generate(row, cell, rowdata, index){
  cell.classList.add("row");
  cell.setAttribute("id", "row" + index);

  cell.innerHTML = rowdata;
  row.appendChild(cell);
}


function refreshTable(data){
  while (tableA.lastElementChild && tableA.lastElementChild!=tableA.firstElementChild) {
        tableA.lastElementChild.remove();
  
  }
  appendTableData(data)
}





const menuButton = document.getElementById('menuButton');
const menu = document.getElementById('menu');

menuButton.addEventListener('click', function() {
  showMenu()
});

const hideMenuBtn = document.getElementById('hide-menu-btn');

hideMenuBtn.addEventListener('click', () => {
  hideSettMenu()
});

function hideSettMenu(){
  menu.classList.toggle('visible');
  document.body.classList.remove('overlay');
  clear()
}

function showMenu(){
  menu.classList.toggle('visible');
  document.body.classList.add('overlay');
}


window.api.send("toMainSettings")//načítá nastavení a všechna data
window.api.receive("fromMainSettings", (sett) => {
  dev = sett.dev//set if app is in dev mode
  if (dev){
    tasks_raw_dataDD = [
      {
          "longitude": -80,
          "worker": "default",
          "runing": true,
          "task": "ping",
          "last_run": 0,
          "address": "google.com",
          "color": "#b6c309",
          "name": "GOG",
          "latitude": 30,
          "hide": false,
          "frequency": "8m",
          "id": 5
      },
      {
          "longitude": -80,
          "worker": "default",
          "runing": true,
          "task": "ping",
          "last_run": 0,
          "address": "palaceskateboards.com",
          "color": "#fb00ff",
          "name": "Palace",
          "latitude": -30,
          "hide": false,
          "frequency": "8m",
          "id": 7
      },
      {
          "longitude": 80,
          "worker": "default",
          "runing": true,
          "task": "ping",
          "last_run": 0,
          "address": "supremenewyork.com",
          "color": "#940000",
          "name": "Supreme",
          "latitude": 30,
          "hide": false,
          "frequency": "8m",
          "id": 8
      },
      {
          "longitude": 160,
          "worker": "default",
          "runing": true,
          "task": "ping",
          "last_run": 0,
          "address": "www.kos.cvut.cz",
          "color": "#000000",
          "name": "www.kos.cvut.cz",
          "latitude": 60,
          "hide": false,
          "frequency": "8m",
          "id": 9
      },
      {
          "longitude": 80,
          "worker": "default",
          "runing": true,
          "task": "ping",
          "last_run": 0,
          "address": "www.chartjs.org",
          "color": "#cd4747",
          "name": "chart",
          "latitude": -30,
          "hide": false,
          "frequency": "7m",
          "id": 10
      },
      {
          "longitude": 160,
          "worker": "default",
          "runing": true,
          "task": "ping",
          "last_run": 0,
          "address": "www.epochconverter.com",
          "color": "#ab00ad",
          "name": "epoch time",
          "latitude": -60,
          "hide": false,
          "frequency": "8m",
          "id": 11
      },
      {
          "longitude": 10,
          "worker": "default",
          "runing": true,
          "task": "ping",
          "last_run": 0,
          "address": "www.alaskaair.com",
          "color": "#2bff00",
          "name": "alaska",
          "latitude": 10,
          "hide": false,
          "frequency": "7m",
          "id": 12
      },
      {
          "longitude": 10,
          "worker": "default",
          "runing": true,
          "task": "ping",
          "last_run": 0,
          "address": "www.australia.gov.au",
          "color": "#ff5900",
          "name": "au",
          "latitude": 10,
          "hide": false,
          "frequency": "7m",
          "id": 13
      },
      {
          "longitude": 0,
          "worker": "default",
          "runing": true,
          "task": "ping",
          "last_run": 0,
          "address": "jetbrains.com",
          "color": "#0300b3",
          "name": "jetbrains",
          "latitude": 30,
          "hide": false,
          "frequency": "5m",
          "id": 14
      },
      {
          "longitude": 0,
          "worker": "default",
          "runing": true,
          "task": "ping",
          "last_run": 0,
          "address": "www.seznam.cz",
          "color": "#e60000",
          "name": "seznam",
          "latitude": 0,
          "hide": false,
          "frequency": "5m",
          "id": 15
      },
      {
          "longitude": -160,
          "worker": "default",
          "runing": true,
          "task": "ping",
          "last_run": 0,
          "address": "facebook.com",
          "color": "#0011ff",
          "name": "FB",
          "latitude": 60,
          "hide": false,
          "frequency": "9m",
          "id": 16
      },
      {
          "longitude": -160,
          "worker": "default",
          "runing": true,
          "task": "ping",
          "last_run": 0,
          "address": "novinky.cz",
          "color": "#4b398e",
          "name": "novinky",
          "latitude": -60,
          "hide": false,
          "frequency": "10m",
          "id": 17
      },
      {
          "longitude": 30,
          "worker": "default",
          "runing": true,
          "task": "ping",
          "last_run": 0,
          "address": "youtube.com",
          "color": "#c70000",
          "name": "YT",
          "latitude": 0,
          "hide": false,
          "frequency": "5m",
          "id": 18
      },
      {
          "longitude": 20,
          "worker": "default",
          "runing": true,
          "task": "ping",
          "last_run": 0,
          "address": "1.1.1.1",
          "color": "#00abb8",
          "name": "Cloudflare",
          "latitude": 10,
          "hide": false,
          "frequency": "6m",
          "id": 19
      },
      {
          "longitude": -90,
          "worker": "default",
          "runing": true,
          "task": "ping",
          "last_run": 0,
          "address": "8.8.8.8",
          "color": "#b802c5",
          "name": "google-public-dns",
          "latitude": 45,
          "hide": false,
          "frequency": "6m",
          "id": 20
      },
      {
          "longitude": -170,
          "worker": "default",
          "runing": true,
          "task": "ping",
          "last_run": 0,
          "address": "8.8.4.4",
          "color": "#000000",
          "name": "google-public-dnsB",
          "latitude": -80,
          "hide": false,
          "frequency": "8m",
          "id": 22
      },
      {
          "longitude": 5,
          "worker": "default",
          "runing": true,
          "task": "ping",
          "last_run": 0,
          "address": "www.nytimes.com",
          "color": "#8583aa",
          "name": "NYT",
          "latitude": 0,
          "hide": false,
          "frequency": "8m",
          "id": 23
      }
  ]
    refreshTable(tasks_raw_dataDD)
  }
})