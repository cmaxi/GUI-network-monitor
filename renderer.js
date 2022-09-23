//hide swap:
const graph = document.getElementById('graf')
const jsonpar = document.getElementById('jsonpar')
const maps = document.getElementById('maps')
const windows = [graph, jsonpar, maps]  //div sectors by id

function sh(sh){
  for (let i = 0; i < windows.length; i++) { 
    windows[i].style.display = "none";
  }
  windows[sh].style.display = "block";
}

sh(0)

window.api.receive_cmd("fromMain_showhide", (show) => {
  sh(show);
});





