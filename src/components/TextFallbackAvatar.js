import _ from 'lodash';
import mui from 'material-ui';
import React from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import { getRandomColor } from '../utils/avatars';

const { Avatar } = mui;

const styles = {
    avatar: {
        display: 'flex',
    },
};

class TextFallbackAvatar extends React.Component {
    shouldComponentUpdate = shouldPureComponentUpdate;

    static propTypes = {
        src: React.PropTypes.string,
        fallbackText: React.PropTypes.string,
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
                    className="content--center--h content--center--v"
                    src={this.state.imageSrc}
                    style={avatarStyle}
                    onError={this._handleImageError.bind(this)}
                    backgroundColor={backgroundColor}
                >
                    {this._renderText()}
                </Avatar>
            </div>
        );
    }
}

export default TextFallbackAvatar;
