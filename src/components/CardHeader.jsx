'use strict';

import React from 'react';

class CardHeader extends React.Component {

    static propTypes = {
        // TODO would add icon
        title: React.PropTypes.string,
        count: React.PropTypes.number,
    }

    getStyles() {
        return {
            section: {
                display: 'flex',
            },
            title: {
                flex: 1,
            },
            'count': {
                flex: 1,
                textAlign: 'right',
            },
        };
    }

    render() {
        const styles = this.getStyles();
        return (
            <header style={styles.section}>
                <h2 style={styles.title}>{this.props.title}</h2>
                <p styles={styles.count}>{this.props.count}</p>
            </header>
        );
    }
}

export default CardHeader;
