'use strict';

import mui from 'material-ui';
import React from 'react';

const {Avatar} = mui;

class ProfileSearchResult extends React.Component {

    static propTypes = {
        profile: React.PropTypes.object.isRequired,
    }

    styles = {
        detailsContainer: {
            textAlign: 'left',
        },
        details: {
            display: 'block',
        },
    }

    render() {
        const profile = this.props.profile;
        return (
            <div className="row">
                <div className="col-xs-1">
                    <Avatar src={profile.image_url} />
                </div>
                <div className="col-xs" style={this.styles.detailsContainer}>
                    <span style={this.styles.details}>{profile.full_name}</span>
                    <span style={this.styles.details}>{profile.title}</span>
                </div>
            </div>
        );
    }

}

export default ProfileSearchResult;
