import { Sizes } from '../../src/common/decorators/resizable';

export default {

    getContext(deviceSize = Sizes.LARGE, mobileOS = false) {
        return {
            deviceSize,
            mobileOS,
            largerDevice: deviceSize !== Sizes.LARGE,
        }
    }

};
