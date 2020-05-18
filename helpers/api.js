const hive = require('hive-api');

module.exports = {
    getStats: (ign, mode) => {
        let player = new hive.Player(ign);

        if (mode) {
            if (mode.includes('solo')) {
                return player.gameInfo(hive.GameTypes.BEDS);
            } else if (mode.includes('duo')) {
                return player.gameInfo(hive.GameTypes.BEDD);
            } else if (mode.includes('team')) {
                return player.gameInfo(hive.GameTypes.BEDT);
            }
        }

        return player.gameInfo(hive.GameTypes.BED);
    },
};
