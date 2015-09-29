import Immutable from 'immutable';
import StyleResizable from 'material-ui/lib/mixins/style-resizable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    deviceSize: null,
    displayHeader: false,
    displayFooter: false,
    largerDevice: true,
});

const HEADER_AND_FOOTERLESS_PATHS = ['/', '/billing'];

export default function responsive(state = initialState, action) {
    const { Sizes } = StyleResizable.statics;
    switch(action.type) {
    case types.TOGGLE_DISPLAY_HEADER:
        const display = action.payload;
        if (display && state.get('deviceSize') === Sizes.SMALL) {
            // ignore requests to display header on small devices
            return state;
        }
        return state.set('displayHeader', display);
    case types.DEVICE_RESIZED:
        const {
            pathname,
            deviceSize,
        } = action.payload;
        const largerDevice = deviceSize !== Sizes.SMALL;

        let displayHeader;
        let displayFooter;
        if (HEADER_AND_FOOTERLESS_PATHS.includes(pathname)) {
            displayHeader = false;
            displayFooter = false;
        } else if (!largerDevice) {
            displayFooter = true;
            displayHeader = false;
        } else {
            displayHeader = true;
            displayFooter = false;
        }
        return state.withMutations(map => {
            return map.set('displayFooter', displayFooter)
                .set('displayHeader', displayHeader)
                .set('largerDevice', largerDevice)
                .set('deviceSize', deviceSize);
        });
    default:
        return state;
    }
}
