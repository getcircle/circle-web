'use strict';

import _ from 'lodash';
import connectToStores from 'alt/utils/connectToStores';
import React from 'react';

import ExtendedProfile from '../components/ExtendedProfile';
import ThemeManager from '../utils/ThemeManager';

@connectToStores
class Profile extends React.Component {

    static propTypes = {
        flux: React.PropTypes.object.isRequired,
        extendedProfile: React.PropTypes.object,
    }

    static childContextTypes = {
        muiTheme: React.PropTypes.object,
    }

    static getStores(props) {
        return [props.flux.getStore('ProfileStore')];
    }

    static getPropsFromStores(props) {
        const profileProps = {
            extendedProfile: props.flux.getStore('ProfileStore').getExtendedProfile(props.params.profileId),
        };

        return _.assign(
            {},
            profileProps,
        );
    }

    componentWillMount() {
        this.props.flux.getStore('ProfileStore').fetchExtendedProfile(this.props.params.profileId);
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    _renderProfile() {
        const extendedProfile = this.props.extendedProfile;
        if (extendedProfile) {
            return <ExtendedProfile extendedProfile={extendedProfile} />;
        } else {
            return (
                <div>
                    <span>Loading...</span>
                </div>
            );
        }
    }

    render() {
        return (
            <section>
                {this._renderProfile()}
            </section>
        );
    }

}

export default Profile;
