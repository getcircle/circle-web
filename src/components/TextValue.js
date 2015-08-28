import React, { PropTypes } from 'react';

import moment from '../utils/moment';
import t from '../utils/gettext';

import Card from './Card';
import CharacterCounter from './CharacterCounter';
import StyleableComponent from './StyleableComponent';


const CHARACTER_LIMIT = 140

const styles = {
    contentStyle: {
        display: 'flex',
        flexDirection: 'row',
        padding: 20,
    },
    errorAndCounterContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 10px 10px 0',
    },
    errorContent: {
        color: 'rgba(255, 0, 0, 0.7)',
        fontSize: 13,
    },
    statusContainer: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    statusTextarea: {
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
    statusTextareaError: {
        borderColor: 'rgba(255, 0, 0, 0.7)',
    },
    statusTextareaContainer: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        width: '100%',
    },
    statusText: {
        fontSize: 21,
        color: 'rgba(0, 0, 0, 0.7)',
        lineHeight: '29px',
    },
    statusTimestamp: {
        fontSize: 15,
        color: 'rgba(0, 0, 0, 0.5)',
        lineHeight: '29px',
    },
}

export const TextValueType = {
    LOCATION_DESCRIPTION: 'LOCATION_DESCRIPTION',
    PROFILE_STATUS: 'PROFILE_STATUS',
    TEAM_DESCRIPTION: 'TEAM_DESCRIPTION',
    TEAM_STATUS: 'TEAM_STATUS',
}

class TextValue extends StyleableComponent {

    static propTypes = {
        authorName: PropTypes.string,
        editedTimestamp: PropTypes.string,
        isEditable: PropTypes.bool,
        onSaveCallback: PropTypes.func.isRequired,
        shouldLimitCharacters: PropTypes.bool,
        style: PropTypes.object,
        text: PropTypes.string,
        title: PropTypes.string,
        type: PropTypes.instanceOf(TextValueType),
    }

    componentWillMount() {
        this.setInitialState(this.props);
    }

    componentWillReceiveProps(nextProps, nextState) {
        this.setInitialState(nextProps);
    }

    state = {
        authorName: '',
        editing: false,
        error: '',
        value: '',
        valueTimestamp: '',
    }

    setInitialState(props) {
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
        this.setInitialState(this.props);
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
                <span style={this.mergeAndPrefix(styles.statusTimestamp)}>
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
        } = this.props;

        let statusValue = this.state.value !== '' ? '"' + this.state.value + '"' : '';
        if (statusValue === '' || statusValue.length === 0) {
            statusValue = isEditable ? t('Add details') : t('Ask me!');
        }

        return (
            <div style={this.mergeAndPrefix(styles.statusContainer)}>
                <span style={this.mergeAndPrefix(styles.statusText)}>{statusValue}</span>
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

        return (
            <div style={this.mergeAndPrefix(styles.statusTextareaContainer)}>
                <textarea
                    autoFocus={true}
                    onChange={this.handleChange.bind(this)}
                    placeholder={t('I\'m working on #project with @mypeer!')}
                    style={this.mergeAndPrefix(styles.statusTextarea, error === '' ? {} : styles.statusTextareaError)}
                    value={value}
                 />
                 <div style={this.mergeAndPrefix(styles.errorAndCounterContainer)}>
                    <span style={this.mergeAndPrefix(styles.errorContent)}>
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
                contentStyle={styles.contentStyle}
                isEditable={isEditable}
                isEditing={this.state.editing}
                onCancelTapped={this.handleCancelTapped.bind(this)}
                onEditTapped={this.handleEditTapped.bind(this)}
                onSaveTapped={this.handleSaveTapped.bind(this)}
                style={this.mergeAndPrefix(style)}
                title={title}
            >
                {this.renderContent()}
            </Card>
        );
    }
}

export default TextValue;
