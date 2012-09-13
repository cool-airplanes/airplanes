var socket = io.connect('http://127.0.0.1:8080');
socket.on('register-response', function(message) {
    //alert(message.what);    
    var x = "<div class='alert";
    if (message.ok)
    	x += " alert-success'";
    else
    	x += " alert-error'";
    x += ">" + message.what + " <button type='button' class='close'>x</button></div>";
    $("#alert-wrapper").html(x);
});

$(function() {
    $("#register").on("click", function() {
        var data = {
            "username" : $("#username").val(),
            "name" : $("#name").val(),
            "password" : $("#password").val()
        };

        socket.emit('register', data.username, data.name, data.password);
    	return false;
    });
    $(document).on("click", ".alert > .close ", function() {
    	$(this).parent().hide("slow");
    });
});
