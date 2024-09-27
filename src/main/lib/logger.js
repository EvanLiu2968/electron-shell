const path = require('path')
const logger = require('electron-log')

logger.transports.file.resolvePathFn = () => path.join(process.cwd(), 'logs/main.log');

module.exports = logger
