const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  url: String,
  shortUrl: Number
})

const Url = mongoose.model('Url', urlSchema)

module.exports = {
  urlSchema,
  Url
}