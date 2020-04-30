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
      return ctx.success({ code: 201, msg: `该标题已存在: ${FindArticleByTitle.title}` })
    }
    // 数据库字段是否符合规则；入库成功 
    const create =  await DatabaseArticles.create(bodyData)
    console.log('create--------->')
    console.log(create)
    // if (create && create.ValidationError) {
    //   return ctx.success({ code: 201, msg: '新建失败:' + create.ValidationError })
    // }
    // return ctx.success({ code: 200, msg: '新建成功!', data: {} })
    if (create) {
      return ctx.success({ code: 200, msg: '新建成功!', data: {} })
    } else {
      return ctx.success({ code: 201, msg: '新建失败:' })
    }
  }
  static async get222(ctx) {
    console.log('ctx.query===========')
    console.log(ctx.request.query)
    console.log(ctx.request.query.id)
    const FindArticleById = await DatabaseArticles.FindArticleById(ctx.request.query.id)
    console.log(FindArticleById)
    if (FindArticleById) {
      return ctx.success({ code: 200, msg: '查询成功!', data: FindArticleById })
    } else {
      return ctx.success({ code: 201, msg: '文章走丢了:' })
    }
  }
  static async get(ctx) {
    console.log('ctx.params===========')
    console.log(ctx.params)
    console.log(ctx.params.id)
    const FindArticleById = await DatabaseArticles.FindArticleById(ctx.params.id)
    console.log(FindArticleById)
    if (FindArticleById) {
      return ctx.success({ code: 200, msg: '查询成功!', data: FindArticleById })
    } else {
      return ctx.success({ code: 201, msg: '文章走丢了:' })
    }
  }
}

// module.exports = new Controller('guojc online')
// export default Controller
module.exports = ArticlesController
