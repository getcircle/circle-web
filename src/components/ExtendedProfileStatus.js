import { decorate } from 'react-mixin';
import mui from 'material-ui';
import React, { Component } from 'react';

import autoBind from '../utils/autoBind';

import Card from './Card';

const { StylePropable } = mui.Mixins;

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

@decorate(StylePropable)
@decorate(autoBind(StylePropable))
class ExtendedProfileStatus extends Component {

    render() {
        return (
            <Card style={this.mergeAndPrefix(statusStyles.card)}>
                <div style={statusStyles.dateBox}>
                    <span style={this.mergeAndPrefix(
                        statusStyles.text,
                        statusStyles.date1,
                    )}>
                        28
                    </span>
                    <span style={this.mergeAndPrefix(
                        statusStyles.text,
                        statusStyles.date2,
                    )}>
                        MAR
                    </span>
                </div>
                <div style={this.mergeAndPrefix(statusStyles.statusContainer)}>
                    <span style={this.mergeAndPrefix(statusStyles.statusText)}>“I’m currently working on refinements to search, detail pages, and asset creation.”</span>
                </div>
            </Card>
        );
    }
}

export default ExtendedProfileStatus;
