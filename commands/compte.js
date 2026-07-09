const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const playersPath = path.join(__dirname, "../data/players.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("compte")
        .setDescription("Affiche votre compte WinAbbo Bet"),

    async execute(interaction) {

        let players = {};

        if (fs.existsSync(playersPath)) {
            players = JSON.parse(fs.readFileSync(playersPath, "utf8"));
        }

        const id = interaction.user.id;

        let bienvenue = false;

        if (!players[id]) {
            players[id] = {
                credits: 20,
                wins: 0,
                losses: 0,
                level: 1
            };

            bienvenue = true;

            fs.writeFileSync(playersPath, JSON.stringify(players, null, 4));
        }

        const joueur = players[id];

        const embed = new EmbedBuilder()
            .setColor("#FFD700")
            .setTitle("🎰 WinAbbo Bet")
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .addFields(
                { name: "👤 Joueur", value: interaction.user.username, inline: true },
                { name: "💰 Crédits", value: `${joueur.credits}`, inline: true },
                { name: "⭐ Niveau", value: `${joueur.level}`, inline: true },
                { name: "🏆 Victoires", value: `${joueur.wins}`, inline: true },
                { name: "💸 Défaites", value: `${joueur.losses}`, inline: true }
            );

        if (bienvenue) {
            embed.setDescription("🎁 **Bienvenue sur WinAbbo Bet !**\nVous recevez **20 crédits** de bienvenue.");
        }

        await interaction.reply({ embeds: [embed] });
    },
};