import { connect } from 'react-redux';
import Immutable from 'immutable';
import Infinite from 'react-infinite';
import keymirror from 'keymirror';
import mui from 'material-ui';
import React, { PropTypes } from 'react';
import { services, soa } from 'protobufs';

import * as exploreActions from '../actions/explore';
import { loadSearchResults, clearSearchResults, viewSearchResult } from '../actions/search';
import moment from '../utils/moment';
import { iconColors, fontColors, fontWeights } from '../constants/styles';
import { retrieveLocations, retrieveProfiles, retrieveTeams } from '../reducers/denormalizations';
import * as routes from '../utils/routes';
import {
    CONTACT_LOCATION,
    SEARCH_RESULT_SOURCE,
    SEARCH_RESULT_TYPE
} from '../constants/trackerProperties';
import * as selectors from '../selectors';
import t from '../utils/gettext';
import tracker from '../utils/tracker';

import AutoComplete from './AutoComplete';
import CSSComponent from './CSSComponent';
import GroupIcon from './GroupIcon';
import IconContainer from './IconContainer';
import MailIcon from './MailIcon';
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
    CONTACT_METHOD: null,
    EXPLORE: null,
    LOADING: null,
    PROFILE: null,
    EXPANDED_PROFILE: null,
    TEAM: null,
    LOCATION: null,
});

export const SEARCH_RESULT_HEIGHT = 72;
export const SEARCH_CONTAINER_WIDTH = 460;
export const SEARCH_RESULTS_MAX_HEIGHT = 420;

const { ContactMethodTypeV1 } = services.profile.containers.ContactMethodV1;

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
        const recentsState = searchState.get('recents');
        const recentIds = recentsState.get('keys').toJS();
        const recents = recentIds.map(id => recentsState.get('values').get(id));
        recents.reverse();
        return {
            loading: (
                profilesLoadingState ||
                teamsLoadingState ||
                locationsLoadingState ||
                searchState.get('loading')
            ),
            results: searchState.get('results').toJS(),
            recents: recents,
            ...cacheState.toJS(),
        };
    }
);

@connect(selector)
class Search extends CSSComponent {

    static propTypes = {
        alwaysActive: PropTypes.bool,
        canExplore: PropTypes.bool,
        defaults: PropTypes.arrayOf(PropTypes.oneOf(
            services.profile.containers.ProfileV1,
            services.organization.containers.TeamV1,
        )),
        defaultsLoadMore: PropTypes.func,
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
        placeholder: PropTypes.string,
        profiles: PropTypes.arrayOf(
            PropTypes.instanceOf(services.profile.containers.ProfileV1)
        ),
        profilesNextRequest: PropTypes.instanceOf(soa.ServiceRequestV1),
        recents: PropTypes.arrayOf(PropTypes.object),
        results: PropTypes.arrayOf(PropTypes.instanceOf(services.search.containers.SearchResultV1)),
        resultsHeight: PropTypes.number,
        resultsListStyle: PropTypes.object,
        searchAttribute: PropTypes.instanceOf(services.search.containers.search.AttributeV1),
        searchAttributeValue: PropTypes.string,
        searchCategory: PropTypes.instanceOf(services.search.containers.search.CategoryV1),
        searchLocation: PropTypes.string.isRequired,
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
        canExplore: true,
        defaultsLoadMore() {},
        focused: false,
        largerDevice: false,
        loading: false,
        onBlur() {},
        onCancel() {},
        onFocus() {},
        placeholder: t('Search People, Teams & Locations'),
        showCancel: false,
    }

    state = {
        category: null,
        query: '',
        typing: false,
    }

    componentWillUnmount() {
        this.props.dispatch(clearSearchResults());
    }

    currentSearch = null

    trackingAttributesForRecentResults = {
        subheader: 'recents',
        source: SEARCH_RESULT_SOURCE.RECENTS,
    }

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
                ActionIcon: {
                    style: {
                        border: 0,
                        height: 40,
                        left: '2px',
                        width: 40,
                    },
                    iconStyle: {
                        height: 30,
                        width: 30,
                    },
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
                    borderRadius: '0px 0px 3px 3px',
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
                statusTextContainer: {
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: 70,
                    paddingBottom: 8,
                },
                statusTextTimestamp: {
                    display: 'flex',
                    flexDirection: 'row',
                    fontSize: '10px',
                    marginTop: '2px',
                    ...fontColors.light,
                },
                statusTextTitle: {
                    fontSize: '10px',
                    lineHeight: '14px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    ...fontWeights.semiBold,
                    ...fontColors.light,
                },
                statusTextValueContainer: {
                    display: 'flex',
                    flexDirection: 'row',
                    marginTop: '2px',
                },
                statusTextValue: {
                    display: 'flex',
                    alignSelf: 'center',
                    fontStyle: 'italic',
                    fontSize: '12px',
                    ...fontColors.dark,
                    lineHeight: '20px',
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

    trackTouchTap(item) {
        const onTouchTap = item.onTouchTap;
        item.onTouchTap = () => {
            const trackItem = Object.assign({}, item);

            // Don't expand tracked results
            if (trackItem.type === RESULT_TYPES.EXPANDED_PROFILE) {
                trackItem.type = RESULT_TYPES.PROFILE;
            }
            this.props.dispatch(viewSearchResult(trackItem));

            // Call click handler and record tap in analytics provider
            if (onTouchTap && typeof onTouchTap === 'function') {
                let trackingSource = this.getTrackingSource(trackItem);
                let trackingResultType = this.getTrackingResultType(trackItem);
                tracker.trackSearchResultTap(
                    this.state.query,
                    trackingSource,
                    trackingResultType,
                    // 1 to account for array index
                    trackItem.index + 1,
                    this.props.searchLocation,
                    trackItem.instance.id ? trackItem.instance.id : '',
                    this.getCurrentSearchCategory(),
                    this.props.searchAttribute,
                    this.props.searchAttributeValue,
                );
                onTouchTap();
            }
        }
        return item;
    }

    getCurrentSearchCategory() {
        let { searchCategory } = this.props;
        if (searchCategory !== null && searchCategory !== undefined) {
            return searchCategory;
        } else if (this.state.category !== null) {
            return this.state.category;
        }

        return undefined;
    }

    getTrackingSource(item) {
        if (item.source && item.source !== null) {
            return item.source;
        }

        // If a query term exists, then its a suggestion otherwise it is explore
        if (this.state.query !== null && this.state.query !== undefined && this.state.query.trim() !== '') {
            return SEARCH_RESULT_SOURCE.SUGGESTION;
        }

        return SEARCH_RESULT_SOURCE.EXPLORE;
    }

    getTrackingResultType(item) {
        switch (item.type) {
            case RESULT_TYPES.EXPANDED_PROFILE:
            case RESULT_TYPES.PROFILE:
                return SEARCH_RESULT_TYPE.PROFILE;

            case RESULT_TYPES.TEAM:
                return SEARCH_RESULT_TYPE.TEAM;

            case RESULT_TYPES.LOCATION:
                return SEARCH_RESULT_TYPE.LOCATION;

            default:
                console.error('Did not find analytics tracking type for selected RESULT_TYPE');
                return undefined;
        }
    }

    getProfileResult(profile, index, isRecent, numberOfResults) {
        let trackingAttributes = isRecent ? this.trackingAttributesForRecentResults : {};
        const item = {
            index: index,
            leftAvatar: <ProfileAvatar profile={profile} />,
            primaryText: profile.full_name,
            secondaryText: `${profile.title}`,
            onTouchTap: routes.routeToProfile.bind(null, this.context.router, profile),
            type: numberOfResults === 1 ? RESULT_TYPES.EXPANDED_PROFILE : RESULT_TYPES.PROFILE,
            instance: profile,
            ...trackingAttributes,
        };
        return this.trackTouchTap(item);
    }

    getTeamResult(team, index, isRecent) {
        let subTextParts = [];
        if (team.child_team_count > 1) {
            subTextParts.push(`${team.child_team_count} Teams`);
        } else if (team.child_team_count === 1) {
            subTextParts.push(`${team.child_team_count} Team`);
        }

        if (team.profile_count > 1) {
            subTextParts.push(`${team.profile_count} People`);
        } else if (team.profile_count === 1) {
            subTextParts.push(`${team.profile_count} Person`);
        }

        let trackingAttributes = isRecent ? this.trackingAttributesForRecentResults : {};
        const item = {
            index: index,
            leftAvatar: <IconContainer IconClass={GroupIcon} is="ResultIcon" />,
            primaryText: team.display_name,
            secondaryText: subTextParts.join(', '),
            onTouchTap: routes.routeToTeam.bind(null, this.context.router, team),
            type: RESULT_TYPES.TEAM,
            instance: team,
            ...trackingAttributes
        };
        return this.trackTouchTap(item);
    }

    getLocationResult(location, index, isRecent) {
        let trackingAttributes = isRecent ? this.attributesForRecentResults : {};
        const item = {
            index: index,
            leftAvatar: <IconContainer IconClass={OfficeIcon} is="ResultIcon" />,
            primaryText: location.name,
            secondaryText: `${location.city}, ${location.region} (${location.profile_count})`,
            onTouchTap: routes.routeToLocation.bind(null, this.context.router, location),
            type: RESULT_TYPES.LOCATION,
            instance: location,
            ...trackingAttributes
        };
        return this.trackTouchTap(item);
    }

    getCategoryResultsProfiles() {
        const { profiles } = this.props;
        if (profiles) {
            return profiles.map((profile, index) => this.getProfileResult(profile, index));
        }
    }

    getCategoryResultsTeams() {
        const { teams } = this.props;
        if (teams) {
            return teams.map((team, index) => this.getTeamResult(team, index));
        }
    }

    getCategoryResultsLocations() {
        const { locations } = this.props;
        if (locations) {
            return locations.map((location, index) => this.getLocationResult(location, index));
        }
    }

    resolveDefaults() {
        const { defaults } = this.props;
        return defaults.map((item, index) => {
            if (item instanceof services.profile.containers.ProfileV1) {
                return this.getProfileResult(item, index);
            } else if (item instanceof services.organization.containers.TeamV1) {
                return this.getTeamResult(item, index);
            }
        });
    }

    getRecentResults() {
        return this.props.recents.slice(0, 3).map((searchResultItem, index) => {
            let item = searchResultItem.instance;

            if (item instanceof services.profile.containers.ProfileV1) {
                return this.getProfileResult(item, index, true);
            } else if (item instanceof services.organization.containers.TeamV1) {
                return this.getTeamResult(item, index, true);
            } else if (item instanceof services.organization.containers.LocationV1) {
                return this.getLocationResult(item, index, true);
            }
        });
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
        const recents = this.getRecentResults();
        const exploreResults = items.map((item) => {
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
        return recents.concat(exploreResults);
    }

    expandProfile(profile) {
        const expansions = [];
        expansions.push({
            estimatedHeight: 64,
            type: RESULT_TYPES.CONTACT_METHOD,
            leftAvatar: <IconContainer IconClass={MailIcon} is="ActionIcon" stroke="rgba(0, 0, 0, 0.4)" />,
            primaryText: t(`Email ${profile.first_name}`),
            primaryTextStyle: {
                fontSize: '12px',
                lineHeight: '17px',
                ...fontColors.dark,
            },
            innerDivStyle: {
                paddingLeft: 40,
            },
            style: {
                paddingLeft: 58,
            },
            onTouchTap: () => {
                tracker.trackContactTap(
                    ContactMethodTypeV1.EMAIL,
                    profile.id,
                    CONTACT_LOCATION.SEARCH_SMART_ACTION
                );

                window.location.href = `mailto:${profile.email}`;
            },
        });
        return expansions;
    }

    getExpandedResults(item, result) {
        const expandedResults = [item];
        if (result.profile) {
            const expansions = this.expandProfile(result.profile);
            if (expansions) {
                expandedResults.push(...expansions);
            }
        }
        return expandedResults;
    }

    getSearchResultItems(results) {
        let items = results.map((result, index) => {
            if (result.profile) {
                return this.getProfileResult(result.profile, index, false, results.length);
            } else if (result.team) {
                return this.getTeamResult(result.team, index, false, results.length);
            } else if (result.location) {
                return this.getLocationResult(result.location, index, false, results.length);
            }
        });
        if (results.length === 1) {
            items = this.getExpandedResults(items[0], results[0]);
        }
        return items;
    }

    getSearchResults() {
        // TODO handle loading as well
        const results = this.props.results[this.state.query];
        if (results && results.length) {
            return this.getSearchResultItems(results);
        } else if (!this.props.loading && !this.state.typing) {
            const noResults = [{
                primaryText: t(`No results for "${this.state.query}"!`),
                primaryTextStyle: this.styles().searchResultText,
                disabled: true,
            }];
            if (this.props.canExplore) {
                noResults.push(this.getDefaultResults());
            }
            return noResults;
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
            } else if (this.props.defaults) {
                return this.resolveDefaults(this.props.defaults);
            } else if (this.props.recents && !this.props.canExplore) {
                return this.getRecentResults();
            } else if (this.props.canExplore) {
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
        } else if (this.props.defaults && this.props.defaults.length) {
            this.props.defaultsLoadMore();
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
        if (!this.props.canExplore) {
            this.setState({query: ''});
            this.props.dispatch(clearSearchResults());
            this.props.onBlur();
        }
    }

    handleSelection(event, item) {
        if (!this.props.canExplore) {
            this.setState({query: ''});
            this.props.dispatch(clearSearchResults());
            this.props.onBlur();
        }
    }

    loadSearchResults(value = this.state.query, category = this.state.category) {
        if ((!value || value === '') && category !== null && this.props.canExplore) {
            this.explore(category);
        } else {
            let { searchCategory } = this.props;
            if (searchCategory === null || searchCategory === undefined) {
                searchCategory = category;
            }
            const parameters = [
                value,
                searchCategory,
                this.props.searchAttribute,
                this.props.searchAttributeValue,
            ]
            this.props.dispatch(loadSearchResults(...parameters));
        }
    }

    getLoadingIndicator() {
        return (
            <div is="loadingIndicatorContainer" key="loading-indicator">
                <CircularProgress mode="indeterminate" size={0.5} />
            </div>
        );
    }

    renderDefaultResult(item, highlighted, style) {
        return (
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

    renderExpandedProfile(item, highlighted, style) {
        const defaultResult = this.renderDefaultResult(item, highlighted, style);
        return (
            <div estimatedHeight={SEARCH_RESULT_HEIGHT + 42}>
                {defaultResult}
                {(() => {
                    const { status } = item.instance;
                    if (status && status.value.trim() !== '') {
                        const created = moment(status.created).fromNow()
                        return (
                            <div is="statusTextContainer">
                                <span is="statusTextTitle">
                                    {t('Currently Working On')}
                                </span>
                                <div is="statusTextValueContainer">
                                    <span is="statusTextValue">
                                        {`"${status.value}"`}
                                    </span>
                                </div>
                                <div is="statusTextTimestamp">
                                    &nbsp;&mdash;&nbsp;{created}
                                </div>
                            </div>
                        );
                    }
                })()}
            </div>
        )
    }

    renderItem(item, highlighted, style) {
        let element;
        switch(item.type) {
        case RESULT_TYPES.LOADING:
            element = this.getLoadingIndicator();
            break;
        case RESULT_TYPES.EXPANDED_PROFILE:
            element = this.renderExpandedProfile(item, highlighted, style);
            break;
        default:
            element = this.renderDefaultResult(item, highlighted, style);
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
            canExplore,
            inputContainerStyle,
            focused,
            onBlur,
            onCancel,
            onFocus,
            placeholder,
            showCancel,
            style,
            ...other,
        } = this.props;
        return (
            <div {...other} style={{...this.styles().searchContainer, ...style}}>
                <AutoComplete
                    alwaysActive={alwaysActive}
                    clearValueOnSelection={!canExplore}
                    focusOnSelect={canExplore}
                    focused={focused}
                    inputContainerStyle={{...this.styles().inputContainerStyle, ...inputContainerStyle}}
                    is="AutoComplete"
                    items={this.getResults()}
                    onBlur={::this.handleBlur}
                    onCancel={::this.handleCancel}
                    onChange={::this.handleChange}
                    onClearToken={::this.handleClearCategory}
                    onFocus={onFocus}
                    onSelect={::this.handleSelection}
                    placeholderText={placeholder}
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
