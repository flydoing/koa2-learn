const KoaRouter = require('koa-router')
const router = new KoaRouter({
  prefix: '/v2'
})

router.get('/', (ctx, next) => {
	ctx.body = 'index'
})
router.get('/list', (ctx, next) => {
	ctx.response.type = 'json'
	ctx.response.body = { type: 'list' }
})
router.get('/detail', (ctx, next) => {
	ctx.response.status = 200
	ctx.response.type = 'json'
	ctx.response.body = {
		title: 'Tommy Pham v111111',
		tags: ['news', 'sports'],
		article: 'Tommy Pham thinks a new stadium or even relocation might be needed to draw more fans to the Rays games.'
	}
	// console.log(ctx)
})
module.exports = router