var done = async();

var result = '';

setTimeout(function() {
  return done(null, result);
}, 100);

var timer = setTimeout(function() {
  result += 'a';
}, 200);

// clear timer
clearTimeout(timer);