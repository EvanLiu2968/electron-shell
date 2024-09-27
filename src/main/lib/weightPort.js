const { SerialPort } = require("serialport");
const { ByteLengthParser } = require("@serialport/parser-byte-length");

const { getSettingData, setSettingData } = require('./utils')
const _logger = require('./logger')
const logger = _logger.scope('weightPort')

let setting = getSettingData()

SerialPort.list().then(ports => {
  setting.portList = ports
  setSettingData(setting)
  logger.info("串口列表", ports); // 打印串口列表
}).catch(error => {
  logger.error(error);
})

const port = new SerialPort({
  path: setting.portPath || "COM2",
  baudRate: setting.baudRate || 9600,
  autoOpen: false,
});
const parser = port.pipe(new ByteLengthParser({ length: 16 }));

const weightData = {
  data: '',
  error: null
}
let oldData = ''
parser.on("data", (data) => {
  try {
    const str = data.toString().replace(/[\x00-\x1F\x7F-\x9F]/g, '');
    // logger.info('源数据：', str)
    if (/\w+\s*-*\d+\.\d+\w+/g.test(str)) {
      // logger.info('匹配数据：', str)
      weightData.data = str
      weightData.error = null
      // 测试重量变化使用
      if (oldData !== str) {
        oldData = str
        logger.info('获取重量成功：', getWeight());
      }
    }
  } catch (error) {
    logger.error("重量获取失败！", error);
    weightData.error = error.toString()
  }
});

const open = () => {
  port.open(function (err) {
    if (err) {
      logger.error("端口打开失败！", err);
      weightData.error = err.toString();
      return;
    }
    logger.info("串口打开成功！");
  });
};
const close = () => {
  port.close();
};
const getWeight = () => {
  return JSON.stringify(weightData)
};

open()

module.exports = {
  weightPort: {
    open,
    close,
    getWeight,
  },
};
