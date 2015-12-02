import { FlatButton } from 'material-ui';
import React, { PropTypes } from 'react';

import { fontWeights } from '../constants/styles.js';

import CSSComponent from './CSSComponent';

class RoundedButton extends CSSComponent {

    static propTypes = {
        disabled: PropTypes.bool,
        labelStyle: PropTypes.object,
        style: PropTypes.object,
    }

    static defaultProps = {
        disabled: false,
    }

    classes() {
        return {
            default: {
                labelStyle: {
                    color: '#7A8EFF',
                    fontSize: 12,
                    letterSpacing: '1px',
                    ...fontWeights.semiBold,
                },
                buttonStyle: {
                    backgroundColor: 'transparent',
                    border: '1px solid #7A8EFF',
                },
            },
            'disabled-true': {
                labelStyle: {
                    color: '#bfbfbf',
                },
                buttonStyle: {
                    border: '1px solid #bfbfbf',
                },
            },
        };
    }

    render() {
        const {
            labelStyle,
            style,
            ...other,
        } = this.props;

        return (
            <FlatButton
                {...other}
                labelStyle={{...this.styles().labelStyle, ...labelStyle}}
                style={{...this.styles().buttonStyle, ...style}}
            />
        );
    }
}

export default RoundedButton;
