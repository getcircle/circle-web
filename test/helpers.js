import React from 'react';
import { shallow } from 'enzyme';

import { getDefaultContext } from './componentWithContext';

global.then = function (callback, timeout) {
  setTimeout(callback, timeout > 0 ? timeout : 0);
  return {then: then};
};

global.buildSetup = (DefaultComponent, defaultPropsFunc) => (propsOverrides, Component = DefaultComponent, contextOverrides) => {
    let defaultProps = {};
    if (typeof defaultPropsFunc === 'function') {
        defaultProps = defaultPropsFunc();
    }

    const props = {
        ...defaultProps,
        ...propsOverrides,
    };
    const context = getDefaultContext(contextOverrides);
    const wrapper = shallow(<Component {...props} />, { context });
    return {
        wrapper,
        props,
    };
};
