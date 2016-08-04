#!/usr/bin/env node

var WebSocket = require('ws'),
	Vorpal = require('vorpal'),
	repl = require('vorpal-repl'),
	request = require('request'),
	version = require('./package.json').version;

var vorpal = Vorpal(),
	ws;

var connect = function (cb) {
	ws = new WebSocket('ws://barfy-server.herokuapp.com');

	ws.on('open', function () {
		(cb || function () {})();
	});
	ws.on('error', function (message) {
		vorpal.log('ERROR: %s', message);
	});
};

var send = function (action, value) {
	var message = {action, value};

	try {
		ws.send(JSON.stringify(message));
	} catch (e) {
		connect(function () {
			send(action, value);
		});
	}
};

var checkVersion = function () {
	request({url: 'https://raw.githubusercontent.com/alvarocastro/barfy-cli/master/package.json', json: true}, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			var newVersion = body.version;

			if (newVersion != version) {
				vorpal.log('! Hay una nueva version ' + newVersion + ' disponible');
				vorpal.log('! Tirate un npm install -g barfy-cli');
			} else {
				setTimeout(checkVersion, 1000 * 60 * 5);
			}
		}
	});
};

checkVersion();


vorpal
	.command('audio <value...>', 'Reproduce crap.')
	.autocomplete(['aguanta', 'botellero', 'dale-ingrid', 'me-gusta-el-arte', 'wololo'])
	.alias('a')
	.action(function (args, callback) {
		args.value.forEach(function (value) {
			send('audio', value);
		});

		callback();
	});

vorpal
	.command('announce <text...>', 'Hace un anuncio fancy.')
	.alias('ann')
	.action(function (args, callback) {
		send('announce', args.text.join(' '));

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

vorpal.log('\n\
                            .-""""-.\n\
                           /\' .  \'. \\\n\
                          (`-..:...-\')\n\
                           ;-......-;\n\
                            \'------\'    ' + version + '\n\
     _______     ________    _______     ________    __    __\n\
    / ____ /\\   / ____  /\\  / ____ /\\   / ______/\\  /_/\\ _/_/\\\n\
   / /\\__/_/\\  / /\\__/ / / / /\\__/ /\\  / /\\_____\\/  /_/\\/_/\\\\/\n\
  / ____ /\\\\/ / ____  / / / ____ /\\\\/ / _____/\\     / /_/\\\\/\n\
 / /\\__/_/\\  / /\\__/ / / / /\\__/ /\\  / /\\____\\/     / /\\\\/\n\
/______/\\\\/ /_/ / /_/ / /_/ / /_/ / /_/ /          /_/ /\n\
\\______\\/   \\_\\/  \\_\\/  \\_\\/  \\_\\/  \\_\\/           \\_\\/\n\
');
