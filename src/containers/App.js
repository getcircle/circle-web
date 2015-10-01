import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import mui from 'material-ui';
import React, { PropTypes } from 'react';

import {
    canvasColor,
} from '../constants/styles';
import { deviceResized } from '../actions/device';
import { refresh } from '../actions/authentication';
import resizable from '../decorators/resizable';
import * as selectors from '../selectors';
import tracker from '../utils/tracker';

import CSSComponent from '../components/CSSComponent';
import Header from '../components/Header';
import TabBar from '../components/TabBar';

const { AppCanvas } = mui;

const UNAUTHENTICATED_ROUTES = [
    '/auth',
    '/billing',
    '/login',
];

const selector = createSelector(
    [
        selectors.authenticationSelector,
        selectors.responsiveSelector,
    ],
    (
        authenticationState,
        responsiveState,
        footerState,
    ) => {
        return {
            displayFooter: responsiveState.get('displayFooter'),
            displayHeader: responsiveState.get('displayHeader'),
            authenticated: authenticationState.get('authenticated'),
            profile: authenticationState.get('profile'),
            organization: authenticationState.get('organization'),
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
        largerDevice: PropTypes.bool.isRequired,
        location: PropTypes.object,
        organization: PropTypes.object,
        profile: PropTypes.object,
    }

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired,
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
            tracker.initSession(this.props.profile, this.props.organization);
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
            },
        };
    }

    render() {
        let footer;
        if (this.props.authenticated && this.props.displayFooter) {
            footer = <TabBar is="TabBar" profile={this.props.profile} />;
        }
        let header;
        if (this.props.authenticated && this.props.displayHeader) {
            header = <Header {...this.props} />;
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
