import expect from 'expect';
import React from 'react/addons';

import LoginSSO from '../../src/components/LoginSSO';

const { TestUtils } = React.addons;

function setup(overrides) {
    const defaults = {
        authorizationUrl: 'someurl',
        onGuestLogin: expect.createSpy(),
        providerName: 'Okta',
    }
    const props = Object.assign({}, defaults, overrides);

    let renderer = TestUtils.createRenderer();
    renderer.render(<LoginSSO {...props} />);
    let output = renderer.getRenderOutput();

    return {
        props,
        output,
    };
}

describe('LoginSSO', () => {

    describe('providerName', () => {
        it('should render in the sign in section', () => {
            const { output } = setup();
            let [signInSection] = output.props.children;
            let [labelSection, button] = signInSection.props.children;
            expect(labelSection.props.children.props.children).toContain('Okta');
            expect(button.props.label).toContain('Okta');
        });
    });

    describe('onGuestLogin', () => {
        it('should be called when selecting guest account', () => {
            const { output, props } = setup();
            const guestSection = output.props.children[1];
            const link = guestSection.props.children.props.children.props.children[1];
            link.props.onTouchTap();
            expect(props.onGuestLogin.calls.length).toBe(1);
        });
    });

});
