import ReactDOM from 'react-dom';
import React, { PropTypes } from 'react';
import MediumEditor from 'medium-editor';

import { trimNewLines } from '../utils/string';

import CSSComponent from './CSSComponent';

const DEFAULT_ROW_HEIGHT = 24;

/*
  componentDidMount() {
    var dom = ReactDOM.findDOMNode(this);
    this.medium = new MediumEditor(dom, this.props.options);
    this.medium.subscribe('editableInput', (e) => {
      this._updated = true;
      this.change(dom.innerHTML);
    });
  },

  componentWillUnmount() {
    this.medium.destroy();
  },

  componentWillReceiveProps(nextProps) {
    if(nextProps.text !== this.state.text && !this._updated) {
      this.setState({text: nextProps.text});
    }

    if(this._updated) this._updated = false;
  },

  render() {
    var tag = this.props.tag;
    var props = blacklist(this.props, 'tag', 'contentEditable', 'dangerouslySetInnerHTML');

    assign(props, {
      contentEditable: true,
      dangerouslySetInnerHTML: {__html: this.state.text}
    });

    return React.createElement(tag, props);
  },

  change(text) {
    if(this.props.onChange) this.props.onChange(text, this.medium);
  }
});
*/

class Editor extends CSSComponent {

    static propTypes = {
        options: PropTypes.object,
    }

    static defaultProps = {
    }

    state = {
        text: '',
    }

    componentDidMount() {
        const {
            options,
        } = this.props;

        const dom = ReactDOM.findDOMNode(this);
        this.medium = new MediumEditor(dom, options);
        this.medium.subscribe('editableInput', (e) => {
            this._updated = true;
            this.onChange(dom.innerHTML);
        });
    }

    componentWillUnmount() {
        this.medium.destroy();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.text !== this.state.text && !this._updated) {
            this.setState({
                text: nextProps.text
            });
        }

        if (this._updated) {
            this._updated = false;
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


    onChange(text) {
        if (this.props.onChange) {
            this.props.onChange(text, this.medium);
        }
    }

    render() {
        const {
            ...other,
        } = this.props;

        return (
            <div
                contentEditable={true}
                dangerouslySetInnerHTML={{__html: this.state.text}}
                {...other}
            />
        );
    }
}

export default Editor;
