import React, { PropTypes } from 'react';

import StyleableComponent from './StyleableComponent';

const styles = {
    contentContainer: {
        display: 'flex',
        flexFlow: 'row',
    },
    header: {
        borderBottom: '1px solid rgba(0, 0, 0, .1)',
        height: 40,
        display: 'flex',
    },
    headerText: {
        fontSize: '14px',
        fontWeight: 600,
        color: 'rgba(0, 0, 0, .4)',
        alignSelf: 'center',
        paddingLeft: 12,
        textTransform: 'uppercase',
    },
    root: {
        boxShadow: '1px 1px 3px -2px',
        backgroundColor: 'white',
        borderRadius: 3,
    },
};

class Card extends StyleableComponent {

    static propTypes = {
        title: PropTypes.string,
        contentStyle: PropTypes.object,
    }

    _renderHeader() {
        const { title } = this.props;
        if (title) {
            return (
                <header style={this.mergeAndPrefix(styles.header)}>
                    <span style={this.mergeAndPrefix(styles.headerText)}>
                        {title}
                    </span>
                </header>
            );
        }
    }

    render() {
        const {
            contentStyle,
            style,
            ...other,
        } = this.props;
        return (
            <div style={this.mergeAndPrefix(styles.root, style)} {...other}>
                {this._renderHeader()}
                <div style={this.mergeAndPrefix(contentStyle)}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Card;
