import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { decorate } from 'react-mixin';
import mui from 'material-ui';
import React, { PropTypes } from 'react';

import autoBind from '../utils/autoBind';
import {
    canvasColor,
} from '../constants/styles';
import { refresh } from '../actions/authentication';
import * as selectors from '../selectors';
import { deviceResized } from '../actions/device';


import CSSComponent from '../components/CSSComponent';
import Header from '../components/Header';
import TabBar from '../components/TabBar';

const { AppCanvas } = mui;
const { StyleResizable } = mui.Mixins;

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
        }
    }
);

@connect(selector)
@decorate(StyleResizable)
@decorate(autoBind(StyleResizable))
class App extends CSSComponent {

    static propTypes = {
        authenticated: PropTypes.bool.isRequired,
        children: PropTypes.element.isRequired,
        dispatch: PropTypes.func.isRequired,
        displayFooter: PropTypes.bool.isRequired,
        displayHeader: PropTypes.bool.isRequired,
        largerDevice: PropTypes.bool.isRequired,
        location: PropTypes.object,
        profile: PropTypes.object,
    }

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired,
    }

    componentWillMount() {
        // refresh any cached authentication objects
        if (this.props.authenticated) {
            this.props.dispatch(refresh());
        }
        this.props.dispatch(
            deviceResized(this.state.deviceSize, this.props.location.pathname)
        );
    }

    componentWillReceiveProps(nextProps, nextState) {
        // TODO: Correctly add support for white labeling URLs
        if (!nextProps.authenticated && nextProps.location.pathname !== '/login' && nextProps.location.pathname !== '/billing') {
            this.context.router.transitionTo('/login');
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.deviceSize !== this.state.deviceSize) {
            this.props.dispatch(deviceResized(nextState.deviceSize, this.props.location.pathname));
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
            footer = <TabBar is="TabBar" profile={this.props.profile} />; }
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
