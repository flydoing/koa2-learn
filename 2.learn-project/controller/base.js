class Base {
  // constructor (ctx) {
  //   this.ctx = ctx
  // }
  successRes (data, msg) {
    console.dir('successRes')
    this.ctx.body = {
      status: 200,
      msg: msg || 'success',
      data: data || {}
    }
  }
  errorRes (status, msg) {
    this.ctx.body = {
      status: status,
      msg: msg || 'error',
      data: ''
    }
  }
}
module.exports = Base