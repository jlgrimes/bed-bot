# bed bot

Bot for Holli's Bed Wars server. Built with love and NodeJS.

## Initialization

Open the following link and add it to the server:

https://discordapp.com/oauth2/authorize?&client_id=708170445878198293&scope=bot&permissions=8

## User Commands

* `[ign]` refers to your in-game-name for Minecraft

#### `!ign [ign]`

Sets your ign to `[ign]` in the database. To be used in the channel `#set-ign`.

#### `!stats [ign]`

Pulls up the stats of any player.

## Admin Commands

* `[mentioned user]` refers to the user mentioned in Discord, for example **@j_lancelott**

#### `!stats-update-all`

Updates all of the roles for all players in the database.

#### `!set-ign [mentioned user] [ign]`

Adds the ign of the mentioned user to the database.

#### `!remove-ign [mentioned user]`

Removes the mentioned user from the database.

#### `!list-ign`

Lists all the key, value (user, ign) pairs of the database.

### Additional Admin Commands

These aren't that important but might come in handy.

#### `!stats-update [mentioned user]`

Updates the roles for `[mentioned user]`.

#### `!wipe-ign`

Wipes the database. Please do not use this if not needed.