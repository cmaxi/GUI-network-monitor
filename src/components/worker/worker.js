const { ipcMain } = require('electron');
let mainWindow;

module.exports = function worker(win) {
  mainWindow = win;

  ipcMain.on("getWorkers", (event, args) => {
    mainWindow.webContents.send("getWorkers", 'data');
  })
}