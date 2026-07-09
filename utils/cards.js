const suits = ["♠", "♥", "♦", "♣"];

const values = [
    { raw: "A", value: 11 },
    { raw: "2", value: 2 },
    { raw: "3", value: 3 },
    { raw: "4", value: 4 },
    { raw: "5", value: 5 },
    { raw: "6", value: 6 },
    { raw: "7", value: 7 },
    { raw: "8", value: 8 },
    { raw: "9", value: 9 },
    { raw: "10", value: 10 },
    { raw: "J", value: 10 },
    { raw: "Q", value: 10 },
    { raw: "K", value: 10 }
];

function createDeck() {

    const deck = [];

    for (const suit of suits) {

        for (const card of values) {

            deck.push({
                suit,
                raw: card.raw,
                value: card.value,
                text: `${suit} ${card.raw}`
            });

        }

    }

    shuffleDeck(deck);

    return deck;

}

function shuffleDeck(deck) {

    for (let i = deck.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [deck[i], deck[j]] = [deck[j], deck[i]];

    }

}

function drawCard(deck) {

    return deck.shift();

}

function calculateScore(hand) {

    let score = hand.reduce((total, card) => total + card.value, 0);

    let aces = hand.filter(card => card.raw === "A").length;

    while (score > 21 && aces > 0) {

        score -= 10;
        aces--;

    }

    return score;

}

module.exports = {
    createDeck,
    drawCard,
    calculateScore
};