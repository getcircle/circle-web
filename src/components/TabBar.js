import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import keymirror from 'keymirror';
import React, { PropTypes } from 'react';
import { Tabs, Tab } from 'material-ui';

import * as selectors from '../selectors';

import CSSComponent from './CSSComponent';

const TABS = keymirror({
    SEARCH: null,
    USER_PROFILE: null,
});

const selector = createSelector(
    [selectors.routerSelector],
    (routerState) => {
        return {
            pathname: routerState.pathname,
        }
    }
)

@connect(selector)
class TabBar extends CSSComponent {

    static propTypes = {
        pathname: PropTypes.string.isRequired,
        style: PropTypes.object,
    }

    static contextTypes = {
        mixins: PropTypes.object,
        router: PropTypes.object,
    }

    componentWillMount() {
        this.resolveTabValue(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.resolveTabValue(nextProps);
    }

    state = {
        tabValue: 'none',
    }

    resolveTabValue(props) {
        const { pathname } = props;
        if (pathname === '/') {
            this.setState({tabValue: TABS.SEARCH});
        } else if (pathname === '/me') {
            this.setState({tabValue: TABS.USER_PROFILE});
        } else {
            this.setState({tabValue: 'none'});
        }
    }

    classes() {
        return {
            default: {
                footer: {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    bottom: 0,
                    boxShadow: '0px 1px 4px 0 rgba(0, 0, 0, 0.2)',
                    left: 0,
                    position: 'fixed',
                    right: 0,
                },
                Tabs: {
                    style: {
                        width: '100%',
                    },
                },
            },
        };
    }

    handleChange(value, event, tab) {
        const { transitionTo } = this.context.router;
        switch(value) {
        case TABS.SEARCH:
            transitionTo('/');
        //TODO implement /me
        }
        this.setState({tabValue: value});
    }

    render() {
        const {
            style,
            ...other,
        } = this.props;
        return (
            <footer {...other} className="row" style={{...this.styles().footer, ...style}}>
                <Tabs
                    is="Tabs"
                    valueLink={{
                        value: this.state.tabValue,
                        requestChange: ::this.handleChange,
                    }}
                >
                    <Tab is="tab" label="Search" value={TABS.SEARCH} />
                    <Tab is="tab" label="Profile" value={TABS.USER_PROFILE} />
                </Tabs>
            </footer>
        );
    }

}

export default TabBar;
