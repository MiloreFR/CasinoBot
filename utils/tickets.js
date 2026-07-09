const fs = require("fs");
const path = require("path");

const ticketsPath = path.join(__dirname, "../data/tickets.json");

function loadTickets() {
    if (!fs.existsSync(ticketsPath)) {
        fs.writeFileSync(ticketsPath, "{}");
    }

    return JSON.parse(fs.readFileSync(ticketsPath, "utf8"));
}

function saveTickets(tickets) {
    fs.writeFileSync(ticketsPath, JSON.stringify(tickets, null, 4));
}

function createTicket(channelId, data) {
    const tickets = loadTickets();

    tickets[channelId] = data;

    saveTickets(tickets);
}

function getTicket(channelId) {
    const tickets = loadTickets();

    return tickets[channelId];
}

function deleteTicket(channelId) {
    const tickets = loadTickets();

    delete tickets[channelId];

    saveTickets(tickets);
}

module.exports = {
    createTicket,
    getTicket,
    deleteTicket
};