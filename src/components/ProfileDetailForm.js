import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import Dialog from './Dialog';
import { fontColors, fontWeights } from '../constants/styles';
import t from '../utils/gettext';

import CSSComponent from  './CSSComponent';

const { ContactMethodV1 } = services.profile.containers;

class ProfileDetailForm extends CSSComponent {
    static propTypes = {
        contactMethods: PropTypes.arrayOf(
            PropTypes.instanceOf(services.profile.containers.ContactMethodV1),
        ),
        onSaveCallback: PropTypes.func.isRequired,
        profile: PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
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
                formContainer: {
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    padding: 16,
                    width: '100%',
                },
                sectionTitle: {
                    fontSize: 11,
                    letterSpacing: '2px',
                    margin: '10px 0',
                    textAlign: 'left',
                    textTransform: 'uppercase',
                    ...fontColors.light,
                    ...fontWeights.semiBold,
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
                input: {
                    borderColor: 'rgba(0, 0, 0, 0.1)',
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
        let cellNumber = '';
        if (props.contactMethods && props.contactMethods.length > 0) {
            for (let key in props.contactMethods) {
                let contactMethod = props.contactMethods[key];
                    if (contactMethod && contactMethod.contact_method_type === ContactMethodV1.ContactMethodTypeV1.CELL_PHONE) {
                        cellNumber = contactMethod.value;
                        break;
                    }
            }
        }
        this.setState({
            title: props ? props.profile.title : '',
            cellNumber: cellNumber,
        });
    }

    state = {
        title: '',
        phoneNumber: '',
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

        // TODO: Make this generic
        switch (event.target.name) {
            case 'title':
                updatedState.title = event.target.value;
                break;

            case 'cellNumber':
                updatedState.cellNumber = event.target.value;
                break;

            default:
                break;
        }

        this.setState(Object.assign({}, this.state, updatedState));
    }

    handleSaveTapped() {
        // TODO:
        // Add validation
        // Handle contact methods correctly

        const {
            profile,
            onSaveCallback,
        } = this.props;

        let contactMethods = [new ContactMethodV1({
            label: 'Cell Phone',
            value: this.state.cellNumber,
            /*eslint-disable camelcase*/
            contact_method_type: ContactMethodV1.ContactMethodTypeV1.CELL_PHONE,
            /*eslint-enable camelcase*/
        })];

        let updatedProfile = Object.assign({}, profile, {
            title:  this.state.title,
            /*eslint-disable camelcase*/
            contact_methods: contactMethods,
            /*eslint-enable camelcase*/
        });

        onSaveCallback(updatedProfile);
    }

    renderContent() {
        let error = '';

        return (
            <form is="formContainer">
                <div is="sectionTitle">Title</div>
                <input
                    is="input"
                    name="title"
                    onChange={this.handleChange.bind(this)}
                    placeholder={t('Job Title')}
                    type="text"
                    value={this.state.title}
                 />
                 <div is="errorContainer">
                    <span is="errorMessage">
                        {error}
                    </span>
                </div>
                <div is="sectionTitle">Contact</div>
                <input
                    is="input"
                    name="cellNumber"
                    onChange={this.handleChange.bind(this)}
                    placeholder={t('Add your cell number')}
                    type="text"
                    value={this.state.cellNumber}
                 />
            </form>
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
                    ref="modal"
                    repositionOnUpdate={false}
                    title={t('Edit Profile')}
                >
                    <div className="row center-xs">
                        {this.renderContent()}
                    </div>
                </Dialog>
            </div>
        );
    }
}

export default ProfileDetailForm;
