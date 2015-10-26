import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { fontColors } from '../constants/styles';
import moment from '../utils/moment';
import { routeToPost } from '../utils/routes';
import t from '../utils/gettext';

import CardList from './CardList';
import CardListItem from './CardListItem';
import CardRow from './CardRow';
import CSSComponent from './CSSComponent';
import DetailContent from './DetailContent';

class Posts extends CSSComponent {

    static propTypes = {
        largerDevice: PropTypes.bool.isRequired,
        posts: PropTypes.arrayOf(
            PropTypes.instanceOf(services.post.containers.PostV1)
        ),
    }

    static contextTypes = {
        router: PropTypes.shape({
            transitionTo: PropTypes.func.isRequired,
        }).isRequired,
    }

    classes() {
        return {
            default: {
                headerText: {
                    borderBottom: '1px solid rgba(0, 0, 0, .1)',
                    fontSize: 30,
                    lineHeight: 30,
                    padding: '20px 0',
                    ...fontColors.dark,
                },
                primaryTextStyle: {
                    marginBottom: 5,
                },
                cardListItemInnerDivStyle: {
                    background: 'transparent',
                    borderBottom: '1px solid rgba(0, 0, 0, .1)',
                    padding: 30,
                },
            },
        };
    }

    // Render Methods

    renderPost(post) {
        const lastUpdatedText = `Updated ― ${moment(post.changed).fromNow()}`;
        return (
            <CardListItem
                innerDivStyle={{...this.styles().cardListItemInnerDivStyle}}
                onTouchTap={routeToPost.bind(null, this.context.router, post)}
                primaryText={post.title}
                primaryTextStyle={{...this.styles().primaryTextStyle}}
                secondaryText={lastUpdatedText}
            />
        );
    }

    render() {
        const postElements = this.props.posts.map((post, index) => {
            return this.renderPost(post);
        });

        return (
            <DetailContent>
                <CardRow>
                    <CardList>
                        {postElements}
                    </CardList>
                </CardRow>
            </DetailContent>
        );
    }
}

export default Posts;
