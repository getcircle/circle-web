import { LinearProgress } from 'material-ui';
import React, { PropTypes } from 'react';

import * as messageTypes from '../constants/messageTypes';

import CSSComponent from  './CSSComponent';
import Toast from './Toast';

export default class Form extends CSSComponent {
    static propTypes = {
        children: PropTypes.node,
        onSubmit: PropTypes.func.isRequired,
        style: PropTypes.object,
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
        const { error } = this.props;

        if (error) {
            return (
                <Toast
                    message={error}
                    messageType={messageTypes.ERROR}
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
