const Sequelize = require('sequelize');
var userService = require('..//services/userService');
var authService = require('../services/authService');

// handle api request for users
var usersHandler = new function () {

	this.setDbConnection = function (dbConnection) {
		userService.setDbConnection(dbConnection);
		authService.setDbConnection(dbConnection);
	}

	this.canHandleRequest = function (req) {
		console.log('-- authHandler - canHandle ? ');

		const reqMethod = req.method.toUpperCase();
		const reqUrl = req.url;

		let handlerList = [];
		if (this.whitelistRegex.hasOwnProperty(reqMethod)) {
			handlerList = this.whitelistRegex[reqMethod];
		}

		for (let i = 0; i < handlerList.length; i++) {
			if (handlerList[i].regex.test(reqUrl)) {
				console.log('-- authHandler - canHandle ? YES ');
				return true;
			}
		}

		console.log('-- authHandler - canHandle ? NO ');
		return false;
	}

	this.handleRequest = function (req, body, res) {

		const reqMethod = req.method.toUpperCase();
		const reqUrl = req.url;

		let handlerList = [];
		if (this.whitelistRegex.hasOwnProperty(reqMethod)) {
			handlerList = this.whitelistRegex[reqMethod];
		}

		for (let i = 0; i < handlerList.length; i++) {
			if (handlerList[i].regex.test(reqUrl)) {
				handlerList[i].handler.call(this, req, body, res);
				return true;
			}
		}

		return false;
	}

	this.loginUser = function (req, body, res) {
		let userData;
		userService.getUser(body.username, body.password)
			.then((user) => {
				if (!user) {
					return null;
				}
				userData = user;
				return authService.doAuth(user);
			}).then((token) => {
				let final = {
					'success': false
				};
				if (token !== null) {
					delete userData['password'];

					final['success'] = true;
					final['user'] = userData;
					final['token'] = token['token'];
				};
				res.writeHead(200, {
					'Access-Control-Allow-Origin': '*',
					'Content-Type': 'text/json'
				});
				res.write(JSON.stringify(final));
				res.end();
			}).catch((err) => {
				res.writeHead(404, { 'Content-Type': 'text/plain' });
				res.write('Page not found :P');
				res.end();
			})
	}

	this.logoutUser = function (req, body, res) {
		userService.getUserById(body.userId)
			.then((user) => {
				if (!user) {
					return false;
				}
				return authService.doLogout(user, body.token);
			}).then((result) => {
				let final = {
					'success': result
				};
				res.writeHead(200, {
					'Access-Control-Allow-Origin': '*',
					'Content-Type': 'text/json'
				});
				res.write(JSON.stringify(final));
				res.end();
			}).catch((err) => {
				console.log(err.message);
				res.writeHead(404, { 
					'Access-Control-Allow-Origin': '*',
					'Content-Type': 'text/plain' 
				});
				res.write('Page not found :P');
				res.end();
			});
	}

	this.whitelistRegex = {
		'POST': [
			{ // check if user credentials for login
				'regex': /^\/api\/login(\/)?$/,
				'handler': this.loginUser
			},
			{ // logout user
				'regex': /^\/api\/logout(\/)?$/,
				'handler': this.logoutUser
			}
		]
	}
}

module.exports = usersHandler;