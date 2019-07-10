const Koa = require('koa')
const router = require('./routes');

const app = new Koa()

// 初始化注入：config,controller
const config = require('./config')
app.config = config

app.use(router.routes()).use(router.allowedMethods())
app.listen(3000, () => {
  console.dir('starting at port 3000...=====================================' + new Date())
})
