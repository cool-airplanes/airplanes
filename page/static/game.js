GameBoard = function (nrows, ncols)
{
	this.table = document.createElement("table");
	this.table.id = "my-board";
	this._nrows = nrows;
	this._ncols = ncols;

	for (var i = 0; i < nrows; ++i)
	{
		var row = document.createElement("tr");
		row.id = 'r' + i;
		this.table.appendChild(row);
		for (var j = 0; j < ncols; ++j) {
			var cell = document.createElement("td");
			cell.id = 'r' + i + 'c' + j;
			cell.addEventListener("click", this.placeAirplane.bind(this), false);
			row.appendChild(cell); 	
		}		
	}	
}

GameBoard.Orientation = {
	HorizontalLeft : 'HorizontalLeft',
	HorizontalRight : 'HorizontalRight',
	VerticalUp : 'VerticalUp',
	VerticalDown : 'VerticalDown'
}

GameBoard.VerticalUp = {
	DX: [-1, 0, 0, 0, 0, 0, 1, 2, 2, 2],
	DY: [0, -2, -1, 0, 1, 2, 0, -1, 0, 1]
}
GameBoard.VerticalDown = { 
	DX: [-2, -2, -2, -1, 0, 0, 0, 0, 0, 1],
	DY: [-1, 0, 1, 0, -2, -1, 0, 1, 2, 0]
}
GameBoard.HorizontalLeft = {
	DX: [-2, -1, -1, 0, 0, 0, 0, 1, 1, 2],
	DY: [0, 0, 2, -1, 0, 1, 2, 0, 2, 0]
}
GameBoard.HorizontalRight = {
	DX: [-2, -1, -1, 0, 0, 0, 0, 1, 1, 2],
	DY: [0, -2, 0, -2, -1, 0, 1, -2, 0, 0]
}

GameBoard.changeOrientation = function(orientation)
{
	GameBoard.orientation = orientation;
}

GameBoard.prototype = {
	placeAirplane: function(event)
	{
		var position = this.getPositionFromId(event.target.id);
		if (this.validatePosition(position))
		{
			var dx = GameBoard[GameBoard.orientation].DX;
			var dy = GameBoard[GameBoard.orientation].DY;

			for (var i = 0; i < dx.length; ++i) {
				var nrow = position[0] + dx[i];
				var ncol = position[1] + dy[i];
				console.log([nrow, ncol, i]);
				document.getElementById('r' + nrow + 'c' + ncol).style.backgroundColor = 'red';
			}
		}
	}, 

	getPositionFromId : function(id)
	{
		return [ parseInt(id.split(RegExp('r|c'))[1]), parseInt(id.split(RegExp('r|c'))[2]) ];
	},
	
	validatePosition : function(position)
	{
		var dx = GameBoard[GameBoard.orientation].DX;
		var dy = GameBoard[GameBoard.orientation].DY;
		for (var i = 0; i < dx.length; ++i) {
			var x = position[0] + dx[i];
			var y = position[1] + dy[i];

			if (x < 0 || x >= this._nrows || y < 0 || y >= this._ncols) {
				console.log("(1) " + x + " " + y);
				return false;
			}
			if (document.getElementById('r' + x + 'c' + y).style.backgroundColor === 'red') {
				console.log("(2) " + x + " " + y);
				return false;
			}
		}
		
		return true;
	}	
}

initGame = function()
{
	var gameBoard = new GameBoard(10, 10);
	document.getElementById("game-board").appendChild(gameBoard.table);
}

socket.on('game-init-response', function (data)
{
	document.getElementById('main-content').innerHTML = data.html;
	console.log(data.html);
	initGame();
});

