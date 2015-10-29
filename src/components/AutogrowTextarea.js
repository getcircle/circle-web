import React, { PropTypes } from 'react';

import { trimNewLines } from '../utils/string';

import CSSComponent from './CSSComponent';

class AutogrowTextarea extends CSSComponent {

    static propTypes = {
        additionalHeightDelta: PropTypes.number,
        onChange: PropTypes.func,
        onHeightChange: PropTypes.func,
        placeholder: PropTypes.string,
        rows: PropTypes.number,
        singleLine: PropTypes.bool,
        style: PropTypes.object,
        textareaStyle: PropTypes.object,
        value: PropTypes.string,
    }

    static defaultProps = {
        additionalHeightDelta: 0,
        rows: 1,
        singleLine: false,
    }

    state = {
        height: this.props.rows * 24,
    }

    componentDidMount() {
        this.syncHeight();
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

    syncHeight(newValue) {
        const shadow = React.findDOMNode(this.refs.shadow);
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
                <textarea
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
