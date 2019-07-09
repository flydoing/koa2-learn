// class Person {
//   static getMethod() {
//     console.log('static')
//   }
//   getMethod() {
//     console.log('instance')
//   }
// }
// class Man extends Person {
//   static getMethod() {
//     super.getMethod()
//   }
//   getMethod(msg) {
//     super.getMethod()
//   }
// }
// Man.getMethod() // static
// var lilei = new Man()
// lilei.getMethod() // instance

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

class Artitle extends Base {
  constructor () {
    super()
  }
  async artitle1() {
    console.dir('artitle1')
  }
  static async artitle2() {
    console.dir('static async artitle2')
  }
  async artitle3() {
    console.dir('artitle3')
    this.successRes('artitle3')
  }
}

Artitle.artitle2() // static async artitle2
Artitle.staticBase() // staticBase
let article = new Artitle()
article.artitle1() // artitle1
article.successRes('article.successRes') // successRes:article.successRes
article.artitle3() // artitle3 // successRes:artitle3
