const { EmbedBuilder } = require("discord.js");

function createSoldeEmbed(user, credits) {
    return new EmbedBuilder()
        .setColor("#00B050")
        .setTitle("💰 WinAbbo Bet • Solde")
        .setDescription(
            `👤 **Joueur :** ${user}\n\n` +
            `💰 **Crédits :** ${credits}`
        )
        .setTimestamp();
}

module.exports = { createSoldeEmbed };