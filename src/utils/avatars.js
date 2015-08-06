import _ from 'lodash';

import constants from '../styles/constants';

const key = 'alphaColors';

export function getRandomColor(name) {
    let alphaColors = {};
    if (window.localStorage.getItem(key)) {
        alphaColors = JSON.parse(window.localStorage.getItem(key));
    }

    let character = name[0];
    let color = alphaColors[character];
    if (!color) {
        let colors = constants.colors.bright;
        color = colors[_.random(0, colors.length - 1)];
        alphaColors[character] = color;
    }
    window.localStorage.setItem(key, JSON.stringify(alphaColors));
    return color;
}
