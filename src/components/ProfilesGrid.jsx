'use strict';

import React from 'react';

import ProfileTile from './ProfileTile';

// XXX look into addding the PureRenderMixin
class ProfilesGrid extends React.Component {

    static propTypes = {
        profiles: React.PropTypes.array.isRequired,
    }

    _renderProfiles() {
        return this.props.profiles.map((profile, index) => {
            return (
                <div key={index} className="col-xs-12 col-sm-6 col-md-4">
                    <ProfileTile profile={profile} />
                </div>
            );
        });
    }

    render() {
        return (
            <section className="row">
                {this._renderProfiles()}
            </section>
        );
    }

}

export default ProfilesGrid;
