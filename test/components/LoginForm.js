import expect from 'expect';
import React from 'react/addons';

import { AUTH_BACKENDS } from '../../src/services/user';

import LoginForm from '../../src/components/LoginForm';
import LoginInternal from '../../src/components/LoginInternal';
import LoginSSO from '../../src/components/LoginSSO';

const { TestUtils } = React.addons;

function setup(overrides) {
    const defaults = {
        authenticate: expect.createSpy(),
        authorizationUrl: '',
        getAuthenticationInstructions: expect.createSpy(),
        providerName: '',
    }
    const props = Object.assign({}, defaults, overrides);

    let output = TestUtils.renderIntoDocument(<LoginForm {...props} />);

    return {
        props,
        output,
    };
}

describe('LoginForm', () => {

    it('should default to guest if no backend is specified', () => {
        const { output } = setup();
        expect(output.state.guest).toExist();
    });

    it('should default to guest on initial load if the backend is internal', () => {
        const { output } = setup({backend: AUTH_BACKENDS.INTERNAL});
        expect(output.state.guest).toExist();
    })

    describe('guest', () => {
        it('renders the LoginInternal form with `guest` set to `true`', () => {
            const { output } = setup();
            const internal = TestUtils.findRenderedComponentWithType(output, LoginInternal);
            expect(internal.props.guest).toExist();
        });

        it('calls `getAuthenticationInstructions` when the primary action has been selected', () => {
            const { output, props } = setup();
            const internal = TestUtils.findRenderedComponentWithType(output, LoginInternal);
            internal.setState({email: 'value'});
            internal.refs.primary.props.onTouchTap();
            expect(props.getAuthenticationInstructions.calls.length).toBe(1);
        })
    });

    describe('internal', () => {
        it('renders the LoginInternal form with `guest` set to `false` if guest is false', () => {
            const { output } = setup({backend: AUTH_BACKENDS.INTERNAL});
            output.setState({guest: false});
            const internal = TestUtils.findRenderedComponentWithType(output, LoginInternal);
            expect(internal.props.guest).toNotExist();
        });

        it('calls `authenticate` when the primary action has been selected', () => {
            const { output, props } = setup({backend: AUTH_BACKENDS.INTERNAL});
            output.setState({guest: false});
            const internal = TestUtils.findRenderedComponentWithType(output, LoginInternal);
            internal.setState({email: 'value', password: 'value'});
            internal.refs.primary.props.onTouchTap();
            expect(props.authenticate.calls.length).toBe(1);
            expect(props.getAuthenticationInstructions.calls.length).toBe(0);
        });

        it('renders with `hasAlternative` if `hasSingleSignOn` is `true`', () => {
            const { output } = setup({backend: AUTH_BACKENDS.INTERNAL});
            output.setState({hasSingleSignOn: true});
            const internal = TestUtils.findRenderedComponentWithType(output, LoginInternal);
            expect(internal.props.hasAlternative).toExist();
        });

        it('sets guest to `false` and `singleSignOn` to `true` if `onUseAlternative` is called', () => {
            const { output } = setup({backend: AUTH_BACKENDS.INTENRAL});
            output.setState({hasSingleSignOn: true, guest: true});
            const internal = TestUtils.findRenderedComponentWithType(output, LoginInternal);
            internal.props.onUseAlternative();
            expect(output.state.guest).toNotExist();
            expect(output.state.singleSignOn).toExist();
        });
    });

    describe('singleSignOn', () => {
        it('renders the LoginSSO form for Okta backend', () => {
            const { output } = setup({backend: AUTH_BACKENDS.OKTA});
            TestUtils.findRenderedComponentWithType(output, LoginSSO);
        });

        it('renders the LoginSSO form for Google backend', () => {
            const { output } = setup({backend: AUTH_BACKENDS.GOOGLE});
            TestUtils.findRenderedComponentWithType(output, LoginSSO);
        });

        it('sets `guest` to true and renders LoginInternal when `onGuestLogin` is specified', () => {
            const { output } = setup({backend: AUTH_BACKENDS.OKTA});
            const sso = TestUtils.findRenderedComponentWithType(output, LoginSSO);
            sso.props.onGuestLogin();
            expect(output.state.guest).toExist();
            expect(output.state.singleSignOne).toNotExist();
            const internal = TestUtils.findRenderedComponentWithType(output, LoginInternal);
            expect(internal.props.guest).toExist();
        });

        it('caches SSO data so we can switch back from internal auth', () => {
            const expectedAuthorizationUrl = 'someurl';
            const expectedProviderName = 'Okta';
            const { output } = setup({
                backend: AUTH_BACKENDS.OKTA,
                authorizationUrl: expectedAuthorizationUrl,
                providerName: expectedProviderName,
            });
            expect(output.state.hasSingleSignOn).toExist();
            expect(output.state.authorizationUrl).toBe(expectedAuthorizationUrl);
            expect(output.state.providerName).toBe(expectedProviderName);
        });

        it('renders Login SSO if we\'re forcing it back with state', () => {
            const expectedAuthorizationUrl = 'someurl';
            const expectedProviderName = 'Okta';
            const { output } = setup({backend: AUTH_BACKENDS.INTERNAL});
            output.setState({
                hasSingleSignOn: true,
                authorizationUrl: expectedAuthorizationUrl,
                providerName: expectedProviderName,
                internal: false,
                guest: false,
                singleSignOn: true,
            });
            const sso = TestUtils.findRenderedComponentWithType(output, LoginSSO);
            expect(sso.props.authorizationUrl).toBe(expectedAuthorizationUrl);
            expect(sso.props.providerName).toBe(expectedProviderName);
        });

        it('renders LoginInternal if we select guest login again, email should be null', () => {
            const expectedAuthorizationUrl = 'someurl';
            const expectedProviderName = 'Okta';
            const { output } = setup({backend: AUTH_BACKENDS.INTERNAL, email: 'value'});
            output.setState({
                hasSingleSignOn: true,
                authorizationUrl: expectedAuthorizationUrl,
                providerName: expectedProviderName,
                internal: false,
                guest: false,
                singleSignOn: true,
            });
            const sso = TestUtils.findRenderedComponentWithType(output, LoginSSO);
            sso.props.onGuestLogin();
            expect(output.state.email).toNotExist();
        });
    });

});
