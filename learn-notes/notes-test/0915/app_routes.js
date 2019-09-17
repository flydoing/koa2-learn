const Koa = require('koa')
const koaLogger = require('koa-logger')
const config = require('./config')
const router = require('./routes')
const handleError = require('./middleware/handleError')

// logger
const logger = async (ctx, next) => {
  console.dir(`logger-----------`)
  console.dir(`${new Date()} ${ctx.request.method} ${ctx.request.url}`)
  next()
}
const logger2 = async function(ctx, next) {
  let res = ctx.res
  // 拦截操作请求 request
  console.log(`<-- logger2----------- ${new Date()} ${ctx.method} ${ctx.url}`)
  await next()
  // 拦截操作响应 request
  res.on('finish', () => {
    console.log(`--> logger2----------- ${new Date()} ${ctx.method} ${ctx.url} ${ctx.status}`)
  })
}

const app = new Koa()
// 配置：config
app.config = config
// 中间件：middleware
app.use(logger)
app.use(logger2)
app.use(koaLogger())
app.use(handleError)
// 路由：router
app.use(router.routes()).use(router.allowedMethods())
app.listen(3000, () => {
  console.dir('>>>>>>>>>>>>>>>>>>>>> starting at port 3000...' + app.config.version + ' | ' + new Date())
})
