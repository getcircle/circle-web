import React from 'react';

import Card from './Card';
import StyleableComponent from './StyleableComponent';

const styles = {
    card: {
        padding: 20,
    },
    contentStyle: {
        display: 'flex',
        flexDirection: 'row',
    },
    dateBox: {
        borderRadius: 2,
        border: '1px solid rgba(0, 0, 0, 0.1)',
        height: 72,
        width: 72,
        marginRight: 20,
    },
    date1: {
        display: 'block',
        fontSize: 24,
        paddingTop: 15,
        lineHeight: '29px',
        letterSpacing: '1px',
        fontWeight: 300,
    },
    date2: {
        display: 'block',
        fontSize: 10,
        lineHeight: '12px',
        letterSpacing: '2px',
    },
    statusContainer: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    statusText: {
        fontSize: 21,
        color: 'rgba(0, 0, 0, 0.7)',
        lineHeight: '29px',
    },
    text: {
        color: 'rgba(0, 0, 0, 0.4)',
        textAlign: 'center',
    },
}

class ExtendedProfileStatus extends StyleableComponent {

    render() {
        const {
            style,
            ...other
        } = this.props;
        return (
            <Card
                {...other}
                style={this.mergeAndPrefix(styles.card, style)}
                contentStyle={styles.contentStyle}
            >
                <div style={styles.dateBox}>
                    <span style={this.mergeAndPrefix(
                        styles.text,
                        styles.date1,
                    )}>
                        28
                    </span>
                    <span style={this.mergeAndPrefix(
                        styles.text,
                        styles.date2,
                    )}>
                        MAR
                    </span>
                </div>
                <div style={this.mergeAndPrefix(styles.statusContainer)}>
                    <span style={this.mergeAndPrefix(styles.statusText)}>“I’m currently working on refinements to search, detail pages, and asset creation.”</span>
                </div>
            </Card>
        );
    }
}

export default ExtendedProfileStatus;
