const Base = require('./base')
class Controller extends Base {
  constructor (name) {
    super(name)
  }
  async register(ctx) {
    // app.js: 
    // const bodyParser = require('koa-bodyparser') 
    // app.use(bodyParser())
    let requestBody = ctx.request.body
    console.log(requestBody)
    let code = 101
    let msg = 'msg'
    let data = {}
    // 校验数据
    if (requestBody && (!requestBody.accountMobile || requestBody.accountMobile.length > 11) ) {
      code = 101
      msg = '手机号码格式不对'
    } else if  (requestBody && (!requestBody.password || requestBody.password.length > 12) ) {
      code = 101
      msg = '密码号码格式不对'
    } else {
      code = 200
      msg = '注册成功'
    }
    // 入库信息: 检测是否有重复账号；数据库字段是否符合规则；入库成功 
    // 返回成功错误
    let res = await this.successRes(ctx, code, msg, data)
    return res
    
    // const data = {
    //   title: 'register',
    //   tags: ['register', 'register'],
    //   article: 'index index index index index index index index'
    // }
    // super.success(ctx, data, 'success register') // 调用继承方法：super
  }
  async index(ctx) {
    // 处理好数据，交给公共方法
    const data = {
      title: 'index',
      tags: ['index1', 'index2'],
      article: 'index index index index index index index index'
    }
    let bbbbbbbb = {}
    console.log(bbbbbbbb.aaaaa.length)
    // try {
    //   console.log(aaaaa)
    // } catch (error) {
    //   console.log('error start---------------')
    //   console.log(error)
    //   console.log('error end---------------')
    // }
    
    Controller.index1(ctx) // 调用同级方法：静态化，class名字调用
    super.success(ctx, data, 'success index') // 调用继承方法：super
  }
  static async index1(ctx) {
    console.log('async index(ctx), static async index1(ctx) ' + ctx.url)
  }
  static commonSuccess (ctx, data, msg) {
  // commonSuccess (data, msg) {
    ctx.body = {
      status: 200,
      msg: msg || 'success',
      data: data || {}
    }
    return ctx
  }
  // controller
  static article(ctx) {
    ctx.response.status = 200
    ctx.response.type = 'json'
    ctx.response.body = {
      title: 'ctx article',
      tags: ['news', 'sports'],
      article: 'ctx Tommy Pham thinks a new stadium or even relocation might be needed to draw more fans to the Rays games.'
    }
    // return ctx
    const body = {
      title: 'ctx article',
      tags: ['news', 'sports'],
      article: 'ctx Tommy Pham thinks a new stadium or even relocation might be needed to draw more fans to the Rays games.'
    }
    Controller.commonSuccess(ctx, body, 'success article')
    // const ret = {
    //   title: 'controller article',
    //   tags: ['news', 'sports'],
    //   article: 'Tommy Pham thinks a new stadium or even relocation might be needed to draw more fans to the Rays games.'
    // }
    // this.successRes(ret)
  }
  async commonSuccess2(ctx, data, msg) {
    ctx.body = {
      status: 200,
      msg: msg || 'commonSuccess2',
      data: data || {}
    }
    return ctx
  }
  async selfSuccess() {
    console.dir('selfSuccess')
  }
  async article2(ctx, next) {
    // console.dir(ctx)
    // console.log(qqqqq)
    console.log('this: ')
    console.log(this)
    const body = {
      title: '111111111ctx article2',
      tags: ['news', 'sports'],
      article: 'ctx Tommy Pham thinks a new stadium or even relocation might be needed to draw more fans to the Rays games.'
    }
    // this.commonSuccess2(ctx, body, 'success article')
    await this.selfSuccess()
    let res = await this.successRes(ctx, body, 'success article')
    return res
    // console.dir('over')
    // next()
    // await this.successRes(ctx, body, 'success article')
  }
  async article3(ctx, next) {
    console.log(pppppp)
    console.dir('article3')
    // this.article33() // undefined
    Controller.article33()
    // super.article333() // undefined
    Controller.article333() // ok：继承的静态方法
    Base.article333() // 这也ok的
    ctx.response.type = 'json'
	  ctx.response.body = { type: 'article3' }
  }
  static async article33() {
    console.dir('article33')
  }
}

// let con = new Controller('guojc')
// con.article2()

module.exports = new Controller('guojc online')
// module.exports = Controller
// module.exports = con
