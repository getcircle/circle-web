import { Component } from 'reactcss';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import keymirror from 'keymirror';
import { List, ListItem, ListDivider } from 'material-ui';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { iconColors, fontColors, fontWeights } from '../constants/styles';
import t from '../utils/gettext';
import * as selectors from '../selectors';

import AutoComplete from '../components/AutoComplete';
import HeaderMenu from '../components/HeaderMenu';
import SearchIcon from '../components/SearchIcon';

const RESULT_TYPES = keymirror({
    EXPLORE: null,
    RECENT: null,
});

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
        dispatch: PropTypes.func.isRequired,
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
                AutoComplete: {
                    style: {
                        width: '100%',
                    },
                },
                ListDivider: {
                    style: {
                        backgroundColor: 'rgba(0, 0, 0, .05)',
                        marginLeft: 58,
                    },
                },
                organizationLogo: {
                    maxHeight: 200,
                    maxWidth: common.searchContainerWidth,
                    width: '100%',
                },
                organizationLogoSection: {
                    marginTop: 15,
                },
                resultsList: {
                    borderRadius: '0px 0px 5px 5px',
                    boxShadow: '0px 2px 4px -2px',
                    justifyContent: 'flex-start',
                    maxWidth: common.searchContainerWidth,
                    opacity: '0.9',
                    textAlign: 'start',
                    width: '100%',
                },
                resultsListSubHeader: {
                    fontSize: '11px',
                    lineHeight: '20px',
                    paddingTop: 14,
                    textTransform: 'uppercase',
                    ...fontColors.extraLight,
                    ...fontWeights.semiBold,
                },
                root: {
                    minHeight: '100vh',
                    backgroundColor: '#222',
                    paddingBottom: 20,
                },
                searchContainer: {
                    display: 'flex',
                },
                SearchIcon: {
                    style: {
                        alignSelf: 'center',
                        display: 'flex',
                        height: 24,
                        left: 0,
                        position: 'initial',
                        top: 0,
                        width: 24,
                    },
                    ...iconColors.dark,
                },
                searchResult: {
                    display: 'flex',
                    paddingLeft: 18,
                    paddingRight: 0,
                    position: 'inherit',
                    top: 0,
                    left: 0,
                },
                searchResultText: {
                    alignSelf: 'center',
                    display: 'flex',
                    paddingLeft: 18,
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

    getDefaultSearchResults() {
        const { organization } = this.props;
        return [
            {
                onTouchTap: this.handleCategorySelection.bind(this, 1),
                primaryText: t(`People (${organization.profile_count})`),
                type: RESULT_TYPES.EXPLORE,
            },
            {
                onTouchTap: this.handleCategorySelection.bind(this, 2),
                primaryText: t(`Teams (${organization.team_count})`),
                type: RESULT_TYPES.EXPLORE,
            },
            {
                onTouchTap: this.handleCategorySelection.bind(this, 3),
                primaryText: t(`Locations (${organization.location_count})`),
                type: RESULT_TYPES.EXPLORE,
            },
        ];
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

    renderItem(item, highlighted, style) {
        const element = (
            <ListItem
                innerDivStyle={this.styles().searchResult}
                leftAvatar={<SearchIcon />}
                leftAvatarStyle={this.styles().SearchIcon.style}
                primaryText={item.primaryText}
                primaryTextStyle={this.styles().searchResultText}
                ref={(component) => {
                    ((highlighted) =>  {
                        // NB: Component will be null in some cases (unmounting and on change)
                        if (component) {
                            component.applyFocusState(highlighted ? 'keyboard-focused' : 'none');
                        }
                    })(highlighted);
                }}
            />
        );
        return element;
    }

    renderMenu(items, value, style) {
        const itemsWithDividers = items.map((item, index) => {
            if (index !== 0) {
                return [<ListDivider inset={true} is="ListDivider" key={`item-divider-${index}`} />, item];
            }
            return item;
        })
        return (
            <List
                key="results"
                style={{...style, ...this.styles().resultsList}}
                subheader="Explore"
                subheaderStyle={this.styles().resultsListSubHeader}
            >
                {itemsWithDividers}
            </List>
        );
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
                            <div className="col-xs center-xs" is="searchContainer">
                                <AutoComplete
                                    alwaysActive={true}
                                    focused={true}
                                    is="AutoComplete"
                                    items={this.getDefaultSearchResults()}
                                    placeholderText={t('Search People, Teams & Locations')}
                                    renderItem={this.renderItem.bind(this)}
                                    renderMenu={this.renderMenu.bind(this)}
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
