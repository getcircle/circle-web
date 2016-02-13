import merge from 'lodash.merge';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';

import Colors from './Colors';

export const fontWeights = {
    light: 300,
    bold: 'bold',
    semiBold: 600,
};

export function getCustomTheme(userAgent) {
    const tintColor = Colors.blue700;
    const baseTheme = {
        fontFamily: '"Lato", Arial, sans-serif',
        palette: {
            accent1Color: tintColor,
            canvasColor: Colors.white,
            primary1Color: tintColor,
            primary2Color: Colors.blue500,
            primary3Color: Colors.blue200,
        },
    };
    const muiTheme = getMuiTheme(baseTheme, {userAgent});

    muiTheme.appBar.color = Colors.white;
    muiTheme.flatButton.color = Colors.white;
    muiTheme.tabs.backgroundColor = Colors.white;
    muiTheme.tabs.textColor = Colors.lightBalck;
    muiTheme.tabs.selectedTextColor = tintColor;

    muiTheme.raisedButton.secondaryColor = '#5C6BBF';

    const { palette } = muiTheme.baseTheme;

    muiTheme.luno = {
        fontFamilies: {
            regular: '"Lato", Arial, sans-serif',
            medium: '"Lato-Black", Arial, sans-serif',
            bold: '"Lato-Bold", Arial, sans-serif',
        },
        fontSizes: {
            buttonText: '1.1rem',
        },
        tintColor: tintColor,
        detail: {
            h1: {
                fontSize: '21px',
                lineHeight: '25px',
                color: palette.primaryTextColor,
            },
            h2: {
                fontSize: '11px',
                lineHeight: '13px',
                color: Colors.extraLightBlack,
                textTransform: 'uppercase',
            },
            primaryText: {
                fontSize: '13px',
                lineHeight: '20px',
                color: Colors.lightBlack,
            },
        },
        form: {
            field: {
                border: `1px solid ${Colors.minBlack}`,
                borderRadius: '2px',
                boxSizing: 'border-box',
                color: Colors.darkBlack,
                display: 'flex',
                fontSize: 14,
                lineHeight: '14px',
                outline: 'none',
                padding: '10px',
                width: '100%',
            },
            fieldError: {
                border: `1px solid ${Colors.red700}`,
            },
            removeCross: {
                color: '#F46F6F',
            },
        },
        header: {
            primaryText: {
                fontSize: '36px',
                lineHeight: '49px',
                color: palette.alternateTextColor,
                fontWeight: fontWeights.light,
            },
            secondaryText: {
                textTransform: 'uppercase',
                fontSize: '12px',
                lineHeight: '17px',
                letterSpacing: '2px',
                color: palette.alternateTextColor,
                fontWeight: fontWeights.semiBold,
            },
            tertiaryText: {
                display: 'flex',
                alignItems: 'center',
                fontSize: '12px',
                lineHeight: '18px',
                color: Colors.darkWhite,
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
                backgroundColor: Colors.minWhite,
            },
        },
    };
    return muiTheme;
}

export function modifyBaseTheme(muiTheme, baseTheme) {
    const newBase = merge({}, muiTheme.baseTheme, baseTheme);
    return getMuiTheme(newBase, muiTheme);
}
