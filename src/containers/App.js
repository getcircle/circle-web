import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import mui from 'material-ui';
import React from 'react';

import { refresh } from '../actions/authentication';
import Header from '../components/Header';
import * as selectors from '../selectors';

const { AppCanvas } = mui;

const selector = createSelector(
    [selectors.authenticatedSelector, selectors.headerSelector],
    (authenticatedState, headerState) => { return {
        displayHeader: headerState.get('display'),
        ...authenticatedState,
    } }
);

@connect(selector)
@decorate(Navigation)
class App extends React.Component {

    static propTypes = {
        displayHeader: React.PropTypes.bool.isRequired,
        authenticated: React.PropTypes.bool.isRequired,
    }

    componentWillMount() {
        // refresh any cached authentication objects
        if (this.props.authenticated) {
            this.props.dispatch(refresh());
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.authenticated && nextProps.location.pathname != '/login') {
            this.transitionTo('/login');
        }
    }

    render() {
        let header;
        if (this.props.authenticated && this.props.displayHeader) {
            header = <Header {...this.props} />;
        }
        return (
            <AppCanvas>
                <div>
                    {header}
                    {this.props.children}
                </div>
            </AppCanvas>
        );
    }
}

export default App;
