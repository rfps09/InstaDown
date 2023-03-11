const express = require('express');
const scraper = require('./webscraping')
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(
    (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'content-type');
        next();
    }
)

app.post('/instaMidia/', (req,res) => {
    const {url} = req.body;

    new Promise((resolve,reject) => {
        scraper.scrap(url)
        .then(ans => resolve(
            res.status(200).send({
                "urls": ans,
            })))
        .catch(err => reject('scrape failed'))
    })
})

app.listen(PORT);