import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import mui from 'material-ui';
import React, { PropTypes } from 'react';

import { refresh } from '../actions/authentication';
import * as selectors from '../selectors';

import CSSComponent from '../components/CSSComponent';
import Header from '../components/Header';

const { AppCanvas } = mui;

const selector = createSelector(
    [selectors.authenticatedSelector, selectors.headerSelector],
    (authenticatedState, headerState) => { return {
        displayHeader: headerState.get('display'),
        ...authenticatedState,
    } }
);

@connect(selector)
class App extends CSSComponent {

    static propTypes = {
        authenticated: PropTypes.bool.isRequired,
        children: PropTypes.element.isRequired,
        dispatch: PropTypes.func.isRequired,
        displayHeader: PropTypes.bool.isRequired,
    }

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
    }

    componentWillMount() {
        // refresh any cached authentication objects
        if (this.props.authenticated) {
            this.props.dispatch(refresh());
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.authenticated && nextProps.location.pathname !== '/login') {
            this.context.router.transitionTo('/login');
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

    render() {
        let header;
        if (this.props.authenticated && this.props.displayHeader) {
            header = <Header {...this.props} />;
        }
        return (
            <div is="root">
                <AppCanvas>
                    <div>
                        {header}
                        {this.props.children}
                    </div>
                </AppCanvas>
            </div>
        );
    }
}

export default App;
