const tickets = require("../utils/tickets");
const {
    SlashCommandBuilder,
    ChannelType,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const config = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("recharge")
        .setDescription("Demander une recharge de crédits")
        .addIntegerOption(option =>
            option
                .setName("montant")
                .setDescription("Montant de la recharge")
                .setRequired(true)
                .setMinValue(1)
        ),

    async execute(interaction) {

        const montant = interaction.options.getInteger("montant");

        const salon = await interaction.guild.channels.create({
            name: `💳-recharge-${interaction.user.username}`.toLowerCase(),

            type: ChannelType.GuildText,

            parent: config.categories.tickets,

            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory
                    ],
                },
                {
                    id: config.roles.banquier,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory
                    ],
                },
            ],
        });

        const embed = new EmbedBuilder()
            .setColor("#2ECC71")
            .setTitle("💳 Demande de recharge")
            .addFields(
                { name: "👤 Joueur", value: `${interaction.user}`, inline: true },
                { name: "💰 Montant", value: `${montant} crédits`, inline: true }
            )
            .setFooter({ text: "En attente d'un Banquier..." })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
        .setCustomId("recharge_valider")
        .setLabel("✅ Valider")
        .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
        .setCustomId("recharge_refuser")
        .setLabel("❌ Refuser")
        .setStyle(ButtonStyle.Danger)
);

await salon.send({
    embeds: [embed],
    components: [row]
});
tickets.createTicket(salon.id, {
    type: "recharge",
    joueur: interaction.user.id,
    montant: montant,
    statut: "en_attente"
});
        await interaction.reply({
            content: `✅ Votre demande a été créée : ${salon}`,
            ephemeral: true
        });

    },
};