const Koa = require('koa')
const route = require('koa-route')
const app = new Koa()

// 静态资源
const path = require('path')
const static = require('koa-static')

// template资源
const fs = require('fs')
// 异步操作
const fsPromised = require('fs.promised')

// 静态资源目录对于相对入口文件index.js的路径
const staticPath = './static'
app.use(static(path.join( __dirname,  staticPath)))
// 即可访问静态文件：
// http://localhost:3000/index.js

const main = ctx => {
  // ctx.response.body = 'Hello World'
  console.dir('ctx==>:')
  console.dir(ctx.request.href)
  ctx.response.type = 'html'
  ctx.response.body = '首页222 <a href="/about">About Page</a>'
}

const about = ctx => {
  ctx.response.type = 'html'
  ctx.response.body = '关于 <a href="/">Index Page</a>'
}

const template = ctx => {
  ctx.response.type = 'html'
  ctx.response.body = fs.createReadStream('./template/text.html')
}

const asyncReadFile = async function (ctx, next) {
// const asyncReadFile = ctx => {
  ctx.response.type = 'html'
  ctx.response.body = await fsPromised.readFile('./template/text.html', 'utf8')
}

// 重定向
const redirect = ctx => {
  console.dir('redirect')
  ctx.response.redirect('/redirectLogin')
}
const redirectLogin = ctx => {
  console.dir('redirectLogin')
  ctx.response.type = 'html'
  ctx.response.body = '<a>redirect => redirectLogin</a>';
}

app.use(route.get('/', main))
app.use(route.get('/about', about))
app.use(route.get('/template', template))
app.use(route.get('/asyncReadFile', asyncReadFile))
app.use(route.get('/redirect', redirect))
app.use(route.get('/redirectLogin', redirectLogin))
app.listen(3000, () => {
  console.dir('starting at port 3000...')
})
