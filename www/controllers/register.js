var http = require('../../dbf/util.js');

function solve(username, name, password) {
	add.user(username, name, password, function(message) {
		socket.emit(message);
	});
}

exports.solve = solve;