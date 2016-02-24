import expect from 'expect';
import Immutable from 'immutable';
import Menu from 'material-ui/lib/menus/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import React from 'react';
import { shallow } from 'enzyme';

import HeaderMenu from '../../../src/common/components/HeaderMenu';
import ProfileAvatar from '../../../src/common/components/ProfileAvatar';

import { getDefaultContext } from '../../componentWithContext';

const MENU_SELECTOR = '.middle-xs';

function setup(propOverrides, contextOverrides) {
    const defaultProps = {
        dispatch: expect.createSpy(),
    };
    const props = Object.assign({}, defaultProps, propOverrides);
    const context = Object.assign({}, getDefaultContext({}), contextOverrides);

    const wrapper = shallow(<HeaderMenu {...props} />, {context: context});
    return {
        wrapper,
        props,
    };
}

describe('HeaderMenu', () => {

    it('menu is hidden by default', () => {
        const { wrapper } = setup();
        const menuItems = wrapper.find(MenuItem);
        expect(menuItems.length).toBe(0);
    });

    it('menu toggles visibility on click', () => {
        const { wrapper } = setup();

        wrapper.find(MENU_SELECTOR).prop('onTouchTap')();
        wrapper.update();
        const menu = wrapper.find(Menu);
        expect(menu.length).toBe(1);
    });

    it('menu dismisses on esc', () => {
        const { wrapper } = setup();

        wrapper.find(MENU_SELECTOR).prop('onTouchTap')();
        wrapper.update();
        wrapper.find(Menu).prop('onEscKeyDown')();
        wrapper.update();
        const menu = wrapper.find(Menu);
        expect(menu.length).toBe(0);
    });

    it('renders a profile avatar', () => {
        const { wrapper } = setup();
        const profileAvatar = wrapper.find(ProfileAvatar);
        expect(profileAvatar.length).toBe(1);
        expect(profileAvatar.prop('profile').id).toBe(wrapper.context('auth').profile.id);
    });

    it('shows three menu items (My Profile, Create Team, and Logout) by default for everyone', () => {
        const { wrapper } = setup();

        wrapper.find(MENU_SELECTOR).prop('onTouchTap')();
        wrapper.update();

        const menuItems = wrapper.find(MenuItem);
        expect(menuItems.length).toBe(4);

        const viewProfileHandlerSpy = expect.spyOn(wrapper.instance(), 'handleViewProfile');
        const createTeamSpy = expect.spyOn(wrapper.instance(), 'handleCreateTeam');
        const logoutHandlerSpy = expect.spyOn(wrapper.instance(), 'handleLogout');
        menuItems.map((item) => {
            item.props().onTouchTap();
        });

        expect(viewProfileHandlerSpy.calls.length).toBe(1);
        expect(createTeamSpy.calls.length).toBe(1);
        expect(logoutHandlerSpy.calls.length).toBe(1);
    });

    it('shows my knowledge if feature flag is set', () => {
        const { wrapper } = setup({}, {
            flags: Immutable.Map({posts: true}),
        });

        wrapper.find(MENU_SELECTOR).prop('onTouchTap')();
        wrapper.update();

        const menuItems = wrapper.find(MenuItem);
        expect(menuItems.length).toBe(5);

        const viewKnowledgeHandlerSpy = expect.spyOn(wrapper.instance(), 'handleViewKnowledge');
        menuItems.at(1).prop('onTouchTap')();
        expect(viewKnowledgeHandlerSpy.calls.length).toBe(1);
    });

    it('hides my knowledge if feature flag is there but set to false', () => {
        const { wrapper } = setup({}, {
            flags: Immutable.Map({posts: false}),
        });

        wrapper.find(MENU_SELECTOR).prop('onTouchTap')();
        wrapper.update();

        const menuItems = wrapper.find(MenuItem);
        expect(menuItems.length).toBe(4);

        const hasMyKnowledge = menuItems.map(item => item.html())
                                        .some(html => html.match('My Knowledge'));
        expect(hasMyKnowledge).toBe(false);
    });

});
