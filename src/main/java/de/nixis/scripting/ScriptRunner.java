package de.nixis.scripting;

import java.io.IOException;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

/**
 *
 * @author nico.rehwaldt
 */
public class ScriptRunner {
  
  private final String script;

  public ScriptRunner(String script) {
    this.script = script;
  }

  public Object execute() throws ScriptException, IOException {
    
    ScriptEngine engine = new ScriptEngineManager().getEngineByName("nashorn");
    
    // event loop
    engine.eval(IO.readScript("/scripts/support/event-loop.js"));
  
    return engine.eval("exec(function() { \n" + script + "\n}, 1000);");
  }
}
