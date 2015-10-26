import { decorate } from 'react-mixin';
import ClickAwayable from 'material-ui/lib/mixins/click-awayable';
import Menu from 'material-ui/lib/menus/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import React, { PropTypes } from 'react/addons';
import { services } from 'protobufs';

import autoBind from '../utils/autoBind';
import CurrentTheme from '../utils/ThemeManager';
import { logout } from '../actions/authentication';
import { routeToPosts, routeToProfile, routeToTeam } from '../utils/routes';
import t from '../utils/gettext';
import { tintColor } from '../constants/styles';

import CSSComponent from './CSSComponent';
import DownArrowIcon from './DownArrowIcon';
import IconContainer from './IconContainer';
import ProfileAvatar from './ProfileAvatar';

const { TransitionGroup } = React.addons;

const BACKGROUND_COLOR = 'rgb(42, 42, 42)';

@decorate(ClickAwayable)
@decorate(autoBind(ClickAwayable))
class HeaderMenu extends CSSComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        expandedView: PropTypes.bool,
        managesTeam: PropTypes.object,
        profile: PropTypes.object,
        shouldDisplayName: PropTypes.bool,
    }

    static contextTypes = {
        mixins: PropTypes.object,
        router: PropTypes.object,
    }

    static childContextTypes = {
        muiTheme: PropTypes.object,
    }

    static defaultProps = {
        expandedView: true,
    }

    state = {
        menuDisplayed: false,
        inHeader: false,
    }

    getChildContext() {
        return {
            muiTheme: this.getCustomTheme(),
        };
    }

    shouldComponentUpdate(nextProps) {
        if (!nextProps.profile) {
            return false;
        }
        return true;
    }

    componentClickAway() {
        this.hideMenu();
    }

    getCustomTheme() {
        return Object.assign({},
            CurrentTheme,
            {paper: {backgroundColor: BACKGROUND_COLOR}},
        );
    }

    classes() {
        return {
            default: {
                arrowIcon: {
                    height: 8,
                    width: 14,
                },
                arrowContainer: {
                    border: 0,
                    height: 8,
                    left: 0,
                    position: 'relative',
                    top: 13,
                    width: 14,
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
                    backgroundColor: BACKGROUND_COLOR,
                    paddingTop: 10,
                    paddingBottom: 10,
                },
                menuItemDivStyle: {
                    color: 'white',
                },
                profileName: {
                    color: tintColor,
                    lineHeight: 2,
                    marginLeft: '10px',
                    marginRight: '5px',
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

    handleViewTeam(event) {
        routeToTeam(this.context.router, this.props.managesTeam);
    }

    handleViewKnowledge(event) {
        routeToPosts(this.context.router, services.post.containers.PostStateV1.DRAFT);
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
                        onTouchTap={::this.handleViewProfile}
                        primaryText={t('My Profile')}
                    />
                    {this.renderMyTeamMenuItem()}
                    <MenuItem
                        desktop={true}
                        innerDivStyle={{...this.styles().menuItemDivStyle}}
                        onTouchTap={::this.handleViewKnowledge}
                        primaryText={t('My Knowledge')}
                    />
                    <MenuItem
                        desktop={true}
                        innerDivStyle={{...this.styles().menuItemDivStyle}}
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
                <div is="profileName">
                    <span>{this.props.profile.first_name}</span>
                </div>
            );
        }
    }

    renderDownArrow() {
        if (this.props.expandedView) {
            return (
                <IconContainer
                    IconClass={DownArrowIcon}
                    iconStyle={{...this.styles().arrowIcon}}
                    stroke={tintColor}
                    style={{...this.styles().arrowContainer}}
                />
            );
        }
    }

    renderMyTeamMenuItem() {
        if (this.props.managesTeam && this.props.managesTeam.id) {
            return (
                <MenuItem
                    desktop={true}
                    innerDivStyle={{...this.styles().menuItemDivStyle}}
                    onTouchTap={::this.handleViewTeam}
                    primaryText={t('My Team')}
                />
            );
        } else {
            // We need to return something because material-ui
            // doesn't handle empty children. They show up as null in a for loop
            // and they don't have any checks around it.
            // Not returning anything or returning empty breaks the component
            return (
                <span />
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
                    <div>
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
