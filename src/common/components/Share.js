import ClickAwayable from 'material-ui/lib/mixins/click-awayable';
import { decorate } from 'react-mixin';
import Menu from 'material-ui/lib/menus/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import React, { PropTypes } from 'react';
import ReactTransitionGroup from 'react-addons-transition-group';
import { Snackbar } from 'material-ui';

import autoBind from '../utils/autoBind';
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

@decorate(ClickAwayable)
@decorate(autoBind(ClickAwayable))
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
        menuDisplayed: false,
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
                        fontSize: 14,
                        padding: '0px 16px 0px 60px',
                        textAlign: 'left',
                        ...fontColors.light,
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
        this.setState({menuDisplayed: false});
    }

    render() {
        return (
            <div>
                <RoundedButton
                    label={t('Share')}
                    onTouchTap={() => {
                        this.setState({
                            menuDisplayed: !this.state.menuDisplayed,
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
                    ref='snackbar'
                    {...this.styles().Snackbar}
                />
                <div className="row middle-xs end-xs full-width" key="share-menu" style={{position: 'relative'}}>
                    <ReactTransitionGroup>
                        {this.renderShareMenu()}
                    </ReactTransitionGroup>
                </div>
            </div>
        );
    }

    renderShareMenu() {
        if (this.state.menuDisplayed) {
            const {
                mailToHref,
                onShareCallback,
                urlShareSource,
            } = this.props;

            return (
                <Menu
                    animated={true}
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
                            stroke='#757575'
                            {...this.styles().MenuIconContainer}
                        />}
                        linkButton={true}
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
                            stroke='#757575'
                            {...this.styles().MenuIconContainer}
                        />}
                        onTouchTap={() => {
                            copyUrl(urlShareSource);
                            this.refs.snackbar.show();
                            onShareCallback(SHARE_METHOD.COPY_LINK);
                        }}
                        primaryText={t('Copy Link')}
                        {...this.styles().MenuItem}
                    />
                </Menu>
            );
        }
    }
}

export default Share;
