const log4js = require('log4js')
const logger = log4js.getLogger()
module.exports = (ctx, next) => {
  // const log4js = require('log4js')
  // const logger = log4js.getLogger()
  // console.log('logger.js:')
  logger.level = 'debug'
  // logger.debug('Some debug messages')
  console.log('logger-----')
  // const log4js = require('log4js');
  // log4js.configure({
  //   appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
  //   categories: { default: { appenders: ['cheese'], level: 'all' } }
  // });
  
  // const logger = log4js.getLogger('cheese');
  // const logger = log4js.getLogger();
  // logger.trace('Entering cheese testing');
  logger.debug('Got cheese.');
  logger.info('Cheese is Comté.');
  logger.warn('Cheese is quite smelly.');
  logger.error('Cheese is too ripe!');
  logger.fatal('Cheese was breeding ground for listeria.');
  next()
}
