import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import { fontColors, fontWeights, } from '../constants/styles';
import t from '../utils/gettext';

import CSSComponent from '../components/CSSComponent';
import InternalPropTypes from '../components/InternalPropTypes';
import HeaderMenu from '../components/HeaderMenu';
import HomeSearch from '../components/HomeSearch';
import { SEARCH_CONTAINER_WIDTH } from '../components/AutoComplete';

const ORGANIZATION_LOGO_HEIGHT = 200;

@connect()
class Home extends CSSComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
    }

    static contextTypes = {
        auth: InternalPropTypes.AuthContext.isRequired,
        device: InternalPropTypes.DeviceContext.isRequired,
        mixins: PropTypes.object,
        muiTheme: PropTypes.object.isRequired,
    }

    styles() {
        const { largerDevice, mobileOS } = this.context.device;
        return this.css({
            searchHeader: largerDevice || !mobileOS,
        });
    }

    classes() {
        const { muiTheme } = this.context;
        return {
            'default': {
                exploreLink: {
                    fontSize: '1.4rem',
                    lineHeight: '1.7rem',
                    letterSpacing: '1.27px',
                    fontWeight: muiTheme.luno.fontWeights.black,
                    textDecoration: 'none',
                    padding: '0 15px',
                    textTransform: 'uppercase',
                },
                header: {
                    display: 'none',
                },
                organizationLogo: {
                    alignSelf: 'center',
                    maxHeight: ORGANIZATION_LOGO_HEIGHT,
                    maxWidth: SEARCH_CONTAINER_WIDTH,
                },
                organizationLogoSection: {
                    paddingTop: '20vh',
                    paddingBottom: '2vh',
                },
                organizationLogoPlaceholder: {
                    height: ORGANIZATION_LOGO_HEIGHT,
                },
                root: {
                    backgroundColor: muiTheme.luno.colors.offWhite,
                    height: '100vh',
                    paddingBottom: 20,
                    width: '100vw',
                },
                searchSection: {
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingTop: 50,
                },
                wrap: {
                    position: 'relative',
                },
            },
            searchHeader: {
                header: {
                    display: 'block',
                    position: 'relative',
                },
                HeaderMenu: {
                    style: {
                        paddingTop: 22,
                        paddingRight: 22,
                    },
                },
                organizationLogoSection: {
                    paddingTop: '2vh',
                },
            }
        };
    }

    getOrganizationImage() {
        const { organization } = this.context.auth;
        const imageUrl = organization.image_url;
        if (imageUrl) {
            return (
                <div style={this.styles().organizationLogoPlaceholder}>
                    <img className="row" src={imageUrl} style={this.styles().organizationLogo} />
                </div>
            );
        } else {
            return <div style={this.styles().organizationLogoPlaceholder} />;
        }
    }

    render() {
        return (
            <div style={this.styles().root}>
                <header style={this.styles().header}>
                    <div className="row end-xs">
                        <HeaderMenu dispatch={this.props.dispatch} {...this.styles().HeaderMenu} />
                    </div>
                </header>
                <section className="wrap" style={this.styles().wrap}>
                    <section style={this.styles().organizationLogoSection}>
                        <div>
                            <div className="row center-xs">
                                {this.getOrganizationImage()}
                            </div>
                        </div>
                        <div className="row center-xs">
                            <Link
                                className="explore-link"
                                style={this.styles().exploreLink}
                                to="/explore/people"
                            >
                                {t('People')}
                            </Link>
                            <Link
                                className="explore-link"
                                style={this.styles().exploreLink}
                                to="/explore/knowledge"
                            >
                                {t('Knowledge')}
                            </Link>
                            <Link
                                className="explore-link"
                                style={this.styles().exploreLink}
                                to="/explore/teams"
                            >
                                {t('Teams')}
                            </Link>
                        </div>
                    </section>
                    <section style={this.styles().searchSection}>
                        <HomeSearch className="row center-xs" />
                    </section>
                </section>
            </div>
        );
    }
}

export default Home;
