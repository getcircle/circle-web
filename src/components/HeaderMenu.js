import Menu from 'material-ui/lib/menus/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import { Avatar } from 'material-ui';
import React, { PropTypes } from 'react/addons';

import { logout } from '../actions/authentication';
import t from '../utils/gettext';
import { tintColor } from '../constants/styles';

import CSSComponent from './CSSComponent';

import rectangleIcon from '../images/icons/down_arrow_icon.svg';

const { TransitionGroup } = React.addons;

class HeaderMenu extends CSSComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        inHeader:PropTypes.bool,
        profile: PropTypes.object,
    }

    shouldComponentUpdate(nextProps) {
        if (!nextProps.profile) {
            return false;
        }
        return true;
    }

    state = {
        menuDisplayed: false,
        inHeader: false,
    }

    classes() {
        return {
            default: {
                arrow: {
                    paddingTop: 12,
                    paddingLeft: 10,
                },
                container: {
                    paddingTop: 22,
                    paddingRight: 22,
                    cursor: 'pointer',
                },
                menu: {
                    backgroundColor: 'transparent',
                    top: 65,
                    right: 10,
                },
                menuListStyle: {
                    paddingTop: 10,
                    paddingBottom: 10,
                },
                text: {
                    color: tintColor,
                    lineHeight: 2,
                },
            },
        };
    }

    handleTouchTap(event) {
        this.setState({menuDisplayed: !this.state.menuDisplayed});
    }

    handleLogout(event) {
        this.props.dispatch(logout());
    }

    hideMenu(event) {
        this.setState({menuDisplayed: false});
    }

    renderMenu() {
        if (this.state.menuDisplayed) {
            return (
                <Menu
                    animated={true}
                    desktop={true}
                    is="menu"
                    listStyle={this.styles().menuListStyle}
                    onEscKeyDown={::this.hideMenu}
                    width={110}
                >
                    <MenuItem
                        desktop={true}
                        onTouchTap={::this.handleLogout}
                        primaryText={t('Logout')}
                    />
                </Menu>
            );
        }
    }

    renderProfileName() {
        if (!this.props.inHeader) {
            return (
                <div className="col-xs">
                    <span is="text">{this.props.profile.first_name}</span>
                </div>
            );
        }
    }

    renderDownArrow() {
        if (!this.props.inHeader) {
            return (
                <div>
                    <img is="arrow" src={rectangleIcon} />
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                <div
                    className="row"
                    is="container"
                    onTouchTap={::this.handleTouchTap}
                >
                    <div className="col-xs">
                        <Avatar src={this.props.profile.image_url} />
                    </div>
                    {this.renderProfileName()}
                    {this.renderDownArrow()}
                </div>
                <div className="row start-xs">
                    <TransitionGroup>
                        {this.renderMenu()}
                    </TransitionGroup>
                </div>
            </div>
        );
    }

}

export default HeaderMenu;
