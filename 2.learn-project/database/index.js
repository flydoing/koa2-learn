class Database {
  static async initConnect() {
    const mongoose = require('mongoose')
    mongoose.connect('mongodb://127.0.0.1:27017/test_nodeVue', { useNewUrlParser: true, useUnifiedTopology: true })
    const database = mongoose.connection
    database.on('error', function(error){
      console.log('11数据库test_nodeVue连接失败：' + error)
      return
    })
    database.once('open', function(){
      console.log('11数据库test_nodeVue连接成功')
      // callback()
    })
  }
  static initConnect1() {
    console.log('initConnect123')
  }
}
module.exports = Database
