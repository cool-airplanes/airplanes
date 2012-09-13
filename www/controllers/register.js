var db = require('../../dbf/util.js');

function solve(username, name, password) {
	db.user.add(username, name, password, function(message) {
		socket.emit(message);
	});
}

exports.solve = solve;