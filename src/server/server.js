var http = require('http');
var url = require('url');
var qs = require('querystring');
var ChainedRequestHandler = require('./chain_handler.js');

http.createServer(function(req, res) {
	var body = "";
	req.on('data', function (data) {
		body += data;
		// Too much POST data, kill the connection!
		// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
		if (body.length > 1e6)	{
			req.connection.destroy();
		}
	});
	req.on('end', function () {
		console.log('-- Received req = ' + req.method + ' url = ' + req.url);
		if (body) {
			body = JSON.parse(body);
		}
		if (ChainedRequestHandler.handleRequest(req, body, res) !== true) {
			console.log('-- Could not handle ' + req.method);
			res.writeHead(404, { 'Content-Type': 'text/plain' });
			res.write('Page not found :P');
			res.end();
		} else {
			console.log(' -- Hihi -- request handled !');
		}
		console.log('\n\n');
	});
}).listen(81, 'localhost');
