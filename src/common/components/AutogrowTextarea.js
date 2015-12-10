import ReactDOM from 'react-dom';
import React, { PropTypes } from 'react';

import { trimNewLines } from '../utils/string';

import CSSComponent from './CSSComponent';

const DEFAULT_ROW_HEIGHT = 24;

class AutogrowTextarea extends CSSComponent {

    static propTypes = {
        additionalHeightDelta: PropTypes.number,
        autoFocus: PropTypes.bool,
        onChange: PropTypes.func,
        onHeightChange: PropTypes.func,
        onKeyDown: PropTypes.func,
        placeholder: PropTypes.string,
        rows: PropTypes.number,
        singleLine: PropTypes.bool,
        style: PropTypes.object,
        textareaStyle: PropTypes.object,
        value: PropTypes.string,
    }

    static defaultProps = {
        additionalHeightDelta: 0,
        autoFocus: false,
        rows: 1,
        singleLine: false,
    }

    state = {
        height: this.props.rows * DEFAULT_ROW_HEIGHT,
    }

    componentDidMount() {
        this.syncHeight();
        this.attachListeners();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value) {
            this.syncHeight(nextProps.value);
        }
    }

    classes() {
        return {
            default: {
                root: {
                    position: 'relative',
                },
                textareaStyle: {
                    cursor: 'text',
                    outline: 0,
                    padding: 0,
                    resize: 'none',
                    width: '100%',
                },
                shadowStyle: {
                    opacity: 0,
                    outline: 0,
                    overflow: 'hidden',
                    padding: 0,
                    position: 'absolute',
                    resize: 'none',
                    width: '100%',
                }
            },
        };
    }

    attachListeners() {
        if (this.refs.input && this.props.onKeyDown) {
            this.refs.input.addEventListener('keydown', (event) => this.props.onKeyDown(event));
        }
    }

    syncHeight(newValue) {
        const shadow = ReactDOM.findDOMNode(this.refs.shadow);
        const currentHeight = this.state.height;
        let newHeight;

        if (newValue !== undefined) {
            shadow.value = newValue;
        }
        newHeight = shadow.scrollHeight + this.props.additionalHeightDelta;

        if (currentHeight !== newHeight) {
            this.setState({
                height: newHeight,
            });
        }

        if (this.props.onHeightChange) {
            this.props.onHeightChange(newHeight);
        }
    }

    handleChange(event) {
        const value = this.getValue(event.target.value);
        this.syncHeight(value);

        if (this.props.onChange) {
            this.props.onChange(event, value);
        }
    }

    getValue(value) {
        if (this.props.singleLine === true) {
            return trimNewLines(value);
        }

        return value;
    }

    render() {
        const {
            autoFocus,
            placeholder,
            rows,
            style,
            textareaStyle,
            value,
        } = this.props;

        const dynamicHeight={
            height: this.state.height,
        };

        const finalValue = this.getValue(value);

        return (
            <div style={{...this.styles().root, ...style}}>
                { /*
                        The content height inside a textarea is determined by the scroll height
                        but we don't want a scroll bar on the main textarea. It is supposed to
                        just expand to the correct height. So, we need to have a hidden shadow textarea,
                        which gets the content first and then we set the height of the main one to be the
                        scrollheight of the shadow.
                    */
                }
                <textarea
                    autoFocus={autoFocus}
                    onChange={::this.handleChange}
                    placeholder={placeholder}
                    ref="input"
                    rows={rows}
                    style={{...this.styles().textareaStyle, ...textareaStyle, ...dynamicHeight}}
                    value={finalValue}
                />
                <textarea
                    readOnly={true}
                    ref="shadow"
                    rows={rows}
                    style={{...textareaStyle, ...this.styles().shadowStyle}}
                    tabIndex="-1"
                    value={finalValue}
                />
            </div>
        );
    }
}

export default AutogrowTextarea;
