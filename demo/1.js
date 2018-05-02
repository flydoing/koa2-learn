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

// channel=A_00：https://itunes.apple.com/cn/app/apple-store/id1355605234?pt=118991301&ct=A_00&mt=8
// channel=A_01：https://itunes.apple.com/cn/app/apple-store/id1355605234?pt=118991301&ct=A_01&mt=8
// channel=A_02：https://itunes.apple.com/cn/app/apple-store/id1355605234?pt=118991301&ct=A_02&mt=8
// channel=A_03：https://itunes.apple.com/cn/app/apple-store/id1355605234?pt=118991301&ct=A_03&mt=8
// channel=A_04：https://itunes.apple.com/cn/app/apple-store/id1355605234?pt=118991301&ct=A_04&mt=8
// channel=A_05：https://itunes.apple.com/cn/app/apple-store/id1355605234?pt=118991301&ct=A_05&mt=8
// channel=A_06：https://itunes.apple.com/cn/app/apple-store/id1355605234?pt=118991301&ct=A_06&mt=8
