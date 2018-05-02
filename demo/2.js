const Koa = require('koa')
const route = require('koa-route')
const app = new Koa()

// 静态资源
const path = require('path')
const static = require('koa-static')
// 静态资源目录对于相对入口文件index.js的路径
const staticPath = './static'
app.use(static(path.join( __dirname,  staticPath)))
// 即可访问静态文件：
// http://localhost:3000/index.js

const main = ctx => {
  // ctx.response.body = 'Hello World'
  ctx.response.type = 'html'
  ctx.response.body = '首页 <a href="/about">About Page</a>'
}

const about = ctx => {
  ctx.response.type = 'html'
  ctx.response.body = '关于 <a href="/">Index Page</a>'
}

app.use(route.get('/', main))
app.use(route.get('/about', about))

app.listen(3000)
