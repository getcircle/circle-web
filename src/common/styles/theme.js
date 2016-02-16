import merge from 'lodash.merge';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';

import Colors from './Colors';
import FontWeights from './FontWeights';

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
        fontFamilies: Fonts,
        fontSizes: {
            buttonText: '1.1rem',
        },
        tintColor: tintColor,
        dialog: {
            title: {
                color: Colors.black,
                fontSize: '1.8rem',
                fontWeight: FontWeights.bold,
                lineHeight: '22px',
                alignSelf: 'center',
                display: 'flex',
                letterSpacing: '1px',
            },
        },
        detail: {
            h1: {
                fontSize: '21px',
                lineHeight: '25px',
                color: palette.primaryTextColor,
                fontWeight: FontWeights.normal,
            },
            h2: {
                fontSize: '1.1rem',
                lineHeight: '1.3rem',
                letterSpacing: '1px',
                color: Colors.extraLightBlack,
                textTransform: 'uppercase',
                fontWeight: FontWeights.bold,
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
                color: Colors.black,
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
            label: {
                display: 'block',
                fontSize: 11,
                letterSpacing: '1px',
                lineHeight: '11px',
                marginTop: 20,
                marginBottom: 5,
                textAlign: 'left',
                color: Colors.mediumBlack,
                fontWeight: FontWeights.bold,
            },
            removeCross: {
                color: '#F46F6F',
            },
        },
        header: {
            primaryText: {
                fontSize: '2.8rem',
                lineHeight: '3.4rem',
                color: palette.alternateTextColor,
                fontWeight: FontWeights.bold,
            },
            secondaryText: {
                fontSize: '1.4rem',
                lineHeight: '1.7rem',
                color: palette.alternateTextColor,
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
                height: 100,
                width: 100,
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
