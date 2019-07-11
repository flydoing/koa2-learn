class Base {
  // constructor (ctx) {
  //   this.ctx = ctx
  // }
  static async staticBase(data) {
    console.dir('staticBase')
  }
  async successRes(data) {
    console.dir('successRes:' + data)
    // const body = {
    //   status: 200,
    //   msg: msg || 'success',
    //   data: data || {}
    // }
    // console.log(body)
  }
}
module.exports = Base
