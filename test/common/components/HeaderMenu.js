import expect from 'expect';
import Immutable from 'immutable';
import Menu from 'material-ui/lib/menus/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import then from '../utils/then';

import HeaderMenu from '../../../src/common/components/HeaderMenu';
import ProfileAvatar from '../../../src/common/components/ProfileAvatar';

import componentWithContext from '../../componentWithContext';
import AuthContextFactory from '../../factories/AuthContextFactory';
import TeamFactory from '../../factories/TeamFactory';

function setup(propOverrides, contextOverrides) {
    const defaultProps = {
        dispatch: expect.createSpy(),
    }
    const props = Object.assign({}, defaultProps, propOverrides);

    const Container = componentWithContext(<HeaderMenu {...props} />, contextOverrides);
    const container = TestUtils.renderIntoDocument(<Container />);
    const headerMenu = TestUtils.findRenderedComponentWithType(container, HeaderMenu);
    return {
        headerMenu,
        props,
    };
}

describe('HeaderMenu', () => {

    it('menu is hidden by default', () => {
        const { headerMenu } = setup();
        const menuItems = TestUtils.scryRenderedComponentsWithType(headerMenu, MenuItem);
        expect(menuItems.length).toBe(0);
    });

    it('menu toggles state on click', () => {
        const { headerMenu } = setup();

        TestUtils.Simulate.click(headerMenu.refs.container);
        then(() => {
            expect(headerMenu.state.menuDisplayed).toBe(true);
        });

        TestUtils.Simulate.click(headerMenu.refs.container);
        then(() => {
            expect(headerMenu.state.menuDisplayed).toBe(false);
        });
    });

    it('menu dismisses on esc', () => {
        const { headerMenu } = setup();

        TestUtils.Simulate.click(headerMenu.refs.container);
        then(() => {
            let menu = TestUtils.findRenderedComponentWithType(headerMenu, Menu);
            menu.props.onEscKeyDown();
        }).then(() => {
            expect(headerMenu.state.menuDisplayed).toBe(false);
        }, 100);
    });

    //it.only('renders a profile avatar', () => {
        //const { headerMenu } = setup();
        //const profileAvatar = TestUtils.findRenderedComponentWithType(headerMenu, ProfileAvatar);
        //expect(profileAvatar).toExist();
        //expect(profileAvatar.props.profile.id).toBe(headerMenu.context.auth.profile.id);
    //});

    it('shows profile name in expanded mode and defaults to it', () => {
        const { headerMenu } = setup();
        const output = headerMenu.renderProfileName();
        expect(output).toExist();
    });

    it('doesn\'t show profile name if expanded view is not requested', () => {
        const { headerMenu } = setup({
            expandedView: false,
        });

        const output = headerMenu.renderProfileName();
        expect(output).toNotExist();
    });

    it('shows two menu items (My Profile and Logout) by default for everyone', () => {
        const { headerMenu } = setup();
        TestUtils.Simulate.click(headerMenu.refs.container);

        then(() => {
            const menuItems = TestUtils.scryRenderedComponentsWithType(headerMenu, MenuItem);
            expect(menuItems.length).toBe(2);

            const viewProfileHandlerSpy = expect.spyOn(headerMenu, 'handleViewProfile');
            const logoutHandlerSpy = expect.spyOn(headerMenu, 'handleLogout');
            menuItems.map((item) => {
                item.props.onTouchTap();
            });

            expect(viewProfileHandlerSpy.calls.length).toBe(1);
            expect(logoutHandlerSpy.calls.length).toBe(1);
        });
    });

    it('shows team menu item if user manages a team', () => {
        const auth = AuthContextFactory.getContext(undefined, TeamFactory.getTeam());
        const { headerMenu } = setup({}, {auth});
        TestUtils.Simulate.click(headerMenu.refs.container);
        then(() => {
            const menuItems = TestUtils.scryRenderedComponentsWithType(headerMenu, MenuItem);
            expect(menuItems.length).toBe(3);

            const viewTeamHandlerSpy = expect.spyOn(headerMenu, 'handleViewTeam');
            menuItems[1].props.onTouchTap();
            expect(viewTeamHandlerSpy.calls.length).toBe(1);
        });
    });

    it('shows my knowledge if feature flag is set', () => {
        const { headerMenu } = setup({}, {
            flags: Immutable.Map({posts: true}),
        });
        TestUtils.Simulate.click(headerMenu.refs.container);

        then(() => {
            const menuItems = TestUtils.scryRenderedComponentsWithType(headerMenu, MenuItem);
            expect(menuItems.length).toBe(3);

            const viewKnowledgeHandlerSpy = expect.spyOn(headerMenu, 'handleViewKnowledge');
            menuItems[1].props.onTouchTap();
            expect(viewKnowledgeHandlerSpy.calls.length).toBe(1);
        });
    });

    it('hides my knowledge if feature flag is there but set to false', () => {
        const { headerMenu } = setup({}, {
            flags: Immutable.Map({posts: false}),
        });
        TestUtils.Simulate.click(headerMenu.refs.container);

        then(() => {
            const menuItems = TestUtils.scryRenderedComponentsWithType(headerMenu, MenuItem);
            expect(menuItems.length).toBe(2);

            const output = headerMenu.renderMyKnowledgeMenuItem();
            expect(output.type).toBe('span');
        });
    });

});
