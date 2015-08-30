import Immutable from 'immutable';
import StyleResizable from 'material-ui/lib/mixins/style-resizable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    display: true,
});

export default function header(state = initialState, action) {
    switch(action.type) {
    case types.TOGGLE_DISPLAY_HEADER:
        return state.set('display', action.payload);
    case types.DEVICE_RESIZED:
        const {
            pathname,
            deviceSize,
        } = action.payload;
        if (deviceSize === StyleResizable.statics.Sizes.SMALL) {
            return state.set('display', false);
        // TODO move this logic somewhere...more logical
        } else if (pathname !== '/') {
            return state.set('display', true);
        }
    default:
        return state;
    }
}
