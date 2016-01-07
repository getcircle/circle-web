import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import keymirror from 'keymirror';
import mui from 'material-ui';
import ReactDOM from 'react-dom';

import * as selectors from '../selectors';
import { clearSearchResults, loadSearchResults, viewSearchResult } from '../actions/search';
import * as routes from '../utils/routes';
import { backgroundColors, fontColors, iconColors } from '../constants/styles';
import { SEARCH_CONTAINER_WIDTH, SEARCH_RESULTS_MAX_HEIGHT } from '../components/Search';
import t from '../utils/gettext';

import CSSComponent from './CSSComponent';
import QuickSearchList from './QuickSearchList';
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
        loading: false,
        maxListHeight: RESULT_HEIGHT * 10,
        placeholder: t('Search knowledge, people, & teams'),
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
        inputValue: '',
    }

    ignoreBlur = false

    updateQueryTimer = null;

    keyDownHandlers = {
        ArrowDown(event) {
            const { highlightedIndex } = this.state;
            event.preventDefault();
            let numberOfItems = 0;
            for (let section in SECTIONS) {
                let sectionIndex = SECTIONS[section];
                numberOfItems += this.numberOfItemsInSection(sectionIndex);
            }
            if (highlightedIndex < numberOfItems - 1) {
                this.setState({'highlightedIndex': highlightedIndex + 1});
            }
        },

        ArrowUp(event) {
            const { highlightedIndex } = this.state;
            event.preventDefault();
            if (highlightedIndex > 0) {
                this.setState({'highlightedIndex': highlightedIndex - 1});
            }
        },

        Enter(event) {
            for (let section in SECTIONS) {
                let sectionIndex = SECTIONS[section];
                let highlightedIndex = this.highlightedIndexForSection(sectionIndex);
                if (highlightedIndex !== null) {
                    this.itemsForSection(sectionIndex)[highlightedIndex].onTouchTap();
                }
            }
        },

        Escape(event) {
            this.cleanupAndBlur();
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
                    maxWidth: SEARCH_CONTAINER_WIDTH,
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
        const inputValue = event.target.value;
        clearTimeout(this.updateQueryTimer);
        this.updateQueryTimer = setTimeout(() => {
            this.props.dispatch(loadSearchResults(inputValue))
            this.setState({
                'query': inputValue,
                'highlightedIndex': 0,
            });
        }, 100);
        this.setState({'inputValue': inputValue});
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
        return this.trackTouchTap(item);
    }

    getTeamResult(team, index, highlight) {
        let primaryText = team.display_name;
        if (highlight && highlight.get('display_name')) {
            primaryText = (<div dangerouslySetInnerHTML={{__html: highlight.get('display_name')}} />);
        }
        const item = {
            index: index,
            leftAvatar: <IconContainer IconClass={GroupIcon} stroke="#7c7b7b" {...this.styles().ResultIconContainer}/>,
            primaryText: primaryText,
            onTouchTap: routes.routeToTeam.bind(null, this.context.history, team),
            type: RESULT_TYPES.TEAM,
            instance: team,
        };
        return this.trackTouchTap(item);
    }

    getLocationResult(location, index, highlight) {
        let primaryText = location.name;
        if (highlight && highlight.get('name')) {
            primaryText = (<div dangerouslySetInnerHTML={{__html: highlight.get('name')}} />);
        }
        const item = {
            index: index,
            leftAvatar: <IconContainer IconClass={OfficeIcon} stroke="#7c7b7b" {...this.styles().ResultIconContainer}/>,
            primaryText: primaryText,
            onTouchTap: routes.routeToLocation.bind(null, this.context.history, location),
            type: RESULT_TYPES.LOCATION,
            instance: location,
        };
        return this.trackTouchTap(item);
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
        return this.trackTouchTap(item);
    }

    getSearchResults() {
        const {
            results,
        } = this.props;
        const querySpecificResults = results[this.state.query];
        if (querySpecificResults) {
            const maxItems = this.numberOfItemsInSection(SECTIONS.RESULTS);
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
        else if (this.state.query === '') {
            return [];
        }
    }

    getSearchTrigger() {
        const { inputValue } = this.state;
        return {
            index: 0,
            leftAvatar: <IconContainer IconClass={SearchIcon} stroke="#7c7b7b" {...this.styles().ResultIconContainer}/>,
            primaryText: (<span>{t('Search')}&nbsp;&ldquo;<mark>{this.state.inputValue}</mark>&rdquo;</span>),
            onTouchTap: routes.routeToSearch.bind(null, this.context.history, inputValue),
        }
    }

    handleInputBlur(event) {
        event.target.value = '';
    }

    handleBlur(event) {
        if (this.ignoreBlur) {
            event.preventDefault();
        } else {
            this.cleanupAndBlur();
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

    cleanupAndBlur() {
        ReactDOM.findDOMNode(this.refs.input).blur();
        this.setState({
            highlightedIndex: 0,
            query: '',
            inputValue: '',
        })
        this.props.dispatch(clearSearchResults());
        this.props.onBlur();
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

            if (onTouchTap && typeof onTouchTap === 'function') {
                onTouchTap();
            }

            this.cleanupAndBlur();
        }
        return item;
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
                <QuickSearchList
                    highlightedIndex={this.highlightedIndexForSection(sectionIndex)}
                    itemStyle={{...this.styles().listItem}}
                    key={`list-${sectionIndex}`}
                    results={this.itemsForSection(sectionIndex)}
                    style={{...this.styles().list}}
                />
            );
        }

        return (
            <div
                className="col-xs"
                onBlur={::this.handleBlur}
                onFocus={onFocus}
                onKeyDown={::this.handleKeyDown}
                onMouseEnter={() => this.setIgnoreBlur(true)}
                onMouseLeave={() => this.setIgnoreBlur(false)}
                style={{...this.styles().root, ...style, }}
            >
                <div
                    className="row middle-xs"
                    style={{...this.styles().inputContainer, ...inputContainerStyle}}>
                    <SearchIcon {...this.styles().SearchIcon} />
                    <input
                        onBlur={::this.handleInputBlur}
                        onChange={::this.handleChange}
                        placeholder={placeholder}
                        ref="input"
                        style={this.styles().input}
                    />
                </div>
                <Paper
                    className="search-results"
                    style={{...this.styles().listContainer, ...listContainerStyle}}
                >
                    {lists}
                </Paper>
            </div>
        );
    }
}

export default QuickSearch;
