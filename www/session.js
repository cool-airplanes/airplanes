var Container = function() {
    this.data = {}

    this.set = function(id, value) {
        this.data[id] = value;
    }

    this.get = function(id) {
        return this.data[id];
    }
}

var session = {
    sockets : new Container(),

    users : new Container(),
};

module.exports = session;

