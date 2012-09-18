function LobbyUser(id, name, won, lost, status) {
    this._name = name;
    this._won = won;
    this._lost = lost;
    this._status = status;

    this.html = document.createElement("div");
    this.html.id = id;
    this.html.className = "lobby-user";
    this.html.innerHTML = '<div class = "score"> ' +
                            '<div class = "won"> <strong> ' + this.won + '</strong> <span> won </span> </div>' +
                            '<div class = "lost"> <strong> ' + this.lost + '</strong> <span> lost </span> </div>' + 
                    '</div>' +
                    '<div class = "name"> ' + 
                        '<strong>' + this.name + '</strong>' +
                        '<span> ' + this.status + '</span>' +
                    '</div>' +
                    '<div class= "buttons">' +
                        '<button class = "btn green"> VIEW </button>' +
                        '<button class = "btn green"> CHALLENGE </button>' +
                    '</div>'
}

LobbyUser.prototype = {
    set status(newStatus) {
        this._status = newStatus;
        this.html.getElementsByClassName("name")[0].lastElementChild.textContent = newStatus;
    },

    get status() {
        return this._status;
    },

    set lost(lost) {
        this._lost = lost;
        this.html.getElementsByClassName("lost")[0].firstElementChild.textContent = lost;
    },

    get lost() {
        return this._lost;
    },

    set won(won) {
        this._won = won;
        this.html.getElementsByClassName("won")[0].firstElementChild.textContent = won;
    },

    get won() {
        return this._won;
    },

    set name(newName) {
        this._name = newName;
        this.html.getElementsByClassName("name")[0].firstElementChild.textContent = newName;
    },

    get name() {
        return this._name;
    }
}

socket.on('user-list-response', function(userList) {
    var lobbyElement = document.getElementById("lobby");

    for (var i = 0; i < userList.length; ++i) {
        var lobbyUser = new LobbyUser("u-" + userList[i].username, userList[i].name, 50, 50, "Waiting for challenge...");
        lobbyElement.appendChild(lobbyUser.html);

    }

    socket.on('user-login', function(user) {
        var lobbyUser = new LobbyUser("u-" + user.username, user.name, 50, 50, "Waiting for challenge...");
        document.getElementById("lobby").appendChild(lobbyUser.html);
    });

    socket.on('user-logout', function(user) {
        document.getElementById("lobby").removeChild(document.getElementById("u-" + user.username));
    });
});
