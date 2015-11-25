import expect from 'expect';

import { deviceResized } from '../../../src/common/actions/device';
import { Sizes } from '../../../src/common/decorators/resizable';
import responsive from '../../../src/common/reducers/responsive';

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

    it('doesn\'t display the header or footer on the new post page', () => {
        const state = responsive(undefined, deviceResized(Sizes.LARGE, '/new-post'));
        expect(state.get('displayFooter')).toNotExist();
        expect(state.get('displayHeader')).toNotExist();
    });

    it('doesn\'t display the header or footer on the edit post page', () => {
        const state = responsive(undefined, deviceResized(Sizes.LARGE, '/post/123123/edit'));
        expect(state.get('displayFooter')).toNotExist();
        expect(state.get('displayHeader')).toNotExist();
    });

    it('displays the header and not the footer when device is resized to a large device', () => {
        const state = responsive(undefined, deviceResized(Sizes.LARGE, '/profile/123123'));
        expect(state.get('displayFooter')).toNotExist();
        expect(state.get('displayHeader')).toExist();
    });

    it('displays the footer and not the header when device is resized to a small device and os is mobile', () => {
        const state = responsive(undefined, deviceResized(Sizes.SMALL, '/profile/1233423'), true);
        expect(state.get('displayFooter')).toExist();
        expect(state.get('displayHeader')).toNotExist();
    });

    it('doesn\'t display the footer when the device is small but not a mobile os', () => {
        const state = responsive(undefined, deviceResized(Sizes.SMALL, '/profile/123423423'), false);
        expect(state.get('displayFooter')).toNotExist();
        expect(state.get('displayHeader')).toExist();
    });

});
