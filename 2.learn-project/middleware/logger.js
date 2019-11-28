const path = require('path');
const log4js = require('log4js')
const fs = require('fs')
const Database = require('../database')

// 日志文件目录是否存在，否则新建
const loggerTypeDir = ['access', 'error']
loggerTypeDir.map(dir => {
  if (!fs.existsSync(`log/${dir}`)) {
    fs.mkdirSync(`log/${dir}`)
  }
})

// log4js.configure
log4js.configure({
  appenders: {
    access: {
      type: 'dateFile', // 默认console,file,datefile等
      filename: path.resolve(__dirname, '../log/access') + '/web/',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true
    },
    error: {
      type: 'dateFile', // 默认console,file,datefile等
      filename: path.resolve(__dirname, '../log/error') + '/web/',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true
    },
  },
  categories: {
    default: {
      appenders: ['access'],
      level: 'info'
    },
    access: { appenders: ['access'], level: 'info' },
    error: { appenders: ['error'], level: 'error' }
  }
})

const getClient = (ctx) => {
  const {method, url, host, headers} = ctx.request
  let client = {
    method,
    url,
    host,
    referer: headers['referer'],
    userAgent: headers['user-agent']
  }
  client = JSON.stringify(client)
  return client
}

// 1、分类：logger type
module.exports.loggerAccess = async (ctx, next) => {
  // 开始时间
  const start = Date.now()
  const loggerAccess = log4js.getLogger('access')
  let client = getClient(ctx)
  await next()
  // 检测响应时间
  const responseTime = Date.now() - start
  // 请求
  loggerAccess.info(`${responseTime / 1000} --> request: ${client}`)
  // 响应
  let response = ctx.response
  response = JSON.stringify(response)
  loggerAccess.info(`${responseTime / 1000} <-- response: ${response}`)
  // 响应body
  let body = ctx.response.body
  body = JSON.stringify(body)
  loggerAccess.info(`${responseTime / 1000} <-- response body: ${body}`)
  // 入库
  // insertLogAccess(client, responseTime, response, responseBody)
  Database.insertLogAccess(`--> request: ${client}`, responseTime, response, body)
}
module.exports.loggerError = async (err, ctx) => {
  const loggerError = log4js.getLogger('error')
  let client = getClient(ctx)
  loggerError.error(`--> request: ${client}`)
  loggerError.error(err)
  // 入库
  Database.insertLogError(`--> request: ${client}`, err)
}

// 分类：https://www.cnblogs.com/xiaosongJiang/p/11005491.html
// https://juejin.im/post/5b7d0e20f265da43231f00d4
