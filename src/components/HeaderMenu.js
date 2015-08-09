import { decorate } from 'react-mixin';
import Menu from 'material-ui/lib/menus/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import mui from 'material-ui';
import { Navigation } from 'react-router';
import Radium from 'radium';
import React from 'react/addons';

import { logout } from '../actions/authentication';
import t from '../utils/gettext';

import rectangleIcon from '../images/icons/down_arrow_icon.svg';

const { Avatar } = mui;
const { TransitionGroup } = React.addons;

const styles = {
    arrow: {
        paddingTop: 12,
        paddingLeft: 10,
    },
    avatar: {
        height: 36,
        width: 36,
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
        color: 'white',
        lineHeight: 2,
    },
};

@decorate(Navigation)
@Radium
class HeaderMenu extends React.Component {

    static propTypes = {
        dispatch: React.PropTypes.func.isRequired,
        profile: React.PropTypes.object,
        inHeader: React.PropTypes.bool,
    }

    state = {
        menuDisplayed: false,
        inHeader: false,
    }

    shouldComponentUpdate(nextProps) {
        if (!nextProps.profile) {
            return false;
        }
        return true;
    }

    _handleTouchTap = this._handleTouchTap.bind(this)
    _handleTouchTap(event) {
        this.setState({menuDisplayed: !this.state.menuDisplayed});
    }

    _handleLogout = this._handleLogout.bind(this)
    _handleLogout(event) {
        this.props.dispatch(logout());
    }

    _hideMenu = this._hideMenu.bind(this)
    _hideMenu(event) {
        this.setState({menuDisplayed: false});
    }

    _renderMenu() {
        if (this.state.menuDisplayed) {
            return (
                <Menu
                    animated={true}
                    width={110}
                    style={styles.menu}
                    desktop={true}
                    listStyle={styles.menuListStyle}
                    onEscKeyDown={this._hideMenu}
                >
                    <MenuItem
                        primaryText={t('Logout')}
                        desktop={true}
                        onTouchTap={this._handleLogout}
                    />
                </Menu>
            );
        }
    }

    _renderProfileName() {
        if (!this.props.inHeader) {
            return (
                <div className="col-xs">
                    <span style={styles.text}>{this.props.profile.first_name}</span>
                </div>
            );
        }
    }

    _renderDownArrow() {
        if (!this.props.inHeader) {
            return (
                <div>
                    <img src={rectangleIcon} style={styles.arrow} />
                </div>
            );
        }
    }

    render() {
        let containerStyle = {
            paddingTop: 15,
            paddingRight: 0,
        }
        return (
            <div>
                <div
                    className="row"
                    style={[
                        styles.container,
                        this.props.inHeader && containerStyle,
                    ]}
                    onTouchTap={this._handleTouchTap}
                >
                    <div className="col-xs">
                        <Avatar src={this.props.profile.image_url} />
                    </div>
                    {this._renderProfileName()}
                    {this._renderDownArrow()}
                </div>
                <div className="row start-xs">
                    <TransitionGroup>
                        {this._renderMenu()}
                    </TransitionGroup>
                </div>
            </div>
        );
    }

}

export default HeaderMenu;
