import { FlatButton } from 'material-ui';
import React, { PropTypes } from 'react';

import { fontColors, tintColor } from '../constants/styles';
import moment from '../utils/moment';
import t from '../utils/gettext';

import Card from './Card';
import CharacterCounter from './CharacterCounter';
import CSSComponent from  './CSSComponent';

const CHARACTER_LIMIT = 140

class TextValue extends CSSComponent {

    static propTypes = {
        authorName: PropTypes.string,
        dataId: PropTypes.string,
        defaultContent: PropTypes.node,
        editedTimestamp: PropTypes.string,
        isEditable: PropTypes.bool,
        isQuoted: PropTypes.bool,
        onSaveCallback: PropTypes.func.isRequired,
        placeholder: PropTypes.string.isRequired,
        shouldLimitCharacters: PropTypes.bool,
        style: PropTypes.object,
        text: PropTypes.string,
        title: PropTypes.string,
    }

    static defaultProps = {
        authorName: '',
        dataId: '',
        text: '',
        editedTimestamp: '',
    }

    state = {
        authorName: '',
        editing: false,
        error: '',
        dataId: '',
        isNew: false,
        value: '',
        valueTimestamp: '',
    }

    componentWillMount() {
        this.mergeStateAndProps(this.props);
    }

    componentWillReceiveProps(nextProps, nextState) {
        this.mergeStateAndProps(nextProps);
    }

    styles() {
        return this.css({
          'error': !!this.state.error,
          'quoted': this.props.isQuoted,
        });
    }

    classes() {
        return {
            'default': {
                contentStyle: {
                    display: 'flex',
                    flexDirection: 'row',
                    padding: 20,
                },
                editButton: {
                    minWidth: 50,
                },
                editButtonLabel: {
                    fontSize: 11,
                    color: tintColor,
                },
                errorContainer: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 10px 10px 0',
                },
                errorMessage: {
                    color: 'rgba(255, 0, 0, 0.7)',
                    fontSize: 13,
                },
                textContainer: {
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                },
                textarea: {
                    borderColor: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '4px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    fontSize: 16,
                    height: 100,
                    lineHeight: '20px',
                    padding: '10px',
                    resize: 'none',
                    width: '100%',
                    ...fontColors.dark,
                },
                textareaContainer: {
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    width: '100%',
                },
                text: {
                    fontSize: 16,
                    lineHeight: '29px',
                    whiteSpace: 'pre-wrap',
                    ...fontColors.dark,
                },
                timestamp: {
                    fontSize: 10,
                    color: 'rgb(127, 127, 127)',
                    lineHeight: '29px',
                },
            },
            'error': {
                textarea: {
                    borderColor: 'rgba(255, 0, 0, 0.7)',
                },
            },
            'quoted': {
                text: {
                    fontStyle: 'italic',
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
        this.setState({
            authorName: props.authorName,
            dataId: props.dataId,
            editing: false,
            error: '',
            isNew: false,
            value: props.text,
            valueTimestamp: props.editedTimestamp,
        });
    }

    handleEditTapped() {
        this.setState({
            editing: true,
            isNew: false,
        });
    }

    handleNewUpdateTapped() {
        this.setState({
            authorName: '',
            editing: true,
            isNew: true,
            value: '',
            valueTimestamp: ''
        });
    }

    handleSaveTapped() {
        const {
            shouldLimitCharacters
        } = this.props;

        let finalStatusValue = this.state.value.replace(/^\s+|\s+$/g, '');
        if (shouldLimitCharacters && finalStatusValue.length > CHARACTER_LIMIT) {
            this.setState({
                error: t('Status can only be up to ' + CHARACTER_LIMIT + ' characters'),
                value: finalStatusValue,
            });

            return;
        }

        this.setState({
            editing: false,
            error: '',
            value: finalStatusValue,
        });

        const {
            onSaveCallback,
        } = this.props;
        onSaveCallback(finalStatusValue, this.state.isNew);
    }

    handleCancelTapped() {
        this.mergeStateAndProps(this.props);
    }

    handleChange(event) {
        this.setState({
            error: '',
            value: event.target.value,
        });
    }

    renderStatusTimestamp() {
        let createdString = this.state.valueTimestamp ? moment(this.state.valueTimestamp).fromNow() : '';
        let authorName = this.state.authorName ? ' by ' + this.state.authorName : '';
        if (createdString !== '') {
            return (
                <span is="timestamp">
                    &nbsp;&ndash;&nbsp;{createdString}{authorName}
                </span>
            );
        }
    }

    renderContent() {
        if (this.state.editing) {
            return this.renderEditableContent();
        } else {
            return this.renderDefaultContent();
        }
    }

    renderDefaultContent() {
        const { defaultContent, isQuoted } = this.props;

        let content;
        let statusValue = this.state.value !== '' ? isQuoted ? `"${this.state.value}"` : this.state.value : '';
        const hasStatus = statusValue !== '' || statusValue.length !== 0;
        if (!hasStatus) {
            statusValue = t('Add details');
        }
        content = <span is="text">{statusValue}</span>;
        if (!hasStatus && defaultContent) {
            content = defaultContent;
        }

        return (
            <div is="textContainer">
                {content}
                <div className="row middle-xs start-xs">
                    <div>
                        {this.renderStatusTimestamp()}
                    </div>
                    <div>
                        {this.renderEditButton()}
                    </div>
                </div>
            </div>
        );
    }

    renderEditButton() {
        const {
            isEditable,
        } = this.props;

        if (isEditable === true) {
            return (
                <FlatButton
                    is="editButton"
                    label={t('Edit')}
                    labelStyle={this.styles().editButtonLabel}
                    onTouchTap={this.handleEditTapped.bind(this)}
                />
            );
        }
    }

    renderCharacterCounter(value) {
        const {
            shouldLimitCharacters,
        } = this.props;

        if (shouldLimitCharacters) {
            return (
                <CharacterCounter
                    counterLimit={CHARACTER_LIMIT}
                    counterValue={CHARACTER_LIMIT - value.length}
                />
            );
        }
    }

    renderEditableContent() {
        let value = this.state.value;
        let error = this.state.error ? this.state.error : '';

        const {
            placeholder,
        } = this.props;

        return (
            <div is="textareaContainer">
                <textarea
                    autoFocus={true}
                    is="textarea"
                    onChange={this.handleChange.bind(this)}
                    placeholder={placeholder}
                    value={value}
                 />
                 <div is="errorContainer">
                    <span is="errorMessage">
                        {error}
                    </span>
                    {this.renderCharacterCounter(value)}
                </div>
            </div>
        );
    }

    render() {
        const {
            style,
            isEditable,
            title,
            ...other
        } = this.props;

        return (
            <Card
                {...other}
                contentStyle={this.styles().contentStyle}
                editTitle={t('New Update')}
                isEditable={isEditable}
                isEditing={this.state.editing}
                onCancelTapped={this.handleCancelTapped.bind(this)}
                onEditTapped={this.handleNewUpdateTapped.bind(this)}
                onSaveTapped={this.handleSaveTapped.bind(this)}
                saveTitle={t('Post')}
                style={{...this.styles().defaultStyle, ...style}}
                title={title}
            >
                {this.renderContent()}
            </Card>
        );
    }
}

export default TextValue;
