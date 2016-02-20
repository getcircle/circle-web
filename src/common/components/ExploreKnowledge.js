import Immutable from 'immutable';
import React, { Component, PropTypes } from 'react';
import { services } from 'protobufs';

import { ListItem } from 'material-ui';

import t from '../utils/gettext';
import routes from '../utils/routes';

import CenterLoadingIndicator from './CenterLoadingIndicator';
import InfiniteGrid from './InfiniteGrid';
import Explore from './Explore';
import { createPostResult } from './SearchResultsList/factories';

class ExploreKnowledgeItem extends Component {

    handleTouchTap = () => {
        const { item: { payload } } = this.props;
        routes.routeToPost(payload);
    }

    render() {
        const { item: { item }, ...other } = this.props;
        return (
            <div {...other}>
                <ListItem onTouchTap={this.handleTouchTap} {...item} />
            </div>
        );
    }
}

ExploreKnowledgeItem.propTypes = {
    item: PropTypes.shape({
        item: PropTypes.object,
        payload: PropTypes.instanceOf(services.post.containers.PostV1),
    }).isRequired,
};

const ExploreKnowledgeList = ({ posts, ...other }, { muiTheme }) => {
    const theme = muiTheme.luno.searchResults;
    const items = [];
    for (let index in posts) {
        const post = posts[index];
        const result = createPostResult({post, highlight: Immutable.Map()}, theme);
        const item = <ExploreKnowledgeItem className="col-xs-12" item={result} key={`explore-knowledge-${index}`} />;
        items.push(item);
    }
    return <InfiniteGrid children={items} {...other} />;
}

ExploreKnowledgeList.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

const ExploreKnowledge = ({ hasMore, loading, onLoadMore, posts, postsCount, ...other }, { muiTheme }) => {
    let content;
    if (!posts) {
        content = <CenterLoadingIndicator />;
    } else {
        content = (
            <ExploreKnowledgeList
                hasMore={hasMore}
                loading={loading}
                onLoadMore={onLoadMore}
                posts={posts}
            />
        );
    }

    return (
        <Explore count={postsCount} noun={t('Posts')}>
            {content}
        </Explore>
    );
};

ExploreKnowledge.propTypes = {
    hasMore: PropTypes.bool,
    loading: PropTypes.bool,
    nextRequest: PropTypes.object,
    onLoadMore: PropTypes.func,
    onSelectItem: PropTypes.func,
    posts: PropTypes.array,
    postsCount: PropTypes.number,
};

ExploreKnowledge.defaultProps = {
    onSelectItem: () => {},
};

ExploreKnowledge.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

// export for testing
export { ExploreKnowledgeList, ExploreKnowledgeItem };
export default ExploreKnowledge;
