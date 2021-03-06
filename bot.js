var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var compliments = require('./compliments.json')
var events = require('./events.js')
var st = require('striptags')
var cheerio = require('cheerio')

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

function formatted(htmlText){
	const d = cheerio.load(htmlText);
	let text = '';
	d('a').each(function(){
		d(this).replaceWith( d(this).html() + d(this).attr('href'));
	
	});
	d('span').each(function(){
		text = text.concat(d(this).text() + '\n');
		
	});
	return text;
}

function eventList(data) {
	obj = JSON.parse(data);
	newobj = []
	
	for (x in obj){
		newobj.push(
			
				obj[x].title + "\n" +
				formatted(obj[x].description) + "\n" +
				obj[x].location + "\n" +
				obj[x].starts + "\n" +
				obj[x].ends + "\n" 
			
		);
	}

	//TODO: format the list into a string HERE so that you
	// don't have to use JSON.stringify- which is fucking up the output.


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
						 	message: y})
					});
				})
				break;
			
		}
	}
});