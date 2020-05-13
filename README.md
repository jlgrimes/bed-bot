# bed bot

Bot for Holli's Bed Wars server. Built with NodeJS + love <3

## Cron Job

The currently implemented cron job runs `!update-all` once every **hour**. This ensures that everyone's stats are up to date with Hive all the time.

## User Commands

* `[ign]` refers to your in-game-name for Minecraft

#### `!set [ign]`

Sets your ign to `[ign]` in the database. Can only be used in the channel `#set-ign`.

Once run, the user gets the following message:

```
Welcome to fuck it, bw server, demathderp!
Your in game name has been successfully registered.
```

#### `!stats [ign]`

Pulls up the stats of any player.

## Admin Commands

* `[mentioned user]` refers to the user mentioned in Discord, for example **`@j_lancelott`**

#### `!update-all`

Updates all of the roles for all players in the database.

#### `!update [mentioned user]`

Updates the roles for a specific user. Assumes that the user is in the database, else throws an error.

#### `!assign [mentioned user] [ign]`

Assign the mentioned user to their in game name.

#### `!list`

Lists all the key, value (user, ign) pairs of the database.