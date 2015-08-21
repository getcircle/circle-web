import _ from 'lodash';
import { Avatar } from 'material-ui';
import React, { PropTypes } from 'react';

import { getRandomColor } from '../utils/avatars';

import StyleableComponent from './StyleableComponent';

const styles = {
    avatar: {
        display: 'flex',
        height: 40,
        width: 40,
    },
};

class TextFallbackAvatar extends StyleableComponent {

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

    _handleImageError() {
        this.setState({imageSrc: null});
    }

    _renderText() {
        if (!this.state.imageSrc) {
            return this.props.fallbackText;
        }
    }

    render() {
        const avatarStyle = _.assign({}, styles.avatar, this.props.style);
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
                    style={avatarStyle}
                >
                    {this._renderText()}
                </Avatar>
            </div>
        );
    }
}

export default TextFallbackAvatar;
