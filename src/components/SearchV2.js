import { connect } from 'react-redux';
import Immutable from 'immutable';
import Infinite from 'react-infinite';
import keymirror from 'keymirror';
import mui from 'material-ui';
import React, { PropTypes } from 'react';
import { services, soa } from 'protobufs';

import * as exploreActions from '../actions/explore';
import { iconColors, fontColors, fontWeights } from '../constants/styles';
import * as selectors from '../selectors';
import { retrieveProfiles } from '../reducers/denormalizations';
import t from '../utils/gettext';

import AutoComplete from './AutoComplete';
import CSSComponent from './CSSComponent';
import ProfileAvatar from './ProfileAvatar';
import SearchIcon from './SearchIcon';

const {
    CircularProgress,
    List,
    ListItem,
    ListDivider,
    Paper,
} = mui;

const RESULT_TYPES = keymirror({
    EXPLORE: null,
});

export const SEARCH_RESULT_HEIGHT = 72;
export const SEARCH_CONTAINER_WIDTH = 460;
export const SEARCH_RESULTS_MAX_HEIGHT = 600;

const cacheSelector = selectors.createImmutableSelector(
    [selectors.cacheSelector, selectors.exploreProfilesIdsSelector],
    (cacheState, profilesState) => {
        let profiles, profilesNextRequest;
        const cache = cacheState.toJS();
        if (profilesState) {
            const ids = profilesState.get('ids').toJS();
            if (ids.length) {
                profiles = retrieveProfiles(ids, cache);
            }
            profilesNextRequest = profilesState.get('nextRequest');
        }
        return Immutable.fromJS({
            profiles,
            profilesNextRequest,
        });
    },
);

const selector = selectors.createImmutableSelector(
    [cacheSelector, selectors.exploreProfilesLoadingSelector],
    (cacheState, profilesLoadingState) => {
        return {
            loading: profilesLoadingState,
            ...cacheState.toJS(),
        };
    }
);

@connect(selector)
class Search extends CSSComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        loading: PropTypes.bool,
        organization: PropTypes.instanceOf(services.organization.containers.OrganizationV1),
        profiles: PropTypes.arrayOf(
            PropTypes.instanceOf(services.profile.containers.ProfileV1)
        ),
        profilesNextRequest: PropTypes.instanceOf(soa.ServiceRequestV1),
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (this.state.category && !nextState.category) {
            this.props.dispatch(exploreActions.clearExploreResults());
        }
    }

    static defualtProps = {
        loading: false,
    }

    state = {
        category: null,
    }

    classes() {
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
                    boxShadow: '0px 2px 4px -2px',
                    justifyContent: 'flex-start',
                    maxWidth: SEARCH_CONTAINER_WIDTH,
                    maxHeight: SEARCH_RESULTS_MAX_HEIGHT,
                    opacity: '0.9',
                    overflowY: 'auto',
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
        };
    }

    handleCategorySelection(category) {
        this.setState({category: category});
        this.explore(category);
    }

    handleClearCategory() {
        this.setState({category: null});
    }

    getCategoryNextRequest() {
        const { CategoryV1 } = services.search.containers.search;
        switch(this.state.category) {
        case CategoryV1.PROFILES:
            return this.props.profilesNextRequest;
        }
    }

    getCategoryResults() {
        let results;
        const { CategoryV1 } = services.search.containers.search;
        switch(this.state.category) {
        case CategoryV1.PROFILES:
            results = this.getCategoryResultsProfiles();
            break;
        }
        return results ? results : [];
    }

    getCategoryResultsProfiles() {
        const { profiles } = this.props;
        if (profiles) {
            return profiles.map((profile) => ({
                    leftAvatar: <ProfileAvatar profile={profile} />,
                    primaryText: profile.full_name,
                    secondaryText: `${profile.title} (TODO)`,
                })
            );
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
                ...item,
            };
        });
    }

    getResults() {
        if (this.state.category !== null) {
            return this.getCategoryResults();
        } else {
            return this.getDefaultResults();
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

    renderItem(item, highlighted, style) {
        const element = (
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
        return element;
    }

    renderLoadingIndicator() {
        // TODO: look into why infinite isn't catching this for us
        if (this.props.loading) {
            return (
                <div is="loadingIndicatorContainer">
                    <CircularProgress mode="indeterminate" size={0.5} />
                </div>
            );
        }
    }

    renderMenu(items, value, style) {
        let containerHeight = 0;
        const elementHeights = [];
        const itemsWithDividers = items.map((item, index) => {
            const height = item.props.estimatedHeight || SEARCH_RESULT_HEIGHT;
            containerHeight += height;
            elementHeights.push(height);
            if (index !== 0) {
                return (
                    <div>
                        <ListDivider inset={true} is="ListDivider" key={`item-divider-${index}`} />
                        {item}
                    </div>
                );
            }
            return item;
        });

        containerHeight = Math.min(containerHeight, SEARCH_RESULTS_MAX_HEIGHT);
        return (
            <Paper style={{...style, ...this.styles().resultsList}}>
                <Infinite
                    containerHeight={containerHeight}
                    elementHeight={elementHeights}
                    infiniteLoadBeginBottomOffset={200}
                    isInfiniteLoading={this.props.loading}
                    loadingSpinnerDelegate={::this.renderLoadingIndicator()}
                    onInfiniteLoad={::this.handleInfiniteLoad}
                >
                    {itemsWithDividers}
                </Infinite>
            </Paper>
        );
        return (
            <List
                key="results"
                subheader="Explore"
                subheaderStyle={this.styles().resultsListSubHeader}
            >
                {itemsWithDividers}
            </List>
        );
    }

    render() {
        return (
            <div {...this.props} is="searchContainer">
                <AutoComplete
                    alwaysActive={true}
                    focused={true}
                    is="AutoComplete"
                    items={this.getResults()}
                    onClearToken={this.handleClearCategory.bind(this)}
                    placeholderText={t('Search People, Teams & Locations')}
                    renderItem={this.renderItem.bind(this)}
                    renderMenu={this.renderMenu.bind(this)}
                    tokens={this.getSearchTokens()}
                />
            </div>
        );
    }

}

export default Search;
