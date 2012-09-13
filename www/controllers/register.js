var http = require('../../dbf/util.js');

function solve(username, name, password) {
	add.user(username, name, password, function(message) {
		if (!message.ok) {
			socket.emit("Error: " + message.what)
		} else {
			socket.emit("Register succesful")
		}
	});
}

exports.solve = solve;