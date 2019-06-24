const Koa = require('koa')
const KoaRouter = require('koa-router')

const app = new Koa()
const router = new KoaRouter({
  prefix: '/v1'
})

// 初始化注入：config,controller
const config = require('./config')
app.config = config

router.get('/', (ctx, next) => {
  ctx.body = 'index'
})
router.get('/list', (ctx, next) => {
  ctx.response.type = 'json'
  ctx.response.body = { type: 'list' }
})
router.get('/detail', (ctx, next) => {
  ctx.response.type = 'json'
  ctx.response.body = {
    title: 'Tommy Pham',
    tags: ['news', 'sports'],
    article: 'Tommy Pham thinks a new stadium or even relocation might be needed to draw more fans to the Rays games.'
  }
})

app.use(router.routes()).use(router.allowedMethods())
app.listen(3000, () => {
  console.log('starting at port 3000...')
})
