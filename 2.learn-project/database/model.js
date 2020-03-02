const mongoose = require('mongoose')
const Schema = mongoose.Schema

const accessSchema = new Schema({
  // date: { type: Date, default: new Date() }, // 8小时差别
  date: { type: Date, default: Date() },
  client:  String,
  responseTime: Number,
  response: String,
  responseBody: String
})
module.exports.accessModel = mongoose.model('accessSchema', accessSchema)

const errorSchema = new Schema({
  // date: { type: Date, default: new Date() }, // 8小时差别
  date: { type: Date, default: Date() },
  client:  String,
  error: String
})
module.exports.errorModel = mongoose.model('errorSchema', errorSchema)

