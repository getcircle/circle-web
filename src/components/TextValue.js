import React, { PropTypes } from 'react';

import moment from '../utils/moment';
import t from '../utils/gettext';

import Card from './Card';
import CharacterCounter from './CharacterCounter';
import CSSComponent from  './CSSComponent';

const CHARACTER_LIMIT = 140

class TextValue extends CSSComponent {

    static propTypes = {
        authorName: PropTypes.string,
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

    componentWillMount() {
        this.mergeStateAndProps(this.props);
    }

    componentWillReceiveProps(nextProps, nextState) {
        this.mergeStateAndProps(nextProps);
    }

    state = {
        authorName: '',
        editing: false,
        error: '',
        value: '',
        valueTimestamp: '',
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
                    color: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    fontSize: 16,
                    height: 100,
                    lineHeight: '20px',
                    padding: '10px',
                    resize: 'none',
                    width: '100%',
                },
                textareaContainer: {
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    width: '100%',
                },
                text: {
                    fontSize: 16,
                    color: 'rgb(0, 0, 0)',
                    lineHeight: '29px',
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
            authorName: props.authorName ? props.authorName : '',
            editing: false,
            error: '',
            value: props.text,
            valueTimestamp: props.editedTimestamp,
        });
    }

    handleEditTapped() {
        this.setState({
            authorName: this.state.authorName,
            editing: true,
            error: '',
            value: this.state.value,
            valueTimestamp: this.state.valueTimestamp
        });
    }

    handleSaveTapped() {
        const {
            shouldLimitCharacters
        } = this.props;

        let finalStatusValue = this.state.value;
        if (shouldLimitCharacters && finalStatusValue.length > CHARACTER_LIMIT) {
            this.setState({
                authorName: this.state.authorName,
                editing: true,
                error: t('Status can only be up to ' + CHARACTER_LIMIT + ' characters'),
                value: this.state.value,
                valueTimestamp: this.state.valueTimestamp
            });

            return;
        }

        this.setState({
            authorName: this.state.authorName,
            editing: false,
            error: '',
            value: this.state.value,
            valueTimestamp: this.state.valueTimestamp
        });

        const {
            onSaveCallback,
        } = this.props;
        onSaveCallback(finalStatusValue);
    }

    handleCancelTapped() {
        this.mergeStateAndProps(this.props);
    }

    handleChange(event) {
        this.setState({
            authorName: this.state.authorName,
            editing: true,
            error: '',
            value: event.target.value,
            valueTimestamp: this.state.valueTimestamp
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
        const {
            isEditable,
            isQuoted,
        } = this.props;

        let statusValue = this.state.value !== '' ? isQuoted ? `"${this.state.value}"` : this.state.value : '';
        if (statusValue === '' || statusValue.length === 0) {
            statusValue = isEditable ? t('Add details') : t('Ask me!');
        }

        return (
            <div is="textContainer">
                <span is="text">{statusValue}</span>
                {this.renderStatusTimestamp()}
            </div>
        );
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
                isEditable={isEditable}
                isEditing={this.state.editing}
                onCancelTapped={this.handleCancelTapped.bind(this)}
                onEditTapped={this.handleEditTapped.bind(this)}
                onSaveTapped={this.handleSaveTapped.bind(this)}
                style={{...this.styles().defaultStyle, ...style}}
                title={title}
            >
                {this.renderContent()}
            </Card>
        );
    }
}

export default TextValue;
