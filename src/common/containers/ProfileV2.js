import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { provideHooks } from 'redial';
import { services } from 'protobufs';

import { getProfile } from '../actions/profiles';
import { resetScroll } from '../utils/window';
import { retrieveProfile } from '../reducers/denormalizations';
import * as selectors from '../selectors';

import Container from '../components/Container';
import CSSComponent from '../components/CSSComponent';
import ProfileDetail from '../components/ProfileDetailV2';

const selector = selectors.createImmutableSelector(
    [
        selectors.cacheSelector,
        selectors.routerParametersSelector,
    ],
    (cacheState, parametersState) => {
        const { profileId } = parametersState;
        const cache = cacheState.toJS();
        const profile = retrieveProfile(profileId, cache);
        return {
            profile,
        };
    },
);

const hooks = {
    fetch: (locals) => {
        return Promise.all([
            fetchProfile(locals),
        ]);
    },
};

function fetchProfile({ dispatch, params: { profileId }}) {
    return dispatch(getProfile(profileId));
}

function loadProfile(locals) {
    fetchProfile(locals);
    // fetch manager
    // fetch peers
    // fetch direct reports
    // fetch teams
    // fetch knowledge
}

class Profile extends CSSComponent {

    static propTypes = {
        params: PropTypes.shape({
            slug: PropTypes.string,
            profileId: PropTypes.string.isRequired,
        }),
        profile: PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.params.profileId !== this.props.params.profileId) {
            resetScroll();
            loadProfile(nextProps);
        }
    }

    render() {
        const { profile } = this.props;
        const title = profile ? profile.full_name : null;
        return (
            <Container title={title}>
                <ProfileDetail {...this.props} />
            </Container>
        );
    }
}

export { Profile };
export default provideHooks(hooks)(connect(selector)(Profile));
