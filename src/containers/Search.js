import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { fontColors } from '../constants/styles';
import { getAuthenticatedProfile } from '../reducers/authentication';
import { loadSearchResults } from '../actions/search';
import { resetScroll } from '../utils/window';
import { SEARCH_LOCATION } from '../constants/trackerProperties';
import * as selectors from '../selectors';
import t from '../utils/gettext';

import Container from '../components/Container';
import CSSComponent from '../components/CSSComponent';
import DetailContent from '../components/DetailContent';
import { default as SearchComponent } from '../components/Search';

const selector = createSelector(
    [
        selectors.authenticationSelector,
        selectors.cacheSelector,
        selectors.responsiveSelector,
        selectors.routerParametersSelector,
    ],
    (authenticationState, cacheState, responsiveState, routerParamsState) => {
        const profile = getAuthenticatedProfile(authenticationState, cacheState.toJS());
        return {
            authenticatedProfile: profile,
            largerDevice: responsiveState.get('largerDevice'),
            mobileOS: responsiveState.get('mobileOS'),
            organization: authenticationState.get('organization'),
        }
    },
);

@connect(selector)
class Search extends CSSComponent {

    static propTypes = {
        authenticatedProfile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
        dispatch: PropTypes.func.isRequired,
        largerDevice: PropTypes.bool.isRequired,
        mobileOS: PropTypes.bool.isRequired,
        organization: PropTypes.object.isRequired,
        params: PropTypes.shape({
            query: PropTypes.string.isRequired,
        }).isRequired,
        profile: PropTypes.object.isRequired,
    }

    static contextTypes = {
        mixins: PropTypes.object,
        muiTheme: PropTypes.object.isRequired,
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

    componentWillMount() {
        this.loadSearchResults(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.query !== this.props.params.query) {
            this.loadSearchResults(nextProps);
        }
    }

    loadSearchResults(props) {
        resetScroll();
    }

    classes() {
        return {
            'default': {
                pageHeaderText: {
                    ...fontColors.dark,
                    fontSize: 28,
                    fontWeight: 300,
                    padding: '20px 0 40px 0',
                },
                searchTerm: {
                    fontStyle: 'italic',
                },
                SearchComponent: {
                    autoCompleteStyle: {
                        maxWidth: '100%',
                    },
                    inputContainerStyle: {
                        display: 'none',
                    },
                    resultsListStyle: {
                        width: '100%',
                        maxHeight: '100%',
                    }
                },
            },
        };
    }

    render() {
        const {
            largerDevice,
            organization,
            params,
        } = this.props;

        return (
            <Container>
                <DetailContent>
                    <div>
                        <h3 is="pageHeaderText">
                            {t('Search Results')}
                            &nbsp;&ndash;&nbsp;<span is="searchTerm">&ldquo;{params.query}&rdquo;</span>
                        </h3>
                    </div>
                    <SearchComponent
                        canExplore={false}
                        className="row center-xs"
                        focused={true}
                        is="SearchComponent"
                        largerDevice={largerDevice}
                        limitResultsListHeight={false}
                        organization={organization}
                        query={params.query}
                        searchLocation={SEARCH_LOCATION.SEARCH}
                        showExpandedResults={false}
                        showRecents={false}
                    />
                </DetailContent>
            </Container>
        );
    }
}

export default Search;
