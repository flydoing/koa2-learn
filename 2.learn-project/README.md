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

# client-platform-nuxt:
seo的H5页面，套进小程序

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
