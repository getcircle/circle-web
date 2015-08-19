import mui from 'material-ui';
import React from 'react';

import StyleableComponent from './StyleableComponent';

const { FlatButton } = mui;

const styles = {
    footerButton: {
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-end',
        marginRight: 20,
    },
    footerButtonLabel: {
        color: '#8598FF',
        fontSize: 16,
        fontWeight: 600,
    },
    root: {
        borderTop: '1px solid rgba(0, 0, 0, .1)',
        height: 70,
        paddingTop: 15,
        paddingBottom: 15,
        display: 'flex',
    },
};

class CardFooter extends StyleableComponent {

    static propTypes = {
        actionText: React.PropTypes.string,
        onClick: React.PropTypes.func,
    }

    render() {
        const {
            actionText,
            onClick,
        } = this.props;
        return (
            <footer {...this.props} className="row" style={this.mergeAndPrefix(styles.root)}>
                {this.props.children}
                <div style={this.mergeAndPrefix(styles.footerButton)}>
                    <FlatButton labelStyle={styles.footerButtonLabel} label={actionText} onTouchTap={onClick} />
                </div>
            </footer>
        );
    }

}

export default CardFooter;
