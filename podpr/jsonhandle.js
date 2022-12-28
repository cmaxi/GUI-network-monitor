const list_servers = document.getElementById('server_names')
var tasks_raw_data = "" //raw data

function getName(d){
  return d.name
}
var rowMenu = [
  {
      label:"<i class='fas fa-user'></i> Pause/Start",
      action:function(e, row){
        pausStart(getName(row.getData()))
      }
  },
  {
    separator:true,
  },  
  {
      label:"<i class='fas fa-trash'></i> Dellete",
      action:function(e, row){
        dellAdress(getName(row.getData()))
      }
  },
  /*
  {
      label:"Admin Functions",
      menu:[
          {
              label:"<i class='fas fa-trash'></i> Delete Row",
              action:function(e, row){
                  row.delete();
              }
          },
          {
              label:"<i class='fas fa-ban'></i> Disabled Option",
              disabled:true,
          },
      ]
  }*/
]

var table = new Tabulator("#example-table", {
  height:400,
  columnDefaults:{
    resizable:true,
  },
  rowContextMenu: rowMenu, //add context menu to rows
  columns:[
  {title:"Name", field:"name", width:110},
  {title:"Address", field:"address", width:185},
  {title:"Color", field:"color" ,formatter:"color", width:85,headerSort:false},
  {title:"Period", field:"period", width:115},
  {title:"Coordinates", field:"coordinates", width:128,headerSort:false},
  {title:"Runing", field:"runing", hozAlign:"center", formatter:"tickCross", width:120},
  {title:"Worker", field:"worker", width:125},
  ],
});


table.on("rowClick", function(e, column){
  //e - the click event object
  //column - column component
  loadSpecs(e.target.innerHTML)
});



function getlog(){
  window.api.receive("http_logs", (data) => {
    console.log('\x1B[34m %s %s', data[0], data[1]);
  });
}


function load_server_json(){
    window.api.send("toMain_jslo")
    window.api.receive("fromMain_jslo", (data) => {
    tasks_raw_data = data  
    send = { params: {worker:"default"}}
    window.api.html_req("load_html_req_status",send)
      window.api.receive("html_req_status", (data) => {
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
        window.api.send("toMain_jssa", JSON.stringify(tasks_raw_data))
      });
    getlog()
    setTimeout(function() {
      table.replaceData(tasks_raw_data);
    }, 200);
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
const dell = document.getElementById('delsave')
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

function correctData(count){
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
          window.api.html_req("update_html_req",send)
        }
      }
      else if(will_update_byAddress){
        send.params.oldAddress = tasks_raw_data[l_ad.indexOf(addr)].address
        strll.runing = tasks_raw_data[l_ad.indexOf(addr)].runing
        tasks_raw_data[l_ad.indexOf(addr)] = strll
        if (strll.runing){
          window.api.html_req("update_html_req",send)
        }
      }
      else
      {
        strll.runing = true
        tasks_raw_data.push(strll)
        window.api.html_req("add_html_req",send)
      }
      window.api.send("toMain_jssa", JSON.stringify(tasks_raw_data))
      clear()
      getlog()
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
          window.api.send("toMain_jssa", JSON.stringify(tasks_raw_data))
          load_server_json()
          send = l_ad[l_na.indexOf(Dname)]
          window.api.html_req("dell_html_req",{params:{'address':send}})
          clear()
          getlog()
        } else {
          console.log("You canceled!");
        }
      }
      i++
    });
    txt = Dname + " not found!"
    if(found == false){alert(txt)}

}
dell.addEventListener('click', async () => {
  dellAdress(s_name.value)
})

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

          window.api.send("toMain_jssa", JSON.stringify(tasks_raw_data))
          load_server_json()
          n_task = tasks_raw_data[tasks_raw_data.indexOf(element)]
          send={params: {'address':n_task.address, 'task':'ping', 'time':n_task.period, 'runing':n_task.runing, 'worker':n_task.worker}}
            console.log(send)
          window.api.html_req("pause_html_req",send)
          clear()
          getlog()
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
  window.api.html_req("dellall_html_req")
  getlog()
})


