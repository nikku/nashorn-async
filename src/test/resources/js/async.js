function plus(a, b, done) {
  
  setTimeout(function() {
    done(null, "3");
  }, 100);
}

plus(1, 2, async());