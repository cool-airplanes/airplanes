var crypto = require('crypto');
var mongodb = require('mongojs').connect('127.0.0.1:28080/avioane', ['users']);

console.log("Begin...");
mongodb.users.find({}, function(err, results) {
    if (err) {
        console.log("Could not get users from db.");
        return;
    }

    for (var i = 0; i < results.length; ++i) {
        console.log("user -> " + results[i].username);
        mongodb.users.update({ username: results[i].username }, { $set: { password: crypto.createHash("sha1").update(results[i].password).digest("hex") } }, function(err) {
            if (err) {
                console.log("ERROR");
                return;
            }
        });
    }

    console.log("Done.")
});