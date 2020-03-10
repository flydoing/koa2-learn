const mongoose = require('mongoose')
const { loggerErrorTextLog } = require('../middleware/logger')
class Database {
  static async initConnect() {
    // const mongoose = require('mongoose')
    mongoose.connect('mongodb://127.0.0.1:27017/koa2_learn', { useNewUrlParser: true, useUnifiedTopology: true })
    const database = mongoose.connection
    database.on('error', function(error){
      console.log('11数据库test_nodeVue连接失败：' + error)
      loggerErrorTextLog(error)
      return
    })
    database.once('open', function(){
      console.log('11数据库test_nodeVue连接成功')
      // callback()
    })
  }
}
module.exports = Database
