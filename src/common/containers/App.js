import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import mui from 'material-ui';
import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';

import { clientMounted, deviceResized } from '../actions/device';
import { getAuthenticatedProfile } from '../reducers/authentication';
import resizable from '../decorators/resizable';
import * as selectors from '../selectors';
import tracker from '../utils/tracker';

import CSSComponent from '../components/CSSComponent';
import DocumentTitle from '../components/DocumentTitle';
import InternalPropTypes from '../components/InternalPropTypes';
import Header from '../components/Header';
import HeaderSearch from '../components/HeaderSearch';
import TabBar from '../components/TabBar';

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
            clientMounted: responsiveState.get('clientMounted'),
            displayFooter: responsiveState.get('displayFooter'),
            displayHeader: responsiveState.get('displayHeader'),
            organization: authenticationState.get('organization'),
            profile: profile,
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
        clientMounted: PropTypes.bool,
        deviceSize: PropTypes.number.isRequired,
        dispatch: PropTypes.func.isRequired,
        displayFooter: PropTypes.bool.isRequired,
        displayHeader: PropTypes.bool.isRequired,
        flags: PropTypes.object,
        largerDevice: PropTypes.bool.isRequired,
        location: PropTypes.object,
        organization: PropTypes.object,
        params: PropTypes.object,
        profile: PropTypes.object,
        team: PropTypes.object,
    }

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
    }

    static childContextTypes = {
        flags: PropTypes.object,
        auth: InternalPropTypes.AuthContext,
        device: InternalPropTypes.DeviceContext,
    }

    getChildContext() {
        return {
            auth: {
                organization: this.props.organization,
                profile: this.props.profile,
                team: this.props.team,
            },
            device: {
                deviceSize: this.props.deviceSize,
                largerDevice: this.props.largerDevice,
                mobileOS: this.props.mobileOS,
                mounted: this.props.clientMounted,
            },
            flags: this.props.flags,
        };
    }

    componentWillMount() {
        this.initTrackerSession();
    }

    componentDidMount() {
        this.props.dispatch(deviceResized(this.props.deviceSize, this.props.location.pathname));
        this.props.dispatch(clientMounted());
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (!nextProps.authenticated && UNAUTHENTICATED_ROUTES.indexOf(nextProps.location.pathname) === -1) {
            browserHistory.push('/login');
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
            },
        };
    }

    renderHeaderActionsContainer() {
        return <HeaderSearch />;
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
            <DocumentTitle>
                <div style={this.styles().root}>
                    <AppCanvas>
                        <div>
                            {header}
                            {this.props.children}
                            {footer}
                        </div>
                    </AppCanvas>
                </div>
            </DocumentTitle>
        );
    }
}

export default App;
