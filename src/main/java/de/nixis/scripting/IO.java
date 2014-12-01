package de.nixis.scripting;

import java.io.IOException;
import java.io.InputStream;
import org.apache.commons.io.IOUtils;

/**
 *
 * @author nico.rehwaldt
 */
public class IO {

  public static String readScript(String path) throws IOException {
    try (InputStream is = IO.class.getResourceAsStream(path)) {
      return IOUtils.readLines(is).stream().reduce((a, b) -> a + b).orElse("");
    } finally {
      // yup
    }
  }
}
