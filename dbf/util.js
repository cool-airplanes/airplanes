var mongodb = require('mongojs').connect('127.0.0.1:28080/avioane', ['users', 'games', 'pool']);

var user = {}

user.add = function(username, name, password, callback) {
    // TODO: check username, name, password
    // TODO: hash password
    //
    // check if user exists
    mongodb.users.find({"username" : username}, function(err, result) {
        if (result.length) {
            callback({"ok" : false, "what" : "User already exists."});
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
                if (!saved || err) {
                    callback({"ok" : false, "what" : "Error adding user."});
                    return;
                }
                callback({"ok" : true, "what" : "OK!"});
            });
        }
    });
}

user.get = function(username, callback) {
    // TODO: check username
    mongodb.users.find({"username" : username}, function(err, result) {
         if (err) {
            callback({"ok" : false, "what" : "Error finding user."}, {});
        } else {
            if (result.length) {
                callback({"ok" : true, "what" : "OK!"},
                    {
                        "username" : result[0].username,
                        "password" : result[0].password,
                        "name" : result[0].name,
                        "status" : result[0].status,
                        "in_game" : result[0].in_game
                    });
            } else {
                callback({"ok" : false, "what" : "User does not exist!"}, {});
            }
        }
    });
}

user.update = function(username, name, password, callback) {
    // TODO: check name and password
    user.get(username, function(result) {
        if (!result.ok) {
            callback(result);
            return;
        }
        mongodb.users.update({"username" : username}, {$set: {"name": name, "password" : password}}, function(error, updated) {
            if (error || !updated) {
                callback({"ok" : false, "what" : "Error saving information"});
                return;
            }
            callback({"ok" : true, "what" : "OK!"});
        });
    });
}

user.login = function(username, password, callback) {
    user.get(username, function(err, result) {
        if (!err.ok) {
            callback(err);
            return;
        }
        if (result.password != password) {
            callback({"ok" : false, "what" : "Wrong password!"});
            return;
        }
        if (result.status != "offline") {
            callback({"ok" : false, "what" : "User already logged in."});
            return;
        }

        // update
        mongodb.users.update({"username" : username}, {$set: {"status" : "online"}}, function(err, updated) {
            if (err || !updated) {
                callback({"ok" : false, "what" : "Error loging in."});
                return;
            }
            callback({"ok" : true, "what" : "OK!"});
        })
    })
}

user.logout = function(username, password, callback) {
    // TODO: disconnect from game
    user.get(username, function(err, result) {
        if (!err.ok) {
            callback(err);
            return;
        }
        if (result.password != password) {
            callback({"ok" : false, "what" : "Wrong password!"});
            return;
        }
        if (result.status == "offline") {
            callback({"ok" : false, "what" : "User is offline."});
            return;
        }

        // update
        mongodb.users.update({"username" : username}, {$set: {"status" : "offline"}}, function(err, updated) {
            if (err || !updated) {
                callback({"ok" : false, "what" : "Error loging in."});
                return;
            }
            callback({"ok" : true, "what" : "OK!"});
        })
    })
}

module.exports.user = user;
