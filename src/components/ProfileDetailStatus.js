import React, { PropTypes } from 'react';
import { services } from 'protobufs';

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

class ProfileDetailStatus extends StyleableComponent {

    static propTypes = {
        isEditable: PropTypes.bool,
        onSaveCallback: PropTypes.func.isRequired,
        status: PropTypes.instanceOf(services.profile.containers.ProfileStatusV1),
        style: PropTypes.object,
    }

    componentWillMount() {
        this.setInitialState();
    }

    componentWillReceiveProps(nextProps, nextState) {
        let statusValue = this.props.status ? this.props.status.value : '';
        let createdValueTimestamp = this.props.status ? this.props.status.created : '';
        this.setState({
            editing: false,
            error: '',
            value: statusValue,
            valueTimestamp: createdValueTimestamp,
        });
    }

    state = {
        editing: false,
        error: '',
        value: '',
        valueTimestamp: '',
    }

    setInitialState() {
        let statusValue = this.props.status ? this.props.status.value : '';
        let createdValueTimestamp = this.props.status ? this.props.status.created : '';

        this.setState({
            editing: false,
            error: '',
            value: statusValue,
            valueTimestamp: createdValueTimestamp,
        });
    }

    handleEditTapped() {
        this.setState({
            editing: true,
            error: '',
            value: this.state.value,
            valueTimestamp: this.state.valueTimestamp
        });
    }

    handleSaveTapped() {
        let finalStatusValue = this.state.value;

        if (finalStatusValue.length > CHARACTER_LIMIT) {
            this.setState({
                editing: true,
                error: t('Status can only be up to ' + CHARACTER_LIMIT + ' characters'),
                value: this.state.value,
                valueTimestamp: this.state.valueTimestamp
            });

            return;
        }

        this.setState({
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
        this.setInitialState();
    }

    handleChange(event) {
        this.setState({
            editing: true,
            error: '',
            value: event.target.value,
            valueTimestamp: this.state.valueTimestamp
        });
    }

    renderStatusTimestamp(createdString) {
        if (createdString !== '') {
            return (
                <span style={this.mergeAndPrefix(styles.statusTimestamp)}>&nbsp;&ndash;&nbsp;{createdString}</span>
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

        let created = this.state.valueTimestamp ? moment(this.state.valueTimestamp).fromNow() : '';
        let statusValue = this.state.value !== '' ? '"' + this.state.value + '"' : '';
        if (statusValue === '' || statusValue.length === 0) {
            statusValue = isEditable ? t('Add details') : t('Ask me!');
        }

        return (
            <div style={this.mergeAndPrefix(styles.statusContainer)}>
                <span style={this.mergeAndPrefix(styles.statusText)}>{statusValue}</span>
                {this.renderStatusTimestamp(created)}
            </div>
        );
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
                    ref='statusTextField'
                    style={this.mergeAndPrefix(styles.statusTextarea, error == '' ? {} : styles.statusTextareaError)}
                    value={value}
                 />
                 <div style={this.mergeAndPrefix(styles.errorAndCounterContainer)}>
                    <span style={this.mergeAndPrefix(styles.errorContent)}>
                        {error}
                    </span>
                    <CharacterCounter
                        counterLimit={CHARACTER_LIMIT}
                        counterValue={CHARACTER_LIMIT - value.length}
                    />
                </div>
            </div>
        );
    }

    render() {
        const {
            style,
            isEditable,
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
                title={t('Currently Working On')}
            >
                {this.renderContent()}
            </Card>
        );
    }
}

export default ProfileDetailStatus;
