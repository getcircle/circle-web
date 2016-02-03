import React, { PropTypes } from 'react';

import { fontColors } from '../constants/styles';

import CSSComponent from  './CSSComponent';

export default class FormFieldError extends CSSComponent {

    static propTypes = {
        error: PropTypes.string.isRequired,
    }

    classes() {
        return {
            default: {
                error: {
                    fontSize: 13,
                    lineHeight: '1em',
                    padding: '10px 0',
                    textAlign: 'left',
                    ...fontColors.red,
                }
            },
        };
    }

    render() {
        const { error } = this.props;

        if (error) {
            return (
                <div style={this.styles().error}>{error}</div>
            );
        } else {
            return <span />;
        }
    }
}
