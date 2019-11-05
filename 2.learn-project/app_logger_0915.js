const Koa = require('koa')
const config = require('./config')
const router = require('./routes')
const handleError = require('./middleware/handleError')
const { loggerAccess } = require('./middleware/logger')
// 数据库连接
const Database = require('./database')
Database.initConnect()

const app = new Koa()
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
// 路由：router
app.use(router.routes()).use(router.allowedMethods())
app.listen(3000, () => {
  console.dir('>>>>>>>>>>>>>>>>>>>>> starting at port 3000...' + app.config.version + ' | ' + new Date())
})
