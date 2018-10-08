const {Person, Exercise} = require(__dirname + '/models/all.js')
const {checkFrom, checkTo} = require(__dirname + '/helpers/all.js');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const short = require('shortid')
const cors = require('cors')


const mongoose = require('mongoose')
mongoose.connect('mongodb://sprite:Frank764@ds121343.mlab.com:21343/exercise-tracker-git')

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/exercise/new-user', (req,res, next)=>{
  var user = new Person({
  userName: req.body.username});
  user.save(function(err){
  if(err) {
      if(err.code == 11000) {
        return next({
          status: 400,
          message: 'username already taken'
        })
      } else {
        return next(err)
      }
    }
    
  res.json({name: user.userName, id: user._id});
})
  
})

  app.post('/api/exercise/add', (req, res, next)=>{
    Person.findById(req.body.userId, (err, user) => {
      if(err) return next(err)
      if(!user) {
        return next({
          status: 400,
          message: 'unknown _id'
        })
      }
      const exercise = new Exercise(req.body)
      exercise.username = user.username
        if(!exercise.date){
          exercise.date = new Date()
        }
      exercise.save((err, savedExercise) => {
        console.log(savedExercise.date);
        if(err) return next(err)
        savedExercise = savedExercise.toObject()
        delete savedExercise.__v
        savedExercise._id = savedExercise.userId
        savedExercise.date = savedExercise.date.toDateString();
        delete savedExercise.userId
        res.json(savedExercise)
      })
  })
    
  })

app.post('/api/exercise/log', (req, res)=>{
  if(req.body.from == undefined && req.body.to == undefined) 
    res.redirect(`?userId=${req.body.userId}`)
  else if(req.body.from== undefined)
    res.redirect(`?userId=${req.body.userId}&to=${req.body.to}`)
  else if(req.body.to==undefined)
    res.redirect(`?userId=${req.body.userId}&from=${req.body.from}`)
  else{
    res.redirect(`?userId=${req.body.userId}&from=${req.body.from}&to=${req.body.to}`)
  }
})
app.get('/api/exercise/log', (req, res)=>{
  var from = new Date(req.query.from);
  var to= new Date(req.query.to);
  Person.findById(req.query.userId, (err, user)=>{
    Exercise.find({userId: req.query.userId,
                   date: {
                     $gt: checkFrom(from)
                     ,
                     $lt: checkTo(to)
                   }
                  }, (err, elem)=>{
                      const out = {
                        _id: user._id,
                        userName: user.userName,
                        count: elem.length,
                        log: elem.map(item=>({
                          description: item.description,
                          date: item.date.toDateString(),
                          duration: item.duration         
                          }) 
                                    )}
      res.json(out);
  })
  })
 
  
})



app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})


app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
