const {
    createDeck,
    drawCard,
    calculateScore
} = require("../utils/cards");
const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const config = require("../config.json");
const blackjack = require("../utils/blackjack");
const {
    getPlayer,
    removeCredits
} = require("../utils/players");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bj")
        .setDescription("Jouer au Blackjack")
        .addIntegerOption(option =>
            option
                .setName("mise")
                .setDescription("Montant de la mise")
                .setRequired(true)
        ),

    async execute(interaction) {

        const mise = interaction.options.getInteger("mise");

        if (mise < config.blackjack.minBet) {
            return interaction.reply({
                content: `❌ La mise minimum est de ${config.blackjack.minBet} crédits.`,
                ephemeral: true
            });
        }

        if (mise > config.blackjack.maxBet) {
            return interaction.reply({
                content: `❌ La mise maximum est de ${config.blackjack.maxBet} crédits.`,
                ephemeral: true
            });
        }

        if (blackjack.hasGame(interaction.user.id)) {
            return interaction.reply({
                content: "❌ Vous avez déjà une partie en cours.",
                ephemeral: true
            });
        }

        const joueur = getPlayer(interaction.user.id);

        if (!joueur) {
            return interaction.reply({
                content: "❌ Vous n'avez pas encore de compte.",
                ephemeral: true
            });
        }

        if (joueur.credits < mise) {
            return interaction.reply({
                content: "❌ Vous n'avez pas assez de crédits.",
                ephemeral: true
            });
        }

        removeCredits(interaction.user.id, mise);

    const deck = createDeck();

const mainJoueur = [
    drawCard(deck),
    drawCard(deck)
];

const croupier = [
    drawCard(deck),
    drawCard(deck)
];

const scoreJoueur = calculateScore(mainJoueur);
const scoreCroupier = calculateScore(croupier);

const random = Math.floor(Math.random() * 100) + 1;

let resultat = "joueur";

if (random <= config.blackjack.casinoWin) {
    resultat = "casino";
}
else if (random <= config.blackjack.casinoWin + config.blackjack.draw) {
    resultat = "egalite";
}

blackjack.createGame(interaction.user.id, {
    mise,
    resultat,
    deck,
    joueur: mainJoueur,
    croupier,
    scoreJoueur,
    scoreCroupier
});

        const embed = new EmbedBuilder()
            .setColor("#F1C40F")
            .setTitle("🧪 TEST")
            .setDescription(
`👤 Joueur : ${interaction.user.username}

Vos cartes
${mainJoueur[0].text}    ${mainJoueur[1].text}

Score : ${scoreJoueur}

━━━━━━━━━━━━━━━━━━

🤖 Croupier

${croupier[0].text}    ❓

━━━━━━━━━━━━━━━━━━

💰 Mise : ${mise} crédits`
)

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("bj_hit")
                .setLabel("🟢 Tirer")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId("bj_stand")
                .setLabel("🟡 Rester")
                .setStyle(ButtonStyle.Primary)
        );

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });

    },
};