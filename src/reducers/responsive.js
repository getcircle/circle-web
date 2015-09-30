import Immutable from 'immutable';
import StyleResizable from 'material-ui/lib/mixins/style-resizable';

import * as types from '../constants/actionTypes';

const HEADER_AND_FOOTERLESS_PATHS = ['/billing'];
const MOBILE_OS = ['iOS', 'Android'];

const os = checkOS();
const mobileOS = MOBILE_OS.indexOf(os) !== -1;
const initialState = Immutable.fromJS({
    deviceSize: null,
    displayHeader: false,
    displayFooter: false,
    largerDevice: true,
    os: os,
    mobileOS: mobileOS,
});

// (C) viazenetti GmbH (Christian Ludwig)
// http://jsfiddle.net/ChristianL/AVyND/
function checkOS() {
  const clientStrings = [{
    s:'Windows',
    r:/(Windows)/
  }, {
    s:'Android',
    r:/Android/
  }, {
    s:'Open BSD',
    r:/OpenBSD/
  }, {
    s:'Linux',
    r:/(Linux|X11)/
  }, {
    s:'iOS',
    r:/(iPhone|iPad|iPod)/
  }, {
    s:'Mac',
    r:/Mac/
  }, {
    s:'UNIX',
    r:/UNIX/
  }, {
    s:'Robot',
    r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/
  }];

  for (let i = 0; i < clientStrings.length; i++) {
    let cs = clientStrings[i];
    if (cs.r.test(navigator.userAgent)) {
      return cs.s;
    }
  }
};

export default function responsive(state = initialState, action, mobileOS = mobileOS) {
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
        if (HEADER_AND_FOOTERLESS_PATHS.indexOf(pathname) !== -1) {
            displayHeader = false;
            displayFooter = false;
        } else if (!largerDevice && mobileOS) {
            displayFooter = true;
            displayHeader = false;
        } else if (pathname === '/') {
            displayFooter = false;
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
