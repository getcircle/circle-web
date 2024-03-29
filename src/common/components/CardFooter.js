import { FlatButton } from 'material-ui';
import React, { PropTypes } from 'react';

import { tintColor } from '../constants/styles';

import CSSComponent from './CSSComponent';

class CardFooter extends CSSComponent {

    static propTypes = {
        actionText: PropTypes.string,
        children: PropTypes.node,
        onClick: PropTypes.func,
    }

    classes() {
        return {
            default: {
                button: {
                    background: 'white',
                    textAlign: 'left',
                    textTransform: 'none',
                    width: '100%',
                },
                buttonContainer: {
                    flex: 1,
                    display: 'flex',
                },
                footerButtonLabel: {
                    color: tintColor,
                    fontSize: 14,
                },
                root: {
                    backgroundColor: 'white',
                    borderTop: '1px solid rgba(0, 0, 0, .1)',
                    boxShadow: '1px 1px 2px 0 rgba(0, 0, 0, 0.1)',
                    height: 60,
                    display: 'flex',
                    width: '100%',
                },
            },
        };
    }

    render() {
        const {
            actionText,
            children,
            onClick,
            ...other,
        } = this.props;
        return (
            <footer {...other} className="row middle-xs" style={this.styles().root}>
                <div style={this.styles().buttonContainer}>
                    <FlatButton
                        label={actionText}
                        labelStyle={this.styles().footerButtonLabel}
                        onTouchTap={onClick}
                        style={this.styles().button}
                    />
                </div>
                {children}
            </footer>
        );
    }

}

export default CardFooter;
