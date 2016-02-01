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

    /**
     * The purpose of this object is to consolidate any common styles
     * for things that are shared amongst various components.
     *
     * Common styles between components is RARE and if they are sharing too many of
     * these, you should ask why there is no one component representing them.
     *
     * THIS SHOULD BE KEPT VERY SMALL, SO PLEASE DO NOT ABUSE THIS AS A PLACE FOR ADDING ALL CSS.
     */
    muiTheme.commonStyles = {
        headerPrimaryText: {
            fontSize: '36px',
            lineHeight: '49px',
            ...fontColors.white,
            ...fontWeights.light,
        },
        headerSecondaryText: {
            textTransform: 'uppercase',
            fontSize: '12px',
            lineHeight: '17px',
            letterSpacing: '2px',
            ...fontColors.white,
            ...fontWeights.semiBold,
        },
        headerTertiaryText: {
            display: 'flex',
            alignItems: 'center',
            fontSize: '12px',
            lineHeight: '18px',
            ...fontColors.darkWhite,
        },
    };
    return muiTheme;
}

export function modifyBaseTheme(muiTheme, baseTheme) {
    const newBase = merge({}, muiTheme.baseTheme, baseTheme);
    return getMuiTheme(newBase, muiTheme);
}
