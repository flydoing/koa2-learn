const path = require('path');
const log4js = require('log4js')

// 2、log4js.configure: https://github.com/log4js-node/log4js-node
log4js.configure({
  appenders: {
    test20191007: {
      // type: 'file', // 默认console,file,datefile等
      // filename: path.resolve(__dirname, '../log') + 'test20191007.log',
      // alwaysIncludePattern: true
      type: 'dateFile', // 默认console,file,datefile等
      // filename: path.resolve(__dirname, '../log') + '/log/',
      filename: path.resolve(__dirname, '../log'),
      // filename: '/log/',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true
    }
  },
  categories: {
    default: {
      appenders: ['test20191007'],
      level: 'info'
    }
  }
})
// 1、分类：logger type
const logger = log4js.getLogger('test20191007')

module.exports = (ctx, next) => {
  logger.level = 'debug'
  // logger.debug('Some debug messages')
  console.log('logger.js-----')
  // const log4js = require('log4js');
  // log4js.configure({
  //   appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
  //   categories: { default: { appenders: ['cheese'], level: 'all' } }
  // });
  
  // const logger = log4js.getLogger('cheese');
  // const logger = log4js.getLogger();
  // logger.trace('Entering cheese testing');
  logger.debug('Got cheese.');
  logger.info('Cheese is Comté.');
  logger.warn('Cheese is quite smelly.');
  logger.error('Cheese is too ripe!');
  logger.fatal('Cheese was breeding ground for listeria.');
  next()
}
