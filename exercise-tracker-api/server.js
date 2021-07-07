const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://sdthaker:Abcd123456@cluster1.lxvkb.mongodb.net/exerciseTracker?retryWrites=true&w=majority');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
  count: {type: Number},
  log: [{
    description: String,
    duration: Number,
    date: String
  }]
})

const userModel = mongoose.model("userModel", userSchema)

var dates = {
  convert:function(d) {
      // Converts the date in d to a date-object. The input can be:
      //   a date object: returned without modification
      //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
      //   a number     : Interpreted as number of milliseconds
      //                  since 1 Jan 1970 (a timestamp) 
      //   a string     : Any format supported by the javascript engine, like
      //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
      //  an object     : Interpreted as an object with year, month and date
      //                  attributes.  **NOTE** month is 0-11.
      return (
          d.constructor === Date ? d :
          d.constructor === Array ? new Date(d[0],d[1],d[2]) :
          d.constructor === Number ? new Date(d) :
          d.constructor === String ? new Date(d) :
          typeof d === "object" ? new Date(d.year,d.month,d.date) :
          NaN
      );
  },
  compare:function(a,b) {
      // Compare two dates (could be of any type supported by the convert
      // function above) and returns:
      //  -1 : if a < b
      //   0 : if a = b
      //   1 : if a > b
      // NaN : if a or b is an illegal date
      // NOTE: The code inside isFinite does an assignment (=).
      return (
          isFinite(a=this.convert(a).valueOf()) &&
          isFinite(b=this.convert(b).valueOf()) ?
          (a>b)-(a<b) :
          NaN
      );
  },
  inRange:function(d,start,end) {
      // Checks if date in d is between dates in start and end.
      // Returns a boolean or NaN:
      //    true  : if d is between start and end (inclusive)
      //    false : if d is before start or after end
      //    NaN   : if one or more of the dates is illegal.
      // NOTE: The code inside isFinite does an assignment (=).
     return (
          isFinite(d=this.convert(d).valueOf()) &&
          isFinite(start=this.convert(start).valueOf()) &&
          isFinite(end=this.convert(end).valueOf()) ?
          start <= d && d <= end :
          NaN
      );
  }
}

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.post('/api/users', (req, res) => {
  
  userModel.findOne({username: req.body.username}).exec()
  .then( result => {
    if(result) {
      res.send('username already exists')
    }
    else{
      const storeUser = new userModel({
        username: req.body.username
      })
      
      storeUser.save((err, data) => {
        if(err) return console.log(err)
      })

      res.json({username: storeUser.username, _id: storeUser._id})
    }
  })
  .catch(err => {return console.log(err)})
})


app.get('/api/users', (req, res) => {
  userModel.find({}).exec()
  .then( result => {
    if(result) {
      res.json(result)
    }
  })
  .catch(err => {return console.log(err)})
})


app.post('/api/users/:_id/exercises', (req, res) => {
  
  userModel.findById(req.params._id).exec()
    .then(result => {
      if(result && req.body.description && req.body.duration) {
        result.log.push({
          description: req.body.description,
          duration: req.body.duration,
          date: req.body.date ? new Date(req.body.date).toDateString() : new Date().toDateString()
        })

        if(result.count) result.count = ++result.count 
        else result.count = 1

        result.save((err, data) => {
          if(err) return console.log(err)
        })

        res.json({
          _id: result._id,
          username: result.username,
          date: result.log[result.log.length - 1].date,
          duration: result.log[result.log.length - 1].duration,
          description: result.log[result.log.length - 1].description
        })
      }
    })
    .catch(err => {return console.log(err)})
  })


  app.get('/api/users/:_id/logs?:from?:to?:limit?', (req, res) => {

    if(req.params._id && !req.query.from && !req.query.to && !req.query.limit) {
      userModel.findById(req.params._id).exec()
      .then(result => {
        if(result) res.json(result)
      })
      .catch(err => {console.log(err)})
    }
    
    else if(req.params._id && req.query.from && !req.query.to && !req.query.limit) {
      userModel.findById(req.params._id).exec()
      .then(result => {
        
        if(result) {
          let local = {
            _id: result._id,
            username: result.username,
            log: []
          }

          let c = 0
          const fromDate = new Date(req.query.from).toDateString() 
          result.log.forEach(elem => {
             if(dates.compare(elem.date, fromDate) == 1 || dates.compare(elem.date, fromDate) == 0) {
              local.log.push(elem)
              ++c
            }
          });
          local.count = c
          res.json(local)
        }
      })
      .catch(err => {console.log(err)})
    }

    else if(req.params._id && req.query.from && req.query.to && !req.query.limit) {

      userModel.findById(req.params._id).exec()
      .then(result => {
        
        let local = {
          _id: result._id,
          username: result.username,
          log: []
        }
  
        const fromDate = new Date(req.query.from).toDateString()
        , toDate =new Date(req.query.to).toDateString();
        let c = 0;
  
        result.log.forEach(elem => {
           if(dates.inRange(elem.date, fromDate, toDate)) {
            local.log.push(elem)
            c++;
          }
        });
        local.count = c;
        res.json(local)

      })
      .catch(err => {console.log(err)})
    }

    else if(req.params._id && req.query.from && req.query.to && req.query.limit) {

      userModel.findById(req.params._id).exec()
      .then(result => {
        
        let local = {
          _id: result._id,
          username: result.username,
          log: []
        }
  
        const fromDate = new Date(req.query.from).toDateString()
        , toDate = new Date(req.query.to).toDateString();
        let c = 0;
        
        for (let i = 0; i < result.log.length; i++) {
          if(dates.inRange(result.log[i], fromDate, toDate)) {
            local.log.push(result.log[i])
            ++c
          }
          if(c == req.query.limit) break;
        }
        local.count = c;
        res.json(local)
      })
      .catch(err => {console.log(err)})
    }

    else if(req.params._id && !req.query.from && req.query.to && !req.query.limit) {

      userModel.findById(req.params._id).exec()
      .then(result => {
        
        let local = {
          _id: result._id,
          username: result.username,
          log: []
        }
  
        const toDate = new Date(req.query.to).toDateString();
        let c = 0;
        
        result.log.forEach(elem => {
          if(dates.compare(elem.date, toDate) == -1 || dates.compare(elem.date, toDate) == 0) {
           local.log.push(elem)
           ++c
         }
        });
        local.count = c;
        res.json(local)
      })
      .catch(err => {console.log(err)})
    }

    else if(req.params._id && !req.query.from && !req.query.to && req.query.limit) {

      userModel.findById(req.params._id).exec()
      .then(result => {
        
        let local = {
          _id: result._id,
          username: result.username,
          log: []
        }
  
        let c = 0;
        
        for (let i = result.log.length-1; i >= 0; i--) {
            local.log.push(result.log[i])
            ++c
          if(c == req.query.limit) break;
        }
        local.count = c;
        res.json(local)
      })
      .catch(err => {console.log(err)})
    }

    else if(req.params._id && !req.query.from && req.query.to && req.query.limit) {

      userModel.findById(req.params._id).exec()
      .then(result => {
        
        let local = {
          _id: result._id,
          username: result.username,
          log: []
        }
  
        const toDate = new Date(req.query.to).toDateString();
        let c = 0;
        
        for (let i = 0; i < result.log.length; i++) {
          if(dates.compare(result.log[i].date, toDate) == -1 || dates.compare(result.log[i].date, toDate) == 0) {
            local.log.push(result.log[i])
            ++c
          }
          if (c == req.query.limit) break;
        }
        local.count = c;
        res.json(local)
        
        local.count = c;
        res.json(local)
      })
      .catch(err => {console.log(err)})
    }

    else if(req.params._id && req.query.from && !req.query.to && req.query.limit) {

      userModel.findById(req.params._id).exec()
      .then(result => {
        
        let local = {
          _id: result._id,
          username: result.username,
          log: []
        }
  
        const toDate = new Date(req.query.from).toDateString();
        let c = 0;
        
        for (let i = 0; i < result.log.length; i++) {
          if(dates.compare(result.log[i].date, toDate) == 1 || dates.compare(result.log[i].date, toDate) == 0) {
            local.log.push(result.log[i])
            ++c
          }
          if (c == req.query.limit) break;
        }
        local.count = c;
        res.json(local)
      })
      .catch(err => {console.log(err)})
    }
  })

  const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
  })