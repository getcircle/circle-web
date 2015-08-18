import { decorate } from 'react-mixin';
import mui from 'material-ui';
import React, { Component } from 'react';

import autoBind from '../utils/autoBind';

const { FlatButton } = mui;
const { StylePropable } = mui.Mixins;

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

@decorate(StylePropable)
@decorate(autoBind(StylePropable))
class CardFooter extends Component {

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
            <footer {...this.props} style={this.mergeAndPrefix(styles.root)}>
                {this.props.children}
                <div style={this.mergeAndPrefix(styles.footerButton)}>
                    <FlatButton labelStyle={styles.footerButtonLabel} label={actionText} />
                </div>
            </footer>
        );
    }

}

export default CardFooter;
