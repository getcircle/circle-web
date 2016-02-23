import { merge } from 'lodash';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { Menu, MenuItem, Popover } from 'material-ui';

import { logout } from '../actions/authentication';
import { PostStateURLString } from '../utils/post';
import { routeToNewPost, routeToDrafts, routeToProfile, routeToTeam, routeToAddIntegration } from '../utils/routes';
import { showCreateTeamModal } from '../actions/teams';
import { showCreateModal as showCreateCollectionModal } from '../actions/collections';
import t from '../utils/gettext';
import { tintColor } from '../constants/styles';
import { IntegrationString } from '../utils/integrations';

import CreateCollectionForm from './CreateCollectionForm';
import CreateTeamForm from './CreateTeamForm';
import CSSComponent from './CSSComponent';
import DownArrowIcon from './DownArrowIcon';
import IconContainer from './IconContainer';
import InternalPropTypes from './InternalPropTypes';
import LightBulbIcon from './LightBulbIcon';
import ProfileAvatar from './ProfileAvatar';
import RoundedButton from '../components/RoundedButton';

const BACKGROUND_COLOR = 'rgb(42, 42, 42)';

class HeaderMenu extends CSSComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
    }

    static contextTypes = {
        auth: InternalPropTypes.AuthContext.isRequired,
        flags: PropTypes.object,
        muiTheme: PropTypes.object.isRequired,
        showCTAsInHeader: PropTypes.bool,
    }

    static childContextTypes = {
        muiTheme: PropTypes.object,
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
                LightBulbIcon: {
                    height: 30,
                    stroke: this.context.muiTheme.luno.tintColor,
                    style: {
                        margin: 0,
                    },
                    width: 30,
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
                        padding: '0 14px 0 0',
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
        routeToNewPost();
    }

    handleTouchTap(event) {
        this.setState({menuDisplayed: !this.state.menuDisplayed});
    }

    handleViewProfile(event) {
        routeToProfile(this.context.auth.profile);
    }

    handleViewKnowledge(event) {
        routeToDrafts();
    }

    handleCreateTeam(event) {
        this.props.dispatch(showCreateTeamModal());
    }

    handleCreateCollection(event) {
        this.props.dispatch(showCreateCollectionModal());
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
                    {this.renderCreateTeamMenuItem()}
                    {this.renderCreateCollectionMenuItem()}
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

    renderMyKnowledgeMenuItem() {
        if (this.context.flags && this.context.flags.get('posts')) {
            return (
                <MenuItem
                    desktop={true}
                    innerDivStyle={{...this.styles().menuItemDivStyle}}
                    onTouchTap={(e) => this.handleViewKnowledge(e)}
                    primaryText={t('My Drafts')}
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
                    icon={<LightBulbIcon {...this.styles().LightBulbIcon} />}
                    label={t('Add Knowledge')}
                    onTouchTap={::this.onAddPostTapped}
                    {...this.styles().RoundedButton}
                />
            );
        }
    }

    renderCreateTeamMenuItem() {
        return (
            <MenuItem
                desktop={true}
                innerDivStyle={{...this.styles().menuItemDivStyle}}
                onTouchTap={(e) => this.handleCreateTeam(e)}
                primaryText={t('Create Team')}
            />
        );
    }

    renderCreateTeamForm() {
        const {
            dispatch,
        } = this.props;

        return (
            <CreateTeamForm dispatch={dispatch} />
        );
    }

    renderCreateCollectionMenuItem() {
        return (
            <MenuItem
                desktop={true}
                innerDivStyle={{...this.styles().menuItemDivStyle}}
                onTouchTap={(e) => this.handleCreateCollection(e)}
                primaryText={t('Create Collection')}
            />
        );
    }

    renderCreateCollectionForm() {
        const { dispatch } = this.props;
        const { profile } = this.context.auth;
        return (
            <CreateCollectionForm
                dispatch={dispatch}
                ownerId={profile.id}
                ownerType={services.post.containers.CollectionV1.OwnerTypeV1.PROFILE}
            />
        );
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
                    <div ref="avatar">
                        <ProfileAvatar profile={profile} />
                    </div>
                </div>
                <Popover
                    anchorEl={this.refs.avatar}
                    anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                    onRequestClose={() => { this.setState({menuDisplayed: false})}}
                    open={this.state.menuDisplayed}
                    style={this.styles().popover}
                    targetOrigin={{vertical: 'top', horizontal: 'right'}}
                >
                    {this.renderMenu()}
                </Popover>
                {this.renderCreateTeamForm()}
                {this.renderCreateCollectionForm()}
            </div>
        );
    }

}

export default HeaderMenu;
