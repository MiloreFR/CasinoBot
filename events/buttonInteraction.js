const rechargeButtons = require("./rechargeButtons");
const retraitButtons = require("./retraitButtons");
const blackjackButtons = require("./blackjackButtons");

module.exports = async (interaction) => {

    if (!interaction.isButton()) return;

    // Recharge
    if (
        interaction.customId.startsWith("recharge_") ||
        interaction.customId === "fermer_ticket"
    ) {
        return rechargeButtons(interaction);
    }

    // Retrait
    if (
        interaction.customId.startsWith("retrait_")
    ) {
        return retraitButtons(interaction);
    }

    // Blackjack
    if (
        interaction.customId.startsWith("bj_")
    ) {
        return blackjackButtons(interaction);
    }

};