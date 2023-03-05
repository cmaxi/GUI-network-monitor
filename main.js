const {app, BrowserWindow, ipcMain, dialog, Menu} = require('electron')
const path = require('path')
var fs = require('fs')
const axios = require('axios').default;
const https = require('https');



let mainWindow

var httpReqestAddr
var servOffFile
var graphsSet

var axiosInst
var accessToken
var config



fs.readFile("./settings.json", (err, jsonString) => {
  var sett = JSON.parse(jsonString)
  httpReqestAddr = sett.httpReq
  servOffFile = sett.serversOfflineFile
  graphsSet = sett.graphs  


  const cert = fs.readFileSync('certif/Local1crt.pem');
  const key = fs.readFileSync('certif/Local1Key.pem');

  const agent = new https.Agent({
    cert: cert,
    key: key,
    rejectUnauthorized: false // This is needed for self-signed certificates
  });

  axiosInst = axios.create({
    httpsAgent: agent,
    baseURL: httpReqestAddr.http
  })
  

})
  





function postHttp(http_address, sendval, action){//funkce pro http requesty POST
  post_log = ""
  
  fh = config
  fh.params=sendval.params

  axiosInst.post(http_address, null, fh)
  .then(function (response) {
    post_log = [action + " " + response.statusText, response.status]
  })
  .catch(function (error) {
    if (error.code == 'ECONNREFUSED'){
      post_log = ["Not connected network error", ""]
    }
    else{
      post_log = [action + " " + error.response.data, error.response.status]
    }
    mainWindow.webContents.send("fromMainServerDown")
  })
  .finally(()=>{
    post_log.push("login")
    mainWindow.webContents.send("fromMainRequestLog", post_log)
  })
}


function getHttp(http_address,sender,sendval,action){//funkce pro http requesty GET volaná později
  post_log = ""
  run = true
  fh = config
  fh.params=sendval.params

  axiosInst.get(http_address, fh)
  .then(function (response) {
    post_log = [action + " " + response.statusText, response.status]
    mainWindow.webContents.send(sender,response.data)
  })
  .catch(function (error) {
    console.log("Nepřipojeno")
    if (error.code == 'ECONNREFUSED'){
      post_log = ["Not connected network error", ""]
      
    }
    else{
      console.log(error.response.status);
      post_log = [action + " " + error.response.data, error.response.status]
    }
    run = false
    mainWindow.webContents.send("fromMainServerDown")
    mainWindow.webContents.send(sender,"errorFlag")
  })
  .finally(()=>{
    post_log.push("get")
    mainWindow.webContents.send("fromMainRequestLog", post_log)
  })
  
  return run
}









const options = {
  type: 'question',
  buttons: ['Cancel', 'Yes'],
  title: 'Load',
  message: 'Do you want to load servers from file?',
  detail: 'Load and start tasks'
};
// file open and return message with filepath

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (canceled) {
    return
  } else {
    options.message = filePaths[0]
    dialog.showMessageBox(mainWindow, options).then(box => {
      if (box.response==1){
        fs.readFile(filePaths[0], "utf-8", (err, data) => {
          if (err) {
            console.error("Chyba při čtení souboru:", err);
            return;
          }
          try {
            const jsonData = JSON.parse(data);
            jsonData.forEach(json => {
              if (
                json.hasOwnProperty("longitude") &&
                json.hasOwnProperty("worker") &&
                json.hasOwnProperty("runing") &&
                json.hasOwnProperty("task") &&
                json.hasOwnProperty("last_run") &&
                json.hasOwnProperty("address") &&
                json.hasOwnProperty("color") &&
                json.hasOwnProperty("name") &&
                json.hasOwnProperty("latitude") &&
                json.hasOwnProperty("hide") &&
                json.hasOwnProperty("frequency") &&
                json.hasOwnProperty("id"))
              {
                send={params: {"name":json.name,"address":json.address,"color":json.color,"time":json.frequency,"latitude":json.latitude, "longitude":json.longitude,"worker":json.worker, "task":"ping", "hide":json.hide}}
                postHttp(httpReqestAddr.httpAdd, send, "Adding")
              }
              else
              {
                console.log("nesplňuje formát")
              }
            });
          }
          catch
          {
            console.log("neni json")
          }
        })
      }
    })
    .catch(err => {
      console.log(err)
  }); 
    return filePaths[0]
  }
}





function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1200, height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation : true,
      preload: path.join(__dirname, 'preload.js')}
  })


  //vzhled menu
  const isMac = process.platform === 'darwin'
  const menu = [
      // { role: 'appMenu' }
      ...(isMac ? [{
        label: app.name,
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      }] : []),
      // { role: 'fileMenu' }
      {
        label: 'File',
        submenu: [
          { label: 'Load file', click: () => handleFileOpen() },
          { label: 'Save', click: () => mainWindow.webContents.send("fromMainhowHideSwitch") },
        ]
      },
      // { role: 'editMenu' }
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          ...(isMac ? [
            { role: 'pasteAndMatchStyle' },
            { role: 'delete' },
            { role: 'selectAll' },
            { type: 'separator' },
            {
              label: 'Speech',
              submenu: [
                { role: 'startSpeaking' },
                { role: 'stopSpeaking' }
              ]
            }
          ] : [
            { role: 'delete' },
            { type: 'separator' },
            { role: 'selectAll' }
          ])
        ]
      },
      // { role: 'windowMenu' }
      {
        label: 'Window',
        submenu: [
          { role: 'minimize' },
          { role: 'zoom' },
          {
            label: 'Wiew',
            submenu: [
              { role: 'resetZoom' },
              { role: 'zoomIn' },
              { role: 'zoomOut' },
              { type: 'separator' },
              { role: 'togglefullscreen' }
            ]
          },
          ...(isMac ? [
            { type: 'separator' },
            { role: 'front' },
            { type: 'separator' },
            { role: 'window' }
          ] : [
            { role: 'close' }
          ])
        ]
      }
  ]
  

  //vývojářské nástroje
  if(process.env.NODE_ENV !== 'production'){
    menu.push({
      label: 'Developer Tools',
      submenu:[
        {
          role: 'Reload'
        },
        {
          label: 'Toggle DevTools',
          accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
          click(item, focusedWindow){focusedWindow.toggleDevTools();}
        }
      ]
    });
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menu))//nastavení položek v menu
  mainWindow.loadFile('index.html')         //načte html soubor
  mainWindow.webContents.openDevTools()   //otevře vývojářské nástroje při spuštění
}


//načítání aplikace a poté spuštění funkcí které si volá render proces
app.whenReady().then(() => {
  ipcMain.on("toMainSettings", (event, args) => {
      mainWindow.webContents.send("fromMainSettings", graphsSet);//posílá nastavení pro podprogramy
  })

  ipcMain.on("toMainServerDown", (event, args) => {
    app.quit()
  })

  //ukládá data do json
  ipcMain.on('toMainJsonSave', (event, textforsave2) => {
    dialog.showSaveDialog()
    .then(result=>{
      fs.writeFileSync(result.filePath+".json", JSON.stringify(textforsave2, null, 2), (err) => {  //null pro nepřevedení do řádku a 2 pro mezery mezi řeťezci
        if (!err) {console.log("written");}
        else{console.log(err)}
      })
    })
    .catch(err => {
      console.log(err)
    }); 
  })

//http requesty
  
  ipcMain.handle("requestServerUp", async (event, reqVar)=>{


    function getAccessToken(username, password, addr) {
      post_log = ""
      if (addr){
        axiosInst.defaults.baseURL = addr;
      }
      else{
        axiosInst.defaults.baseURL = httpReqestAddr.http;
      }
      
      
      const data = new URLSearchParams();
      data.append('grant_type', '');
      data.append('username', username);
      data.append('password', password);
      data.append('scope', '');
      data.append('client_id', '');
      data.append('client_secret', '');
      const sen={
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      }
      axiosInst.post('/token', data, sen)
      .then(response => {
        accessToken = response.data.access_token
        config = {
          headers: {
            'Authorization': `Bearer `+accessToken,
            'Accept': 'application/json'
          }
        };
        mainWindow.webContents.send("fromMainSuccessfulLogin", true)
        post_log = ["Login " + response.statusText, response.status]
      })
      .catch(error => {
        if (error.code == 'ECONNREFUSED'){
          post_log = ["Not connected network error", ""]
        }
        else{
          post_log = ["Login " + error.response.data, error.response.status]
        }
        mainWindow.webContents.send("fromMainSuccessfulLogin", false)
      })
      .finally(()=>{
        post_log.push("post")
        mainWindow.webContents.send("fromMainRequestLog", post_log)
      })
    }
    
    getAccessToken(reqVar[0], reqVar[1], reqVar[2])
    
    
  })

  ipcMain.handle("requestLoadAll", async (event, reqVar)=>{
    getHttp(httpReqestAddr.httpLoad,"fromMainRequestLoadAll",reqVar!=undefined?reqVar:"","Load graph data")
  })

  ipcMain.handle("requestLoadAllFromTime", async (event, reqVar)=>{
    
    getHttp(httpReqestAddr.httpLoadFrom,"fromMainRequestLoadFromTime",reqVar,"Load graph data from")
  })

  ipcMain.handle("requestTasksProperties", async (event, reqVar)=>{
    getHttp(httpReqestAddr.httpTasks,"fromMainRequestTaskProperties",reqVar,"Load tasks data")
  })

  ipcMain.handle("requestTasksAverage", async (event, reqVar)=>{
    getHttp(httpReqestAddr.httpResponseSum,"fromMainRequestTaskAverage",reqVar,"Load Response sumary")
  })


  

  ipcMain.handle("requestAddTask", async (event, requVar)=>{
    postHttp(httpReqestAddr.httpAdd, requVar, "Adding")
  })

  ipcMain.handle("requestDelTask", async (event, reqVar)=>{
    postHttp(httpReqestAddr.httpDell,reqVar, "Delete")
  })
  
  ipcMain.handle("requestClearAllDatabase", ()=>{
    postHttp(httpReqestAddr.httpDellAll, "", "Delete all")

  })
  ipcMain.handle("requestUpdateTask", async (event, reqVar)=>{
    postHttp(httpReqestAddr.httpUpdate,reqVar,"Update")
  })
  
  ipcMain.handle("requestPauseStartTask", async (event, reqVar)=>{
    postHttp(httpReqestAddr.httpPause,reqVar,"Pause")
  })

  ipcMain.handle("requestHideTask", async (event, reqVar)=>{
    postHttp(httpReqestAddr.httpHide,reqVar,"Hide")
  })


  createWindow()  //otevře okno
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  }
)

 // Quit app when closed Zavře vše včetně druhého okna
app.on('close', function () {
  if (process.platform !== 'darwin') app.quit()
})
