function plus(a, b, done) {
  
  setTimeout(function() {
    done(new Error('fail'));
  }, 100);
}

plus(1, 2, async());