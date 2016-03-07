console.log('Step: 1')
var start = Date.now()
for (var i = 1; i<1000000000; i++) {
  // This will take 100-1000ms
}
var end = Date.now()
console.log('Step: 2')
console.log(end-start)
