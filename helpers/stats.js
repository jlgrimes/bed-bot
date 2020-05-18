module.exports = {
    lastLogin: (data) => data.lastLogin.toLocaleString('en-US', { timeZoneName: 'short' }),
    wr: (data) => `${(100 * data.victories / data.gamesPlayed).toFixed(3)}%`,
    kd: (data) => (data.kills / data.deaths).toFixed(3)
}
