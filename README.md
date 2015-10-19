#**Slack Bot**

##Description

SlackBot is a bot connected with your Slack team where it can react to some words to answer your question.
Developed in NodeJs as clean as possible =)

##Installation

1. Create new bot on *team name*.com/services/new/bot

2. Create environment variable BOT_API_TOKEN = *your bot token*

3. Create account on [OpenWeatherMap](http://openweathermap.org)

4. Create environment variable OPEN_WEATHER_MAP_API_TOKEN=*your account token*

5. Install [MongoDB](http://www.mongodb.org) and update `var dbPath` on *server.js*

6. Update `var botName` if you want

7. Install node modules

   ```
       npm update
   ```
8. Run server.js

##Process

###*server.js*
Run this file create new server and instanciate new `misterBot` object and call `run()` on it

###*misterBot.js*
This 'class' extends [slackbots](http://www.npmjs.com/package/slackbots) node module which have useful properties

- `Run()` connect the bot to Slack

On `start` event, it call :

- `_loadBotUser()` : get itself from the user list and save it in `user` property
- `_loadConfig()`: get config from `config.js` and save it in `config ` property
- `_connectDb()`
- `_loadModels()` : load all mongoose models in Models/ and save them in `models[]` property
- `_loadRequests()` : load all objects in Requests/ and save them in `requests[]` property
- `_setMan()`: construct answer listing available requests and save it in `requestsMan` property

On `message` event, it catch all events of the Slack team ( user is typing, connection, message, file shared ... ). 
So it check if it's :
 
- a chat message
- not from bot ( avoid infinite answer )
- mention bot name in a channel conversation **OR** if it's a private conversation

If one condition is false, it don't do anything. Else, let's continue...

It call `_getRequestType()`which look over `requestsConfig` property (= `server.js`), array of objects like
```
    {
        requestTitle : "weatherRequest",
        regex : /regex/,
        stringCatch : "regex in human words =)",
        description : "request description"
    }
```
If the text of the message match the regex, it call `new weatherRequest()`where it executes specific actions. 
The bot reply with `_answer()` which answer where it was called. 


##Actions
###Weather

Get weather from [OpenWeatherMap](http://openweathermap.org/)

When someone say :
> Misterbot meteo d'aujourd'hui

or
> Misterbot meteo de demain

or
>Misterbot meteo du 27/10

Misterbot answer weather infos

##Create new action
Replace every "*requestTitle*" whith yours

 1. Add config in *config.js*
```
    {
        requestTitle : requestTitle,
        regex : regex to capture action,
        stringCatch : regex in common language,
        description : action description
    }
```
 2. Create Requests/<*requestTitle*>Request.js

```javascript
    var requestTitle = function Constructor(misterBot){
        this.models = misterBot.models;
        this.message = misterBot.message;
        this.misterBot = misterBot;
    }
    module.exports = requestTitle;
```
##Add model
Create Model/*modelName* Model.js
```javascript
   var mongoose = require('mongoose');
   var userSchema = new mongoose.Schema({});
   module.exports = mongoose.model('user', userSchema);
```
##More & Links
####Links
- [Scotch.io tutorial : building a Slack bot](http://scotch.io/tutorials/building-a-slack-bot-with-node-js-and-chuck-norris-super-powers)
- [Openshift : Develop, host and scale your apps in the cloud](http://www.openshift.com)
- [Slack : formatting your messages](http://slack.zendesk.com/hc/en-us/articles/202288908-How-can-I-add-formatting-to-my-messages-)
- [Scotch.io : Mongoose tutorial](https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications)

####Nodemon
Run 
```
    npm install -g nodemon 
``` 
And 
```
    nodemon server.js 
``` 
Will watch your file and restart on save.  
Useful in development instead of (Ctr-C, key up, Enter)
