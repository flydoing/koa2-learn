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
    },
    accessLogger: {
      type: 'dateFile', // 默认console,file,datefile等
      filename: path.resolve(__dirname, '../log/access') + '/web/',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true
    },
    reqLogger: {
      type: 'dateFile', // 默认console,file,datefile等
      filename: path.resolve(__dirname, '../log/req') + '/web/',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true
    },
  },
  categories: {
    default: {
      appenders: ['test20191007'],
      level: 'info'
    },
    accessLogger: { appenders: ['accessLogger'], level: 'info' },
    reqLogger: { appenders: ['reqLogger'], level: 'info' },
  }
})
// 1、分类：logger type
const logger = log4js.getLogger('test20191007')

module.exports.logger = (ctx, next) => {
  // const logger = log4js.getLogger('test20191007').info(info)
  logger.level = 'debug'
  logger.debug('level debug');
  next()
}
module.exports.loggerAccess = (ctx, next) => {
  const loggerAccess = log4js.getLogger('accessLogger')
  loggerAccess.info(ctx.request.url)
  next()
}
module.exports.loggerReq = async (ctx, next) => {
  // const methods = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'mark']
  const start = Date.now()
  const loggerReq = log4js.getLogger('reqLogger')
  const {method, url, host, headers} = ctx.request;
  let client = {
    method,
    url,
    host,
    referer: headers['referer'],
    userAgent: headers['user-agent']
  }
  client = JSON.stringify(client)
  await next()
  // 检测响应时间
  const responseTime = Date.now() - start
  loggerReq.info(`${responseTime / 1000} ${client}`)
  // loggerReq.info(client)
}

// 分类：https://www.cnblogs.com/xiaosongJiang/p/11005491.html
// https://juejin.im/post/5b7d0e20f265da43231f00d4
