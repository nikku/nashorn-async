function plus(a, b, done) {
  
  setTimeout(function() {
    done(null, a + b);
  }, 100);
}

plus(1, 2, async());