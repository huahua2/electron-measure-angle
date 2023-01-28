// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const path = require('path')

Menu.setApplicationMenu(null)

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 2000,
    height: 2000,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    transparent: true,
    frame: false,
    hasShadow: false,
    alwaysOnTop: true,
    // titleBarStyle: 'hidden',
    // titleBarOverlay: true,
    // 无标题时，在mac内，窗口将一直拥有位于左上的标准窗口控制器 (“traffic lights”)
    // titleBarStyle: 'hidden',
    // mac设置控制按钮在无边框窗口中的位置。
    // trafficLightPosition: { x: 12, y: 18 },
    // titleBarOverlay: {
    //   y: 100,
    //   color: '#2f3241',
    //   symbolColor: '#74b1be',
    //   height: 60
    // }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('src/index.html')
  // Open the DevTools.
  mainWindow.webContents.openDevTools()


  ipcMain.on('min', e=> mainWindow.minimize());
  ipcMain.on('max', e=> {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  });
  ipcMain.on('close', e=> mainWindow.close());
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
