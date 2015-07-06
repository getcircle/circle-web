'use strict';

import _ from 'lodash';
import connectToStores from 'alt/utils/connectToStores';
import { decorate } from 'react-mixin';
import { Link, Navigation } from 'react-router';
import mui from 'material-ui';
import React from 'react/addons';

import bindThis from '../utils/bindThis';
import constants from '../styles/constants';
import t from '../utils/gettext';
import SearchResults from '../components/SearchResults';

const { Avatar } = mui;
const { DropDownIcon } = mui;
const { Tabs } = mui;
const { Tab } = mui;
const { TextField } = mui;

@connectToStores
@decorate(Navigation)
@decorate(React.addons.LinkedStateMixin)
class Header extends React.Component {

    static propTypes = {
        flux: React.PropTypes.object.isRequired,
        // XXX how do we avoid warnings on the /login page for these?
        organization: React.PropTypes.object.isRequired,
        profile: React.PropTypes.object.isRequired,
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
        };
    }

    styles = {
        root: {
            backgroundColor: constants.colors.background,
            boxSizing: 'border-box',
        },
        // XXX collapse the lightText
        text: {
            color: constants.colors.lightText,
        },
        link: {
            color: constants.colors.lightText,
            display: 'block',
            marginTop: 10,
        },
        title: {
            color: constants.colors.lightText,
            fontSize: '36px',
            marginTop: '25px',
        },
        searchResults: {
            zIndex: 10,
            position: 'absolute',
            width: 350,
            backgroundColor: 'white',
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24)',
        },
        tabs: {
            backgroundColor: constants.colors.background,
        },
        tab: {
            fontSize: '16px',
            marginLeft: 46,
        },
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.flux.getStore('AuthStore').isLoggedIn()) {
            this.transitionTo('login');
        }
    }

    @bindThis
    _handleLogout(event) {
        // Prevent the link from resolving, we need to wait for logout to succeed
        event.preventDefault();
        this.props.flux
            .getActions('AuthActions')
            .logout();
    }

    @bindThis
    _onActive(tab) {
        this.transitionTo(tab.props.route);
    }

    @bindThis
    _handleKeyUp() {
        this.props.flux.getStore('SearchStore').search(this.state.query);
    }

    _renderSearchResults() {
        if (this.props.results) {
            return <SearchResults style={this.styles.searchResults} results={this.props.results} />;
        }
    }

    render() {
        // XXX the bottom border animation when switching tabs seems to lag when loading the "People" page. Not sure if this is because we're loading more cards, or because we're loading images as well.
        return (
            <header style={this.styles.root}>
                <div className="wrap">
                    <div className="row header__nav--primary">
                        <div className="col-xs-6 start-xs">
                            <Tabs tabItemContainerStyle={this.styles.tabs}>
                                <Tab style={this.styles.tab} label={ t('People') } route="/people" onActive={this._onActive} />
                            </Tabs>
                        </div>
                        <div className="col-xs-6 end-xs">
                            <Link to="login" style={this.styles.link} onClick={this._handleLogout}>Logout</Link>
                        </div>
                    </div>
                    <div className="row header__nav--secondary">
                        <img className="header-image" src={this.props.organization.image_url} />
                        <h2 className="header-title">People</h2>
                        <div className="col-xs-offset-5">
                            <TextField
                                inputStyle={this.styles.text}
                                floatingLabelStyle={this.styles.text}
                                floatingLabelText="Search"
                                valueLink={this.linkState('query')}
                                onKeyUp={this._handleKeyUp}
                            />
                            { this._renderSearchResults() }
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}

export default Header;
