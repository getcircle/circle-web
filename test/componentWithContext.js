import expect from 'expect';
import Immutable from 'immutable';
import { PropTypes } from 'react';

import CSSComponent from '../src/common/components/CSSComponent';
import InternalPropTypes from '../src/common/components/InternalPropTypes';
import { getCustomTheme } from '../src/common/styles/theme';

import AuthContextFactory from './factories/AuthContextFactory';
import DeviceContextFactory from './factories/DeviceContextFactory';
import URLContextFactory from './factories/URLContextFactory';

export default function (child, contextOverrides = {}, childContextTypesOverrides = {}) {
    const defaultContext = {
        auth: AuthContextFactory.getContext(),
        device: DeviceContextFactory.getContext(),
        flags: Immutable.Map(),
        history: {
            pushState: expect.createSpy(),
        },
        mixins: {},
        muiTheme: getCustomTheme(global.navigator.userAgent),
        url: URLContextFactory.getContext(),
        ...contextOverrides,
    }

    class TestComponent extends CSSComponent {

        static childContextTypes = {
            auth: InternalPropTypes.AuthContext,
            device: InternalPropTypes.DeviceContext,
            flags: PropTypes.object,
            history: PropTypes.shape({
                pushState: PropTypes.func.isRequired,
            }).isRequired,
            mixins: PropTypes.object,
            muiTheme: PropTypes.object,
            url: InternalPropTypes.URLContext,
            ...childContextTypesOverrides,
        }

        getChildContext() {
            return defaultContext;
        }

        render() {
            return child;
        };

    }

    return TestComponent;
};
