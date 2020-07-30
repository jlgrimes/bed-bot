const moment = require('moment');
const { lastLogin, wr, kd } = require('../stats/helpers');
const { getUuid, getPlayerUrl } = require('../stats/api');
const { getColor } = require('../styles/colors')

const crafatarApi = (uuid) => `https://crafatar.com/renders/head/${uuid}.png`;

module.exports = {
    generate: async (data, ign, mode) => {
        const uuid = await getUuid(ign);

        let description = data.title ? `${data.title}` : ``
        description += `
${data.points} points
${data.winStreak} win streak
Last logged in at ${lastLogin(data)}
        `

        return {
            embed: {
                author: {
                    name: `${mode.name} Stats`
                },
                title: ign,
                url: getPlayerUrl(ign),
                description: description,
                color: getColor(mode),
                timestamp: moment().format(),
                footer: {
                    icon_url: 'https://i.imgur.com/7j7EAEm.png',
                    text: 'bed bot',
                },
                thumbnail: {
                    url: crafatarApi(uuid),
                },
                fields: [
                    {
                        name: 'Game Stats',
                        value: `
${data.victories} Victories
${data.gamesPlayed} Games Played
${wr(data)} Win Rate
${data.bedsDestroyed} Beds Destroyed
${data.teamsEliminated} Teams Eliminated
                        `,
                    },
                    {
                        name: 'Player Stats',
                        value: `
${data.kills} Kills
${data.deaths} Deaths
${kd(data)} KD
                        `,
                    },
                ],
            },
        };
    },
};
