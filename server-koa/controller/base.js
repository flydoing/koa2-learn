class Base {
  constructor (name) {
    this.name = name
  }
  success (ctx, data, msg) {
    const body = {
      code: 200,
      data: data || {},
      msg: msg || 'success'
    }
    ctx.body = body
  }
  async successRes (ctx, code='100', msg='msg', data={}) {
    console.dir('successRes:')
    const body = {
      code: code,
      msg: msg,
      data: data
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