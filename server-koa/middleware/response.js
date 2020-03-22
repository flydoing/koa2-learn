
// module.exports = (app) => {
//     return async function(ctx, next){
//       try {
//         await next()
//       }catch(error){
//         app.logger.error(error);
//         ctx.body = {
//           msg: error.message,
//           status: 500,
//         };
//       }
//     }
//   }
// const { loggerError } = require('./logger')
// module.exports = async (ctx, next) => {
//   try {
//     await next()
//   } catch (error) {
//     console.log('error.js')
//     console.log(error)
//     loggerError(error, ctx)
//   }
// }

module.exports = async (ctx, next) => {
  ctx.error = ({ status, code, msg, data, error }) => {
    ctx.status = status || 400
    ctx.body = {
      code: code || -200,
      msg,
      data,
      error
    }
  }
  ctx.success = ({ code, msg, data }) => {
    ctx.body = {
      code: code || 200,
      msg,
      data
    }
  }
  await next()
}
