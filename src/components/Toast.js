import * as messageTypes from '../constants/messageTypes';
import React, { PropTypes } from 'react/addons';

import CSSComponent from './CSSComponent';

class Toast extends CSSComponent {

    static propTypes = {
        className: PropTypes.string,
        message: PropTypes.string.isRequired,
        messageType: PropTypes.string,
    }

    classes() {
        return {
            default: {
                messageContainer: {
                    padding: '10px',
                },
                messageText: {
                    color: '#FFFFFF',
                    fontSize: 12,
                }
            },
            info: {
                messageContainer: {
                    backgroundColor: '#58C4EE',
                },
            },
            warning: {
                messageContainer: {
                    backgroundColor: '#FDAF4D',
                },
            },
            error: {
                messageContainer: {
                    backgroundColor: '#C33604',
                },
            },
        };
    }

    styles() {
        return this.css({
            info: this.props.messageType === messageTypes.INFO,
            warning: this.props.messageType === messageTypes.WARNING,
            error: this.props.messageType === messageTypes.ERROR,
        });
    }

    render() {
        const {
            className,
            message,
        } = this.props;

        let classes = 'row center-xs';
        if (className) {
            classes += ' ' + className;
        }

        return (
            <div className={classes.trim()} is="messageContainer">
                <span is="messageText">
                    {message}
                </span>
            </div>
        );
    }
}

export default Toast;
