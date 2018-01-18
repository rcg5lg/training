var optionsHandler = require('./handlers/optionsHandler.js');
var userHandler = require('./handlers/userHandler');
var groupHandler = require('./handlers/groupHandler');
// var postHandler = require('./handlers/postHandler');

var HandlerChainWrapper = function(handler) {
	this.internalHandler = handler;
	this.nextChainItem = null;
	
	this.addNextHandler = function(nextChain) {
		this.nextChainItem = nextChain;
	}
	
	this.handleRequest = function(req, body, res) {
		// try to handle the request internally
		if(this.internalHandler.canHandleRequest(req)) {
			return this.internalHandler.handleRequest(req, body, res);
		} 
		
		// ask the next item in the chain to attempt to handle
		if(this.nextChainItem) {
			return this.nextChainItem.handleRequest(req, body, res);
		}
		
		// nobody can handle... so just return false
		return false;
	}
}

var optionsChain = new HandlerChainWrapper(optionsHandler);
var userChain = new HandlerChainWrapper(userHandler);
var groupChain = new HandlerChainWrapper(groupHandler);
// var postChain = new HandlerChaingWrapper(postHandler);

optionsChain.addNextHandler(userChain);
userChain.addNextHandler(groupChain);
// groupChain.addNextHandler(postChain);

module.exports = optionsChain;