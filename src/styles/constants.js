'use strict';

const baseColors = {
    olive: 'rgb(30, 146, 57)',
    tumeric: 'rgb(14, 99, 177)',
    shakespeare: 'rgb(109, 109, 109)',
    sienna: 'rgb(213, 102, 19)',
    violet: 'rgb(119, 65, 133)',
    fuchsia: 'rgb(179, 44, 40)',
};

const brightColors = [
    baseColors.olive,
    baseColors.tumeric,
    baseColors.shakespeare,
    baseColors.sienna,
    baseColors.violet,
    baseColors.fuchsia,
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
