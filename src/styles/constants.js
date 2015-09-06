const baseColors = {
    brown: '#C6AE8D',
    red: '#C46973',
    pink: '#C085AE',
    purple: '#B37DD1',
    violet: '#898FD2',
    blue: '#77A5C5',
    green: '#8CCB9D',
};

const brightColors = [
    baseColors.brown,
    baseColors.red,
    baseColors.pink,
    baseColors.purple,
    baseColors.violet,
    baseColors.blue,
    baseColors.green,
];

const colors = {
    bright: brightColors,
    background: 'rgb(47, 55, 62)',
    tint: 'rgb(0, 201, 255)',
    lightText: 'white',
};

export default {
    baseColors: baseColors,
    colors: colors,

    // allows us to change paddings and margins across the site
    verticalUnit: 10,
    horizontalUnit: 10,

};
