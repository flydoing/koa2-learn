const articlesModel = require('./model')
class Database {
  static async create(data) {
    // const create =  await articlesModel.create(
    //   [
    //     {
    //       ...data
    //       // accountMobile: accountMobile,
    //       // password: password
    //     }
    //   ]
    // ).then(res => {
    //   console.log('res then ----------')
    //   return res
    // }).catch(error => {
    //   console.log('error then ----------')
    //   return error
    // })
    // return create
    await articlesModel.create(
      [
        {
          ...data
          // accountMobile: accountMobile,
          // password: password
        }
      ], function(err, data) {
        if (err) {
          console.log('err===')
          console.log(err)
          return err
        } else {
          console.log('data===')
          console.log(data)
          return data
        }
      }
    )
  }
  // 检查账号是否已存在
  static async FindArticleByTitle(title) {
    const FindArticleByTitle = await articlesModel.findOne({ title: title }, { title: 1 })
    return FindArticleByTitle
  }
}
module.exports = Database

// https://itbilu.com/nodejs/npm/rkgfwg5C7.html  错误验证
