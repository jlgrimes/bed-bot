require('dotenv').config();

const { CommandoClient } = require('discord.js-commando');
const path = require('path');

const client = new CommandoClient({
    commandPrefix: process.env.VERSION === 'dev' ? '?' : '!',
    owner: '265515383773986817',
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['admin', 'Administrator'],
        ['user', 'User'],
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
client.login(process.env.DISCORD_TOKEN);

client.on('message', (message) => {
    //...
});

client.on('messageReactionAdd', async (reaction, user) => {
	// When we receive a reaction we check if the reaction is partial or not
	if (reaction.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			await reaction.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}
	// Now the message has been cached and is fully available
	// console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
	// The reaction is now also fully available and the properties will be reflected accurately:
   //  console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
    
    const guild = client.guilds.resolve(process.env.SERVER_ID);
    const roles = await guild.roles.fetch();

    const roleName = reaction.message.content.split('`')[1]
    const targetRole = roles.cache.filter(
        (role) => role.name === roleName
    );

    const member = await guild.members.fetch(user.id)
    member.roles.add(targetRole)
    console.log("role added")
});
