const {app, BrowserWindow, ipcMain, dialog, Menu} = require('electron')
const path = require('path')
var fs = require('fs')
const axios = require('axios').default;



let mainWindow
var settings
  fs.readFile("./settings.json", (err, jsonString) => {
    settings = JSON.parse(jsonString)
  })
  


const options = {
  type: 'question',
  buttons: ['Cancel', 'Yes, please', 'No, thanks'],
  defaultId: 2,
  title: 'Question',
  message: 'Do you want to do this?',
  detail: 'It does not really matter',
  checkboxLabel: 'Remember my answer',
  checkboxChecked: true,
};
// file open and return message with filepath

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (canceled) {
    return
  } else {
    options.message = filePaths[0]
    dialog.showMessageBox(mainWindow, options).then(box => {
      console.log('Button Clicked Index - ', box.response);
      console.log('Checkbox Checked - ', box.checkboxChecked);
    }).catch(err => {
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
          { label: 'Save', click: () => "" },
          { label: 'Save as', click: () => "" },
        ]
      },
      {
        label: 'Switch',
        submenu: [
          { label: 'Graph', click: () => mainWindow.webContents.send("fromMain_showhide", 0) },
          { type: 'separator' },
          { label: 'Json', click: () => mainWindow.webContents.send("fromMain_showhide", 1) },
          { label: 'Map', click: () => mainWindow.webContents.send("fromMain_showhide", 2) },
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
  
  //když je mac přidá prázdnou položku do menu na první pozici
  if(process.platform == 'darwin'){
    //menu.unshift({label:''});
  }
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
  
//načte json pro úpravu dat nebo vytvoří soubor json
  ipcMain.on("toMain_jslo", (event, args) => {
    serv = ""
    fs.readFile(settings.serversFile, (err, jsonString) => {
      if (err) {
        fs.writeFileSync(settings.serversFile, "[]", (err) => {  //wrive file sync čeká na uložení pak dělá další program 
          if (!err) {
            fs.readFile(settings.serversFile, (err, jsonString)=>{serv = jsonString})
          }
        })
      }else{serv=jsonString}
      mainWindow.webContents.send("fromMain_jslo", JSON.parse(serv));
    });
  });
//ukládá data do json
  ipcMain.on('toMain_jssa', (event, textforsave2) => {
    fs.writeFileSync(settings.serversFile, textforsave2, (err) => {  //wrive file sync čeká na uložení pak dělá další program 
      if (!err) {console.log("written");}
      else{console.log(err)}
    })

  })
  function getHttp(http_address,sender,sendval,action){
    post_log = ""
    axios.get(http_address, sendval)
    .then(function (response) {
      mainWindow.webContents.send(sender,response.data)
      post_log = [action + " " + response.statusText, response.status]
    })
    .catch(function (error) {
      console.log(error.response.status);
      post_log = [action + " " + error.response.data, error.response.status]
    })
    .then(function () {
      mainWindow.webContents.send("http_logs", post_log)
    });  
    
  }

  ipcMain.handle("load_html_req", async (event, reqVar)=>{
    getHttp(settings.httpLoad,"html_req","","Load graph data")
  })

  ipcMain.handle("load_html_req_status", async (event, reqVar)=>{
    getHttp(settings.httpTasks,"html_req_status",reqVar,"Load tasks data")
  })


  function postHttp(http_address, sendval, action){
    post_log = ""
    axios.post(http_address, null, sendval)
    .then(function (response) {
      post_log = [action + " " + response.statusText, response.status]
    })
    .catch(function (error) {
      post_log = [action + " " + error.response.data, error.response.status]
    })
    .then(function () {
      mainWindow.webContents.send("http_logs", post_log)
    });
  }

  ipcMain.handle("add_html_req", async (event, requVar)=>{
    postHttp(settings.httpAdd, requVar, "Adding")
  })

  ipcMain.handle("dell_html_req", async (event, reqVar)=>{
    postHttp(settings.httpDell,reqVar, "Delete")
  })
  
  ipcMain.handle("dellall_html_req", ()=>{
    postHttp(settings.httpDellAll, "", "Delete all")

  })
  ipcMain.handle("update_html_req", async (event, reqVar)=>{
    postHttp(settings.httpUpdate,reqVar,"Update")
  })
  ipcMain.handle("pause_html_req", async (event, reqVar)=>{
    postHttp(settings.httpPause,reqVar,"Pause")
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


