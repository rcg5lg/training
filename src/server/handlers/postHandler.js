// handle api request for groups
var postHandler = new function () {

	this.canHandleRequest = function (req) {
		console.log('-- postsHandler - canHandle ? ');

		const reqMethod = req.method.toUpperCase();
		const reqUrl = req.url;

		let handlerList = [];
		if (this.whitelistRegex.hasOwnProperty(reqMethod)) {
			handlerList = this.whitelistRegex[reqMethod];
		}

		for (let i = 0; i < handlerList.length; i++) {
			if (handlerList[i].regex.test(reqUrl)) {
				console.log('-- postsHandler - canHandle ? YES ');
				return true;
			}
		}

		console.log('-- postsHandler - canHandle ? NO ');
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
				console.log(handlerList[i]);
				handlerList[i].handler(req, body, res);
				return true;
			}
		}

		return false;
	}

	this.getGroupPosts = function (req, body, res) {
		const regexUrl = /^\/api\/group\/(\d+)\/posts(\/)?$/;
		const matches = regexUrl.exec(req.url);
		const groupId = +matches[1];

		console.log('-- params =||' + groupId + '||');
		console.log("--------------");
		res.writeHead(200, {
			'Content-Type': 'text/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET',
			'Access-Control-Allow-Headers': 'Content-Type'
		});
		let now = new Date();
		let postUser = {
			id: 2,
			username: 'member2_update',
			name: "member2_update",
			email: "member2@email.test_update",
			description: "description token_update",
			avatarUrl: 'picture_update',
			age: 223,
			currentProject: 'member 2 project_update',
			agency: 'local agency_update'
		};
		const posts = [{ 
			id: 1,
			message: 'message + '+1,
			createdBy: postUser.username,
			changedBy: postUser.username,
			changedAt: new Date(),
			createdAt: now.setMinutes(-10)
		}, { 
			id: 2,
			message: 'message + '+2,
			createdBy: postUser.username,
			changedBy: postUser.username,
			changedAt: new Date(),
			createdAt: now.setMinutes(-10)
		}, { 
			id: 3,
			message: 'message + '+3,
			createdBy: postUser.username,
			changedBy: postUser.username,
			changedAt: new Date(),
			createdAt: now.setMinutes(-10)
		}];
		let final = { 'success': true, 'items': posts };
		res.write(JSON.stringify(final));
		res.end();
	}

	this.deletePost = function (req, body, res) {
		const regexUrl = /^\/api\/post\/(\d+)$/;
		const matches = regexUrl.exec(req.url);
		const postId = +matches[1];

		console.log('-- params =||' + postId + '||');
		console.log("--------------");
		res.writeHead(200, {
			'Content-Type': 'text/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET',
			'Access-Control-Allow-Headers': 'Content-Type'
		});
		let final = { 'success': true };
		res.write(JSON.stringify(final));
		res.end();
	}

	this.updatePost = function (req, body, res) {
		const regexUrl = /^\/api\/post\/(\d+)$/;
		const matches = regexUrl.exec(req.url);
		const postId = +matches[1];

		console.log('-- params =||' + postId + '||');
		console.log("----- ");
		console.log(body);
		console.log("--------------");
		res.writeHead(200, {
			'Content-Type': 'text/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET',
			'Access-Control-Allow-Headers': 'Content-Type'
		});
		let postUser = {
			id: body.changedByUserId,
			username: 'member_update' + body.changedByUserId,
			name: "member2_update",
			email: "member2@email.test_update",
			description: "description token_update",
			avatarUrl: 'picture_update',
			age: 223,
			currentProject: 'member 2 project_update',
			agency: 'local agency_update'
		}
		let now = new Date();
		let post = { 
			id: postId,
			message: body.message,
			createdBy: postUser.username,
			changedBy: postUser.username,
			changedAt: new Date(),
			createdAt: now.setMinutes(-10)
		} 
		let final = { 'success': true, 'post': post };
		res.write(JSON.stringify(final));
		res.end();
	}

	this.createPost = function (req, body, res) {

		console.log('-- body =||' + body + '||');
		console.log("--------------");
		res.writeHead(200, {
			'Content-Type': 'text/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET',
			'Access-Control-Allow-Headers': 'Content-Type'
		});
		let postOwner = {
			id: 1,
			username: 'member1_update',
			name: "member1_update",
			email: "member1@email.test_update",
			description: "description token_update",
			avatarUrl: 'picture_update',
			age: 223,
			currentProject: 'member 1 project_update',
			agency: 'local agency_update'
		}
		let now = new Date();
		let post = { 
			id: 1,
			message: body.message,
			createdBy: postOwner.username,
			changedBy: postOwner.username,
			changedAt: new Date(),
			createdAt: now.setMinutes(-5)
		} 
		let final = { 'success': true, 'post': post };
		res.write(JSON.stringify(final));
		res.end();
	}

	this.whitelistRegex = {
		'GET': [
			{ // get all posts for group
				'regex': /^\/api\/group\/\d+\/posts(\/)?$/,
				'handler': this.getGroupPosts
			}
		],
		'DELETE': [
			{ // update the for post 
				'regex': /^\/api\/post\/\d+$/,
				'handler': this.deletePost
			}
		],
		'PUT': [
			{ // update the for post 
				'regex': /^\/api\/post\/\d+$/,
				'handler': this.updatePost
			}
		],
		'POST': [
			{
				// create a new post
				'regex': /^\/api\/post(\/)?$/,
				'handler': this.createPost
			}
		]
	}
}

module.exports = postHandler;