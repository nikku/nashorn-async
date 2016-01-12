var done = async();

var result = '';

setTimeout(function() {
  result = 'ok';

  throw new Error('fail');
}, 100);

setTimeout(function() {
  done(null, result);
}, 200);