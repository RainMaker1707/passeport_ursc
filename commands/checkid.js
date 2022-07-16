const Discord = require('discord.js');


module.exports = {
  name: 'checkid',
  value: "N/A",
  description: "Permet de vérifier l'authenticité d'un passeport à partir de son ID.",
  options: [
    { name: 'id', description: "L'id du passeport a vérifier", type: 3, required: true }
  ],
  execute(interaction, client, callback) {
      console.log("CheckID slashed")
  }
}
