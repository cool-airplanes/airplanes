function LobbyUser(id, name, won, lost, status) {
	this._name = name;
	this._won = won;
	this._lost = lost;
	this._status = status;

	this.html = document.createElement("div");
	this.html.id = id;
	this.html.class = "lobby-user";
	this.html.innerHTML = '<div class = "score"> ' +
							'<div class = "won"> <strong> ' + this.won + '</strong> <span> won </span> </div>' +
							'<div class = "lost"> <strong> ' + this.lost + '</strong> <span> lost </span> </div>' + 
					'</div>' +
					'<div class = "name"> ' + 
						'<strong>' + this.name + '</strong>' +
						'<span> ' + this.status + '</span>'
					'</div>' +
					'<div class= "buttons">' +
						'<button class = "btn type"> VIEW </button>' +
						'<button class = "btn type"> CHALLENGE </button>' +
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
