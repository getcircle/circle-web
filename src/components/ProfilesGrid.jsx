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
                <div key={index} className="row">
                    <div className="col-xs-offset-2 col-xs-8">
                        <ProfileTile profile={profile} />
                    </div>
                </div>
            );
        });
    }

    render() {
        return (
            <section>
                {this._renderProfiles()}
            </section>
        );
    }

}

export default ProfilesGrid;
