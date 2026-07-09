const fs = require("fs");
const path = require("path");

const playersPath = path.join(__dirname, "../data/players.json");

function loadPlayers() {
    if (!fs.existsSync(playersPath)) {
        fs.writeFileSync(playersPath, "{}");
    }

    return JSON.parse(fs.readFileSync(playersPath, "utf8"));
}

function savePlayers(players) {
    fs.writeFileSync(playersPath, JSON.stringify(players, null, 4));
}

function getPlayer(id) {
    const players = loadPlayers();
    return players[id];
}

function playerExists(id) {
    const players = loadPlayers();
    return !!players[id];
}

function createPlayer(id) {
    const players = loadPlayers();

    if (!players[id]) {
        players[id] = {
            credits: 20,
            wins: 0,
            losses: 0,
            level: 1,
            createdAt: Date.now()
        };

        savePlayers(players);
    }

    return players[id];
}

function addCredits(id, amount) {
    const players = loadPlayers();

    if (!players[id]) return false;

    players[id].credits += amount;

    savePlayers(players);

    return players[id];
}

function removeCredits(id, amount) {
    const players = loadPlayers();

    if (!players[id]) return false;

    if (players[id].credits < amount) return false;

    players[id].credits -= amount;

    savePlayers(players);

    return players[id];
}

module.exports = {
    loadPlayers,
    savePlayers,
    getPlayer,
    playerExists,
    createPlayer,
    addCredits,
    removeCredits
};