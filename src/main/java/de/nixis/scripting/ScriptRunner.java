package de.nixis.scripting;

import java.io.IOException;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

/**
 * Create a script runner that executes the give script inside an
 * async-capable closure.
 *
 * @example
 *
 * ScriptRunner runner = new ScriptRunner("/foo.js");
 *
 * // execute with 5 seconds timeout
 * runner.execute(5000);
 *
 * @author nico.rehwaldt
 */
public class ScriptRunner {

  private final String script;

  public ScriptRunner(String script) {
    this.script = script;
  }

  /**
   * Execute script without a timeout.
   *
   * @return the execution result
   *
   * @throws ScriptException
   * @throws IOException
   */
  public Object execute() throws ScriptException, IOException {
    return execute(-1);
  }

  /**
   * Execute script with the given timeout in miliseconds.
   *
   * @param timeoutMs
   *
   * @return the execution result
   *
   * @throws ScriptException
   * @throws IOException
   */
  public Object execute(int timeoutMs) throws ScriptException, IOException {
    ScriptEngine engine = new ScriptEngineManager().getEngineByName("nashorn");

    // event loop
    engine.eval(IO.readScript("/js/event-loop.js"));

    return engine.eval("exec(function() { \n" + script + "\n}, " + timeoutMs + ");");
  }
}
