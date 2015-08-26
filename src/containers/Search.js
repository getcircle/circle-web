import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import mui from 'material-ui';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import t from '../utils/gettext';
import * as selectors from '../selectors';

import HeaderMenu from '../components/HeaderMenu';
import PureComponent from '../components/PureComponent';
import SearchCategoryButton from '../components/SearchCategoryButton';
import { default as SearchComponent } from '../components/Search';

import searchIcon from '../images/icons/search_icon.svg';

const {
    Avatar,
    FlatButton,
    List,
    ListDivider,
    ListItem,
} = mui;

const selector = createSelector(
    [selectors.authenticationSelector],
    (authenticationState) => {
        return {
            profile: authenticationState.get('profile'),
            organization: authenticationState.get('organization'),
            authenticated: authenticationState.get('authenticated'),
        }
    },
)

const styles = {
    listDivider: {
        marginRight: 20,
    },
    organizationLogo: {
        maxHeight: 200,
    },
    organizationLogoSection: {
        marginTop: 15,
    },
    resultsList: {
        borderRadius: '0px 0px 5px 5px',
        opacity: '0.9',
        boxShadow: '0px 2px 4px -2px',
        width: '100%',
        minWidth: 500,
    },
    root: {
        // slack's color
        // backgroundImage: 'linear-gradient(160deg,#4280c5 30%,#59f0ff 120%)',
        minHeight: '100vh',
        backgroundColor: '#222',
        paddingBottom: 20,
    },
    searchSection: {
        paddingTop: 52,
    },
};

const searchCategories = [t('All'), t('People'), t('Teams'), t('Locations')];

@connect(selector)
class Search extends PureComponent {

    static propTypes = {
        organization: PropTypes.object.isRequired,
        profile: PropTypes.object.isRequired,
    }

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired,
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!nextProps.authenticated) {
            return false;
        }
        return true;
    }

    state = {
        selectedCategoryIndex: 0,
    }

    _handleCategorySelection(index) {
        this.setState({selectedCategoryIndex: index});
    }

    _handleClearCategory() {
        this.setState({selectedCategoryIndex: 0});
    }

    _defaultSearchResults() {
        const { organization } = this.props;
        return (
            <List className="start-xs" subheader={t('EXPLORE')} style={styles.resultsList}>
                <ListItem
                    leftAvatar={<Avatar src={searchIcon} style={styles.resultAvatar} />}
                    primaryText={t('Search all People')}
                    secondaryText={t(`${organization.profile_count} people`)}
                    onTouchTap={this._handleCategorySelection.bind(this, 1)}
                />
                <ListDivider inset={true} style={styles.listDivider}/>
                <ListItem
                    leftAvatar={<Avatar src={searchIcon} style={styles.resultAvatar} />}
                    primaryText={t('Search all Teams')}
                    secondaryText={t(`${organization.team_count} teams`)}
                    onTouchTap={this._handleCategorySelection.bind(this, 2)}
                />
                <ListDivider inset={true} style={styles.listDivider}/>
                <ListItem
                    leftAvatar={<Avatar src={searchIcon} style={styles.resultAvatar} />}
                    primaryText={t('Search all Locations')}
                    secondaryText={t(`${organization.location_count} locations`)}
                    onTouchTap={this._handleCategorySelection.bind(this, 3)}
                />
            </List>
        );
    }

    _renderSearchCategoryButtons() {
        return searchCategories.map((category, index) => {
            return (
                <SearchCategoryButton
                    key={index}
                    className="row center-xs end-lg"
                    label={category}
                    active={index === this.state.selectedCategoryIndex}
                    onTouchTap={this._handleCategorySelection.bind(this, index)}
                />
            );
        });
    }

    _getSearchCategory() {
        const { CategoryV1 } = services.search.containers.search;
        switch(this.state.selectedCategoryIndex) {
        case 1:
            return CategoryV1.PROFILES;
        case 2:
            return CategoryV1.TEAMS;
        case 3:
            return CategoryV1.LOCATIONS;
        }
    }

    render() {
    // <img style={styles.organizationLogo} src={this.props.organization.image_url} />
        return (
            <div style={styles.root}>
                <header>
                    <div className="row end-xs">
                        <HeaderMenu profile={this.props.profile} dispatch={this.props.dispatch} />
                    </div>
                </header>
                <section className="wrap">
                    <section style={styles.organizationLogoSection}>
                        <div className="row">
                            <div className="col-xs-offset-4 col-xs-5 center-xs">
                                <img style={styles.organizationLogo} src="https://scontent.fsnc1-1.fna.fbcdn.net/hphotos-xtf1/v/t1.0-9/11259121_10153814212864008_6881369548961207517_n.jpg?oh=b5bf7dd4fe8b5783f7a8b097873de9de&oe=56803EF1" />
                            </div>
                        </div>
                    </section>
                    <section style={styles.searchSection}>
                        <div className="row">
                            <div className="col-xs-offset-1 col-xs-3">
                                {this._renderSearchCategoryButtons()}
                            </div>
                            <div className="col-xs-5">
                                <SearchComponent
                                    defaultResults={this._defaultSearchResults()}
                                    searchCategory={this._getSearchCategory()}
                                    onClearCategory={this._handleClearCategory.bind(this)}
                                    focused={true}
                                />
                            </div>
                        </div>
                    </section>
                </section>
            </div>
        );
    }
}

export default Search;
