var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var compliments = require('./compliments.json')
var events = require('./events.js')
var st = require('striptags')

var https= require('https')
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
colorize: true});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
	token: auth.token,
	autorun: true
});

function eventList(data) {
	obj = JSON.parse(data);
	newobj = []
	
	for (x in obj){
		newobj.push(
			{
				"title": obj[x].title,
				"description": st(obj[x].description),
				"location": obj[x].location,
				"starts": obj[x].starts,
				"ends": obj[x].ends
			}
		);
	}
	console.log(newobj);
	return newobj;
}


bot.on('ready', function (evt) {
	logger.info('Connected');
	logger.info('Logged in as: ');
	logger.info(bot.username + ' – (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
	if (message.substring(0, 1) == '!') {
		var args = message.substring(1).split(' ');
		var cmd = args[0];

		args = args.splice(1);
		switch(cmd) {
			case 'intro':
				bot.sendMessage({
					to: channelID,
					message: 'Greetings! Welcome to the server!'
				});
				break;
			case 'compliment':
				bot.sendMessage({
					to: channelID,
					message: compliments.compliments[Math.floor(Math.random() * compliments.compliments.length)]
				});
				break;

			case 'event': 
				https.get('https://events.ucf.edu/feed.json', (resp) => {
					data = '';
					resp.on('data', (chunk) => {
						data += chunk;
					});
					resp.on('end', () => {
						y = eventList(data);
						for (x in y)
						 bot.sendMessage({
						 	to: channelID,
						 	message: JSON.stringify(y)})
					});
				})
				break;
			
		}
	}
});