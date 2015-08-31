import mui from 'material-ui';

import {
    fontWeights,
    fontColors,
    canvasColor,
    tintColor
} from '../constants/styles';

export function getCustomThemeManager() {
    const ThemeManager = new mui.Styles.ThemeManager();

    // Custom Theme
    ThemeManager.contentFontFamily = '"Open Sans", Arial, sans-serif';
    ThemeManager.setPalette({
        accent1Color: tintColor,
        canvasColor: canvasColor,
    });
    ThemeManager.setComponentThemes({
        appBar: {
            color: '#F7F9FA',
        },
        tab: {
            textColor: 'rgba(0, 0, 0, 0.3)',
            selectedTextColor: tintColor,
        },
        tabs: {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
        },
    });

    /**
     * The purpose of this object is to consolidate any common styles
     * for things that are shared amongst various components.
     *
     * Common styles between components is RARE and if they are sharing too many of
     * these, you should ask why there is no one component representing them.
     *
     * THIS SHOULD BE KEPT VERY SMALL, SO PLEASE DO NOT ABUSE THIS AS A PLACE FOR ADDING ALL CSS.
     */
    ThemeManager.commonStyles = {
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
            fontSize: '12px',
            lineHeight: '18px',
            ...fontColors.darkWhite,
        },
    };

    return ThemeManager;
}

export default getCustomThemeManager();

