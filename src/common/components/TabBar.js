import keymirror from 'keymirror';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';
import { Tabs, Tab } from 'material-ui';

import { routeToProfile } from '../utils/routes';

import CSSComponent from './CSSComponent';

const TABS = keymirror({
    SEARCH: null,
    USER_PROFILE: null,
});

class TabBar extends CSSComponent {

    static propTypes = {
        profile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
        style: PropTypes.object,
    }

    static contextTypes = {
        mixins: PropTypes.object,
        history: PropTypes.shape({
            pushState: PropTypes.func.isRequired,
        }),
        location: PropTypes.object,
    }

    state = {
        tabValue: 'none',
    }

    componentWillMount() {
        this.resolveTabValue();
    }

    componentWillReceiveProps(nextProps) {
        this.resolveTabValue();
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

    resolveTabValue() {
        const { pathname } = this.context.location;
        if (pathname === '/') {
            this.setState({tabValue: TABS.SEARCH});
        } else if (this.isUserProfilePath(pathname)) {
            this.setState({tabValue: TABS.USER_PROFILE});
        } else {
            this.setState({tabValue: 'none'});
        }
    }

    handleChange(value, event, tab) {
        switch(value) {
        case TABS.SEARCH:
            this.context.history.pushState(null, '/');
            break;
        case TABS.USER_PROFILE:
            routeToProfile(this.context.history, this.props.profile);
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
