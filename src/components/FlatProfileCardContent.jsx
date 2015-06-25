'use strict';

import mui from 'material-ui';
import React from 'react';

const {Avatar} = mui;

class FlatProfileCardContent extends React.Component {

    static propTypes = {
        profiles: React.PropTypes.array.isRequired,
    }

    static contextTypes = {
        muiTheme: React.PropTypes.object.isRequired,
    }

    _getAvatars(styles) {
        return this.props.profiles.map((profile, index) => {
            return <Avatar style={styles.avatar} key={index} src={profile.image_url} />;
        });
    }

    _getStyles() {
        return {
            container: {
                padding: '15px',
            },
            avatar: {},
        };
    }

    render() {
        const styles = this._getStyles();
        return (
            <div style={styles.container}>
                {this._getAvatars(styles)}
            </div>
        );
    }
}

export default FlatProfileCardContent;
