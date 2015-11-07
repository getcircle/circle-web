import expect from 'expect';
import Menu from 'material-ui/lib/menus/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import React from 'react/addons';

import ProfileFactory from '../factories/ProfileFactory';
import TeamFactory from '../factories/TeamFactory';

import HeaderMenu from '../../src/components/HeaderMenu';
import ProfileAvatar from '../../src/components/ProfileAvatar';

const { TestUtils } = React.addons;

function setup(propOverrides) {
    const defaultProps = {
        profile: ProfileFactory.getProfile(),
        managesTeam: null,
        dispatch: expect.createSpy(),
    }

    const props = Object.assign({}, defaultProps, propOverrides);
    const headerMenu = TestUtils.renderIntoDocument(<HeaderMenu {...props} />);

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

        headerMenu.refs.container.props.onTouchTap();
        expect(headerMenu.state.menuDisplayed).toBe(true);

        headerMenu.refs.container.props.onTouchTap();
        expect(headerMenu.state.menuDisplayed).toBe(false);
    });

    it('menu dismisses on esc', () => {
        const { headerMenu } = setup();

        headerMenu.refs.container.props.onTouchTap();
        let menu = TestUtils.findRenderedComponentWithType(headerMenu, Menu);
        menu.props.onEscKeyDown();
        expect(headerMenu.state.menuDisplayed).toBe(false);
    });

    it('renders a profile avatar', () => {
        const { headerMenu, props } = setup();
        const profileAvatar = TestUtils.findRenderedComponentWithType(headerMenu, ProfileAvatar);
        expect(profileAvatar).toExist();
        expect(profileAvatar.props.profile.id).toBe(props.profile.id);
    });

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
        headerMenu.refs.container.props.onTouchTap();

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

    it('shows team menu item if user manages a team', () => {
        const { headerMenu } = setup({
            managesTeam: TeamFactory.getTeam(),
        });
        headerMenu.refs.container.props.onTouchTap();

        const menuItems = TestUtils.scryRenderedComponentsWithType(headerMenu, MenuItem);
        expect(menuItems.length).toBe(3);

        const viewTeamHandlerSpy = expect.spyOn(headerMenu, 'handleViewTeam');
        menuItems[1].props.onTouchTap();
        expect(viewTeamHandlerSpy.calls.length).toBe(1);
    });

});
