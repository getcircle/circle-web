import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { ListItem } from 'material-ui';

import t from '../utils/gettext';
import moment from '../utils/moment';
import Colors from '../styles/Colors';
import { routeToPost } from '../utils/routes';

import DetailListItem from './DetailListItem';

const SecondaryText = ({ post }) => {
    const styles = {
        created: {
            color: Colors.extraLightBlack,
        },
        main: {
            color: Colors.lightBlack,
        },
        text: {
            fontSize: '1.4rem',
            lineHeight: '2rem',
        },
    };

    let author;
    if (post.by_profile) {
        const title = post.by_profile.title ? `(${post.by_profile.title})` : '';
        const tagline = t(`By ${post.by_profile.full_name} ${title}`);
        author = <span style={{...styles.text, ...styles.main}}>{tagline}</span>;
    }
    return (
        <div>
            <div>
                <span style={{...styles.text, ...styles.created}}>{moment(post.created).fromNow()} &ndash; </span>
                {author}
                <br />
                <span style={{...styles.text, ...styles.main}}>{post.snippet}</span>
            </div>
        </div>
    );
};

class DetailListItemCollection extends DetailListItem {

    shouldComponentUpdate(nextProps, nextState) {
        const superChanged = super.shouldComponentUpdate(nextProps, nextState);
        const itemChanged = this.props.item.id !== nextProps.item.id;
        return superChanged || itemChanged;
    }

    handleTouchTap = () => {
        routeToPost(this.props.item.post);
    }

    getItem() {
        const { item: { post }, ...other } = this.props;
        const { muiTheme } = this.context;
        const styles = {
            primaryText: {
                fontSize: '1.6rem',
                fontWeight: muiTheme.luno.fontWeights.bold,
                lineHeight: '2.4rem',
            },
        };
        const item = (
            <div {...other}>
                <ListItem
                    onTouchTap={this.handleTouchTap}
                    primaryText={<span style={styles.primaryText}>{post.title}</span>}
                    secondaryText={<SecondaryText post={post} />}
                />
            </div>
        );
        return { item };
    }
}

const propTypes = Object.assign({}, DetailListItem.propTypes);
propTypes.item = PropTypes.instanceOf(services.post.containers.CollectionItemV1),
DetailListItemCollection.propTypes = propTypes;

DetailListItemCollection.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default DetailListItemCollection;
