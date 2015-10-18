var contactRequest = function Constructor(misterBot){
    this.models = misterBot.models;
    this.message = misterBot.message;
    this.misterBot = misterBot;
    this._getAll();
}


contactRequest.prototype._getAll = function(){
    var self = this;
    this.models.userModel.find({}, function(err, users) {
        if (err) throw err;
        self.misterBot._respond("Voila votre réponse : " + users[0].numero);
    });
}

module.exports = contactRequest;
