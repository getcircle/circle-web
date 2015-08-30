import { FlatButton } from 'material-ui';
import React, { PropTypes } from 'react';

import { tintColor, fontWeights } from '../constants/styles';

import CSSComponent from './CSSComponent';

class CardFooter extends CSSComponent {

    static propTypes = {
        actionText: PropTypes.string,
        children: PropTypes.arrayOf(PropTypes.element),
        onClick: PropTypes.func,
    }

    classes() {
        return {
            default: {
                button: {
                    width: '100%',
                },
                buttonContainer: {
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                },
                footerButtonLabel: {
                    color: tintColor,
                    fontSize: 16,
                    ...fontWeights.semiBold,
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
            onClick,
        } = this.props;
        return (
            <footer {...this.props} className="row" is="root">
                <div is="buttonContainer">
                    <FlatButton
                        is="button"
                        label={actionText}
                        labelStyle={this.styles().footerButtonLabel}
                        onTouchTap={onClick}
                    />
                </div>
            </footer>
        );
    }

}

export default CardFooter;
