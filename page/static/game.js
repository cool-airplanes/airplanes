/************************************************************************************************
    Plane container class -> a little tricky to enable drag and drop
************************************************************************************************/
PlaneContainer = function(plane)
{
    this.planeContainer = document.createElement("div");

    var plane = new Plane(Plane.Orientation.VerticalUp);
    this.planeContainer.appendChild(plane);

    this.planeContainer.class = "plane-container";
    this.planeContainer.id = "plane-container";
    this.planeContainer.ondrop ="plane.drop(event)";
    this.planeContainer.ondragover="plane.allowDrop(event)"
}


/*************************************************************************************************
    Plane class
**************************************************************************************************/

Plane = function(orientation, gameboard, position)
{
    this.plane = document.createElement("img");
    this.plane.src = "static/Images/zaPlain.png";
    this.plane.class = "airplane";
    this.plane.id = "drag-plane";
    this.plane.draggable = "true";
    this.plane.ondragstart = "drag(event)";
    this.plane.style.position = "absolute";
    this.orientation = orientation;
    this.gameboard = gameboard;
    this.position = position;
    this.identifier = GameBoard.nextPlaneID + "";
    ++GameBoard.nextPlaneID;
}

Plane.Orientation = {
    HorizontalLeft : 'HorizontalLeft',
    HorizontalRight : 'HorizontalRight',
    VerticalUp : 'VerticalUp',
    VerticalDown : 'VerticalDown'
}

Plane.VerticalUp = {
    DX: [-1, 0, 0, 0, 0, 0, 1, 2, 2, 2],
    DY: [0, -2, -1, 0, 1, 2, 0, -1, 0, 1]
}

Plane.VerticalDown = { 
    DX: [-2, -2, -2, -1, 0, 0, 0, 0, 0, 1],
    DY: [-1, 0, 1, 0, -2, -1, 0, 1, 2, 0]
}
Plane.HorizontalLeft = {
    DX: [-2, -1, -1, 0, 0, 0, 0, 1, 1, 2],
    DY: [0, 0, 2, -1, 0, 1, 2, 0, 2, 0]
}
Plane.HorizontalRight = {
    DX: [-2, -1, -1, 0, 0, 0, 0, 1, 1, 2],
    DY: [0, -2, 0, -2, -1, 0, 1, -2, 0, 0]
}

Plane.orientation = Plane.Orientation.VerticalUp;

Plane.prototype = {
    setProprieties: function(top, left)
    {
        this.plane.style.top = top+"px";
        this.plane.style.left = left+"px";
        console.log(top + ' ' + left);
    },

    getNextOrientation: function(orientation)
    {
        if (orientation === Plane.Orientation.VerticalUp)
            return Plane.Orientation.HorizontalRight;
        else if (orientation === Plane.Orientation.HorizontalRight)
            return Plane.Orientation.VerticalDown;
        else if (orientation === Plane.Orientation.VerticalDown)
            return Plane.Orientation.HorizontalLeft;
        else return Plane.Orientation.VerticalUp;
    },
    placeAirplane: function()
    {
        var position = this.position;
        console.log(position + " " + GameBoard.Dimensions.cellHeight);
        if (this.gameboard.validatePosition(this.orientation, position))
        {
            var dx = Plane[this.orientation].DX;
            var dy = Plane[this.orientation].DY;
            console.log(this.orientation);
            for (var i = 0; i < dx.length; ++i) {
                var nrow = position[0] + dx[i];
                var ncol = position[1] + dy[i];
                console.log([nrow, ncol, i]);
                var cell = document.getElementById('r' + nrow + 'c' + ncol);
                cell.style.backgroundColor = "red";
                cell.classList.add("plane"+this.identifier);

            }
            this.setProprieties(parseInt(GameBoard.Dimensions.cellHeight) * (position[0] - dx[0]), parseInt(GameBoard.Dimensions.cellWidth) * (position[1] - dy[0]));
            console.log(this.plane.style.top);
            document.getElementById('game-board').appendChild(this.plane);
            return true;
        }
        return false;

    },

    clearAirplane : function()
    {
        var position = this.position;
        var dx = Plane[this.orientation].DX;
        var dy = Plane[this.orientation].DY;

        for (var i = 0; i < dx.length; ++i) {
            var nrow = position[0] + dx[i];
            var ncol = position[1] + dy[i];
            console.log([nrow, ncol, i]);
            document.getElementById('r' + nrow + 'c' + ncol).style.backgroundColor = 'white';
        }
        document.getElementById('game-board').removeChild(this.plane);
    },

    rotateAirplane : function()//event)
    {
        this.clearAirplane();
        do {
        this.orientation = this.getNextOrientation(this.orientation);
        }while(!this.placeAirplane());//event);
    },  

    allowDrop : function(event)
    {
        event.preventDefault();
    },

    drag : function(event)
    {
        event.dataTransfer.setData("Text",event.target.id);
    },

    drop : function(event)
    {
        event.preventDefault();
        var data = event.dataTransfer.getData("Text");
        event.target.appendChild(document.getElementById(data));
    }

}

/**************************************************************************************************
    GameBoard class
***************************************************************************************************/

GameBoard = function (nrows, ncols, player)
{
    this.table = document.createElement("table");
    this.table.id = "p-" + player;
    this._nrows = nrows;
    this._ncols = ncols;
    this._player = player;
    this.placedPlanes = 0;
    this.planes = {}

    for (var i = 0; i < nrows; ++i)
    {
        var row = document.createElement("tr");
        row.id = 'r' + i;
        this.table.appendChild(row);
        for (var j = 0; j < ncols; ++j) {
            var cell = document.createElement("td");
            cell.id = 'r' + i + 'c' + j;
            
            //TODO another event listener !!! (need drag and drop)
            cell.addEventListener("click", this.placeAirplane.bind(this), false);
            cell.addEventListener("contextmenu", this.rotateAirplane.bind(this), false);
            row.appendChild(cell);  
        }       
    }   
}

GameBoard.Dimensions = {
    cellWidth : "40px",
    cellHeight : "40px"
}
GameBoard.MaxPlanes = 2
GameBoard.nextPlaneID = 0
GameBoard.State = {
    PlacingPlanes : 'PlacingPlanes',
    SelectMove : 'SelectMove',
    WaitingMove : 'WaitingMove' 
}

GameBoard.prototype = {
    
    getPositionFromId : function(id)
    {
        return [ parseInt(id.split(RegExp('r|c'))[1]), parseInt(id.split(RegExp('r|c'))[2]) ];
    },
    
    validatePosition : function(orientation, position)
    {
        var dx = Plane[orientation].DX;
        var dy = Plane[orientation].DY;
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
    },

    placeAirplane : function(event)
    {
        if (this.placedPlanes == GameBoard.MaxPlanes)
            return false;
        ++this.placedPlanes;
        var plane = new Plane(Plane.Orientation.VerticalUp, this, this.getPositionFromId(event.target.id));
        this.planes["plane"+plane.identifier] = plane;
        plane.placeAirplane();

        var planeContainer = new PlaneContainer(plane);
        document.getElementById("main-content").appendChild(planeContainer);

    rotateAirplane : function(event)
    {
        var position = this.getPositionFromId(event.target.id);
        if (document.getElementById(event.target.id).style.backgroundColor === "red")
        {
            var planeID = null;
            for (var i = 0; i < event.target.classList.length; ++i)
                if (event.target.classList[i].match("plane[0-9]*")){
                    planeID = event.target.classList[i];
                    break;
                }
            if (event.stopPropagation)
                event.stopPropagation();
            event.cancelBubble = true;
            if (!planeID)
                return false;
            var plane = this.planes[planeID];
            if (!plane)
                return false;
            plane.rotateAirplane();
            return false;
        }

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
    initGame();
});


/************************************************************************************************
    Game class
*************************************************************************************************/
Game = function(gameBoard1, gameBoard2)
{
    this.gameSpace = document.createElement("div");
    this._gameBoard1 = gameBoard1;
    this._gameBoard1.id = "gameBoard1";
    this._gameBoard2 = gameBoard2;
    this._gameBoard2.id = "gameBoard2";
    this.gameSpace.appendChild(this._gameBoard1);
    this.gameSpace.appendChild(this._gameBoard2);
}

Game.prototype = {
    start : function(state) 
    {
        //TODO game start
    },

    waiting : function()
    {
        //TODO waiting for opponent
    }
}

socket.on('game-start-response', function(data){
    document.getElementById('main-content').innerHTML = data.html;
    console.log(data.html);
    play()
});
