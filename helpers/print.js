module.exports = {
    statsLine: (title, data) => {
        let padding = ``;
        const allocChars = 20;

        [...Array(allocChars - title.length).keys()].forEach(ch => padding += ` `)
        return `${title}${padding}${data}`;
    }
}