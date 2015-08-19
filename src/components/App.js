import _ from 'lodash';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { decorate } from 'react-mixin';
import mui from 'material-ui';
import { Navigation } from 'react-router';
import React from 'react';

import { refresh } from '../actions/authentication';
import Header from './Header';
import ThemeManager from '../utils/ThemeManager';
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

    static childContextTypes = {
        muiTheme: React.PropTypes.object,
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
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
        const props: Object = _.assign({}, this.state, this.props);
        let header;
        if (this.props.authenticated && this.props.displayHeader) {
            header = <Header {...props} />;
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
