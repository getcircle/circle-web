import expect from 'expect';

import DetailSection from '../../../src/common/components/DetailSectionV2';
import Explore from '../../../src/common/components/Explore';

const setup = buildSetup(Explore);

describe('Explore', () => {

    it('renders the people header', () => {
        const { wrapper } = setup({noun: 'People'});
        expect(wrapper.find('h1').length).toEqual(1);
        expect(wrapper.find('h1').text()).toEqual('People ');
    });

    it('includes the count if available', () => {
        const { wrapper } = setup({count: 100, noun: 'People'});
        expect(wrapper.find('h1').text()).toEqual('People (100)');
    });

    it('renders a DetailSection', () => {
        const { wrapper } = setup();
        expect(wrapper.find(DetailSection).length).toEqual(1);
    });

});
