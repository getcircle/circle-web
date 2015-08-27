import { FlatButton } from 'material-ui';
import React, { PropTypes } from 'react';

import { fontColors, fontWeights, tintColor } from '../constants/styles';

import CSSComponent from './CSSComponent';

class AutoCompleteToken extends CSSComponent {

    static propTypes = {
        buttonStyle: PropTypes.object,
        label: PropTypes.string.isRequired,
    }

    classes() {
        return {
            'default': {
                FlatButton: {
                    style: {
                        backgroundColor: tintColor,
                        borderRadius: 3,
                        display: 'flex',
                        height: '100%',
                        justifyContent: 'center',
                        marginTop: 10,
                        marginLeft: 6,
                        minWidth: 50,
                        paddingLeft: 10,
                        paddingRight: 10,
                    },
                    labelStyle: {
                        display: 'flex',
                        fontSize: '11px',
                        lineHeight: '15px',
                        padding: 0,
                        ...fontColors.white,
                        ...fontWeights.bold,
                    },
                },
                root: {
                    height: 32,
                },
            },
        };
    }

    render() {
        const {
            label,
            ...other,
        } = this.props;
        return (
            <div is="root">
                <FlatButton {...other} is="FlatButton" label={label} />
            </div>
        );
    }
}

export default AutoCompleteToken;
