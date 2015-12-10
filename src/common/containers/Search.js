import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { canvasColor, fontColors } from '../constants/styles';
import { getAuthenticatedProfile } from '../reducers/authentication';
import { loadSearchResults } from '../actions/search';
import { resetScroll } from '../utils/window';
import { replaceSearchQuery } from '../utils/routes';
import connectData from '../utils/connectData';
import { SEARCH_LOCATION } from '../constants/trackerProperties';
import * as selectors from '../selectors';
import t from '../utils/gettext';

import Container from '../components/Container';
import CSSComponent from '../components/CSSComponent';
import DetailContent from '../components/DetailContent';
import Header from '../components/Header';
import { default as SearchComponent } from '../components/Search';

const selector = createSelector(
    [
        selectors.authenticationSelector,
        selectors.cacheSelector,
        selectors.responsiveSelector,
        selectors.routerParametersSelector,
        selectors.searchSelector,
    ],
    (authenticationState, cacheState, responsiveState, routerParamsState, searchState) => {
        const profile = getAuthenticatedProfile(authenticationState, cacheState.toJS());
        return {
            authenticatedProfile: profile,
            flags: authenticationState.get('flags'),
            largerDevice: responsiveState.get('largerDevice'),
            loading: searchState.get('loading'),
            managesTeam: authenticationState.get('managesTeam'),
            mobileOS: responsiveState.get('mobileOS'),
            organization: authenticationState.get('organization'),
            results: searchState.get('results').toJS(),
        }
    },
);

function fetchSearchResults(dispatch, query) {
    return dispatch(loadSearchResults(query));
}

function fetchData(getState, dispatch, location, params) {
    const promises = [];
    promises.push(fetchSearchResults(dispatch, params.query));
    return Promise.all(promises);
}

@connectData(fetchData)
@connect(selector)
class Search extends CSSComponent {

    static propTypes = {
        authenticatedProfile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
        dispatch: PropTypes.func.isRequired,
        flags: PropTypes.object,
        largerDevice: PropTypes.bool.isRequired,
        managesTeam: PropTypes.object,
        mobileOS: PropTypes.bool.isRequired,
        organization: PropTypes.object.isRequired,
        params: PropTypes.object.isRequired,
        results: PropTypes.arrayOf(PropTypes.instanceOf(services.search.containers.SearchResultV1)),
    }

    static contextTypes = {
        mixins: PropTypes.object,
        muiTheme: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    }

    static childContextTypes = {
        authenticatedProfile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
        flags: PropTypes.object,
        mobileOS: PropTypes.bool.isRequired,
    }

    state = {
        focused: false,
    }

    getChildContext() {
        return {
            authenticatedProfile: this.props.authenticatedProfile,
            flags: this.props.flags,
            mobileOS: this.props.mobileOS,
        };
    }

    componentWillMount() {
        this.loadSearchResults(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.loadSearchResults(nextProps);
    }

    /* Ensure that the header query and the query we're searching with are synced */
    loadSearchResults(props) {
        const { query } = this.props.params;
        if (this.refs.headerSearch) {
            const headerSearch = this.refs.headerSearch.getWrappedInstance();
            const currentQuery = headerSearch.getCurrentQuery();

            // If header search is loaded but not focused with a query,
            // add the query parameter if we have one in the URL
            if (!this.state.focused && !currentQuery && query) {
                headerSearch.setValue(query, () => {
                    headerSearch.focus();
                    this.setState({
                        focused: true
                    });
                });
            }

            // When the component is focused, update URL for all queries entered here
            if (currentQuery !== query && this.state.focused) {
                replaceSearchQuery(this.context.history, currentQuery);
            }

        } else {
            // Given how we clear search results this call is necessary here.
            // See: https://github.com/jlongster/redux-simple-router/issues/111
            // for more info.
            fetchSearchResults(props.dispatch, query);
        }
        resetScroll();
    }

    classes() {
        return {
            default: {
                canvasContainer: {
                    backgroundColor: canvasColor,
                },
                pageHeaderText: {
                    ...fontColors.dark,
                    fontSize: 28,
                    fontWeight: 300,
                    padding: '20px 0 40px 0',
                },
                Search: {
                    inputContainerStyle: {
                        boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, .09)',
                    },
                    resultsListStyle: {
                        display: 'none',
                    },
                    style: {
                        alignSelf: 'center',
                        justifyContent: 'center',
                        flex: 1,
                    }
                },
                SearchResultsComponent: {
                    autoCompleteStyle: {
                        maxWidth: '100%',
                    },
                    inputContainerStyle: {
                        display: 'none',
                    },
                    resultsListStyle: {
                        maxHeight: '100%',
                        width: '100%',
                    },
                },
                searchTerm: {
                    fontStyle: 'italic',
                },
            },
            focused: {
                Search: {
                    inputContainerStyle: {
                        borderRadius: '0px',
                    },
                    focused: true,
                },
            },
        };
    }

    styles() {
        return this.css({
            focused: this.state.focused,
        });
    }

    handleFocusSearch() {
        this.setState({focused: true});
    }

    handleBlurSearch() {
        this.setState({focused: false});
    }

    renderContent() {
        const {
            largerDevice,
            organization,
            results,
            params: { query },
        } = this.props;

        if (query) {
            return (
                <DetailContent>
                    <div>
                        <h3 style={this.styles().pageHeaderText}>
                            {t('Search Results')}
                            &nbsp;&ndash;&nbsp;<span style={this.styles().searchTerm}>&ldquo;{query}&rdquo;</span>
                        </h3>
                    </div>
                    <SearchComponent
                        canExplore={false}
                        className="row center-xs"
                        focused={true}
                        largerDevice={largerDevice}
                        limitResultsListHeight={false}
                        organization={organization}
                        query={query}
                        results={results}
                        retainResultsOnBlur={true}
                        searchLocation={SEARCH_LOCATION.SEARCH}
                        showExpandedResults={false}
                        showRecents={false}
                        {...this.styles().SearchResultsComponent}
                    />
                </DetailContent>
            );
        }
    }

    renderHeaderActionsContainer() {
        const {
            largerDevice,
        } = this.props;

        return (
            <SearchComponent
                canExplore={false}
                className="center-xs"
                largerDevice={largerDevice}
                onBlur={::this.handleBlurSearch}
                onFocus={::this.handleFocusSearch}
                organization={this.props.organization}
                processResults={false}
                ref="headerSearch"
                retainResultsOnBlur={true}
                searchLocation={SEARCH_LOCATION.PAGE_HEADER}
                {...this.styles().Search}
            />
        );
    }

    render() {
        const {
            authenticatedProfile,
        } = this.props;

        return (
            <Container>
                <Header
                    actionsContainer={this.renderHeaderActionsContainer()}
                    profile={authenticatedProfile}
                    {...this.props}
                />
                {this.renderContent()}
            </Container>
        );
    }
}

export default Search;
