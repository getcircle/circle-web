import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { ListItem } from 'material-ui';

import moment from '../../utils/moment';
import { routeToEditPost } from '../../utils/routes';

import DetailListItem from '../DetailListItem';

class PostItem extends DetailListItem {

    shouldComponentUpdate(nextProps, nextState) {
        const superChanged = super.shouldComponentUpdate(nextProps, nextState);
        const postChanged = this.props.post.id !== nextProps.post.id;
        return  postChanged || superChanged;
    }

    handleTouchTap = () => {
        routeToEditPost(this.props.post);
    }

    getItem(menu) {
        const { post } = this.props;
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
        const item = (
            <ListItem
                onTouchTap={this.handleTouchTap}
                primaryText={<span style={styles.primaryText}>{post.title}</span>}
                secondaryText={secondaryText}
                secondaryTextLines={2}
            />
        );
        return { item };
    }

}

const propTypes = Object.assign({}, DetailListItem.propTypes);
propTypes.post = PropTypes.instanceOf(services.post.containers.PostV1),
PostItem.propTypes = propTypes;

PostItem.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default PostItem;
