var done = async();

var result = '';

var timer = setInterval(function() {
  result = 'ok';

  throw new Error('fail');
}, 100);

setTimeout(function() {
  clearInterval(timer);

  done(null, result);
}, 200);