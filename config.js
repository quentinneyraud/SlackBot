var config = [
    {
        requestTitle : "contactRequest",
        regex : /numero de \w+$/,
        stringCatch : "numero de < Prenom >",
        description : "Retourne le numero de la personne"
    },
    {
        requestTitle : "contactRequest",
        regex : /mail de \w+$/,
        stringCatch : "mail de < Prenom >",
        description : "Retourne le mail de la personne"
    },
    {
        requestTitle : "meteoRequest",
        regex : /meteo (du \d{2}\/\d{2}|de (demain|la semaine)|d'aujourd'hui)$/,
        stringCatch : "meteo de < aujourd'hui / demain / date >",
        description : "Retourne la météo du jour demandé"
    }
]


module.exports = config;
