import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { LinearProgress } from 'material-ui';

import { createTeam } from '../actions/teams';
import { fontColors, fontWeights } from '../constants/styles';
import * as messageTypes from '../constants/messageTypes';
import { PAGE_TYPE } from '../constants/trackerProperties';
import * as selectors from '../selectors';
import t from '../utils/gettext';

import CSSComponent from  './CSSComponent';
import Dialog from './Dialog';
import Toast from './Toast';

const teamSelector = selectors.createImmutableSelector(
    [
        selectors.teamSelector,
    ],
    (
        teamState,
    ) => {
        return {
            error: teamState.get('error'),
            saving: teamState.get('saving'),
        };
    }
);


@connect(teamSelector, undefined, undefined, {withRef: true})
class CreateTeamForm extends CSSComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
    };

    componentWillMount() {
        this.resetState();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({saving: nextProps.saving});

        if (this.props.saving && !nextProps.saving) {
            if (nextProps.error === '') {
                this.refs.modal.dismiss();
            } else {
                const error = nextProps.error ? 'Error creating team' : '';
                this.setState({error: error});
                this.refs.modal.setSaveEnabled(true);
            }
        }
    }

    resetState() {
        this.setState({
            description: '',
            error: '',
            name: '',
            saving: false,
        });
    }

    show() {
        this.refs.modal.show();
    }

    classes() {
        return {
            default: {
                formContainer: {
                    backgroundColor: 'rgb(255, 255, 255)',
                    padding: 0,
                    width: '100%',
                },
                form: {
                    padding: '0 16px 16px 16px',
                },
                input: {
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '3px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    fontSize: 14,
                    height: '50px',
                    lineHeight: '14px',
                    outline: 'none',
                    padding: '10px',
                    width: '100%',
                    ...fontColors.dark,
                },
                textarea: {
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '3px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    fontSize: 14,
                    height: '100px',
                    lineHeight: '14px',
                    outline: 'none',
                    padding: '10px',
                    width: '100%',
                    ...fontColors.dark,
                },
                sectionTitle: {
                    fontSize: 11,
                    letterSpacing: '1px',
                    lineHeight: '11px',
                    margin: '16px 0',
                    textAlign: 'left',
                    textTransform: 'uppercase',
                    ...fontColors.light,
                    ...fontWeights.semiBold,
                },
            },
            'error': {
                textarea: {
                    borderColor: 'rgba(255, 0, 0, 0.7)',
                },
            },
        };
    }

    validate() {
        const requiredFieldsToTitle = {
            'name': 'Team Name'
        };

        for (let requiredField in requiredFieldsToTitle) {
            if (!this.state[requiredField] || this.state[requiredField].trim() === '') {
                this.setState({
                    'error': t(requiredFieldsToTitle[requiredField] + ' cannot be empty.'),
                });
                return false;
            }
        }

        this.setState({
            'error': '',
        });
        return true;
    }

    handleChange(event) {
        let updatedState = {};
        if (this.state[event.target.name] !== undefined) {
            updatedState[event.target.name] = event.target.value;
            // Reset state on any key change
            updatedState.error = '';
        } else {
            logger.error('Received change event for untracked input.');
            return;
        }

        this.setState(updatedState);
    }

    handleSaveTapped() {
        if (!this.validate()) {
            return;
        }

        const { name, description } = this.state;
        this.props.dispatch(createTeam(name, description));
    }

    renderProgressIndicator() {
        if (this.props.saving) {
            return (
                <LinearProgress mode="indeterminate" />
            );
        }
    }

    renderToast() {
        if (this.state.error.trim() !== '') {
            return (
                <Toast
                    message={this.state.error}
                    messageType={messageTypes.ERROR}
                />
            );
        }
    }

    renderContent() {
        const { saving } = this.props;
        const { description, name } = this.state;

        return (
            <div className="col-xs center-xs" style={this.styles().formContainer}>
                {this.renderProgressIndicator()}
                {this.renderToast()}
                <form style={this.styles().form}>
                    <div style={this.styles().sectionTitle}>{t('Team Name')}</div>
                    <input
                        disabled={saving}
                        name="name"
                        onChange={this.handleChange.bind(this)}
                        placeholder={t('Marketing, IT, etc.')}
                        style={this.styles().input}
                        type="text"
                        value={name}
                     />
                    <div style={this.styles().sectionTitle}>{t('Description')}</div>
                    <textarea
                        disabled={saving}
                        name="description"
                        onChange={this.handleChange.bind(this)}
                        placeholder={t('What are the responsibilities or the purpose of this team?')}
                        style={this.styles().textarea}
                        type="text"
                        value={description}
                    ></textarea>
                </form>
            </div>
        );
    }

    render() {
        return (
            <div >
                <Dialog
                    dialogDismissLabel={t('Cancel')}
                    dialogSaveLabel={t('Save')}
                    onRequestClose={this.resetState.bind(this)}
                    onSave={this.handleSaveTapped.bind(this)}
                    pageType={PAGE_TYPE.CREATE_TEAM}
                    ref="modal"
                    repositionOnUpdate={false}
                    title={t('Create Team')}
                    {...this.styles().Dialog}
                >
                    <div className="row center-xs">
                        {this.renderContent()}
                    </div>
                </Dialog>
            </div>
        );
    }
}

export default CreateTeamForm;
