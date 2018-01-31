// handle api request for users
var usersHandler = new function () {
	
	this.setDbConnection = function (dbConnection) {
	}

	this.canHandleRequest = function (req) {
		console.log('-- userHandler - canHandle ? ');

		const reqMethod = req.method.toUpperCase();
		const reqUrl = req.url;

		let handlerList = [];
		if (this.whitelistRegex.hasOwnProperty(reqMethod)) {
			handlerList = this.whitelistRegex[reqMethod];
		}

		for (let i = 0; i < handlerList.length; i++) {
			if (handlerList[i].regex.test(reqUrl)) {
				console.log('-- userHandler - canHandle ? YES ');
				return true;
			}
		}

		console.log('-- userHandler - canHandle ? NO ');
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

	this.updateUser = function(req, body, res) {
		console.log('-- userHandler - updateUser ');

		const userId = +req.url.replace(/^\/api\/users\//, "");
		console.log('==== id =||' + userId + '||');
		console.log("--------------");
		let final = {
			'success': true, 'user': {
				id: userId,
				username: 'member1_update',
				token: "member1_token_update",
				name: "member1_update",
				email: "member1@email.test_update",
				description: "description token_update",
				avatarUrl: 'picture_update',
				age: 223,
				currentProject: 'member 1 project_update',
				agency: 'local agency_update'
			}
		};
		res.writeHead(200, {
			'Content-Type': 'text/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'PUT',
			'Access-Control-Allow-Headers': 'Content-Type'
		});
		res.write(JSON.stringify(final));
		res.end();
	}

	this.deleteUser = function (req, body, res) {
		console.log('-- userHandler - deleteUser ');

		const userId = +req.url.replace(/^\/api\/users\//, "");
		console.log('---- id =||' + userId + '||');
		console.log("--------------");
		res.writeHead(200, {
			'Content-Type': 'text/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'DELETE',
			'Access-Control-Allow-Headers': 'Content-Type'
		});
		let final = { 'success': true };
		res.write(JSON.stringify(final));
		res.end();
	}

	this.registerUser = function (req, body, res) {
		console.log('-- userHandler - registerUser ');

		res.writeHead(200, {
			'Content-Type': 'text/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST',
			'Access-Control-Allow-Headers': 'Content-Type'
		});
		let final = {
			'success': true, 'user': {
				id: 1,
				username: 'member1',
				token: "member1_token",
				name: "member1",
				email: "member1@email.test",
				description: "description token",
				avatarUrl: 'picture',
				age: 22,
				currentProject: 'member 1 project',
				agency: 'local agency'
			}
		};
		res.write(JSON.stringify(final));
		res.end();
	}

	this.getAllUsers = function (req, body, res) {
		console.log('-- userHandler - get all users ');

		res.writeHead(200, {
			'Content-Type': 'text/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST',
			'Access-Control-Allow-Headers': 'Content-Type'
		});
		let final = {
			'success': true,
			'users': [{
				id: 1,
				username: 'member1',
				token: "member1_token",
				name: "member1",
				email: "member1@email.test",
				description: "description token",
				avatarUrl: 'picture',
				age: 22,
				currentProject: 'member 1 project',
				agency: 'local agency'
			}, {
				id: 2,
				username: 'member2',
				token: "member2_token",
				name: "member2",
				email: "member2@email.test",
				description: "description token",
				avatarUrl: 'picture',
				age: 22,
				currentProject: 'member 2 project',
				agency: 'local agency'
			}, {
				id: 3,
				username: 'member3',
				token: "member3_token",
				name: "member3",
				email: "member3@email.test",
				description: "description token",
				avatarUrl: 'picture',
				age: 22,
				currentProject: 'member 3 project',
				agency: 'local agency'
			}, {
				id: 4,
				username: 'member4',
				token: "member4_token",
				name: "member4",
				email: "member4@email.test",
				description: "description token",
				avatarUrl: 'picture',
				age: 22,
				currentProject: 'member 4 project',
				agency: 'local agency'
			}]
		};
		res.write(JSON.stringify(final));
		res.end();
	}

	this.getAllUsersBySearchTerm = function (req, body, res) {
		const regexUrl = /^\/api\/users\/search\/([0-9a-zA-Z\._-]*)$/;
		const matches = regexUrl.exec(req.url);
		const searchTerm = matches[1];
		console.log('-- userHandler - get all users by search term -- ' + searchTerm);

		res.writeHead(200, {
			'Content-Type': 'text/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST',
			'Access-Control-Allow-Headers': 'Content-Type'
		});
		let final = {
			'success': true,
			'users': [{
				id: 1,
				username: searchTerm + '_1',
				token: searchTerm + "1_token",
				name: searchTerm + "name_1",
				email: searchTerm + "_1@email.test",
				description: "description token " + searchTerm,
				avatarUrl: 'picture',
				age: 22,
				currentProject: 'member 1 project',
				agency: 'local agency'
			}, {
				id: 2,
				username: searchTerm + '_2',
				token: searchTerm + "2_token",
				name: searchTerm + "name_2",
				email: searchTerm + "_2@email.test",
				description: "description token " + searchTerm,
				avatarUrl: 'picture',
				age: 22,
				currentProject: 'member 2 project',
				agency: 'local agency'
			}, {
				id: 3,
				username: searchTerm + '_3',
				token: searchTerm + "3_token",
				name: searchTerm + "name_3",
				email: searchTerm + "_3@email.test",
				description: "description token " + searchTerm,
				avatarUrl: 'picture',
				age: 22,
				currentProject: 'member 3 project',
				agency: 'local agency'
			}]
		};
		res.write(JSON.stringify(final));
		res.end();
	}

	this.whitelistRegex = {
		'GET': [
			{ // get all users
				'regex': /^\/api\/users(\/)?$/,
				'handler': this.getAllUsers
			},
			{
				// get all users
				'regex': /^\/api\/users\/search\/[0-9a-zA-Z\._-]*$/,
				'handler': this.getAllUsersBySearchTerm
			}
		],
		'PUT': [
			{ // update user
				'regex': /^\/api\/users\/\d+$/,
				'handler': this.updateUser
			}
		],
		'DELETE': [
			{ // unregister user
				'regex': /^\/api\/users\/\d+$/,
				'handler': this.deleteUser
			}
		],
		'POST': [
			{ // register user
				'regex': /^\/api\/users$/,
				'handler': this.registerUser
			},
		]
	}
}

module.exports = usersHandler;