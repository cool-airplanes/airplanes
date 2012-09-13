var fs = require('fs');
var session = require('./session.js');

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
    // we create the session and
    // we keep the socket in the session array
    user.connect.bind(this, socket)();

    socket.on('register', user.register.bind(this, socket));
    socket.on('login', user.login.bind(this, socket));
    socket.on('test', function(data) {
        console.log("Am primit un test!");
    });

    socket.on('logout', user.logout.bind(this, socket));
    // we clear the user from the set, logging him out if he was logged in
    socket.on('disconnect', user.disconnect.bind(this, socket));
});
