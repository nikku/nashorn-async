var done = async();

var results = '';

var timer = setInterval(function() {
  results += 'a';
}, 400);

setTimeout(function() {
  clearInterval(timer);

  done(null, results);
}, 1000);