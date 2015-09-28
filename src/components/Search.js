import { decorate } from 'react-mixin';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Radium from 'radium';
import React, { PropTypes } from 'react/addons';
import { services } from 'protobufs';

import { clearSearchResults, loadSearchResults } from '../actions/search';
import * as exploreActions from '../actions/explore';
import * as selectors from '../selectors';
import t from '../utils/gettext';

import SearchResults from '../components/SearchResults';
import StyleableComponent from './StyleableComponent';

import searchIcon from '../images/icons/search_icon.svg';

const styles = {
    footer: {
        paddingTop: 50,
        fontSize: 11,
    },
    footerText: {
        color: 'white',
    },
    resultAvatar: {
        height: 40,
        width: 40,
    },
    resultsList: {
        borderRadius: '0px 0px 5px 5px',
        opacity: '0.9',
        boxShadow: '0px 2px 4px -2px',
        maxWidth: 500,
        minWidth: 500,
    },
    searchBar: {
        width: '100%',
        maxWidth: 500,
        minWidth: 500,
        height: 50,
        borderStyle: 'solid',
        borderColor: 'white',
        borderWidth: '1px',
        borderRadius: '5px',
        backgroundColor: 'white',
        boxShadow: '0px 2px 4px -2px',
    },
    searchBarInHeader: {
        boxShadow: '0px',
        borderColor: 'rgba(0, 0, 0, .1)',
        backgroundClip: 'padding-box',
        height: 44,
        marginTop: 10,
    },
    searchInputContainer: {
        paddingLeft: 0,
    },
    searchInput: {
        width: '100%',
        paddingLeft: 0,
        paddingTop: 10,
        height: 40,
        outline: 'none',
        border: 'none',
        fontSize: '19px',
        backgroundColor: 'transparent',
    },
    searchInputInHeader: {
        paddingTop: 0,
    },
    searchIcon: {
        height: 40,
        width: 30,
        paddingTop: 10,
        marginRight: 5,
    },
    searchIconInHeader: {
        paddingTop: 0,
    },
};

const selector = createSelector(
    [selectors.searchSelector, selectors.exploreSelector],
    (searchState, exploreState) => {
        return {
            searchResults: searchState.get('results'),
            exploreResults: exploreState.get('results'),
            active: searchState.get('active'),
        }
    },
);

// - Take a query and run a generic search
// - Take a search category and run the search against that category
// - Take a search category and display paginated results for the category
// - Display recent search results
// - Display "Explore" links for exploring the various search categories
// - Take a list of objects and support filtering them
// - Support filtering against a given category and attribute
// - Optionally support hitting escape key clears the results
// - Support keying through the results

@connect(selector)
@decorate(React.addons.LinkedStateMixin)
@Radium
class Search extends StyleableComponent {

    static propTypes = {
        active: PropTypes.bool,
        defaultResults: PropTypes.object,
        exploreResults: PropTypes.array,
        focused: PropTypes.bool,
        inHeader: PropTypes.bool,
        onClearCategory: PropTypes.func,
        renderPoweredBy: PropTypes.bool,
        resultsListStyle: PropTypes.object,
        searchBarStyle: PropTypes.object,
        searchCategory: PropTypes.number,
        searchResults: PropTypes.object,
    }

    static defaultProps = {
        active: false,
        focused: false,
        searchCategory: null,
        inHeader: false,
        renderPoweredBy: true,
    }

    state = {
        query: null,
        results: [],
        focused: false,
    }

    currentSearch = null;

    componentDidMount() {
        this._focusInput();
        this.setState({focused: this.props.focused});
    }

    componentWillReceiveProps(nextProps, nextState) {
        this._loadResults(nextProps);
        if (nextProps.searchCategory !== this.props.searchCategory) {
            this.props.dispatch(clearSearchResults());
            this.props.dispatch(exploreActions.clearExploreResults());
            if (this.state.query) {
                this.props.dispatch(loadSearchResults(this.state.query, nextProps.searchCategory));
            } else {
                this._exploreSearchCategory(nextProps);
            }
        }

        if (!nextProps.active && this.props.active) {
            this._clear();
        }
    }

    componentDidUpdate() {
        this._focusInput();
    }

    _clear() {
        this.setState({focused: false, results: [], query: null});
    }

    _loadResults(props) {
        if (this.state.query && props.searchResults.has(this.state.query)) {
            this.setState({results: props.searchResults.get(this.state.query)});
        } else if (!this.state.query) {
            this.setState({results: props.exploreResults.toJS()});
        }
    }

    _focusInput() {
        if (this.props.focused) {
            React.findDOMNode(this.refs.searchInput).focus();
            React.findDOMNode(this.refs.search).focus();
        }
    }

    _exploreSearchCategory(props) {
        const { CategoryV1 } = services.search.containers.search;
        let action;
        switch(props.searchCategory) {
        case CategoryV1.PROFILES:
            action = exploreActions.exploreProfiles;
            break;
        case CategoryV1.TEAMS:
            action = exploreActions.exploreTeams;
            break;
        case CategoryV1.LOCATIONS:
            action = exploreActions.exploreLocations;
            break;
        }
        if (action) {
            props.dispatch(action());
        }
    }

    _handleFocus = this._handleFocus.bind(this)
    _handleFocus(event) {
        this.setState({focused: true})
    }

    _handleKeyUp = this._handleKeyUp.bind(this)
    _handleKeyUp(event) {
        if (this.currentSearch !== null) {
            window.clearTimeout(this.currentSearch);
        }

        this.currentSearch = window.setTimeout(() => {
            this.props.dispatch(loadSearchResults(this.state.query, this.props.searchCategory));
        }, 100);
        this._loadResults(this.props);
    }

    _renderSearchResults() {
        if (this.state.focused) {
            if (!this.state.query && this.props.searchCategory === null) {
                return this.props.defaultResults;
            } else if (this.state.results && this.state.results.length) {
                let resultsStyle = Object.assign({}, styles.resultsList, this.props.resultsListStyle);
                // XXX this should be passed in via style properties
                if (this.props.inHeader) {
                    resultsStyle.position = 'absolute';
                    resultsStyle.minWidth = 500;
                    resultsStyle.opacity = 1;
                    resultsStyle.marginLeft = 'auto';
                    resultsStyle.marginRight = 'auto';
                    resultsStyle.left = 0,
                    resultsStyle.right = 0,
                    resultsStyle.zIndex = 100;
                }
                return (
                    <SearchResults
                        className="start-xs"
                        results={this.state.results.slice(0, 5)}
                        style={resultsStyle}
                        onClickResult={this.props.dispatch.bind(this, clearSearchResults())}
                    />
                );
            }
        }
    }

    _renderPoweredBy() {
        if (!this.props.inHeader && this.props.renderPoweredBy) {
            return (
                <div className="row center-xs" style={styles.footer}>
                    <span style={styles.footerText}>{t('POWERED BY CIRCLE')}</span>
                </div>
            );
        }
    }

    render() {
        let searchBarStyle = {};
        if (
            (this.state.focused && !this.state.query) ||
            (this.state.query && this.state.results && this.state.results.length)
        ) {
            searchBarStyle.borderRadius = '5px 5px 0px 0px';
        }

        return (
            <div ref="search" onFocus={this._handleFocus}>
                <div className="row center-xs">
                    <div
                        className="row center-xs"
                        style={[
                            styles.searchBar,
                            searchBarStyle,
                            this.props.inHeader && styles.searchBarInHeader,
                            this.props.searchBarStyle,
                        ]}
                    >
                        <div className="col-xs-1">
                            <img style={[
                                    styles.searchIcon,
                                    this.props.inHeader && styles.searchIconInHeader,
                                ]}
                                src={searchIcon}
                            />
                        </div>
                        <div className="col-xs" style={styles.searchInputContainer}>
                            <div className="row">
                                {this._renderSearchCategoryTokens()}
                                <div className="col-xs">
                                    <input
                                        ref="searchInput"
                                        style={[
                                            styles.searchInput,
                                            this.props.inHeader && styles.searchInputInHeader,
                                        ]}
                                        type="text"
                                        valueLink={this.linkState('query')}
                                        onKeyUp={this._handleKeyUp}
                                        onFocus={this._handleFocus}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row center-xs">
                    {this._renderSearchResults()}
                </div>
                {this._renderPoweredBy()}
            </div>
        );
    }

}

export default Search;
