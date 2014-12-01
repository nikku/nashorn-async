function plus(a, b, done) {
  setTimeout(function() {
    throw new Error('fail');
  }, 100);
}

plus(1, 2, async());