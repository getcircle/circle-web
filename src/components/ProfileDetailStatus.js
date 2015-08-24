import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import moment from '../utils/moment';

import Card from './Card';
import CharacterCounter from './CharacterCounter';
import StyleableComponent from './StyleableComponent';
import t from '../utils/gettext';

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
        editable: PropTypes.bool,
        onSaveCallback: PropTypes.func,
        status: PropTypes.instanceOf(services.profile.containers.ProfileStatusV1).isRequired,
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

    _handleEditClick() {
        const {
            status,
        } = this.props;

        this.setState({
            type: STATES.EDITING,
            value: status ? status.value : '',
        });
    }

    _handleSaveClick() {
        let finalStatusValue = this.state.value;

        const {
            onSaveCallback
        } = this.props;

        if (typeof onSaveCallback != 'undefined') {
            onSaveCallback(finalStatusValue);
        }
    }

    _handleCancelClick() {
        this._setInitialState();
    }

    _handleChange(event) {
        this.setState({
            type: STATES.EDITING,
            value: event.target.value
        });
    }

    _renderContent() {
        const {
            status
        } = this.props;

        let created = status ? moment(status.created).fromNow() : '';
        let statusValue = this.state.value;
        if (statusValue == '' || statusValue.length == 0) {
            statusValue = t('Ask me!');
        }

        return (
            <div style={this.mergeAndPrefix(styles.statusContainer)}>
                <span style={this.mergeAndPrefix(styles.statusText)}>&ldquo;{statusValue}&rdquo;</span>
                <span style={this.mergeAndPrefix(styles.statusTimestamp)}>&nbsp;&ndash;&nbsp;{created}</span>
            </div>
        );
    }

    _renderEditableContent() {
        let value = this.state.value
        return (
            <div style={this.mergeAndPrefix(styles.statusTextareaContainer)}>
                <textarea
                    onChange={this._handleChange.bind(this)}
                    placeholder={t('I\'m working on #project with @mypeer!')}
                    style={this.mergeAndPrefix(styles.statusTextarea)}
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
            editable,
            ...other
        } = this.props;

        let state = this.state.type;
        return (
            <Card
                {...other}
                contentStyle={styles.contentStyle}
                editable={editable}
                editing={state === STATES.EDITING ? true : false}
                onCancelClick={this._handleCancelClick.bind(this)}
                onEditClick={this._handleEditClick.bind(this)}
                onSaveClick={this._handleSaveClick.bind(this)}
                style={this.mergeAndPrefix(style)}
                title={t('Currently Working On')}
            >
                {state == STATES.EDITING ? this._renderEditableContent() : this._renderContent()}
            </Card>
        );
    }
}

export default ProfileDetailStatus;
