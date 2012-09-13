var io = require('socket.io').listen(9200);
var db = require('../../dbf/util.js');
var session = require('../../www/session.js');

function connect(socket) {
    session.sockets.set(socket.id, {
        "socket" : socket
    });
}

function register(socket, username, name, password) {
    db.user.add(username, name, password, function(message) {
        socket.emit('register-response', message);
    });
}

function login(socket, username, password) {
    db.user.get(username, function(message, result) {
        if (!message.ok) {
            socket.emit('login-response', message);
            return;
        }
        if (password != result.password) {
            socket.emit('login-response', {"ok" : false, "what" : "Wrong password"});
            return;
        }

        if (session.users.get(username) !== undefined) {
            socket.emit('login-response', {"ok" : false, "what" : "User already logged in"});
            return;
        }

        session.sockets.get(socket.id).username = username;
        session.sockets.get(socket.id).password = password;
        session.sockets.get(socket.id).name = result.name;
        session.sockets.get(socket.id).game = undefined;

        session.users.set(username, {
            "username" : username,
            "password" : password,
            "name" : result.name,
            "game" : undefined,
            "socket" : socket
        });

        socket.emit('login-response', {"ok" : true, "what" : "OK!"});
    });
}

function logout(socket) {
    if (session.sockets.get(socket.id).username === undefined) {
        socket.emit('logout-response', {"ok" : false, "what" : "Not logged in"});
        return;
    }

    var username = session.sockets.get(socket.id).username;
    session.users.set(username, undefined);
    session.sockets.set(socket.id, { "socket" : socket});
}

function disconnect(socket) {
    // we will send with no avail, but that's okay right?
    logout(socket);

    session.sockets.set(socket.id, undefined);

}

module.exports.connect = connect;
module.exports.register = register;
module.exports.login = login;
module.exports.logout = logout;
module.exports.disconnect = disconnect;
