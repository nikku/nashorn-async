package de.nixis.scripting;

import static de.nixis.scripting.Helper.runScript;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;

import org.junit.Test;

/**
 *
 * @author nikku
 */
public class AsyncTest {

  @Test
  public void async() throws Exception {
    Object result = runScript("async.js");

    assertThat(result).isEqualTo(3l);
  }

  @Test
  public void asyncError() {
    try {
      runScript("async-error.js");

      fail("expected error");
    } catch (Exception e) {
      assertThat(e).hasMessageStartingWith("Error: fail in");
    }
  }

  @Test
  public void asyncTimeout() {
    try {
      runScript("async-timeout.js");

      fail("expected timeout");
    } catch (Exception e) {
      assertThat(e).hasMessageContaining("Error: execution timeout");
    }
  }

  @Test
  public void setTimeoutClear() throws Exception {
    Object result = runScript("setTimeout-clear.js", 3000);

    assertThat(result).isEqualTo("");
  }

  @Test
  public void setTimeoutUncaughtError() throws Exception {
    Object result = runScript("setTimeout-uncaught-error.js", 3000);
    
    assertThat(result).isEqualTo("ok");
  }

  @Test
  public void setInterval() throws Exception {
    Object result = runScript("setInterval.js", 2000);

    assertThat(result).isEqualTo("aa");
  }

  @Test
  public void setIntervalClear() throws Exception {
    Object result = runScript("setInterval-clear.js", 3000);

    assertThat(result).isEqualTo("");
  }

  @Test
  public void setIntervalUncaughtError() throws Exception {
    Object result = runScript("setInterval-uncaught-error.js");

    assertThat(result).isEqualTo("ok");
  }

}
