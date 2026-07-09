const {
    ChannelType,
    PermissionFlagsBits
} = require("discord.js");

const config = require("../config.json");

async function createTicket(guild, user, type) {

    const channel = await guild.channels.create({
        name: `${type}-${user.username}`.toLowerCase(),

        type: ChannelType.GuildText,

        parent: config.categories.tickets,

        permissionOverwrites: [
            {
                id: guild.roles.everyone.id,
                deny: [PermissionFlagsBits.ViewChannel],
            },
            {
                id: user.id,
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
            {
                id: guild.members.me.id,
                allow: [PermissionFlagsBits.Administrator],
            },
        ],
    });

    return channel;
}

module.exports = {
    createTicket
};