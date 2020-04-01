const articlesModel = require('./model')
class Database {
  static async create(data) {
    const register = await articlesModel.create(
      [
        {
          ...data
          // accountMobile: accountMobile,
          // password: password
        }
      ]
    )
    return register
  }
  // 检查账号是否已存在
  static async FindArticleByTitle(title) {
    const FindArticleByTitle = await articlesModel.findOne({ title: title }, { title: 1 })
    return FindArticleByTitle
  }
}
module.exports = Database
