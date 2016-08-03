#!/usr/bin/env node

const WebSocket = require('ws'),
	Vorpal = require('vorpal'),
	repl = require('vorpal-repl');
	version = require('./package.json').version;

const vorpal = Vorpal();
var ws;

const connect = function (cb) {
	ws = new WebSocket('ws://barfy-server.herokuapp.com');

	ws.on('open', function () {
		(cb || () => {})();
	});
	ws.on('error', function (message) {
		vorpal.log('ERROR: %s', message);
	});
}

const send = function (action, value) {
	var message = {type: action, id: value};

	try {
		ws.send(JSON.stringify(message));
	} catch (e) {
		connect(() => {
			send(action, value);
		});
	}
};


vorpal
	.command('audio <value...>', 'Reproduce crap.')
	.autocomplete(['aguanta', 'botellero', 'dale-ingrid', 'wololo'])
	.alias('a')
	.action(function (args, callback) {
		args.value.forEach((value) => {
			send('audio', value);
		});

		callback();
	});

vorpal
	.command('stop')
	.alias('s')
	.action(function (args, callback) {
		send('stop');

		callback();
	});

vorpal
	.delimiter('>')
	.use(repl)
	.show();

vorpal.log(`
                            .-""""-.
                           /' .  '. \\
                          (\`-..:...-')
                           ;-......-;
                            '------'    ${version}
     _______     ________    _______     ________    __    __
    / ____ /\\   / ____  /\\  / ____ /\\   / ______/\\  /_/\\ _/_/\\
   / /\\__/_/\\  / /\\__/ / / / /\\__/ /\\  / /\\_____\\/  /_/\\/_/\\\\/
  / ____ /\\\\/ / ____  / / / ____ /\\\\/ / _____/\\     / /_/\\\\/
 / /\\__/_/\\  / /\\__/ / / / /\\  / /\\  / /\\____\\/     / /\\\\/
/______/\\\\/ /_/ / /_/ / /_/ / /_/ / /_/ /          /_/ /
\\______\\/   \\_\\/  \\_\\/  \\_\\/  \\_\\/  \\_\\/           \\_\\/
`);
