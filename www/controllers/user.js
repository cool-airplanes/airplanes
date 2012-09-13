var io = require('socket.io').listen(9200);
var register = require('./register.js');
var login = require('./login.js');

exports.register = register.solve;
exports.login = login.solve;
