module.exports = class Base {
  constructor (ctx) {
    this.ctx = ctx
    this.app = ctx.app
  }
  successRes (data, msg) {
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