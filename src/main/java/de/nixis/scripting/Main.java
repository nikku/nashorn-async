package de.nixis.scripting;

import java.util.Arrays;
import java.util.List;

/**
 *
 * @author nico.rehwaldt
 */
public class Main {
  
  public static void main(String[] args) throws Exception {
    
    List<String> scripts = Arrays.asList("async.js", "async-error.js", "async-uncaught-error.js", "sync.js", "sync-error.js");
    
    scripts.stream().forEach((s) -> {

      System.out.println("exec " + s);
      
      try {
        String script = IO.readScript("/scripts/" + s);

        ScriptRunner execution = new ScriptRunner(script);

        Object result = execution.execute();
        System.out.println("result " + result);
        
      } catch (Exception e) {
        System.out.println("error " + e);
      }
      
      System.out.println();
    });
  }
}
