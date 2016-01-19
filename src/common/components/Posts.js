import { CircularProgress, Dialog, FlatButton, IconButton, IconMenu, ListItem } from 'material-ui';
import Infinite from 'react-infinite';
import MenuItem from 'material-ui/lib/menus/menu-item';
import mui from 'material-ui';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import CurrentTheme from '../utils/ThemeManager';
import { canvasColor, fontColors } from '../constants/styles';
import moment from '../utils/moment';
import { PostStateURLString } from '../utils/post';
import { routeToEditPost, routeToPost } from '../utils/routes';
import tracker from '../utils/tracker';
import t from '../utils/gettext';

import CSSComponent from './CSSComponent';
import CenterLoadingIndicator from './CenterLoadingIndicator';
import IconContainer from './IconContainer';
import MoreHorizontalIcon from './MoreHorizontalIcon';

const { PostStateV1 } = services.post.containers;

class Posts extends CSSComponent {

    static propTypes = {
        loading: PropTypes.bool,
        onDeletePostCallback: PropTypes.func,
        postState: PropTypes.string,
        posts: PropTypes.arrayOf(
            PropTypes.instanceOf(services.post.containers.PostV1)
        ),
        postsLoadMore: PropTypes.func.isRequired,
    }

    static defaultProps = {
        onDeletePostCallback: () => {},
    }

    static contextTypes = {
        history: PropTypes.shape({
            pushState: PropTypes.func.isRequired,
        }).isRequired,
    }

    static childContextTypes = {
        muiTheme: PropTypes.object,
    }

    state = {
        loading: false,
        muiTheme: CurrentTheme,
        postToBeDeleted: null,
        showConfirmDeleteModal: false,
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
                    borderBottom: '1px solid rgba(0, 0, 0, .1)',
                    padding: 30,
                },
                deleteDialog: {
                    ...fontColors.dark,
                    fontSize: 14,
                },
                emptyStateMessageContainer: {
                    fontSize: '1.6rem',
                    height: '100%',
                    lineHeight: '25px',
                    minHeight: '50vh',
                    whiteSpace: 'pre-wrap',
                    width: '100%',
                    ...fontColors.light,
                },
                IconButton: {
                    style: {
                        top: 18,
                        right: 10,
                    }
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
                    stroke: 'rgba(0, 0, 0, 0.3)',
                    strokeWidth: 1,
                },
                infiniteListContainer: {
                    backgroundColor: '#FFF',
                },
                MenuItem: {
                    innerDivStyle: {
                        fontSize: 12,
                        ...fontColors.light,
                    },
                    style: {
                        lineHeight: '30px',
                    },
                },
                ModalPrimaryActionButton: {
                    labelStyle: {
                        color: 'rgba(255, 0, 0, 0.7)',
                    },
                },
                loadingIndicator: {
                    backgroundColor: canvasColor,
                },
                primaryTextStyle: {
                    lineHeight: '25px',
                    marginBottom: 5,
                },
            },
        };
    }

    customizeTheme(props) {
        let customTheme = mui.Styles.ThemeManager.modifyRawThemePalette(CurrentTheme, {
            canvasColor: 'rgb(255, 255, 255)',
        });

        this.setState({muiTheme: customTheme});
    }

    // Event Handlers

    onPostTapped(post) {
        if (post.state === PostStateV1.DRAFT || !post.state) {
            routeToEditPost(this.context.history, post);
        } else if (post.state === PostStateV1.LISTED) {
            routeToPost(this.context.history, post);
        }
    }

    getEmptyStateMessage() {
        const {
            postState,
        } = this.props;

        if (postState === PostStateURLString.DRAFT.toString()) {
            return t('You have no draft knowledge posts.');
        } else if (postState === PostStateURLString.LISTED.toString()) {
            return t('You haven’t published any knowledge yet.');
        }
    }

    onDeleteButtonTapped(post) {
        this.setState({
            showConfirmDeleteModal: true,
            postToBeDeleted: post,
        });
    }

    onModalCancelTapped() {
        this.hideConfirmDeleteModal();
    }

    onModalDeleteTapped() {
        if (this.state.postToBeDeleted) {
            this.props.onDeletePostCallback(this.state.postToBeDeleted);
            tracker.trackPostRemoved(
                this.state.postToBeDeleted.id,
                this.state.postToBeDeleted.state
            );
        }

        this.hideConfirmDeleteModal();
    }

    handleInfiniteLoad() {
        const {
            postsLoadMore,
        } = this.props;

        if (postsLoadMore) {
            postsLoadMore();
        }
    }

    hideConfirmDeleteModal() {
        this.setState({
            showConfirmDeleteModal: false,
            postToBeDeleted: null,
        });
    }

    // Render Methods

    renderDeleteModal() {
        if (this.state.showConfirmDeleteModal) {
            const dialogActions = [
                (<FlatButton
                    key="cancel"
                    label={t('Cancel')}
                    onTouchTap={::this.onModalCancelTapped}
                    secondary={true}
                />),
                (<FlatButton
                    key="delete"
                    label={t('Delete')}
                    onTouchTap={::this.onModalDeleteTapped}
                    primary={true}
                    {...this.styles().ModalPrimaryActionButton}
                />)
            ];
            return (
                <Dialog
                    actions={dialogActions}
                    bodyStyle={this.styles().deleteDialog}
                    defaultOpen={true}
                    open={true}
                    title={t('Delete Post?')}
                >
                    {t('Please confirm you want to delete this post. This action cannot be undone.')}
                </Dialog>
            );
        }
    }

    renderMoreButton() {
        return (
            <IconButton
                {...this.styles().IconButton}
                tooltip={t('More Actions')}
                touch={true}
            >
                <IconContainer
                    IconClass={MoreHorizontalIcon}
                    {...this.styles().IconContainer}
                />
            </IconButton>
        );
    }

    renderRightMenu(post) {
        return (
            <IconMenu iconButtonElement={this.renderMoreButton()}>
                <MenuItem
                    onTouchTap={routeToEditPost.bind(null, this.context.history, post)}
                    primaryText={t('Edit')}
                    {...this.styles().MenuItem}
                />
                <MenuItem
                    onTouchTap={() => this.onDeleteButtonTapped(post)}
                    primaryText={t('Delete')}
                    {...this.styles().MenuItem}
                />
            </IconMenu>
        );
    }

    renderLoadingIndicator() {
        if (this.props.loading) {
            return (
                <div className="row center-xs" key="loading-indicator" style={this.styles().loadingIndicator}>
                    <CircularProgress mode="indeterminate" size={0.5} />
                </div>
            );
        }
    }

    renderPost(post) {
        const lastUpdatedText = `${t('Last updated')} ${moment(post.changed).fromNow()}`;
        return (
            <ListItem
                innerDivStyle={{...this.styles().cardListItemInnerDivStyle}}
                key={post.id}
                onTouchTap={() => this.onPostTapped(post)}
                primaryText={<span style={{...this.styles().primaryTextStyle}}>{post.title}</span>}
                rightIconButton={this.renderRightMenu(post)}
                secondaryText={lastUpdatedText}
            />
        );
    }

    render() {
        const {
            loading,
            posts,
        } = this.props;

        if (posts.length) {
            const postElements = posts.map((post, index) => {
                return this.renderPost(post);
            });

            return (
                <div className="row full-width" style={this.styles().infiniteListContainer}>
                    <Infinite
                        className="col-xs no-padding"
                        elementHeight={107}
                        infiniteLoadBeginEdgeOffset={20}
                        isInfiniteLoading={this.props.loading}
                        key="infinite-results"
                        loadingSpinnerDelegate={::this.renderLoadingIndicator()}
                        onInfiniteLoad={::this.handleInfiniteLoad}
                        useWindowAsScrollContainer={true}
                    >
                        {postElements}
                    </Infinite>
                    {this.renderDeleteModal()}
                </div>
            );
        } else if (loading) {
            return <CenterLoadingIndicator />;
        } else {
            return (
                <p className="row center-xs middle-xs" style={this.styles().emptyStateMessageContainer}>
                    {this.getEmptyStateMessage()}
                </p>
            );
        }
    }
}

export default Posts;
