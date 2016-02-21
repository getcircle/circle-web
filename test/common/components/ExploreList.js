import expect from 'expect';
import Immutable from 'immutable';

import ExploreList, { ExploreItem } from '../../../src/common/components/ExploreList';
import InfiniteGrid from '../../../src/common/components/InfiniteGrid';
import { createPostResult } from '../../../src/common/components/SearchResultsList/factories';

const setup = buildSetup(ExploreList, () => {
    return {
        hasMore: false,
        onLoadMore: () => {},
        factory: post => createPostResult({post, highlight: Immutable.Map()}, {}),
    }
});

describe('ExploreList', () => {

    it('renders an InfiniteGrid', () => {
        const { wrapper, props } = setup({items: factories.post.getPosts(4)}, ExploreList);
        const grid = wrapper.find(InfiniteGrid);
        expect(grid.length).toEqual(1);
        expect(grid.prop('children').length).toEqual(props.items.length);
        expect(wrapper.find(ExploreItem).length).toEqual(props.items.length);
    });

});
