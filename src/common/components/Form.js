import { LinearProgress } from 'material-ui';
import React, { PropTypes } from 'react';

import * as messageTypes from '../constants/messageTypes';

import CSSComponent from  './CSSComponent';
import Toast from './Toast';

const Progress = ({submitting}) => {
    if (submitting) {
        return (
            <LinearProgress mode="indeterminate" />
        );
    } else {
        return <span />;
    }
};

const Message = ({error, warning}) => {
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
    } else {
        return <span />;
    }
};

export default class Form extends CSSComponent {
    static propTypes = {
        children: PropTypes.node,
        error: PropTypes.string,
        onSubmit: PropTypes.func,
        submitting: PropTypes.bool,
        warning: PropTypes.string,
    };

    classes() {
        return {
            default: {
                form: {
                    padding: '10px 40px 40px 40px',
                },
            },
        };
    }

    render() {
        const { children, onSubmit, ...other } = this.props;

        return (
            <div>
                <Progress {...other} />
                <Message {...other} />
                <form
                    onSubmit={onSubmit}
                    style={this.styles().form}
                    {...other}
                >
                    {children}
                </form>
            </div>
        );
    }
}
