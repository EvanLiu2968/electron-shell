
const { app, BrowserWindow, Menu } = require('electron');
const { getSettingData } = require('./lib/utils')
const _logger = require('./lib/logger')
const logger = _logger.scope('app')

const setting = getSettingData()

//获取单例锁
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  logger.info('app start...')
  const childApp = require("./lib/childApp")
  childApp.start()
  const { mainWindowIpcStart } = require("./lib/ipcMain")
  const { checkUpdate } = require("./lib/checkUpdater")
  const path = require('path');
  global.appDirname = __dirname;

  app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

  let mainWindow;
  function createWindow() {

    Menu.setApplicationMenu(null)
    const win = new BrowserWindow({
      icon: path.resolve(__dirname, "./icon/logo.png"),
      frame: true,
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
    if (app.isPackaged) {
      win.loadURL(`${setting.host}/bridge?v=${new Date().getTime()}`)
    } else {
      win.loadURL(`http://127.0.0.1:9090/bridge?v=${new Date().getTime()}`)
      win.webContents.openDevTools()
    }

    win.on('closed', () => { mainWindow = null; })
    win.on('ready-to-show', () => { win.show() })

    win.webContents.on("did-finish-load", () => {
      checkUpdate();
    });
    return win
  }


  app.on("ready", function () {
    mainWindow = new createWindow();
    mainWindowIpcStart(mainWindow)
    logger.info('app ready...')
  })

  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时,将会聚焦到myWindow这个窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  app.on('window-all-closed', (e) => {
    e.preventDefault()
    logger.info('app before-quit...')
    childApp.close().then(() => {
      logger.info('childApp closed...')
      app.quit()
    })
  });

  app.on('quit', () => {
    logger.info('app quit...')
    app.releaseSingleInstanceLock();//释放所有的单例锁
  });

  app.commandLine.appendSwitch('no-sandbox');
}
