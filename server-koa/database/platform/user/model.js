const mongoose = require('mongoose')
const Schema = mongoose.Schema

const accessSchema = new Schema({
  // date: { type: Date, default: new Date() }, // 8小时差别
  date: { type: Date, default: Date() },
  client:  String,
  responseTime: Number,
  response: String,
  responseBody: String
})
module.exports.accessModel = mongoose.model('accessModel', accessSchema)

const errorSchema = new Schema({
  // date: { type: Date, default: new Date() }, // 8小时差别
  date: { type: Date, default: Date() },
  client:  String,
  error: String
})
module.exports.errorModel = mongoose.model('errorModel', errorSchema)

/*
用户模块：
/user/register              // 注册
/user/login                 // 登录
/user/password              // 修改密码,重置密码：post参数区分
/user                       // 获取用户信息：用户信息用户等级，关联的点赞、评论、发表的文章等
/user/articles              // 获取用户信息
*/
const registerSchema = new Schema({
  account: { type:Number, default: 0 }, // 默认值，长度等
  nickname: { type:String, default: '' },
  password: { type:String, default: '' },
  registerTime: { type:Date, default: Date.now },
  modifyPasswordTime: { type:Date, default: Date.now },
  level: { type:String, default: '' },
})
module.exports.registerModel = mongoose.model('registerModel', registerSchema)

/*
字段定义规则限制：文档验证
https://zhuanlan.zhihu.com/p/40122939
文档验证:
https://juejin.im/entry/5a0596c5f265da43163c89e4



*/
