import _ from 'lodash';
import { connect } from 'react-redux';
import { decorate } from 'react-mixin';
import mui from 'material-ui';
import { Navigation } from 'react-router';
import React from 'react';

import Header from './Header';
import ThemeManager from '../utils/ThemeManager';
import * as selectors from '../selectors';

const { AppCanvas } = mui;

@connect(selectors.authenticatedSelector)
@decorate(Navigation)
class App extends React.Component {

    _defaultRoute() {
        this.replaceWith('people');
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
        if (!this.props.children) {
            this._defaultRoute();
        }
    }

    shouldComponentUpdate() {
        if (!this.props.children) {
            this._defaultRoute();
            return false;
        }
        return true;
    }

    render() {
        const props: Object = _.assign({}, this.state, this.props);
        let header;
        if (this.props.authenticated) {
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
