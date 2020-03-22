const DatabaseUser = require('../database/platform/user')
const Base = require('./base')
class Controller extends Base {
  static async register(ctx) {
    // app.js: 
    // const bodyParser = require('koa-bodyparser') 
    // app.use(bodyParser())
    let requestBody = ctx.request.body
    let code = 101
    let msg = 'msg'
    let data = {}
    // 校验数据
    if (requestBody && !requestBody.accountMobile ) {
      return ctx.error({ msg: '手机号码不能为空!' })
      
    } else if  (requestBody && !requestBody.password ) {
      return ctx.error({ msg: '密码不能为空!' })
    }
    // 入库信息: 检测是否有重复账号；
    const FindUserByAccountMobile = await DatabaseUser.FindUserByAccountMobile(requestBody.accountMobile)
    console.log(FindUserByAccountMobile)
    if (FindUserByAccountMobile) {
      return ctx.error({ msg: '该用户已经存在!' })
    }
    // 数据库字段是否符合规则；入库成功 
    const registerSchema =  DatabaseUser.registerSchema(requestBody.accountMobile, requestBody.password)
    if (!registerSchema) {
      return ctx.error({ msg: '注册失败!' })
    }
    return ctx.success({ code: 200, msg: '注册成功!', data: {} })
    // console.log('dataRes')
    // console.log(dataRes) // undefined
    // 返回成功错误
    // return ctx.success({ code: 200, msg: '用户名或密码不能为空!', data: {} })
    // let res = await this.successRes(ctx, code, msg, data)
    // return res
    
    // const data = {
    //   title: 'register',
    //   tags: ['register', 'register'],
    //   article: 'index index index index index index index index'
    // }
    // super.success(ctx, data, 'success register') // 调用继承方法：super
  }
}

// let con = new Controller('guojc')
// con.article2()

// module.exports = new Controller('guojc online')
// export default Controller
module.exports = Controller
// module.exports = con
