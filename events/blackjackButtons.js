const blackjack = require("../utils/blackjack");
const { addCredits } = require("../utils/players");
const { drawCard, calculateScore } = require("../utils/cards");

const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = async (interaction) => {

    const game = blackjack.getGame(interaction.user.id);

    if (!game) {
        return interaction.reply({
            content: "❌ Aucune partie en cours.",
            ephemeral: true
        });
    }

    if (interaction.customId === "bj_hit") {

        // On pioche une carte
        const card = drawCard(game.deck);

        game.joueur.push(card);

       game.scoreJoueur = calculateScore(game.joueur);

// 💥 Bust
if (game.scoreJoueur > 21) {

    const cartes = game.joueur
        .map(c => c.text)
        .join("    ");

    blackjack.deleteGame(interaction.user.id);

    const row = new ActionRowBuilder().addComponents(

        new ButtonBuilder()
            .setCustomId("bj_hit")
            .setLabel("🟢 Tirer")
            .setStyle(ButtonStyle.Success)
            .setDisabled(true),

        new ButtonBuilder()
            .setCustomId("bj_stand")
            .setLabel("🟡 Rester")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true)

    );

    const embed = new EmbedBuilder()

        .setColor("#E74C3C")

        .setTitle("💥 BUST !")

        .setDescription(
`👤 Joueur : ${interaction.user.username}

${cartes}

Score : ${game.scoreJoueur}

━━━━━━━━━━━━━━━━━━

❌ Vous dépassez 21.

Vous perdez **${game.mise} crédits**.`
        );

    return interaction.update({
        embeds: [embed],
        components: [row]
    });

}
// 🃏 Blackjack
if (game.scoreJoueur === 21) {

    addCredits(interaction.user.id, game.mise * 2);

    blackjack.deleteGame(interaction.user.id);

    const cartes = game.joueur
        .map(c => c.text)
        .join("    ");

    const row = new ActionRowBuilder().addComponents(

        new ButtonBuilder()
            .setCustomId("bj_hit")
            .setLabel("🟢 Tirer")
            .setStyle(ButtonStyle.Success)
            .setDisabled(true),

        new ButtonBuilder()
            .setCustomId("bj_stand")
            .setLabel("🟡 Rester")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true)

    );

    const embed = new EmbedBuilder()

        .setColor("#2ECC71")

        .setTitle("🃏 BLACKJACK !")

        .setDescription(
`👤 Joueur : ${interaction.user.username}

${cartes}

Score : ${game.scoreJoueur}

━━━━━━━━━━━━━━━━━━

🎉 Félicitations !

Vous remportez **${game.mise * 2} crédits**.`
        );

    return interaction.update({
        embeds: [embed],
        components: [row]
    });

}
blackjack.createGame(interaction.user.id, game);

const cartes = game.joueur
    .map(c => c.text)
    .join("    ");
    

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

        const embed = new EmbedBuilder()

            .setColor("#F1C40F")

            .setTitle("🃏 WINABBO BLACKJACK")

            .setDescription(
`👤 Joueur : ${interaction.user.username}

${cartes}

Score : ${game.scoreJoueur}

━━━━━━━━━━━━━━━━━━

🤖 Croupier

${game.croupier[0].text}    ❓

━━━━━━━━━━━━━━━━━━

💰 Mise : ${game.mise} crédits`
);

      await message.edit({
    embeds: [embed],
    components: []
});

    }
if (interaction.customId === "bj_stand") {
const message = interaction.message;
await interaction.deferUpdate();
    while (game.scoreCroupier < 17) {

        await new Promise(resolve => setTimeout(resolve, 1000));

        const card = drawCard(game.deck);

        game.croupier.push(card);

        game.scoreCroupier = calculateScore(game.croupier);
if (game.scoreCroupier >= 17)
    break;
        blackjack.createGame(interaction.user.id, game);

        const cartesJoueur = game.joueur
            .map(c => c.text)
            .join("    ");

        const cartesCroupier = game.croupier
            .map(c => c.text)
            .join("    ");

        const embed = new EmbedBuilder()
            .setColor("#F1C40F")
            .setTitle("🃏 WINABBO BLACKJACK")
            .setDescription(
`👤 Joueur : ${interaction.user.username}

${cartesJoueur}

Score : ${game.scoreJoueur}

━━━━━━━━━━━━━━━━━━

🤖 Croupier

${cartesCroupier}

Score : ${game.scoreCroupier}

━━━━━━━━━━━━━━━━━━

💰 Mise : ${game.mise} crédits`
            );

await interaction.update({
    embeds: [embed],
    components: []
});

    }

}
};