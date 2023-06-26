const mongoose = require('mongoose')
const Schema = mongoose.Schema
const urlSchema = new Schema({
  shorerURL: {
    type: String, 
    required: true 
  },
  originURL: {
    type: String,
    required: true 
  }
})
module.exports = mongoose.model('URL', urlSchema)