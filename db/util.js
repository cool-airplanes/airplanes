var mongodb = require('mongojs').connect('127.0.0.1:28080/avioane', ['users', 'games']);
var verify = require('../verifier');
var security = require('../www/security');

var user = {}

user.add = function(username, name, password, callback) {
    // input validation
    userCheck = verify.isValidUsername(username);
    passwordCheck = verify.isValidPassword(password);
    if (!userCheck.ok) {
        callback(userCheck);
        return;
    }
    if (!passwordCheck.ok) {
        callback(passwordCheck);
        return;
    }

    // check if user exists
    mongodb.users.find({"username" : username}, function(err, result) {
        if (result.length) {
            callback({"ok" : false, "what" : "User already exists."});
        } else {
            var user = {
                "username" : username,
                "name" : name,
                "password" : security.encrypt(password),
                "in_game" : "null"
            };

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
    // input validation
    userCheck = verify.isValidUsername(username);
    if (!userCheck.ok) {
        callback(userCheck);
        return;
    }

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
    // input validation
    userCheck = verify.isValidUsername(username);
    passwordCheck = verify.isValidPassword(password);

    if (!userCheck.ok) {
        callback(userCheck);
        return;
    }
    if (!passwordCheck.ok) {
        callback(passwordCheck);
        return;
    }

    user.get(username, function(result) {
        if (!result.ok) {
            callback(result);
            return;
        }

        mongodb.users.update({"username" : username}, {$set: {"name": name, "password" : security.encrypt(password)}}, function(error, updated) {
            if (error || !updated) {
                callback({"ok" : false, "what" : "Error saving information"});
                return;
            }
            callback({"ok" : true, "what" : "OK!"});
        });
    });
}

module.exports.user = user;
