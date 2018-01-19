// handle api request for users
var usersHandler = new function () {

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

	this.handleRequest = function(req, body, res) {
		const reqMethod = req.method.toUpperCase();
		const reqUrl = req.url;

		let handlerList = [];
		if (this.whitelistRegex.hasOwnProperty(reqMethod)) {
			handlerList = this.whitelistRegex[reqMethod];
		}

		for (let i = 0; i < handlerList.length; i++) {
			if (handlerList[i].regex.test(reqUrl)) {
				console.log(handlerList[i]);
				handlerList[i].handler(req, body, res);
				return true;
			}
		}

		return false;
	}

	this.updateUser = function(req, body, res) {
		console.log('-- userHandler - updateUser ');

		const token = req.url.replace(/^\/api\/users\//,"");
		console.log('==== token =||' +token+'||');
		console.log("--------------");
		let final = { 'success': true, 'user': { 
			username: 'member1_update',
			token: "member1_token_update",
			name: "member1_update",
			email: "member1@email.test_update",
			description: "description token_update",
			avatarUrl: 'picture_update',
			age: 223,
			currentProject: 'member 1 project_update',
			agency: 'local agency_update' 
		} };
		res.writeHead(200, { 
			'Content-Type': 'text/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'PUT',
			'Access-Control-Allow-Headers': 'Content-Type'
		} );
		res.write(JSON.stringify(final));
		res.end();
	}

	this.deleteUser = function(req, body, res) {
		console.log('-- userHandler - deleteUser ');
		
		const token = req.url.replace(/^\/api\/users\//,"");
		console.log('---- token =||' +token+'||');
		console.log("--------------");
		res.writeHead(200, { 
			'Content-Type': 'text/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'DELETE',
			'Access-Control-Allow-Headers': 'Content-Type'
		} );
		let final = { 'success': true };
		res.write(JSON.stringify(final));
		res.end();
	}

	this.loginUser = function(req, body, res) {
		console.log('-- userHandler - loginUser ');

		res.writeHead(200, { 
			'Content-Type': 'text/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST',
			'Access-Control-Allow-Headers': 'Content-Type'
		} );
		
		let final = { 'success': true, 'user': { 
			username: 'member1',
			token: "member1_token",
			name: "member1",
			email: "member1@email.test",
			description: "description token",
			avatarUrl: 'picture',
			age: 22,
			currentProject: 'member 1 project',
			agency: 'local agency' 
		} };
		res.write(JSON.stringify(final));
		res.end();
	}

	this.logoutUser = function(req, body, res) {
		console.log('-- userHandler - logoutUser ');

		res.writeHead(200, { 
			'Content-Type': 'text/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST',
			'Access-Control-Allow-Headers': 'Content-Type'
		} );
		let final = { 'success': true };
		res.write(JSON.stringify(final));
		res.end();
	}

	this.registerUser = function(req, body, res) {
		console.log('-- userHandler - registerUser ');

		res.writeHead(200, { 
			'Content-Type': 'text/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST',
			'Access-Control-Allow-Headers': 'Content-Type'
		} );
		let final = { 'success': true, 'user': { 
			username: 'member1',
			token: "member1_token",
			name: "member1",
			email: "member1@email.test",
			description: "description token",
			avatarUrl: 'picture',
			age: 22,
			currentProject: 'member 1 project',
			agency: 'local agency' 
		} };
		res.write(JSON.stringify(final));
		res.end();
	}

	this.getAllUsers = function(req, body, res) {
		console.log('-- userHandler - get all users ');

		res.writeHead(200, { 
			'Content-Type': 'text/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST',
			'Access-Control-Allow-Headers': 'Content-Type'
		} );
		let final = { 
			'success': true, 
			'users': [{ 
				username: 'member1',
				token: "member1_token",
				name: "member1",
				email: "member1@email.test",
				description: "description token",
				avatarUrl: 'picture',
				age: 22,
				currentProject: 'member 1 project',
				agency: 'local agency' 
			},{ 
				username: 'member2',
				token: "member2_token",
				name: "member2",
				email: "member2@email.test",
				description: "description token",
				avatarUrl: 'picture',
				age: 22,
				currentProject: 'member 2 project',
				agency: 'local agency' 
			},{ 
				username: 'member3',
				token: "member3_token",
				name: "member3",
				email: "member3@email.test",
				description: "description token",
				avatarUrl: 'picture',
				age: 22,
				currentProject: 'member 3 project',
				agency: 'local agency' 
			},{ 
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

	this.whitelistRegex = {
		'GET': [
			{ // get all users
				'regex': /^\/api\/users(\/)?$/,
				'handler': this.getAllUsers
			}
		],
		'PUT': [
			{ // update user
				'regex': /^\/api\/users\/[a-zA-Z_=0-9\-_]{5,25}$/,
				'handler': this.updateUser
			}
		],
		'DELETE': [
			{ // unregister user
				'regex': /^\/api\/users\/[a-zA-Z_=0-9\-_]{5,25}$/,
				'handler': this.deleteUser
			}
		],
		'POST': [
			{ // check if user credentials for login
				'regex': /^\/api\/users\/check_login$/,
				'handler': this.loginUser
			},
			{ // logout user
				'regex': /^\/api\/users\/logout$/,
				'handler': this.logoutUser
			},
			{ // register user
				'regex': /^\/api\/users$/,
				'handler': this.registerUser
			},
		]
	}
}

module.exports = usersHandler;