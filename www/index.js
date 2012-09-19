var fs = require('fs');
var path = require('path');
// we just need to serve static files, eveything is handled by socket.io

var server = require('http').createServer(function(request, response) {
    var filePath = request.url;

    if (filePath == '/')
        filePath = '/login.html';

    filePath = __dirname + '/../page/' + filePath;

    var contentType = filePath.substring(filePath.lastIndexOf('.') + 1);
    switch (contentType) {
        case 'html':
            break;
        case 'css':
            break;
        case 'js':
            contentType = 'javascript';
            break;
        default:
            contentType = 'plain';
    }

    path.exists(filePath, function(exists) {
        if (!exists) {
            response.writeHead(404);
            response.end("Page " + request.url + " not found");
            return;
        }

        var header = "", footer = "";
        if (contentType === 'html') {
            header = fs.readFileSync(__dirname + '/../page/header.html');
            footer = fs.readFileSync(__dirname + '/../page/footer.html');
        }

        fs.readFile(filePath, function (error, data) {
            if (error) {
                response.writeHead(500);
                response.end('Error loading ' + request.url);
            }


            response.writeHead(200, {'Content-Type': 'text/' + contentType});
            if (header !== "") {
                data = header + data;
            }

            if (footer !== "") {
                data = data + footer;
            }

            response.end(data);
        })
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
    socket.on('logout', user.logout.bind(this, socket));
    // we clear the user from the set, logging him out if he was logged in
    socket.on('disconnect', user.disconnect.bind(this, socket));
    socket.on('user-list', user.sendUserList.bind(this, socket));

    socket.on('challenge-question', user.challengeQuestion.bind(this, socket));
    socket.on('challenge-answer', user.challengeAnswer.bind(this, socket));
});
