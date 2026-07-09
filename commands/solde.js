const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const playersPath = path.join(__dirname, "../data/players.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("solde")
        .setDescription("Affiche votre solde"),

    async execute(interaction) {

        let players = {};

        if (fs.existsSync(playersPath)) {
            players = JSON.parse(fs.readFileSync(playersPath, "utf8"));
        }

        const joueur = players[interaction.user.id];

        if (!joueur) {
            return interaction.reply({
                content: "❌ Vous n'avez pas encore de compte. Utilisez **/compte**.",
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor("#2ECC71")
            .setTitle("💰 Votre solde")
            .setDescription(`Vous possédez actuellement **${joueur.credits} crédits**.`);

        await interaction.reply({ embeds: [embed] });
    }
};