import { connect } from 'react-redux';
import React, { PropTypes } from 'react';

import { getExtendedProfile, updateProfile } from '../actions/profiles';
import { clearTeamMembers } from '../actions/teams';
import { resetScroll } from '../utils/window';
import { retrieveExtendedProfile } from '../reducers/denormalizations';
import * as selectors from '../selectors';
import connectData from '../utils/connectData';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import DocumentTitle from '../components/DocumentTitle';
import ProfileDetail from '../components/ProfileDetail';
import PureComponent from '../components/PureComponent';

const selector = selectors.createImmutableSelector(
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

        const authenticatedProfile = authenticationState.get('profile');
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
            isLoggedInUser,
        };
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
        dispatch: PropTypes.func.isRequired,
        extendedProfile: PropTypes.object,
        isLoggedInUser: PropTypes.bool.isRequired,
        params: PropTypes.shape({
            profileId: PropTypes.string.isRequired,
        }).isRequired,
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
            isLoggedInUser,
        } = this.props;
        if (extendedProfile) {
            return (
                <DocumentTitle title={extendedProfile.profile.full_name}>
                    <ProfileDetail
                        extendedProfile={extendedProfile}
                        isLoggedInUser={isLoggedInUser}
                        onUpdateProfile={::this.onUpdateProfile}
                    />
                </DocumentTitle>
            );
        } else {
            return (
                <DocumentTitle loading={true}>
                    <CenterLoadingIndicator />
                </DocumentTitle>
            );
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
