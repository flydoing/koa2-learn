const Koa = require('koa')
const config = require('./config')
const router = require('./routes')
const handleError = require('./middleware/handleError')

const app = new Koa()
// 配置：config
app.config = config
// 中间件：middleware
app.use(handleError)
// 路由：router
app.use(router.routes()).use(router.allowedMethods())
app.listen(3000, () => {
  console.dir('>>>>>>>>>>>>>>>>>>>>> starting at port 3000...' + app.config.version + ' | ' + new Date())
})
