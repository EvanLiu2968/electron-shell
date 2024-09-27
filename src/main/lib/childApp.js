const fs = require('fs');
// 导入 shell 模块
const { shell } = require('electron');
const { exec } = require('child_process');

const _logger = require('./logger');
const logger = _logger.scope('childApp')

const { getExtraPath } = require('./utils')
const startPath = getExtraPath('software/ndpClient.exe')

const killProcess = (showError = true) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(startPath)) {
      resolve()
      return
    }
    exec('taskkill /IM ndpClient.exe /F', (error, stdout, stderr) => {
      if (error && showError) {
        logger.error(`killClientProcess exec error: ${error}`);
        resolve()
        return;
      }
      if (stdout) {
        logger.info(`killClientProcess run info: ${stdout}`);
      }
      if (stderr && showError) {
        logger.error(`killClientProcess run err: ${stderr}`);
      }
      resolve()
    });
  })
}

const start = async () => {
  if (!fs.existsSync(startPath)) {
    logger.error('文件不存在: ', startPath);
    return
  }
  logger.info('启动后台服务...');
  await killProcess(false)
  shell.openExternal(startPath, (error, stdout, stderr) => {
    if (error) {
      logger.error('执行的错误: ', error);
      return;
    }
    logger.info('stdout: ', stdout);
    if (stderr) {
      logger.error('stderr: ', stderr);
    }
  });
}

const close = () => {
  logger.info('关闭后台服务...');
  return killProcess()
}

module.exports = {
  start,
  close,
};
