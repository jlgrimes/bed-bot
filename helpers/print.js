const titlePaddingChars = 20;
const dataPaddingChars = 15;
const compPaddingChars = 5;

const generatePadding = (text, allocChars) => {
    text = text.toString();
    let padding = ``;
    [...Array(allocChars - text.length).keys()].forEach(ch => padding += ` `);
    return padding;
}

module.exports = {
    statsLine: (title, data) => {
        let padding = generatePadding(title, 20);
        return `${title}${padding}${data}`;
    },
    compareLine: (title, data1, data2) => {
        // blank line exception
        if (title === '') {
            return ''
        }

        const comp = (val1, val2) =>
            title.includes('Title') || title.includes('Comparing') ? `vs`
            : `${val1 > val2 
                    ? `>` 
                    : val1 < val2 
                        ? `<` 
                        : `=`}`

        let titlePadding = generatePadding(title, titlePaddingChars);
        let data1Padding = generatePadding(data1, dataPaddingChars);
        let data2Padding = generatePadding(data2, dataPaddingChars);
        let compPadding = generatePadding(comp(data1, data2), compPaddingChars )

        return `${title}${titlePadding}${data1}${data1Padding}${comp(data1, data2)}${compPadding}${data2}`
    }
}