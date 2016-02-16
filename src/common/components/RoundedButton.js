import { FlatButton } from 'material-ui';
import React, { PropTypes } from 'react';

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

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
    }

    classes() {
        const lunoTheme = this.context.muiTheme.luno;
        return {
            default: {
                labelStyle: {
                    color: lunoTheme.tintColor,
                    fontWeight: lunoTheme.fontWeights.black,
                    fontSize: lunoTheme.fontSizes.buttonText,
                    letterSpacing: '0.5pt',
                },
                buttonStyle: {
                    backgroundColor: 'transparent',
                    border: '1px solid #7A8EFF',
                    borderRadius: '22px',
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
