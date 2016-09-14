// job.js
var util = require('util')
var events = require('events')
var Job = function Job() {
  var job = this
  // We'll use it later to pass 'this' to closures
  // ...
  job.process = function() {
    // ...
    setTimeout(function(){
      // Emulate the delay of the job - async!
      job.emit('done', { completedOn: new Date() })
    }, 700)
  }
  job.on('start', function(){
    job.process()
  })
}

util.inherits(Job, events.EventEmitter)
module.exports = Job
