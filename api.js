const apiBase = 'http://api.hivemc.com/v1/';

module.exports = {
    bwStatsUrl: (name) => apiBase + 'player/' + name + '/BED'
}