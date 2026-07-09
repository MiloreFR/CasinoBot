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
const { getPlayer } = require("../utils/players");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("retrait")
        .setDescription("Demander un retrait de crédits")
        .addIntegerOption(option =>
            option
                .setName("montant")
                .setDescription("Montant du retrait")
                .setRequired(true)
                .setMinValue(1)
        ),

    async execute(interaction) {

        const montant = interaction.options.getInteger("montant");

        const joueur = getPlayer(interaction.user.id);

        if (!joueur) {
            return interaction.reply({
                content: "❌ Vous n'avez pas encore de compte.",
                ephemeral: true
            });
        }

        if (joueur.credits < montant) {
            return interaction.reply({
                content: "❌ Vous n'avez pas assez de crédits.",
                ephemeral: true
            });
        }

        const salon = await interaction.guild.channels.create({
            name: `💸-retrait-${interaction.user.username}`.toLowerCase(),

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
            .setColor("#F39C12")
            .setTitle("💸 Demande de retrait")
            .addFields(
                { name: "👤 Joueur", value: interaction.user.username, inline: true },
                { name: "💰 Montant", value: `${montant} crédits`, inline: true }
            )
            .setFooter({ text: "En attente d'un Banquier..." });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("retrait_valider")
                .setLabel("✅ Valider")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId("retrait_refuser")
                .setLabel("❌ Refuser")
                .setStyle(ButtonStyle.Danger)
        );

        await salon.send({
            embeds: [embed],
            components: [row]
        });

        tickets.createTicket(salon.id, {
            type: "retrait",
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