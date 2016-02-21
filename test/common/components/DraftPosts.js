import expect from 'expect';
import { services } from 'protobufs';

import CenterLoadingIndicator from '../../../src/common/components/CenterLoadingIndicator';
import InfinitePostsList from '../../../src/common/components/InfinitePostsList';
import DraftPosts, { EmptyState } from '../../../src/common/components/DraftPosts';

const { DRAFT } = services.post.containers.PostStateV1;

const setup = buildSetup(DraftPosts, () => {
    return {
        onLoadMore: () => {},
        onSelectItem: () => {},
        posts: factories.post.getPosts(4, DRAFT),
        count: 4,
    };
});

describe('DraftPosts', () => {

    it('loads a loading indicator if we don\'t have any posts yet', () => {
        const props = {
            posts: [],
        };
        const { wrapper } = setup(props);
        expect(wrapper.find(CenterLoadingIndicator).length).toEqual(1);
    });

    it('loads an InfinitePostsList with the posts', () => {
        const { wrapper, props } = setup();
        const list = wrapper.find(InfinitePostsList);
        expect(list.length).toEqual(1);
        expect(list.prop('posts')).toEqual(props.posts);
    });

    it('doesn\'t load a loading indicator if we don\'t have any posts', () => {
        const props = {
            posts: [],
            loading: false,
            loaded: true,
        };
        const { wrapper } = setup(props);
        expect(wrapper.find(CenterLoadingIndicator).length).toEqual(0);
        expect(wrapper.find(EmptyState).length).toEqual(1);
    });

});
