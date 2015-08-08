import { decorate } from 'react-mixin';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Radium from 'radium';
import React from 'react/addons';
import { services } from 'protobufs';

import { clearResults, loadResults } from '../actions/search';
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
        width: '100%',
    },
    root: {
        maxWidth: 500,
    },
    searchBar: {
        width: '100%',
        height: 50,
        borderStyle: 'solid',
        borderColor: 'white',
        borderWidth: '1px',
        borderRadius: '5px',
        backgroundColor: 'white',
        boxShadow: '0px 2px 4px -2px',
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
    searchIcon: {
        height: 40,
        width: 30,
        paddingTop: 10,
        marginRight: 5,
    },
};

const selector = createSelector(
    [selectors.searchSelector],
    (searchState) => {
        return {
            results: searchState.get('results'),
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
    }

    state = {
        query: null,
        results: null,
        focused: false,
    }

    currentSearch = null;

    componentDidMount() {
        this._focusInput();
    }

    componentWillReceiveProps(nextProps) {
        this._loadResults(nextProps);
        if (nextProps.searchCategory !== this.props.searchCategory) {
            this.props.dispatch(clearResults());
            this.props.dispatch(loadResults(this.state.query, nextProps.searchCategory));
        }
    }

    componentDidUpdate() {
        this._focusInput();
    }

    _loadResults(props) {
        if (props.results.has(this.state.query)) {
            this.setState({results: props.results.get(this.state.query)});
        }
    }

    _focusInput() {
        if (this.props.focused) {
            React.findDOMNode(this.refs.searchInput).focus();
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
            this.props.dispatch(loadResults(this.state.query, this.props.searchCategory));
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
            if (!this.state.query) {
                return this.props.defaultResults;
            } else if (this.state.results && this.state.results.length) {
                return (
                    <SearchResults
                        className="start-xs"
                        results={this.state.results.slice(0, 5)}
                        style={styles.resultsList}
                    />
                );
            }
        }
    }

    render() {
        let searchBarStyle;
        if (
            (this.state.focused && !this.state.query) ||
            (this.state.query && this.state.results && this.state.results.length)
        ) {
            searchBarStyle = {borderRadius: '5px 5px 0px 0px'};
        }
        return (
            <div style={styles.root} onFocus={this._handleFocus}>
                <div className="row center-xs">
                    <div className="row center-xs" style={[styles.searchBar, searchBarStyle]}>
                        <div className="col-xs-1">
                            <img style={styles.searchIcon} src={searchIcon} />
                        </div>
                        <div className="col-xs" style={styles.searchInputContainer}>
                            <div className="row">
                                {this._renderSearchCategoryTokens()}
                                <div className="col-xs"> 
                                    <input
                                        ref="searchInput"
                                        style={styles.searchInput}
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
                <div className="row center-xs" style={styles.footer}>
                    <span style={styles.footerText}>{t('POWERED BY CIRCLE')}</span>
                </div>
            </div>
        );
    }

}

export default SearchContainer;
