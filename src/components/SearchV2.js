import { connect } from 'react-redux';
import Immutable from 'immutable';
import Infinite from 'react-infinite';
import keymirror from 'keymirror';
import mui from 'material-ui';
import React, { PropTypes } from 'react';
import { services, soa } from 'protobufs';

import * as exploreActions from '../actions/explore';
import { loadSearchResults, clearSearchResults } from '../actions/search';
import { iconColors, fontColors, fontWeights } from '../constants/styles';
import { retrieveLocations, retrieveProfiles, retrieveTeams } from '../reducers/denormalizations';
import * as routes from '../utils/routes';
import * as selectors from '../selectors';
import t from '../utils/gettext';

import AutoComplete from './AutoComplete';
import CSSComponent from './CSSComponent';
import GroupIcon from './GroupIcon';
import IconContainer from './IconContainer';
import OfficeIcon from './OfficeIcon';
import ProfileAvatar from './ProfileAvatar';
import SearchIcon from './SearchIcon';

const {
    CircularProgress,
    ListItem,
    ListDivider,
    Paper,
} = mui;

const RESULT_TYPES = keymirror({
    EXPLORE: null,
    LOADING: null,
});

export const SEARCH_RESULT_HEIGHT = 72;
export const SEARCH_CONTAINER_WIDTH = 460;
export const SEARCH_RESULTS_MAX_HEIGHT = 420;

const cacheSelector = selectors.createImmutableSelector(
    [
        selectors.cacheSelector,
        selectors.exploreProfilesIdsSelector,
        selectors.exploreTeamsIdsSelector,
        selectors.exploreLocationsIdsSelector,
    ],
    (cacheState, profilesState, teamsState, locationsState) => {
        let profiles, profilesNextRequest, teams, teamsNextRequest, locations, locationsNextRequest;
        const cache = cacheState.toJS();
        if (profilesState) {
            const ids = profilesState.get('ids').toJS();
            if (ids.length) {
                profiles = retrieveProfiles(ids, cache);
            }
            profilesNextRequest = profilesState.get('nextRequest');
        }
        if (teamsState) {
            const ids = teamsState.get('ids').toJS();
            if (ids.length) {
                teams = retrieveTeams(ids, cache);
            }
            teamsNextRequest = teamsState.get('nextRequest');
        }
        if (locationsState) {
            const ids = locationsState.get('ids').toJS();
            if (ids.length) {
                locations = retrieveLocations(ids, cache);
            }
            locationsNextRequest = locationsState.get('nextRequest');
        }
        return Immutable.fromJS({
            locations,
            locationsNextRequest,
            profiles,
            profilesNextRequest,
            teams,
            teamsNextRequest,
        });
    },
);

const selector = selectors.createImmutableSelector(
    [
        cacheSelector,
        selectors.exploreProfilesLoadingSelector,
        selectors.exploreTeamsLoadingSelector,
        selectors.exploreLocationsLoadingSelector,
        selectors.searchSelector,
    ],
    (
        cacheState,
        profilesLoadingState,
        teamsLoadingState,
        locationsLoadingState,
        searchState,
    ) => {
        return {
            loading: (
                profilesLoadingState ||
                teamsLoadingState ||
                locationsLoadingState ||
                searchState.get('loading')
            ),
            ...searchState.toJS(),
            ...cacheState.toJS(),
        };
    }
);

@connect(selector)
class Search extends CSSComponent {

    static propTypes = {
        alwaysActive: PropTypes.bool,
        dispatch: PropTypes.func.isRequired,
        focused: PropTypes.bool,
        inputContainerStyle: PropTypes.object,
        largerDevice: PropTypes.bool,
        loading: PropTypes.bool,
        locations: PropTypes.arrayOf(
            PropTypes.instanceOf(services.organization.containers.LocationV1)
        ),
        locationsNextRequest: PropTypes.instanceOf(soa.ServiceRequestV1),
        onBlur: PropTypes.func,
        onCancel: PropTypes.func,
        onFocus: PropTypes.func,
        organization: PropTypes.instanceOf(services.organization.containers.OrganizationV1),
        profiles: PropTypes.arrayOf(
            PropTypes.instanceOf(services.profile.containers.ProfileV1)
        ),
        profilesNextRequest: PropTypes.instanceOf(soa.ServiceRequestV1),
        results: PropTypes.arrayOf(PropTypes.instanceOf(services.search.containers.SearchResultV1)),
        resultsHeight: PropTypes.number,
        resultsListStyle: PropTypes.object,
        showCancel: PropTypes.bool,
        style: PropTypes.object,
        teams: PropTypes.arrayOf(
            PropTypes.instanceOf(services.profile.containers.ProfileV1)
        ),
        teamsNextRequest: PropTypes.instanceOf(soa.ServiceRequestV1),
    }

    static contextTypes = {
        router: PropTypes.shape({
            transitionTo: PropTypes.func.isRequired,
        }).isRequired,
        mixins: PropTypes.object.isRequired,
    }

    static defaultProps = {
        alwaysActive: false,
        focused: false,
        largerDevice: false,
        loading: false,
        onBlur() {},
        onCancel() {},
        onFocus() {},
        showCancel: false,
    }

    state = {
        category: null,
        query: null,
        typing: false,
    }

    currentSearch = null

    classes() {
        return {
            'default': {
                inputContainerStyle: {
                    width: '100%',
                },
                ResultIcon: {
                    style: {
                        height: 40,
                        width: 40,
                    },
                    iconStyle: {
                        height: 30,
                        width: 30,
                    },
                    strokeWidth: 1,
                },
                ListDivider: {
                    style: {
                        backgroundColor: 'rgba(0, 0, 0, .05)',
                        marginLeft: 58,
                    },
                },
                loadingIndicatorContainer: {
                    display: 'flex',
                    justifyContent: 'center',
                },
                loadingIndicator: {
                    display: 'flex',
                    alignSelf: 'center',
                },
                resultsList: {
                    borderRadius: '0px 0px 5px 5px',
                    boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.09)',
                    justifyContent: 'flex-start',
                    opacity: '0.9',
                    overflowY: 'auto',
                    textAlign: 'start',
                    width: '100%',
                    height: '100%',
                },
                resultsListSubHeader: {
                    fontSize: '11px',
                    lineHeight: '20px',
                    paddingTop: 14,
                    paddingLeft: 20,
                    textTransform: 'uppercase',
                    ...fontColors.extraLight,
                    ...fontWeights.semiBold,
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
            },
            'largerDevice-true': {
                AutoComplete: {
                    style: {
                        maxWidth: SEARCH_CONTAINER_WIDTH,
                    },
                },
                resultsList: {
                    maxWidth: SEARCH_CONTAINER_WIDTH,
                    maxHeight: SEARCH_RESULTS_MAX_HEIGHT,
                },
            },
        };
    }

    selectCategory(category) {
        this.setState({category: category});
        this.props.dispatch(clearSearchResults());
        if (category !== null && category !== undefined) {
            this.loadSearchResults(undefined, category);
        }
    }

    handleCategorySelection(category) {
        this.selectCategory(category);
    }

    handleClearCategory() {
        this.selectCategory(null);
    }

    handleCancel() {
        this.selectCategory(null);
        this.setState({query: '', typing: false});
        this.props.onCancel();
    }

    getCategoryNextRequest() {
        const { CategoryV1 } = services.search.containers.search;
        switch(this.state.category) {
        case CategoryV1.PROFILES:
            return this.props.profilesNextRequest;
        case CategoryV1.TEAMS:
            return this.props.teamsNextRequest;
        case CategoryV1.LOCATIONS:
            return this.props.locationsNextRequest;
        }
    }

    getCategoryResults() {
        let results;
        const { CategoryV1 } = services.search.containers.search;
        switch(this.state.category) {
        case CategoryV1.PROFILES:
            results = this.getCategoryResultsProfiles();
            break;
        case CategoryV1.TEAMS:
            results = this.getCategoryResultsTeams();
            break;
        case CategoryV1.LOCATIONS:
            results = this.getCategoryResultsLocations();
            break;
        }
        return results ? results : [];
    }

    getProfileResult(profile) {
        return {
            leftAvatar: <ProfileAvatar profile={profile} />,
            primaryText: profile.full_name,
            secondaryText: `${profile.title} (TODO)`,
            onTouchTap: routes.routeToProfile.bind(null, this.context.router, profile),
        };
    }

    getTeamResult(team) {
        return {
            leftAvatar: <IconContainer IconClass={GroupIcon} is="ResultIcon" />,
            primaryText: team.display_name,
            secondaryText: `${team.child_team_count} Teams, ${team.profile_count} People`,
            onTouchTap: routes.routeToTeam.bind(null, this.context.router, team),
        };
    }

    getLocationResult(location) {
        return {
            leftAvatar: <IconContainer IconClass={OfficeIcon} is="ResultIcon" />,
            primaryText: location.name,
            secondaryText: `${location.city}, ${location.region} (${location.profile_count})`,
            onTouchTap: routes.routeToLocation.bind(null, this.context.router, location),
        };
    }

    getCategoryResultsProfiles() {
        const { profiles } = this.props;
        if (profiles) {
            return profiles.map(profile => this.getProfileResult(profile));
        }
    }

    getCategoryResultsTeams() {
        const { teams } = this.props;
        if (teams) {
            return teams.map(team => this.getTeamResult(team));
        }
    }

    getCategoryResultsLocations() {
        const { locations } = this.props;
        if (locations) {
            return locations.map(location => this.getLocationResult(location));
        }
    }

    getDefaultResults() {
        const { organization } = this.props;
        const { CategoryV1 } = services.search.containers.search;
        const items = [
            {
                onTouchTap: this.handleCategorySelection.bind(this, CategoryV1.PROFILES),
                primaryText: t(`People (${organization.profile_count})`),
            },
            {
                onTouchTap: this.handleCategorySelection.bind(this, CategoryV1.TEAMS),
                primaryText: t(`Teams (${organization.team_count})`),
            },
            {
                onTouchTap: this.handleCategorySelection.bind(this, CategoryV1.LOCATIONS),
                primaryText: t(`Locations (${organization.location_count})`),
            },
        ];
        return items.map((item) => {
            return {
                estimatedHeight: 64,
                innerDivStyle: this.styles().searchResult,
                leftAvatar: <SearchIcon />,
                leftAvatarStyle: this.styles().SearchIcon.style,
                primaryTextStyle: this.styles().searchResultText,
                type: RESULT_TYPES.EXPLORE,
                subheader: 'explore',
                ...item,
            };
        });
    }

    getSearchResultItems(results) {
        return results.map((result) => {
            if (result.profile) {
                return this.getProfileResult(result.profile);
            } else if (result.team) {
                return this.getTeamResult(result.team);
            } else if (result.location) {
                return this.getLocationResult(result.location);
            }
        });
    }

    getSearchResults() {
        // TODO handle loading as well
        const results = this.props.results[this.state.query];
        if (results && results.length) {
            return this.getSearchResultItems(results);
        } else if (!this.props.loading && !this.state.typing) {
            let defaults = this.getDefaultResults();
            defaults.unshift({
                primaryText: t(`No results for "${this.state.query}"!`),
                primaryTextStyle: this.styles().searchResultText,
                disabled: true,
            })
            return defaults;
        } else {
            return [{type: RESULT_TYPES.LOADING}];
        }
    }

    getResults() {
        if (this.props.focused) {
            if (this.state.query) {
                return this.getSearchResults();
            } else if (this.state.category !== null) {
                return this.getCategoryResults();
            } else {
                return this.getDefaultResults();
            }
        }
    }

    explore(category, nextRequest=null) {
        let action;
        const { CategoryV1 } = services.search.containers.search;

        switch(category) {
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
            this.props.dispatch(action(nextRequest));
        }
    }

    getSearchTokens() {
        let token;
        const { CategoryV1 } = services.search.containers.search;

        switch(this.state.category) {
        case CategoryV1.PROFILES:
            token = t('People');
            break;
        case CategoryV1.TEAMS:
            token = t('Teams');
            break;
        case CategoryV1.LOCATIONS:
            token = t('Locations');
            break;
        }
        if (token) {
            return [{value: token}];
        }
    }

    handleInfiniteLoad() {
        const nextRequest = this.getCategoryNextRequest();
        if (nextRequest) {
            this.explore(this.state.category, nextRequest);
        }
    }

    handleChange(event, value) {
        if (this.currentSearch !== null) {
            window.clearTimeout(this.currentSearch);
        }
        this.currentSearch = window.setTimeout(() => {
            this.setState({typing: false});
            this.loadSearchResults(value);
        }, 300);
        this.setState({query: value, typing: true});
    }

    handleBlur(event) {
        this.props.onBlur();
    }

    loadSearchResults(value = this.state.query, category = this.state.category) {
        if ((!value || value === '') && category !== null) {
            this.explore(category);
        } else {
            this.props.dispatch(loadSearchResults(value, category));
        }
    }

    getLoadingIndicator() {
        return (
            <div is="loadingIndicatorContainer" key="loading-indicator">
                <CircularProgress mode="indeterminate" size={0.5} />
            </div>
        );
    }

    renderItem(item, highlighted, style) {
        let element;
        if (item.type === RESULT_TYPES.LOADING) {
            element = this.getLoadingIndicator();
        } else {
            element = (
                <ListItem
                    {...item}
                    onTouchTap={item.onTouchTap}
                    primaryText={item.primaryText}
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
        }
        return element;
    }

    renderLoadingIndicator() {
        // TODO: look into why infinite isn't catching this for us
        if (this.props.loading) {
            return (
                <div is="loadingIndicatorContainer" key="loading-indicator">
                    <CircularProgress mode="indeterminate" size={0.5} />
                </div>
            );
        }
    }

    renderItemInMenu(item, index, addSubHeader) {
        let element;
        if (index !== 0 && !addSubHeader) {
            element = (
                <div key={`item-with-divider-${index}`}>
                    <ListDivider inset={true} is="ListDivider" />
                    {item}
                </div>
            );
        } else if (addSubHeader) {
            element = (
                <div key={`item-with-subheader-${index}`}>
                    <div is="resultsListSubHeader">
                        <span>{item.props.subheader}</span>
                    </div>
                    {item}
                </div>
            );
        } else {
            element = item;
        }

        return element;
    }

    renderMenu(items, value, style) {
        let containerHeight = 0;
        let currentSubHeader = null;
        const elementHeights = [];
        const elements = items.map((item, index) => {
            let addSubHeader = false;
            let height = item.props.estimatedHeight || SEARCH_RESULT_HEIGHT;
            if (item.props.subheader && item.props.subheader !== currentSubHeader) {
                currentSubHeader = item.props.subheader;
                addSubHeader = true;
                height += 34;
            }
            containerHeight += height;
            elementHeights.push(height);
            return this.renderItemInMenu(item, index, addSubHeader);
        });

        const { resultsListStyle, resultsHeight } = this.props;
        if (resultsHeight !== null && resultsHeight !== undefined) {
            containerHeight = resultsHeight;
        } else {
            containerHeight = Math.min(containerHeight, SEARCH_RESULTS_MAX_HEIGHT);
        }
        return (
            <Paper
                key="menu"
                style={{
                    ...style,
                    ...this.styles().resultsList,
                    ...resultsListStyle,
                }}
            >
                <Infinite
                    containerHeight={containerHeight}
                    elementHeight={elementHeights}
                    infiniteLoadBeginBottomOffset={200}
                    isInfiniteLoading={this.props.loading}
                    key="infinite-results"
                    loadingSpinnerDelegate={::this.renderLoadingIndicator()}
                    onInfiniteLoad={::this.handleInfiniteLoad}
                >
                    {elements}
                </Infinite>
            </Paper>
        );
    }

    render() {
        const {
            alwaysActive,
            inputContainerStyle,
            focused,
            onBlur,
            onCancel,
            onFocus,
            showCancel,
            style,
            ...other,
        } = this.props;
        return (
            <div {...other} style={{...this.styles().searchContainer, ...style}}>
                <AutoComplete
                    alwaysActive={alwaysActive}
                    focused={focused}
                    inputContainerStyle={{...this.styles().inputContainerStyle, ...inputContainerStyle}}
                    is="AutoComplete"
                    items={this.getResults()}
                    onBlur={::this.handleBlur}
                    onCancel={::this.handleCancel}
                    onChange={::this.handleChange}
                    onClearToken={::this.handleClearCategory}
                    onFocus={onFocus}
                    placeholderText={t('Search People, Teams & Locations')}
                    renderItem={::this.renderItem}
                    renderMenu={::this.renderMenu}
                    showCancel={showCancel}
                    tokens={this.getSearchTokens()}
                />
            </div>
        );
    }

}

export default Search;
