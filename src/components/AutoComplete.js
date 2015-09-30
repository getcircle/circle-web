import mui from 'material-ui';
import React, { PropTypes } from 'react';

import { backgroundColors, fontColors, iconColors } from '../constants/styles';

import CSSComponent from './CSSComponent';
import SearchIcon from './SearchIcon';
import AutoCompleteToken from './AutoCompleteToken'

const {
    FlatButton,
} = mui;

class AutoComplete extends CSSComponent {

    static propTypes = {
        alwaysActive: PropTypes.bool,
        clearValueOnSelection: PropTypes.bool,
        focusOnSelect: PropTypes.bool,
        focused: PropTypes.bool,
        initialValue: PropTypes.any,
        inputContainerStyle: PropTypes.object,
        items: PropTypes.array,
        onBlur: PropTypes.func,
        onCancel: PropTypes.func,
        onChange: PropTypes.func,
        onClearToken: PropTypes.func,
        onFocus: PropTypes.func,
        onSelect: PropTypes.func,
        placeholderText: PropTypes.string,
        renderItem: PropTypes.func.isRequired,
        renderMenu: PropTypes.func,
        showCancel: PropTypes.bool,
        style: PropTypes.object,
        tokens: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.string.isRequired,
        })),
    }

    static defaultProps = {
        alwaysActive: false,
        clearValueOnSelection: false,
        focusOnSelect: true,
        focused: false,
        getItemValue: item => item,
        onBlur() {},
        onCancel() {},
        onChange() {},
        onFocus() {},
        onSelect() {},
        placeholderText: '',
        renderMenu: (items, value, style) => {
            return <div children={items} style={style} />
        },
        showCancel: false,
    }

    state = {
        highlightedIndex: null,
        isActive: false,
        value: this.props.initialValue || '',
    }

    componentDidMount() {
        if (this.props.alwaysActive) {
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
            this.props.alwaysActive &&
            !prevProps.alwaysActive
        ) {
            this.focusInput();
        }
    }

    ignoreBlur = false

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
                root: {
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                },
                inputContainer: {
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
                inputContainer: {
                    borderRadius: `${common.borderRadius}px ${common.borderRadius}px 0 0`
                },
            },
        };
    }

    focusInput() {
        const node = React.findDOMNode(this.refs.input);
        if (node) {
            node.select();
        }
    }

    blurInput() {
        React.findDOMNode(this.refs.input).blur();
    }

    blurInput() {
        React.findDOMNode(this.refs.input).blur();
    }

    setIgnoreBlur(ignoreBlur) {
        this.ignoreBlur = ignoreBlur;
    }

    getItems() {
        // this is wrapped in a function so in the future we could add `shouldItemRender` or `sortItems`
        return this.props.items || [];
    }

    selectItem(item) {
        if (this.props.clearValueOnSelection) {
            this.setState({value: ''});
        }
        this.props.onSelect(item);
    }

    handleChange(event) {
        this.setState({value: event.target.value}, () => {
            this.props.onChange(event, this.state.value);
        });
    }

    handleFocus(event) {
        this.setState({highlightedIndex: null});
        this.props.onFocus(event);
    }

    handleBlur(event) {
        if (this.ignoreBlur) {
            event.preventDefault();
            return;
        }
        if (this.props.clearValueOnSelection) {
            this.setState({value: ''});
        }
        this.props.onBlur(event);
    }

    handleKeyDown(event) {
        this.setIgnoreBlur(true);
        if (this.keyDownHandlers[event.key]) {
            this.keyDownHandlers[event.key].call(this, event);
        } else {
            this.setState({
                highlightedIndex: null,
                isActive: true,
            });
        }
    }

    handleCancel() {
        this.setState({value: ''});
        this.props.onCancel();
    }

    handleSelectItem(item, cb) {
        if (this.props.focusOnSelect) {
            // NB: To handle "mailto" links opening in an external window, we need to retain focus on the selected item
            // until the next tick.
            setTimeout(::this.focusInput, 0);
        }
        this.selectItem(item);
        if (cb && typeof cb === 'function') {
            cb();
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

        Backspace(event) {
            const { value } = this.state;
            // Currently, this explicitly calls the clear token callback
            // We can generalize if needed to add a dedicated onClear handler
            if ((value === null || value === '') && !!this.props.onClearToken && !!this.props.tokens) {
                this.props.onClearToken();
                this.setIgnoreBlur(false);
            }
        },

        Enter(event) {
            if (this.state.isActive === false) {
                // already selected, do nothing
                return;
            } else if (this.state.highlightedIndex === null) {
                // hit enter after focus but before typing anything
                this.setState({isActive: false}, () => {
                    this.focusInput();
                });
            } else {
                this.setState({
                    isActive: this.props.alwaysActive ? true : false,
                    highlightedIndex: null,
                });
                this.setIgnoreBlur(false);
                this.selectItem(this.getItems()[this.state.highlightedIndex]);
            }
        },

        Escape(event) {
            this.setState({
                highlightedIndex: null,
                isActive: this.props.alwaysActive ? true : false,
            });
            this.setIgnoreBlur(false);
            this.blurInput();
            this.props.onBlur();
        }
    }

    renderMenu() {
        const items = this.getItems().map((item, index) => {
            const element = this.props.renderItem(
                item,
                this.state.highlightedIndex === index,
                {cursor: 'default'}
            );
            return React.cloneElement(element, {
                key: `item-${index}`,
                onMouseEnter: () => this.setIgnoreBlur(true),
                onMouseLeave: () => this.setIgnoreBlur(false),
                onTouchTap: () => this.handleSelectItem(item, element.props.onTouchTap),
            });
        });
        const menu = this.props.renderMenu(items, this.state.value, this.styles().menu);
        return React.cloneElement(menu, {ref: 'menu'});
    }

    renderCancelButton(showCancel) {
        if (showCancel) {
            return (
                <FlatButton
                    is="cancelButton"
                    label="Cancel"
                    onTouchTap={::this.handleCancel}
                    primary={true}
                />
            );
        }
    }

    renderTokens(tokens, onClearToken) {
        if (tokens) {
            return tokens.map((token, index) => {
                return (
                    <AutoCompleteToken
                        key={`token-${index}`}
                        label={token.value}
                        onTouchTap={onClearToken}
                    />
                );
            });
        }
    }

    render() {
        const {
            focused,
            inputContainerStyle,
            onBlur,
            onClearToken,
            onSelect,
            placeholderText,
            showCancel,
            style,
            tokens,
            ...other
        } = this.props;
        return (
            <div
                className="row"
                {...other}
                onBlur={::this.handleBlur}
                onKeyDown={this.handleKeyDown.bind(this)}
                style={{...this.styles().root, ...style}}
            >
                <div className="row" style={{...this.styles().inputContainer, ...inputContainerStyle}}>
                    <SearchIcon is="SearchIcon" />
                    {this.renderTokens(tokens, onClearToken)}
                    <input
                        is="input"
                        onChange={::this.handleChange}
                        onFocus={::this.handleFocus}
                        placeholder={!this.props.tokens ? placeholderText : ''}
                        ref="input"
                        type="text"
                        value={this.state.value}
                    />
                    {this.renderCancelButton(showCancel)}
                </div>
                <div>
                    {this.renderMenu()}
                </div>
            </div>
        );
    }

}

export default AutoComplete;
