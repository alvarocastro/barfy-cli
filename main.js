#!/usr/bin/env node

const WebSocket = require('ws'),
	Vorpal = require('vorpal'),
	repl = require('vorpal-repl');

const vorpal = Vorpal();


var ws = new WebSocket('ws://barfy-server.herokuapp.com');
/*ws.on('open', function () {
	ws.send(JSON.stringify(message));
});*/
ws.on('message', function (message) {
	//vorpal.log('received: %s', message);
});
ws.on('error', function (message) {
	vorpal.log('ERROR: %s', message);
});

const send = function (action, value) {
	var message = {type: action, id: value};

	//vorpal.log('SEND', message);
	ws.send(JSON.stringify(message));
};


vorpal
	.command('audio <value...>', 'Reproduce crap.')
	.autocomplete(['aguanta', 'botellero', 'dale-ingrid'])
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