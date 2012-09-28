var loader = require('../loader');
var session = require('../../www/session');
var db = require('../../db/util');
// FIXME: this controller actually only uses session data. Maybe we should put it into db.
// However, this data is somewhat volatile; maybe it's better that way.
function init(user1, user2)
{
    var html = loader.loadPage("game.html");
    session.games.set(user1.username, {opponent:user2.username, board:{}});
    session.games.set(user2.username, {opponent:user1.username, board:{}});
    user1.socket.emit('game-init-response', { ok: true, what: "OK!", player : user1.username, opponent: user2.username, html: html });
    user2.socket.emit('game-init-response', { ok: true, what: "OK!", player : user2.username, opponent: user1.username, html: html });    	
}
function startRequest(socket, data)
{
	var player = data.user;
	console.log(player);
	console.log(data);
	var opponent = session.games.get(player).opponent;
	var board = data.board;
	console.log(opponent);
	// TODO: validate board
	session.games.get(player).board = board;
	console.log(session.games.get(opponent));
	// If the opponent has also sent his board
	if (session.games.get(opponent).board.length > 0) {
		session.users.get(player).socket.emit('game-start-response',{first:true});
		session.users.get(opponent).socket.emit('game-start-response',{first:false});
	}
}
function countStrikes(board)
{
	var ret = 0;
	for (var i = 0; i < board.length; ++i)
		for (var j = 0; j < board[i].length; ++j)
			if (board[i][j] == 2)
				++ret;
	return ret;
}
function sendMove(socket, opponent, move)
{
	var player = session.games.get(opponent).opponent;
	var playerSocket = session.users.get(player).socket;
	var opponentBoard = session.games.get(opponent).board;
	if (opponentBoard[move[0]][move[1]] == 1)
		playerSocket.emit('game-move-response', move, true);
	else
		playerSocket.emit('game-move-response', move, false);
	var opponentSocket = session.users.get(opponent).socket;
	opponentSocket.emit('game-receive-move', move);
	opponentBoard[move[0]][move[1]] = 2;
	// FIXME: Use something that's not a constant
	if (countStrikes(opponentBoard) == 1) {
		playerSocket.emit('game-finished', true);
		opponentSocket.emit('game-finished', false);
		db.user.exitGame(player.username, true, function(message){});
		db.user.exitGame(opponent.username, false, function(message){});
	}
}
module.exports.init = init;
module.exports.sendMove = sendMove;
module.exports.startRequest = startRequest;
