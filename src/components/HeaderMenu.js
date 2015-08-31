import Menu from 'material-ui/lib/menus/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import { Avatar } from 'material-ui';
import React, { PropTypes } from 'react/addons';

import { logout } from '../actions/authentication';
import { routeToProfile } from '../utils/routes';
import t from '../utils/gettext';
import { tintColor } from '../constants/styles';

import CSSComponent from './CSSComponent';

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
                    onItemTouchTap={::this.hideMenu}
                    onEscKeyDown={::this.hideMenu}
                    width={110}
                >
                    <MenuItem
                        desktop={true}
                        onTouchTap={() => this.props.dispatch(logout())}
                        primaryText={t('Logout')}
                    />
                    <MenuItem
                        desktop={true}
                        onTouchTap={::this.handleViewProfile}
                        primaryText={t('View Profile')}
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
                        <Avatar src={profile.image_url} />
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
