const mongoose = require('mongoose')
const Schema = mongoose.Schema

/*
文章模块：
/articles                               // 文章列表
/articles?page=1&offset=10&limit=10     // 文章列表条件筛选
/articles/articleID                     // 文章详情
/articles/articleID/comments            // 文章评论
/articles/userID?page=1&offset=10&limit=10            // 文章评论
/articles/recommend                     // 相似文章推荐

author,times,status
title,content,
tags,category,collect,like,comment

title
category
modality      原创，转载
originalLink  原文链接
content       

？ 
praise: { num: Number, user: Array },   // 点赞 num为点赞数量，user为点赞的用户id
*/

const articlesSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  cover: { type: String, default:null },        // 封面
  status: { type: String, default:null },       // 已发布，未发布
  collected: { type: String, default:null },    // 被收藏
  level: { type: Number, default: 0 },          // 热门，推荐
  review: { type: Number, default: 0 },         // 浏览
  praise: { num: Number, user: Array },         // 点赞 num为点赞数量，user为点赞的用户id
  createTime: { type:Date, default: Date.now },
  updateTime: { type:Date, default: Date.now },
  // author: {type: Schema.Types.ObjectId, ref:'User' },
  // categoryId: { type: Schema.Types.ObjectId, required: true },
  // comments: [{ type: Schema.Types.ObjectId, ref:'Comment'}],
})
module.exports = mongoose.model('articlesModel', articlesSchema)

// https://github.com/sessionboy/sinn-server/blob/master/rest/controllers/frontend/article.js

/*
字段定义规则限制：文档验证
https://zhuanlan.zhihu.com/p/40122939
文档验证:
https://juejin.im/entry/5a0596c5f265da43163c89e4
*/
