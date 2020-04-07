// Modules
const {app, BrowserWindow, ipcMain, session} = require('electron')
const {webContents} = require('electron')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let loginWindow
var user
// Create a new BrowserWindow when `app` is ready
app.on('ready', () => {

  loginWindow = new BrowserWindow({
    width: 500, height: 750,
    webPreferences: { nodeIntegration: true },
    show: false
  })

  loginWindow.loadFile('Login_v6/index.html')
  loginWindow.webContents.on('did-finish-load', function() {
    loginWindow.show();
});

  loginWindow.on('closed', () => {
    loginWindow = null
  })

})


function createMainWindow (user) {

  console.log("createMainWindow")

    try{

      mainWindow = new BrowserWindow({
        width: 1000, height: 800,
        webPreferences: { nodeIntegration: true },
        show: false
        })
        // Load index.html into the new BrowserWindow
          mainWindow.loadFile('startbootstrap-sb-admin-gh-pages/dist/index.html')


          console.log("username: "+user.username)

         // mainWindow.loadFile('node_modules/admin-lte/index.html')
          mainWindow.webContents.on('did-finish-load', function() {

          mainWindow.webContents.send('set-user-session', user)

            loginWindow.show = false
  // console.log(data.username)
  // createMainWindow()

            loginWindow.close()
            loginWindow = null
                  mainWindow.show();
          });
      // Open DevTools - Remove for PRODUCTION!
      //mainWindow.webContents.openDevTools();
    }catch(e){
      console.log(e)
    }


}

ipcMain.on('set-username', (event, data) => {
    this.user = data
    createMainWindow(data, () => {
    event.sender.send('user-saved')
    })
})

ipcMain.on('loginWindow-load', (e, data) => {


})




// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
