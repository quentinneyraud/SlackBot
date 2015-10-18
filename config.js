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
        requestTitle : "weatherRequest",
        regex : /meteo (du \d{2}\/\d{2}|du \d{2}\/\d{2}\/\d{4}|de demain|d'aujourd'hui)$/,
        stringCatch : "meteo < d'aujourd'hui / de demain / du jj/mm / du jj/mm/yyyy >",
        description : "Retourne la météo du jour demandé"
    }
]


module.exports = config;
