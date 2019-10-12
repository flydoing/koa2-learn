
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
const { loggerError } = require('./logger')
module.exports = async (ctx, next) => {
    try {
        await next()
    } catch (error){
        loggerError(error, ctx)
    }
}
