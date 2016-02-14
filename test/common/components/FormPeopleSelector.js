import expect from 'expect';
import React from 'react';
import { shallow } from 'enzyme';

import FormPeopleSelector from '../../src/common/components/FormPeopleSelector';

function setup(overrides) {
    const props = {
        ...overrides,
    };
    const wrapper = shallow(<FormPeopleSelector {...props} />);
    return {
        props,
        wrapper,
    };
}

describe('FormPeopleSelector', () => {
});
