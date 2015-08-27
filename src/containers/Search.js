import { Component } from 'reactcss';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Avatar, List, ListDivider, ListItem } from 'material-ui';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import t from '../utils/gettext';
import * as selectors from '../selectors';

import HeaderMenu from '../components/HeaderMenu';
import { default as SearchComponent } from '../components/Search';

import searchIcon from '../images/icons/search_icon.svg';

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

@connect(selector)
class Search extends Component {

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

    classes() {
        const common = {
            searchContainerWidth: 460,
        };

        return {
            'default': {
                listDivider: {
                    marginRight: 20,
                },
                organizationLogo: {
                    maxHeight: 200,
                    maxWidth: common.searchContainerWidth,
                },
                organizationLogoSection: {
                    marginTop: 15,
                },
                resultsList: {
                    borderRadius: '0px 0px 5px 5px',
                    opacity: '0.9',
                    boxShadow: '0px 2px 4px -2px',
                    width: '100%',
                    maxWidth: common.searchContainerWidth,
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
            },
        };
    }

    handleCategorySelection(index) {
        this.setState({selectedCategoryIndex: index});
    }

    handleClearCategory() {
        this.setState({selectedCategoryIndex: 0});
    }

    defaultSearchResults() {
        const { organization } = this.props;
        return (
            <List className="start-xs" is="resultsList" subheader={t('EXPLORE')}>
                <ListItem
                    leftAvatar={<Avatar src={searchIcon} />}
                    onTouchTap={this.handleCategorySelection.bind(this, 1)}
                    primaryText={t('Search all People')}
                    secondaryText={t(`${organization.profile_count} people`)}
                />
                <ListDivider inset={true} is="listDivider"/>
                <ListItem
                    leftAvatar={<Avatar src={searchIcon} />}
                    onTouchTap={this.handleCategorySelection.bind(this, 2)}
                    primaryText={t('Search all Teams')}
                    secondaryText={t(`${organization.team_count} teams`)}
                />
                <ListDivider inset={true} is="listDivider"/>
                <ListItem
                    leftAvatar={<Avatar src={searchIcon} />}
                    onTouchTap={this.handleCategorySelection.bind(this, 3)}
                    primaryText={t('Search all Locations')}
                    secondaryText={t(`${organization.location_count} locations`)}
                />
            </List>
        );
    }

    getSearchCategory() {
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
        return (
            <div is="root">
                <header>
                    <div className="row end-xs">
                        <HeaderMenu dispatch={this.props.dispatch} profile={this.props.profile}/>
                    </div>
                </header>
                <section className="wrap">
                    <section is="organizationLogoSection">
                        <div className="row">
                            <div className="col-xs center-xs">
                                <img is="organizationLogo" src={this.props.organization.image_url} />
                            </div>
                        </div>
                    </section>
                    <section is="searchSection">
                        <div className="row">
                            <div className="col-xs center-xs">
                                <SearchComponent
                                    defaultResults={this.defaultSearchResults()}
                                    focused={true}
                                    onClearCategory={this.handleClearCategory.bind(this)}
                                    searchCategory={this.getSearchCategory()}
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
