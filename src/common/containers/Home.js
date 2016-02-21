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
        return {
            'default': {
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
                poweredBy: {
                    fontSize: '10px',
                    lineHeight: '14px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    ...fontColors.extraLight,
                    ...fontWeights.semiBold,
                },
                poweredBySection: {
                    paddingTop: 20,
                },
                root: {
                    height: '100%',
                    paddingBottom: 20,
                    width: '100%',
                },
                searchSection: {
                    paddingLeft: 20,
                    paddingRight: 20,
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
                        <div>
                            <Link to="/explore/people">{t('People')}</Link>
                            <Link to="/explore/knowledge">{t('Knowledge')}</Link>
                            <Link to="/explore/teams">{t('Teams')}</Link>
                        </div>
                    </section>
                    <section style={this.styles().searchSection}>
                        <HomeSearch className="row center-xs" />
                        <div className="row center-xs" style={this.styles().poweredBySection}>
                            <span style={this.styles().poweredBy}>{t('Built by Luno. Powered by you.')}</span>
                        </div>
                    </section>
                </section>
            </div>
        );
    }
}

export default Home;
