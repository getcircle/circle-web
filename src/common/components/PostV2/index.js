import React, { Component, PropTypes } from 'react';
import { services } from 'protobufs';

import { routeToSearch } from '../../utils/routes';

import DetailContent from '../DetailContent';

import Content from './Content';
import Collections from './Collections';
import Header, { Author, OptionsMenu } from './Header';
import Footer from './Footer';

class Post extends Component {

    componentDidMount() {
        this.linkHashTags();
    }

    componentDidUpdate() {
        this.linkHashTags();
    }

    linkHashTags() {
        const hashtags = document.getElementsByClassName('hashtag');
        for (let i = 0; i < hashtags.length; i++) {
            hashtags[i].addEventListener('click', (event) => {
                routeToSearch(event.target.innerText);
            });
        }
    }

    render() {
        const { collections, editableCollections, memberships, onDelete, post, ...other } = this.props;
        return (
            <div>
                <DetailContent style={{paddingTop: 10}}>
                    <Header
                        collections={collections}
                        editableCollections={editableCollections}
                        memberships={memberships}
                        post={post}
                    />
                    <Content post={post} />
                    <Footer post={post} />
                </DetailContent>
                <Collections
                    collections={collections}
                />
            </div>
        );
    }
};

Post.propTypes = {
    collections: PropTypes.array,
    editableCollections: PropTypes.array,
    memberships: PropTypes.array,
    onDelete: PropTypes.func,
    post: PropTypes.instanceOf(services.post.containers.PostV1),
};

// export for testing
export { Author, OptionsMenu, Content, Footer, Header };
export default Post;
