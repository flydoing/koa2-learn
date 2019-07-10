const KoaRouter = require('koa-router')
const Controller = require('../controller/index')
// const article = require('../app_class')
// const Controller = new (require('../controller/index'))()
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
	next()
})
// controller
// async function article(ctx) {
//   ctx.response.status = 200
// 	ctx.response.type = 'json'
// 	ctx.response.body = {
// 		title: 'article',
// 		tags: ['news', 'sports'],
// 		article: 'Tommy Pham thinks a new stadium or even relocation might be needed to draw more fans to the Rays games.'
//   }
//   return ctx
// }
// console.dir(Controller.article)
// router.get('/article', Controller.article)
// const Controller2 = new Controller()
// router.get('/article2', (ctx, next) => {
// 	ctx.response.type = 'json'
// 	ctx.response.body = { type: 'article2' }
// })
// router.get('/article2', Controller.article2) // 有（），ctx 穿不进去；无（），this.comsuccess的thisundefine
// article.artitle3()
// router.get('/article2', article.artitle3) // 有（），ctx 穿不进去；无（），this.comsuccess的thisundefine
// router.get('/article2', (ctx, next) => { article.artitle3() }) // 有（），ctx 穿不进去；无（），this.comsuccess的thisundefine
router.get('/article2', (ctx, next) => { return Controller.article2(ctx, next) })
module.exports = router