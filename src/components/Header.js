import _ from 'lodash';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { decorate } from 'react-mixin';
import { Navigation } from 'react-router';
import mui from 'material-ui';
import React from 'react/addons';

import constants from '../styles/constants';
import t from '../utils/gettext';
import * as selectors from '../selectors';

import HeaderMenu from '../components/HeaderMenu';
import Search from '../components/Search';

const {
    AppBar,
} = mui;

const MenuActions = {logout: 'Logout'};

const selector = createSelector(
    [selectors.authenticationSelector, selectors.searchSelector],
    (authenticationState, searchState) => {
        return {
            organization: authenticationState.get('organization'),
            profile: authenticationState.get('profile'),
            active: searchState.get('active'),
        }
    }
)

const styles = {
    image: {
        height: 60,
        cursor: 'pointer',
    },
    root: {
        // TODO this should be moved to the app theme
        backgroundColor: 'white',
        paddingLeft: 0,
        paddingRight: 0,
    },
}

@connect(selector)
@decorate(Navigation)
class Header extends React.Component {

    static propTypes = {
        organization: React.PropTypes.object.isRequired,
        profile: React.PropTypes.object.isRequired,
    }

    shouldComponentUpdate(nextProps) {
        if (!nextProps.authenticated) {
            return false;
        }
        return true;
    }

    _renderHeader() {
        return (
            <div>
                <div className="row">
                    <div className="col-xs-4">
                        <img style={styles.image} src="https://s3.amazonaws.com/otterbots-media/organizations/RV_Main_Logo.png" onTouchTap={() => this.transitionTo('/')}/>
                    </div>
                    <div className="col-xs-4">
                        <Search inHeader={true} />
                    </div>
                    <div className="col-xs-offset-2 col-xs-2 end-xs">
                        <HeaderMenu
                            profile={this.props.profile}
                            dispatch={this.props.dispatch}
                            inHeader={true}
                        />
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <AppBar
                style={styles.root}
                title={this._renderHeader()}
                showMenuIconButton={false}
            />
        );
    }
}

export default Header;
