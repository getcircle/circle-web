import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React, { PropTypes } from 'react';

import { loadExtendedProfile } from '../actions/profiles';
import * as selectors from '../selectors';

import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import Container from '../components/Container';
import ExtendedProfile from '../components/ExtendedProfile';
import PureComponent from '../components/PureComponent';

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
class Profile extends PureComponent {

    static propTypes = {
        extendedProfile: React.PropTypes.object,
    }

    static contextTypes = {
        muiTheme: React.PropTypes.object.isRequired,
    }

    componentWillMount() {
        this.props.dispatch(loadExtendedProfile(this.props.params.profileId));
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.params.profileId !== this.props.params.profileId) {
            this.props.dispatch(loadExtendedProfile(nextProps.params.profileId));
        }
    }

    _renderProfile() {
        const {
            extendedProfile,
            organization,
        } = this.props;
        if (extendedProfile) {
            return (
                <ExtendedProfile
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
