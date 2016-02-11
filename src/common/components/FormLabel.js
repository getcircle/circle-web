import React, { PropTypes } from 'react';

import { fontColors } from '../constants/styles';
import t from '../utils/gettext';

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
                    marginTop: 20,
                    marginBottom: 5,
                    textAlign: 'left',
                    ...fontColors.light,
                },
                mainText: {
                    textTransform: 'uppercase',
                },
            },
        };
    }

    render() {
        const { optional, text } = this.props;
        const optionalText = optional ? t('(optional)') : '';

        return (
            <label style={this.styles().label}>
                <span style={this.styles().mainText}>{text}</span>
                <span> {optionalText}</span>
            </label>
        );
    }
}
