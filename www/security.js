var crypto = require('crypto');

var encrypt = function(string) {
    return crypto.createHash("sha1").update(string).digest("hex");
}

module.exports.encrypt = encrypt;
