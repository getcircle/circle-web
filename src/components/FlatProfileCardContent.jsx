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

    _getAvatars() {
        return this.props.profiles.map((profile, index) => {
            return <Avatar key={index} src={profile.image_url} />;
        });
    }

    render() {
        return (
            <div>
                {this._getAvatars()}
            </div>
        );
    }
}

export default FlatProfileCardContent;
