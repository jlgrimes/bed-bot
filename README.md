# bed bot

Bot for Holli's Bed Wars server. Built with NodeJS + love <3

## User Commands

* **[ign]** refers to your in-game-name for Minecraft

### !set [ign]

Sets your ign to **[ign]** in the database.

```
!set [ign]
```
```
Welcome to fuck it, bw server, [ign]!
Your in game name has been successfully registered.
```

The bot then runs **!update [mentioned user]** (mentioned user being the current user who sent the message) to update their roles accordingly.

### !refresh

Refreshes your roles in the server. Requires that you have run `!set`.

```
!refresh
```

*Runs admin command **!update [your ign]`***

### !stats [mode] [ign]

Pulls up the stats of any player.

```
!stats SitOnMeYoshiko
```
```
Stats for SitOnMeYoshiko:
Points:    48720
Last Login:    5/17/2020, 3:40:44 PM UTC
Victories:    104
Games Played:    304
Win Rate:    34.211%
Kills:    1017
Deaths:    958
KD:    1.062
Beds Destroyed:    120
Teams Eliminated:    115
Win Streak:    6
Title:    Dreamer 5
```

### !compare [ign 1] [ign 2]

*Upcoming*

Compares the stats of any two players.

## Admin Commands

* **[mentioned user]** refers to the user mentioned in Discord, for example **@j_lancelott**

### !update-all

Updates all of the roles for all players in the database.

```
update-all
```

*Runs **!update [user]** for all users in the database.*

### !update [mentioned user]

Updates the roles for a specific user. Assumes that the user is in the database, else throws an error.

```
!update [mentioned user]
```
```
Roles [kd role] and [wr role] added for [mentioned user ign]
```

### !assign [mentioned user] [ign]

Assign the mentioned user to their in game name.

```
!assign [mentioned user] [ign]
```
```
Roles [kd role] and [wr role] added for [mentioned user ign]
```

### !list

Lists all the users in the database.

```
!list
```
```
@j_lancelott SitOnMeYoshiko
@Purpzuki HolliDoesntSit
...
```

## Cron Job

*currently broken help*

The currently implemented cron job runs `!update-all` once every **hour**. This ensures that everyone's stats are up to date with Hive all the time.

## Database

The database used is Postgres deployed on Heroku. The database has the following schema:

```
TABLE users (
    username varchar(255),
    ign varchar(255)
)
```

where `username` is the user's Discord username, and `ign` is their Minecraft in game name.
