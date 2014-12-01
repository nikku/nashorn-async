/**
 * Execution support for simple hybrid (async/sync) script execution in nashorn.
 * 
 * Extend your nashorn script engine with async support by evaluating this script prior to the actual script.
 * Then, wrap the actual script you would like to execute in a `exec(fn, timeout)` block with `fn` containing
 * it.
 *
 * Scripts may call {@link #async} to retrieve a callback (err, result) that needs to be
 * triggered before the overall script execution terminates.
 *
 * The function will always return synchronously and indicate script errors by throwing them.
 *
 * @example async
 * 
 * exec(function() {
 *   var done = async();
 *   
 *   setTimeout(function() {
 *     done(null, 'YES IT WORKED');
 *   }, 200);
 * });
 * 
 * @example sync
 * 
 * exec(function() {
 *   throw new Error('FAILED');
 * });
 * 
 * 
 * @author Nico Rehwaldt<git_nikku@nixis.de>
 */

(function(context) {
  
  var Timer = Java.type('java.util.Timer');
  var Phaser = Java.type('java.util.concurrent.Phaser');
  var TimeUnit = Java.type('java.util.concurrent.TimeUnit');

  var timer = new Timer('jsEventLoop', false);
  
  /**
   * Our global synchronization barrier that we use to register async operations
   * and that awaits for all of these operations to finish.
   */
  var phaser = new Phaser();


  /** global execution results */
  var results;

  function async() {
    phaser.register();

    return function(err, result) {
      results = { err: err, result: result };
      phaser.arriveAndDeregister();
    };
  };


  /**
   * Executes the given function after the specified timeout.
   * 
   * @param {Function} fn
   * @param {Number} [millis]
   */
  function setTimeout(fn, millis) {
    phaser.register();

    timer.schedule(function() {
      try {
        fn();
      } finally {
        phaser.arriveAndDeregister();
      }
    }, millis);
  }

  /**
   * Execute a function (synchronously or asynchronously) and return the result
   * or throw the error that is returned by it.
   * 
   * @param {Function} fn
   * @param {Number} [timeout=5000]
   */
  function exec(fn, timeout) {
    timeout = timeout || 5000;

    phaser.register();

    setTimeout(function() {
      try {
        results = { err: null, result: fn() };
      } catch (e) {
        results = { err: e };
      }
    }, 0);

    try {
      phaser.awaitAdvanceInterruptibly(phaser.arrive(), timeout, TimeUnit.MILLISECONDS);
    } finally {
      timer.cancel();
    }
    
    if (results.err) {
      print(results.err);
      throw results.err;
    } else {
      return results.result;
    }
  }
  
  context.exec = exec;
  context.async = async;
  context.setTimeout = setTimeout;

})(this);