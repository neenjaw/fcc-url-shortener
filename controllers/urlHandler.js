const dns = require("dns");

const { Counter } = require("../models/counter");
const { Url } = require("../models/url");

const getShortUrl = (req, res) => {
  const shortUrl = req.params.shortUrl;

  Url.findOne({ shortUrl }, (err, url) => {
    if (err) {
      return err;
    }

    console.log(url);
    res.redirect(`https://${url.url}`);
  });
};

const lookupPromise = (url) =>
  new Promise((resolve, reject) => {
    dns.lookup(url, (err, address, family) => {
      if (err) {
        reject(err);
      } else {
        resolve([address, family]);
      }
    });
  });

const createShortUrl = (req, res) => {
  const postedUrl = req.body.url;
  const urlRegex = /^(https?:\/\/)?(?<url>.*)$/;
  const {
    groups: { url: bareUrl },
  } = urlRegex.exec(postedUrl);

  lookupPromise(bareUrl)
    .then(([address, _]) => {
      Counter.findOneAndUpdate(
        {},
        { $inc: { count: 1 } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
        .then((counter) => {
          new Url({
            url: bareUrl,
            shortUrl: counter.count,
          })
            .save()
            .then((savedUrl) =>
              res.json({
                original_url: savedUrl.url,
                short_url: savedUrl.shortUrl,
              })
            )
            .catch((err) => {
              res.json({ error: "unable to save shortened URL" });
            });
        })
        .catch((err) =>
          res.json({ error: "unable to obtain new shortened URL" })
        );
    })
    .catch((err) => res.json({ error: "invalid URL" }));
};

module.exports = {
  getShortUrl,
  createShortUrl,
};
