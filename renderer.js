//hide swap:
const graph = document.getElementById('graf')
const jsonpar = document.getElementById('jsonpar')
const maps = document.getElementById('maps')
const login = document.getElementById('login')

const graph0 = document.getElementById('gResp0')
const graph1 = document.getElementById('gResp1')
const graph2 = document.getElementById('gResp')
const spacer = document.getElementById('spacer')

const windows = [graph, jsonpar, maps, login, graph0, graph1, graph2, spacer]  //div sectors by id

function sh(sh){
  for (let i = 0; i < windows.length; i++) { 
    windows[i].style.display = "none";
  }
  windows[sh].style.display = "block";
  if (sh>=4 || sh<=6 && sh!=1 && sh!=2 && sh!=3)
  {
    windows[0].style.display = "block";
  }
}

sh(3)


window.api.receive_cmd("fromMainhowHideSwitch", (show) => {
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
    map.invalidateSize();//překreslení mapy pro korektní zobrazení
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







const b11 = document.getElementById('validateLogIn')
b11.addEventListener('click', async () => {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

    window.api.httpRequest("requestServerUp", [username, password])
    window.api.receive("successfulLogin", (data) => {//ošetření jestli server běží a uživ je přihlášen?
      console.log(data)
      if(data==true){
        alert("Login successful!");
        sh(1)
      }
      else if(data=="ECONNREFUSED"){
        if (!confirm(data+"\n OK: for reconect\nCancel: For close app")){
          window.api.send("toMainServerDown")
        }
      }
      else if(data=="ERR_BAD_REQUEST"){
        alert("Bad PSWD or NAME")
      }
  });
})