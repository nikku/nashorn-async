var done = async();

var result = '';

setTimeout(function() {
  return done(null, result);
}, 200);


var timer = setInverval(function() {
  result += 'a';
}, 100);

// clear timer
clearInterval(timer);