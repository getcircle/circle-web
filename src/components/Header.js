import _ from 'lodash';
import connectToStores from 'alt/utils/connectToStores';
import { decorate } from 'react-mixin';
import { Navigation } from 'react-router';
import mui from 'material-ui';
import React from 'react/addons';

import bindThis from '../utils/bindThis';
import constants from '../styles/constants';
import Typeahead from '../components/Typeahead';
import t from '../utils/gettext';

const {
    Avatar,
    DropDownIcon,
    Menu,
    Tabs,
    Tab,
} = mui;

const MenuActions = {logout: 'Logout'};

@connectToStores
@decorate(Navigation)
@decorate(React.addons.LinkedStateMixin)
class Header extends React.Component {

    static propTypes = {
        flux: React.PropTypes.object.isRequired,
        organization: React.PropTypes.object,
        profile: React.PropTypes.object,
    }

    static getStores(props) {
        return [
            props.flux.getStore('AuthStore'),
            props.flux.getStore('SearchStore'),
        ];
    }

    static getPropsFromStores(props) {
        return _.assign(
            {},
            props.flux.getStore('AuthStore').getState(),
            props.flux.getStore('SearchStore').getState(),
        );
    }

    constructor() {
        super();
        this.state = {
            query: null,
            menuVisible: false,
            currentSearch: null,
        };
        this.currentSearch = null;
    }

    styles = {
        currentUserName: {
            fontSize: '13px',
            color: constants.colors.lightText,
            cursor: 'pointer',
        },
        currentUserNameContainer: {
            paddingTop: 20,
        },
        // XXX collapse the lightText
        link: {
            color: constants.colors.lightText,
            display: 'block',
            marginTop: 10,
        },
        menu: {
            position: 'relative',
            float: 'right',
            marginTop: 5,
        },
        root: {
            backgroundColor: constants.colors.background,
            boxSizing: 'border-box',
        },
        searchInput: {
            width: 350,
        },
        tab: {
            fontSize: '13px',
            display: 'inline',
            width: 100,
            marginRight: 45,
        },
        tabs: {
            backgroundColor: constants.colors.background,
            paddingTop: 20,
            paddingLeft: 25,
        },
        title: {
            color: constants.colors.lightText,
            fontSize: '36px',
            marginTop: '25px',
        },
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.flux.getStore('AuthStore').isLoggedIn()) {
            this.transitionTo('/login');
        }

        if (!nextProps.active && this.state.query) {
            this.setState({query: null});
        }
    }

    shouldComponentUpdate(nextProps) {
        // XXX if we just logged out, we no longer have these properties
        if (!nextProps.organization || !nextProps.profile) {
            return false;
        }
        return true;
    }

    @bindThis
    _handleMenuItemTap(event, index, menuItem) {
        switch (menuItem.text) {
            case MenuActions.logout:
                this.props.flux.getActions('AuthActions').logout();
                break;
        }
    }

    @bindThis
    _onActive(tab) {
        this.transitionTo(tab.props.route);
    }

    @bindThis
    _handleKeyUp() {
        if (this.currentSearch !== null) {
            window.clearTimeout(this.currentSearch);
        }

        this.currentSearch = window.setTimeout(() => {
            this.props.flux.getStore('SearchStore').search(this.state.query);
        }, 100);
    }

    @bindThis
    _toggleMenuVisibility() {
        this.setState({menuVisible: !this.state.menuVisible});
    }

    render() {
        let menuItems = [
            {text: MenuActions.logout},
        ];
        // XXX the bottom border animation when switching tabs seems to lag when loading the "People" page. Not sure if this is because we're loading more cards, or because we're loading images as well.
        return (
            <header style={this.styles.root}>
                <div className="wrap">
                    <div className="row header__nav--primary">
                        <div className="col-xs-6 start-xs">
                            <div className="row">
                                <div className="col-xs-4">
                                    <Tabs tabItemContainerStyle={this.styles.tabs}>
                                        <Tab style={this.styles.tab} label={t('People')} route="/people" onActive={this._onActive} />
                                        <Tab style={this.styles.tab} label={t('Locations')} route="/locations" onActive={this._onActive} />
                                    </Tabs>
                                </div>
                                <div className="col-xs">
                                    <Typeahead
                                        style={this.styles.searchInput}
                                        valueLink={this.linkState('query')}
                                        onKeyUp={this._handleKeyUp}
                                        results={this.props.results}
                                        flux={this.props.flux}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-6 end-xs">
                            <div style={this.styles.currentUserNameContainer}>
                                <span style={this.styles.currentUserName} onTouchTap={this._toggleMenuVisibility}>
                                    {this.props.profile.full_name}
                                </span>
                            </div>
                            <Menu style={this.styles.menu} menuItems={menuItems} hideable={true} visible={this.state.menuVisible} onItemTap={this._handleMenuItemTap} />
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}

export default Header;
