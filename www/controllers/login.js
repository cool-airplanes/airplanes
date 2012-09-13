var http = require('../../dbf/util.js');

function solve(username, name, password) {
	user.login(username, name, password, function(message) {
		socket.emit(message.what);
	});
}

exports.solve = solve;