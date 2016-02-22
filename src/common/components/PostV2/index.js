import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import DetailContent from '../DetailContent';

import Content from './Content';
import Header, { Author, AuthorOptionsMenu } from './Header';
import Footer from './Footer';

const Post = ({ onDelete, post, ...other }) => {
    return (
        <DetailContent style={{paddingTop: 10}}>
            <Header post={post} />
            <Content post={post} />
            <Footer post={post} />
        </DetailContent>
    );
};

Post.propTypes = {
    onDelete: PropTypes.func,
    post: PropTypes.instanceOf(services.post.containers.PostV1),
};

// export for testing
export { Author, AuthorOptionsMenu, Content, Footer, Header };
export default Post;
