import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { getExtendedProfile, retrieveExtendedProfile, updateProfile } from '../actions/profiles';
import * as selectors from '../selectors';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import ProfileDetail from '../components/ProfileDetail';
import PureComponent from '../components/PureComponent';

const selector = createSelector(
    [
        selectors.cacheSelector,
        selectors.extendedProfilesSelector,
        selectors.routerSelector,
        selectors.authenticationSelector,
    ],
    (cacheState, extendedProfilesState, routerState, authenticationState) => {
        let extendedProfile;
        const profileId = routerState.params.profileId;
        if (extendedProfilesState.get('ids').has(profileId)) {
            extendedProfile = retrieveExtendedProfile(profileId, cacheState.toJS());
        }
        return {
            extendedProfile: extendedProfile,
            isLoggedInUser: authenticationState.get('profile').id === profileId,
            organization: authenticationState.get('organization'),
        }
    }
);

@connect(selector)
class Profile extends PureComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        extendedProfile: PropTypes.object,
        isLoggedInUser: PropTypes.bool.isRequired,
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
        this.props.dispatch(updateProfile(profile))
    }

    renderProfile() {
        const {
            extendedProfile,
            isLoggedInUser,
            organization,
        } = this.props;
        if (extendedProfile) {
            return (
                <ProfileDetail
                    extendedProfile={extendedProfile}
                    isLoggedInUser={isLoggedInUser}
                    onUpdateProfileCallback={this.onUpdateProfile.bind(this)}
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
