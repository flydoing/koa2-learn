const DatabaseUser = require('../database/platform/user')
const Base = require('./base')
class UserController extends Base {
  static async login(ctx) {
    let requestBody = ctx.request.body
    // 校验数据
    if (requestBody && !requestBody.accountMobile ) {
      return ctx.success({ code: 201, msg: '手机号码不能为空!' })
      
    } else if  (requestBody && !requestBody.password ) {
      return ctx.success({ code: 201, msg: '密码不能为空!' })
    }
    // 入库信息: 检测是否有重复账号；
    const FindUserByAccountMobile = await DatabaseUser.FindUserByAccountMobile(requestBody.accountMobile)
    if (FindUserByAccountMobile) {
      if (FindUserByAccountMobile.password === requestBody.password) {
        return ctx.success({ code: 200, msg: '登录成功!' })
      } else {
        return ctx.success({ code: 201, msg: '密码错误!' })
      }
    }
  }
  static async register(ctx) {
    // app.js: 
    // const bodyParser = require('koa-bodyparser') 
    // app.use(bodyParser())
    let requestBody = ctx.request.body
    // 校验数据
    if (requestBody && !requestBody.accountMobile ) {
      return ctx.success({ code: 201, msg: '手机号码不能为空!' })
      
    } else if  (requestBody && !requestBody.password ) {
      return ctx.success({ code: 201, msg: '密码不能为空!' })
    }
    // 入库信息: 检测是否有重复账号；
    const FindUserByAccountMobile = await DatabaseUser.FindUserByAccountMobile(requestBody.accountMobile)
    if (FindUserByAccountMobile) {
      return ctx.success({ code: 201, msg: `该账号已存在: ${FindUserByAccountMobile.accountMobile}` })
    }
    // 数据库字段是否符合规则；入库成功 
    const register =  DatabaseUser.register(requestBody.accountMobile, requestBody.password)
    if (!register) {
      return ctx.success({ code: 201, msg: '注册失败!' })
    }
    return ctx.success({ code: 200, msg: '注册成功!', data: {} })
  }
}

// module.exports = new Controller('guojc online')
// export default Controller
module.exports = UserController
