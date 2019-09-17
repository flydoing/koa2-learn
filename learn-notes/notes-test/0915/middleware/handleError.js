module.exports = async (ctx, next) => {
  console.dir('>>>>>>>>>>>>>>>>>>>>> request from: ' + ctx.href + ' | ' + new Date())
  try {
    await next()
    const status = ctx.status || 404
    if (status === 404) {
      ctx.throw(404)
    }
  } catch (err) {
    console.dir('!!!===================>>> err : ')
    console.dir(err)
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
