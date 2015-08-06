'use strict';

import mui from 'material-ui';
import React from 'react';

import CardHeader from './CardHeader';

const {Paper} = mui;

class Card extends React.Component {

    static propTypes = {
        title: React.PropTypes.string,
        count: React.PropTypes.number,
    }

    static contextTypes = {
        muiTheme: React.PropTypes.object.isRequired,
    }

    getStyles() {
        return {
            'paper': {
                marginTop: 10,
            },
        };
    }

    render() {
        const styles = this.getStyles();
        return (
            <Paper style={styles.paper}>
                <CardHeader title={this.props.title} count={this.props.count} />
                {this.props.children}
            </Paper>
        );
    }
}

export default Card;
