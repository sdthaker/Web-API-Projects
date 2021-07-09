require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const dns = require('dns');
const http = require('http')
const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://sdthaker:Abcd123456@cluster1.lxvkb.mongodb.net/shortURL?retryWrites=true&w=majority');
const { Schema } = mongoose;

const urlSchema = new Schema({
  randNum: { type: Number, required: true },
  domain: { type: String }
})

const urlModel = mongoose.model("urlModel", urlSchema)

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}


const postToDB = (rand, passedURL, done) => {
  urlModel.findOne({ randNum: rand }, (err, numFound) => {
    if (err) return console.error(err)

    const micSer = new urlModel({
      randNum: rand,
      domain: passedURL
    })

    rand = numFound
    micSer.save((err, data) => {
      if (err) return console.error(err)
    })
  })
};

let urll = ''

app.post('/api/shorturl', (req, res) => {

  //repond with a json obj + post the data into mongoDB
  let rand = getRandomInt(100000);
  postToDB(rand, req.body.url);
   const ur = {original_url: req.body.url, short_url: rand}
   urll = ur.original_url;

  if (!isValidHttpUrl(req.body.url)) {
    res.json({ error: "Invalid URL" })
  }
  else{
    res.json({ original_url: req.body.url, short_url: rand })
  }
})

app.get(`/api/shorturl/:num`, (req, res) => {
  urlModel.findOne({ randNum: req.params.num })
  .exec()
  .then(result => {
    if(!result) res.json({error: 'ShortUrl number is incorrect'})
    res.redirect(result.domain)
  })
  .catch(err => {
    return console.error(err)
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
