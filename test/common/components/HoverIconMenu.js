import expect from 'expect';
import { shallow } from 'enzyme';
import React from 'react';

import IconMenu from '../../../src/common/components/IconMenu';
import HoverIconMenu from '../../../src/common/components/HoverIconMenu';

function setup(propsOverrides) {
    const props = {
        children: [],
        hover: false,
        iconElement: <span />,
        ...propsOverrides,
    };
    const wrapper = shallow(<HoverIconMenu {...props} />);
    return {
        props,
        wrapper,
    };
}

function visible(wrapper) {
    wrapper.update();
    const style = wrapper.find(IconMenu).prop('style');
    return style.display !== 'none';
}

describe('HoverIconMenu', () => {

    describe('displaying', () => {

        it('shows if hovered', () => {
            const { wrapper } = setup({hover: true});
            expect(visible(wrapper)).toBe(true);
        });

        it('hides if not hovered and not already open', () => {
            const { wrapper } = setup({hover: false});
            expect(visible(wrapper)).toNotBe(true);
        });

        it('shows if not hovered but already open', () => {
            const { wrapper } = setup({hover: false});
            wrapper.find(IconMenu).prop('onRequestChange')(true);
            expect(visible(wrapper)).toBe(true);
        });

    });

});
