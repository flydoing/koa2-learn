
## 项目介绍

```js
|-- koa2-learn
  |--server-koa                    服务端-api接口服务
  |--client-platform-nuxt          前端-用户平台
  |--client-management-elementUi   前端-管理后台
```

## project1: server-koa

### 项目运行
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
新建命令窗口，`nodemon app.js`
接口服务已启动

### 技术栈

>
技术使用:
- [x] koa2
- [x] mongodb
- [x] docker
- [x] RESTful

业务api:
- [x] user: register login
- [x] log: file mongodb
- [x] article: create

### 关键目录

```js
|-- server-koa
    |-- config
    |-- controller
            - articles.js
            - base.js
            - index.js
            - user.js
    |-- database    // 数据库操作
            |-- log
            |-- management
            |-- platform
            - index.js
    |-- log         // 日志文件
    |-- middleware  // 中间件
            - handleError.js
            - logger.js
            - response.js
    |-- node_modules
    |-- routes      // api路由
    |-- service
    |-- utils
    - .eslintrc.js
    - app.js
    - package.json
    - README.md
```
