const moment = require('moment');

module.exports = {
    generate: (shitlist) => {
        return {
            embed: {
                title: 'Shit List',
                description: `
*please go run \`!set\` in #ign or you will be kicked*

${shitlist.join('\n')}`,
                timestamp: moment().format(),
                footer: {
                    icon_url: 'https://i.imgur.com/7j7EAEm.png',
                    text: 'bed bot',
                },
            },
        };
    },
};
