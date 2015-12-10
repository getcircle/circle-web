import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { getAuthenticatedProfile } from '../reducers/authentication';
import { getExtendedProfile, updateProfile } from '../actions/profiles';
import { clearTeamMembers } from '../actions/teams';
import { resetScroll } from '../utils/window';
import { retrieveExtendedProfile } from '../reducers/denormalizations';
import * as selectors from '../selectors';
import connectData from '../utils/connectData';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import ProfileDetail from '../components/ProfileDetail';
import PureComponent from '../components/PureComponent';

const profileSelector = selectors.createImmutableSelector(
    [
        selectors.cacheSelector,
        selectors.extendedProfilesSelector,
        selectors.routerParametersSelector,
        selectors.authenticationSelector,
    ],
    (cacheState, extendedProfilesState, paramsState, authenticationState) => {
        let extendedProfile;
        const profileId = paramsState.profileId;
        const cache = cacheState.toJS();
        if (extendedProfilesState.get('ids').has(profileId)) {
            extendedProfile = retrieveExtendedProfile(profileId, cache);
        }

        const authenticatedProfile = getAuthenticatedProfile(authenticationState, cache);
        let isLoggedInUser;
        if (authenticatedProfile && authenticatedProfile.id === profileId) {
            isLoggedInUser = true;
        } else {
            isLoggedInUser = false;
        }

        // Profile ID is passed because extended profile might not have been fetched
        // ID is used to check whether this user is the logged in user or not
        return {
            extendedProfile,
            profileId,
            authenticatedProfile,
            isLoggedInUser,
            // TODO with react 0.14 we should be able to pull authenticated
            // profile from the context
            isAdminUser: authenticatedProfile.is_admin,
            organization: authenticationState.get('organization'),
        };
    }
);

const selector = selectors.createImmutableSelector(
    [profileSelector, selectors.responsiveSelector],
    (profileState, responsiveState) => {
        return {
            largerDevice: responsiveState.get('largerDevice'),
            mobileOS: responsiveState.get('mobileOS'),
            ...profileState
        }
    }
);

function fetchProfile(dispatch, params) {
    return dispatch(getExtendedProfile(params.profileId));
}

function fetchData(getState, dispatch, location, params) {
    return Promise.all([
        fetchProfile(dispatch, params),
    ]);
}

@connectData(fetchData)
@connect(selector)
class Profile extends PureComponent {

    static propTypes = {
        authenticatedProfile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
        dispatch: PropTypes.func.isRequired,
        extendedProfile: PropTypes.object,
        isLoggedInUser: PropTypes.bool.isRequired,
        largerDevice: PropTypes.bool.isRequired,
        mobileOS: PropTypes.bool.isRequired,
        organization: PropTypes.instanceOf(services.organization.containers.OrganizationV1),
        params: PropTypes.shape({
            profileId: PropTypes.string.isRequired,
        }).isRequired,
    }

    static childContextTypes = {
        authenticatedProfile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
        mobileOS: PropTypes.bool.isRequired,
    }

    getChildContext() {
        return {
            authenticatedProfile: this.props.authenticatedProfile,
            mobileOS: this.props.mobileOS,
        };
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.params.profileId !== this.props.params.profileId) {
            fetchProfile(this.props.dispatch, this.props.params);
            resetScroll();
        }
        else if (this.props.extendedProfile && nextProps.extendedProfile) {
            if (this.props.extendedProfile.team &&
                nextProps.extendedProfile.team &&
                nextProps.extendedProfile.team.id !== this.props.extendedProfile.team.id) {
                // When user switches teams, clear cached team members for old & new team
                nextProps.dispatch(clearTeamMembers(this.props.extendedProfile.team.id));
                nextProps.dispatch(clearTeamMembers(nextProps.extendedProfile.team.id));
            }
        }
    }

    onUpdateProfile(profile, manager) {
        if (manager !== this.props.extendedProfile.manager) {
            this.props.dispatch(updateProfile(profile, manager));
        } else {
            this.props.dispatch(updateProfile(profile));
        }
    }

    renderProfile() {
        const {
            extendedProfile,
            isAdminUser,
            isLoggedInUser,
            largerDevice,
            organization,
        } = this.props;
        if (extendedProfile) {
            return (
                <ProfileDetail
                    extendedProfile={extendedProfile}
                    isAdminUser={isAdminUser}
                    isLoggedInUser={isLoggedInUser}
                    largerDevice={largerDevice}
                    onUpdateProfile={::this.onUpdateProfile}
                    organization={organization}
                />
            );
        } else {
            return <CenterLoadingIndicator />;
        }
    }

    render() {
        return (
            <Container>
                {this.renderProfile()}
            </Container>
        );
    }

}

export default Profile;
