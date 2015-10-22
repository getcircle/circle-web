import { AppBar } from 'material-ui';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React, { PropTypes } from 'react/addons';

import * as selectors from '../selectors';

import CSSComponent from '../components/CSSComponent';
import HeaderMenu from '../components/HeaderMenu';

const selector = createSelector(
    [selectors.searchSelector],
    (searchState) => {
        return {
            active: searchState.get('active'),
        }
    }
)

@connect(selector)
class Header extends CSSComponent {

    static propTypes = {
        actionsContainer: React.PropTypes.element,
        dispatch: PropTypes.func.isRequired,
        managesTeam: PropTypes.object,
        organization: PropTypes.object.isRequired,
        profile: PropTypes.object.isRequired,
    }

    static contextTypes = {
        mixins: PropTypes.object.isRequired,
        router: PropTypes.shape({
            transitionTo: PropTypes.func.isRequired,
        }).isRequired,
    }

    shouldComponentUpdate(nextProps) {
        if (!nextProps.authenticated) {
            return false;
        }
        return true;
    }

    classes() {
        return {
            default: {
                AppBar: {
                    style: {
                        paddingLeft: 0,
                        paddingRight: 0,
                        boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, .10)',
                        position: 'fixed',
                    },
                    titleStyle: {
                        display: 'flex',
                    },
                },
                headerContainer: {
                    paddingBottom: 64,
                    position: 'relative',
                    zIndex: 10,
                },
                HeaderMenu: {
                    style: {
                        'display': 'flex',
                        'alignSelf': 'center',
                    },
                },
                image: {
                    alignSelf: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    maxHeight: 64,
                    maxWidth: '100%',
                },
                logoContainer: {
                    display: 'flex',
                },
                menuContainer: {
                    'display': 'flex',
                },
                root: {
                    display: 'flex',
                    flexWrap: 'nowrap',
                    width: '100%',
                },
                headerActionsContainer: {
                    display: 'flex',
                },
            },
        };
    }

    getImageUrl() {
        const { organization } = this.props;
        if (organization) {
            return organization.image_url;
        }
    }

    renderHeader() {
        const { router } = this.context;
        return (
            <div className="row" is="root">
                <div className="col-xs-2" is="logoContainer">
                    <img
                        is="image"
                        onTouchTap={() => router.transitionTo('/')}
                        src={this.getImageUrl()}
                    />
                </div>
                <div className="col-xs-8 center-xs" is="headerActionsContainer">
                    {this.props.actionsContainer}
                </div>
                <div className="col-xs-2 end-xs" is="menuContainer">
                    <HeaderMenu
                        dispatch={this.props.dispatch}
                        expandedView={false}
                        is="HeaderMenu"
                        managesTeam={this.props.managesTeam}
                        profile={this.props.profile}
                    />
                </div>
            </div>
        );
    }

    render() {
        return (
            <header is="headerContainer">
                <AppBar
                    is="AppBar"
                    showMenuIconButton={false}
                    title={this.renderHeader()}
                />
            </header>
        );
    }
}

export default Header;
