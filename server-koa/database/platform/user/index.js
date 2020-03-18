const Model = require('./model')
class Database {
  static async registerSchema(accountMobile, password) {
    console.log('registerSchema================')
    Model.registerModel.create(
      [
        {
          accountMobile: accountMobile,
          password: password
        }
      ]
    )
  }
}
module.exports = Database
