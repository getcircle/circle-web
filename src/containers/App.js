import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import mui from 'material-ui';
import React, { PropTypes } from 'react';

import {
    backgroundColors,
    canvasColor,
} from '../constants/styles';
import { deviceResized } from '../actions/device';
import { getAuthenticatedProfile } from '../reducers/authentication';
import { refresh } from '../actions/authentication';
import resizable from '../decorators/resizable';
import { SEARCH_LOCATION } from '../constants/trackerProperties';
import * as selectors from '../selectors';
import tracker from '../utils/tracker';

import CSSComponent from '../components/CSSComponent';
import Header from '../components/Header';
import TabBar from '../components/TabBar';
import Search from '../components/Search';

const { AppCanvas } = mui;

const UNAUTHENTICATED_ROUTES = [
    '/auth',
    '/billing',
    '/login',
];

const selector = createSelector(
    [
        selectors.cacheSelector,
        selectors.authenticationSelector,
        selectors.responsiveSelector,
    ],
    (
        cacheState,
        authenticationState,
        responsiveState,
        footerState,
    ) => {
        const profile = getAuthenticatedProfile(authenticationState, cacheState.toJS());
        return {
            authenticated: authenticationState.get('authenticated'),
            displayFooter: responsiveState.get('displayFooter'),
            displayHeader: responsiveState.get('displayHeader'),
            managesTeam: authenticationState.get('managesTeam'),
            organization: authenticationState.get('organization'),
            profile: profile,
            profileLocation: authenticationState.get('profileLocation'),
            team: authenticationState.get('team'),
            flags: authenticationState.get('flags'),
        }
    }
);

@connect(selector)
@resizable
class App extends CSSComponent {

    static propTypes = {
        authenticated: PropTypes.bool.isRequired,
        children: PropTypes.element.isRequired,
        deviceSize: PropTypes.number.isRequired,
        dispatch: PropTypes.func.isRequired,
        displayFooter: PropTypes.bool.isRequired,
        displayHeader: PropTypes.bool.isRequired,
        flags: PropTypes.object,
        largerDevice: PropTypes.bool.isRequired,
        location: PropTypes.object,
        managesTeam: PropTypes.object,
        organization: PropTypes.object,
        profile: PropTypes.object,
        profileLocation: PropTypes.object,
        team: PropTypes.object,
    }

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired,
    }

    static childContextTypes = {
        flags: PropTypes.object,
    }

    state = {
        focused: false,
    }

    getChildContext() {
        return {
            flags: this.props.flags,
        };
    }

    componentWillMount() {
        // refresh any cached authentication objects
        this.initTrackerSession();
        if (this.props.authenticated) {
            this.props.dispatch(refresh());
        }
    }

    componentDidMount() {
        this.props.dispatch(deviceResized(this.props.deviceSize, this.props.location.pathname));
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (!nextProps.authenticated && UNAUTHENTICATED_ROUTES.indexOf(nextProps.location.pathname) === -1) {
            this.context.router.transitionTo('/login');
        }

        this.initTrackerSession();
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.deviceSize !== this.props.deviceSize) {
            this.props.dispatch(deviceResized(nextProps.deviceSize, this.props.location.pathname));
        }
    }

    initTrackerSession() {
        if (this.props.authenticated) {
            tracker.initSession(
                this.props.profile,
                this.props.organization,
                this.props.team,
                this.props.profileLocation
            );
        }
    }

    classes() {
        return {
            default: {
                root: {
                    height: '100vh',
                    width: '100vw',
                },
                canvasContainer: {
                    backgroundColor: canvasColor,
                },
                Search: {
                    inputContainerStyle: {
                        boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, .09)',
                    },
                    style: {
                        alignSelf: 'center',
                        justifyContent: 'center',
                        flex: 1,
                    },
                },
            },
            focused: {
                Search: {
                    inputContainerStyle: {
                        borderRadius: '0px',
                    },
                    focused: true,
                    resultsListStyle: {
                        height: 'initial',
                        marginTop: 1,
                        opacity: 1,
                        position: 'absolute',
                        ...backgroundColors.light,
                    },
                },
            },
        };
    }

    styles() {
        return this.css({
            focused: this.state.focused,
        });
    }

    handleFocusSearch() {
        this.setState({focused: true});
    }

    handleBlurSearch() {
        this.setState({focused: false});
    }

    renderHeaderActionsContainer() {
        return (
            <Search
                canExplore={false}
                className="center-xs"
                is="Search"
                largerDevice={true}
                onBlur={::this.handleBlurSearch}
                onFocus={::this.handleFocusSearch}
                organization={this.props.organization}
                searchLocation={SEARCH_LOCATION.PAGE_HEADER}
            />
        );
    }

    render() {
        let footer;
        if (this.props.authenticated && this.props.displayFooter) {
            footer = <TabBar is="TabBar" profile={this.props.profile} />;
        }
        let header;
        if (this.props.authenticated && this.props.displayHeader) {
            header = (
                <Header
                    actionsContainer={this.renderHeaderActionsContainer()}
                    {...this.props}
                />
            );
        }
        return (
            <div is="root">
                <AppCanvas>
                    <div is="canvasContainer">
                        {header}
                        {this.props.children}
                        {footer}
                    </div>
                </AppCanvas>
            </div>
        );
    }
}

export default App;
