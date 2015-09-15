import { Avatar } from 'material-ui';
import React, { PropTypes } from 'react';

import { getRandomColor } from '../utils/avatars';

import CSSComponent from './CSSComponent';

class TextFallbackAvatar extends CSSComponent {

    static propTypes = {
        className: PropTypes.string,
        fallbackText: PropTypes.string,
        src: PropTypes.string,
        style: PropTypes.object,
    }

    constructor() {
        super();
        this.state = {
            imageSrc: null,
        };
    }

    componentWillMount() {
        this.setState({imageSrc: this.props.src});
    }

    componentWillReceiveProps(nextProps) {
        this.setState({imageSrc: nextProps.src});
    }

    classes() {
        return {
            default: {
                avatar: {
                    display: 'flex',
                    height: 40,
                    width: 40,
                    objectFit: 'cover',
                },
            }
        }
    }

    _handleImageError() {
        this.setState({imageSrc: null});
    }

    _renderText() {
        if (!this.state.imageSrc) {
            return this.props.fallbackText;
        }
    }

    render() {
        let backgroundColor;
        if (!this.state.imageSrc && this.props.fallbackText.length > 0) {
            backgroundColor = getRandomColor(this.props.fallbackText);
        }

        return (
            <div className={this.props.className}>
                <Avatar
                    backgroundColor={backgroundColor}
                    // XXX remove these classes, we should standardize on inline style
                    className="content--center--h content--center--v"
                    onError={this._handleImageError.bind(this)}
                    src={this.state.imageSrc}
                    style={{...this.styles().avatar,...this.props.style}}
                >
                    {this._renderText()}
                </Avatar>
            </div>
        );
    }
}

export default TextFallbackAvatar;
