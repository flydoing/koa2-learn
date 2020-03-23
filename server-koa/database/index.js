const mongoose = require('mongoose')
const { loggerErrorTextLog } = require('../middleware/logger')
class Database {
  static async initConnect() {
    mongoose.connect('mongodb://127.0.0.1:27017/koa2_learn', { useNewUrlParser: true, useUnifiedTopology: true })
    const database = mongoose.connection
    database.on('error', function(error){
      console.log('数据库koa2_learn连接失败：' + error)
      loggerErrorTextLog(error)
      return
    })
    database.once('open', function(){
      console.log('数据库koa2_learn连接成功')
      // callback()
    })
  }
}
module.exports = Database
