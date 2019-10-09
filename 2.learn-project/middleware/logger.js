const path = require('path');
const koaLogger = require('koa-logger')
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
      filename: path.resolve(__dirname, '../log/test') + '/web/',
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
  const info = koaLogger((str, args) =>{
    return str
  })
  console.log(info)
  // const logger = log4js.getLogger('test20191007').info(info)
  logger.level = 'debug'
  console.log('logger.js-----')
  logger.debug();
  // logger.debug('Got cheese.');
  // logger.info('Cheese is Comté.');
  // logger.warn('Cheese is quite smelly.');
  // logger.error('Cheese is too ripe!');
  // logger.fatal('Cheese was breeding ground for listeria.');

  // log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' })
  // log4js.connectLogger(log4js.getLogger('test20191007'), { level: 'debug', format: ':method :url :status' })

  console.log('logger.js-----end')
  next()
}

// 分类：https://www.cnblogs.com/xiaosongJiang/p/11005491.html
// https://juejin.im/post/5b7d0e20f265da43231f00d4
