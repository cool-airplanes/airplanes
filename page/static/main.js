var socket = io.connect('http://127.0.0.1:8080');
socket.on('register-response', function(message) {
    alert(message.what);
});
socket.on('login-response', function(message) {
    alert(message.what);
});

$(function() {
    $("#register").on("click", function() {
        var data = {
            "username" : $("#username").val(),
            "name" : $("#name").val(),
            "password" : $("#password").val()
        };

        socket.emit('register', data.username, data.name, data.password);
    });

    // TODO: user better selectors
    $("#login").on("click", function() {
        var data = {
            "username" : $("#login_username").val(),
            "password" : $("#login_password").val()
        };

        socket.emit('login', data.username, data.password);
    })
});
