module.exports = {
    kd: [
        {
            name: '<1kd',
            range: (kd) => kd < 1,
        },
        {
            name: '1kd',
            range: (kd) => kd >= 1 && kd < 2,
        },
        {
            name: '2kd',
            range: (kd) => kd >= 2 && kd < 3,
        },
        {
            name: '3kd',
            range: (kd) => kd >= 3 && kd < 4,
        },
        {
            name: '4+kd',
            range: (kd) => kd > 4,
        },
    ],
    wr: [
        {
            name: 'carried',
            range: (wr) => wr < 0.3,
        },
        {
            name: '30%',
            range: (wr) => wr >= 0.3 && wr < 0.4,
        },
        {
            name: '40%',
            range: (wr) => wr >= 0.4 && wr < 0.5,
        },
        {
            name: '50%',
            range: (wr) => wr >= 0.5 && wr < 0.6,
        },
        {
            name: '60%',
            range: (wr) => wr >= 0.6 && wr < 0.7,
        },
        {
            name: '70%',
            range: (wr) => wr >= 0.7 && wr < 0.8,
        },
        {
            name: '80%',
            range: (wr) => wr >= 0.8 && wr < 0.9,
        },
        {
            name: '90%',
            range: (wr) => wr >= 0.9,
        },
    ],
};
