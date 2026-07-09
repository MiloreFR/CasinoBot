const tickets = require("../utils/tickets");
const { removeCredits } = require("../utils/players");
const config = require("../config.json");

const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = async (interaction) => {

    const ticket = tickets.getTicket(interaction.channel.id);

    if (!ticket) {
        return interaction.reply({
            content: "❌ Ticket introuvable.",
            ephemeral: true
        });
    }

    if (!interaction.member.roles.cache.has(config.roles.banquier)) {
        return interaction.reply({
            content: "❌ Seuls les Banquiers peuvent utiliser ces boutons.",
            ephemeral: true
        });
    }

    if (interaction.customId === "retrait_valider") {

        const success = removeCredits(ticket.joueur, ticket.montant);

        if (!success) {
            return interaction.reply({
                content: "❌ Le joueur ne possède plus assez de crédits.",
                ephemeral: true
            });
        }

        const embed = EmbedBuilder.from(interaction.message.embeds[0])
            .setColor("#00FF00")
            .setFooter({
                text: `✅ Retrait validé par ${interaction.user.username}`
            });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("fermer_ticket")
                .setLabel("🗑️ Fermer le ticket")
                .setStyle(ButtonStyle.Secondary)
        );

        return interaction.update({
            embeds: [embed],
            components: [row]
        });
    }

    if (interaction.customId === "retrait_refuser") {

        const embed = EmbedBuilder.from(interaction.message.embeds[0])
            .setColor("#FF0000")
            .setFooter({
                text: `❌ Retrait refusé par ${interaction.user.username}`
            });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("fermer_ticket")
                .setLabel("🗑️ Fermer le ticket")
                .setStyle(ButtonStyle.Secondary)
        );

        return interaction.update({
            embeds: [embed],
            components: [row]
        });
    }

};