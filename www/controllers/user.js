var db = require('../../db/util');
var loader = require('../loader');
var session = require('../../www/session');
var security = require('../security');

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
        if (security.encrypt(password) != result.password) {
            socket.emit('login-response', {"ok" : false, "what" : "Wrong password"});
            return;
        }

        if (session.users.get(username) !== undefined) {
            socket.emit('login-response', {"ok" : false, "what" : "User already logged in"});
            return;
        }

        session.sockets.get(socket.id).username = username;
        session.sockets.get(socket.id).password = security.encrypt(password);
        session.sockets.get(socket.id).name = result.name;
        session.sockets.get(socket.id).game = undefined;

        session.users.set(username, {
            "username" : username,
            "password" : security.encrypt(password),
            "name" : result.name,
            "game" : undefined,
            "socket" : socket,
            "challenged" : {},
            "challengedBy" : {}
        });

        session.lobby.set(username, true);

        socket.emit('login-response', {"ok" : true, "what" : "OK!", "html": loader.loadPage("lobby.html")});
        sendToLobby('user-login', {"username" : username, "name" : result.name});
    });
}

function logout(socket) {
    if (session.sockets.get(socket.id).username === undefined) {
        socket.emit('logout-response', {"ok" : false, "what" : "Not logged in"});
        return;
    }

    var user = session.users.get(session.sockets.get(socket.id).username);

    cancelSentChallenges(user);
    rejectReceivedChallenges(user);

    session.users.remove(user.username);
    session.lobby.remove(user.username);
    session.sockets.set(socket.id, { "socket" : socket});

    sendToLobby('user-logout', {"username" : user.username});
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

function challengeQuestion(socket, data) {
    var challenger = session.users.get(socket.username);
    var challenged = session.users.get(data.opponent);

    if (!challenged)
        return;

    if (challenger.challenged[challenged.username]) {
        socket.emit('challenge-question-response', { ok: false, what: "Already challenged " + challenged.name });
        return;
    }

    if (challenged.challenged[challenger.username]) {
        socket.emit('challenge-question-response', { ok: false, what: "You are already challenged by " + challenged.name });
        return;
    }

    challenger.challenged[challenged.username] = true;
    challenged.challengedBy[challenger.username] = true;

    challenged.socket.emit('challenge-received', { opponent: challenger.username });
    challenger.socket.emit('challenge-question-response', { ok: true, what: "Challenge sent to " + challenged.name + "!", opponent: challenged.username });
}

function challengeAnswer(socket, data) {
    var challenger = session.users.get(data.username);
    var challenged = session.users.get(socket.username);

    if (!challenger)
        return;

    if (!challenger.challenged[challenged.username] || !challenged.challengedBy[challenger.username]) {
        socket.emit('challenge-answer-reponse', { ok: false, what: "Invalid challenge" });
        return;
    }

    delete challenger.challenged[challenged.username];
    delete challenged.challengedBy[challenger.username];

    if (data.answer) {
        startGame(challenger, challenged);
        return;
    }

    challenger.socket.emit('challenge-rejected', { opponent: challenged.username });
}

function startGame(user1, user2) {
    cancelSentChallenges(user1);
    cancelSentChallenges(user2);
}

// Unexported
function sendToLobby(event, data) {
    for (var username in session.lobby.data) {
        session.users.get(username).socket.emit(event, data);
    }
}

// Unexported
function cancelSentChallenges(user) {
    for (var username in user.challenged) {
        var challenged = session.users.get(username);

        delete challenged.challengedBy[user.username];
        challenged.socket.emit('challenge-canceled', { opponent: user.username });
    }

    user.challenged = {};
}

// Unexported
function rejectReceivedChallenges(user) {
    for (var username in user.challengedBy) {
        var challenger = session.users.get(username);

        delete challenger.challenged[user.username];
        challenger.socket.emit('challenge-rejected', { opponent: user.username });
    }

    user.challengedBy = {};
}

module.exports.connect = connect;
module.exports.register = register;
module.exports.login = login;
module.exports.logout = logout;
module.exports.disconnect = disconnect;
module.exports.sendUserList = sendUserList;
module.exports.challengeQuestion = challengeQuestion;
module.exports.challengeAnswer = challengeAnswer;
