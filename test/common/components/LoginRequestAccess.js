import mui from 'material-ui';
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import LoginRequestAccess from '../../../src/common/components/LoginRequestAccess';

const { RaisedButton } = mui;

function setup(overrides) {
    const defaults = {
        onRequestAccess: expect.createSpy(),
    }
    const props = Object.assign({}, defaults, overrides);

    let output = TestUtils.renderIntoDocument(<LoginRequestAccess {...props} />);
    return {
        props,
        output,
    };
}

describe('LoginRequestAccess', () => {

    describe('request access', () => {

        it('is enabled by default', () => {
            const { output } = setup();
            const button = TestUtils.findRenderedComponentWithType(output, RaisedButton);
            expect(button.props.disabled).toNotExist();
        });

        it('is disabled after it has been selected', () => {
            const { output } = setup();
            const button = TestUtils.findRenderedComponentWithType(output, RaisedButton);
            button.props.onTouchTap();
            expect(button.props.label).toContain('Access Requested');
            expect(button.props.disabled).toExist();
        });

        it('calls onRequestAccess when selected', () => {
            const { output, props } = setup();
            const button = TestUtils.findRenderedComponentWithType(output, RaisedButton);
            button.props.onTouchTap();
            expect(props.onRequestAccess.calls.length).toBe(1);
        });

    });

});
