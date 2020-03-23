const KoaRouter = require('koa-router')
const Controller = require('../controller/index')
const ControllerUser = require('../controller/user')
// 路由前缀
const router = new KoaRouter({
  prefix: '/v1'
})
// ing: 分块注入

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
// 跑通:方法需要互相调用
router.get('/article2', (ctx, next) => { return Controller.article2(ctx, next) })
// 静态方法直接写么：单一方法时随时可用，单一方法调用静态方法也行:class名称；单一方法调用继承的静态共用方法：
router.get('/article3', Controller.article3)
// new
router.get('/index', Controller.index)
// try {
// 	router.get('/index', Controller.index)
// } catch (error) {
// 	console.log('route catch ===')
// }

// user模块
// router.post('/user/register', ControllerUser.register)
router.post('/user/register', (ctx, next) => { return ControllerUser.register(ctx, next) })
router.post('/user/login', (ctx, next) => { return ControllerUser.login(ctx, next) })

module.exports = router