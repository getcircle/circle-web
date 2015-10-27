import { FlatButton } from 'material-ui';
import React, { PropTypes } from 'react';

import CSSComponent from './CSSComponent';

class RoundedButton extends CSSComponent {

    static propTypes = {
        labelStyle: PropTypes.object,
        style: PropTypes.object,
    }

    classes() {
        return {
            default: {
                labelStyle: {
                    color: '#7A8EFF',
                    fontSize: 16,
                    textTransform: 'none',
                },
                buttonStyle: {
                    backgroundColor: 'transparent',
                    borderRadius: '20px',
                    border: '1px solid #7A8EFF',
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
