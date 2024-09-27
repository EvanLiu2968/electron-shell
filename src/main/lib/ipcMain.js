const { app, ipcMain } = require('electron');

const { getSettingData, setSettingData, getMacAddr } = require('./utils')
const { openPrintWindow, startPrint } = require('./print')

const mainWindowIpcStart = function (win) {

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
  })

  // 获取配置
  ipcMain.handle("getSetting", function (e, data) {
    return getSettingData();
  })

  // 设置串口
  ipcMain.handle("setPort", function (e, portPath) {
    const setting = getSettingData();
    setting.portPath = portPath
    setSettingData(setting)
    // 重启应用
    app.relaunch()
    app.exit(0)
  })

  // 获取MAC地址
  ipcMain.handle("getMacAddr", function (e, data) {
    return getMacAddr();
  })

  // 获取系统打印机详情
  ipcMain.handle("getPrinters", async (event) => {
    return await event.sender.getPrintersAsync();
  });
  // 创建打印界面
  ipcMain.handle("openPrintWindow", (e, url) => {
    openPrintWindow(url)
  });
  // 开始打印
  ipcMain.on("startPrint", (e) => {
    startPrint()
  });
}

module.exports = {
  mainWindowIpcStart
}