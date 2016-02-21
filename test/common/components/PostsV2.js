import expect from 'expect';
import { services } from 'protobufs';

import CenterLoadingIndicator from '../../../src/common/components/CenterLoadingIndicator';
import InfinitePostsList from '../../../src/common/components/InfinitePostsList';
import Posts, { EmptyState, Tabs } from '../../../src/common/components/PostsV2';

const { LISTED, DRAFT } = services.post.containers.PostStateV1;

const setup = buildSetup(Posts, () => {
    return {
        onLoadMore: () => {},
        onSelectItem: () => {},
        posts: {
            [LISTED]: {
                posts: factories.post.getPosts(4, LISTED),
                count: 4,
            },
            [DRAFT]: {
                posts: factories.post.getPosts(4, DRAFT),
                count: 4,
            },
        },
        state: LISTED,
    };
});

describe('Posts', () => {

    it('loads the post tabs', () => {
        const { wrapper } = setup();
        expect(wrapper.find(Tabs).length).toEqual(1);
    });

    it('loads a loading indicator if we don\'t have any posts for the current state', () => {
        const props = {
            posts: {
                [LISTED]: {},
                [DRAFT]: {
                    posts: factories.post.getPosts(4, DRAFT),
                },
            },
        };
        const { wrapper } = setup(props);
        expect(wrapper.find(CenterLoadingIndicator).length).toEqual(1);
        expect(wrapper.find(Tabs).length).toEqual(1, 'Tabs should also be visible');
    });

    it('loads an InfinitePostsList with the current state\'s posts', () => {
        const { wrapper, props } = setup();
        const list = wrapper.find(InfinitePostsList);
        expect(list.length).toEqual(1);
        expect(list.prop('posts')).toEqual(props.posts[LISTED].posts);
    });

    it('doesn\'t load a loading indicator if we don\'t have any posts', () => {
        const props = {
            posts: {[LISTED]: {loading: false, posts: [], loaded: true}},
        };
        const { wrapper } = setup(props);
        expect(wrapper.find(CenterLoadingIndicator).length).toEqual(0);
        expect(wrapper.find(EmptyState).length).toEqual(1);
    });

});
