const koffi = require('koffi')
const { getExtraPath } = require('./utils')
const _logger = require('./logger')
const logger = _logger.scope('sensorDll')

const dllPath = getExtraPath('SensorDll.dll')
logger.info('sensorDll:', dllPath)

let errorLog = '未知错误'
let open = () => errorLog
let close = () => errorLog
let getWeight = () => errorLog
try {
  const SensorDll = koffi.load(dllPath)

  open = SensorDll.func('__stdcall', '__Open', 'bool', ['str', 'int']);
  close = SensorDll.func('__stdcall', '__Close', 'bool');
  getWeight = SensorDll.func('__stdcall', '__GetWeight', 'str');

  open('COM2', 9600)
  logger.info('sensorDll open success!')
} catch (error) {
  errorLog = error.toString()
  logger.error('sensorDll open fail:', error)
}

module.exports = {
  sensorDll: {
    open,
    close,
    getWeight,
  }
}
