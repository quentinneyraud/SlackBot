var request = require('request');
var traductions = {
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
}
var meteoRequest = function Constructor(misterBot){
    this.models = misterBot.models;
    this.message = misterBot.message;
    this.misterBot = misterBot;

    this._setPeriodString();
    this._getDataFromApi();
}


meteoRequest.prototype._respondMeteo = function(){
    if(this.requestedPeriodString == "d'aujourd'hui"){
        var main = (typeof traductions[this.weatherData.weather[0].description] != 'undefined') ? traductions[this.weatherData.weather[0].description] : this.weatherData.weather[0].description;
        var tMin = this.weatherData.main.temp_min;
        var tMax = this.weatherData.main.temp_max;
        var icon = this.weatherData.weather[0].icon;
        this.misterBot._respond("*Voici la météo d'aujourd'hui* :\n>• " + main + "\n>• Température allant de " + tMin + "° à " + tMax + "°\n\nBonne journée !");
    }else{
        var mainMatin = (typeof traductions[this.weatherData[0].weather[0].description] != 'undefined') ? traductions[this.weatherData[0].weather[0].description] : this.weatherData[0].weather[0].description;
        var tMatin = Math.ceil(this.weatherData[0].main.temp);
        console.log(this.weatherData[1].weather[0].description);
        var mainAprem = (typeof traductions[this.weatherData[1].weather[0].description] != 'undefined') ? traductions[this.weatherData[1].weather[0].description] : this.weatherData[1].weather[0].description;
        var tAprem = Math.ceil(this.weatherData[1].main.temp);
        this.misterBot._respond("*Voici la météo " + this.requestedPeriodString + "* :\n_Matin_ :\n>• " + mainMatin + "\n>• Température : " + tMatin + "°\n_Aprem_ :\n>• " + mainAprem + "\n>• Température : " + tAprem + "°\n\n");
    }

}

// return data from OpenWeatherMap API : "http://openweathermap.org/"
meteoRequest.prototype._getDataFromApi = function(){
    var self = this;

    if(this.requestedPeriodString == "d'aujourd'hui"){
        var url = "http://api.openweathermap.org/data/2.5/weather?q=Annecy&units=metric&appid=" + process.env.weatherKey;
    }else{
        var url = "http://api.openweathermap.org/data/2.5/forecast?q=Annecy&units=metric&appid=" + process.env.weatherKey;
    }

    request({
        url: url,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            if(self.requestedPeriodString == "d'aujourd'hui"){
                self.weatherData = body;
            }else{
                var requestedPeriod = self.getRequestPeriod();
                self.weatherData = body.list.filter(function (forecast) {
                    var forecastDate = new Date(forecast.dt_txt);
                    if(forecastDate.getDate() == requestedPeriod.getDate() &&
                        forecastDate.getMonth() == requestedPeriod.getMonth() &&
                        forecastDate.getFullYear() == requestedPeriod.getFullYear() &&
                        (forecastDate.getHours() == 9 || forecastDate.getHours() == 15)){
                        return true;
                    }
                });
            }

            if(self.weatherData.length == 0){
                self._respond("Désolé, Je n'ai rien trouvé pour ce jour");
            }else{
                self._respondMeteo();
            }
        }else{
            self.misterBot._respond("Oups, une erreur est survenue quand j'ai essayé de récupérer la météo");
            return false;
        }
    })
}

// extract requested period string
meteoRequest.prototype._setPeriodString = function(){
    var splittedText = this.message.text.split(' ');
    this.requestedPeriodString = (splittedText[splittedText.length-1] == "d'aujourd'hui") ? splittedText.pop() : splittedText[splittedText.length-2] + " " + splittedText[splittedText.length-1];
}

// return Date object according requested
meteoRequest.prototype.getRequestPeriod = function(){
    if(this.requestedPeriodString == "de demain"){
        return new Date(new Date().getTime() + 86400000); // now + one day
    }else{
        return new Date("20/10/2015");
    }
}


module.exports = meteoRequest;
