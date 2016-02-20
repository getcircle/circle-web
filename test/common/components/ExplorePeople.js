import expect from 'expect';

import CenterLoadingIndicator from '../../../src/common/components/CenterLoadingIndicator';
import DetailSection from '../../../src/common/components/DetailSectionV2';
import ExplorePeople from '../../../src/common/components/ExplorePeople';
import InfiniteProfilesGrid from '../../../src/common/components/InfiniteProfilesGrid';

const setup = buildSetup(ExplorePeople);

describe('ExplorePeople', () => {

    it('renders the people header', () => {
        const { wrapper } = setup();
        expect(wrapper.find('h1').length).toEqual(1);
        expect(wrapper.find('h1').text()).toEqual('People ');
    });

    it('includes the count if available', () => {
        const { wrapper } = setup({profilesCount: 100});
        expect(wrapper.find('h1').text()).toEqual('People (100)');
    });

    it('renders a DetailSection', () => {
        const { wrapper } = setup();
        expect(wrapper.find(DetailSection).length).toEqual(1);
    });

    it('renders a loading indicator if we don\'t have any profiles', () => {
        const { wrapper } = setup({profiles: undefined});
        expect(wrapper.find(CenterLoadingIndicator).length).toEqual(1);
    });

    it('renders an infinite profiles grid', () => {
        const { wrapper, props } = setup({ profiles: factories.profile.getProfiles(3) });
        expect(wrapper.find(InfiniteProfilesGrid).length).toEqual(1);
        expect(wrapper.find(InfiniteProfilesGrid).prop('profiles')).toEqual(props.profiles);
    });

});
