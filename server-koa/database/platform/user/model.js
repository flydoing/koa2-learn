const mongoose = require('mongoose')
const Schema = mongoose.Schema

/*
用户模块：
/user/register              // 注册
/user/login                 // 登录
/user/password              // 修改密码,重置密码：post参数区分
/user                       // 获取用户信息：用户信息用户等级，关联的点赞、评论、发表的文章等
/user/articles              // 获取用户信息

not exist, create
注册create，登录改密update
*/

const userSchema = new Schema({
  accountMobile: { 
    type: String,
    required: true,
    minlength: 11,
    maxlength: 11
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 6
  },
  // 个人设置页修改
  nickname: {
    type: String,
    minlength: 6,
    maxlength: 20,
    default: '用户-默认昵称'
  },
  level: { type:String, default: 1 }, // 12345678
  registerTime: { type:Date, default: Date.now },
  modifyTime: { type:Date, default: Date.now },
  loginTime: { type:Date, default: Date.now },
})
module.exports = mongoose.model('userModel', userSchema)

/*
字段定义规则限制：文档验证
https://zhuanlan.zhihu.com/p/40122939
文档验证:
https://juejin.im/entry/5a0596c5f265da43163c89e4
*/
