import expect from 'expect';

import CenterLoadingIndicator from '../../../src/common/components/CenterLoadingIndicator';
import ExploreKnowledge, { ExploreKnowledgeItem, ExploreKnowledgeList } from '../../../src/common/components/ExploreKnowledge';
import Explore from '../../../src/common/components/Explore';
import InfiniteGrid from '../../../src/common/components/InfiniteGrid';

const setup = buildSetup(ExploreKnowledge, () => {
    return {
        hasMore: false,
        onLoadMore: () => {},
    }
});

describe('ExploreKnowledge', () => {

    it('renders a loading indicator if we don\'t have any posts', () => {
        const { wrapper } = setup({posts: undefined});
        expect(wrapper.find(CenterLoadingIndicator).length).toEqual(1);
    });

    it('renders the Explore component', () => {
        const { wrapper } = setup({postsCount: 10});
        const explore = wrapper.find(Explore);
        expect(explore.length).toEqual(1);
        expect(explore.prop('noun')).toEqual('Posts');
        expect(explore.prop('count')).toEqual(10);
    });

    it('renders the ExploreKnowledgeList with posts', () => {
        const { wrapper, props } = setup({posts: factories.post.getPosts(4)});
        expect(wrapper.find(ExploreKnowledgeList).length).toEqual(1);
        expect(wrapper.find(ExploreKnowledgeList).prop('posts')).toEqual(props.posts);
    });

    describe('ExploreKnowledgeList', () => {

        it('renders an InfiniteGrid', () => {
            const { wrapper, props } = setup({posts: factories.post.getPosts(4)}, ExploreKnowledgeList);
            const grid = wrapper.find(InfiniteGrid);
            expect(grid.length).toEqual(1);
            expect(grid.prop('children').length).toEqual(props.posts.length);
            expect(wrapper.find(ExploreKnowledgeItem).length).toEqual(props.posts.length);
        });

    });

});
