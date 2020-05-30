const moment = require('moment');

module.exports = {
    generate: () => {
        return {
            embed: {
                title: 'Welcome to fuck it, bed wars!',
                description: `

I'm bed bot, a bot that manages users + allows lots of cool features from within the server.

Please run \`!set\` in the channel #ign in order to get your roles!

You can also ask me to stat check any player by running \`!stats ign\`, where \`ign\` is the user's in game name.

You can check game mode specific stats by running :

\`\`\`
!stats solos ign
!stats duos ign
!stats teams ign
\`\`\`

*pro tip: if you ran \`!set\` and you're stat checking yourself, you don't need to type in your ign*

Please message the bot creator <@265515383773986817> for any questions - thanks!
`,
                timestamp: moment().format(),
                footer: {
                    icon_url: 'https://i.imgur.com/7j7EAEm.png',
                    text: 'bed bot',
                },
            },
        };
    },
};
