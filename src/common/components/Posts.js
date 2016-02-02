import { CircularProgress, Dialog, FlatButton, IconButton, IconMenu, ListItem } from 'material-ui';
import Infinite from 'react-infinite';
import MenuItem from 'material-ui/lib/menus/menu-item';

import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { canvasColor, fontColors } from '../constants/styles';
import moment from '../utils/moment';
import { PostStateURLString } from '../utils/post';
import { routeToEditPost, routeToPost } from '../utils/routes';
import tracker from '../utils/tracker';
import t from '../utils/gettext';

import CSSComponent from './CSSComponent';
import IconContainer from './IconContainer';
import InternalPropTypes from './InternalPropTypes';
import MoreHorizontalIcon from './MoreHorizontalIcon';

const { PostStateV1 } = services.post.containers;

class Posts extends CSSComponent {

    static propTypes = {
        forProfile: InternalPropTypes.ProfileV1,
        loading: PropTypes.bool,
        onDeletePostCallback: PropTypes.func,
        postState: PropTypes.string,
        posts: PropTypes.arrayOf(
            PropTypes.instanceOf(services.post.containers.PostV1)
        ),
        postsLoadMore: PropTypes.func.isRequired,
        showContent: PropTypes.bool,
        showEditDelete: PropTypes.bool,
    }

    static defaultProps = {
        onDeletePostCallback: () => {},
        showContent: false,
        showEditDelete: false,
    }

    static contextTypes = {
        history: PropTypes.shape({
            pushState: PropTypes.func.isRequired,
        }).isRequired,
    }

    state = {
        loading: false,
        postToBeDeleted: null,
        showConfirmDeleteModal: false,
    }

    classes() {
        return {
            default: {
                cardListItemInnerDivStyle: {
                    borderBottom: '1px solid rgba(200, 200, 200, .3)',
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
                loadingIndicatorContainer: {
                    padding: '20px 0',
                },
                loadingIndicator: {
                    backgroundColor: canvasColor,
                },
                postContent: {
                    ...fontColors.dark,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                },
                primaryTextStyle: {
                    lineHeight: '25px',
                    marginBottom: 5,
                },
            },
            'showContent-true': {
                primaryTextStyle: {
                    fontSize: '21px',
                    fontWeight: '600',
                    lineHeight: '35px',
                }
            }
        };
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
            forProfile,
            postState,
        } = this.props;

        if (postState === PostStateURLString.DRAFT.toString()) {
            return t('You have no draft knowledge posts.');
        } else if (postState === PostStateURLString.LISTED.toString()) {
            if (forProfile && forProfile.first_name) {
                return t(forProfile.first_name + ' hasn’t published any knowledge yet.');
            } else {
                return t('You haven’t published any knowledge yet.');
            }
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
        const {
            showEditDelete,
        } = this.props;

        if (this.state.showConfirmDeleteModal && showEditDelete) {
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
        const {
            showEditDelete,
        } = this.props;

        if (showEditDelete) {
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
        const {
            showContent,
        } = this.props;

        const lastUpdatedText = `${t('Last updated')} ${moment(post.changed).fromNow()}`;
        let secondaryText = lastUpdatedText;
        let secondaryTextLines = 1;
        if (showContent) {
            secondaryText = (
                <div>
                    <div className="row" style={this.styles().postContent}>{`${post.snippet}\u2026`}</div>
                    <div>{lastUpdatedText}</div>
                </div>
            );
            secondaryTextLines = 2;
        }

        return (
            <ListItem
                innerDivStyle={{...this.styles().cardListItemInnerDivStyle}}
                key={post.id}
                onTouchTap={() => this.onPostTapped(post)}
                primaryText={<span style={{...this.styles().primaryTextStyle}}>{post.title}</span>}
                rightIconButton={this.renderRightMenu(post)}
                secondaryText={secondaryText}
                secondaryTextLines={secondaryTextLines}
            />
        );
    }

    render() {
        const {
            loading,
            showContent,
            posts,
        } = this.props;

        if (posts.length) {
            const postElements = posts.map((post, index) => {
                return this.renderPost(post);
            });

            const elementHeight = showContent ? 136 : 107;
            return (
                <div className="row full-width" style={this.styles().infiniteListContainer}>
                    <Infinite
                        className="col-xs no-padding"
                        elementHeight={elementHeight}
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
            return (
                <div style={this.styles().loadingIndicatorContainer}>
                    <img src="/images/posts_placeholder.png" />
                </div>
            );
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
