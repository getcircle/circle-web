import React from 'react';

import Card from './Card';

const statusStyles = {
    card: {
        display: 'flex',
        flexFlow: 'row',
        justifyContent: 'center',
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

class ExtendedProfileStatus extends React.Component {

    render() {
        return (
            <Card style={statusStyles.card}>
                <div style={statusStyles.dateBox}>
                    <span style={Object.assign(
                        {},
                        statusStyles.text,
                        statusStyles.date1,
                    )}>
                        28
                    </span>
                    <span style={Object.assign(
                        {},
                        statusStyles.text,
                        statusStyles.date2,
                    )}>
                        MAR
                    </span>
                </div>
                <div style={statusStyles.statusContainer}>
                    <span style={statusStyles.statusText}>“I’m currently working on refinements to search, detail pages, and asset creation.”</span>
                </div>
            </Card>
        );
    }
}

export default ExtendedProfileStatus;
