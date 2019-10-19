const { loggerError } = require('./logger')
module.exports = async (ctx, next) => {
  console.dir('---> | ' + ctx.href + ' | ' + new Date())
  try {
    await next()
    const status = ctx.status || 404
    if (status === 404) {
      ctx.throw(404)
    }
  } catch (err) {
    console.dir('handleError 1 ===================>>>')
    console.dir(err)
    console.dir('handleError 2 ===================<<<')
    loggerError(err, ctx)
    ctx.status = err.status || 500
    if (ctx.status === 404) {
      ctx.body = {
        code: 404,
        msg: '页面走丢了：404 not found',
        data: {}
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '服务器开小差了：500 unknown error',
        data: {}
      }
    }
  }
}
