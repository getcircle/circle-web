import Immutable from 'immutable';
import StyleResizable from 'material-ui/lib/mixins/style-resizable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    deviceSize: null,
    displayHeader: false,
    displayFooter: false,
    largerDevice: true,
});

export default function header(state = initialState, action) {
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
        if (!largerDevice) {
            return state.withMutations(map => {
                return map.set('displayHeader', false)
                    .set('displayFooter', true)
                    .set('largerDevice', largerDevice)
                    .set('deviceSize', deviceSize);
                });
        } else {
            // TODO move this logic somewhere...more logical
            if (pathname === '/') {
                return state.withMutations(map => {
                    return map.set('displayFooter', false)
                        .set('displayHeader', false)
                        .set('largerDevice', largerDevice)
                        .set('deviceSize', deviceSize);
                    });
            } else {
                return state.withMutations(map => {
                    return map.set('displayFooter', false)
                        .set('displayHeader', true)
                        .set('largerDevice', largerDevice)
                        .set('deviceSize', deviceSize);
                });
            }
        }
    default:
        return state;
    }
}
