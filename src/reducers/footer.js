import Immutable from 'immutable';
import StyleResizable from 'material-ui/lib/mixins/style-resizable';

import * as types from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    display: false
});

// TODO make more DRY with reducers/header.js

export default function header(state = initialState, action) {
    switch(action.type) {
    case types.DEVICE_RESIZED:
        if (action.payload.deviceSize === StyleResizable.statics.Sizes.SMALL) {
            return state.set('display', true);
        } else {
            return state.set('display', false);
        }
    default:
        return state;
    }
}
