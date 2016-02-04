import merge from 'lodash.merge';
import React, { PropTypes } from 'react';

import { Menu, MenuItem, Popover } from 'material-ui';

import { logout } from '../actions/authentication';
import { PostStateURLString } from '../utils/post';
import { routeToNewPost, routeToPosts, routeToProfile, routeToTeam } from '../utils/routes';
import t from '../utils/gettext';
import { tintColor } from '../constants/styles';

import CSSComponent from './CSSComponent';
import DownArrowIcon from './DownArrowIcon';
import IconContainer from './IconContainer';
import InternalPropTypes from './InternalPropTypes';
import ProfileAvatar from './ProfileAvatar';
import RoundedButton from '../components/RoundedButton';

const BACKGROUND_COLOR = 'rgb(42, 42, 42)';

class HeaderMenu extends CSSComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        expandedView: PropTypes.bool,
    }

    static contextTypes = {
        auth: InternalPropTypes.AuthContext.isRequired,
        flags: PropTypes.object,
        history: PropTypes.shape({
            pushState: PropTypes.func.isRequired,
        }).isRequired,
        muiTheme: PropTypes.object.isRequired,
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
        muiTheme: this.context.muiTheme,
    }

    getChildContext() {
        return {
            muiTheme: this.state.muiTheme,
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (!nextContext.auth.profile) {
            return false;
        }
        return true;
    }

    componentWillMount() {
        this.customizeTheme();
    }

    componentClickAway() {
        this.hideMenu();
    }

    customizeTheme() {
        const muiTheme = merge({}, this.state.muiTheme);
        muiTheme.paper.backgroundColor = BACKGROUND_COLOR;
        this.setState({muiTheme});
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
                popover: {
                    marginTop: 20,
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

    handleViewKnowledge(event) {
        routeToPosts(this.context.history, PostStateURLString.LISTED);
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
                <div ref="downArrow">
                    <IconContainer
                        IconClass={DownArrowIcon}
                        iconStyle={{...this.styles().arrowIcon}}
                        stroke={tintColor}
                        style={this.styles().arrowContainer}
                    />
                </div>
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
                    label={t('Add Knowledge')}
                    onTouchTap={::this.onAddPostTapped}
                    {...this.styles().RoundedButton}
                />
            );
        }
    }

    render() {
        const { profile } = this.context.auth;
        let anchorEl;
        if (this.props.expandedView) {
            anchorEl = this.refs.downArrow;
        } else {
            anchorEl = this.refs.avatar;
        }
        return (
            <div {...this.props}>
                <div
                    className="row middle-xs"
                    onTouchTap={::this.handleTouchTap}
                    ref="container"
                    style={this.styles().container}
                >
                    {this.renderAddKnowledgeButton()}
                    <div ref="avatar">
                        <ProfileAvatar profile={profile} />
                    </div>
                    {this.renderProfileName()}
                    {this.renderDownArrow()}
                </div>
                <Popover
                    anchorEl={anchorEl}
                    anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                    onRequestClose={() => { this.setState({menuDisplayed: false})}}
                    open={this.state.menuDisplayed}
                    style={this.styles().popover}
                    targetOrigin={{vertical: 'top', horizontal: 'right'}}
                >
                    {this.renderMenu()}
                </Popover>
            </div>
        );
    }

}

export default HeaderMenu;
