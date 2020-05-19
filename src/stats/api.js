const hive = require('hive-api');

const fetchUuid = async (ign) => {
    try {
        let player = new hive.Player(ign);
        const response = await player.info();
        return response.uuid;
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getStats: (ign, mode) => {
        let player = new hive.Player(ign);
        return player.gameInfo(mode);
    },
    getUuid: async (ign) => {
        let uuid = await fetchUuid(ign);
        return uuid;
    },
    getPlayerUrl: (ign) => {
        let player = new hive.Player(ign);
        return player.profileUrl;
    },
};
