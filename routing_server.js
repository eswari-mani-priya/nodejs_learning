var http = require('http');
var app = require('./routing_app');

http.createServer(app.handleRequest).listen(8000)