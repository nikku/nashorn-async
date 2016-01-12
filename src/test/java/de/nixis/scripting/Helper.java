package de.nixis.scripting;

import java.io.IOException;
import javax.script.ScriptException;

/**
 *
 * @author nikku
 */
public class Helper {

  public static Object runScript(String path) throws IOException, ScriptException {
    return runScript(path, 1000);
  }

  public static Object runScript(String path, int timeoutMs) throws IOException, ScriptException {

    String script = IO.readScript("/js/" + path);

    ScriptRunner execution = new ScriptRunner(script);

    return execution.execute(timeoutMs);
  }
}
