import expect from 'expect';

import CenterLoadingIndicator from '../../../src/common/components/CenterLoadingIndicator';
import ExploreKnowledge from '../../../src/common/components/ExploreKnowledge';
import Explore from '../../../src/common/components/Explore';
import ExploreList from '../../../src/common/components/ExploreList';

const setup = buildSetup(ExploreKnowledge);

describe('ExploreKnowledge', () => {

    it('renders a loading indicator if we don\'t have any posts', () => {
        const { wrapper } = setup({posts: undefined});
        expect(wrapper.find(CenterLoadingIndicator).length).toEqual(1);
    });

    it('renders the Explore component', () => {
        const { wrapper } = setup({postsCount: 10});
        const explore = wrapper.find(Explore);
        expect(explore.length).toEqual(1);
        expect(explore.prop('noun')).toEqual('Knowledge');
        expect(explore.prop('count')).toEqual(10);
    });

    it('renders the ExploreList with posts', () => {
        const { wrapper, props } = setup({posts: factories.post.getPosts(4)});
        expect(wrapper.find(ExploreList).length).toEqual(1);
        expect(wrapper.find(ExploreList).prop('items').length).toEqual(props.posts.length);
    });

});
