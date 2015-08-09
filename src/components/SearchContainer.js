import { decorate } from 'react-mixin';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Radium from 'radium';
import React from 'react/addons';
import { services } from 'protobufs';

import { clearSearchResults, loadSearchResults } from '../actions/search';
import * as exploreActions from '../actions/explore';
import * as selectors from '../selectors';
import t from '../utils/gettext';

import SearchCategoryToken from '../components/SearchCategoryToken';
import SearchResults from '../components/SearchResults';

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
        width: '100%',
    },
    searchBar: {
        width: '100%',
        maxWidth: 500,
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
        }
    },
);

@connect(selector)
@decorate(React.addons.LinkedStateMixin)
@Radium
class SearchContainer extends React.Component {

    static propTypes = {
        defaultResults: React.PropTypes.object,
        searchCategory: React.PropTypes.number,
        onClearCategory: React.PropTypes.func,
        focused: React.PropTypes.bool,
        searchResults: React.PropTypes.object,
        exploreResults: React.PropTypes.array,
        inHeader: React.PropTypes.bool,
    }

    static defaultProps = {
        focused: false,
        searchCategory: null,
        inHeader: false,
    }

    state = {
        query: null,
        results: [],
        focused: false,
    }

    currentSearch = null;

    componentDidMount() {
        this._focusInput();
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
    }

    componentDidUpdate() {
        this._focusInput();
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

    _renderSearchCategoryTokens() {
        const { searchCategory } = this.props;
        const { CategoryV1 } = services.search.containers.search;

        let label;
        switch(searchCategory) {
        case CategoryV1.PROFILES:
            label = t('People');
            break;
        case CategoryV1.TEAMS:
            label = t('Teams');
            break;
        case CategoryV1.LOCATIONS:
            label = t('Locations');
            break;
        }
        if (label) {
            return (
                <div>
                    <SearchCategoryToken
                        label={label}
                        onTouchTap={this.props.onClearCategory ? this.props.onClearCategory : null}
                    />
                </div>
            );
        }
    }

    _renderSearchResults() {
        if (this.state.focused) {
            if (!this.state.query && this.props.searchCategory === null) {
                return this.props.defaultResults;
            } else if (this.state.results && this.state.results.length) {
                let resultsStyle = Object.assign({}, styles.resultsList);
                if (this.props.inHeader) {
                    resultsStyle.position = 'absolute';
                    resultsStyle.width = 500;
                    resultsStyle.opacity = 1;
                    resultsStyle.marginLeft = 21;
                    resultsStyle.zIndex = 100;
                }
                return (
                    <SearchResults
                        className="start-xs"
                        results={this.state.results.slice(0, 5)}
                        style={resultsStyle}
                    />
                );
            }
        }
    }

    _renderPoweredBy() {
        if (!this.props.inHeader) {
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
            <div onFocus={this._handleFocus}>
                <div className="row center-xs">
                    <div
                        className="row center-xs"
                        style={[
                            styles.searchBar,
                            searchBarStyle,
                            this.props.inHeader && styles.searchBarInHeader,
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
                <div className="row">
                    {this._renderSearchResults()}
                </div>
                {this._renderPoweredBy()}
            </div>
        );
    }

}

export default SearchContainer;
