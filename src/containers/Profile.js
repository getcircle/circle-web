import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { getExtendedProfile, retrieveExtendedProfile } from '../actions/profiles';
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
        return {extendedProfile: extendedProfile};
    }
);

const selector = selectors.createImmutableSelector(
    [profileSelector, selectors.authenticationSelector],
    (profileState, authenticationState) => {
        return {
            organization: authenticationState.get('organization'),
            ...profileState
        }
    }
);

@connect(selector)
class Profile extends PureComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        extendedProfile: PropTypes.object,
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

    _renderProfile() {
        const {
            extendedProfile,
            organization,
        } = this.props;
        if (extendedProfile) {
            return (
                <ProfileDetail
                    extendedProfile={extendedProfile}
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
                {this._renderProfile()}
            </Container>
        );
    }

}

export default Profile;
