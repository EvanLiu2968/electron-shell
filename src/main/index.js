
const { app, screen, BrowserWindow, Menu } = require('electron');

//获取单例锁
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  const { mainWindowIpcStart } = require("./lib/ipcMain")
  const path = require('path');
  global.appDirname = __dirname;

  app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

  let mainWindow;
  function createWindow () {

    // 全屏覆盖窗口，普通全屏挡不住底部状态栏
    // let size = screen.getPrimaryDisplay().workAreaSize
    // let fullWidth = size.width;
    // let fullHeight = size.height;

    Menu.setApplicationMenu(null)
    const win = new BrowserWindow({
      // fullWidth: 1580,
      // fullHeight: 888,
      //resizable: false,
      //useContentSize: true,
      /* transparent: true, */
      icon: path.resolve(__dirname, "./icon/logo.png"),
      // frame: false,  //是否显示标题栏，如果要全屏，取消注释本行代码
      // fullscreen: true, //是否全屏，如果要全屏，取消注释本行代码
      show: false,
      webPreferences: {
        webSecurity: false, 
        nodeIntegration: true,
        contextIsolation: false,
        webviewTag: true
      }
    })
    
    // 最大化，如果要全屏，注释本行代码
    win.maximize(); 
    // 区分环境加载
    if (app.isPackaged) {
      win.loadURL(`${process.env.APP_BASE_HOST}/merchant?v=${new Date().getTime()}`)
    } else {
      win.loadURL(`${process.env.APP_BASE_HOST}/merchant?v=${new Date().getTime()}`)
      win.webContents.openDevTools()
    }

    win.on('closed', () => { mainWindow = null; })
    win.on('ready-to-show', () => { win.show() })
    return win
  }

  app.on("ready", function () {
    mainWindow = new createWindow();
    mainWindowIpcStart(mainWindow)
  })

  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时,将会聚焦到myWindow这个窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  app.on('quit', () => {
    app.releaseSingleInstanceLock();//释放所有的单例锁
  });

  app.commandLine.appendSwitch('no-sandbox');
}
