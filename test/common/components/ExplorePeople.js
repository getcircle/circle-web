import expect from 'expect';

import CenterLoadingIndicator from '../../../src/common/components/CenterLoadingIndicator';
import ExplorePeople from '../../../src/common/components/ExplorePeople';
import Explore from '../../../src/common/components/Explore';
import InfiniteProfilesGrid from '../../../src/common/components/InfiniteProfilesGrid';

const setup = buildSetup(ExplorePeople);

describe('ExplorePeople', () => {

    it('renders a loading indicator if we don\'t have any profiles', () => {
        const { wrapper } = setup({profiles: undefined});
        expect(wrapper.find(CenterLoadingIndicator).length).toEqual(1);
    });

    it('renders the Explore component', () => {
        const { wrapper } = setup({profilesCount: 10});
        const explore = wrapper.find(Explore);
        expect(explore.length).toEqual(1);
        expect(explore.prop('noun')).toEqual('People');
        expect(explore.prop('count')).toEqual(10);
    });

    it('renders an infinite profiles grid', () => {
        const { wrapper, props } = setup({ profiles: factories.profile.getProfiles(3) });
        expect(wrapper.find(InfiniteProfilesGrid).length).toEqual(1);
        expect(wrapper.find(InfiniteProfilesGrid).prop('profiles')).toEqual(props.profiles);
    });

});
