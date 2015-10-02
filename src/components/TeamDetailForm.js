import { LinearProgress } from 'material-ui';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { fontColors, fontWeights } from '../constants/styles';
import { PAGE_TYPE } from '../constants/trackerProperties';
import t from '../utils/gettext';
import tracker from '../utils/tracker';

import CSSComponent from  './CSSComponent';
import Dialog from './Dialog';

const { DescriptionV1 } = services.common.containers;

class TeamDetailForm extends CSSComponent {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        onSaveCallback: PropTypes.func.isRequired,
        team: PropTypes.instanceOf(services.organization.containers.TeamV1).isRequired,
    }

    state = {
        name: '',
        description: '',
        saving: false,
    }

    componentWillMount() {
        this.mergeStateAndProps(this.props);
    }

    componentWillReceiveProps(nextProps, nextState) {
        this.mergeStateAndProps(nextProps);
    }

    classes() {
        return {
            'default': {
                errorContainer: {
                    display: 'none',
                    justifyContent: 'space-between',
                    padding: '10px 10px 10px 0',
                },
                errorMessage: {
                    color: 'rgba(255, 0, 0, 0.7)',
                    fontSize: 13,
                },
                formContainer: {
                    backgroundColor: 'rgb(255, 255, 255)',
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    width: '100%',
                },
                form: {
                    padding: '0 16px 16px 16px',
                },
                input: {
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '4px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    fontSize: 14,
                    height: '50px',
                    outline: 'none',
                    padding: '10px',
                    width: '100%',
                    ...fontColors.dark,
                },
                textarea: {
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '4px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    fontSize: 14,
                    height: '200px',
                    outline: 'none',
                    padding: '10px',
                    resize: 'none',
                    width: '100%',
                    ...fontColors.dark,
                },
                sectionTitle: {
                    fontSize: 11,
                    letterSpacing: '2px',
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
            name: props ? props.team.name : '',
            description: this.getTeamDescription(props),
        });
    }

    getTeamDescription(props) {
        if (props && props.team && props.team.description) {
            return props.team.description.value;
        }

        return '';
    }

    // Public Methods

    show() {
        this.refs.modal.show();
    }

    dismiss() {
        this.refs.modal.dismiss();
    }

    handleChange(event) {
        let updatedState = {};
        let value = event.target.value;
        switch (event.target.name) {
            case 'teamName':
                updatedState.name = value;
                break;

            case 'teamDescription':
                updatedState.description = value;
                break;

            default:
                break;
        }

        this.setState(updatedState);
    }

    updateTeam() {
        // TODO:
        // Add validation
        // Handle contact methods correctly

        const {
            team,
            onSaveCallback,
        } = this.props;

        let teamDescriptionV1 = new DescriptionV1({
            value: this.state.description,
        });

        let updatedTeam = Object.assign({}, team, {
            name: this.state.name,
            description: teamDescriptionV1,
        });

        let fieldsChanged = this.getFieldsThatChanged();
        if (fieldsChanged.length > 0) {
            tracker.trackTeamUpdate(
                this.props.team.id,
                fieldsChanged
            );
        }

        onSaveCallback(updatedTeam);
        // Need to reset state before dismissing because these
        // components can be cached and carry state.
        this.setState({
            imageFiles: [],
            saving: false,
        });
        this.refs.modal.setSaveEnabled(true);
        this.dismiss();
    }

    getFieldsThatChanged() {
        let fields = [];
        let team = this.props.team;
        ['name', 'description'].map((field) => {
            if (this.state[field] !== team[field]) {
                fields.push(field);
            }
        });

        return fields;
    }

    handleSaveTapped() {
        // Disable Save button
        this.refs.modal.setSaveEnabled(false);
        this.setState({saving: true});
        this.updateTeam();
    }

    renderProgressIndicator() {
        if (this.state.saving) {
            return (
                <LinearProgress mode="indeterminate" />
            );
        }
    }

    renderContent() {
        let error = '';

        return (
            <div is="formContainer">
                {this.renderProgressIndicator()}
                <form is="form">
                    <div is="sectionTitle">{t('Team Name')}</div>
                    <input
                        disabled={this.state.saving}
                        is="input"
                        name="teamName"
                        onChange={this.handleChange.bind(this)}
                        placeholder={t('Add a name for your team')}
                        type="text"
                        value={this.state.name}
                     />
                     <div is="errorContainer">
                        <span is="errorMessage">
                            {error}
                        </span>
                    </div>
                    <div is="sectionTitle">{t('Description')}</div>
                    <textarea
                        disabled={this.state.saving}
                        is="textarea"
                        name="teamDescription"
                        onChange={this.handleChange.bind(this)}
                        placeholder={t('What is your team responsible for? Your team description should help your' +
                         ' fellow coworkers understand if members of your team can answer their questions.')}
                        type="text"
                        value={this.state.description}
                     />
                     <div is="errorContainer">
                        <span is="errorMessage">
                            {error}
                        </span>
                    </div>
                </form>
            </div>
        );
    }

    render() {
        const {
            ...other
        } = this.props;

        return (
            <div >
                <Dialog
                    dialogDismissLabel={t('Cancel')}
                    dialogSaveLabel={t('Save')}
                    is="Dialog"
                    onSave={this.handleSaveTapped.bind(this)}
                    pageType={PAGE_TYPE.EDIT_TEAM}
                    ref="modal"
                    repositionOnUpdate={false}
                    title={t('Edit Team')}
                >
                    <div className="row center-xs">
                        {this.renderContent()}
                    </div>
                </Dialog>
            </div>
        );
    }
}

export default TeamDetailForm;
