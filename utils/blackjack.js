const fs = require("fs");
const path = require("path");

const blackjackPath = path.join(__dirname, "../data/blackjack.json");

function loadGames() {
    if (!fs.existsSync(blackjackPath)) {
        fs.writeFileSync(blackjackPath, "{}");
    }

    return JSON.parse(fs.readFileSync(blackjackPath, "utf8"));
}

function saveGames(games) {
    fs.writeFileSync(blackjackPath, JSON.stringify(games, null, 4));
}

function createGame(userId, data) {
    const games = loadGames();

    games[userId] = data;

    saveGames(games);
}

function getGame(userId) {
    const games = loadGames();

    return games[userId];
}

function deleteGame(userId) {
    const games = loadGames();

    delete games[userId];

    saveGames(games);
}

function hasGame(userId) {
    const games = loadGames();

    return !!games[userId];
}

module.exports = {
    createGame,
    getGame,
    deleteGame,
    hasGame
};