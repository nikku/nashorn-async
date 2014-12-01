# nashorn-async

Asynchronous scripting support for [Nashorn](http://www.oracle.com/technetwork/articles/java/jf14-nashorn-2126515.html).

This project adds optional asynchronous scripting support to javascript snippets evaluated with nashorn.

A snippet may call `var done = async()` to switch to asynchronous mode. This will ensure the overall script execution waits until the returned callback function is evalutated with `(err, result)`.


## Example Code

A simple asynchronous script:

```javascript
var done = async();

setTimeout(function() {

  // do work
  done(null, 'WORK DONE!');
}, 100);
```

Scripts may be synchronous, too and simply return a computed value:

```javascript
function doWork() {
  return 'WORK DONE!';
}

return doWork();
```


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


More sophisticated implementations can easily be created.