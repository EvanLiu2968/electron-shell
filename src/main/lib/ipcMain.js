const { app, ipcMain, BrowserWindow, session, Notification, shell, DownloadItem, dialog } = require('electron');

const mainWindowIpcStart = function (win) {
  const { weightPort } = require("./weightPort")

  // 打开调试
  ipcMain.on("toggle_dev_tools", function (event, arg) {
    win.webContents.toggleDevTools();
  })

  // 重启
  ipcMain.on("restart", function () {
    app.relaunch();
    app.exit(0)
  })

  // 最小化
  ipcMain.on("min", function () {
    win.minimize()
  })

  // 最大化
  ipcMain.on("max", function () {
    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  })

  // 关闭程序
  ipcMain.on("close", function () {
    cacheDownItemClose()
    win.close();
    weightPort.close()
  })


  // 获取重量
  ipcMain.handle("getWeight", function (e, data) {
    const weight = weightPort.getWeight()
    return weight
  })

  // 创建用于处理打印请求的窗口
  ipcMain.handle('printData', async (event, printData) => {
    // 创建一个新的窗口用于加载打印模板
    const printWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        webSecurity: false,
        nodeIntegration: true,
        contextIsolation: false,
        webviewTag: true
      },
    });

    // 加载HTML模板
    printWindow.loadURL(`${process.env.APP_BASE_HOST}/print/bill.html?v=${new Date().getTime()}`).then(() => {
      printWindow.webContents.executeJavaScript(`window.printData = ${JSON.stringify(printData)};`).then(() => {
        printWindow.webContents.print({ silent: true, printBackground: true }, (success, errorType) => {
          if (!success) {
            console.error('Print failed:', errorType);
          }
          printWindow.close();
        });
      });
    });
  });
}

module.exports = {
  mainWindowIpcStart
}