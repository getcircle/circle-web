'use strict';

const baseColors = {
    olive: '#558920',
    tumeric: '#CEC248',
    shakespeare: '#5CA7CF',
    sienna: '#D88E40',
    violet: '#972FAD',
    fuchsia: '#8B4CC7',
    darkGray: '#1F2532',
};

const brightColors = [
    baseColors.olive,
    baseColors.tumeric,
    baseColors.shakespeare,
    baseColors.sienna,
    baseColors.violet,
    baseColors.fuchsia,
]

const colors = {
    bright: brightColors,
    headerBackground: baseColors.darkGray,
}

export default {
    baseColors: baseColors,
    colors: colors,

    // allows us to change paddings and margins across the site
    verticalUnit: 10,
    horizontalUnit: 10,

};
