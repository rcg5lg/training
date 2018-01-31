var optionsHandler = require('./handlers/optionsHandler.js');
var authHandler = require('./handlers/authHandler.js');
var userHandler = require('./handlers/userHandler');
var groupHandler = require('./handlers/groupHandler');
var postHandler = require('./handlers/postHandler');

var dbConnection = require('./dbConnection.js');

var HandlerChainWrapper = function (handler, dbConnection) {
	this.internalHandler = handler;
	this.internalHandler.setDbConnection(dbConnection);
	this.nextChainItem = null;

	this.addNextHandler = function (nextChain) {
		this.nextChainItem = nextChain;
	}

	this.handleRequest = function (req, body, res) {
		// try to handle the request internally
		if (this.internalHandler.canHandleRequest(req)) {
			return this.internalHandler.handleRequest(req, body, res);
		}

		// ask the next item in the chain to attempt to handle
		if (this.nextChainItem) {
			return this.nextChainItem.handleRequest(req, body, res);
		}

		// nobody can handle... so just return false
		return false;
	}
}

var optionsChain = new HandlerChainWrapper(optionsHandler, dbConnection);
var authChain = new HandlerChainWrapper(authHandler, dbConnection);
var userChain = new HandlerChainWrapper(userHandler, dbConnection);
var groupChain = new HandlerChainWrapper(groupHandler, dbConnection);
var postChain = new HandlerChainWrapper(postHandler, dbConnection);

optionsChain.addNextHandler(authChain);
authChain.addNextHandler(userChain);
userChain.addNextHandler(groupChain);
groupChain.addNextHandler(postChain);

module.exports = optionsChain;