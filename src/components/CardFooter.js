import { FlatButton } from 'material-ui';
import React, { PropTypes } from 'react';

import { tintColor, fontWeights } from '../constants/styles';

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
            <footer {...other} className="row middle-xs" is="root">
                <div is="buttonContainer">
                    <FlatButton
                        is="button"
                        label={actionText}
                        labelStyle={this.styles().footerButtonLabel}
                        onTouchTap={onClick}
                    />
                </div>
                {children}
            </footer>
        );
    }

}

export default CardFooter;
