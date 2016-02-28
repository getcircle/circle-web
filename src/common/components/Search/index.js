import React, { PropTypes } from 'react';
import mui from 'material-ui';
import ReactDOM from 'react-dom';

import { backgroundColors, fontColors } from '../../constants/styles';
import t from '../../utils/gettext';

import CSSComponent from '../CSSComponent';
import InternalPropTypes from '../InternalPropTypes';

import List from './List';

const { Paper } = mui;

const SEARCH_RESULTS_MAX_HEIGHT = 620;

const RESULT_HEIGHT = 56;
const UPDATE_QUERY_DELAY = 100;

/* TODO:
 * - copy over trackSearch logic from search component
 */

/** Search component.
 *
 * This can be built on top of to compose different behaviors, ie. including
 * the search trigger as the first result.
 *
 */
class Search extends CSSComponent {

    static propTypes = {
        focused: PropTypes.bool,
        hasItemDivider: PropTypes.bool,
        inputContainerStyle: PropTypes.object,
        inputStyle: PropTypes.object,
        listContainerStyle: PropTypes.object,
        maxListHeight: PropTypes.number,
        onBlur: PropTypes.func,
        onChange: PropTypes.func,
        onDelayedChange: PropTypes.func,
        onFocus: PropTypes.func,
        onSelectItem: PropTypes.func,
        placeholder: PropTypes.string,
        resultHeight: PropTypes.number,
        sections: PropTypes.array.isRequired,
        style: PropTypes.object,
    }

    static contextTypes = {
        device: InternalPropTypes.DeviceContext.isRequired,
    }

    componentWillMount() {
        this.configure(this.props, this.state);
    }

    componentWillReceiveProps(nextProps, nextState) {
        this.configure(nextProps, Object.assign(this.state, nextState));
    }

    componentDidUpdate() {
        if (this.props.focused) {
            ReactDOM.findDOMNode(this.refs.input).focus();
        }
    }

    static defaultProps = {
        focused: true,
        hasItemDivider: true,
        maxListHeight: RESULT_HEIGHT * 10,
        onBlur: () => {},
        onChange: () => {},
        onDelayedChange: () => {},
        onFocus: () => {},
        onSelectItem: () => {},
        placeholder: t('Search knowledge, people, & teams'),
        resultHeight: RESULT_HEIGHT,
    }

    state = {
        highlightedIndex: null,
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
            event.preventDefault();
            for (let section of this.props.sections) {
                let highlightedIndex = this.highlightedIndexForSection(section);
                if (highlightedIndex !== null) {
                    this.handleSelectItem(section.getItems()[highlightedIndex]);
                    break;
                }
            }
        },

        Escape(event) {
            this.cleanupAndBlur(event);
        },
    }

    cleanupAndBlur = (event) => {
        ReactDOM.findDOMNode(this.refs.input).blur();
        this.setState({highlightedIndex: null})
        this.props.onBlur(event);
    }

    handleSelectItem = (item) => {
        this.props.onSelectItem(item);
        this.cleanupAndBlur();
    }

    setIgnoreBlur(ignoreBlur) {
        this.ignoreBlur = ignoreBlur;
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
                    maxHeight: SEARCH_RESULTS_MAX_HEIGHT,
                },
                root: {
                    padding: 0,
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
                    paddingTop: 0,
                    paddingBottom: 0,
                },
                listItem: {
                    height: this.props.resultHeight,
                },
            },
        }
    }

    handleChange(event) {
        const inputValue = event.target.value;
        clearTimeout(this.updateQueryTimer);
        this.updateQueryTimer = setTimeout(() => {
            this.props.onDelayedChange(inputValue)
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
            this.cleanupAndBlur(event);
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
            const maxNumberOfResultsVisible = Math.floor(this.props.maxListHeight / this.props.resultHeight);
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

    render() {
        const {
            className,
            inputStyle,
            inputContainerStyle,
            focused,
            onFocus,
            placeholder,
            listContainerStyle,
            sections,
            style,
            ...other,
        } = this.props;

        let lists = [];
        if (focused) {
            for (let sectionIndex in sections) {
                const section = this.props.sections[sectionIndex];
                const maxItems = this.numberOfItemsInSection(section);
                lists.push(
                    <List
                        hasItemDivider={this.props.hasItemDivider}
                        highlightedIndex={this.highlightedIndexForSection(section)}
                        itemStyle={{...this.styles().listItem}}
                        items={section.getItems(maxItems)}
                        key={`list-${sectionIndex}`}
                        onSelectItem={this.handleSelectItem}
                        style={{...this.styles().list}}
                        title={section.title}
                    />
                );
            }
        }

        return (
            <div
                className={className}
                onBlur={::this.handleBlur}
                onFocus={onFocus}
                onKeyDown={::this.handleKeyDown}
                onMouseEnter={() => this.setIgnoreBlur(true)}
                onMouseLeave={() => this.setIgnoreBlur(false)}
                style={{...this.styles().root, ...style}}
            >
                <div
                    className="row middle-xs"
                    style={{...this.styles().inputContainer, ...inputContainerStyle}}>
                    <input
                        autoFocus={this.props.focused}
                        onBlur={::this.handleInputBlur}
                        onChange={::this.handleChange}
                        placeholder={placeholder}
                        ref="input"
                        style={{...this.styles().input, ...inputStyle}}
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

export default Search;
