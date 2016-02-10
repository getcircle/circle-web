import React, { PropTypes } from 'react';

import { fontColors } from '../constants/styles';

import FormField from  './FormField';
import FormFieldError from './FormFieldError';

export default class FormTextField extends FormField {

    static propTypes = {
        name: PropTypes.string,
        onBlur: PropTypes.func,
        onChange: PropTypes.func.isRequired,
        onFocus: PropTypes.func,
        placeholder: PropTypes.string,
        value: PropTypes.string,
    }

    classes() {
        return {
            default: {
                input: {
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '3px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    fontSize: 14,
                    height: '36px',
                    lineHeight: '14px',
                    outline: 'none',
                    padding: '10px',
                    width: '100%',
                    ...fontColors.dark,
                },
            },
            'showError': {
                input: {
                    border: '1px solid rgba(200, 0, 0, 0.8)',
                },
            },
        };
    }

    render() {
        const { error } = this.props;

        return (
            <div>
                <input
                    style={this.styles().input}
                    type="text"
                    {...this.props}
                />
                <FormFieldError error={this.showError() ? error : undefined} />
            </div>
        );
    }
}
