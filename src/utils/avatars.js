'use strict';

import _ from 'lodash';

import constants from '../styles/constants';

let alphaColors = {};


export function getColorForProfile(profile) {
    let character = profile.first_name[0];
    let color = alphaColors[character];
    if (!color) {
        let colors = constants.colors.bright;
        color = colors[_.random(0, colors.length - 1)];
        alphaColors[character] = color;
    }
    return color;
}
