// server.js
// where your node app starts

// init project
var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function(req, res) {
  res.json({ greeting: "hello API" });
});

app.get('/api', (req, res) => {
  var date = new Date();
  res.json({unix: date.valueOf(), utc: date.toUTCString()})
})

app.get('/api/:date?',(req,res) => {
  if(!/^\d{4}-/.test(req.params.date)) unix = parseInt(req.params.date)

  if(new Date(unix).getTime() !== new Date(unix).getTime()){
      res.json({error: 'Invalid Date'})
  }
  else{
        if(!Number.isNaN(Date.parse(req.params.date))){
        let unixx = new Date(req.params.date).getTime()
        let utcc = new Date(req.params.date).toUTCString()
        res.json({unix: unixx, utc: utcc})
     }
     else{
        let utcc = new Date(parseInt(req.params.date)).toUTCString();
        res.json({unix: parseInt(req.params.date), utc: utcc})
     }
  }
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});


