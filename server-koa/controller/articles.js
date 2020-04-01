const DatabaseArticles = require('../database/platform/articles')
const Base = require('./base')
class ArticlesController extends Base {
  static async create(ctx) {
    // app.js: 
    // const bodyParser = require('koa-bodyparser') 
    // app.use(bodyParser())
    let requestBody = ctx.request.body
    let bodyData = {}
    console.log(requestBody)
    if (!requestBody) {
      return ctx.success({ code: 201, msg: '参数为空' })
    } else {
      bodyData = requestBody
    }

    // 校验数据
    if (!bodyData.title || !bodyData.content) {
      return ctx.success({ code: 201, msg: 'title content 参数为空' })
    }
    // 入库信息: 检测是否有重复title；
    const FindArticleByTitle = await DatabaseArticles.FindArticleByTitle(bodyData.title)
    if (FindArticleByTitle) {
      return ctx.success({ code: 201, msg: `该文章标题已存在: ${FindArticleByTitle.title}` })
    }
    // 数据库字段是否符合规则；入库成功 
    const create =  DatabaseArticles.create(bodyData)
    if (!create) {
      return ctx.success({ code: 201, msg: '新建文章失败!' })
    }
    return ctx.success({ code: 200, msg: '新建文章成功!', data: {} })
  }
  // static async login(ctx) {
  //   let requestBody = ctx.request.body
  //   // 校验数据
  //   if (requestBody && !requestBody.accountMobile ) {
  //     return ctx.success({ code: 201, msg: '手机号码不能为空!' })
      
  //   } else if  (requestBody && !requestBody.password ) {
  //     return ctx.success({ code: 201, msg: '密码不能为空!' })
  //   }
  //   // 入库信息: 检测是否有重复账号；
  //   const FindUserByAccountMobile = await DatabaseUser.FindUserByAccountMobile(requestBody.accountMobile)
  //   if (FindUserByAccountMobile) {
  //     if (FindUserByAccountMobile.password === requestBody.password) {
  //       return ctx.success({ code: 200, msg: '登录成功!' })
  //     } else {
  //       return ctx.success({ code: 201, msg: '密码错误!' })
  //     }
  //   }
  // }
  // static async register(ctx) {
  //   // app.js: 
  //   // const bodyParser = require('koa-bodyparser') 
  //   // app.use(bodyParser())
  //   let requestBody = ctx.request.body
  //   // 校验数据
  //   if (requestBody && !requestBody.accountMobile ) {
  //     return ctx.success({ code: 201, msg: '手机号码不能为空!' })
      
  //   } else if  (requestBody && !requestBody.password ) {
  //     return ctx.success({ code: 201, msg: '密码不能为空!' })
  //   }
  //   // 入库信息: 检测是否有重复账号；
  //   const FindUserByAccountMobile = await DatabaseUser.FindUserByAccountMobile(requestBody.accountMobile)
  //   if (FindUserByAccountMobile) {
  //     return ctx.success({ code: 201, msg: `该账号已存在: ${FindUserByAccountMobile.accountMobile}` })
  //   }
  //   // 数据库字段是否符合规则；入库成功 
  //   const register =  DatabaseUser.register(requestBody.accountMobile, requestBody.password)
  //   if (!register) {
  //     return ctx.success({ code: 201, msg: '注册失败!' })
  //   }
  //   return ctx.success({ code: 200, msg: '注册成功!', data: {} })
  // }
}

// module.exports = new Controller('guojc online')
// export default Controller
module.exports = ArticlesController
