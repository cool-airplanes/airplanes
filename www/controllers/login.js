var http = require('../../dbf/util.js');

function solve(username, password) {
	db.user.login(username, password, function(message) {
		socket.emit(message);
	});
}

exports.solve = solve;