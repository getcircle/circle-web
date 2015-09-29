import expect from 'expect';

import { deviceResized } from '../../src/actions/device';
import { Sizes } from '../../src/decorators/resizable';
import responsive from '../../src/reducers/responsive';

describe('responsive reducer', () => {

    it('defaults to a largerDevice', () => {
        const state = responsive(undefined, {});
        expect(state.get('largerDevice')).toExist();
    });

    it('doesn\'t display the header or footer on the homepage', () => {
        const state = responsive(undefined, deviceResized(Sizes.LARGE, '/'));
        expect(state.get('displayHeader')).toNotExist();
        expect(state.get('displayFooter')).toNotExist();
    });

    it('doesn\'t display the header or footer on the billing page', () => {
        const state = responsive(undefined, deviceResized(Sizes.SMALL, '/billing'));
        expect(state.get('displayFooter')).toNotExist();
        expect(state.get('displayHeader')).toNotExist();
    });

    it('displays the header and not the footer when device is resized to a large device', () => {
        const state = responsive(undefined, deviceResized(Sizes.LARGE, '/profile/123123'));
        expect(state.get('displayFooter')).toNotExist();
        expect(state.get('displayHeader')).toExist();
    });

    it('displays teh footer and not the header when device is resized to a small device', () => {
        const state = responsive(undefined, deviceResized(Sizes.SMALL, '/profile/1233423'));
        expect(state.get('displayFooter')).toExist();
        expect(state.get('displayHeader')).toNotExist();
    });

});
