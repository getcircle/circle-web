'use strict';

import React from 'react';

import bindThis from '../utils/bindThis';
import connectToStore from '../utils/connectToStore';
import InfiniteCardGrid from '../components/InfiniteCardGrid';
import ProfileTile from '../components/ProfileTile';
import ThemeManager from '../utils/ThemeManager';

// XXX look into addding the PureRenderMixin
@connectToStore
class Profiles extends React.Component {

    static store = 'ProfileStore';

    static propTypes = {
        flux: React.PropTypes.object.isRequired,
        profiles: React.PropTypes.array.isRequired,
        nextRequest: React.PropTypes.object,
        loading: React.PropTypes.bool.isRequired,
    }

    static childContextTypes = {
        muiTheme: React.PropTypes.object.isRequired,
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    @bindThis
    getMore(event) {
        this.props.flux.getStore('ProfileStore').getProfiles(this.props.nextRequest);
    }

    _renderProfiles(profiles) {
        return profiles.map((profile, index) => {
            return (
                <div key={profile.id} className="col-xs-12 col-sm-6 col-md-4">
                    <ProfileTile profile={profile} />
                </div>
            );
        });
    }

    render() {
        return (
            <InfiniteCardGrid
                objects={this.props.profiles}

                loading={this.props.loading}
                getMore={this.getMore}

                ComponentClass={ProfileTile}
                componentAttributeName='profile'
            />
        );
    }

}

export default Profiles;
