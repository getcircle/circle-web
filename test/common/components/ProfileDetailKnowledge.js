import expect from 'expect';
import { shallow } from 'enzyme';
import React from 'react';

import { getDefaultContext } from '../../componentWithContext';
import PostFactory from '../../factories/PostFactory';

import CenterLoadingIndicator from '../../../src/common/components/CenterLoadingIndicator';
import ProfileDetailKnowledge, { EmptyState, Posts } from '../../../src/common/components/ProfileDetailKnowledge';
import InfinitePostsList from '../../../src/common/components/InfinitePostsList';

function setup(propsOverrides, Component = ProfileDetailKnowledge) {
    const props = {
        hasMorePosts: false,
        posts: PostFactory.getPosts(3),
        ...propsOverrides,
    };
    const context = getDefaultContext();
    const wrapper = shallow(<Component {...props} />, { context });
    return {
        props,
        wrapper,
    };
}

describe('ProfileDetailKnowledge', () => {

    it('renders the "Knowledge" heading', () => {
        const { wrapper } = setup();
        expect(wrapper.find('h1').text()).toEqual('Knowledge');
    });

    it('renders the Posts', () => {
        const { wrapper } = setup();
        expect(wrapper.find(Posts).length).toEqual(1);
    });

    it('renders a loading indicator if we\'re still loading', () => {
        const { wrapper } = setup({posts: [], postsLoaded: false});
        expect(wrapper.find(CenterLoadingIndicator).length).toEqual(1);
    });

    it('renders EmptyState if we don\'t have any posts', () => {
        const { wrapper } = setup({posts: [], postsLoaded: true});
        expect(wrapper.find(EmptyState).length).toEqual(1);
    });

    describe('DetailListPosts', () => {
        it('renders the posts within DetailListItemPost', () => {
            const { wrapper } = setup({hasMore: false}, Posts);
            expect(wrapper.find(InfinitePostsList).length).toEqual(1);
        });
    });

});
