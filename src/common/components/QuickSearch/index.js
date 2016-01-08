import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import keymirror from 'keymirror';
import mui from 'material-ui';
import ReactDOM from 'react-dom';

import * as selectors from '../../selectors';
import { clearSearchResults, loadSearchResults, viewSearchResult } from '../../actions/search';
import { backgroundColors, fontColors, iconColors } from '../../constants/styles';
import { SEARCH_CONTAINER_WIDTH, SEARCH_RESULTS_MAX_HEIGHT } from '../../components/Search';
import t from '../../utils/gettext';
import * as itemFactory from './factories';

import CSSComponent from '../CSSComponent';
import QuickSearchList from '../QuickSearchList';
import InternalPropTypes from '../InternalPropTypes';
import SearchIcon from '../SearchIcon';

const { Paper } = mui;

export const RESULT_TYPES = keymirror({
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
const UPDATE_QUERY_DELAY = 100;

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
        }, UPDATE_QUERY_DELAY);
        this.setState({'inputValue': inputValue});
    }

    getSearchResults() {
        const { results } = this.props;
        const querySpecificResults = results[this.state.query];
        if (querySpecificResults) {
            const maxItems = this.numberOfItemsInSection(SECTIONS.RESULTS);
            let items = [];
            querySpecificResults.forEach((result, index) => {
                if (index < maxItems) {
                    let searchResult = null;
                    if (result.profile) {
                        searchResult = itemFactory.getProfileResult(result.profile, index, result.highlight, this.context.history);
                    } else if (result.team) {
                        searchResult = itemFactory.getTeamResult(result.team, index, result.highlight, this.context.history);
                    } else if (result.location) {
                        searchResult = itemFactory.getLocationResult(result.location, index, result.highlight, this.context.history);
                    } else if (result.post) {
                        searchResult = itemFactory.getPostResult(result.post, index, result.highlight, this.context.history);
                    }
                    searchResult = this.trackTouchTap(searchResult);
                    items.push(searchResult);
                }
            });
            return items;
        } else if (this.state.query === '') {
            return [];
        } else {
            // Results are still loading.
            // QuickSearchList does not re-render if the results we give it are null.
            return null;
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
        // highlightedIndex ignores sections and its value can be up to the total number
        // of items we have in all sections.
        //
        // This function converts highlightedIndex to an index useful to the section
        // containing the highlighted item or null if the section doesn't contain
        // the highlighted item.
        const itemsBeforeSection = this.numberOfItemsBeforeSection(section);
        const highlightedIndex = this.state.highlightedIndex - itemsBeforeSection;
        const itemsInSection = this.numberOfItemsInSection(section);
        if (highlightedIndex < 0 || highlightedIndex > (itemsInSection - 1)) {
            return null;
        } else {
            return highlightedIndex;
        }
    }

    numberOfItemsBeforeSection(section) {
        let numberOfItemsInPreviousSections = 0;
        for (let i = 0; i < section; i++) {
            numberOfItemsInPreviousSections += this.numberOfItemsInSection(i);
        }
        return numberOfItemsInPreviousSections;
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
                    const numberOfItemsInPreviousSections = this.numberOfItemsBeforeSection(section);
                    const maxNumberOfResultsVisible = Math.floor(maxListHeight / RESULT_HEIGHT);
                    const maxNumberOfResults = maxNumberOfResultsVisible - numberOfItemsInPreviousSections;
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
                return [itemFactory.getSearchTrigger(this.state.inputValue, 0, this.context.history)];
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