```
|--server
    |--config
    |--router
    |--controller
    |--service
    |--middleware
    |--database
    |--utils
    app.js
```

step:
1、index走通，分块注入

2、error中间件

3、log中间件

# server,data端：
开发进度：
log写入文件
log写入数据库

接口分2大块：platform,management,

# client-platform-nuxt:
seo的H5页面，套进小程序
有文章编辑，
有表格导入，
接口规范RESTful

画原型大概：xmind; 详细：原型工具，边做边自由发挥（mockplus）

# client-management-elementUi: 
[https://panjiachen.github.io/vue-element-admin-site/zh/guide/#%E5%8A%9F%E8%83%BD](https://panjiachen.github.io/vue-element-admin-site/zh/guide/#%E5%8A%9F%E8%83%BD)



## 项目启动
### step1: 启动数据库

新建命令窗口， `mongod` （[mongodb基础入门]([mongodb基础入门](http://gjincai.github.io/2017/06/18/mac%E4%B8%8Bmongodb%E7%9A%84%E5%AE%89%E8%A3%85%E4%B8%8E%E9%85%8D%E7%BD%AE/))）

### step2: 操作数据库
新建命令窗口，
查看MongoDB情况 `mongo`，
查看本地现有数据库 `show dbs`，
切换数据库 `use koa2_learn`，

倘若数据库 koa2_learn 在 `show dbs` 时不显示出来,先往里插入点数据：`db.koa2_learn.insert({"name":"guojc-koa2_learn"})`

此时再 `show dbs` 就可以看到 koa2_learn 数据库了

### step3: 启动项目，连接数据库
新建命令窗口，`nodemon app_logger_0915.js`

Database Design
1.article：refer 一游说的管理后台，平台返回：
author,times,status
title,content,
tags,category,collect,like,comment

mongodb design

https://juejin.im/post/5a0e370cf265da430d579392
https://segmentfault.com/a/1190000016937778

接口设计：RESTful:
http://www.ruanyifeng.com/blog/2014/05/restful_api.html
https://www.ruanyifeng.com/blog/2018/10/restful-api-best-practices.html

root:
/api/management/v1/
/api/paltform/v1/

文章模块：
/articles                               // 文章列表
/articles?page=1&offset=10&limit=10     // 文章列表条件筛选
/article                                // post create
/article/articleID                      // get 文章详情
/article/articleID/comments             // 文章评论
/articles/userID?page=1&offset=10&limit=10            // 文章评论
/articles/recommend                     // 相似文章推荐

评论模块：
/comments/articleID/like                // 点赞
/comments/articleID                     // 一级评论，二级评论、回复通过post参数区分

用户模块：
/user/login                 // 登录
/user/register              // 注册
/user/password              // 修改密码,重置密码：post参数区分
/user                       // 获取用户信息：用户信息用户等级，关联的点赞、评论、发表的文章等
/user/articles              // 获取用户信息

搜索模块：
/search?                    // q=%E9%83%AD&type=note&page=1&order_by=commented_at
