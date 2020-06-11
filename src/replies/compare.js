const Discord = require('discord.js');
const Jimp = require('jimp');
const moment = require('moment');
const ColorThief = require('color-thief-jimp');

const { lastLogin, wr, kd } = require('../stats/helpers');
const { getUuid, getPlayerUrl } = require('../stats/api');
const { getColor } = require('../styles/colors');

const crafatarApi = (uuid) => `https://crafatar.com/avatars/${uuid}.png`;

const getThumbnail = async (image1, image2) => {
    await image1.scan(
        0,
        0,
        image1.bitmap.width,
        image1.bitmap.height,
        (x, y, idx) => {
            if (image1.bitmap.width - x > y) {
                return;
            }
            image1.setPixelColor(image2.getPixelColor(x, y), x, y);
        }
    );

    const buffer = await image1.getBufferAsync(Jimp.AUTO);
    return buffer;
};

module.exports = {
    generate: async (data1, data2, ign1, ign2) => {
        let description = ``;
        description += `
${data1.points} vs ${data2.points} points
${data1.winStreak} vs ${data2.winStreak} win streak
        `;

        const uuid1 = await getUuid(ign1);
        const uuid2 = await getUuid(ign2);

        const image1 = await Jimp.read(crafatarApi(uuid1));
        const image2 = await Jimp.read(crafatarApi(uuid2));

        let thumbnail = await getThumbnail(image1, image2);
        const file = new Discord.MessageAttachment(thumbnail, 'thumb.png');

        return {
            files: [file],
            embed: {
                author: {
                    name: `BedWars Stats Compare`,
                },
                title: `${ign1} vs ${ign2}`,
                description: description,
                color: getColor(),
                timestamp: moment().format(),
                footer: {
                    icon_url: 'https://i.imgur.com/7j7EAEm.png',
                    text: 'bed bot',
                },
                thumbnail: {
                    url: 'attachment://thumb.png',
                },
                fields: [
                    {
                        name: 'Game Stats',
                        value: `
${data1.victories} vs ${data2.victories} Victories
${data1.gamesPlayed} vs ${data2.victories} Games Played
${wr(data1)} vs ${wr(data2)} Win Rate
${data1.bedsDestroyed} vs ${data2.bedsDestroyed} Beds Destroyed
${data1.teamsEliminated} vs ${data2.teamsEliminated} Teams Eliminated
                        `,
                    },
                    {
                        name: 'Player Stats',
                        value: `
${data1.kills} vs ${data2.kills} Kills
${data1.deaths} vs ${data2.deaths} Deaths
${kd(data1)} vs ${kd(data2)} KD
                        `,
                    },
                ],
            },
        };
    },
};
