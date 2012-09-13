var http = require('http');
var db = require('../dbf/util')

http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end("Hello World!\n");
}).listen(9200, '127.0.0.1');

console.log("Server running at http://127.0.0.1:9200")
