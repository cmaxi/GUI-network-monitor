

var tasks_raw_data


function getlog(){
  window.api.receive("fromMainRequestLog", (data) => {
    console.log('\x1B[34m %s %s', data[0], data[1]);
  });
}


function load_server_json(){
    window.api.send("toMainJsonLoad")
    window.api.receive("fromMainJsonLoad", (data) => {
    tasks_raw_data = data  
    send = { params: {worker:"default"}}
    window.api.httpRequest("requestTasksProperties",send)
      window.api.receive("fromMainRequestTaskProperties", (data) => {
        runingAddress = []
        data.forEach(element => {
          runingAddress.push(element.address)
        });
        
        tasks_raw_data.forEach(element => {
          if (runingAddress.includes(element.address)){
            tasks_raw_data[tasks_raw_data.indexOf(element)].runing = true
            runingAddress.splice(runingAddress.indexOf(element.address),1)
          }else{
            tasks_raw_data[tasks_raw_data.indexOf(element)].runing = false
          }
        });
        data.forEach(element => {
          if (runingAddress.includes(element.address)){
            strll = {"name":element.address,"address":element.address,"color":"#000000","period":element.frequency,"coordinates":[0, 0],"worker":element.worker,"runing":true}
            tasks_raw_data.push(strll)
          }
        });
        window.api.send("toMainJsonSave", JSON.stringify(tasks_raw_data))
        refreshTable(tasks_raw_data)
      });
    getlog()
  });
}

load_server_json();


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
        s_name.value = tasks_raw_data[i].name
        s_address.value = tasks_raw_data[i].address
        s_color.value = tasks_raw_data[i].color
        s_period.value = tasks_raw_data[i].period
        s_lat.value = tasks_raw_data[i].coordinates[0]
        s_long.value = tasks_raw_data[i].coordinates[1]
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
    strll = {"name":s_name.value,"address":s_address.value,"color":s_color.value,"period":s_period.value,"coordinates":[parseFloat(s_lat.value), parseFloat(s_long.value)],"worker":s_work.value}
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
    else if (l_na.indexOf(nn) == l_ad.indexOf(addr) && l_na.indexOf(nn) == -1){//jm addr nejsou
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
      
      send={params: {'address':s_address.value, 'task':'ping', 'time':s_period.value, 'worker':s_work.value}}
      if(will_update_byName){
        send.params.oldAddress = tasks_raw_data[l_na.indexOf(nn)].address
        strll.runing = tasks_raw_data[l_na.indexOf(nn)].runing
        tasks_raw_data[l_na.indexOf(nn)] = strll
        if (strll.runing){
          window.api.httpRequest("requestUpdateTask",send)
        }
      }
      else if(will_update_byAddress){
        send.params.oldAddress = tasks_raw_data[l_ad.indexOf(addr)].address
        strll.runing = tasks_raw_data[l_ad.indexOf(addr)].runing
        tasks_raw_data[l_ad.indexOf(addr)] = strll
        if (strll.runing){
          window.api.httpRequest("requestUpdateTask",send)
        }
      }
      else
      {
        strll.runing = true
        tasks_raw_data.push(strll)
        window.api.httpRequest("requestAddTask",send)
      }
      window.api.send("toMainJsonSave", JSON.stringify(tasks_raw_data))
      clear()
      load_server_json()
    } else {console.log("You canceled!");}
    
  }
  
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
          tasks_raw_data.splice(i,1)
          window.api.send("toMainJsonSave", JSON.stringify(tasks_raw_data))
          load_server_json()
          send = l_ad[l_na.indexOf(Dname)]
          window.api.httpRequest("requestDelTask",{params:{'address':send}})
          clear()
        } else {
          console.log("You canceled!");
        }
      }
      i++
    });
    txt = Dname + " not found!"
    if(found == false){alert(txt)}

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
          tasks_raw_data[poss].runing == false ? tasks_raw_data[poss].runing = true : tasks_raw_data[poss].runing = false

          window.api.send("toMainJsonSave", JSON.stringify(tasks_raw_data))
          load_server_json()
          n_task = tasks_raw_data[tasks_raw_data.indexOf(element)]
          send={params: {'address':n_task.address, 'task':'ping', 'time':n_task.period, 'runing':n_task.runing, 'worker':n_task.worker}}
            console.log(send)
          window.api.httpRequest("requestPauseStartTask",send)
          clear()
        } else {
          console.log("You canceled!");
        }
      }
    });
    if (!found){
      alert("Not found")
    }
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
  getlog()
})
























document.querySelectorAll('.tabH').forEach(item => {
  item.addEventListener('click', event => {
    sortTable(item.id[4])
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
          row.addEventListener("click", function() {
            //alert("ID clicked: " + rowdata);
            const pozice = parseInt(row.id.replace(/\D/g, ''));
            loadSpecs(tasks_raw_data[pozice].name)
          });

          row.addEventListener('contextmenu', event => {
            position = parseInt(row.id.replace(/\D/g, ''));
              // Show context menu on right click
              event.preventDefault();
              contextMenu.classList.add("show-context-menu");
              contextMenu.style.left = event.pageX + "px";
              contextMenu.style.top = event.pageY + "px";
          })






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
          generate(row, periodCell, rowData["period"], index)
  
          var periodCell = document.createElement("td");
          periodCell.innerHTML = "Lat: " + rowData["coordinates"][0]+"<br>Len: " + rowData["coordinates"][1];
          periodCell.setAttribute("id", "row" + index);
          row.appendChild(periodCell);
  
          var periodCell = document.createElement("td");
          generate(row, periodCell, rowData["worker"], index)
  
          var periodCell = document.createElement("td");
          generate(row, periodCell, rowData["runing"], index)
  
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



