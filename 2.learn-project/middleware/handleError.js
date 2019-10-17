const { loggerError } = require('./logger')
module.exports = async (ctx, next) => {
  // console.dir(new Date() + '>>> request from: ' + ctx.href)
  try {
    await next()
    const status = ctx.status || 404
    if (status === 404) {
      console.log('ctx.throw(404)')
      ctx.throw(404)
    }
  } catch (err) {
    console.dir('handle 1 ===================>>> err : ')
    console.dir(err)
    console.dir('handle 2 ===================>>> err : ')
    loggerError(err, ctx)
    ctx.status = err.status || 500
    if (ctx.status === 404) {
      ctx.body = {
        code: 404,
        msg: '404 not found',
        data: {}
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '500 unknown error',
        data: {}
      }
    }
  }
}
