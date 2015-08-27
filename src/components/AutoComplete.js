import { CircularProgress } from 'material-ui';
import React, { PropTypes } from 'react';

import { backgroundColors, fontColors, iconColors } from '../constants/styles';

import CSSComponent from './CSSComponent';
import SearchIcon from './SearchIcon';
import AutoCompleteToken from './AutoCompleteToken'

class AutoComplete extends CSSComponent {

    static propTypes = {
        alwaysActive: PropTypes.bool,
        focused: PropTypes.bool,
        initialValue: PropTypes.any,
        items: PropTypes.array,
        loading: PropTypes.bool,
        onClearToken: PropTypes.func,
        onSelect: PropTypes.func,
        placeholderText: PropTypes.string,
        renderItem: PropTypes.func.isRequired,
        renderMenu: PropTypes.func,
        tokens: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.string.isRequired,
        })),
    }

    static defaultProps = {
        alwaysActive: false,
        focused: false,
        getItemValue: item => item,
        loading: false,
        onSelect: () => true,
        placeholderText: '',
        renderMenu: (items, value, style) => {
            return <div children={items} style={style} />
        },
    }

    componentDidMount() {
        if (this.props.focused) {
            this.focusInput();
        }
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.alwaysActive && !nextState.isActive) {
            this.setState({isActive: true});
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            this.state.highlightedIndex === null &&
            this.props.alwaysActive
        ) {
            this.focusInput();
        }
    }

    state = {
        highlightedIndex: null,
        isActive: false,
        performAutoCompleteOnKeyUp: false,
        value: this.props.initialValue || '',
    }

    classes() {
        const common = {
            borderRadius: 4,
        };
        return {
            'default': {
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
                loadingIndicator: {
                    marginRight: 10,
                    bottom: 5,
                },
                root: {
                    display: 'flex',
                    flexDirection: 'column',
                    maxWidth: 460,
                    width: '100%',
                },
                searchBar: {
                    borderRadius: common.borderRadius,
                    display: 'flex',
                    height: 50,
                    width: '100%',
                    ...backgroundColors.light,
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
            'alwaysActive-true': {
                searchBar: {
                    borderRadius: `${common.borderRadius}px ${common.borderRadius}px 0 0`
                },
            },
            'loading-true': {
                searchBar: {
                    borderRadius: common.borderRadius,
                }
            }
        };
    }

    focusInput() {
        React.findDOMNode(this.refs.input).select();
    }

    getItems() {
        // this is wrapped in a function so in the future we could add `shouldItemRender` or `sortItems`
        return this.props.items;
    }

    handleKeyDown(event) {
        if (this.keyDownHandlers[event.key]) {
            this.keyDownHandlers[event.key].call(this, event);
        } else {
            this.setState({
                highlightedIndex: null,
                isActive: true,
            });
        }
    }

    keyDownHandlers = {
        ArrowDown(event) {
            event.preventDefault();
            const { highlightedIndex } = this.state;
            const index = (
                highlightedIndex === null ||
                highlightedIndex === this.getItems().length - 1
            ) ? 0 : highlightedIndex + 1;
            this.setState({
                highlightedIndex: index,
                isActive: true,
                performAutoCompleteOnKeyUp: true,
            });
        },

        ArrowUp(event) {
            event.preventDefault();
            const { highlightedIndex } = this.state;
            const index = (
                highlightedIndex === 0 ||
                highlightedIndex === null
            ) ? this.getItems().length - 1 : highlightedIndex - 1;
            this.setState({
                highlightedIndex: index,
                isActive: true,
            });
        },

        Enter(event) {
            if (this.state.isActive === false) {
                // already selected, do nothing
                return;
            } else if (this.state.highlightedIndex === null) {
                // hit enter after focus but before typing anything
                this.setState({isActive: false}, () => {
                    React.findDOMNode(this.refs.input).focus();
                });
            } else {
                const item = this.getItems()[this.state.highlightedIndex];
                this.setState({
                    isActive: this.props.alwaysActive ? true : false,
                    highlightedIndex: null,
                }, () => {
                    this.props.onSelect(this.state.value, item);
                });
            }
        },

        Escape(event) {
            this.setState({
                highlightedIndex: null,
                isActive: this.props.alwaysActive ? true : false,
            });
        }
    }

    renderMenu() {
        if (!this.props.loading) {
            const items = this.getItems().map((item, index) => {
                const element = this.props.renderItem(
                    item,
                    this.state.highlightedIndex === index,
                    {cursor: 'default'}
                );
                return React.cloneElement(element, {
                    key: `item-${index}`,
                });
            });
            const menu = this.props.renderMenu(items, this.state.value, this.styles().menu);
            return React.cloneElement(menu, {ref: 'menu'});
        }
    }

    renderTokens() {
        if (this.props.tokens) {
            return this.props.tokens.map((token, index) => {
                return (
                    <AutoCompleteToken
                        key={`token-index`}
                        label={token.value}
                        onTouchTap={this.props.onClearToken}
                    />
                );
            });
        }
    }

    render() {
        const {
            focused,
            placeholderText,
            ...other
        } = this.props;
        return (
            <div {...other} is="root" onKeyDown={this.handleKeyDown.bind(this)}>
                <div is="searchBar">
                    <SearchIcon is="SearchIcon" />
                    {this.renderTokens()}
                    <input
                        is="input"
                        placeholder={!this.props.tokens ? placeholderText : ''}
                        ref="input"
                        type="text"
                    />
                    {(() => {
                        if (this.props.loading) {
                            return <CircularProgress is="loadingIndicator" mode="indeterminate" size={0.5} />;
                        }
                    })()}
                </div>
                <div>
                    {this.renderMenu()}
                </div>
            </div>
        );
    }

}

export default AutoComplete;
