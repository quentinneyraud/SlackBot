'use strict';

// node modules
var util = require('util');
var Bot = require('slackbots');
var mongoose = require('mongoose');
var fs = require('fs');

// Constructor
var misterBot = function Constructor(settings) {
    this.token = settings.botApiToken;
    this.dbPath = settings.dbPath;
    this.name = settings.botName;
    this.requestsConfig = require('../config');
    this.user = null;
    this.models = {};
    this.requests = {};
    this.requestsMan = "";
};

// inherits methods MisterBot properties from the Bot constructor
util.inherits(misterBot, Bot);

misterBot.prototype.run = function () {
    misterBot.super_.call(this,
        {
            token: this.token,
            name: this.name,
        }
    );
    this.on('start', this._onStart);
    this.on('message', this._onMessage);
};

// Load all
misterBot.prototype._onStart = function () {
    this._loadBotUser();
    this._connectDb();
    this._loadModels();
    this._loadRequests();
    this._setMan();
};

// set himself property
misterBot.prototype._loadBotUser = function () {
    var self = this;
    this.user = this.users.filter(function (user) {
        return user.name === self.name;
    })[0];
};

// connect to mongo database
misterBot.prototype._connectDb = function () {
    console.log('connect to database' + this.dbPath);
    mongoose.connect(this.dbPath, function(err) {
      if (err) { throw err; }
    });
    console.log('connect success');
};

// load all mongo models in this.models
misterBot.prototype._loadModels = function () {
    console.log('loading models ...');
    var self = this;
    fs.readdirSync('./Models').forEach(function(file) {
        var modelName = file.split('.')[0];
        self.models[modelName] = require('../Models/' + file);
    });
    console.log('models loaded');
};

// load all request objects in this.requests
misterBot.prototype._loadRequests = function () {
    console.log('loading requests ...');
    var self = this;
    fs.readdirSync('./Requests').forEach(function(file) {
        var requestName = file.split('.')[0];
        self.requests[requestName] = require('../Requests/' + file);
    });
    console.log('requests loaded');
    console.log('je suis pret');
};

// on each message
misterBot.prototype._onMessage = function (message) {
    // do something only if it's channel conversation mentionning bot name
    this.message = message;
    if(this._isChatMessage() && !this._isFromMisterBot()){
        this._setTypeOfChannel();
        if ((this.message.typeOfChannel == 'channel' && this._isMentioningMisterBot()) || (this.message.typeOfChannel == 'user')) {
            this.message.userName = this._getUserById(this.message.user).name;
            this.message.channelName = (this.message.typeOfChannel == 'channel') ? this._getChannelById(this.message.channel).name : this.message.userName;
            this._getRequestType();
        }
    }

};

misterBot.prototype._isChatMessage = function () {
    return this.message.type === 'message' && Boolean(this.message.text);
};

misterBot.prototype._setTypeOfChannel = function () {
    if(this.message.channel[0] == 'C'){
        this.message.typeOfChannel = 'channel';
    }else if(this.message.channel[0] == 'D'){
        this.message.typeOfChannel = 'user';
    }
};

misterBot.prototype._isMentioningMisterBot = function () {
    return this.message.text.toLowerCase().indexOf(this.user.name) > -1;
};

misterBot.prototype._isFromMisterBot = function () {
    return this.message.user === this.user.id;
};

// each config object
// if match regex -> call new request object
// else -> show available commands
misterBot.prototype._getRequestType = function() {
    var hasCatchRegex = false;
    var self = this;
    this.requestsConfig.forEach(function(current){
        if(self.message.text.toLowerCase().search(current.regex) > -1){
            new self.requests[current.requestTitle](self);
            if(!hasCatchRegex){
                hasCatchRegex = true;
            }
        }
    });

    if(!hasCatchRegex){
        this.answer("He! Tu m'as appelé mais j'ai pas compris.\nJe peux : \n" + this.requestsMan);
    }
};

misterBot.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};

misterBot.prototype._getUserById = function (userId) {
    return this.users.filter(function (item) {
        return item.id === userId;
    })[0];
};

// respond where it was called
misterBot.prototype.answer = function(message) {
    this._post(this.message.typeOfChannel, this.message.channelName, message, {as_user: true});
};

// function to call on error
// say infos to admin
misterBot.prototype._logToAdmin = function(message) {
    message = this.message.userName + " : " + this.message.text + "\n" + message;
    this.postMessageToUser("quentin", message, {as_user: true});
};

// construct available commands string
misterBot.prototype._setMan = function(){
    var self = this;
    this.requestsConfig.forEach(function(request){
        self.requestsMan += "*" + request.description + "* : _" + request.stringCatch + "_\n";
    });
}

module.exports = misterBot;
