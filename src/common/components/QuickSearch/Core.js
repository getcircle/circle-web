import React, { PropTypes } from 'react';
import mui from 'material-ui';
import ReactDOM from 'react-dom';

import { clearSearchResults, loadSearchResults, viewSearchResult } from '../../actions/search';
import { backgroundColors, fontColors, iconColors } from '../../constants/styles';
import t from '../../utils/gettext';

import CSSComponent from '../CSSComponent';
import QuickSearchList from '../QuickSearchList';
import InternalPropTypes from '../InternalPropTypes';
import SearchIcon from '../SearchIcon';

const { Paper } = mui;

const SEARCH_CONTAINER_WIDTH = 800;
const SEARCH_RESULTS_MAX_HEIGHT = 620;

const RESULT_HEIGHT = 56;
const UPDATE_QUERY_DELAY = 100;

/* TODO:
 * - copy over trackSearch logic from search component
 */

class Core extends CSSComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        inputContainerStyle: PropTypes.object,
        listContainerStyle: PropTypes.object,
        maxListHeight: PropTypes.number,
        onBlur: PropTypes.func,
        onChange: PropTypes.func,
        onFocus: PropTypes.func,
        placeholder: PropTypes.string,
        searchContainerWidth: PropTypes.number,
        sections: PropTypes.array.isRequired,
        style: PropTypes.object,
    }

    static contextTypes = {
        device: InternalPropTypes.DeviceContext.isRequired,
        history: PropTypes.shape({
            pushState: PropTypes.func.isRequired,
        }).isRequired,
    }

    componentWillMount() {
        this.configure(this.props, this.state);
    }

    componentWillReceiveProps(nextProps, nextState) {
        this.configure(nextProps, Object.assign(this.state, nextState));
    }

    static defaultProps = {
        maxListHeight: RESULT_HEIGHT * 10,
        onBlur: () => {},
        onFocus: () => {},
        onChange: () => {},
        placeholder: t('Search knowledge, people, & teams'),
        searchContainerWidth: SEARCH_CONTAINER_WIDTH,
    }

    state = {
        highlightedIndex: null,
        query: '',
    }

    configure(props, state) {
        for (let section of props.sections) {
            if (state.highlightedIndex === null && section.initialHighlightedIndex !== null) {
                const highlightedIndex = this.numberOfItemsBeforeSection(section) + section.initialHighlightedIndex;
                this.setState({'highlightedIndex': highlightedIndex});
            }
        }
    }

    ignoreBlur = false

    updateQueryTimer = null;

    keyDownHandlers = {
        ArrowDown(event) {
            const { highlightedIndex } = this.state;
            event.preventDefault();
            const numberOfItems = this.totalNumberOfItems();
            if (highlightedIndex !== null && highlightedIndex < numberOfItems - 1) {
                this.setState({'highlightedIndex': highlightedIndex + 1});
            } else {
                this.setState({'highlightedIndex': 0});
            }
        },

        ArrowUp(event) {
            const { highlightedIndex } = this.state;
            event.preventDefault();
            if (highlightedIndex !== null && highlightedIndex > 0) {
                this.setState({'highlightedIndex': highlightedIndex - 1});
            } else {
                this.setState({'highlightedIndex': this.totalNumberOfItems() - 1});
            }
        },

        Enter(event) {
            for (let section of this.props.sections) {
                let highlightedIndex = this.highlightedIndexForSection(section);
                if (highlightedIndex !== null) {
                    section.getItems()[highlightedIndex].onTouchTap();
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
                    maxWidth: this.props.searchContainerWidth,
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
                    maxWidth: this.props.searchContainerWidth,
                },
                listContainer: {
                    width: this.props.searchContainerWidth,
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
            this.setState({'query': inputValue});
        }, UPDATE_QUERY_DELAY);
        this.setState({'highlightedIndex': inputValue !== '' ? 0 : null});
        this.props.onChange(inputValue);
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

    /**
     * Return the highlighted index for the section.
     *
     * @param {Section} section
     * @return {Number} the highlighted index or null if none exists
     *
     * this.state.highlightedIndex ignores sections and its value can be up to
     * the total number of items we have in all sections.
     *
     * This function converts highlightedIndex to an index useful to the
     * section containing the highlighted item, or null if the section doesn't
     * contain the highlighted item.
     */
    highlightedIndexForSection(section) {
        const { highlightedIndex } = this.state;
        if (highlightedIndex === null) {
            return highlightedIndex;
        }

        const itemsBeforeSection = this.numberOfItemsBeforeSection(section);
        const sectionAdjustedIndex = highlightedIndex - itemsBeforeSection;
        const itemsInSection = this.numberOfItemsInSection(section);
        if (sectionAdjustedIndex < 0 || sectionAdjustedIndex > (itemsInSection - 1)) {
            return null;
        } else {
            return sectionAdjustedIndex;
        }
    }

    numberOfItemsBeforeSection(section) {
        let numberOfItemsInPreviousSections = 0;
        const { sections } = this.props;
        const sectionIndex = sections.indexOf(section);
        for (let i = 0; i < sectionIndex; i++) {
            numberOfItemsInPreviousSections += this.numberOfItemsInSection(sections[i]);
        }
        return numberOfItemsInPreviousSections;
    }

    numberOfItemsInSection(section) {
        if (section.hasItems()) {
            const numberOfItemsInPreviousSections = this.numberOfItemsBeforeSection(section);
            const maxNumberOfResultsVisible = Math.floor(this.props.maxListHeight / RESULT_HEIGHT);
            const maxNumberOfResults = maxNumberOfResultsVisible - numberOfItemsInPreviousSections;
            return section.getNumberOfItems(maxNumberOfResults);
        }
        return 0;
    }

    totalNumberOfItems() {
        let numberOfItems = 0;
        for (let section of this.props.sections) {
            numberOfItems += this.numberOfItemsInSection(section);
        }
        return numberOfItems;
    }

    cleanupAndBlur() {
        ReactDOM.findDOMNode(this.refs.input).blur();
        this.setState({
            highlightedIndex: null,
            query: '',
        })
        this.props.dispatch(clearSearchResults());
        this.props.onBlur();
    }

    trackTouchTap(item) {
        const onTouchTap = item.onTouchTap;
        item.onTouchTap = () => {
            const trackItem = Object.assign({}, item);
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
        for (let sectionIndex in this.props.sections) {
            const section = this.props.sections[sectionIndex];
            const maxItems = this.numberOfItemsInSection(section);
            lists.push(
                <QuickSearchList
                    highlightedIndex={this.highlightedIndexForSection(section)}
                    itemStyle={{...this.styles().listItem}}
                    items={section.getItems(maxItems)}
                    key={`list-${sectionIndex}`}
                    style={{...this.styles().list}}
                    title={section.title}
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

export default Core;
