import mui from 'material-ui';
import expect from 'expect';
import React from 'react/addons';

import { AUTH_BACKENDS } from '../../src/services/user';

import LoginEmailInput from '../../src/components/LoginEmailInput';
import LoginInternal from '../../src/components/LoginInternal';

const {
    RaisedButton,
    TextField,
} = mui;

const { TestUtils } = React.addons;

function setup(overrides) {
    const defaults = {
        onLogin: expect.createSpy(),
        onGuestSubmit: expect.createSpy(),
        onUseAlternative: expect.createSpy(),
    }
    const props = Object.assign({}, defaults, overrides);

    let output = TestUtils.renderIntoDocument(<LoginInternal {...props} />);

    return {
        props,
        output,
    };
}

describe('LoginInternal', () => {

    describe('email field', () => {
        it('excepts an initial value from props', () => {
            const expectedEmail = 'me@example.com';
            const { output } = setup({email: expectedEmail});
            const emailInput = TestUtils.findRenderedComponentWithType(output, LoginEmailInput);
            expect(emailInput.props.value).toBe(expectedEmail);
        });

        it('updates the state of "email" on change', () => {
            const { output } = setup();
            const emailInput = TestUtils.findRenderedComponentWithType(output, LoginEmailInput);
            emailInput.props.onChange({target: {value: 'v'}});
            expect(output.state.email).toBe('v');
        })

        describe('`onEnterKeyDown`', () => {
            it('calls `onGuestSubmit` when `guest` is `true`', () => {
                const expectedEmail = 'me@example';
                const { output, props } = setup({guest: true});
                output.setState({email: expectedEmail});
                const emailInput = TestUtils.findRenderedComponentWithType(output, LoginEmailInput);
                emailInput.props.onEnter();
                expect(props.onGuestSubmit.calls.length).toBe(1);
                expect(props.onGuestSubmit.calls[0].arguments[0]).toBe(expectedEmail);
            });

            it('does nothing without email being filled in', () => {
                const { output, props } = setup({guest: true});
                const emailInput = TestUtils.findRenderedComponentWithType(output, LoginEmailInput);
                emailInput.props.onEnter();
                expect(props.onGuestSubmit.calls.length).toBe(0);
                expect(props.onLogin.calls.length).toBe(0);
            });
        });
    });

    describe('password field', () => {
        it('updates the state of "password" on change', () => {
            const { output } = setup();
            const passwordInput = TestUtils.scryRenderedComponentsWithType(output, TextField)[1];
            const node = React.findDOMNode(passwordInput.refs.input);
            node.value = 'password';
            TestUtils.Simulate.change(node);
            expect(output.state.password).toBe('password');
        });

        describe('`onEnterKeyDown`', () => {
            it('calls `onLogin` when password is populated', () => {
                const expectedEmail = 'me@example';
                const expectedPassword = 'password';
                const { output, props } = setup({guest: false});
                output.setState({email: expectedEmail, password: expectedPassword});
                const passwordInput = TestUtils.scryRenderedComponentsWithType(output, TextField)[1];
                passwordInput.props.onEnterKeyDown();
                expect(props.onGuestSubmit.calls.length).toBe(0);
                expect(props.onLogin.calls.length).toBe(1);
                expect(props.onLogin.calls[0].arguments).toEqual(
                    [AUTH_BACKENDS.INTERNAL, expectedEmail, expectedPassword]
                );
            });

            it('does nothing without `email` and `password` being filled in', () => {
                const { output, props } = setup({guest: false});
                const passwordInput = TestUtils.scryRenderedComponentsWithType(output, TextField)[1];
                passwordInput.props.onEnterKeyDown();
                expect(props.onGuestSubmit.calls.length).toBe(0);
                expect(props.onLogin.calls.length).toBe(0);
            });
        });
    });

    describe('submit', () => {
        it('is disabled if email and password are blank', () => {
            const { output } = setup();
            const button = TestUtils.findRenderedComponentWithType(output, RaisedButton);
            expect(button.props.disabled).toExist();
        });

        it('is disabled if password is blank', () => {
            const { output } = setup({email: 'value'});
            const button = TestUtils.findRenderedComponentWithType(output, RaisedButton);
            expect(button.props.disabled).toExist();
        });

        it('is disabled if email is blank', () => {
            const { output } = setup();
            const button = TestUtils.findRenderedComponentWithType(output, RaisedButton);
            expect(button.props.disabled).toExist();
        });

        it('is enabled if email and password are populated.', () => {
            const { output } = setup({email: 'value'});
            output.setState({password: 'value'});
            const button = TestUtils.findRenderedComponentWithType(output, RaisedButton);
            expect(button.props.disabled).toNotExist();
        });

        it('calls login when tapped', () => {
            const { output, props } = setup({email: 'value'});
            output.setState({password: 'value'});
            const button = TestUtils.findRenderedComponentWithType(output, RaisedButton);
            button.props.onTouchTap();
            expect(props.onLogin.calls.length).toBe(1);
        });
    });

    describe('guest enabled', () => {
        it('doesn\'t require password to submit', () => {
            const { output } = setup({email: 'value', guest: true});
            const button = TestUtils.findRenderedComponentWithType(output, RaisedButton);
            expect(button.props.disabled).toNotExist();
        });

        it('calls `onGuestSubmit` instead of `onLogin` when primary button is pressed', () => {
            const expectedEmail = 'me@example.com';
            const { output, props } = setup({email: expectedEmail, guest: true});
            const button = TestUtils.findRenderedComponentWithType(output, RaisedButton);
            button.props.onTouchTap();
            expect(props.onLogin.calls.length).toBe(0);
            expect(props.onGuestSubmit.calls.length).toBe(1);
            expect(props.onGuestSubmit.calls[0].arguments[0]).toBe(expectedEmail);
        });
    });

    describe('onUseAlternative', () => {
        it('should be called when selecting alternative', () => {
            const { output, props } = setup({hasAlternative: true});
            const link = TestUtils.findRenderedDOMComponentWithTag(output, 'a');
            link.props.onTouchTap();
            expect(props.onUseAlternative.calls.length).toBe(1);
        });

        it('should not render if `hasAlternative` is false', () => {
            const { output } = setup({hasAlternative: false});
            const links = TestUtils.scryRenderedDOMComponentsWithTag(output, 'a');
            expect(links).toEqual([]);
        });
    });

});
