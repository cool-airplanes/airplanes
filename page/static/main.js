var socket = io.connect('http://127.0.0.1:8080');
function alerts(message) {
    var x = "<div class='alert";
    if (message.ok) {
    	x += " alert-success'";
        message.what = "<strong> " + message.what + "</strong>";
    }
    else {
    	x += " alert-error'";
        message.what = "<strong>Oh snap!</strong> " + message.what;
    }
    x += ">" + message.what + " <button type='button' class='close'>x</button></div>";
    $("#alert-wrapper").html(x);
}

socket.on('register-response', alerts);

$(function() {
    $("#register").on("click", function() {
        if ($("#password").val() != $("#password2").val()) {
            alerts({"ok" : false, "what" : "The 2 passwords must match"});
            return;
        }
        var data = {
            "username" : $("#username").val(),
            "name" : $("#name").val(),
            "password" : $("#password").val()
        };

        socket.emit('register', data.username, data.name, data.password);
    	return false;
    });
    $(document).on("click", ".alert > .close ", function() {
    	$(this).parent().hide("normal");
    });
});
