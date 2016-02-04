import React, { PropTypes } from 'react';

import { fontColors } from '../constants/styles';

import FormField from  './FormField';
import FormFieldError from './FormFieldError';

export default class FormTextArea extends FormField {

    static propTypes = {
        name: PropTypes.string.isRequired,
        onBlur: PropTypes.func,
        onChange: PropTypes.func,
        onFocus: PropTypes.func,
        placeholder: PropTypes.string,
        value: PropTypes.string,
    }

    classes() {
        return {
            default: {
                textarea: {
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '3px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    fontSize: 14,
                    height: '100px',
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
        const showError = this.showError();

        return (
            <div>
                <textarea
                    style={this.styles().textarea}
                    {...this.props}
                />
                 <FormFieldError error={this.showError() ? error : undefined} />
            </div>
        );
    }
}
