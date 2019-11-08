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
  static async insertLogError(client, err) {
    console.log('insertLogError================')
    // console.log(typeof err)
    // console.log(err.name)
    // console.log('-------------')
    // console.log(err.message)
    // console.log('-------------')
    // console.log(err.stack)
    // console.log('-------------')
    // console.log(err.toString)
    // console.log('-------------')
    // console.log(err)

    // console.log(err.name +' || '+ err.message +' || '+ err.stack)
    console.log(err.stack)
    const mongoose = require('mongoose')
    const Schema = mongoose.Schema
    const errorSchema = new Schema({
      // date: { type: Date, default: new Date() }, // 8小时差别
      date: { type: Date, default: Date() },
      client:  String,
      error: String
    })
    const errorModel = mongoose.model('errorModel', errorSchema)
    errorModel.create(
      [
        {
          client: client,
          // error: err
          error: err.stack
        }
      ]
    )
  }
}
module.exports = Database
