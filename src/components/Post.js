import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { fontColors } from '../constants/styles';
import moment from '../utils/moment';
import { routeToProfile } from '../utils/routes';
import t from '../utils/gettext';

import CardList from './CardList';
import CardListItem from './CardListItem';
import CSSComponent from './CSSComponent';
import DetailContent from './DetailContent';
import ProfileAvatar from './ProfileAvatar';

class Post extends CSSComponent {

    static propTypes = {
        header: PropTypes.element,
        isEditable: PropTypes.bool.isRequired,
        largerDevice: PropTypes.bool.isRequired,
        onSaveCallback: PropTypes.func.isRequired,
        post: PropTypes.instanceOf(services.post.containers.PostV1),
    }

    static contextTypes = {
        authenticatedProfile: PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
        router: PropTypes.shape({
            transitionTo: PropTypes.func.isRequired,
        }).isRequired,
    }

    static defaultProps = {
        isEditable: false,
        post: null,
    }

    state = {
        editing: false,
        title: '',
        body: '',
    }

    componentWillMount() {
        this.mergeStateAndProps(this.props);
    }

    componentWillReceiveProps(nextProps, nextState) {
        this.mergeStateAndProps(nextProps);
        // Reset editing if a new post is loaded
        if (this.props.post && nextProps.post && this.props.post.id !== nextProps.post.id) {
            this.setState({editing: false});
        }
    }

    saveTimeout = null

    classes() {
        return {
            default: {
                cardListAvatar: {
                    height: 40,
                    width: 40,
                    top: '16px',
                    left: 0,
                },
                cardList: {
                    background: 'transparent',
                    marginBottom: 20,
                },
                cardListItemInnerDivStyle: {
                    height: 72,
                    paddingLeft: 56,
                    paddingTop: 20,
                    paddingBottom: 16,
                },
                contentContainer: {
                    marginTop: '20px',
                    marginLeft: '16px',
                },
                lastUpdatedText: {
                    fontSize: 14,
                    margin: '10px 0 5px 0',
                    width: '100%',
                    ...fontColors.light,
                },
                postContent: {
                    background: 'transparent',
                    border: 0,
                    color: 'rgba(0, 0, 0, 0.8)',
                    fontSize: '21px',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    lineHeight: '1.58',
                    minHeight: '100vh',
                    outline: 0,
                    resize: 'none',
                    width: '100%',
                },
                postTitle: {
                    background: 'transparent',
                    border: '0',
                    fontWeight: '400',
                    fontStyle: 'normal',
                    fontSize: '36px',
                    lineHeight: '1.15',
                    marginBottom: '20px',
                    outline: 'none',
                    width: '100%',
                    ...fontColors.dark,
                },
                section: {
                    marginTop: 5,
                },
            },
            'isEditable-false': {
                postTitle: {
                    margin: 0,
                },
                postContent: {
                    whiteSpace: 'pre-wrap',
                },
            }
        };
    }

    /**
     * Merges editable or dynamic properties into state.
     *
     * This is primarily done to support editing.
     * All initial and updated values are captured in the state and these are read by elements for rendering.
     * This also makes the values in props a reliable restore point for cancellation.
     *
     * @param {Object} props
     * @return {Void}
     */
    mergeStateAndProps(props) {
        // Update state with props only when editing hasn't started
        // This is to ensure we do not over-write the real time state changes caused by
        // user typing their post
        if (props.post && !this.state.editing) {
            let updatedState = {
                title: props.post.title,
                body: props.post.content,
            };

            this.setState(updatedState);
        }
    }

    saveData() {
        if (this.saveTimeout !== null) {
            window.clearTimeout(this.saveTimeout);
        }

        this.saveTimeout = window.setTimeout(() => {
            this.props.onSaveCallback(this.state.title, this.state.body);
        }, 500);
    }

    // Change Methods

    handleTitleChange(event) {
        this.setState({
            editing: true,
            title: event.target.value,
        }, () => this.saveData());
    }

    handleBodyChange(event) {
        this.setState({
            editing: true,
            body: event.target.value,
        }, () => this.saveData());
    }

    // Render Methods

    renderReadonlyContent() {
        const {
            post
        } = this.props;

        if (!post) {
            return;
        }

        const author = post.by_profile;
        const lastUpdatedText = ` \u2013 ${t('Last updated')} ${moment(post.changed).fromNow()}`;
        return (
            <span>
                <h1 is="postTitle">{post.title}</h1>
                <div className="row" is="lastUpdatedText">{lastUpdatedText}</div>
                <CardList is="cardList">
                    <CardListItem
                        innerDivStyle={{...this.styles().cardListItemInnerDivStyle}}
                        leftAvatar={<ProfileAvatar is="cardListAvatar" profile={author} />}
                        onTouchTap={routeToProfile.bind(null, this.context.router, author)}
                        primaryText={author.full_name}
                        secondaryText={author.title}
                    />
                </CardList>
                <div is="postContent">{post.content}</div>
            </span>
        );
    }

    renderEditableContent() {
        return (
            <span>
                <input
                    autoFocus="true"
                    is="postTitle"
                    name="title"
                    onChange={::this.handleTitleChange}
                    placeholder={t('Title')}
                    type="text"
                    value={this.state.title}
                />
                <textarea
                    is="postContent"
                    onChange={::this.handleBodyChange}
                    placeholder={t('Contribute Knowledge')}
                    value={this.state.body}
                />
            </span>
        );
    }

    renderContent() {
        const {
            isEditable,
        } = this.props;

        if (isEditable) {
            return this.renderEditableContent();
        } else {
            return this.renderReadonlyContent();
        }
    }

    render() {
        const {
            header,
        } = this.props;

        return (
            <DetailContent>
                {header}
                <div className="row">
                    <div className="col-xs">
                        <div className="box" is="contentContainer">
                            {this.renderContent()}
                        </div>
                    </div>
                </div>
            </DetailContent>
        );
    }
}

export default Post;
