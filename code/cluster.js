var cluster = require('cluster')
var http = require('http')
var numCPUs = require('os').cpus().length
var express = require('express')
var stats = {}

if (cluster.isMaster) {
  console.log (' Fork %s worker(s) from master', numCPUs)
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork()
  }
  cluster.on('online', function(worker) {
    console.log ('worker is running on %s pid', worker.process.pid)
  })
  cluster.on('exit', function(worker, code, signal) {
    console.log('worker with %s is closed', worker.process.pid)
  })
} else if (cluster.isWorker) {
  var port = 3000
  stats[cluster.worker.process.pid] = 0
  console.log('worker (%s) is now listening to http://localhost:%s',
    cluster.worker.process.pid, port)
  var app = express()
  app.get('*', function(req, res) {
    stats[cluster.worker.process.pid] += 1
    var l ='cluster '
      + cluster.worker.process.pid
      + ' responded \n'
    console.log(l)
    res.status(200).send(l)
  })
  app.listen(port)
}
process.on('SIGINT', function(){
  console.log(stats)
  console.log('Execute "$ killall node" to terminate')
  process.exit(0)
})
