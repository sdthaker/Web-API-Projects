require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
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

const postToDB = (rand, passedURL) => {
    const micSer = new urlModel({
      randNum: rand,
      domain: passedURL
    })

    micSer.save((err, data) => {
      if (err) return console.error(err)
    })
};

//repond with a json obj + post the data into mongoDB database
app.post('/api/shorturl', (req, res) => {

  let rand = getRandomInt(100000);
  
  if (!isValidHttpUrl(req.body.url)) {
    res.json({ error: "Invalid URL" })
  }
  else{
    postToDB(rand, req.body.url);
    res.json({ original_url: req.body.url, short_url: rand })
  }
})

//respond to client's request by redirecting their browser to the provided shortened url 
app.get(`/api/shorturl/:num`, (req, res) => {
  urlModel.findOne({ randNum: req.params.num }, (err, numFound) => {
    if(!numFound.domain) res.json({error: 'ShortUrl number is incorrect'})
    if(err) return console.error(err)
     //res.writeHead(301, {Location: `${numFound.domain}`})
     //res.end();
    res.redirect(numFound.domain)
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
