const tickets = require("../utils/tickets");
const { addCredits } = require("../utils/players");
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

    if (interaction.customId === "recharge_valider") {

        addCredits(ticket.joueur, ticket.montant);

        const embed = EmbedBuilder.from(interaction.message.embeds[0])
            .setColor("#00ff00")
            .setFooter({
                text: `✅ Recharge validée par ${interaction.user.username}`
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

    if (interaction.customId === "recharge_refuser") {

        const embed = EmbedBuilder.from(interaction.message.embeds[0])
            .setColor("#ff0000")
            .setFooter({
                text: `❌ Recharge refusée par ${interaction.user.username}`
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

    if (interaction.customId === "fermer_ticket") {

        tickets.deleteTicket(interaction.channel.id);

        await interaction.reply({
            content: "🗑️ Fermeture du ticket..."
        });

        setTimeout(async () => {
            await interaction.channel.delete().catch(console.error);
        }, 3000);
    }

};