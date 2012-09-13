var fs = require('fs');

var server = require('http').createServer(function(request, response) {
  	fs.readFile(__dirname + '/../page/login.html', function (error, data) {
        if (error) {
          response.writeHead(500);
          return response.end('Error loading index.html');
        }

        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(data);
    });
});

var io = require('socket.io').listen(server);
server.listen(8080, '127.0.0.1');

var user = require('./controllers/user');

io.sockets.on('connection', function(socket) {
    socket.on('register', user.register);
    socket.on('login', user.login);
    socket.on('test', function(data) {
        console.log("Am primit un test!");
    });
});
