var contactRequest = function Constructor(misterBot){
    this.models = misterBot.models;
    this.message = misterBot.message;
    this.misterBot = misterBot;
    this.request = {
        'userName' : "",
        'field' : ""
    }

    this._setRequestInfos();
    this._selectUser();
}

contactRequest.prototype._answerContact = function(users){
    if(users.length == 0){
        this.misterBot.answer("Tu m'as appelé mais j'ai pas trouvé cette personne");
    }else{
        if(!users[0][this.request.field]){
            this.misterBot.answer("Désolé mais je ne connais pas le " + this.request.field + " de " + this.request.userName);
        }else{
            this.misterBot.answer("Voici le " + this.request.field + " de " + this.request.userName + " : *" + users[0][this.request.field] + "*");
        }
    }
}

contactRequest.prototype._selectUser = function(){
    var self = this;
    this.models.userModel.find({
        'prenom' : self.request.userName
    }, function(err, users) {
        if (err) throw err;
        self._answerContact(users);
    });
}

contactRequest.prototype._setRequestInfos = function(){
    this.request.field = (this.message.text.toLowerCase().indexOf('numero') > -1 || this.message.text.toLowerCase().indexOf('numéro') > -1) ? "numero" : "mail";
    this.request.userName = this.message.text.split(' ').pop().toLowerCase();
}

module.exports = contactRequest;
