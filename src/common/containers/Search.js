import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { canvasColor, fontColors } from '../constants/styles';
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
        selectors.searchSelector,
    ],
    (searchState) => {
        return {
            loading: searchState.get('loading'),
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
        dispatch: PropTypes.func.isRequired,
        params: PropTypes.object.isRequired,
        results: PropTypes.arrayOf(PropTypes.instanceOf(services.search.containers.SearchResultV1)),
    }

    static contextTypes = {
        history: PropTypes.object.isRequired,
        mixins: PropTypes.object,
        muiTheme: PropTypes.object.isRequired,
    }

    state = {
        focused: false,
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
                        limitResultsListHeight={false}
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
        return (
            <SearchComponent
                canExplore={false}
                className="center-xs"
                onBlur={::this.handleBlurSearch}
                onFocus={::this.handleFocusSearch}
                processResults={false}
                ref="headerSearch"
                retainResultsOnBlur={true}
                searchLocation={SEARCH_LOCATION.PAGE_HEADER}
                {...this.styles().Search}
            />
        );
    }

    render() {
        return (
            <Container>
                <Header
                    actionsContainer={this.renderHeaderActionsContainer()}
                    {...this.props}
                />
                {this.renderContent()}
            </Container>
        );
    }
}

export default Search;
