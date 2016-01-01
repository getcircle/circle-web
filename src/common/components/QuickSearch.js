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

const {
    Paper,
} = mui;

const RESULT_TYPES = keymirror({
    PROFILE: null,
    TEAM: null,
    LOCATION: null,
    POST: null,
});

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
        listsContainerStyle: PropTypes.object,
        loading: PropTypes.bool,
        onBlur: PropTypes.func,
        onFocus: PropTypes.func,
        placeholder: PropTypes.string,
        results: PropTypes.object,
        style: PropTypes.object,
    }

    static defaultProps = {
        focused: false,
        loading: false,
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
        query: '',
    }

    ignoreBlur = false

    updateQueryTimer = null;

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
                listsContainer: {
                    justifyContent: 'flex-start',
                    textAlign: 'start',
                    overflowY: 'hidden',
                    height: 'auto',
                    width: '100%',
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
                resultsList: {
                    marginTop: -15,
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
                listsContainer: {
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
        this.setState({'query': query});
    }

    getProfileResult(profile, index, highlight) {
        let primaryText = profile.full_name;
        if (highlight && highlight.get('full_name')) {
            primaryText = (<div dangerouslySetInnerHTML={{__html: highlight.get('full_name')}} />);
        }
        const item = {
            index: index,
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
            primaryText: primaryText,
            onTouchTap: routes.routeToPost.bind(null, this.context.history, post),
            type: RESULT_TYPES.POST,
            instance: post,
        };
        return item;
    }

    getSearchResultItems(results) {
        let items = [];

        results.forEach((result, index) => {
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
            return searchResult;
        });

        return items;
    }

    getSearchResults() {
        const { results } = this.props;
        const querySpecificResults = results[this.state.query];
        if (querySpecificResults && querySpecificResults.length) {
            return this.getSearchResultItems(querySpecificResults);
        }
    }

    getSearchTrigger() {
        return {
            index: 0,
            primaryText: 'Search "' + this.state.query + '"',
            onTouchTap: routes.routeToSearch.bind(null, this.context.history, this.state.query),
        }
    }

    handleBlur(event) {
        if (this.ignoreBlur) {
            event.preventDefault();
        } else {
            this.props.onBlur();
        }
    }

    render() {
        const {
            inputContainerStyle,
            onFocus,
            placeholder,
            listsContainerStyle,
            style,
        } = this.props;

        return (
            <div
                className="row center-xs"
                onBlur={::this.handleBlur}
                onFocus={onFocus}
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
                        style={{...this.styles().listsContainer, ...listsContainerStyle}}
                    >
                        <TypeaheadResultsList
                            results={[this.getSearchTrigger()]}
                        />
                        <TypeaheadResultsList
                            results={this.getSearchResults()}
                            style={{...this.styles().resultsList}}
                        />
                    </Paper>
                </div>
            </div>
        );
    }
}

export default QuickSearch;
