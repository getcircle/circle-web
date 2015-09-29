import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { getExtendedProfile, updateProfile } from '../actions/profiles';
import { retrieveExtendedProfile } from '../reducers/denormalizations';
import * as selectors from '../selectors';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import ProfileDetail from '../components/ProfileDetail';
import PureComponent from '../components/PureComponent';

const profileSelector = selectors.createImmutableSelector(
    [selectors.cacheSelector, selectors.extendedProfilesSelector, selectors.routerParametersSelector],
    (cacheState, extendedProfilesState, paramsState) => {
        let extendedProfile;
        const profileId = paramsState.profileId;
        if (extendedProfilesState.get('ids').has(profileId)) {
            extendedProfile = retrieveExtendedProfile(profileId, cacheState.toJS());
        }

        // Profile ID is passed because extended profile might not have been fetched
        // ID is used to check whether this user is the logged in user or not
        return {
            extendedProfile,
            profileId,
        };
    }
);

const selector = selectors.createImmutableSelector(
    [profileSelector, selectors.authenticationSelector, selectors.responsiveSelector],
    (profileState, authenticationState, responsiveState) => {
        const profile = authenticationState.get('profile');
        let isLoggedInUser;
        if (profile && profile.id === profileState.profileId) {
            isLoggedInUser = true;
        } else {
            isLoggedInUser = false;
        }
        return {
            isLoggedInUser: isLoggedInUser,
            organization: authenticationState.get('organization'),
            largerDevice: responsiveState.get('largerDevice'),
            ...profileState
        }
    }
);

@connect(selector)
class Profile extends PureComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        extendedProfile: PropTypes.object,
        isLoggedInUser: PropTypes.bool.isRequired,
        largerDevice: PropTypes.bool.isRequired,
        organization: PropTypes.instanceOf(services.organization.containers.OrganizationV1),
        params: PropTypes.shape({
            profileId: PropTypes.string.isRequired,
        }).isRequired,
    }

    componentWillMount() {
        this.props.dispatch(getExtendedProfile(this.props.params.profileId));
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.params.profileId !== this.props.params.profileId) {
            this.props.dispatch(getExtendedProfile(nextProps.params.profileId));
        }
    }

    onUpdateProfile(profile) {
        this.props.dispatch(updateProfile(profile));
    }

    renderProfile() {
        const {
            extendedProfile,
            isLoggedInUser,
            largerDevice,
            organization,
        } = this.props;
        if (extendedProfile) {
            return (
                <ProfileDetail
                    extendedProfile={extendedProfile}
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
