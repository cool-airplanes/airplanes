var mongodb = require('mongojs').connect('127.0.0.1:28080/avioane', ['users', 'games', 'pool']);

var add = {}

add.user = function(username, name, password, callback) {
    // TODO: check username, name, password
    // TODO: hash password
    //
    // check if user exists
    mongodb.users.find({"username" : username}, function(err, result) {
        if (result.length) {
            callback({"ok" : false, "what" : "Error: User already exists."});
        } else {
            var user = {
                "username" : username,
                "name" : name,
                "password" : password,
                "status" : "offline",
                "in_game" : "null"
            }; 
            console.log("username: ", username);
            console.log(JSON.stringify(user));
            mongodb.users.save(user, function(err, saved) {
                if (saved && !err) {
                    callback({"ok" : true, "what" : "ok baby"}); 
                }
            });
        }
    });
}

module.exports.add = add;
