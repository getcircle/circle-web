import { AppBar } from 'material-ui';
import React, { PropTypes } from 'react';

import CSSComponent from '../components/CSSComponent';
import HeaderMenu from '../components/HeaderMenu';

class Header extends CSSComponent {

    static propTypes = {
        actionsContainer: React.PropTypes.element,
        dispatch: PropTypes.func.isRequired,
        managesTeam: PropTypes.object,
        organization: PropTypes.object.isRequired,
        profile: PropTypes.object.isRequired,
    }

    static contextTypes = {
        flags: PropTypes.object,
        mixins: PropTypes.object.isRequired,
        history: PropTypes.shape({
            pushState: PropTypes.func.isRequired,
        }).isRequired,
        showCTAsInHeader: PropTypes.bool,
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
                },
                headerContainer: {
                    paddingBottom: 64,
                    position: 'relative',
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
        const { history } = this.context;
        let actionsContainerClasses = 'col-xs-4 col-sm-6 col-md-7 col-lg-8 center-xs';
        let menuContainerClasses = 'col-xs-6 col-sm-4 col-md-3 col-lg-2 end-xs';

        if (this.context.showCTAsInHeader === false) {
            menuContainerClasses = 'col-xs-2 end-xs';
            actionsContainerClasses = 'col-xs-8 center-xs';
        }

        return (
            <div className="row" style={this.styles().root}>
                <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2" style={this.styles().logoContainer}>
                    <img
                        onTouchTap={() => history.pushState(null, '/')}
                        src={this.getImageUrl()}
                        style={this.styles().image}
                    />
                </div>
                <div className={actionsContainerClasses} style={this.styles().headerActionsContainer}>
                    {this.props.actionsContainer}
                </div>
                <div className={menuContainerClasses} style={this.styles().menuContainer}>
                    <HeaderMenu
                        dispatch={this.props.dispatch}
                        expandedView={false}
                        managesTeam={this.props.managesTeam}
                        profile={this.props.profile}
                        {...this.styles().HeaderMenu}
                    />
                </div>
            </div>
        );
    }

    render() {
        return (
            <header style={this.styles().headerContainer}>
                <AppBar
                    showMenuIconButton={false}
                    title={this.renderHeader()}
                    {...this.styles().AppBar}
                />
            </header>
        );
    }
}

export default Header;
