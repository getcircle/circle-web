import React, { Component, PropTypes } from 'react';
import { services } from 'protobufs';

import { ListItem } from 'material-ui';

import moment from '../utils/moment';
import Colors from '../styles/Colors';
import { routeToPost } from '../utils/routes';

const SecondaryText = ({ post }) => {
    const styles = {
        created: {
            color: Colors.extraLightBlack,
        },
        snippet: {
            color: Colors.lightBlack,
        },
        text: {
            fontSize: '1.4rem',
            lineHeight: '2rem',
        },
    };
    return (
        <div>
            <div>
                <span style={{...styles.text, ...styles.created}}>{moment(post.created).format('ll')} &ndash; </span>
                <span style={{...styles.text, ...styles.snippet}}>{post.snippet}</span>
            </div>
        </div>
    );
};

class DetailListItemPost extends Component {

    shouldComponentUpdate(nextProps) {
        return this.props.post.id !== nextProps.post.id;
    }

    handleTouchTap = () => {
        routeToPost(this.props.post);
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
        };
        return (
            <div {...other}>
                <ListItem
                    onTouchTap={this.handleTouchTap}
                    primaryText={<span style={styles.primaryText}>{post.title}</span>}
                    secondaryText={<SecondaryText post={post} />}
                />
            </div>
        );
    }
}

DetailListItemPost.propTypes = {
    post: PropTypes.instanceOf(services.post.containers.PostV1),
};

DetailListItemPost.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default DetailListItemPost;
