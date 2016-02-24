footer: © Capital One, 2015
slidenumbers: true

# You Don't Know Node
## Quick Guide to The Best Features

---

# Slides :page_facing_up:

<https://github.com/azat-co/you-dont-know-node>

or

PDF: <http://bit.ly/1VJWpQK>

or

`$ mkdir node_modules && npm install you-dont-know-node`

---

# Key Takeaways

1. Event loop: Brush-up on the core concept which enables non-blocking I/O
1. Streams and buffers: Effective way to work with data
1. Global and process: How to access more info

---

# More Key Takeaways

1. Event emitters: Crash course in the event-based pattern
1. Clusters: Fork processes like a pro
1. Handling async errors: AsyncWrap, Domain and uncaughtException
1. C++ addons: Contributing to the core and writing your own C++ addons

---

# About Presenter

Azat Mardan

![inline](images/azat.jpeg)

Twitter: @azat_co
Email: hi@azat.co
Blog: webapplog.com

---

# About Presenter

* Technology Fellow at Capital One
* Experience: FDIC, NIH, DocuSign, HackReactor and Storify
* Books: Practical Node.js, Pro Express.js and Express.js API

---

![left 100%](images/proexpress.png)
![right 100%](images/practicalnode.png)


---

# Event Loop

---

![inline](images/non-blocking.png)

^This allows processing other tasks while IO calls are unfinished like this
^Nginx vs. Apache
^Blocking I/O is expensive!

---


### Basic Event Loop Example

```java
System.out.println("Step: 1");
System.out.println("Step: 2");
Thread.sleep(1000);
System.out.println("Step: 3");
```

vs.

```js
console.log('Step: 1')
setTimeout(function () {
  console.log('Step: 3')
}, 1000)
console.log('Step: 2')
```

---

## Thinking in Async Code

```js
console.log('Step: 1')
setTimeout(function () {
  console.log('Step: 3')
  // console.log('Step 5')
}, 1000);
console.log('Step: 2')
// console.log('Step 4')
```


---

![inline](images/threading_java.png)


---

![inline](images/threading_node.png)

^This is in contrast to today's more common concurrency model where OS threads are employed. Thread-based networking is relatively inefficient and very difficult to use. Furthermore, users of Node are free from worries of dead-locking the process --- there are no locks


---


## It's still possible to write blocking code in Node.js. :flushed:


---

# Blocking Node.js Code

```js
console.log('Step: 1')
for (var i = 1; i<10000; i++) {
  // CPU intensive blocking task
}
console.log('Step: 2')
```

---

# Blocking Node.js Code

```js
var fs = require('fs');

var contents = fs.readFileSync('accounts.txt','utf8');
console.log(contents);
console.log('Hello Capital One\n');

var contents = fs.readFileSync('ips.txt','utf8');
console.log(contents);
console.log('Hello SECON!');
```

^data1->Hello Capital One->data2->Hello SECON!



---

# Non-Blocking Node.js Code

```js
var fs = require('fs');

var contents = fs.readFile('accounts.txt','utf8', function(err,contents){
   console.log(contents);
});
console.log('Hello Capital One\n');


var contents = fs.readFile('ips.txt','utf8', function(err,contents){
   console.log(contents);
});
console.log("Hello SECON!");
```

^Hello Capital One->Hello SECON->data1->data2

---

# Streams and Buffers

---


### Standard Streams

Standard streams are I/O channels between an application and its
execution environment.

There are three standard streams:

* standard input - `stdin`
* standard output - `stdout`
* standard error - `stderr`

^Note that the execution environment is typically a shell terminal

---

`stdin`

Standard input streams contain data going into applications.

This is achieved via a read operation.

Input typically comes from the keyboard used to start the process.

---

To listen in on data from stdin, use the `data` and `end` events:

```js
process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    console.log('chunk: ', chunk);
});

process.stdin.on('end', function () {
    console.log('--- END ---');
});
```

---

Notes:

* `data` - input fed into the program. Depending on the size of
the input, this event can trigger multiple times

* an `end` event is necessary to signal the conclusion of the input
stream

* `stdin` is paused by default, and must be resumed before data can
be read from it

---

`stdout`

The standard output streams contain data going out of an application.

This is done via a write operation.

Data written to standard output is visible on the command line.

---

To write to `stdout`, use the `write` function:

```js
process.stdout.write('A simple message\n');
```

---

`stderr`

The standard error stream is an output stream like `stdout`.

It is used primarily to log messages and errors for the purpose of
debugging.

---

Writing to `stderr` is done similarly to `stdout`:

```js
process.stderr.write('An error message\n');
```

---

Note that `stdout` and `stderr` are special streams in Node as they are blocking!

---

## Teletype Context

To check if the application is being run in TTY context, use the `isTTY`
property:

```
$ node teletype.js
// process.stdin.isTTY === true
// process.stdout.isTTY === true

$ echo "hello world" | node teletype.js
// process.stdin.isTTY === false

$ node teletype.js | cat
// process.stdout.isTTY === false
```

---

### Buffers

Binary data type, to create:

* `new Buffer(size)`
* `new Buffer(array)`
* `new Buffer(buffer)`
* `new Buffer(str[, encoding])`

Docs: <http://bit.ly/1IeAcZ1>

---

```js
buf = new Buffer(26);
for (var i = 0 ; i < 26 ; i++) {
  buf[i] = i + 97; // 97 is ASCII a
}
buf // <Buffer 61 62 63 64 65 66 67 68 69 6a 6b 6c 6d 6e 6f 70 71 72 73 74 75 76 77 78 79 7a>
```

Buffer Convertion:

```js
buf.toString('ascii'); // outputs: abcdefghijklmnopqrstuvwxyz
buf.toString('ascii', 0, 5); // outputs: abcde
buf.toString('utf8', 0, 5); // outputs: abcde
buf.toString(undefined, 0, 5); // encoding defaults to 'utf8', outputs abcde
```

---

### Remember fs?

```
fs.readFile('/etc/passwd', function (err, data) {
  if (err) throw err;
  console.log(data);
});
```

`data` is buffer!

---

### Buffer methods and properties

* `buf.length`
* `buf.write(string[, offset][, length][, encoding])`
* `buf.toString([encoding][, start][, end])`
* `buf.toJSON()`

---

### Buffer methods and properties

* `buf.equals(otherBuffer)`
* `buf.compare(otherBuffer)`
* `buf.copy(targetBuffer[, targetStart][, sourceStart][, sourceEnd])`
* `buf.slice([start][, end])`
* `buf.fill(value[, offset][, end])`

---

### Encodings

* `ascii`   - for 7 bit ASCII data only. Very fast, strips the high bit if set.
* `utf8`    - Multibyte encoded Unicode characters. Standard for the web.
* `utf16le` - 2 or 4 bytes, little-endian encoded Unicode chars.

---

### Encodings

* `ucs2`    - Alias of 'utf16le'.
* `base64`  - Base64 string encoding.
* `binary`  - (DEPRECATED) Raw binary data into strings by using only the first 8 bits of each char.
* `hex`     - Encode each byte as two hexadecimal characters.

---

# Streams and Buffer Demo

server-stream.js:

```js
app.get('/stream1', function(req, res) {
  var stream = fs.createReadStream(largeImagePath)
  stream.pipe(res)
})
```

```
$ node server-stream
```

<http://localhost:3000/stream1>
<http://localhost:3000/non-stream>

---

# Stream Resources

<https://github.com/substack/stream-adventure>

```
$ sudo npm install -g stream-adventure
$ stream-adventure
```

<https://github.com/substack/stream-handbook>

---

# Global and Process

---


# Global

* `global.process`
* `global.__filename`
* `global.__dirname`
* `global.module`
* `global.require`
* `global.console`
* `global.setInterval`
* `global.setTimeout`

---

# Process

* `process.pid`
* `process.versions`
* `process.arch`
* `process.argv`
* `process.env`

---

# More Process

* `process.uptime()`
* `process.memoryUsage()`
* `process.cwd()`
* `process.exit`
* `process.on()`

---

# Event emitters

---


### Event Emitters

Event emitter is something that triggers an event to which anyone can listen.

<https://nodejs.org/api/events.html>

In node.js an event can be described simply as a string with a corresponding callback.

---

### Event Emitters

* Event handling in Node uses the observer pattern
* An event, or subject, keeps track of all functions that are associated with it
* These associated functions, known as observers, are executed when the given event is triggered

---

### Using Event Emitters

```js
var events  = require('events');
var emitter = new events.EventEmitter();

emitter.on('knock', function {
    console.log("Who's there?");
});

emitter.on('knock', function {
    console.log("Go away!");
});

emitter.emit('knock');
```

---

### Inheriting from EventEmitter

```js
var util = require('util');
var Job = function Job() {
    // ...
    this.process = function() {
        // ...
        job.emit('done', { completedOn: new Date() });
    }
};

util.inherits(Job, require('events').EventEmitter);
module.exports = Job;
```

---

### Inheriting from EventEmitter

```js
var job = new Job();

job.on('done', function(details){
  console.log('Job was completed at', details.completedOn);
  job.removeAllListeners();
});

job.process();
```

---

### Listeners

```js
emitter.listeners(eventName);

emitter.on(eventName, listener);

emitter.once(eventName, listener);

emitter.removeListener(eventName, listener);
```

---

# Clusters

---

# Clusters

```js
var cluster = require('cluster');
if (cluster.isMaster) {
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  };
} else if (cluster.isWorker) {
… // your server code
})
```

---

# Cluster Demo

1. Run `code/cluster.js` with node (`node cluster.js`).
1. Install `loadtest` with npm: `$ npm install -g loadtest`
1. Run load testing with: `$ loadtest  http://localhost:3000 -t 20 —c 10`

Press control+c on the server terminal

---

# Cluster Libraries

* Core cluster
* strong-cluster-control (https://github.com/strongloop/strong-cluster-control), or `$ slc run`
* pm2 (https://github.com/Unitech/pm2)

---

### pm2

<https://github.com/Unitech/pm2>

<http://pm2.keymetrics.io>

Advantages:

* Load-balancer and other features
* 0s reload down-time, i.e., forever alive
* Good test coverage

---

### pm2 Demo: Typical Express Server

```js
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
```

---

### pm2 Demo

Using `server.js`:

```
$ pm2 start server.js -i 0
```

In a new window:

```
$ loadtest  http://localhost:3000 -t 20 -c 10
$ pm2 list
```

---

# Spawn vs fork vs exec

* `require('child_process').spawn()` - large data, stream, no new V8 instance
* `require('child_process').fork()` - new V8 instance, multiple workers
* `require('child_process').exec()` - buffer, async, all the data at once

---

### Spawn Example

```js
fs = require('fs');
process = require('child_process');
var p = process.spawn('node','program.js');
p.stdout.on('data', function(data)) {
 console.log('stdout: ' + data);
});
```

---

### Fork Example

```js
fs = require('fs');
process = require('child_process');
var p = process.fork('program.js');
p.stdout.on('data', function(data)) {
 console.log('stdout: ' + data);
});
```

---

# Exec Example

```js
fs = require('fs');
process = require('child_process');
var p = process.exec('node program.js', function (error, stdout, stderr) {
if(error)
 console.log(error.code);
});
```

---

# Handling Async Errors

---

Event Loop: Async errors are harder to handle/debug, because system loses context of the error. Then, application crashes.

Try/catch is not good enough.

---


### Synchronous Error in Node

```js
try {
  throw new Error('Fail!');
} catch (e) {
  console.log('Custom Error: ' + e.message);
}
```

For sync errors try/catch works fine.

---


### Async Error Example

```js
try {
  setTimeout(function () {
      throw new Error("Fail!");
  }, Math.round(Math.random()*100));
} catch (e) {
  console.log('Custom Error: ' + e.message);
}
```

---

### Async Errors

The app crashes! How to deal with it?

:sweat_smile:

---

## Best Practices for Async Errors?

* Listen to all “on error” events
* Listen to `uncaughtException`
* Use `domain` (soft deprecated) or [AsyncWrap](http://blog.trevnorris.com/2015/02/asyncwrap-tutorial-introduction.html)
* Log, log, log & Trace
* Notify (optional)
* Exit & Restart the process

---

### on('error')

Anything that inherits from or creates an instance of the above: Express, LoopBack, Sails, Hapi, etc.

```js
server.on('error', function (err) {
  console.error(err)
})
```  

---

### on('error') Chained Method Example

```js
var http = require(‘http’);
var server = http.createServer(app)
  .on('error', function(e) {
    console.log(‘Failed to create server’);
    console.error(e);
    process.exit(1);
  })
```

---

### on(‘error’) Named Variable Example

```js
var req = http.request(options, function(res) {
  // … processing the response
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});
```

---

### uncaughtException

`uncaughtException` is a very crude mechanism for exception handling. An unhandled exception means your application - and by extension Node.js itself - is in an undefined state. Blindly resuming means anything could happen.

---

### uncaughtException

Always listen to `uncaughtException`!

```js
process.on(‘uncaughtException’, handle)
```

or

```js
process.addListener('uncaughtException', handle)
```

---


### uncaughtException Expanded Examples

```js
process.on('uncaughtException', function (err) {
  console.error('uncaughtException: ', err.message);
  console.error(err.stack);
  process.exit(1);
});
```

or

```js
process.addListener('uncaughtException', function (err) {
  console.error('uncaughtException: ', err.message);
  console.error(err.stack);
  process.exit(1);
```

---

### Domain

This module is softly deprecated in 4.0 (most likey will be separate from core module), but there's no alternatives in core as of now.

---

### Domain Example

```js
var domain = require('domain').create();
domain.on('error', function(error){
  console.log(error);
});
domain.run(function(){
  throw new Error('Failed!');
});
```

---

### Domain with Async Error Demo

domain-async.js:

```js
var d = require('domain').create();
d.on('error', function(e) {
   console.log('Custom Error: ' + e);
});
d.run(function() {
  setTimeout(function () {
    throw new Error('Failed!');
  }, Math.round(Math.random()*100));
});
```

---

# C++ Addons

---

### Node and C++

Create the `hello.cc` file:

```c
#include <node.h>

namespace demo {

using v8::FunctionCallbackInfo;
using v8::HandleScope;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;
```

---

### Node and C++

Create the `hello.cc` file:

```c
void Method(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, "capital one"));
}

void init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "hello", Method);
}

NODE_MODULE(addon, init)

}  // namespace demo
```

---

### Creating `binding.gyp`

Create `binding.gyp`:

```
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "hello.cc" ]
    }
  ]
}
```

---

### node-gyp

```
$ npm install -g node-gyp
```

<https://github.com/nodejs/node-gyp>

^Needs Python

---

### Configuring and Building

```
$ node-gyp configure
$ node-gyp build
```

Check for compiled .node files in build/Release/

---

### C++ Addons Examples

<https://github.com/nodejs/node-addon-examples>

---

### Including Addon

Create `hello.js` and include your C++ addon:

```js
var addon = require('./build/Release/addon');
console.log(addon.hello()); // 'capital one'
```

---

# Q&A :+1:

Send questions to

<https://github.com/azat-co/you-dont-know-node/issues>

Twitter: @azat_co
Email: hi@azat.co
