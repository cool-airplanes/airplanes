var Container = function() {
    this.data = {}

    this.set = function(id, value) {
        this.data[id] = value;
    }

    this.get = function(id) {
        return this.data[id];
    }

    this.remove = function(id) {
        if (this.data[id] !== undefined)
            delete this.data[id];
    }
}

var session = {
    lobby : new Container(),
    sockets : new Container(),
    users : new Container()
};

module.exports = session;

