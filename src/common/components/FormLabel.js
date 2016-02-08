import React, { PropTypes } from 'react';

import { fontColors, fontWeights } from '../constants/styles';

import CSSComponent from  './CSSComponent';

export default class FormLabel extends CSSComponent {

    static propTypes = {
        text: PropTypes.string.isRequired,
    }

    classes() {
        return {
            default: {
                label: {
                    display: 'block',
                    fontSize: 11,
                    letterSpacing: '1px',
                    lineHeight: '11px',
                    margin: '16px 0',
                    textAlign: 'left',
                    textTransform: 'uppercase',
                    ...fontColors.light,
                    ...fontWeights.semiBold,
                },
            },
        };
    }

    render() {
        return (
            <label style={this.styles().label}>
                {this.props.text}
            </label>
        );
    }
}
