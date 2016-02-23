import React, { Component, PropTypes } from 'react';
import { services } from 'protobufs';

import { routeToSearch } from '../../utils/routes';

import DetailContent from '../DetailContent';

import Content from './Content';
import Header, { Author, AuthorOptionsMenu } from './Header';
import Footer from './Footer';

class Post extends Component {

    componentDidMount() {
        const hashtags = document.getElementsByClassName('hashtag');
        for (let i = 0; i < hashtags.length; i++) {
            hashtags[i].addEventListener('click', (event) => {
                routeToSearch(event.target.innerText);
            });
        }
    }

    render() {
        const { onDelete, post, ...other } = this.props;
        return (
            <DetailContent style={{paddingTop: 10}}>
                <Header post={post} />
                <Content post={post} />
                <Footer post={post} />
            </DetailContent>
        );
    }
};

Post.propTypes = {
    onDelete: PropTypes.func,
    post: PropTypes.instanceOf(services.post.containers.PostV1),
};

// export for testing
export { Author, AuthorOptionsMenu, Content, Footer, Header };
export default Post;
