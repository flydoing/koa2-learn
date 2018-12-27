const Koa = require('koa')
const KoaRouter = require('koa-router')

const app = new Koa()
const router = new KoaRouter({
    prefix:'/v1'
})

// 初始化注入：config,controller

router.get('/', (ctx, next) => {
    ctx.body = 'index'
})
router.get('/list', (ctx, next) => {
    ctx.response.type = 'json'
    ctx.response.body = { type: 'list' }
})

app.use(router.routes())
    .use(router.allowedMethods())
app.listen(3000, () => {
    console.log('starting at port 3000...')
})