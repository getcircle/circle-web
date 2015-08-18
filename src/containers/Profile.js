'use strict';

import _ from 'lodash';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React from 'react';

import { loadExtendedProfile } from '../actions/profiles';
import ThemeManager from '../utils/ThemeManager';
import * as selectors from '../selectors';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import ExtendedProfile from '../components/ExtendedProfile';

const selector = createSelector(
    [selectors.extendedProfilesSelector, selectors.routerSelector, selectors.authenticationSelector],
    (extendedProfilesState, routerState, authenticationState) => {
        return {
            extendedProfile: extendedProfilesState.getIn(['objects', routerState.params.profileId]),
            organization: authenticationState.get('organization'),
        }
    }
);

@connect(selector)
class Profile extends React.Component {

    static propTypes = {
        extendedProfile: React.PropTypes.object,
    }

    static childContextTypes = {
        muiTheme: React.PropTypes.object,
    }

    componentWillMount() {
        this.props.dispatch(loadExtendedProfile(this.props.params.profileId));
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.params.profileId !== this.props.params.profileId) {
            this.props.dispatch(loadExtendedProfile(nextProps.params.profileId));
        }
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    _renderProfile() {
        const {
            extendedProfile,
            organization,
        } = this.props;
        if (extendedProfile) {
            return <ExtendedProfile extendedProfile={extendedProfile} organization={organization}/>;
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
