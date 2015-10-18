'use strict';
if(typeof process.env.OPENSHIFT_NODEJS_IP == 'undefined'){
    require('./setenv.js');
}
// node modules
var http = require('http');

// personal class
var misterBot = require('./lib/misterBot');

// requests keys;
process.env.weatherKey = process.env.OPEN_WEATHER_MAP_API_TOKEN;

// bot vars
var botName = "misterbot";
var botApiToken = process.env.BOT_API_TOKEN;

// config vars
var ip =  process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port =  process.env.OPENSHIFT_NODEJS_PORT || 8080;
var dbPath = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/slackbot';

// start server
var server = http.createServer(function(request, response) {});
server.listen( port, ip, function() {
    console.log((new Date()) + ' Server is listening on ' + ip + ':' + port);
});

// instanciate misterBot !!!
var misterBot = new misterBot({
    botApiToken: botApiToken,
    dbPath: dbPath,
    botName: botName,
});
// run start tasks & listeners
misterBot.run();


