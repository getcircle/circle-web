import React, { Component, PropTypes } from 'react';
import { services } from 'protobufs';

import { ListItem } from 'material-ui';

import moment from '../../utils/moment';

class PostItem extends Component {

    shouldComponentUpdate(nextProps) {
        return this.props.post.id !== nextProps.post.id;
    }

    handleTouchTap = () => {
    }

    render() {
        const { post, ...other } = this.props;
        const { muiTheme } = this.context;
        const styles = {
            primaryText: {
                fontSize: '1.6rem',
                fontWeight: muiTheme.luno.fontWeights.bold,
                lineHeight: '2.4rem',
            },
            secondaryText: {
                color: muiTheme.luno.colors.extraLightBlack,
                fontSize: '1.4rem',
                lineHeight: '2rem',
            },
        };

        const secondaryText = (
            <div>
                <span style={styles.secondaryText}>{moment(post.created).fromNow()}</span>
            </div>
        );
        return (
            <div {...other}>
                <ListItem
                    onTouchTap={this.handleTouchTap}
                    primaryText={<span style={styles.primaryText}>{post.title}</span>}
                    secondaryText={secondaryText}
                    secondaryTextLines={2}
                />
            </div>
        );
    }

}

PostItem.propTypes = {
    post: PropTypes.instanceOf(services.post.containers.PostV1),
};

PostItem.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default PostItem;
