var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    slackId : String,
    prenom : String,
    nom : String,
    mail : String,
    numero : String,
});
module.exports = mongoose.model('user', userSchema);
