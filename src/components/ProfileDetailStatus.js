import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import moment from '../utils/moment';

import Card from './Card';
import StyleableComponent from './StyleableComponent';

const styles = {
    contentStyle: {
        display: 'flex',
        flexDirection: 'row',
        padding: 20,
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

class ProfileDetailStatus extends StyleableComponent {

    static propTypes = {
        status: PropTypes.instanceOf(services.profile.containers.ProfileStatusV1).isRequired,
    }

    _renderStatusText(status) {
        if (status && status.value) {
            return status.value;
        } else {
            return "Ask me!";
        }
    }

    render() {
        const {
            status,
            style,
            ...other
        } = this.props;
        let created = status ? moment(status.created) : moment();
        return (
            <Card
                {...other}
                style={this.mergeAndPrefix(style)}
                contentStyle={styles.contentStyle}
                title="Currently Working On"
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
                    <span style={this.mergeAndPrefix(styles.statusText)}>{this._renderStatusText(status)}</span>
                </div>
            </Card>
        );
    }
}

export default ProfileDetailStatus;