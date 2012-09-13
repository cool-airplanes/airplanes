var socket = io.connect('http://127.0.0.1:8080');

function register(username, name, password) {
	socket.emit('register', { username: username, name: name, password: password });
}

function login(username, password) {
	socket.emit('login', { username: username, password: password });
}