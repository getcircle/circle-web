import React from 'react';
import { services } from 'protobufs';

import moment from '../utils/moment';

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
        textTransform: 'uppercase',
    },
}

class ExtendedProfileStatus extends StyleableComponent {

    static propTypes = {
        status: React.PropTypes.instanceOf(services.profile.containers.ProfileStatusV1).isRequired,
    }

    render() {
        const {
            status,
            style,
            ...other
        } = this.props;
        const created = moment(status.created);
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
                        {created.format("D")}
                    </span>
                    <span style={this.mergeAndPrefix(
                        styles.text,
                        styles.date2,
                    )}>
                        {created.format("MMM")}
                    </span>
                </div>
                <div style={this.mergeAndPrefix(styles.statusContainer)}>
                    <span style={this.mergeAndPrefix(styles.statusText)}>{status.value}</span>
                </div>
            </Card>
        );
    }
}

export default ExtendedProfileStatus;
