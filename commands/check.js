const Discord = require('discord.js');


module.exports = {
  name: 'check',
  value: "N/A",
  description: "Vérifie l'authenticité d'un passeport à partir du nom et prénom. (sensible a la case (a != A)",
  options: [
    { name: 'nom', description: "Le nom du propriétaire du passeport a vérifier", type: 3, required: true },
    { name: 'prenom', description: "Le prénom du propriétaire du passeport a vérifier", type: 3, required: true }
  ],
  execute(interaction, client, callback) {
      console.log("Check slashed")
  }
}