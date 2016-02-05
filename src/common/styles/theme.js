import merge from 'lodash.merge';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';

import {
    fontWeights,
    fontColors,
    canvasColor,
    tintColor
} from '../constants/styles';

export function getCustomTheme(userAgent) {
    const baseTheme = {
        fontFamily: '"Open Sans", Arial, sans-serif',
        palette: {
            accent1Color: tintColor,
            canvasColor: canvasColor,
            // All of them are shades of tint color generated from:
            // http://mcg.mbitson.com/#/
            primary1Color: tintColor,
            primary2Color: '#5C6BBF',
            primary3Color: '#D7DDFF',
        }
    };
    const muiTheme = getMuiTheme(baseTheme, {userAgent});

    muiTheme.appBar.color = 'white';
    muiTheme.flatButton.color = 'rgb(255, 255, 255)';
    muiTheme.tab = {
        textColor: 'rgba(0, 0, 0, 0.3)',
        selectedTextColor: tintColor,
    };
    muiTheme.tabs.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    muiTheme.raisedButton.secondaryColor = '#5C6BBF';

    muiTheme.luno = {
        header: {
            primaryText: {
                fontSize: '36px',
                lineHeight: '49px',
                ...fontColors.white,
                ...fontWeights.light,
            },
            secondaryText: {
                textTransform: 'uppercase',
                fontSize: '12px',
                lineHeight: '17px',
                letterSpacing: '2px',
                ...fontColors.white,
                ...fontWeights.semiBold,
            },
            tertiaryText: {
                display: 'flex',
                alignItems: 'center',
                fontSize: '12px',
                lineHeight: '18px',
                ...fontColors.darkWhite,
            },
            icon: {
                height: 80,
                width: 80,
                color: 'white',
                strokeWidth: 1,
            },
            iconContainer: {
                position: 'relative',
                height: 120,
                width: 120,
                border: 'none',
                top: 0,
                left: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
        }
    };
    return muiTheme;
}

export function modifyBaseTheme(muiTheme, baseTheme) {
    const newBase = merge({}, muiTheme.baseTheme, baseTheme);
    return getMuiTheme(newBase, muiTheme);
}
