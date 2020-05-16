const hive = require('hive-api');

module.exports = {
    getStats: (ign) => {
        let player = new hive.Player(ign);
        return player.gameInfo(hive.GameTypes.BED)
    }
}