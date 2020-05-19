const hive = require('hive-api');

const colors = {
    bwSolos: {
        hex: '#e76f51',
        num: 15167313
    },
    bwDuos: {
        hex: '#e9c46a',
        num: 15320170
    },
    bwTeams: {
        hex: '#2a9d8f',
        num: 2792847
    }
}

module.exports = {
    getColor: (mode) => {
        if (mode === hive.GameTypes.BEDS) {
            return colors.bwSolos.num
        }
        if (mode === hive.GameTypes.BEDD) {
            return colors.bwDuos.num
        }
        if (mode === hive.GameTypes.BEDT) {
            return colors.bwTeams.num
        }
        return null
    }
}