# nashorn-async

[![Build Status](https://travis-ci.org/nikku/nashorn-async.svg?branch=master)](https://travis-ci.org/nikku/nashorn-async)

Asynchronous scripting support for [Nashorn](http://www.oracle.com/technetwork/articles/java/jf14-nashorn-2126515.html).

This project adds optional asynchronous scripting support to javascript snippets evaluated with nashorn.

A snippet may call `var done = async()` to switch to asynchronous mode.
In asynchronous mode the overall script execution will not finish until
all timers and intervals got cleared or elapsed _and_ the `done` callback
got invoked with `(err, result)`.


## Example Code

A simple asynchronous script:

```javascript
var done = async();

var timer = setTimeout(function() {

  // do work
  done(null, 'WORK DONE!');
}, 100);
```

A timeout may also be cleared:

```javascript
clearTimeout(timer);
done();
```

Scripts may be synchronous, too and simply return a computed value:

```javascript
function doWork() {
  return 'WORK DONE!';
}

return doWork();
```

## Async Helpers

Inside a script the following async helpers are available:

* `setTimeout`
* `clearTimeout`
* `setInterval`
* `clearInterval`


## Using the library from Java

Executing scripts with async support from Java:

```java

ScriptRunner execution = new ScriptRunner(script);

try {
  Object result = execution.execute();
} catch (Exception e) {
  // catches both synchronous and
  // asynchronous exceptions
}
```


## Extending the implementation

Simply evaluate the [`event-loop.js`](https://github.com/nikku/nashorn-async/blob/master/src/main/resources/js/event-loop.js) script that adds optional async support in your script prior to evaluating the target script inside a `exec(function() { ...actual script... })` block. See [ScriptRunner](https://github.com/nikku/nashorn-async/blob/master/src/main/java/de/nixis/scripting/ScriptRunner.java) for details.


## Compatible Libraries

Using this library the following projects have been reported to work with Nashorn:

* [pdfmake](http://pdfmake.org)


## LICENSE

MIT
