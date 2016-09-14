// weekly.js
var Job = require('./job.js')
var job = new Job()

job.on('done', function(details){
  console.log('Weekly email job was completed at',
    details.completedOn)
  // job.removeAllListeners()

})

// job.process()
job.emit('start')
