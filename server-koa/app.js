const Koa = require('koa')
const config = require('./config')
const router = require('./routes')
// 处理post
const bodyParser = require('koa-bodyparser')
const handleError = require('./middleware/handleError')
const response = require('./middleware/response')
const { loggerAccess } = require('./middleware/logger')
// 数据库连接
const Database = require('./database')
Database.initConnect()

const app = new Koa()
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', 'http://localhost:3000')
  await next()
 })
app.use(bodyParser())
// 配置：config
app.config = config
// 中间件：middleware
// app.use(async (ctx, next) => {
//   try {
//     console.log('await next()1---------------')
//     await next()
//     console.log('await next()2---------------')
//   } catch (error) {
//     console.log('error 1---------------')
//     console.log(error)
//     console.log('error 2---------------')
//   }
// })
app.use(loggerAccess)
app.use(handleError)
app.use(response)
// router.all('*',function (ctx, next) {
//   ctx.set('Access-Control-Allow-Origin', '*')
//   ctx.set('Access-Control-Allow-Headers', 'Content-Type, myheader')
//   ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
//   next()
// })
// 路由：router
app.use(router.routes()).use(router.allowedMethods())
// 请求头设置
const whiteList = ['http://localhost:3000']
app.use(async (ctx, next) => {
  if (ctx.request.header.origin !== ctx.origin && whiteList.includes(ctx.request.header.origin)) {
    console.log(ctx.request.header.origin)
    console.log(ctx.origin)
    ctx.set('Access-Control-Allow-Origin', ctx.request.header.origin)
    ctx.set('Access-Control-Allow-Headers', 'Content-Type')
    ctx.set('Access-Control-Allow-Methods', 'PUT,DELETE,POST,GET')
    ctx.set('Access-Control-Allow-Credentials', true)
    ctx.set('Access-Control-Max-Age', 3600 * 24)
  }
  await next()
})
app.listen(3001, () => {
  console.dir('>>>>>>>>>>>>>>>>>>>>> starting at port 3001...' + app.config.version + ' | ' + new Date())
})
