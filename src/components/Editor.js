import React, { PropTypes } from 'react';
import { services } from 'protobufs';
import { default as MediumEditor } from 'react-medium-editor';

import { fontColors } from '../constants/styles';
import { routeToProfile } from '../utils/routes';
import t from '../utils/gettext';

import CardList from './CardList';
import CardListItem from './CardListItem';
import CSSComponent from './CSSComponent';
import DetailContent from './DetailContent';
import ProfileAvatar from './ProfileAvatar';

class Editor extends CSSComponent {

    static propTypes = {
        largerDevice: PropTypes.bool.isRequired,
        onSaveCallback: PropTypes.func.isRequired,
        post: PropTypes.instanceOf(services.post.containers.PostV1),
    }

    static defaultProps = {
        post: null,
    }

    static contextTypes = {
        authenticatedProfile: PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
        router: PropTypes.shape({
            transitionTo: PropTypes.func.isRequired,
        }).isRequired,
    }

    state = {
        title: '',
        body: '',
    }

    componentWillMount() {
        this.mergeStateAndProps(this.props);
    }

    componentWillReceiveProps(nextProps, nextState) {
        this.mergeStateAndProps(nextProps);
    }

    saveTimeout = null

    classes() {
        return {
            default: {
                section: {
                    marginTop: 5,
                },
                contentContainer: {
                    marginTop: '20px',
                    marginLeft: '16px',
                },
                postTitle: {
                    background: 'transparent',
                    border: '0',
                    fontWeight: '700',
                    fontStyle: 'normal',
                    fontSize: '40px',
                    lineHeight: '1.15',
                    letterSpacing: '-0.02em',
                    marginBottom: '20px',
                    outline: 'none',
                    width: '100%',
                    ...fontColors.dark,
                },
                cardList: {
                    background: 'transparent',
                },
                cardListItemInnerDivStyle: {
                    height: 72,
                    paddingLeft: 72,
                    paddingTop: 20,
                    paddingBottom: 16,
                },
                cardListAvatar: {
                    height: 40,
                    width: 40,
                    top: '16px',
                },
            },
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
        // Update state with props only if this the intial load
        // or if the post object is changed.
        // This is to ensure we do not over-write the real time state changes caused by
        // user typing their post
        if (props.post && (!this.props.post || this.props.post.id !== props.post.id)) {
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
            title: event.target.value,
        }, () => this.saveData());
    }

    handleBodyChange(bodyText) {
        this.setState({
            body: bodyText,
        }, () => this.saveData());
    }

    // Render Methods

    render() {
        let author = this.context.authenticatedProfile;
        let editorOptions = {
            autoLink: true,
            imageDragging: false,
            placeholder: {
                text: t('Type your text'),
            },
            toolbar: {
                buttons: ['bold', 'italic', 'anchor'],
            },
        };

        return (
            <DetailContent>
                <CardList className="row" is="cardList">
                    <CardListItem
                        innerDivStyle={{...this.styles().cardListItemInnerDivStyle}}
                        leftAvatar={<ProfileAvatar is="cardListAvatar" profile={author} />}
                        onTouchTap={routeToProfile.bind(null, this.context.router, author)}
                        primaryText={author.full_name}
                        secondaryText={author.title}
                    />
                </CardList>
                <div className="row">
                    <div className="col-xs">
                        <div className="box" is="contentContainer">
                            <input
                                autoFocus="true"
                                is="postTitle"
                                name="title"
                                onChange={::this.handleTitleChange}
                                placeholder={t('Title')}
                                text={this.state.title}
                                type="text"
                            />
                            <MediumEditor
                                className="leditor"
                                onChange={::this.handleBodyChange}
                                options={editorOptions}
                                text={this.state.body}

                            />
                        </div>
                    </div>
                </div>
            </DetailContent>
        );
    }
}

export default Editor;
