// needed to handle server discovery requests of type OPTIONS
var optionsHandler = new function () {

	this.setDbConnection = function (dbConnection) {
	}
	
	this.canHandleRequest = function (req) {
		console.log('-- optionsHandler - canHandle ? ');
		const reqMethod = req.method.toUpperCase();
		if (reqMethod === "OPTIONS") {
			console.log('-- optionsHandler - canHandle ? YES ');
			return true;
		}

		console.log('-- optionsHandler - canHandle ? NO ');
		return false;
	}

	this.handleRequest = function (req, body, res) {
		console.log('-- optionsHandler - handle ');
		res.writeHead(200, {
			'Content-Type': 'text/plain, text/json', 
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
			'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Access-Control-Allow-Methods'
		});
		res.end();
		
		return true;
	}
}

module.exports = optionsHandler;