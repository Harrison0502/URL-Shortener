const mongoose = require('mongoose')
const Schema = mongoose.Schema
const urlSchema = new Schema({
  originalURL: {
    type: String,
    required: true
  },
  shortenedURL: {
    type: String, 
    required: true 
  }
})
module.exports = mongoose.model('URL', urlSchema)