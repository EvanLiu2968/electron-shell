const { SerialPort } = require("serialport");
const { ByteLengthParser } = require("@serialport/parser-byte-length");

(async () => {
  try {
    let ports = await SerialPort.list();
    console.log("串口列表", ports); // 打印串口列表
  } catch (error) {
    console.log(error);
  }
})();

const port = new SerialPort({
  path: "COM2",
  baudRate: 9600,
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
    // console.log('源数据：', str)
    if (/\w+\s*-*\d+\.\d+\w+/g.test(str)) {
      // console.log('匹配数据：', str)
      weightData.data = str
      weightData.error = null
      // 测试重量变化使用
      if (oldData !== str) {
        oldData = str
        console.log('获取重量成功：', getWeight());
      }
    }
  } catch (error) {
    console.log("重量获取失败！", error);
    weightData.error = error.toString()
  }
});

const open = () => {
  port.open(function (err) {
    if (err) {
      console.log("端口打开失败！", err);
      weightData.error = err.toString();
      return;
    }
    console.log("串口打开成功！");
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
