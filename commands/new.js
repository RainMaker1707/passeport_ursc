const Discord = require('discord.js');

module.exports = {
  name: 'new',
  value: "N/A",
  description: "Permet d'ajouter un nouveau passeport. NE PAS utiliser pour update un existant.",
  options: [
    { name: 'nom', description: 'Le nom de la personne', type: 3, required: true },
    { name: 'prenom', description: 'Le prénom de la personne', type: 3, required: true },
    { name: 'sexe', description: 'Le sexe de la personne', type: 3, required: true },
    { name: 'dn', description: 'La date de naissance de la personne', type: 3, required: true },
    { name: 'faction', description: 'La faction de la personne (N/A si aucune) ', type: 3, required: true },
    { name: 'residence', description: 'Le lieu de résidence de la personne', type: 3, required: true },
    { name: 'profession', description: 'Le travail de la personne', type: 3, required: true },
  ],
  execute(interaction, client, callback) {
      console.log("New slashed")
  }
}
