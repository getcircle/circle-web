import React, { PropTypes } from 'react';
import { services } from 'protobufs';
import { TextField } from 'material-ui';

import moment from '../utils/moment';
import t from '../utils/gettext';

import Card from './Card';
import CharacterCounter from './CharacterCounter';
import StyleableComponent from './StyleableComponent';


const characterLimit = 140

const styles = {
    contentStyle: {
        display: 'flex',
        flexDirection: 'row',
        padding: 20,
    },
    dateBox: {
        borderRadius: 2,
        border: '1px solid rgba(0, 0, 0, 0.1)',
        height: 72,
        width: 72,
        marginRight: 20,
    },
    date1: {
        display: 'block',
        fontSize: 24,
        paddingTop: 15,
        lineHeight: '29px',
        letterSpacing: '1px',
        fontWeight: 300,
    },
    date2: {
        display: 'block',
        fontSize: 10,
        lineHeight: '12px',
        letterSpacing: '2px',
    },
    statusContainer: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
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
    text: {
        color: 'rgba(0, 0, 0, 0.4)',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
}

const STATES = {
    INIT: 'INIT',
    EDITING: 'EDITING',
    SAVING: 'SAVING',
    DONE: 'DONE',
}

class ProfileDetailStatus extends StyleableComponent {

    static propTypes = {
        isEditable: PropTypes.bool,
        onSaveCallback: PropTypes.func,
        status: PropTypes.instanceOf(services.profile.containers.ProfileStatusV1).isRequired,
        style: PropTypes.object,
    }

    constructor(props) {
        super(props);
        this.state = {
            type: STATES.INIT,
            value: '',
        };
    }

    componentWillMount() {
        this._setInitialState();
    }

    componentWillReceiveProps(nextProps, nextState) {
        let currentStatusValue = this.props.status ? this.props.status.value : '';
        let newStatusValue = nextProps.status ? nextProps.status.value : '';
        if (currentStatusValue != newStatusValue && this.state.type === STATES.EDITING) {
            this.setState({
                type: STATES.DONE,
                value: newStatusValue,
            });
        }
    }

    _setInitialState() {
        const {
            status,
        } = this.props;

        this.setState({
            type: STATES.INIT,
            value: status ? status.value : '',
        });
    }

    _handleEditTapped() {
        const {
            status,
        } = this.props;

        this.setState({
            type: STATES.EDITING,
            value: status ? status.value : '',
        });

        if (this.refs.statusTextField) {
            this.refs.statusTextField.focus();
        }
    }

    _handleSaveTapped() {
        let finalStatusValue = this.state.value;

        if (finalStatusValue.length > characterLimit && this.refs.statusTextField) {
            this.refs.statusTextField.setErrorText(t('Status can only be up to ' + characterLimit + ' characters'));
            return;
        }
        else {
            this.refs.statusTextField.setErrorText('');
        }

        const {
            onSaveCallback
        } = this.props;

        if (typeof onSaveCallback != 'undefined') {
            onSaveCallback(finalStatusValue);
        }
    }

    _handleCancelTapped() {
        this._setInitialState();
    }

    _handleChange(event) {
        this.setState({
            type: STATES.EDITING,
            value: event.target.value
        });
    }

    _renderStatusTimestamp(createdString) {
        if (createdString !== '') {
            return (
                <span style={this.mergeAndPrefix(styles.statusTimestamp)}>&nbsp;&ndash;&nbsp;{createdString}</span>
            );
        }
    }

    _renderContent() {
        const {
            isEditable,
            status,
        } = this.props;

        let created = status ? moment(status.created).fromNow() : '';
        let statusValue = status ? '"' + this.state.value + '"' : '';
        if (statusValue == '' || statusValue.length == 0) {
            statusValue = isEditable ? t('Add details') : t('Ask me!');
        }

        return (
            <div style={this.mergeAndPrefix(styles.statusContainer)}>
                <span style={this.mergeAndPrefix(styles.statusText)}>{statusValue}</span>
                {this._renderStatusTimestamp(created)}
            </div>
        );
    }

    _renderEditableContent() {
        let value = this.state.value
        return (
            <div style={this.mergeAndPrefix(styles.statusTextareaContainer)}>
                <TextField
                    fullWidth={true}
                    hintText={t('I\'m working on #project with @mypeer!')}
                    multiLine={true}
                    onChange={this._handleChange.bind(this)}
                    ref='statusTextField'
                    value={value}
                 />
                 <CharacterCounter
                    counterLimit={characterLimit}
                    counterValue={characterLimit - value.length}
                 />
            </div>
        );
    }

    render() {
        const {
            status,
            style,
            isEditable,
            ...other
        } = this.props;

        let state = this.state.type;
        return (
            <Card
                {...other}
                contentStyle={styles.contentStyle}
                isEditable={isEditable}
                isEditing={state === STATES.EDITING ? true : false}
                onCancelTapped={this._handleCancelTapped.bind(this)}
                onEditTapped={this._handleEditTapped.bind(this)}
                onSaveTapped={this._handleSaveTapped.bind(this)}
                style={this.mergeAndPrefix(style)}
                title={t('Currently Working On')}
            >
                {state == STATES.EDITING ? this._renderEditableContent() : this._renderContent()}
            </Card>
        );
    }
}

export default ProfileDetailStatus;
