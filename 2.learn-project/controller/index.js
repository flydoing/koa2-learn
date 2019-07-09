// const Base = require('./base')
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
class Controller extends Base {
  constructor () {
    super()
  }
  static commonSuccess (ctx, data, msg) {
  // commonSuccess (data, msg) {
    ctx.body = {
      status: 200,
      msg: msg || 'success',
      data: data || {}
    }
    return ctx
  }
  // controller
  static article(ctx) {
    ctx.response.status = 200
    ctx.response.type = 'json'
    ctx.response.body = {
      title: 'ctx article',
      tags: ['news', 'sports'],
      article: 'ctx Tommy Pham thinks a new stadium or even relocation might be needed to draw more fans to the Rays games.'
    }
    // return ctx
    const body = {
      title: 'ctx article',
      tags: ['news', 'sports'],
      article: 'ctx Tommy Pham thinks a new stadium or even relocation might be needed to draw more fans to the Rays games.'
    }
    Controller.commonSuccess(ctx, body, 'success article')
    // const ret = {
    //   title: 'controller article',
    //   tags: ['news', 'sports'],
    //   article: 'Tommy Pham thinks a new stadium or even relocation might be needed to draw more fans to the Rays games.'
    // }
    // this.successRes(ret)
  }
  commonSuccess2(ctx, data, msg) {
    ctx.body = {
      status: 200,
      msg: msg || 'commonSuccess2',
      data: data || {}
    }
    return ctx
  }
  article2(ctx) {
    // console.dir(ctx)
    console.log(this)
    const body = {
      title: 'ctx article2',
      tags: ['news', 'sports'],
      article: 'ctx Tommy Pham thinks a new stadium or even relocation might be needed to draw more fans to the Rays games.'
    }
    this.successRes(ctx, body, 'success article')
  }
}
module.exports = new Controller()
