var io = require('socket.io').listen(9200);
var register = require('./register.js');
var login = require('./login.js');

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  
  /*Login event*/
  socket.on('Login', login.solve);

  /*Register event*/
  socket.on('Register', register.solve);

  
});