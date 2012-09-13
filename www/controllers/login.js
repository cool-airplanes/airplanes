var db = require('../../dbf/util.js');

function solve(socket, username, password) {
	db.user.login(username, password, function(message) {
		socket.emit('login-response', message);
	});
}

exports.solve = solve;
