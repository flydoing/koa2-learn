const Koa = require('koa')
// const koaLogger = require('koa-logger')
const config = require('./config')
const router = require('./routes')
const handleError = require('./middleware/handleError')
const { logger, loggerAccess, loggerReq, loggerError } = require('./middleware/logger')

const app = new Koa()
// 配置：config
app.config = config
// 中间件：middleware
// app.use(koaLogger())
app.use(async (ctx, next) => {
  try {
    console.log('await next()1---------------')
    await next()
    console.log('await next()2---------------')
  } catch (error) {
    console.log('error 1---------------')
    console.log(error)
    console.log('error 2---------------')
  }
})
app.use(handleError)
// app.use(logger)
// app.use(loggerAccess)
// app.use(loggerReq)
// app.on('error', function (err, ctx) {
//   console.log('errorooooo==================================')
//   console.log(err)
//   loggerError(err, ctx)
// })
// 路由：router
app.use(router.routes()).use(router.allowedMethods())
// app.on('error', (err, ctx) => {
//   console.log('errorooooo')
//   loggerError(err, ctx)
// })
app.listen(3000, () => {
  console.dir('>>>>>>>>>>>>>>>>>>>>> starting at port 3000...' + app.config.version + ' | ' + new Date())
})
