const dns = require('dns')

const { Counter } = require('../models/counter')
const { Url } = require('../models/url')

const getShortUrl = (req, res) => {
  const shortUrl = req.params.shortUrl

  Url.findOne({shortUrl}, (err, url) => {
    if (err) {
      return err
    }

    console.log(url)
    res.redirect(`https://${url.url}`)
  })
}

const createShortUrl = (req, res) => {
  const postedUrl = req.body.url
  const urlRegex = /^(https?:\/\/)?(?<url>.*)$/
  const {groups: {url: bareUrl}} = urlRegex.exec(postedUrl)

  dns.lookup(bareUrl, (err, address) => {
    if (err) {
      return res.json({"error":"invalid URL"})
    }

    const counterQuery = {}
    const counterUpdate = {$inc: {count: 1}}
    const counterOptions = {upsert: true, new: true, setDefaultsOnInsert: true}
    Counter.findOneAndUpdate(counterQuery, counterUpdate, counterOptions, (err, counter) => {
      if (err) return err

      const newUrl = new Url({
        url: bareUrl,
        shortUrl: counter.count
      })

      newUrl.save((err, savedUrl) => {
        if (err) return err

        res.json({
          original_url: savedUrl.url,
          short_url: savedUrl.shortUrl
        })
      })
    })
  })
}

module.exports = {
  getShortUrl,
  createShortUrl
}