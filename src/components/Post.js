import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { detectURLsAndAddMarkup } from '../utils/string';
import { fontColors } from '../constants/styles';
import moment from '../utils/moment';
import { routeToPost, routeToProfile } from '../utils/routes';
import t from '../utils/gettext';

import AutogrowTextarea from './AutogrowTextarea';
import CardList from './CardList';
import CardListItem from './CardListItem';
import CSSComponent from './CSSComponent';
import DetailContent from './DetailContent';
import ProfileAvatar from './ProfileAvatar';
import RoundedButton from './RoundedButton';

class Post extends CSSComponent {

    static propTypes = {
        autoSave: PropTypes.bool,
        header: PropTypes.element,
        isEditable: PropTypes.bool.isRequired,
        largerDevice: PropTypes.bool.isRequired,
        onSaveCallback: PropTypes.func.isRequired,
        post: PropTypes.instanceOf(services.post.containers.PostV1),
        style: PropTypes.object,
    }

    static contextTypes = {
        authenticatedProfile: PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
        router: PropTypes.shape({
            transitionTo: PropTypes.func.isRequired,
        }).isRequired,
    }

    static defaultProps = {
        autoSave: true,
        isEditable: false,
        post: null,
    }

    state = {
        derivedTitle: false,
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
                    color: 'rgba(0, 0, 0, 0.8)',
                    fontSize: '21px',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    lineHeight: '1.58',
                    minHeight: '100vh',
                    width: '100%',
                },
                postTitle: {
                    background: 'transparent',
                    border: '0',
                    fontWeight: '400',
                    fontStyle: 'normal',
                    fontSize: '36px',
                    lineHeight: '1.5',
                    marginBottom: '20px',
                    outline: 'none',
                    width: '100%',
                    ...fontColors.dark,
                },
                publishButtonContainer: {
                    width: '100%',
                },
                section: {
                    marginTop: 5,
                },
                AutogrowTitleTextarea: {
                    textareaStyle: {
                        background: 'transparent',
                        border: '0',
                        fontWeight: '400',
                        fontStyle: 'normal',
                        fontSize: '36px',
                        lineHeight: '1.5',
                        marginBottom: '20px',
                        minHeight: 49,
                        ...fontColors.dark,
                    },
                },
                AutogrowTextarea: {
                    textareaStyle: {
                        background: 'transparent',
                        border: 0,
                        color: 'rgba(0, 0, 0, 0.8)',
                        fontSize: '21px',
                        fontStyle: 'normal',
                        fontWeight: '400',
                        lineHeight: '1.58',
                        minHeight: '50px',
                    },
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

    saveData(explicitSave) {
        if (this.props.autoSave === true) {
            if (this.saveTimeout !== null) {
                window.clearTimeout(this.saveTimeout);
            }

            this.saveTimeout = window.setTimeout(() => {
                this.props.onSaveCallback(this.state.title, this.state.body);
            }, 500);
        } else if (explicitSave === true) {
            this.props.onSaveCallback(this.state.title, this.state.body);
        }
    }

    // Getters

    getCurrentTitle() {
        return this.state.title;
    }

    getCurrentBody() {
        return this.state.body;
    }

    // Change Methods

    handleTitleChange(event, value) {
        this.setState({
            derivedTitle: false,
            editing: true,
            title: value.trimLeft(),
        }, () => this.saveData(false));
    }

    handleBodyChange(event, value) {
        const newValue = value.trimLeft();
        let modifiedState = {
            editing: true,
            body: newValue,
        };

        if (this.state.title.trim() === '' || this.state.derivedTitle === true) {
            modifiedState.title = newValue.split('.')[0].substring(0, 80);
            modifiedState.derivedTitle = true;
        }

        this.setState(modifiedState, () => this.saveData(false));
    }

    getReadOnlyContent(content) {
        return {
            __html: detectURLsAndAddMarkup(content),
        };
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
                <div dangerouslySetInnerHTML={this.getReadOnlyContent(post.content)} is="postContent" />
            </span>
        );
    }

    renderEditableContent() {
        return (
            <span>
                <AutogrowTextarea
                    autoFocus="true"
                    is="AutogrowTitleTextarea"
                    onChange={::this.handleTitleChange}
                    placeholder={t('Title')}
                    singleLine={true}
                    value={this.state.title}
                />
                <AutogrowTextarea
                    additionalHeightDelta={50}
                    is="AutogrowTextarea"
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

    renderActionButtons() {
        const {
            autoSave,
            header,
            isEditable,
            post,
        } = this.props;

        // If auto-save is false but the content is editable
        // show explicit controls.
        if (autoSave === false && isEditable === true && !header && post) {
            return (
                <div className="row end-xs" is="publishButtonContainer">
                    <RoundedButton
                        label={t('Publish')}
                        onTouchTap={() => {
                            this.saveData(true);
                            routeToPost(this.context.router, post);
                        }}
                    />
                </div>
            );
        }
    }

    render() {
        const {
            header,
            style,
        } = this.props;

        return (
            <DetailContent style={{...style}}>
                {header}
                {this.renderActionButtons()}
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
