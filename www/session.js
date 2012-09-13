var Session = new function() {
    this.data = {}
    this.set = function(id, value) {
        this.data[id] = value;
    }

    this.get = function(id) {
        return this.data[id];
    }
};

module.exports = function() {
    return Object.create(Session);
}
