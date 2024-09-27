const path = require('path')
const fs = require('fs');
const os = require('os');
const { app } = require('electron');
const _logger = require('./logger')
const logger = _logger.scope('utils')

/**
 * 获取extraResources path
 */
const getExtraPath = (filePath = '') => {
  let extraPath = ''
  if (app.isPackaged) {
    extraPath = path.join(process.cwd(), 'resources/extra/', filePath)
  } else {
    extraPath = path.join(__dirname, '../../../extra/', filePath)
  }
  return extraPath
}

/**
 * 读取配置文件
 */
const getSettingData = () => {
  const settingPath = getExtraPath('setting.json')
  try {
    const data = fs.readFileSync(settingPath);
    return JSON.parse(data);
  } catch (err) {
    logger.error('readSettingFile fail:', err);
  }
  return {}
}

/**
 * 写入配置文件
 */
const setSettingData = (data) => {
  const settingPath = getExtraPath('setting.json')
  fs.writeFile(settingPath, JSON.stringify(data, null, 2), function(err) {
    if (err) {
      logger.error('writeSettingFile fail:', err)
      return
    }
    logger.info('writeSettingFile success:', settingPath)
  })
}

/**
 * 获取MAC地址
 */
const getMacAddr = () => {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const interfaceInfo of iface) {
      if (!interfaceInfo.internal && interfaceInfo.mac !== '00:00:00:00:00:00') {
        return interfaceInfo.mac;
      }
    }
  }
  return '';
}



module.exports = {
  getExtraPath,
  getSettingData,
  setSettingData,
  getMacAddr,
}
