const Koa = require('koa')
const app = new Koa

const main = ctx => {
  // ctx.response.type = 'json'
  // ctx.response.body = ctx.request
  ctx.response.type = 'html'
  ctx.response.body = '<p style="color: red;">段落啊啊啊啊</p>'
}
app.use(main)

app.listen(3000)
