import { decorate } from 'react-mixin';
import ClickAwayable from 'material-ui/lib/mixins/click-awayable';
import Menu from 'material-ui/lib/menus/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import React, { PropTypes } from 'react';
import ReactTransitionGroup from 'react-addons-transition-group';

import autoBind from '../utils/autoBind';
import CurrentTheme from '../utils/ThemeManager';
import { logout } from '../actions/authentication';
import { PostStateURLString } from '../utils/post';
import { routeToNewPost, routeToPosts, routeToProfile, routeToTeam, routeToAddIntegration } from '../utils/routes';
import t from '../utils/gettext';
import { tintColor } from '../constants/styles';
import { IntegrationString } from '../utils/Integrations';

import CSSComponent from './CSSComponent';
import DownArrowIcon from './DownArrowIcon';
import IconContainer from './IconContainer';
import InternalPropTypes from './InternalPropTypes';
import ProfileAvatar from './ProfileAvatar';
import RoundedButton from '../components/RoundedButton';

const BACKGROUND_COLOR = 'rgb(42, 42, 42)';

@decorate(ClickAwayable)
@decorate(autoBind(ClickAwayable))
class HeaderMenu extends CSSComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        expandedView: PropTypes.bool,
    }

    static contextTypes = {
        auth: InternalPropTypes.AuthContext.isRequired,
        flags: PropTypes.object,
        mixins: PropTypes.object,
        showCTAsInHeader: PropTypes.bool,
        history: PropTypes.shape({
            pushState: PropTypes.func.isRequired,
        }).isRequired,
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

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (!nextContext.auth.profile) {
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
                    fontSize: '1.6rem',
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
        routeToNewPost(this.context.history);
    }

    handleTouchTap(event) {
        this.setState({menuDisplayed: !this.state.menuDisplayed});
    }

    handleViewProfile(event) {
        routeToProfile(this.context.history, this.context.auth.profile);
    }

    handleViewTeam(event) {
        routeToTeam(this.context.history, this.context.auth.managesTeam);
    }

    handleViewKnowledge(event) {
        routeToPosts(this.context.history, PostStateURLString.LISTED);
    }

    handleAddToSlack = () => {
        routeToAddIntegration(this.context.history, IntegrationString.SLACK);
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
                    listStyle={this.styles().menuListStyle}
                    onEscKeyDown={::this.hideMenu}
                    onItemTouchTap={::this.hideMenu}
                    style={this.styles().menu}
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
                    {this.renderAddToSlackMenuItem()}
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
                <div style={this.styles().profileName}>
                    <span>{this.context.auth.profile.first_name}</span>
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
                    style={this.styles().arrowContainer}
                />
            );
        }
    }

    renderMyTeamMenuItem() {
        const { managesTeam } = this.context.auth;
        if (managesTeam && managesTeam.id) {
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

    renderAddToSlackMenuItem() {
        if (this.context.auth.profile.is_admin) {
            return (
                <MenuItem
                    desktop={true}
                    innerDivStyle={{...this.styles().menuItemDivStyle}}
                    onTouchTap={this.handleAddToSlack}
                    primaryText={t('Add to Slack')}
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
                    label={t('Add Knowledge')}
                    onTouchTap={::this.onAddPostTapped}
                    {...this.styles().RoundedButton}
                />
            );
        }
    }

    render() {
        const { profile } = this.context.auth;

        return (
            <div {...this.props}>
                <div
                    className="row middle-xs"
                    onTouchTap={::this.handleTouchTap}
                    ref="container"
                    style={this.styles().container}
                >
                    {this.renderAddKnowledgeButton()}
                    <div>
                        <ProfileAvatar profile={profile} />
                    </div>
                    {this.renderProfileName()}
                    {this.renderDownArrow()}
                </div>
                <div className="row start-xs">
                    <ReactTransitionGroup>
                        {this.renderMenu()}
                    </ReactTransitionGroup>
                </div>
            </div>
        );
    }

}

export default HeaderMenu;
