require('dotenv').config();

const { Command } = require('discord.js-commando');
const servRoles = require('../../src/constants/roles');
const api = require('../../src/stats/api');
const hive = require('hive-api');

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

// data is what is returned from bw api
const winRate = (data) => data.victories / data.gamesPlayed;
const kd = (data) => data.kills / data.deaths;

const trimMention = (mention) =>
    mention.replace('<@', '').replace('>', '').replace('!', '');

module.exports = class UpdateCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'update',
            group: 'admin',
            memberName: 'update',
            description: "Updates a users' roles with their in-game stats.",
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    key: 'mentioned',
                    prompt: 'Mention a user',
                    type: 'user',
                },
            ],
            guildOnly: true,
        });
    }

    async addServRoles(mentionId, ign, message) {
        mentionId = trimMention(mentionId);

        const guild = this.client.guilds.resolve(process.env.SERVER_ID);
        const data = await api.getStats(ign, hive.GameTypes.BED)

        const roles = await guild.roles.fetch()
            let servKdRole = servRoles.kd.filter((kdRole) =>
                kdRole.range(kd(data))
            );
            let servKdRoleName = servKdRole[0].name;

            let kdRole = roles.cache.filter(
                (role) => role.name === servKdRoleName
            );
            if (kdRole.size === 0) {
                message.member.send(`No roles named ${name}`);
                return;
            }
            kdRole = kdRole.values().next().value;

            let servWrRole = servRoles.wr.filter((wrRole) =>
                wrRole.range(winRate(data))
            );
            let servWrRoleName = servWrRole[0].name;

            let wrRole = roles.cache.filter(
                (role) => role.name === servWrRoleName
            );
            if (wrRole.size === 0) {
                message.member.send(`No roles named ${name}`);
                return;
            }
            wrRole = wrRole.values().next().value;

            const member = await guild.members.fetch(mentionId)
            const allServRoleNames = [
                ...servRoles.kd.map((role) => role.name),
                ...servRoles.wr.map((role) => role.name),
            ];
            const allServRoles = roles.cache.filter((role) =>
                allServRoleNames.includes(role.name)
            );

            await member.roles.remove(allServRoles);
            await member.roles.add([wrRole, kdRole]);
            message.reply(`Roles ${servWrRoleName} and ${servKdRoleName} added for ${member.user.username}`)
    }

    async run(message, { mentioned }) {
        if (message.channel.guild.id !== process.env.SERVER_ID) {
            message.reply(`Must be on Holli's server to run`);
            return;
        }

        let mention = mentioned.id;

        const query = `
        SELECT username, ign FROM users WHERE username = '<@${mention}>';
        `;

        const client = await pool.connect();
        try {
            const res = await client.query(query);
            const ign = res.rows[0].ign;
            await this.addServRoles(mention, ign, message);
        } finally {
            client.release();
        }
    }
};
