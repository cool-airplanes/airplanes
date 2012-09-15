var db = require('../../dbf/util');
var session = require('../../www/session');
var settings = require('../settings')

var userListUpdated = false;

function connect(socket) {
    session.sockets.set(socket.id, { "socket" : socket });
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

        session.lobby.set(username, true);

        socket.emit('login-response', {"ok" : true, "what" : "OK!"});
        sendToLobby('user-login', {"username" : username, "name" : result.name});
    });
}

function logout(socket) {
    if (session.sockets.get(socket.id).username === undefined) {
        socket.emit('logout-response', {"ok" : false, "what" : "Not logged in"});
        return;
    }

    var username = session.sockets.get(socket.id).username;
    session.users.remove(username);
    session.lobby.remove(username);
    session.sockets.set(socket.id, { "socket" : socket});
    sendToLobby('user-logout', {"username" : username});
}

function disconnect(socket) {
    // we will send with no avail, but that's okay right?
    logout(socket);

    session.sockets.remove(socket.id);

}

function sendUserList(socket) {
    var userList = new Array();
    for (var username in session.users.data) {
        var user = session.users.get(username);
        userList.push({"username" : user.username, "name" : user.name});
    }

    userList.sort(function (user1, user2) {
        if (user1.username < user2.username)
            return -1;
        if (user1.username > user2.username)
            return 1;
        return 0;
    });

    socket.emit('user-list-response', userList);
}

function sendToLobby(event, data) {
    for (var username in session.lobby.data) {
        session.users.get(username).socket.emit(event, data);
    }
}

module.exports.connect = connect;
module.exports.register = register;
module.exports.login = login;
module.exports.logout = logout;
module.exports.disconnect = disconnect;
module.exports.sendUserList = sendUserList;
