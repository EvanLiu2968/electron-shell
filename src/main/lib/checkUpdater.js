const { app, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
const _logger = require('./logger')
const logger = _logger.scope('autoUpdater')


const checkUpdate = function (mainWindow) {
  if (!app.isPackaged) {
    return
  }

  autoUpdater.setFeedURL("http://localhost:3000/"); //设置要检测更新url

  // autoUpdater.forceDevUpdateConfig = true;

  //检测更新
  autoUpdater.checkForUpdates();

  //监听'error'事件
  autoUpdater.on("error", (err) => {
    logger.error("error:", err);
  });

  //监听'update-available'事件，发现有新版本时触发
  autoUpdater.on("update-available", () => {
    logger.info("update-available:", "found new version");
  });

  //默认会自动下载新版本，如果不想自动下载，设置autoUpdater.autoDownload = false
  autoUpdater.on("download-progress", (progressObj) => {
    // 弹框
    logger.info("download-progress:", `Download speed: ${progressObj.bytesPerSecond}`); // 下载速度
    logger.info("download-progress:", `Downloaded ${progressObj.percent}%`); // 下载进度
    logger.info("download-progress:", `Transferred ${progressObj.transferred}/${progressObj.total}`); // 已下载大小/总大小
  });

  // 监听'update-downloaded'事件，新版本下载完成时触发
  autoUpdater.on("update-downloaded", () => {
    dialog
      .showMessageBox({
        type: "info",
        title: "应用更新",
        message: "新版本下载完成，请重新安装以更新应用！",
        buttons: ["确定"],
      })
      .then((buttonIndex) => {
        if (buttonIndex.response == 0) {
          //选择是，则退出程序，安装新版本
          autoUpdater.quitAndInstall();
          app.quit();
        }
      });
  });
}

module.exports = {
  checkUpdate
}