import { LinearProgress } from 'material-ui';
import React, { PropTypes } from 'react';

import * as messageTypes from '../constants/messageTypes';

import CSSComponent from  './CSSComponent';
import Toast from './Toast';

export default class Form extends CSSComponent {
    static propTypes = {
        children: PropTypes.node,
        error: PropTypes.string,
        onSubmit: PropTypes.func.isRequired,
        style: PropTypes.object,
        warning: PropTypes.string,
    };

    classes() {
        return {
            default: {
                form: {
                    padding: '0 16px 16px 16px',
                },
            },
        };
    }

    renderProgressIndicator() {
        if (this.props.submitting) {
            return (
                <LinearProgress mode="indeterminate" />
            );
        }
    }

    renderToast() {
        const { error, warning } = this.props;

        if (error) {
            return (
                <Toast
                    message={error}
                    messageType={messageTypes.ERROR}
                />
            );
        } else if (warning) {
            return (
                <Toast
                    message={warning}
                    messageType={messageTypes.WARNING}
                />
            );
        }
    }

    render() {
        const { children, onSubmit } = this.props;

        return (
            <div>
                {this.renderProgressIndicator()}
                {this.renderToast()}
                <form
                    onSubmit={onSubmit}
                    style={this.styles().form}
                >
                    {children}
                </form>
            </div>
        );
    }
}
