const Model = require('./model')
class Database {
  static async insertLogError(client, err) {
    console.log('insertLogError================')
    Model.errorModel.create(
      [
        {
          client: client,
          // error: err
          error: err.stack
        }
      ]
    )
  }
  static async insertLogAccess(client, responseTime, response, responseBody) {
    console.log('insertLogAccess================')
    Model.accessModel.create(
      [
        {
          client: client,
          responseTime: responseTime,
          response: response,
          responseBody: responseBody
        }
      ]
    )
  }
}
module.exports = Database
