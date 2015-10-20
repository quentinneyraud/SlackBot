var request = require('request');

var weatherRequest = function Constructor(misterBot){
    this.models = misterBot.models;
    this.message = misterBot.message;
    this.misterBot = misterBot;

    this.translations = {
        "sky is clear" : "Ciel clair",
        "few clouds" : "Quelques nuages",
        "scattered clouds" : "Nuages dispersés",
        "broken clouds" : "Nuages dispersés",
        "light rain" : "Pluie",
        "shower rain" : "Averse",
        "Rain" : "Pluie",
        "Thunderstorm" : "Orage",
        "snow" : "Neige",
        "mist" : "Brouillard"
    };
    this.requestedPeriod = {
        'string' : "",
        'day' : null,
        'month' : null,
        'year' : null,
        'isToday' : false
    };
    this.weatherApiDatas = null;

    this._setRequestedPeriodString();
    this._getDataFromApi();
}

/**
 * Answer weather
 *
 * @return {void} Answer
 */
weatherRequest.prototype._answerWeather = function(){
    if(this.requestedPeriod.isToday){
        var main = this._getTranslation(this.weatherApiDatas.weather[0].description);
        var tMin = this.weatherApiDatas.main.temp_min;
        var tMax = this.weatherApiDatas.main.temp_max;
        this.misterBot.answer("*Voici la météo d'aujourd'hui* :\n>• " + main + "\n>• Température allant de " + tMin + "° à " + tMax + "°\n\nBonne journée !");
    }else{
        var mainMorning = this._getTranslation(this.weatherApiDatas[0].weather[0].description);
        var tMorning = Math.ceil(this.weatherApiDatas[0].main.temp);
        var mainAfternoon = this._getTranslation(this.weatherApiDatas[1].weather[0].description);
        var tAfternoon = Math.ceil(this.weatherApiDatas[1].main.temp);
        this.misterBot.answer("*Voici la météo " + this.requestedPeriod.string + "* :\n_Matin_ :\n>• " + mainMorning + "\n>• Température : " + tMorning + "°\n_Aprem_ :\n>• " + mainAfternoon + "\n>• Température : " + tAfternoon + "°\n\n");
    }
}

/**
 * get data from url and set in weatherApiDatas property
 *
 * @param  {Function} cb callback when we have datas
 */
weatherRequest.prototype._getDataFromApi = function(cb){
    var self = this;
    request({
        url: this._getApiUrl(),
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {

            if(self.requestedPeriod.isToday){
                // useful datas is body
                self.weatherApiDatas = body;
            }else{
                // get only useful datas
                self.weatherApiDatas = self._parseApiDatas(body);
            }

            if(self.weatherApiDatas.length == 0){
                self.misterBot.answer("Désolé, Je n'ai rien trouvé pour ce jour");
            }else{
                self._answerWeather();
            }
        }else{
            self.misterBot.answer("Oups, une erreur est survenue quand j'ai essayé de récupérer la météo");
        }
    })
}

/**
 * set requestedPeriod.string property and requestedPeriod.isToday
 */
weatherRequest.prototype._setRequestedPeriodString = function(){
    var splittedText = this.message.text.split(' ');
    if(splittedText[splittedText.length-1] == "d'aujourd'hui"){
        this.requestedPeriod.string = splittedText.pop();
        this.requestedPeriod.isToday = true;
    }else{
        this.requestedPeriod.string = splittedText[splittedText.length-2] + " " + splittedText[splittedText.length-1];
        this._setRequestedPeriod();
    }
}

/**
 * Set requestedPeriod.day, requestedPeriod.month and requestedPeriod.year property
 */
weatherRequest.prototype._setRequestedPeriod = function(){
    if(this.requestedPeriod.string == "de demain"){
        // now + one day
        var date = new Date(new Date().getTime() + 86400000);
        this.requestedPeriod.day = date.getDate();
        this.requestedPeriod.month = date.getMonth() + 1;
        this.requestedPeriod.year = date.getFullYear();
    }else{
        // get array (day, month, year) or array (day, month)
        var date = this.requestedPeriod.string.split(' ')[1].split('/');
        this.requestedPeriod.day = date[0];
        this.requestedPeriod.month = date[1];
        // if user doesn't say year, take current
        this.requestedPeriod.year = (2 in date) ? date[2] : new Date().getFullYear();
    }
}

/**
 * Return OpenWeatherMap url to call
 */
weatherRequest.prototype._getApiUrl = function(){
    if(this.requestedPeriod.isToday){
        return "http://api.openweathermap.org/data/2.5/weather?q=Annecy&units=metric&appid=" + process.env.weatherKey;
    }else{
        return "http://api.openweathermap.org/data/2.5/forecast?q=Annecy&units=metric&appid=" + process.env.weatherKey;
    }
}

/**
 * Parse API datas to get only useful
 *
 * @param  {Array} datas List of forecasts ( 5 days every 3 hours )
 *
 * @return {Array}       9am & 15pm forecasts of requested day if exist, else null
 */
weatherRequest.prototype._parseApiDatas = function(datas){
    var self = this;
    return datas.list.filter(function (forecast) {
        var forecastDate = new Date(forecast.dt_txt);
        if(forecastDate.getDate() == self.requestedPeriod.day &&
            forecastDate.getMonth() + 1 == self.requestedPeriod.month &&
            forecastDate.getFullYear() == self.requestedPeriod.year &&
            (forecastDate.getHours() == 9 || forecastDate.getHours() == 15)){
            return true;
        }
    });
}

/**
 * get translation of weather description
 *
 * @param  {String} word Word to be translated
 *
 * @return {String}      Word translated or word if translation don't exists
 */
weatherRequest.prototype._getTranslation = function(word){
    return (typeof this.translations[word] != 'undefined') ? this.translations[word] : word;
}


module.exports = weatherRequest;
