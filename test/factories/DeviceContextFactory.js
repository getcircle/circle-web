import { Sizes } from '../../src/common/decorators/resizable';

export default {

    getContext(deviceSize = Sizes.LARGE, mobileOS = false, mounted = true) {
        return {
            deviceSize,
            mobileOS,
            mounted,
            largerDevice: deviceSize !== Sizes.LARGE,
        }
    }

};
