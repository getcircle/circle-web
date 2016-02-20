import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import * as selectors from '../selectors';
import { provideHooks } from 'redial';

import { retrieveProfiles } from '../reducers/denormalizations';
import { exploreProfiles } from '../actions/explore';
import t from '../utils/gettext';

import Container from '../components/Container';
import { default as ExplorePeopleComponent } from '../components/ExplorePeople';

const selector = selectors.createImmutableSelector(
    [
        selectors.cacheSelector,
        selectors.exploreProfilesSelector,
    ],
    (cacheState, exploreProfilesState) => {
        let loading, profiles, profilesCount, nextRequest;
        if (exploreProfilesState) {
            if (exploreProfilesState.get('ids').size) {
                const ids = exploreProfilesState.get('ids');
                profiles = retrieveProfiles(ids.toJS(), cacheState.toJS());
                nextRequest = exploreProfilesState.get('nextRequest');
                profilesCount = exploreProfilesState.get('count');
            }
            loading = exploreProfilesState.get('loading');
        }
        return {
            loading,
            nextRequest,
            profiles,
            profilesCount,
        };
    },
);

const hooks = {
    defer: ({ dispatch }) => dispatch(exploreProfiles()),
};

class ExplorePeople extends Component {

    handleLoadMorePeople = () => {
        const { dispatch, nextRequest } = this.props;
        dispatch(exploreProfiles(nextRequest));
    }

    render() {
        const { nextRequest } = this.props;
        return (
            <Container title={t('Explore People')}>
                <ExplorePeopleComponent
                    hasMore={!!nextRequest}
                    onLoadMore={this.handleLoadMorePeople}
                    {...this.props}
                />
            </Container>
        );
    }

};

ExplorePeople.propTypes = {
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    nextRequest: PropTypes.object,
    profiles: PropTypes.array,
};

export default provideHooks(hooks)(connect(selector)(ExplorePeople));
