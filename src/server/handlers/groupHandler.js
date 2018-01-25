// handle api request for groups
var groupHandler = new function () {

	this.canHandleRequest = function (req) {
		console.log('-- groupHandler - canHandle ? ');

		const reqMethod = req.method.toUpperCase();
		const reqUrl = req.url;

		let handlerList = [];
		if (this.whitelistRegex.hasOwnProperty(reqMethod)) {
			handlerList = this.whitelistRegex[reqMethod];
		}

		for (let i = 0; i < handlerList.length; i++) {
			if (handlerList[i].regex.test(reqUrl)) {
				console.log('-- groupHandler - canHandle ? YES ');
				return true;
			}
		}

		console.log('-- groupHandler - canHandle ? NO ');
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

	this.getGroupsForUser = function (req, body, res) {
		const userId = +req.url.replace(/^\/api\/groups\//, "");

		console.log('-- id =||' + userId + '||');
		console.log("--------------");
		res.writeHead(200, {
			'Content-Type': 'text/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET',
			'Access-Control-Allow-Headers': 'Content-Type'
		});
		let items = [
			{ id: 1, name: "name_1", owner: 1, ownerName: 'member1', description: "group 1 description", members: [{ id: 1, name: 'member1' }] },
			{ id: 2, name: "name_2", owner: 1, ownerName: 'member1', description: "group 2 description", members: [{ id: 1, name: 'member1' }, { id: 2, name: 'member2' }] },
			{ id: 3, name: "name_3", owner: 2, ownerName: 'member2', description: "group 3 description", members: [{ id: 1, name: 'member1' }, { id: 2, name: 'member2' }, { id: 3, name: 'member3' }] },
			{ id: 4, name: "name_4", owner: 2, ownerName: 'member2', description: "group 4 description", members: [{ id: 1, name: 'member1' }, { id: 2, name: 'member2' }, { id: 3, name: 'member3' }, { id: 4, name: 'member4' }] }
		];
		let final = { 'success': true, items };
		res.write(JSON.stringify(final));
		res.end();
	}

	this.deleteGroup = function (req, body, res) {
		const groupId = +req.url.replace(/^\/api\/group\//, "");

		console.log('-- groupId =||' + groupId + '||');
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

	this.addGroup = function (req, body, res) {

		console.log('-- params =||' + body + '||');
		console.log("--------------");
		res.writeHead(200, {
			'Content-Type': 'text/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET',
			'Access-Control-Allow-Headers': 'Content-Type'
		});
		const group = { id: 5, name: "name_1", owner: 1, ownerName: 'member1', description: "group 1 description", members: [{ id: 1, name: 'member1' }] };
		let final = { 'success': true, 'group': group };
		res.write(JSON.stringify(final));
		res.end();
	}

	this.updateGroup = function (req, body, res) {

		const groupId = +req.url.replace(/^\/api\/group\//, "");
		console.log('-- groupId =||' + groupId + '||');

		console.log('-- params =||' + body + '||');
		console.log('-- params =||' + body.name + '||');
		console.log("--------------");
		res.writeHead(200, {
			'Content-Type': 'text/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET',
			'Access-Control-Allow-Headers': 'Content-Type'
		});
		const group = {
			'id': groupId,
			'name': body.name,
			'owner': body.owner,
			'ownerName': 'member1',
			'description': "group 1 description",
			members: [{ id: 1, name: 'member1' }]
		};
		let final = { 'success': true, 'group': group };
		res.write(JSON.stringify(final));
		res.end();
	}

	this.whitelistRegex = {
		'GET': [
			{ // get groups for user
				'regex': /^\/api\/groups\/\d+$/,
				'handler': this.getGroupsForUser
			}
		],
		'DELETE': [
			{ // delete group by id
				'regex': /^\/api\/group\/\d+$/,
				'handler': this.deleteGroup
			}
		],
		'POST': [
			{ // save group
				'regex': /^\/api\/group(\/)?$/,
				'handler': this.addGroup
			}
		],
		'PUT': [
			{ // update group fields
				'regex': /^\/api\/group\/\d+$/,
				'handler': this.updateGroup
			}
		]
	}
}

module.exports = groupHandler;