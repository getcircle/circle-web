import { decorate } from 'react-mixin';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import mui from 'material-ui';
import React from 'react/addons';

import { clearResults, loadResults } from '../actions/search';
import t from '../utils/gettext';
import ThemeManager from '../utils/ThemeManager';
import * as selectors from '../selectors';

import HeaderMenu from '../components/HeaderMenu';
import SearchResults from '../components/SearchResults';

import searchIcon from '../images/icons/search_icon.svg';

const { 
    Avatar,
    List,
    ListDivider,
    ListItem,
} = mui;

const selector = createSelector(
    [selectors.searchSelector, selectors.authenticationSelector],
    (searchState, authenticationState) => {
        return {
            results: searchState.get('results'),
            profile: authenticationState.get('profile'),
            organization: authenticationState.get('organization'),
            authenticated: authenticationState.get('authenticated'),
        }
    },
)

const styles = {
    footer: {
        paddingTop: 50,
        fontSize: 11,
    },
    footerText: {
        color: 'white',
    },
    listDivider: {
        marginRight: 20,
    },
    organizationLogoSection: {
        marginTop: 15,
    },
    root: {
        backgroundImage: 'linear-gradient(160deg,#4280c5 13%,#59f0ff 100%)',
        minHeight: '100vh',
    },
    resultsContainer: {
        width: 450,
    },
    resultAvatar: {
        height: 40,
        width: 40,
    },
    resultsList: {
        borderRadius: '0px 0px 5px 5px',
        opacity: '0.9',
        boxShadow: '0px 2px 4px -2px',
    },
    searchSection: {
        paddingTop: 78,
    },
    searchBar: {
        width: 450,
        height: 50,
        borderStyle: 'solid',
        borderColor: 'white',
        borderWidth: '1px',
        borderRadius: '5px',
        backgroundColor: 'white',
        boxShadow: '0px 2px 4px -2px',
    },
    searchInput: {
        width: '100%',
        paddingLeft: 0,
        height: 50,
        outline: 'none',
        border: 'none',
        fontSize: '19px',
        backgroundColor: 'transparent',
    },
    searchIcon: {
        height: 50,
        width: 30,
    },
};

@connect(selector)
@decorate(React.addons.LinkedStateMixin)
class Search extends React.Component {

    static propTypes = {
        results: React.PropTypes.object.isrequired,
        profile: React.PropTypes.object.isRequired,
    }

    static childContextTypes = {
        muiTheme: React.PropTypes.object,
    }

    constructor() {
        super();
        this.state = {
            query: null,
            results: null,
            focused: false,
        };
        this.currentSearch = null;
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    componentWillReceiveProps(nextProps) {
        this._loadResults(nextProps);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!nextProps.authenticated) {
            return false;
        }
        return true;
    }

    _loadResults(props) {
        if (props.results.has(this.state.query)) {
            this.setState({results: props.results.get(this.state.query)});
        }
    }

    _handleKeyUp = this._handleKeyUp.bind(this)
    _handleKeyUp(event) {
        if (this.currentSearch !== null) {
            window.clearTimeout(this.currentSearch);
        }

        this.currentSearch = window.setTimeout(() => {
            this.props.dispatch(loadResults(this.state.query));
        }, 100);
        this._loadResults(this.props);
    }

    _handleFocus = this._handleFocus.bind(this)
    _handleFocus(event) {
        this.setState({focused: true})
    }

    _handleBlur = this._handleBlur.bind(this)
    _handleBlur(event) {
        this.setState({focused: false, results: null, query: ''});
        this.props.dispatch(clearResults());
    }

    _defaultSearchResults() {
        return (
            <List subheader={t('EXPLORE')} style={styles.resultsList}>
                <ListItem
                    leftAvatar={<Avatar src={searchIcon} style={styles.resultAvatar} />}
                    primaryText={t('Search all People')}
                    secondaryText={t('193 people')}
                />
                <ListDivider inset={true} style={styles.listDivider}/>
                <ListItem
                    leftAvatar={<Avatar src={searchIcon} style={styles.resultAvatar} />}
                    primaryText={t('Search all Teams')}
                    secondaryText={t('23 teams')}
                />
                <ListDivider inset={true} style={styles.listDivider}/>
                <ListItem
                    leftAvatar={<Avatar src={searchIcon} style={styles.resultAvatar} />}
                    primaryText={t('Search all Locations')}
                    secondaryText={t('4 locations')}
                />
            </List>
        );
    }

    _renderSearchResults() {
        if (this.state.focused) {
            if (!this.state.query) {
                return this._defaultSearchResults();
            } else if (this.state.results && this.state.results.length) {
                return <SearchResults results={this.state.results.slice(0, 5)} style={styles.resultsList} />;
            }
        }
    }

    render() {
        let searchBarStyle = Object.assign({}, styles.searchBar);
        if (
            (this.state.focused && !this.state.query) ||
            (this.state.query && this.state.results && this.state.results.length)
        ) {
            searchBarStyle['borderRadius'] = '5px 5px 0px 0px';
        }
        return (
            <div style={styles.root}>
                <header>
                    <div className="row end-xs">
                        <HeaderMenu profile={this.props.profile} dispatch={this.props.dispatch} />
                    </div>
                </header>
                <section style={styles.organizationLogoSection}>
                    <div className="row center-xs">
                        <img src={this.props.organization.image_url} />
                    </div>
                </section>
                <section style={styles.searchSection}>
                    <div className="row center-xs">
                        <div className="row center-xs" style={searchBarStyle}>
                            <div className="col-xs-1">
                                <img style={styles.searchIcon} src={searchIcon} />
                            </div>
                            <div className="col-xs">
                                <input
                                    style={styles.searchInput}
                                    type="text"
                                    valueLink={this.linkState('query')}
                                    onKeyUp={this._handleKeyUp}
                                    onFocus={this._handleFocus}
                                    onBlur={this._handleBlur}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row center-xs">
                        <div className="start-xs" style={styles.resultsContainer}>
                            {this._renderSearchResults()}
                        </div>
                    </div>
                </section>
                <footer style={styles.footer}>
                    <div className="row center-xs">
                        <span style={styles.footerText}>{t('POWERED BY CIRCLE')}</span>
                    </div>
                </footer>
            </div>
        );
    }
}

export default Search;
