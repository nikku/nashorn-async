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
 * <strong>Warning: </strong> If {@link #async} is invoked multiple times, all callbacks
 * need to be fulfilled but only the last one will decide upon the actual execution result.
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
  var TimerTask = Java.type('java.util.TimerTask');
  var Phaser = Java.type('java.util.concurrent.Phaser');
  var TimeUnit = Java.type('java.util.concurrent.TimeUnit');

  var System = Java.type('java.lang.System');

  var timer = new Timer('jsEventLoop', false);

  /**
   * Our global synchronization barrier that we use to register async operations
   * and that awaits for all of these operations to finish.
   */
  var phaser = new Phaser();


  /** global execution results */
  var results;

  function eventLoopError(e) {
    System.out.print('Exception in jsEventLoop ');
    e.printStackTrace();
  }

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
   *
   * @return {Object} timeout handle
   */
  function setTimeout(fn, millis) {
    phaser.register();

    var task = new TimerTask({
      run: function() {
        try {
          fn();
        } catch(e) {
          eventLoopError(e);
        } finally {
          phaser.arriveAndDeregister();
        }
      }
    });

    timer.schedule(task, millis || 0);

    return task;
  }


  /**
   * Clear timeout previously created via {@link #setTimeout}.
   *
   * @param {Object} task timeout handle
   */
  function clearTimeout(task) {
    if (task.cancel()) {
      phaser.arriveAndDeregister();
    }
  }

  /**
   * Executes the given function with a fixed time delay.
   *
   * @param {Function} fn
   * @param {Number} [millis]
   *
   * @return {Object} timeout handle
   */
  function setInterval(fn, millis) {
    phaser.register();

    var task = new TimerTask({
      run: function() {
        try {
          fn();
        } catch (e) {
          eventLoopError(e);
        }
      }
    });

    timer.scheduleAtFixedRate(task, millis, millis);

    return task;
  }


  /**
   * Clear interval previously created via {@link #setInterval}.
   *
   * @param {Object} interval handle
   */
  function clearInterval(task) {
    if (task.cancel()) {
      phaser.arriveAndDeregister();
    }
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
      if (timeout < 0) {
        phaser.awaitAdvanceInterruptibly(phaser.arrive());
      } else {
        phaser.awaitAdvanceInterruptibly(phaser.arrive(), timeout, TimeUnit.MILLISECONDS);
      }
    } catch (e) {
      results = { err: new Error('execution timeout') };
    } finally {
      timer.cancel();
    }

    if (results.err) {
      throw results.err;
    } else {
      return results.result;
    }
  }

  context.exec = exec;

  context.async = async;

  context.setTimeout = setTimeout;
  context.clearTimeout = clearTimeout;
  context.setInterval = setInterval;
  context.clearInterval = clearInterval;

})(this);