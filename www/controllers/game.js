var loader = require('../loader');

function start(user1, user2)
{
    var html = loader.loadPage("game.html");
    user1.socket.emit('game-init-response', { ok: true, what: "OK!", opponent: user2.username, html: html });
    user2.socket.emit('game-init-response', { ok: true, what: "OK!", opponent: user1.username, html: html });
}

module.exports.start = start;
