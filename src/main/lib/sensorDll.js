const koffi = require('koffi')
const path = require('path')

// const dllPath = path.join(Ps.getExtraResourcesDir(), "dll", 'SensorDll.dll')
let dllPath = path.join(__dirname, '../../../build/extraResources/dll/SensorDll.dll')
if (!(process.env.NODE_ENV === 'development')) {
  dllPath = path.join(process.cwd(), 'resources/build/extraResources/dll/SensorDll.dll')
}
console.log(dllPath)
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
  console.log('串口已打开')
} catch (error) {
  errorLog = error.toString()
  console.log(error)
}

module.exports = {
  sensorDll: {
    open,
    close,
    getWeight,
  }
}
