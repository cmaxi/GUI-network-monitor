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

sh(1)


window.api.receive_cmd("fromMain_showhide", (show) => {
  sh(show);
});


const menuO = document.getElementById('openNav') 
menuO.addEventListener('click', async () => {
  document.getElementById("mySidenav").style.width = "250px";
})

const menuC = document.getElementById('closebtn') 
menuC.addEventListener('click', async () => {
  document.getElementById("mySidenav").style.width = "0px";
})

document.querySelectorAll('.swapPage').forEach(item =>{
  item.addEventListener('click', event => {
    sh(parseInt(item.id[1]))
    document.getElementById("mySidenav").style.width = "0px";
  })
})


var dropdown = document.getElementsByClassName("dropdown-btn");
var i;

for (i = 0; i < dropdown.length; i++) {
  dropdown[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var dropdownContent = this.nextElementSibling;
    if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
    } else {
      dropdownContent.style.display = "block";
    }
  });
}