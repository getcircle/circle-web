import { connect } from 'react-redux';
import Immutable from 'immutable';
import Infinite from 'react-infinite';
import keymirror from 'keymirror';
import mui from 'material-ui';
import React, { PropTypes } from 'react';
import { services, soa } from 'protobufs';

import * as exploreActions from '../actions/explore';
import CurrentTheme from '../utils/ThemeManager';
import {
    loadSearchResults,
    clearSearchResults,
    noSearchResults,
    viewSearchResult,
} from '../actions/search';
import { mailto } from '../utils/contact';
import {
    iconColors,
    fontColors,
    fontFamily,
    fontWeights,
    tintColor,
} from '../constants/styles';
import {
    retrieveLocations,
    retrievePosts,
    retrieveProfiles,
    retrieveTeams,
} from '../reducers/denormalizations';
import * as routes from '../utils/routes';
import {
    CONTACT_LOCATION,
    SEARCH_RESULT_SOURCE,
    SEARCH_RESULT_TYPE
} from '../constants/trackerProperties';
import * as selectors from '../selectors';
import moment from '../utils/moment';
import t from '../utils/gettext';
import tracker from '../utils/tracker';
import { trimNewLinesAndWhitespace } from '../utils/string';

import AutoComplete from './AutoComplete';
import CSSComponent from './CSSComponent';
import GroupIcon from './GroupIcon';
import IconContainer from './IconContainer';
import InternalPropTypes from './InternalPropTypes';
import LightBulbIcon from './LightBulbIcon';
import MailIcon from './MailIcon';
import OfficeIcon from './OfficeIcon';
import ProfileAvatar from './ProfileAvatar';
import SearchIcon from './SearchIcon';

const {
    CircularProgress,
    Dialog,
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
    POST: null,
    SEARCH_TRIGGER: null,
});

export const EXPLORE_SEARCH_RESULT_HEIGHT = 64;
export const SEARCH_RESULT_HEIGHT = 72;
export const SEARCH_CONTAINER_WIDTH = 800;
export const SEARCH_RESULTS_MAX_HEIGHT = 620;
const POST_CONTENT_CHAR_LIMIT = 70;

const { ContactMethodTypeV1 } = services.profile.containers.ContactMethodV1;

const cacheSelector = selectors.createImmutableSelector(
    [
        selectors.cacheSelector,
        selectors.exploreProfilesIdsSelector,
        selectors.exploreTeamsIdsSelector,
        selectors.exploreLocationsIdsSelector,
        selectors.explorePostsIdsSelector,
    ],
    (cacheState, profilesState, teamsState, locationsState, postsState) => {
        let profiles, profilesNextRequest, teams, teamsNextRequest, locations, locationsNextRequest;
        let posts, postsNextRequest;
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

        if (postsState) {
            const ids = postsState.get('ids').toJS();
            if (ids.length) {
                posts = retrievePosts(ids, cache);
            }
            postsNextRequest = postsState.get('nextRequest');
        }

        return Immutable.fromJS({
            locations,
            locationsNextRequest,
            posts,
            postsNextRequest,
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
        selectors.explorePostsLoadingSelector,
        selectors.searchSelector,
    ],
    (
        cacheState,
        profilesLoadingState,
        teamsLoadingState,
        locationsLoadingState,
        postsLoadingState,
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
                postsLoadingState ||
                searchState.get('loading')
            ),
            results: searchState.get('results').toJS(),
            recents: recents,
            ...cacheState.toJS(),
        };
    }
);

@connect(selector, undefined, undefined, {withRef: true})
class Search extends CSSComponent {

    static propTypes = {
        alwaysActive: PropTypes.bool,
        autoCompleteStyle: PropTypes.object,
        canExplore: PropTypes.bool,
        defaults: PropTypes.arrayOf(PropTypes.oneOfType([
            services.profile.containers.ProfileV1,
            services.organization.containers.TeamV1,
        ])),
        defaultsLoadMore: PropTypes.func,
        dispatch: PropTypes.func.isRequired,
        focused: PropTypes.bool,
        inputContainerStyle: PropTypes.object,
        limitResultsListHeight: PropTypes.bool,
        loading: PropTypes.bool,
        locations: PropTypes.arrayOf(
            PropTypes.instanceOf(services.organization.containers.LocationV1)
        ),
        locationsNextRequest: PropTypes.instanceOf(soa.ServiceRequestV1),
        onBlur: PropTypes.func,
        onCancel: PropTypes.func,
        onFocus: PropTypes.func,
        onSelectItem: PropTypes.func,
        placeholder: PropTypes.string,
        posts: PropTypes.arrayOf(
            PropTypes.instanceOf(services.post.containers.PostV1)
        ),
        postsNextRequest: PropTypes.instanceOf(soa.ServiceRequestV1),
        processResults: PropTypes.bool,
        profiles: PropTypes.arrayOf(
            PropTypes.instanceOf(services.profile.containers.ProfileV1)
        ),
        profilesNextRequest: PropTypes.instanceOf(soa.ServiceRequestV1),
        query: PropTypes.string,
        recents: PropTypes.arrayOf(PropTypes.object),
        results: PropTypes.object,
        resultsHeight: PropTypes.number,
        resultsListStyle: PropTypes.object,
        searchAttribute: PropTypes.instanceOf(services.search.containers.search.AttributeV1),
        searchAttributeValue: PropTypes.string,
        searchCategory: PropTypes.instanceOf(services.search.containers.search.CategoryV1),
        searchContainerWidth: PropTypes.number,
        searchLocation: PropTypes.string.isRequired,
        showCancel: PropTypes.bool,
        showExpandedResults: PropTypes.bool,
        showRecents: PropTypes.bool,
        style: PropTypes.object,
        teams: PropTypes.arrayOf(
            PropTypes.instanceOf(services.organization.containers.TeamV1)
        ),
        teamsNextRequest: PropTypes.instanceOf(soa.ServiceRequestV1),
        useDefaultClickHandlers: PropTypes.bool,
    }

    static contextTypes = {
        auth: InternalPropTypes.AuthContext.isRequired,
        device: InternalPropTypes.DeviceContext.isRequired,
        history: PropTypes.shape({
            pushState: PropTypes.func.isRequired,
        }).isRequired,
        mixins: PropTypes.object.isRequired,
    }

    static childContextTypes = {
        muiTheme: PropTypes.object,
    }

    static defaultProps = {
        alwaysActive: false,
        canExplore: true,
        defaultsLoadMore() {},
        focused: false,
        limitResultsListHeight: true,
        loading: false,
        onBlur() {},
        onCancel() {},
        onFocus() {},
        onSelectItem() {},
        placeholder: t('Search knowledge, people, & teams'),
        // This isn't good component design and there are ways to achieve
        // hiding of results (by simply hiding the container).
        // But, the logic to process results has a big performance cost.
        // Given our full search temporarily uses the same component as AutoComplete,
        // adding this property allows us to bypass all the processing.
        processResults: true,
        query: null,
        // This controls whether a cleanup is called on blur
        // and whether search results should be hidden on blur
        retainResultsOnBlur: false,
        searchContainerWidth: SEARCH_CONTAINER_WIDTH,
        showCancel: false,
        showExpandedResults: true,
        showRecents: true,
        useDefaultClickHandlers: true,
    }

    state = {
        category: null,
        feedbackDialogOpen: false,
        infoRequest: '',
        muiTheme: CurrentTheme,
        query: '',
        typing: false,
    }

    getChildContext() {
        return {
            muiTheme: this.state.muiTheme,
        };
    }

    componentWillMount() {
        this.customizeTheme();
        this.setQuery(this.props);
    }

    componentWillReceiveProps(nextProps) {
        // Resets tracked bit for new searches
        this.checkAndResetSearchTracked(this.state.query);
        this.customizeTheme();
        this.setQuery(nextProps);
    }

    componentWillUnmount() {
        this.props.dispatch(clearSearchResults());
    }

    customizeTheme() {
        let customTheme = mui.Styles.ThemeManager.modifyRawThemePalette(
            CurrentTheme,
            {
                canvasColor: '#ffffff',
            },
        );
        this.setState({muiTheme: customTheme});
    }

    currentSearchTimeout = null
    searchTracked = false
    numberOfRealResults = 0

    trackingAttributesForRecentResults = {
        subheader: 'recents',
        source: SEARCH_RESULT_SOURCE.RECENTS,
    }

    setQuery(props) {
        // See if a query parameter was explicitly passed in.
        // If yes, set it in the internal state
        if (props.query !== null && props.query.trim().length > 0) {
            this.setValue(this.props.query);
        }
    }

    styles() {
        return this.css({
            'largerDevice': this.context.device.largerDevice,
        });
    }

    classes() {
        return {
            'default': {
                Dialog: {
                    contentStyle: {
                        maxWidth: 480,
                    },
                },
                dialogTextArea: {
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: 2,
                    fontFamily: fontFamily,
                    fontSize: '15px',
                    height: 150,
                    outline: 'none',
                    padding: 10,
                    resize: 'none',
                    width: '100%',
                },
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
                ListItem: {
                    style: {
                        textAlign: 'left',
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
                requestInfo: {
                    marginTop: 16,
                },
                requestInfoLabel: {
                    color: tintColor,
                    cursor: 'pointer',
                    paddingLeft: 5,
                    fontSize: 12,
                },
                requestInfoLabelPrimary: {
                    paddingLeft: 18,
                },
                resultsList: {
                    borderRadius: '0px 0px 3px 3px',
                    boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.09)',
                    justifyContent: 'flex-start',
                    opacity: '0.9',
                    overflowY: 'hidden',
                    textAlign: 'start',
                    width: '100%',
                    height: 'auto',
                },
                resultsListSubHeader: {
                    fontSize: '11px',
                    lineHeight: '20px',
                    paddingTop: 14,
                    paddingLeft: 20,
                    textAlign: 'left',
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
                searchTerm: {
                    fontWeight: 600,
                },
                postTextResultText: {
                    lineHeight: '22px',
                },
                postSecondaryTextContainer: {
                    lineHeight: '18px',
                },
                postSecondaryText: {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                },
                postLastEdited: {
                    fontSize: '12px',
                },
            },
            'largerDevice': {
                autoComplete: {
                    maxWidth: this.props.searchContainerWidth,
                },
                resultsList: {
                    width: this.props.searchContainerWidth,
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

    checkAndResetSearchTracked(value) {
        if (value.length === 0) {
            this.searchTracked = false;
        }
    }

    trackSearch(value) {
        if (value.length > 1 && this.searchTracked === false) {
            this.searchTracked = true;
            tracker.trackSearchStart(
                value,
                this.props.searchLocation,
                this.getCurrentSearchCategory(),
                this.props.searchAttribute,
                this.props.searchAttributeValue,
            );
        }
    }

    getCurrentQuery() {
        return this.state.query;
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
        case CategoryV1.POSTS:
            return this.props.postsNextRequest;
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
        case CategoryV1.POSTS:
            results = this.getCategoryResultsPosts();
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
            this.props.onSelectItem(item);

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

                if (this.props.useDefaultClickHandlers) {
                    onTouchTap();
                }
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

            case RESULT_TYPES.POST:
                return SEARCH_RESULT_TYPE.POST;

            default:
                console.error('Did not find analytics tracking type for selected RESULT_TYPE');
                return undefined;
        }
    }

    getProfileTexts(profile, highlight) {
        const texts = {
            primaryText: profile.full_name,
            secondaryText: profile.display_title,
        };

        if (highlight && highlight.get('full_name')) {
            texts.primaryText = (<div
                dangerouslySetInnerHTML={{__html: highlight.get('full_name')}} />);
        }

        if (highlight && highlight.get('display_title')) {
            texts.secondaryText = (<span
                dangerouslySetInnerHTML={{__html: highlight.get('display_title')}} />);
        }

        return texts;
    }

    getProfileResult(profile, index, isRecent, numberOfResults, highlight) {
        let trackingAttributes = isRecent ? this.trackingAttributesForRecentResults : {};

        const profileTexts = this.getProfileTexts(profile, highlight);
        const item = {
            index: index,
            leftAvatar: <ProfileAvatar profile={profile} />,
            primaryText: profileTexts.primaryText,
            secondaryText: profileTexts.secondaryText,
            onTouchTap: routes.routeToProfile.bind(null, this.context.history, profile),
            type: numberOfResults === 1 ? RESULT_TYPES.EXPANDED_PROFILE : RESULT_TYPES.PROFILE,
            instance: profile,
            ...trackingAttributes,
        };
        return this.trackTouchTap(item);
    }

    getTeamPrimaryText(team, highlight) {
        if (highlight && highlight.get('display_name')) {
            return (<div dangerouslySetInnerHTML={{__html: highlight.get('display_name')}} />);
        }

        return team.display_name;
    }

    getTeamResult(team, index, isRecent, highlight) {
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
        const teamPrimaryText = this.getTeamPrimaryText(team, highlight);
        const item = {
            index: index,
            leftAvatar: <IconContainer IconClass={GroupIcon} {...this.styles().ResultIcon} />,
            primaryText: teamPrimaryText,
            secondaryText: subTextParts.join(', '),
            onTouchTap: routes.routeToTeam.bind(null, this.context.history, team),
            type: RESULT_TYPES.TEAM,
            instance: team,
            ...trackingAttributes
        };
        return this.trackTouchTap(item);
    }

    getLocationTexts(location, highlight) {
        const texts = {
            primaryText: location.name,
            secondaryText: `${location.city}, ${location.region} (${location.profile_count})`,
        };

        if (highlight && highlight.get('name')) {
            texts.primaryText = (<div
                dangerouslySetInnerHTML={{__html: highlight.get('name')}} />);
        }

        if (highlight && highlight.get('full_address')) {
            texts.secondaryText = (<span
                dangerouslySetInnerHTML={{__html: highlight.get('full_address') + ' (' + location.profile_count + ')'}} />);
        }

        return texts;
    }

    getLocationResult(location, index, isRecent, highlight) {
        let trackingAttributes = isRecent ? this.trackingAttributesForRecentResults : {};
        const locationTexts = this.getLocationTexts(location, highlight);
        const item = {
            index: index,
            leftAvatar: <IconContainer IconClass={OfficeIcon} {...this.styles().ResultIcon} />,
            primaryText: locationTexts.primaryText,
            secondaryText: locationTexts.secondaryText,
            onTouchTap: routes.routeToLocation.bind(null, this.context.history, location),
            type: RESULT_TYPES.LOCATION,
            instance: location,
            ...trackingAttributes
        };
        return this.trackTouchTap(item);
    }

    getPostTexts(post, highlight) {
        const lastEditedText = `${t('Last edited')} ${moment(post.changed).fromNow()}`;
        const defaultSecondaryText = (
            <span style={this.styles().postSecondaryTextContainer}>
                <span
                    key="matched-content"
                    style={this.styles().postSecondaryText}
                >
                    {trimNewLinesAndWhitespace(post.content).substr(0, POST_CONTENT_CHAR_LIMIT) + (post.content.length > POST_CONTENT_CHAR_LIMIT ? `\u2026` : '')}
                </span>
                <br key="line-break" />
                <span key="last-edited" style={this.styles().postLastEdited}>{lastEditedText}</span>
            </span>
        );

        const texts = {
            primaryText: this.getPrimaryTextContainer(
                post.title,
                this.styles().postTextResultText
            ),
            secondaryText: defaultSecondaryText,
        };

        if (highlight && highlight.get('title')) {
            texts.primaryText = (<div
                dangerouslySetInnerHTML={{__html: highlight.get('title')}}
                style={this.styles().postTextResultText}
            />);
        }

        if (highlight && highlight.get('content')) {
            let highlightedContent = trimNewLinesAndWhitespace(highlight.get('content'));
            const startsWithCapitalLetter = 'A'.charCodeAt(0) <= highlightedContent.charCodeAt(0) && highlightedContent.charCodeAt(0) <= 'Z'.charCodeAt(0);
            if (!startsWithCapitalLetter) {
                highlightedContent = `\u2026${highlightedContent}`;
            }
            const secondaryText = (
                <span style={this.styles().postSecondaryTextContainer}>
                    <span
                        dangerouslySetInnerHTML={{__html: `${highlightedContent}\u2026`}}
                        key="matched-content"
                        style={this.styles().postSecondaryText}
                    />
                    <br key="line-break" />
                    <span key="last-edited" style={this.styles().postLastEdited}>{lastEditedText}</span>
                </span>
            );
            texts.secondaryText = secondaryText;
        }

        return texts;
    }

    getPostResult(post, index, isRecent, highlight) {
        const trackingAttributes = isRecent ? this.trackingAttributesForRecentResults : {};
        const numberOfCharacters = post.title ? post.title.length : 0;
        const estNumberOfLines = Math.floor(numberOfCharacters/44) + 2; // 1 for author and 1 for correct math
        const estimatedHeight = estNumberOfLines*22 + 18 /* for two secondary lines */ + 36 /* top & bottom padding */;
        const postTexts = this.getPostTexts(post, highlight);
        const item = {
            estimatedHeight: estimatedHeight,
            index: index,
            leftAvatar: <IconContainer IconClass={LightBulbIcon} stroke="#7c7b7b" {...this.styles().ResultIcon}/>,
            primaryText: postTexts.primaryText,
            secondaryText: postTexts.secondaryText,
            secondaryTextLines: 2,
            onTouchTap: routes.routeToPost.bind(null, this.context.history, post),
            type: RESULT_TYPES.POST,
            instance: post,
            ...trackingAttributes
        };
        return this.trackTouchTap(item);
    }

    getSearchTriggerResult() {
        const item = {
            estimatedHeight: EXPLORE_SEARCH_RESULT_HEIGHT,
            type: RESULT_TYPES.SEARCH_TRIGGER,
        };
        return item;
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

    getCategoryResultsPosts() {
        const { posts } = this.props;
        if (posts) {
            return posts.map((post, index) => this.getPostResult(post, index));
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
            } else if (item instanceof services.post.containers.PostV1) {
                return this.getPostResult(item, index, true);
            }
        });
    }

    getPrimaryTextContainer(text, style) {
        return <span style={{...style}}>{text}</span>;
    }

    getDefaultResults() {
        const { organization } = this.context.auth;
        const { CategoryV1 } = services.search.containers.search;
        const items = [
            {
                onTouchTap: this.handleCategorySelection.bind(this, CategoryV1.POSTS),
                primaryText: this.getPrimaryTextContainer(
                    t(`Knowledge (${organization.post_count})`),
                    this.styles().searchResultText
                ),
            },
            {
                onTouchTap: this.handleCategorySelection.bind(this, CategoryV1.PROFILES),
                primaryText: this.getPrimaryTextContainer(
                    t(`People (${organization.profile_count})`),
                    this.styles().searchResultText
                ),
            },
            {
                onTouchTap: this.handleCategorySelection.bind(this, CategoryV1.TEAMS),
                primaryText: this.getPrimaryTextContainer(
                    t(`Teams (${organization.team_count})`),
                    this.styles().searchResultText
                ),
            },
            {
                onTouchTap: this.handleCategorySelection.bind(this, CategoryV1.LOCATIONS),
                primaryText: this.getPrimaryTextContainer(
                    t(`Locations (${organization.location_count})`),
                    this.styles().searchResultText
                ),
            },
        ];
        const recents = this.getRecentResults();
        const exploreResults = items.map((item) => {
            return {
                estimatedHeight: EXPLORE_SEARCH_RESULT_HEIGHT,
                innerDivStyle: this.styles().searchResult,
                leftAvatar: <SearchIcon {...this.styles().SearchIcon} />,
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
            estimatedHeight: EXPLORE_SEARCH_RESULT_HEIGHT,
            type: RESULT_TYPES.CONTACT_METHOD,
            leftAvatar: <IconContainer IconClass={MailIcon} stroke="rgba(0, 0, 0, 0.4)" {...this.styles().ActionIcon} />,
            primaryText: this.getPrimaryTextContainer(
                t(`Email ${profile.first_name}`), {
                    fontSize: '12px',
                    lineHeight: '17px',
                    ...fontColors.dark,
                }
            ),
            innerDivStyle: {
                paddingLeft: 40,
                marginLeft: 58,
            },
            href: mailto(profile.email),
            target: '_blank',
            onTouchTap: () => {
                tracker.trackContactTap(
                    ContactMethodTypeV1.EMAIL,
                    profile,
                    CONTACT_LOCATION.SEARCH_SMART_ACTION
                );
                tracker.trackSearchResultTap(
                    this.state.query,
                    SEARCH_RESULT_SOURCE.SMART_ACTION,
                    SEARCH_RESULT_TYPE.EMAIL_PROFILE,
                    1,
                    this.props.searchLocation,
                    profile.id,
                    this.getCurrentSearchCategory(),
                    this.props.searchAttribute,
                    this.props.searchAttributeValue,
                );
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
        let items = [];
        if (this.shouldShowFullSearchTrigger()) {
            items.push(this.getSearchTriggerResult());
        }

        results.map((result, index) => {
            let searchResult = null;
            if (result.profile) {
                searchResult = this.getProfileResult(result.profile, index, false, results.length, result.highlight);
            } else if (result.team) {
                searchResult = this.getTeamResult(result.team, index, false, result.highlight);
            } else if (result.location) {
                searchResult = this.getLocationResult(result.location, index, false, result.highlight);
            } else if (result.post) {
                searchResult = this.getPostResult(result.post, index, false, result.highlight);
            }

            searchResult.score = result.score;
            items.push(searchResult);
            return searchResult;
        });

        if (results.length === 1 && this.props.showExpandedResults) {
            items = this.getExpandedResults(items[0], results[0]);
        }
        return items;
    }

    /**
     * Returns the search results to be displayed.
     *
     * The component gets passed in a cache of search results that came from the server
     * with their associated query strings as keys. For each keystroke, we first look for
     * results that are for the exact query. If not, we go back one character at a time
     * and return the results of the previously fetch queries.
     *
     * @returns {Array}|{Void} array of result items if we find any
     */
    getSearchResults() {
        const { results } = this.props;
        const querySpecificResults = results[this.state.query];
        this.numberOfRealResults = 0;

        // First check if we have actual results
        if (querySpecificResults && querySpecificResults.length) {
            this.numberOfRealResults = querySpecificResults.length;
            return this.getSearchResultItems(querySpecificResults);
        }

        // Show no results view only when
        // - no server call is in progress
        // - user is not typing
        // - server responded with no search results
        if (!this.props.loading && !this.state.typing && results.hasOwnProperty(this.state.query) === true) {
            const noResults = [{
                disabled: true,
                estimatedHeight: 84,
                primaryText: this.getPrimaryTextContainer(
                    t(`No results for "${this.state.query}"!`),
                    this.styles().searchResultText
                ),
                secondaryText: (
                    <div style={{...this.styles().requestInfo}}>
                        <span style={this.styles().requestInfoLabelPrimary}>
                            {t('Can\'t find what you\'re looking for?')}
                        </span>
                        <span
                            onTouchTap={() => this.setState({feedbackDialogOpen: true})}
                            style={this.styles().requestInfoLabel}
                        >
                            {t('Request missing info')}
                        </span>
                    </div>
                ),
            }];
            if (this.props.canExplore) {
                noResults.push(...this.getDefaultResults());
            }
            return noResults;
        }

        // See if we can find any previous search results
        // - 1 to account for existing query
        let i = this.state.query.length - 1;
        while (i > 0) {
            let previousResults = results[this.state.query.substr(0, i)];
            if (previousResults && previousResults.length) {
                this.numberOfRealResults = previousResults.length;
                return this.getSearchResultItems(previousResults);
            }

            i--;
        }
    }

    getResults() {
        if (this.props.processResults && (this.props.focused || this.props.retainResultsOnBlur)) {
            if (this.state.query) {
                return this.getSearchResults();
            } else if (this.state.category !== null) {
                return this.getCategoryResults();
            } else if (this.props.defaults) {
                return this.resolveDefaults(this.props.defaults);
            } else if (this.props.recents && !this.props.canExplore && this.props.showRecents) {
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
        case CategoryV1.POSTS:
            action = exploreActions.explorePosts;
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
        case CategoryV1.POSTS:
            token = t('Knowledge');
            break;
        }
        if (token) {
            return [{value: token}];
        }
    }

    cleanup(forced) {
        if (forced === true || !this.props.retainResultsOnBlur) {
            this.setState({query: ''});
            this.props.dispatch(clearSearchResults());
            this.props.onBlur();
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
        if (event.target === null) {
            return;
        }

        let query = event.target.value;
        if (this.currentSearchTimeout !== null) {
            window.clearTimeout(this.currentSearchTimeout);
        }

        // Resets tracked bit when hitting backspace
        this.checkAndResetSearchTracked(query);
        this.trackSearch(query);

        this.currentSearchTimeout = window.setTimeout(() => {
            this.setState({typing: false});
            this.loadSearchResults(query);
        }, 200);

        this.setState({query: query, typing: true});
    }

    handleBlur(event) {
        if (!this.props.canExplore) {
            this.cleanup();
        }
    }

    handleDialogSubmit() {
        this.props.dispatch(
            noSearchResults(this.state.query, this.state.infoRequest)
        );
        this.setState({
            feedbackDialogOpen: false,
        });
    }

    handleDialogCancel() {
        this.setState({
            feedbackDialogOpen: false,
        });
    }

    handleEnter() {
        if (this.shouldShowFullSearchTrigger()) {
            routes.routeToSearch(this.context.history, this.state.query);
        }
    }

    handleSelection(item) {
        if (!this.props.canExplore) {
            if (item.type === RESULT_TYPES.CONTACT_METHOD) {
                // NB: To handle "mailto" links opening in an external window, we need to cleanup on the next tick to
                // allow the element to stay in focus and open a new window.
                setTimeout(() => this.cleanup(), 0);
            } else {
                this.cleanup();
            }
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
            ];
            this.props.dispatch(loadSearchResults(...parameters));
        }
    }

    getLoadingIndicator() {
        return (
            <div key="loading-indicator" style={this.styles().loadingIndicatorContainer}>
                <CircularProgress mode="indeterminate" size={0.5} />
            </div>
        );
    }

    /**
     * Simply sets the value of the search input.
     *
     * It does not trigger a search. The purpose of this function to to simply give user
     * a hint of what search term was used when transitioning to a page.
     *
     * @param {String} value Value to show in the search input.
     * @param {function} optionalCallback Callback when the value has been set and internal state has been updated.
     * @return void
     */
    setValue(value, optionalCallback) {
        if (this.refs.autoComplete) {
            this.refs.autoComplete.setValue(value);
        }
        this.setState({
            query: value
        }, optionalCallback);
    }

    focus() {
        if (this.refs.autoComplete) {
            this.refs.autoComplete.focusInput();
        }
    }

    shouldShowFullSearchTrigger() {
        return this.state.query.trim() !== '' &&
            this.numberOfRealResults > 1 &&
            this.props.showExpandedResults;
    }

    renderSearchTrigger(item, highlighted) {
        if (this.shouldShowFullSearchTrigger()) {
            return (
                <ListItem
                    disableFocusRipple={true}
                    leftAvatar={<IconContainer IconClass={SearchIcon} {...this.styles().ResultIcon} />}
                    onTouchTap={() => {
                        routes.routeToSearch(this.context.history, this.state.query);
                    }}
                    primaryText={<span>{t('Search')}&nbsp;<span style={this.styles().searchTerm}>&ldquo;{this.state.query}&rdquo;</span></span>}
                    ref={(component) => {
                        ((highlighted) =>  {
                            // NB: Component will be null in some cases (unmounting and on change)
                            if (component) {
                                if (highlighted) {
                                    // NB: We don't want to pass "none" to apply focus if it isn't highlighted because it
                                    // will blur the element which can prevent "mailto" links from working properly
                                    component.applyFocusState('keyboard-focused');
                                }
                            }
                        })(highlighted);
                    }}
                    {...this.styles().ListItem}
                />
            );
        }
    }

    renderDefaultResult(item, highlighted, style) {
        const listProps = {...this.styles().ListItem, ...item};
        let secondaryText = item.secondaryText;
        if (__DEVELOPMENT__ && item.hasOwnProperty('secondaryText') && item.hasOwnProperty('score') && item.score) {
            const score = item.score.toPrecision(2);
            if (typeof secondaryText === 'string') {
                secondaryText = item.secondaryText + ` [${score}]`;
            } else {
                secondaryText = [item.secondaryText, <span>&nbsp;[{score}]</span>];
            }
        }
        return (
            <ListItem
                {...listProps}
                disableFocusRipple={true}
                onTouchTap={item.onTouchTap}
                primaryText={item.primaryText}
                ref={(component) => {
                    ((highlighted) =>  {
                        // NB: Component will be null in some cases (unmounting and on change)
                        if (component) {
                            if (highlighted) {
                                // NB: We don't want to pass "none" to apply focus if it isn't highlighted because it
                                // will blur the element which can prevent "mailto" links from working properly
                                component.applyFocusState('keyboard-focused');
                            }
                        }
                    })(highlighted);
                }}
                secondaryText={secondaryText}
            />
        );
    }

    renderExpandedProfile(item, highlighted, style) {
        const defaultResult = this.renderDefaultResult(item, highlighted, style);
        return (
            <div estimatedHeight={SEARCH_RESULT_HEIGHT}>
                {defaultResult}
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
        case RESULT_TYPES.SEARCH_TRIGGER:
            element = this.renderSearchTrigger(item, highlighted);
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
                <div key="loading-indicator" style={this.styles().loadingIndicatorContainer}>
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
                    <ListDivider inset={true} {...this.styles().ListDivider} />
                    {item}
                </div>
            );
        } else if (addSubHeader) {
            element = (
                <div key={`item-with-subheader-${index}`}>
                    <div style={this.styles().resultsListSubHeader}>
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
        const {
            limitResultsListHeight,
        } = this.props;

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
        } else if (limitResultsListHeight) {
            containerHeight = Math.min(containerHeight, SEARCH_RESULTS_MAX_HEIGHT);
        }

        if (!containerHeight) {
            return;
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
                    className="col-xs no-padding search-results"
                    containerHeight={containerHeight}
                    elementHeight={elementHeights}
                    infiniteLoadBeginEdgeOffset={200}
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

    renderDialog() {
        const standardActions = [
            {text: 'Cancel', onTouchTap: ::this.handleDialogCancel},
            {text: 'Submit', onTouchTap: ::this.handleDialogSubmit}
        ];
        return (
            <Dialog
                actions={standardActions}
                open={this.state.feedbackDialogOpen}
                title={t('What were you trying to find?')}
                {...this.styles().Dialog}
            >
                <textarea
                    autoFocus={true}
                    style={this.styles().dialogTextArea}
                    valueLink={{
                        value: this.state.infoRequest,
                        requestChange: newValue => this.setState({infoRequest: newValue}),
                    }}
                />
            </Dialog>
        )
    }

    render() {
        const {
            alwaysActive,
            autoCompleteStyle,
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
                    items={this.getResults()}
                    onBlur={::this.handleBlur}
                    onCancel={::this.handleCancel}
                    onChange={::this.handleChange}
                    onClearToken={::this.handleClearCategory}
                    onEnter={::this.handleEnter}
                    onFocus={onFocus}
                    onSelect={::this.handleSelection}
                    placeholderText={placeholder}
                    ref="autoComplete"
                    renderItem={::this.renderItem}
                    renderMenu={::this.renderMenu}
                    showCancel={showCancel}
                    style={{...this.styles().autoComplete, ...autoCompleteStyle}}
                    tokens={this.getSearchTokens()}
                    {...this.styles().AutoComplete}
                />
                {this.renderDialog()}
            </div>
        );
    }

}

export default Search;
