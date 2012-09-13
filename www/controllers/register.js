var db = require('../../dbf/util.js');

function solve(socket, username, name, password) {
    db.user.add(username, name, password, function(message) {
        socket.emit('register-response', message);
    });
}

exports.solve = solve;
