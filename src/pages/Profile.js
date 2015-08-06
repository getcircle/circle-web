import _ from 'lodash';
import connectToStores from 'alt/utils/connectToStores';
import React from 'react';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
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

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.params.profileId !== this.props.params.profileId) {
            this.props.flux.getStore('ProfileStore').fetchExtendedProfile(nextProps.params.profileId);
        }
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
            return <CenterLoadingIndicator />;
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
