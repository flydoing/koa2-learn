const Koa = require('koa')
const KoaRouter = require('koa-router')

const app = new Koa()
const router = new KoaRouter({
    prefix:'/v1'
})

router.get('/', (ctx, next) => {
    ctx.body = 'index'
})
router.get('/list', (ctx, next) => {
    ctx.body = 'list'
})

app.use(router.routes())
    .use(router.allowedMethods())
app.listen(3000, () => {
    console.log('starting at port 3000...')
})