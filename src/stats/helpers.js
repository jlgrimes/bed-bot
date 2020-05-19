const hive = require('hive-api');

module.exports = {
    lastLogin: (data) =>
        data.lastLogin.toLocaleString('en-US', { timeZoneName: 'short' }),
    wr: (data) => `${((100 * data.victories) / data.gamesPlayed).toFixed(3)}%`,
    kd: (data) => (data.kills / data.deaths).toFixed(3),
    modeEnum: (mode) => {
        if (!mode) {
            return hive.GameTypes.BED
        }

        if (mode.includes('solo')) {
            return hive.GameTypes.BEDS;
        } else if (mode.includes('duo')) {
            return hive.GameTypes.BEDD;
        } else if (mode.includes('team')) {
            return hive.GameTypes.BEDT;
        }
        return hive.GameTypes.BED
    }
};
