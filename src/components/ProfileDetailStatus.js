import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import moment from '../utils/moment';

import Card from './Card';
import StyleableComponent from './StyleableComponent';
import t from '../utils/gettext';

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
        status: PropTypes.instanceOf(services.profile.containers.ProfileStatusV1).isRequired,
        editable: React.PropTypes.bool,
    }

    constructor(props) {
        super(props);
        this.state = {
            state: STATES.INIT,
            value: '',
        };
    }

    componentWillMount() {
        this._setInitialState();
    }

    _setInitialState() {
        const {
            status,
        } = this.props;

        this.setState({
            state: STATES.INIT,
            value: status ? status.value : '',
        });
    }

    _handleEditClick() {
        const {
            status,
        } = this.props;

        this.setState({
            state: STATES.EDITING,
            value: status ? status.value : '',
        });
    }

    _handleSaveClick() {
        let finalStatusValue = this.state.value;

        this.setState({
            state: STATES.DONE,
            value: finalStatusValue,
        });
    }

    _handleCancelClick() {
        this._setInitialState();
    }

    _handleChange(event) {
        this.setState({
            state: STATES.EDITING,
            value: event.target.value
        });
    }

    _renderContent() {
        var statusValue = this.state.value;
        if (statusValue == '' || statusValue.length == 0) {
            statusValue = t("Ask me!");
        }


        return (
            <div style={this.mergeAndPrefix(styles.statusContainer)}>
                <span style={this.mergeAndPrefix(styles.statusText)}>{statusValue}</span>
            </div>
        );
    }

    _renderEditableContent() {
        const {
            status,
        } = this.props;

        let value = this.state.value
        return (
            <div style={this.mergeAndPrefix(styles.statusTextareaContainer)}>
                <textarea
                    placeholder={t('I\'m working on #project with @mypeer!')}
                    style={this.mergeAndPrefix(styles.statusTextarea)}
                    value={value}
                    onChange={this._handleChange.bind(this)} />
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

        // TODO: Convert this to duration and display below status
        let created = status ? moment(status.created) : moment();
        let state = this.state.state;

        return (
            <Card
                {...other}
                style={this.mergeAndPrefix(style)}
                contentStyle={styles.contentStyle}
                title={t("Currently Working On")}
                editable={editable}
                editing={state == STATES.EDITING ? true : false}
                onEditClick={this._handleEditClick.bind(this)}
                onSaveClick={this._handleSaveClick.bind(this)}
                onCancelClick={this._handleCancelClick.bind(this)}
            >
                {state == STATES.EDITING ? this._renderEditableContent() : this._renderContent()}
            </Card>
        );
    }
}

export default ProfileDetailStatus;
