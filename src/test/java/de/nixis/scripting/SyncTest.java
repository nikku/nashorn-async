package de.nixis.scripting;

import static de.nixis.scripting.Helper.runScript;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;
import org.junit.Test;


/**
 *
 * @author nikku
 */
public class SyncTest {

  @Test
  public void testResult() throws Exception {
    Object result = runScript("sync.js");

    assertThat(result).isEqualTo(3.0);
  }

  @Test
  public void testError() {

    try {
      runScript("sync-error.js");

      fail("expected error");
    } catch (Exception e) {
      assertThat(e).hasMessageStartingWith("Error: fail in");
    }
  }
  
}
