import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import keymirror from 'keymirror';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';
import { Tabs, Tab } from 'material-ui';

import { routeToProfile } from '../utils/routes';
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
        profile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
        style: PropTypes.object,
    }

    static contextTypes = {
        mixins: PropTypes.object,
        router: PropTypes.object,
    }

    state = {
        tabValue: 'none',
    }

    componentWillMount() {
        this.resolveTabValue(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.resolveTabValue(nextProps);
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

    isUserProfilePath(pathname) {
        const regex = new RegExp(`/profile/${this.props.profile.id}$`);
        if (pathname && pathname.match(regex)) {
            return true;
        }
        return false;
    }

    resolveTabValue(props) {
        const { pathname } = props;
        if (pathname === '/') {
            this.setState({tabValue: TABS.SEARCH});
        } else if (this.isUserProfilePath(pathname)) {
            this.setState({tabValue: TABS.USER_PROFILE});
        } else {
            this.setState({tabValue: 'none'});
        }
    }

    handleChange(value, event, tab) {
        const { transitionTo } = this.context.router;
        switch(value) {
        case TABS.SEARCH:
            transitionTo('/');
            break;
        case TABS.USER_PROFILE:
            routeToProfile(this.context.router, this.props.profile);
            break;
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
