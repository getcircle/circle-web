import { AppBar } from 'material-ui';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React, { PropTypes } from 'react/addons';

import { backgroundColors } from '../constants/styles';
import * as selectors from '../selectors';

import CSSComponent from '../components/CSSComponent';
import HeaderMenu from '../components/HeaderMenu';
import Search from '../components/SearchV2';

const selector = createSelector(
    [selectors.authenticationSelector, selectors.searchSelector],
    (authenticationState, searchState) => {
        return {
            organization: authenticationState.get('organization'),
            profile: authenticationState.get('profile'),
            active: searchState.get('active'),
        }
    }
)

@connect(selector)
class Header extends CSSComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
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

    state = {
        focused: false,
    }

    styles() {
        return this.css({
            focused: this.state.focused,
        });
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
                    height: '100%',
                    width: '100%',
                    maxHeight: 64,
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
                Search: {
                    inputContainerStyle: {
                        boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, .09)',
                    },
                    style: {
                        alignSelf: 'center',
                        justifyContent: 'center',
                        flex: 1,
                    },
                },
                searchContainer: {
                    display: 'flex',
                },
            },
            focused: {
                Search: {
                    inputContainerStyle: {
                        borderRadius: '0px',
                    },
                    focused: true,
                    resultsListStyle: {
                        height: 'initial',
                        marginTop: 1,
                        opacity: 1,
                        position: 'absolute',
                        ...backgroundColors.light,
                    },
                },
            },
        };
    }

    handleFocusSearch() {
        this.setState({focused: true});
    }

    handleBlurSearch() {
        this.setState({focused: false});
    }

    renderHeader() {
        const { router } = this.context;
        return (
            <div className="row" is="root">
                <div className="col-xs-2" is="logoContainer">
                    <img
                        is="image"
                        onTouchTap={() => router.transitionTo('/')}
                        src={this.props.organization.image_url}
                    />
                </div>
                <div className="col-xs-8 center-xs" is="searchContainer">
                    <Search
                        canExplore={false}
                        is="Search"
                        largerDevice={true}
                        onBlur={::this.handleBlurSearch}
                        onFocus={::this.handleFocusSearch}
                        organization={this.props.organization}
                    />
                </div>
                <div className="col-xs-2 end-xs" is="menuContainer">
                    <HeaderMenu
                        dispatch={this.props.dispatch}
                        expandedView={false}
                        is="HeaderMenu"
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
