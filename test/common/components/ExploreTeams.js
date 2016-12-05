import expect from 'expect';

import CenterLoadingIndicator from '../../../src/common/components/CenterLoadingIndicator';
import ExploreTeams from '../../../src/common/components/ExploreTeams';
import Explore from '../../../src/common/components/Explore';
import ExploreList from '../../../src/common/components/ExploreList';

const setup = buildSetup(ExploreTeams);

describe('ExploreTeams', () => {

    it('renders a loading indicator if we don\'t have any posts', () => {
        const { wrapper } = setup({teams: undefined});
        expect(wrapper.find(CenterLoadingIndicator).length).toEqual(1);
    });

    it('renders the Explore component', () => {
        const { wrapper } = setup({teamsCount: 10});
        const explore = wrapper.find(Explore);
        expect(explore.length).toEqual(1);
        expect(explore.prop('noun')).toEqual('Teams');
        expect(explore.prop('count')).toEqual(10);
    });

    it('renders the ExploreList with teams', () => {
        const { wrapper, props } = setup({teams: factories.team.getTeams(4)});
        expect(wrapper.find(ExploreList).length).toEqual(1);
        expect(wrapper.find(ExploreList).prop('items').length).toEqual(props.teams.length);
    });


});
