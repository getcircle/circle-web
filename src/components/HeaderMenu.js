import Menu from 'material-ui/lib/menus/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import React, { PropTypes } from 'react/addons';

import { logout } from '../actions/authentication';
import { routeToProfile } from '../utils/routes';
import t from '../utils/gettext';
import { tintColor } from '../constants/styles';

import CSSComponent from './CSSComponent';
import IconContainer from './IconContainer';
import LogoutIcon from './LogoutIcon';
import ProfileAvatar from './ProfileAvatar';
import ProfileIcon from './ProfileIcon';

import rectangleIcon from '../images/icons/down_arrow_icon.svg';

const { TransitionGroup } = React.addons;

class HeaderMenu extends CSSComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        expandedView: PropTypes.bool,
        profile: PropTypes.object,
        shouldDisplayName: PropTypes.bool,
    }

    static contextTypes = {
        mixins: PropTypes.object,
        router: PropTypes.object,
    }

    static defaultProps = {
        expandedView: true,
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
                    cursor: 'pointer',
                },
                menu: {
                    backgroundColor: 'transparent',
                    top: 65,
                    right: 10,
                },
                menuListStyle: {
                    backgroundColor: 'rgb(42, 42, 42)',
                    paddingTop: 10,
                    paddingBottom: 10,
                },
                menuItemDivStyle: {
                    color: 'white',
                },
                text: {
                    color: tintColor,
                    lineHeight: 2,
                },
                MenuItemIcon: {
                    height: 28,
                    width: 28,
                },
                MenuItemIconContainer: {
                    stroke: 'rgb(106, 106, 106)',
                },
                MenuItemIconContainerContainer: {
                    border: 0,
                    borderRadius: 0,
                    height: 28,
                    width: 28,
                },
            },
        };
    }

    handleTouchTap(event) {
        this.setState({menuDisplayed: !this.state.menuDisplayed});
    }

    handleViewProfile(event) {
        routeToProfile(this.context.router, this.props.profile);
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
                    onItemTouchTap={::this.hideMenu}
                    width={110}
                >
                    <MenuItem
                        desktop={true}
                        innerDivStyle={{...this.styles().menuItemDivStyle}}
                        leftIcon={<IconContainer
                            IconClass={ProfileIcon}
                            iconStyle={{...this.styles().MenuItemIcon}}
                            is="MenuItemIconContainer"
                            style={{...this.styles().MenuItemIconContainerContainer}}
                        />}
                        onTouchTap={::this.handleViewProfile}
                        primaryText={t('View Profile')}
                    />
                    <MenuItem
                        desktop={true}
                        innerDivStyle={{...this.styles().menuItemDivStyle}}
                        leftIcon={<IconContainer
                            IconClass={LogoutIcon}
                            iconStyle={{...this.styles().MenuItemIcon}}
                            is="MenuItemIconContainer"
                            style={{...this.styles().MenuItemIconContainerContainer}}
                        />}
                        onTouchTap={() => this.props.dispatch(logout())}
                        primaryText={t('Logout')}
                    />
                </Menu>
            );
        }
    }

    renderProfileName() {
        if (this.props.expandedView) {
            return (
                <div className="col-xs">
                    <span is="text">{this.props.profile.first_name}</span>
                </div>
            );
        }
    }

    renderDownArrow() {
        if (this.props.expandedView) {
            return (
                <div>
                    <img is="arrow" src={rectangleIcon} />
                </div>
            );
        }
    }

    render() {
        const {
            profile,
            ...other,
        } = this.props;
        return (
            <div {...other}>
                <div
                    className="row"
                    is="container"
                    onTouchTap={::this.handleTouchTap}
                >
                    <div className="col-xs">
                        <ProfileAvatar profile={profile} />
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
