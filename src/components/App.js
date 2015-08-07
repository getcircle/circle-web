import _ from 'lodash';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { decorate } from 'react-mixin';
import mui from 'material-ui';
import { Navigation } from 'react-router';
import React from 'react';

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

    static childContextTypes = {
        muiTheme: React.PropTypes.object,
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
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
