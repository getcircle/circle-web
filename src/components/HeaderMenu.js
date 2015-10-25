import { decorate } from 'react-mixin';
import ClickAwayable from 'material-ui/lib/mixins/click-awayable';
import Menu from 'material-ui/lib/menus/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import React, { PropTypes } from 'react';
import TransitionGroup from 'react-addons-css-transition-group';

import autoBind from '../utils/autoBind';
import CurrentTheme from '../utils/ThemeManager';
import { logout } from '../actions/authentication';
import { PostStateURLString } from '../utils/post';
import { routeToNewPost, routeToPosts, routeToProfile, routeToTeam } from '../utils/routes';
import t from '../utils/gettext';
import { tintColor } from '../constants/styles';

import CSSComponent from './CSSComponent';
import DownArrowIcon from './DownArrowIcon';
import IconContainer from './IconContainer';
import ProfileAvatar from './ProfileAvatar';
import RoundedButton from '../components/RoundedButton';

const BACKGROUND_COLOR = 'rgb(42, 42, 42)';

@decorate(ClickAwayable)
@decorate(autoBind(ClickAwayable))
class HeaderMenu extends CSSComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        expandedView: PropTypes.bool,
        managesTeam: PropTypes.object,
        profile: PropTypes.object,
    }

    static contextTypes = {
        flags: PropTypes.object,
        mixins: PropTypes.object,
        router: PropTypes.object,
        showCTAsInHeader: PropTypes.bool,
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
                    top: 1,
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
                profileName: {
                    color: tintColor,
                    lineHeight: 2,
                    marginLeft: '10px',
                    marginRight: '5px',
                },
                RoundedButton: {
                    labelStyle: {
                        padding: '0 6px',
                    },
                    style: {
                        marginRight: 12,
                        whiteSpace: 'nowrap',
                    },
                },
            },
        };
    }

    onAddPostTapped() {
        routeToNewPost(this.context.router);
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
        routeToPosts(this.context.router, PostStateURLString.LISTED);
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
                    onItemTouchTap={::this.hideMenu}
                    width={110}
                >
                    <MenuItem
                        desktop={true}
                        innerDivStyle={{...this.styles().menuItemDivStyle}}
                        onTouchTap={(e) => this.handleViewProfile(e)}
                        primaryText={t('My Profile')}
                    />
                    {this.renderMyKnowledgeMenuItem()}
                    {this.renderMyTeamMenuItem()}
                    <MenuItem
                        desktop={true}
                        innerDivStyle={{...this.styles().menuItemDivStyle}}
                        onTouchTap={(e) => this.handleLogout(e)}
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
                    onTouchTap={(e) => this.handleViewTeam(e)}
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

    renderMyKnowledgeMenuItem() {
        if (this.context.flags && this.context.flags.get('posts')) {
            return (
                <MenuItem
                    desktop={true}
                    innerDivStyle={{...this.styles().menuItemDivStyle}}
                    onTouchTap={(e) => this.handleViewKnowledge(e)}
                    primaryText={t('My Knowledge')}
                />
            );
        } else {
            return (
                <span />
            );
        }
    }

    renderAddKnowledgeButton() {
        if (this.context.flags &&
            this.context.flags.get('posts') &&
            (this.context.showCTAsInHeader === undefined || this.context.showCTAsInHeader === true)
        ) {
            return (
                <RoundedButton
                    is="RoundedButton"
                    label={t('Add Knowledge')}
                    onTouchTap={::this.onAddPostTapped}
                />
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
                    className="row middle-xs"
                    is="container"
                    onTouchTap={::this.handleTouchTap}
                    ref="container"
                >
                    {this.renderAddKnowledgeButton()}
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
