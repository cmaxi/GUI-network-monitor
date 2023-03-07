

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
  while (i<count){//kontrola nutno pro průchod skrze všechna pole co mají být kontrolována
    if (!form_for_server_upadddel[i].checkValidity()) {
      form_for_server_upadddel[i].reportValidity()
      validity = false
    }
    i++;
  }
  return validity
}

update.addEventListener('click', async () => {  //update/save 

  if (correctData(5)){

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
        //tasks_raw_data[l_na.indexOf(nn)] = strll
        window.api.httpRequest("requestUpdateTask",send)
        
      }
      else if(will_update_byAddress){
        send.params.oldAddress = tasks_raw_data[l_ad.indexOf(addr)].address
        send.params.runing = tasks_raw_data[l_ad.indexOf(addr)].runing
        //strll.runing = tasks_raw_data[l_ad.indexOf(addr)].runing
        //tasks_raw_data[l_ad.indexOf(addr)] = strll
        window.api.httpRequest("requestUpdateTask",send)
      }
      else
      {
        send.params.runing = true
        window.api.httpRequest("requestAddTask",send)
      }
      clear()
      load_server_json()
      
    } 
    else {
      console.log("You canceled!");
    }
    
  }
  hideSettMenu()
  loadAllDataNew()//v graphs.js obnoví změny aby byli při překliknutí ihned viditelné
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
          //tasks_raw_data.splice(i,1)
          //window.api.send("toMainJsonSave", JSON.stringify(tasks_raw_data))
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
    loadAllDataNew()//v graphs.js obnoví změny aby byli při překliknutí ihned viditelné
}

function clear(){
  s_name.value = ""
  s_address.value = ""
  s_color.value = "#000000"
  s_period.value = ""
  s_long.value = ""
  s_lat.value = ""
}
//,,,

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
    loadAllDataNew()//v graphs.js obnoví změny aby byli při překliknutí ihned viditelné
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
    loadAllDataNew()//v graphs.js obnoví změny aby byli při překliknutí ihned viditelné
}


const paus = document.getElementById('runing')
paus.addEventListener('click', async () => {
  if (correctData(1)){
    pausStart(s_name.value)
  }
})


const dellallserv = document.getElementById('dellall_html')
dellallserv.addEventListener('click', async () => {
  window.api.httpRequest("requestClearAllDatabase")
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
          img.src = "icons/Update.png";  // Zde nastavte cestu k vaší ikoně
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
          img.src = rowData["runing"]==true?"icons/Pause.png":"icons/Start.png";  // Zde nastavte cestu k vaší ikoně
          img.height = 20;
          buttonP.appendChild(img);
          buttonP.addEventListener("click", function() {
            pausStart(tasks_raw_data[index].name)
          });
          pauseCell.appendChild(buttonP);
          row.appendChild(pauseCell)
          pauseCell.style.backgroundColor = rowData["runing"]==false?"red":"green";


          var hideCell = document.createElement("td");
          const buttonH = document.createElement("button");
          var img = document.createElement("img");
          img.src = rowData["hide"]==true?"icons/Show.png":"icons/Hide.png";  // Zde nastavte cestu k vaší ikoně
          img.height = 20;
          buttonH.appendChild(img);
          buttonH.addEventListener("click", function() {
            hideTask(tasks_raw_data[index].name)
          });
          hideCell.appendChild(buttonH);
          row.appendChild(hideCell)
          hideCell.style.backgroundColor = rowData["hide"]==true?"gray":"white";


          var dellCell = document.createElement("td");
          const buttonD = document.createElement("button");
          var img = document.createElement("img");
          img.src = "icons/Trash.png";  // Zde nastavte cestu k vaší ikoně
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

