# bed bot

Bot for Holli's Bed Wars server. Built with love and NodeJS.

## Initialization

Open the following link and add it to the server:

https://discordapp.com/oauth2/authorize?&client_id=708170445878198293&scope=bot&permissions=8

## Cron Job

The currently implemented cron job runs `!update` once every day at 12 AM EST. This ensures that everyone's stats are up to date with Hive at the beginning of every day.

## User Commands

* `[ign]` refers to your in-game-name for Minecraft

#### `!set [ign]`

*In progress*

Sets your ign to `[ign]` in the database. Can only be used in the channel `#set-ign`.

Once run, the user gets the following message:

```
Welcome to the server, user!

Your stats currently are:
20% WR
3.77 KD

Roles set!
```

The bot then adds the roles using `!update [mentioned user]`.

#### `!stats [ign]`

*In progress*

Pulls up the stats of any player.

## Admin Commands

* `[mentioned user]` refers to the user mentioned in Discord, for example **`@j_lancelott`**

#### `!update-all`

*In progress*

Updates all of the roles for all players in the database.

#### `!update [mentioned user]`

*In progress*

Updates the roles for a specific user. Assumes that the user is in the database, else throws an error.

#### `!add [mentioned user] [ign]`

Adds the ign of the mentioned user to the database.

#### `!remove [mentioned user]`

*Currently broken*

Removes the mentioned user from the database.

#### `!list`

Lists all the key, value (user, ign) pairs of the database.

#### `!wipe`

Wipes the database. Please do not use this if not needed.