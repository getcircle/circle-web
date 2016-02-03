import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import keymirror from 'keymirror';
import mui from 'material-ui';

import * as selectors from '../selectors';
import { loadSearchResults } from '../actions/search';
import * as routes from '../utils/routes';
import { backgroundColors, fontColors, iconColors } from '../constants/styles';
import { SEARCH_CONTAINER_WIDTH, SEARCH_RESULTS_MAX_HEIGHT } from '../components/Search';
import t from '../utils/gettext';

import CSSComponent from './CSSComponent';
import TypeaheadInput from './TypeaheadInput';
import TypeaheadResultsList from './TypeaheadResultsList';
import InternalPropTypes from './InternalPropTypes';
import SearchIcon from './SearchIcon';
import ProfileAvatar from './ProfileAvatar';
import GroupIcon from './GroupIcon';
import OfficeIcon from './OfficeIcon';
import LightBulbIcon from './LightBulbIcon';
import IconContainer from './IconContainer';

const {
    Paper,
} = mui;

const RESULT_TYPES = keymirror({
    PROFILE: null,
    TEAM: null,
    LOCATION: null,
    POST: null,
});

const SECTIONS = {
    TRIGGER: 0,
    RESULTS: 1,
}

const RESULT_HEIGHT = 56;

const selector = selectors.createImmutableSelector(
    [
        selectors.searchSelector,
    ],
    (
        searchState
    ) => {
        return {
            results: searchState.get('results').toJS(),
            loading: searchState.get('loading'),
        };
    }
);

@connect(selector)
class QuickSearch extends CSSComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        focused: PropTypes.bool,
        inputContainerStyle: PropTypes.object,
        listContainerStyle: PropTypes.object,
        loading: PropTypes.bool,
        maxListHeight: PropTypes.number,
        onBlur: PropTypes.func,
        onFocus: PropTypes.func,
        placeholder: PropTypes.string,
        results: PropTypes.object,
        style: PropTypes.object,
    }

    static defaultProps = {
        focused: false,
        loading: false,
        maxListHeight: RESULT_HEIGHT * 10,
        placeholder: t('Search knowledge, people, & teams'),
        results: Immutable.Map(),
    }

    static contextTypes = {
        device: InternalPropTypes.DeviceContext.isRequired,
        history: PropTypes.shape({
            pushState: PropTypes.func.isRequired,
        }).isRequired,
    }

    state = {
        highlightedIndex: 0,
        query: '',
    }

    ignoreBlur = false

    updateQueryTimer = null;

    keyDownHandlers = {
        ArrowDown(event) {
            event.preventDefault();
            this.setState({'highlightedIndex': this.state.highlightedIndex + 1});
        },

        ArrowUp(event) {
            event.preventDefault();
            this.setState({'highlightedIndex': this.state.highlightedIndex - 1});
        },
    }

    setIgnoreBlur(ignoreBlur) {
        this.ignoreBlur = ignoreBlur;
    }

    styles() {
        return this.css({
            'largerDevice': this.context.device.largerDevice,
        });
    }

    classes() {
        const common = {
            borderRadius: 4,
        };
        return {
            'default': {
                listContainer: {
                    justifyContent: 'flex-start',
                    textAlign: 'start',
                    overflowY: 'hidden',
                    height: 'auto',
                    width: '100%',
                    borderRadius: '0px 0px 3px 3px',
                    boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.09)',
                    backgroundColor: 'white',
                },
                root: {
                    padding: 0,
                    width: '100%',
                },
                input: {
                    border: 'none',
                    borderRadius: common.borderRadius,
                    flex: 1,
                    fontSize: '14px',
                    lineHeight: '19px',
                    outline: 'none',
                    paddingLeft: 5,
                    height: '100%',
                    ...fontColors.light,
                },
                inputContainer: {
                    borderRadius: common.borderRadius,
                    height: 50,
                    width: '100%',
                    ...backgroundColors.light,
                },
                list: {
                    backgroundColor: 'white',
                    paddingTop: 0,
                    paddingBottom: 0,
                },
                listItem: {
                    height: RESULT_HEIGHT,
                },
                ResultIcon: {
                    height: 30,
                    width: 30,
                    strokeWidth: 1,
                },
                ResultIconContainer: {
                    style: {
                        height: 40,
                        width: 40,
                        border: '',
                    },
                    iconStyle: {
                        height: 30,
                        width: 30,
                    },
                    strokeWidth: 1,
                },
                SearchIcon: {
                    strokeWidth: 3,
                    style: {
                        alignSelf: 'center',
                        height: 25,
                        marginLeft: 14,
                        width: 25,
                    },
                    ...iconColors.medium,
                },
            },
            'largerDevice': {
                inputContainer: {
                    maxWidth: SEARCH_CONTAINER_WIDTH,
                },
                listContainer: {
                    width: SEARCH_CONTAINER_WIDTH,
                    maxHeight: SEARCH_RESULTS_MAX_HEIGHT,
                },
            },
        }
    }

    handleChange(event) {
        const query = event.target.value;
        clearTimeout(this.updateQueryTimer);
        this.updateQueryTimer = setTimeout(() => { this.props.dispatch(loadSearchResults(query)) }, 100);
        this.setState({
            'query': query,
            'highlightedIndex': 0,
        });
    }

    getProfileResult(profile, index, highlight) {
        let primaryText = profile.full_name;
        if (highlight && highlight.get('full_name')) {
            primaryText = (<div dangerouslySetInnerHTML={{__html: highlight.get('full_name')}} />);
        }
        const item = {
            index: index,
            leftAvatar: <ProfileAvatar profile={profile} />,
            primaryText: primaryText,
            onTouchTap: routes.routeToProfile.bind(null, this.context.history, profile),
            type: RESULT_TYPES.PROFILE,
            instance: profile,
        };
        return item;
    }

    getTeamResult(team, index, highlight) {
        let primaryText = team.display_name;
        if (highlight && highlight.get('display_name')) {
            primaryText = (<div dangerouslySetInnerHTML={{__html: highlight.get('display_name')}} />);
        }
        const item = {
            index: index,
            leftAvatar: <GroupIcon {...this.styles().ResultIcon} />,
            primaryText: primaryText,
            onTouchTap: routes.routeToTeam.bind(null, this.context.history, team),
            type: RESULT_TYPES.TEAM,
            instance: team,
        };
        return item;
    }

    getLocationResult(location, index, highlight) {
        let primaryText = location.name;
        if (highlight && highlight.get('name')) {
            primaryText = (<div dangerouslySetInnerHTML={{__html: highlight.get('name')}} />);
        }
        const item = {
            index: index,
            leftAvatar: <OfficeIcon {...this.styles().ResultIcon} />,
            primaryText: primaryText,
            onTouchTap: routes.routeToLocation.bind(null, this.context.history, location),
            type: RESULT_TYPES.LOCATION,
            instance: location,
        };
        return item;
    }

    getPostResult(post, index, highlight) {
        let primaryText = post.title;
        if (highlight && highlight.get('title')) {
            primaryText = (<div dangerouslySetInnerHTML={{__html: highlight.get('title')}} />);
        }
        const item = {
            index: index,
            leftAvatar: <IconContainer IconClass={LightBulbIcon} stroke="#7c7b7b" {...this.styles().ResultIconContainer}/>,
            primaryText: primaryText,
            onTouchTap: routes.routeToPost.bind(null, this.context.history, post),
            type: RESULT_TYPES.POST,
            instance: post,
        };
        return item;
    }

    getSearchResults() {
        const {
            results,
        } = this.props;
        const querySpecificResults = results[this.state.query];
        if (querySpecificResults) {
            const maxItems = this.numberOfItemsInSection(SECTIONS.RESULTS);
            console.log('$'+maxItems);
            let items = [];
            querySpecificResults.forEach((result, index) => {
                if (index < maxItems) {
                    let searchResult = null;
                    if (result.profile) {
                        searchResult = this.getProfileResult(result.profile, index, result.highlight);
                    } else if (result.team) {
                        searchResult = this.getTeamResult(result.team, index, result.highlight);
                    } else if (result.location) {
                        searchResult = this.getLocationResult(result.location, index, result.highlight);
                    } else if (result.post) {
                        searchResult = this.getPostResult(result.post, index, result.highlight);
                    }
                    items.push(searchResult);
                }
            });
            return items;
        }
    }

    getSearchTrigger() {
        const { query } = this.state;
        return {
            index: 0,
            primaryText: t('Search') + (query ? ` "${query}"` : ''),
            onTouchTap: routes.routeToSearch.bind(null, this.context.history, query),
        }
    }

    handleBlur(event) {
        if (this.ignoreBlur) {
            event.preventDefault();
        } else {
            this.props.onBlur();
        }
    }

    handleKeyDown(event) {
        this.setIgnoreBlur(true);
        const handler = this.keyDownHandlers[event.key];
        if (handler) {
            handler.call(this, event);
        }
    }

    highlightedIndexForSection(section) {
        let itemsBeforeSection = 0;
        for (var i = 0; i < section; i++) {
            itemsBeforeSection += this.numberOfItemsInSection(i);
        }
        let highlightedIndex = this.state.highlightedIndex - itemsBeforeSection;
        let itemsInSection = this.numberOfItemsInSection(section);
        if (highlightedIndex < 0 || highlightedIndex > (itemsInSection - 1)) {
            return null;
        } else {
            return highlightedIndex;
        }
    }

    numberOfItemsInSection(section) {
        switch(section) {
            case SECTIONS.TRIGGER:
                return 1;
            case SECTIONS.RESULTS:
                const {
                    maxListHeight,
                    results,
                } = this.props;
                let numberOfResults = 0;
                const querySpecificResults = results[this.state.query];
                if (querySpecificResults) {
                    let numberOfItemsInPreviousSections = 0;
                    for (var i = 0; i < section; i++) {
                        numberOfItemsInPreviousSections += this.numberOfItemsInSection(i);
                    }
                    const maxNumberOfResults = Math.floor(maxListHeight / RESULT_HEIGHT) - numberOfItemsInPreviousSections;
                    numberOfResults = Math.min(maxNumberOfResults, querySpecificResults.length);
                }
                return numberOfResults;
            default:
                return 0;
        }
    }

    itemsForSection(section) {
        switch(section) {
            case SECTIONS.TRIGGER:
                return [this.getSearchTrigger()];
            case SECTIONS.RESULTS:
                return this.getSearchResults();
            default:
                return null;
        }
    }

    render() {
        const {
            inputContainerStyle,
            onFocus,
            placeholder,
            listContainerStyle,
            style,
        } = this.props;

        let lists = [];
        for (let section in SECTIONS) {
            let sectionIndex = SECTIONS[section];
            lists.push(
                <TypeaheadResultsList
                    highlightedIndex={this.highlightedIndexForSection(sectionIndex)}
                    itemStyle={{...this.styles().listItem}}
                    results={this.itemsForSection(sectionIndex)}
                    style={{...this.styles().list}}
                />
            );
        }

        return (
            <div
                className="row center-xs"
                onBlur={::this.handleBlur}
                onFocus={onFocus}
                onKeyDown={::this.handleKeyDown}
                onMouseEnter={() => this.setIgnoreBlur(true)}
                onMouseLeave={() => this.setIgnoreBlur(false)}
                style={{...this.styles().root, ...style, }}
            >
                <div
                    className="col-xs"
                >
                    <div
                        className="row middle-xs"
                        style={{...this.styles().inputContainer, ...inputContainerStyle}}>
                        <SearchIcon {...this.styles().SearchIcon} />
                        <TypeaheadInput
                            onChange={::this.handleChange}
                            placeholder={placeholder}
                            style={this.styles().input}
                        />
                    </div>
                    <Paper
                        style={{...this.styles().listContainer, ...listContainerStyle}}
                    >
                        {lists}
                    </Paper>
                </div>
            </div>
        );
    }
}

export default QuickSearch;
