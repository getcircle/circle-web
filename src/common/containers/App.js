import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import mui from 'material-ui';
import React, { PropTypes } from 'react';

import { backgroundColors, canvasColor } from '../constants/styles';
import { deviceResized } from '../actions/device';
import { getAuthenticatedProfile } from '../reducers/authentication';
import resizable from '../decorators/resizable';
import { SEARCH_LOCATION } from '../constants/trackerProperties';
import * as selectors from '../selectors';
import tracker from '../utils/tracker';

import CSSComponent from '../components/CSSComponent';
import InternalPropTypes from '../components/InternalPropTypes';
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
            mobileOS: responsiveState.get('mobileOS'),
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
        params: PropTypes.object,
        profile: PropTypes.object,
        profileLocation: PropTypes.object,
        team: PropTypes.object,
    }

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    }

    static childContextTypes = {
        flags: PropTypes.object,
        auth: InternalPropTypes.AuthContext,
        device: InternalPropTypes.DeviceContext,
    }

    state = {
        focused: false,
    }

    historyListener = null

    getChildContext() {
        return {
            auth: {
                location: this.props.profileLocation,
                managesTeam: this.props.managesTeam,
                organization: this.props.organization,
                profile: this.props.profile,
                team: this.props.team,
            },
            device: {
                deviceSize: this.props.deviceSize,
                largerDevice: this.props.largerDevice,
                mobileOS: this.props.mobileOS,
            },
            flags: this.props.flags,
        };
    }

    componentWillMount() {
        this.initTrackerSession();
    }

    componentDidMount() {
        this.props.dispatch(deviceResized(this.props.deviceSize, this.props.location.pathname));
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (!nextProps.authenticated && UNAUTHENTICATED_ROUTES.indexOf(nextProps.location.pathname) === -1) {
            this.context.history.pushState(null, '/login');
        }

        this.initTrackerSession();
        // XXX we should be able to listen to UPDATE_PATH action from
        // redux-simple-router. since we're about to redo the search
        // components, i'm not going to adjust this now, but we should ensure
        // this isn't required for the new components.
        if (!this.historyListener) {
            this.historyListener = this.context.history.listen(location => {
                this.locationChanged(location)
            });
        }
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

    locationChanged(newLocation) {
        // This ensures search results are reset correctly
        // and do not carry over across pages.
        if (this.props.displayHeader) {
           this.setState({focused: false});
        }
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
                largerDevice={true}
                onBlur={::this.handleBlurSearch}
                onFocus={::this.handleFocusSearch}
                organization={this.props.organization}
                params={this.props.params}
                searchLocation={SEARCH_LOCATION.PAGE_HEADER}
                {...this.styles().Search}
            />
        );
    }

    render() {
        let footer;
        if (this.props.authenticated && this.props.displayFooter) {
            footer = <TabBar profile={this.props.profile} {...this.styles().TabBar} />;
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
            <div style={this.styles().root}>
                <AppCanvas>
                    <div style={this.styles().canvasContainer}>
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
