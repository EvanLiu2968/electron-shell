const { BrowserWindow } = require('electron');

const _logger = require('./logger');
const logger = _logger.scope('print')

let printWindow = null

const openPrintWindow = (url) => {
  if (!printWindow) {
    // 创建一个新的窗口用于加载打印模板
    printWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        webSecurity: false,
        nodeIntegration: true,
        contextIsolation: false,
        webviewTag: true
      },
    });
  }

  logger.info('start load print url:', url)
  printWindow.loadURL(url)
  // printWindow.on('ready-to-show', () => { printWindow.show() })
}

const startPrint = () => {
  if (!printWindow || !printWindow.webContents) return
  logger.info('start printing...')
  printWindow.webContents.print({
    silent: true,
    printBackground: true,
    margins: { marginType: 'none' }
  }, (success, errorType) => {
    if (!success) {
      logger.error('Print failed:', errorType);
    }
    if (success) {
      logger.info('Print finished!');
    }
    printWindow.close();
    printWindow = null
  });
}

module.exports = {
  openPrintWindow,
  startPrint,
}
