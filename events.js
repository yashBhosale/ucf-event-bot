var https = require('https')
var cheerio = require('cheerio')
var st = require('striptags')

const options = {
	uri: 'https://events.ucf.edu/feed.json',
	transform: function (body) {
    return cheerio.load(body);
  }
};
let data = '';
let hello = 'helo';
module.exports  = { 

test : function(){
	https.get('https://events.ucf.edu/feed.json', (resp) => {
		data = '';
		resp.on('data', (chunk) => {
			data += chunk;
		});
		resp.on('end', () => {
			 console.log(hello);
		});
	})


}}