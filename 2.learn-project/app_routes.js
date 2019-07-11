const Koa = require('koa')
const router = require('./routes');

const app = new Koa()

// 初始化注入：config,controller
const config = require('./config')
app.config = config

// error middleware
app.use(async(ctx, next) => {
  try {
    await next()
    console.dir('error middleware try')
    // ctx.throw(500) // 测试500
    // console.dir('ctx.throw(404)---1')
    // ctx.throw(404)  // ctx.throw
    // console.dir('ctx.throw(404)---2')
    const status = ctx.status || 404
    if (status === 404) {
        ctx.throw(404)
    }
  } catch (err) {
    console.dir('error middleware catch')
    console.dir(err)
    console.dir(err.status)
    console.dir(ctx.status)
    ctx.status = err.status || 500
    // ctx.throw(404)
    if (ctx.status === 404) {
      //Your 404.jade
      // await ctx.render('404')
      // await ctx.body = '404'
      // ctx.body = '404'
      ctx.body = {
        code: 404,
        msg: '404 not found',
        data: {}
      }
    } else {
      //other_error jade
      // await ctx.render('other_error')
      // ctx.body = 'unknown error'
      ctx.body = {
        code: 500,
        msg: '500 unknown error',
        data: {}
      }
    }
  }
})

app.use(router.routes()).use(router.allowedMethods())
app.listen(3000, () => {
  console.dir('starting at port 3000...=====================================' + app.config.env + new Date())
})
