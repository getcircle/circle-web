import { decorate } from 'react-mixin';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import mui from 'material-ui';
import React from 'react/addons';

import { loadResults } from '../actions/search';
import SearchResults from '../components/SearchResults';
import t from '../utils/gettext';
import ThemeManager from '../utils/ThemeManager';
import * as selectors from '../selectors';

import searchIcon from '../images/icons/search_icon.svg';

const { 
    Avatar,
    List,
    ListDivider,
    ListItem,
    SvgIcon,
    TextField,
} = mui;

const selector = createSelector(
    [selectors.searchSelector],
    (searchState) => { return {results: searchState.get('results') } },
)

const styles = {
    listDivider: {
        marginRight: 20,
    },
    root: {
        backgroundColor: 'black',
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
    },
    searchSection: {
        paddingTop: 152,
    },
    searchBar: {
        width: 450,
        height: 50,
        borderStyle: 'solid',
        borderColor: 'white',
        borderWidth: '1px',
        borderRadius: '5px',
        backgroundColor: 'white',
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
}

@connect(selector)
@decorate(React.addons.LinkedStateMixin)
class Search extends React.Component {

    static propTypes = {
        results: React.PropTypes.object.isrequired,
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
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    componentWillReceiveProps(nextProps) {
        this._loadResults(nextProps);
    }

    _loadResults(props) {
        this.setState({results: props.results.get(this.state.query)});
    }

    _handleKeyUp = this._handleKeyUp.bind(this)
    _handleKeyUp(event) {
        this.props.dispatch(loadResults(this.state.query));
        this._loadResults(this.props);
    }

    _handleFocus = this._handleFocus.bind(this)
    _handleFocus(event) {
        this.setState({focused: true})
    }

    _handleBlur = this._handleBlur.bind(this)
    _handleBlur(event) {
        this.setState({focused: false});
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
                return <SearchResults results={this.state.results} style={styles.resultsList} />;
            }
        }
    }

    render() {
        let searchBarStyle = Object.assign({}, styles.searchBar);
        if (this.state.focused) {
            searchBarStyle['borderRadius'] = '5px 5px 0px 0px';
        }
        return (
            <div style={styles.root}>
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
            </div>
        );
    }
}

export default Search;
