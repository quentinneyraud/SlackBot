var config = [
    {
        requestTitle : "contactRequest",
        regex : /(numero|numéro) de \w+$/,
        stringCatch : "numero de < Prenom >",
        description : "Donné le numéro d'une personne"
    },
    {
        requestTitle : "contactRequest",
        regex : /mail de \w+$/,
        stringCatch : "mail de < Prenom >",
        description : "Donné le mail d'une personne"
    },
    {
        requestTitle : "weatherRequest",
        regex : /(meteo|météo) (du \d{2}\/\d{2}|du \d{2}\/\d{2}\/\d{4}|de demain|d'aujourd'hui)$/,
        stringCatch : "meteo < d'aujourd'hui > ou < de demain > ou < du jj/mm > ou < du jj/mm/yyyy >",
        description : "Donné la météo"
    }
]


module.exports = config;
