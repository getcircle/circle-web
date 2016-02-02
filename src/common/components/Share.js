import React, { PropTypes } from 'react';

import { Menu, MenuItem, Popover, Snackbar } from 'material-ui';

import { copyUrl } from '../utils/clipboard';
import { fontColors, tintColor } from '../constants/styles';
import { SHARE_METHOD } from '../constants/trackerProperties';
import t from '../utils/gettext';

import DownArrowIcon from './DownArrowIcon';
import CSSComponent from './CSSComponent';
import IconContainer from './IconContainer';
import MenuGetLinkIcon from './MenuGetLinkIcon';
import MenuMailIcon from './MenuMailIcon';
import RoundedButton from './RoundedButton';

class Share extends CSSComponent {

    static propTypes = {
        mailToHref: PropTypes.string.isRequired,
        onShareCallback: PropTypes.func.isRequired,
        urlShareSource: PropTypes.string,
    }

    static defaultProps = {
        mailToHref: '',
        onShareCallback: () => {},
    }

    state = {
        menuOpen: false,
        snackbarOpen: false,
    }

    componentClickAway() {
        this.hideMenu();
    }

    classes() {
        return {
            default: {
                arrowIcon: {
                    height: 6,
                    width: 10,
                },
                arrowContainer: {
                    display: 'inline-block',
                    border: 0,
                    height: 6,
                    left: 'inherit',
                    right: 10,
                    position: 'relative',
                    top: -1,
                    width: 10,
                },
                MenuIconContainer: {
                    style: {
                        border: 0,
                        height: 24,
                        width: 24,
                        top: 6,
                        left: 20,
                    },
                    iconStyle: {
                        height: 24,
                        width: 24,
                    },
                    strokeWidth: 1,
                },
                MenuItem: {
                    innerDivStyle: {
                        color: 'rgba(0, 0, 0, 0.7)',
                        fontSize: 14,
                        padding: '0px 16px 0px 60px',
                        textAlign: 'left',
                    },
                    style: {
                        lineHeight: '36px',
                    }
                },
                ShareIconContainer: {
                    rootStyle: {
                        border: 0,
                        height: 24,
                        position: 'static',
                        width: 24,
                    },
                    iconStyle: {
                        height: 24,
                        width: 24,
                    },
                    strokeWidth: 1,
                },
                ShareButton: {
                    style: {
                        marginLeft: 5,
                        textAlign: 'left',
                    },
                },
                Snackbar: {
                    bodyStyle: {
                        minWidth: 'inherit',
                    },
                },
            },
        };
    }

    hideMenu(event) {
        this.setState({menuOpen: false});
    }

    renderShareMenu() {
        if (this.state.menuOpen) {
            const {
                mailToHref,
                onShareCallback,
                urlShareSource,
            } = this.props;

            return (
                <Menu
                    desktop={true}
                    onEscKeyDown={::this.hideMenu}
                    onItemTouchTap={::this.hideMenu}
                    width={110}
                >
                    <MenuItem
                        desktop={true}
                        href={mailToHref}
                        leftIcon={<IconContainer
                            IconClass={MenuMailIcon}
                            stroke="rgba(0, 0, 0, 0.7)"
                            {...this.styles().MenuIconContainer}
                        />}
                        onTouchTap={() => {
                            onShareCallback(SHARE_METHOD.EMAIL);
                        }}
                        primaryText={t('Share by Email')}
                        target="_blank"
                        {...this.styles().MenuItem}
                    />
                    <MenuItem
                        desktop={true}
                        leftIcon={<IconContainer
                            IconClass={MenuGetLinkIcon}
                            stroke="rgba(0, 0, 0, 0.7)"
                            {...this.styles().MenuIconContainer}
                        />}
                        onTouchTap={() => {
                            copyUrl(urlShareSource);
                            this.setState({snackbarOpen: true});
                            onShareCallback(SHARE_METHOD.COPY_LINK);
                        }}
                        primaryText={t('Copy Link')}
                        {...this.styles().MenuItem}
                    />
                </Menu>
            );
        }
    }

    render() {
        return (
            <div ref="anchor">
                <RoundedButton
                    label={t('Share')}
                    onTouchTap={() => {
                        this.setState({
                            menuOpen: !this.state.menuOpen,
                        });
                    }}
                    {...this.styles().ShareButton}
                >
                    <IconContainer
                        IconClass={DownArrowIcon}
                        iconStyle={{...this.styles().arrowIcon}}
                        stroke={tintColor}
                        style={this.styles().arrowContainer}
                    />
                </RoundedButton>
                <Snackbar
                    autoHideDuration={2000}
                    message={t('Link copied to clipboard!')}
                    onRequestClose={() => {this.setState({snackbarOpen: false})}}
                    open={this.state.snackbarOpen}
                    ref="snackbar"
                    {...this.styles().Snackbar}
                />
                <div className="row middle-xs end-xs full-width">
                    <Popover
                        anchorEl={this.refs.anchor}
                        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                        onRequestClose={() => { this.setState({menuOpen: false})}}
                        open={this.state.menuOpen}
                        targetOrigin={{vertical: 'top', horizontal: 'right'}}
                    >
                        {this.renderShareMenu()}
                    </Popover>
                </div>
            </div>
        );
    }
}

export default Share;
