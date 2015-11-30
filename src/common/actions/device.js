import * as types from '../constants/actionTypes';

export function deviceResized(deviceSize, pathname) {
    return {
        type: types.DEVICE_RESIZED,
        payload: {
            deviceSize: deviceSize,
            pathname: pathname,
        },
    }
}
