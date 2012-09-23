var loader = require('../loader');

function start (socket)
{
	socket.emit('game-init-response', {"ok" : true, "what" : "OK!", "html": loader.loadPage("game.html")});
}

module.exports.start = start;