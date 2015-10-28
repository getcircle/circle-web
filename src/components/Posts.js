import { IconButton, IconMenu, Tabs, Tab } from 'material-ui';
import MenuItem from 'material-ui/lib/menus/menu-item';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import CurrentTheme from '../utils/ThemeManager';
import { fontColors, fontWeights } from '../constants/styles';
import moment from '../utils/moment';
import { routeToEditPost, routeToNewPost, routeToPosts, routeToPost } from '../utils/routes';
import t from '../utils/gettext';

import CardList from './CardList';
import CardListItem from './CardListItem';
import CardRow from './CardRow';
import CSSComponent from './CSSComponent';
import DetailContent from './DetailContent';
import IconContainer from './IconContainer';
import MoreVerticalIcon from './MoreVerticalIcon';
import RoundedButton from './RoundedButton';

const { PostStateV1 } = services.post.containers;

class Posts extends CSSComponent {

    static propTypes = {
        largerDevice: PropTypes.bool.isRequired,
        onDeletePostCallback: PropTypes.func.isRequired,
        postState: PropTypes.string,
        posts: PropTypes.arrayOf(
            PropTypes.instanceOf(services.post.containers.PostV1)
        ),
    }

    static contextTypes = {
        router: PropTypes.shape({
            transitionTo: PropTypes.func.isRequired,
        }).isRequired,
    }

    static childContextTypes = {
        muiTheme: PropTypes.object,
    }

    state = {
        muiTheme: CurrentTheme,
    }

    getChildContext() {
        return {
            muiTheme: this.state.muiTheme,
        };
    }

    componentWillMount() {
        this.customizeTheme(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.customizeTheme(nextProps);
    }

    classes() {
        return {
            default: {
                cardListItemInnerDivStyle: {
                    background: 'transparent',
                    borderBottom: '1px solid rgba(0, 0, 0, .1)',
                    padding: 30,
                },
                emptyStateMessageContainer: {
                    height: '100%',
                    minHeight: '50vh',
                    width: '100%',
                    ...fontColors.light,
                },
                IconContainer: {
                    iconStyle: {
                        height: 24,
                        width: 24,
                    },
                    rootStyle: {
                        border: 0,
                        borderRadius: 0,
                        height: 24,
                        left: 0,
                        position: 'relative',
                        top: 0,
                        width: 24,
                    },
                    stroke: 'rgba(0, 0, 0, 0.1)',
                    strokeWidth: 1,
                },
                pageHeaderContainer: {
                    padding: '10px 0 50px 0',
                    width: '100%',
                },
                pageHeaderText: {
                    fontSize: 36,
                    fontWeight: 300,
                    ...fontColors.dark,
                },
                listInnerContainer: {
                    padding: 0,
                },
                primaryTextStyle: {
                    marginBottom: 5,
                },
                tabsContainer: {
                    borderBottom: '1px solid rgba(0, 0, 0, .1)',
                    width: '100%',
                },
                tabInkBarStyle: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    height: 1,
                },
                tab: {
                    fontSize: 12,
                    letterSpacing: '1px',
                    padding: '0 25px',
                    textTransform: 'uppercase',
                    ...fontWeights.semiBold,
                },
            },
        };
    }

    customizeTheme(props) {
        let customTabsTheme = Object.assign({}, CurrentTheme, {
            tab: {
                textColor: CurrentTheme.tab.textColor,
                selectedTextColor: 'rgba(0, 0, 0, 0.8)',
            },
            tabs: {
                backgroundColor: 'transparent',
            },
        });

        this.setState({muiTheme: customTabsTheme});
    }

    // Event Handlers

    onAddPostTapped() {
        routeToNewPost(this.context.router);
    }

    onPostTapped(post) {
        if (post.state === PostStateV1.DRAFT || !post.state) {
            routeToEditPost(this.context.router, post);
        } else if (post.state === PostStateV1.LISTED) {
            routeToPost(this.context.router, post);
        }
    }

    onTabChange(value, event, tab) {
        routeToPosts(this.context.router, value);
    }


    getEmptyStateMessage() {
        const {
            postState,
        } = this.props;

        if (postState === PostStateV1.DRAFT.toString()) {
            return t('You haven’t created any knowledge yet.');
        } else if (postState === PostStateV1.LISTED.toString()) {
            return t('You haven’t published any knowledge yet.');
        }
    }

    // Render Methods

    renderMoreButton() {
        return (
            <IconButton tooltip={t('More Actions')} touch={true}>
                <IconContainer
                    IconClass={MoreVerticalIcon}
                    is="IconContainer"
                />
            </IconButton>
        );
    }

    renderRightMenu(post) {
        const {
            onDeletePostCallback,
        } = this.props;

        return (
            <IconMenu iconButtonElement={this.renderMoreButton()}>
                <MenuItem onTouchTap={routeToEditPost.bind(null, this.context.router, post)} primaryText={t('Edit')} />
                <MenuItem onTouchTap={() => onDeletePostCallback(post)} primaryText={t('Delete')} />
            </IconMenu>
        );
    }

    renderPost(post) {
        const lastUpdatedText = `${t('Last updated')} ${moment(post.changed).fromNow()}`;
        return (
            <CardListItem
                innerDivStyle={{...this.styles().cardListItemInnerDivStyle}}
                onTouchTap={() => this.onPostTapped(post)}
                primaryText={post.title}
                primaryTextStyle={{...this.styles().primaryTextStyle}}
                rightIconButton={this.renderRightMenu(post)}
                secondaryText={lastUpdatedText}
            />
        );
    }

    renderPosts() {
        const {
            posts,
        } = this.props;

        if (posts.length) {
            const postElements = posts.map((post, index) => {
                return this.renderPost(post);
            });

            return (
                <CardList className="row">
                    <div className="col-xs" is="listInnerContainer">
                        {postElements}
                    </div>
                </CardList>
            );
        } else {
            return (
                <p className="row center-xs middle-xs" is="emptyStateMessageContainer">
                    {this.getEmptyStateMessage()}
                </p>
            );
        }
    }

    render() {
        const {
            postState,
        } = this.props;

        return (
            <DetailContent>
                <CardRow>
                    <div className="row start-xs between-xs" is="pageHeaderContainer">
                        <div>
                            <h3 is="pageHeaderText">{t('My Knowledge')}</h3>
                        </div>
                        <div>
                            <RoundedButton
                                label={t('Add Knowledge')}
                                onTouchTap={::this.onAddPostTapped}
                            />
                        </div>
                    </div>
                    <div className="row" is="tabsContainer">
                        <Tabs
                            inkBarStyle={{...this.styles().tabInkBarStyle}}
                            valueLink={{value: postState, requestChange: this.onTabChange.bind(this)}}
                        >
                            <Tab
                                label={t('Published')}
                                style={{...this.styles().tab}}
                                value={PostStateV1.LISTED.toString()}
                            />
                            <Tab
                                label={t('Drafts')}
                                style={{...this.styles().tab}}
                                value={PostStateV1.DRAFT.toString()}
                            />
                        </Tabs>
                    </div>
                    {this.renderPosts()}
                </CardRow>
            </DetailContent>
        );
    }
}

export default Posts;
