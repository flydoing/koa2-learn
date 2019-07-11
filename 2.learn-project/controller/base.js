class Base {
  constructor (name) {
    this.name = name
  }
  async successRes (ctx, data, msg) {
    console.dir('successRes:')
    const body = {
      code: 200,
      msg: msg || 'success',
      data: data || {}
    }
    ctx.response.status = 200
    ctx.response.type = 'json'
    ctx.response.body = body
    return ctx
    // console.dir(ctx)
  }
  errorRes (status, msg) {
    this.ctx.body = {
      status: status,
      msg: msg || 'error',
      data: ''
    }
  }
  static async article333() {
    console.dir('article333')
  }
}
module.exports = Base