var mongoose = require('mongoose')
var shortId = require('shortid')

var Schema = mongoose.Schema;

var usersSchema = new Schema({
  userName: {
    type: String,
    unique: true,
    required: true
  },
    _id:  {
      type: String,
      index: true,
      default: shortId.generate
    },
})
exports.Person = mongoose.model('Person', usersSchema);
var exerciseSchema = new Schema({
  description:{
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: String,
    ref: 'Person',
    index: true
  },
  userName: String
})

exerciseSchema.pre('save', function (next){
  mongoose.model('Person').findById(this.userId, function(err, user) {
    if(err) return next(err)
    if(!user) {
      const err = new Error('unknown userId')
      err.status = 400
      return next(err)
    }
    this.userName = user.userName
    next();
  })
})

exports.Exercise = mongoose.model('Exercise', exerciseSchema);