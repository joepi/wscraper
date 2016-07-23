// load node.js libraries
var	util = require('util');
var	scraper = require('../lib/wscraper');
var	fs = require('fs');

// begin
util.log('[wscraper.js] scraping process has started');

// load the script file (synch version)
var script = fs.readFileSync('../scripts/googlefinance.js');
var companies = ['/finance?q=AAPL', 'finance?q=ILD/', '/finance?q=AMZN/'];
var results =[];
var values= "";
// create a web scraper agent instance
var agent = scraper.createAgent();

agent.on('start', function (n) {
	util.log('[wscraper.js] agent has started; ' + n + ' path(s) to visit');
});

agent.on('done', function (url, result) {
	util.log('[wscraper.js] data from ' + url);

	results.push(result);



	// display the results
	var price = result.price;
	//util.log(values);
	util.log('[wscraper.js] current stock price is ' + price + ' USD');
	// next item to process if any
	agent.next();
});

agent.on('stop', function (n) {
	util.log('[wscraper.js] agent has ended; ' + n + ' path(s) remained to visit');
	values=JSON.stringify(results);
	util.log(values);
});

agent.on('abort', function (e) {
	util.log('[wscraper.js] getting a FATAL ERROR [' + e + ']');
	util.log('[wscraper.js] agent has aborted');
	process.exit();
});

// run the web scraper
agent.start('google.com', companies, script);
