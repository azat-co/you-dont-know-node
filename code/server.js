var express = require('express');
var port = 3000;
global.stats = {}
console.log('worker (%s) is now listening to http://localhost:%s',
 process.pid, port);
var app = express();
app.get('*', function(req, res) {
  if (!global.stats[process.pid]) global.stats[process.pid] = 1
  else global.stats[process.pid] += 1;
  var l ='cluser '
    + process.pid
    + ' responded \n';
  console.log(l, global.stats);
  res.status(200).send(l);
})
app.listen(port);
