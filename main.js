var WebSocket = require('ws'),
	inquirer = require('inquirer'),
	argv = require('yargs').argv;

if (argv.version || argv.v) {
	console.log(`
	                             .-""""-.
	                            /' .  '. \\
	                           (\`-..:...-')
	                            ;-......-;
	                             '------'
	      _______     ________    _______     ________    __    __     
	     / ____ /\\   / ____  /\\  / ____ /\\   / ______/\\  /_/\\ _/_/\\   
	    / /\\__/_/\\  / /\\__/ / / / /\\__/ /\\  / /\\_____\\/  /_/\\/_/\\\\/  
	   / ____ /\\\\/ / ____  / / / ____ /\\\\/ / _____/\\     / /_/\\\\/   
	  / /\\__/_/\\  / /\\__/ / / / /\\  / /\\  / /\\____\\/     / /\\\\/    
	 /______/\\\\/ /_/ / /_/ / /_/ / /_/ / /_/ /          /_/ /     
	 \\______\\/   \\_\\/  \\_\\/  \\_\\/  \\_\\/  \\_\\/           \\_\\/     
	`);
	process.exit();
}

var ws = new WebSocket('ws://barfy-server.herokuapp.com');
/*
ws.on('open', function () {
	ws.send(JSON.stringify(message));
});
*/
ws.on('message', function (message) {
	//console.log('received: %s', message);
});
ws.on('error', function (message) {
	console.log('ERROR: %s', message);
});


const ACTIONS = {
	'audio': [
		'aguanta',
		'botellero'
	]
};

var send = (action, value) => {
	console.log('send', action, value);
	ws.send(JSON.stringify({
		type: action,
		id: value
	}));
};


var promptAction = () => {
		return inquirer.prompt([{
			type: 'input',
			name: 'command',
			message: '>'
		}])
			.then((input) => {
				var command = input.command.split(' '),
					action = command[0],
					value = command[1];

				if (!value) {
					return promptOptionsForAction(action);
				}

				send(action, value);

				return promptAction();
			});
	},
	promptOptionsForAction = (action) => {
		return inquirer.prompt([{
			type: 'rawlist',
			name: 'command',
			message: 'Options:',
			choices: ACTIONS[action]
		}])
			.then((input) => {
				var value = input.command;

				send(action, value);

				return promptAction();
			});
	};

promptAction();
